import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { warmPrivateOffers } from "@/lib/privateOfferServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const actual = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !actual || Buffer.byteLength(expected) !== Buffer.byteLength(actual)
    || !timingSafeEqual(Buffer.from(expected), Buffer.from(actual))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json({ prepared: await warmPrivateOffers() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    // Fail visibly to the cron monitor, never serialize Stripe exceptions/capabilities.
    return NextResponse.json({ error: "private_offer_preparation_failed" }, { status: 503 });
  }
}
