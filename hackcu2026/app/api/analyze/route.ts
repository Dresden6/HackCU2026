/**
 * POST /api/analyze
 *
 * Accepts (one of):
 *   { text: string }           — plain text input
 *   { url: string }            — video URL (YouTube Shorts, TikTok, Instagram Reel)
 *   multipart/form-data        — direct audio file upload (field name: "audio")
 *
 * Returns: AnalyzeResponse
 *
 * Pipeline:
 *   0. Resolve rawText from text | url | audio upload
 *   1. Parse free-text → structured ParsedTrade (LLM)
 *   2. Detect red flags (deterministic)
 *   3. Generate explanation (LLM)
 *   4. Backfill currentPrice from market data
 */

import { NextRequest, NextResponse } from "next/server";
import { parseTrade, explainTrade } from "@/lib/parser";
import { detectFlags } from "@/lib/flags";
import { getCurrentPrice, resolveTickerFromName } from "@/lib/marketData";
import { transcribeFromUrl, transcribeBuffer } from "@/lib/transcribe";
import type { AnalyzeResponse } from "@/types/trade";

export async function POST(req: NextRequest) {
  try {
    let rawText = "";
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      // ── Mode 3: direct audio file upload ──────────────────
      const form = await req.formData();
      const audioFile = form.get("audio");

      if (!audioFile || typeof audioFile === "string") {
        return NextResponse.json(
          { error: "Expected an 'audio' file in the form data." },
          { status: 400 },
        );
      }

      const arrayBuffer = await (audioFile as File).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      rawText = await transcribeBuffer(buffer, (audioFile as File).name);
    } else {
      // ── Mode 1 & 2: JSON body with text or url ─────────────
      const body = await req.json();

      if (body?.url) {
        // Mode 2: video URL → download audio → transcribe
        rawText = await transcribeFromUrl(body.url as string);
      } else if (body?.text) {
        // Mode 1: plain text (existing behaviour)
        rawText = (body.text as string).trim();
      }
    }

    if (!rawText) {
      return NextResponse.json(
        { error: "Provide one of: 'text' (string), 'url' (video link), or an 'audio' file upload." },
        { status: 400 },
      );
    }

    // 1. LLM parse
    const parsedTrade = await parseTrade(rawText);

    // 1b. If GPT wasn't confident about the ticker, resolve it via Yahoo search
    if (parsedTrade.ticker === "UNKNOWN" && parsedTrade.companyName) {
      const resolved = await resolveTickerFromName(parsedTrade.companyName);
      if (resolved) {
        console.log(
          `[analyze] Resolved "${parsedTrade.companyName}" → ${resolved} via Yahoo search`,
        );
        parsedTrade.ticker = resolved;
        parsedTrade.assumptions.push(
          `Ticker ${resolved} resolved from company name "${parsedTrade.companyName}" via market data search`,
        );
      } else {
        // Genuine fallback — couldn't find it anywhere
        parsedTrade.ticker = "SPY";
        parsedTrade.assumptions.push(
          `Could not resolve ticker for "${parsedTrade.companyName}" — defaulted to SPY`,
        );
      }
    }

    // 2. Deterministic red-flag scan
    const flags = detectFlags(rawText);

    // 3. Backfill real current price (ticker is now confirmed correct)
    try {
      parsedTrade.currentPrice = await getCurrentPrice(parsedTrade.ticker);
    } catch {
      // Non-fatal — simulation will use synthetic data
      console.warn(
        `[analyze] Could not fetch price for ${parsedTrade.ticker}`,
      );
    }

    // 4. Generate explanation — runs after ticker is fully resolved
    const explanation = await explainTrade(rawText, parsedTrade);

    const response: AnalyzeResponse = {
      rawText,
      parsedTrade,
      flags,
      explanation,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[analyze] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}
