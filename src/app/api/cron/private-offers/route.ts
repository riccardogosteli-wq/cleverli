import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { reconcileTrialUpgrade, warmTrialUpgrade } from "@/lib/trialUpgradeServer";
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
    // Never let a pending cancellation prevent warming the original campaign.
    const [trialUpgrade, prepared, trialPrepared] = await Promise.allSettled([reconcileTrialUpgrade(), warmPrivateOffers(), warmTrialUpgrade()]);
    if (trialUpgrade.status === "rejected" || prepared.status === "rejected" || trialPrepared.status === "rejected") {
      return NextResponse.json({ error: "private_offer_reconciliation_requires_review",
        trialPreparationFailed: trialPrepared.status === "rejected", trialUpgradeFailed: trialUpgrade.status === "rejected", preparationFailed: prepared.status === "rejected",
      }, { status: 503, headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json({ trialUpgrade: trialUpgrade.value, prepared: prepared.value, trialPrepared: trialPrepared.value }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    // Fail visibly to the cron monitor, never serialize Stripe exceptions/capabilities.
    return NextResponse.json({ error: "private_offer_preparation_failed" }, { status: 503 });
  }
}
