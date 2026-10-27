/**
 * API route: /api/visitors
 *
 * POST  { fingerprint: string }  ->  registers a unique visitor (no-op if already seen)
 * GET                            ->  returns { count: number }
 *
 * Storage goes through src/lib/store.ts: Supabase when configured, otherwise a local
 * JSON file (dev only; not persistent on serverless hosts).
 */

import { NextRequest } from "next/server";
import { addToSet, setSize } from "@/lib/store";

const KEY = "visitors";
// browsers send crypto.randomUUID(); reject anything else so the set can't be stuffed with junk
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET() {
  try {
    return Response.json({ count: await setSize(KEY) });
  } catch {
    return Response.json({ error: "Storage unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  let fingerprint: unknown;

  try {
    fingerprint = (await request.json())?.fingerprint;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof fingerprint !== "string" || !UUID.test(fingerprint)) {
    return Response.json({ error: "valid fingerprint required" }, { status: 400 });
  }

  try {
    return Response.json({ count: await addToSet(KEY, fingerprint.toLowerCase()) });
  } catch {
    return Response.json({ error: "Storage unavailable" }, { status: 503 });
  }
}
