"use client";
import { useState, useCallback } from "react";
import type { AnalyzeResponse, SimulateResponse, ParsedTrade } from "@/types/trade";

/* ── Generic POST hook ───────────────────────────────────────
   Returns { trigger, data, isLoading, error }
   Call trigger(body) manually — nothing fires until you call it.
────────────────────────────────────────────────────────────── */
function usePost<TBody, TResponse>(url: string) {
  const [data, setData] = useState<TResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trigger = useCallback(
    async (body: TBody): Promise<TResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const json = await res.json();

        if (!res.ok) {
          const message = json?.error ?? `HTTP ${res.status}`;
          setError(message);
          return null;
        }

        setData(json);
        return json as TResponse;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Network error";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [url],
  );

  return { trigger, data, isLoading, error };
}

/* ── Domain hooks ────────────────────────────────────────────
   These are what components actually import and use.
────────────────────────────────────────────────────────────── */

/** Parse + flag raw text or a video URL.
 *
 * Usage:
 *   const { trigger, data, isLoading, error } = useAnalyze();
 *   // call on form submit:
 *   const result = await trigger({ text: "Put 10k in TSLA calls" });
 */
export function useAnalyze() {
  return usePost<
    { text?: string; url?: string },
    AnalyzeResponse
  >("/api/analyze");
}

/** Run a Monte Carlo simulation on a parsed trade.
 *
 * Usage:
 *   const { trigger, data, isLoading, error } = useSimulate();
 *   // call after analyze succeeds:
 *   const result = await trigger({ parsedTrade });
 */
export function useSimulate() {
  return usePost<
    { parsedTrade: ParsedTrade; numSims?: number },
    SimulateResponse
  >("/api/simulate");
}
