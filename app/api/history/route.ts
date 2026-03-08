/**
 * GET  /api/history       — list signed-in user's analyses (newest first)
 * POST /api/history       — save a completed analysis + simulation
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Analysis from "@/models/Analysis";
import type { AnalysisDocument } from "@/types/trade";

/* ── GET: list history for current user ────────────────────── */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? 50), 200);

    const docs = await Analysis.find({ email })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ items: docs });
  } catch (err) {
    console.error("[history] GET error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}

/* ── POST: save a new analysis for current user ────────────── */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const body = (await req.json()) as Partial<AnalysisDocument>;

    if (!body.rawText || !body.parsedTrade || !body.explanation) {
      return NextResponse.json(
        { error: "Missing required fields: rawText, parsedTrade, explanation" },
        { status: 400 },
      );
    }

    const doc = await Analysis.create({
      email,
      rawText: body.rawText,
      parsedTrade: body.parsedTrade,
      flags: body.flags ?? [],
      explanation: body.explanation,
      simulationResult: body.simulationResult,
    });

    return NextResponse.json({ id: doc._id, createdAt: doc.createdAt }, { status: 201 });
  } catch (err) {
    console.error("[history] POST error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}
