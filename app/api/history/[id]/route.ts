/**
 * GET /api/history/[id]
 *
 * Returns the analysis document only if it belongs to the signed-in user.
 * Returns 404 (not null) when the id doesn't exist or belongs to someone else —
 * we intentionally don't distinguish between "not found" and "not yours" to
 * avoid leaking whether a document exists.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Analysis from "@/models/Analysis";
import mongoose from "mongoose";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;

    // Validate that id is a well-formed ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ item: null }, { status: 404 });
    }

    await connectDB();

    // Filter by both _id AND email — ownership enforced at query level
    const doc = await Analysis.findOne({ _id: id, email }).lean();

    if (!doc) {
      // Either doesn't exist or belongs to a different user — return 404 either way
      return NextResponse.json({ item: null }, { status: 404 });
    }

    return NextResponse.json({ item: doc });
  } catch (err) {
    console.error("[history/id] GET error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}
