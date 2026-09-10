import { NextRequest, NextResponse } from "next/server";
import { approvedFeedbackEmail } from "@/lib/customerFeedbackCampaign";
import { feedbackStatus } from "@/lib/customerFeedbackMail";
import * as Sentry from "@sentry/nextjs";
import { sendCustomerFeedbackRequestEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function adminSecret() {
  return process.env.MANUAL_ADMIN_SECRET || process.env.MIGRATION_SECRET || "";
}

function authorized(req: NextRequest) {
  const expected = adminSecret();
  if (!expected) return false;
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return token === expected;
}

function cleanEmail(value: unknown) {
  if (typeof value !== "string") return "";
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    Sentry.captureMessage("[customer-feedback-email] unauthorized attempt", "warning");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const email = cleanEmail(body.email);
  try { approvedFeedbackEmail(email); } catch {
    return NextResponse.json({ error: "recipient_not_approved" }, { status: 400 });
  }
  if (body.test === true) return NextResponse.json({ error: "feedback_test_send_disabled" }, { status: 400 });
  if (!email) return NextResponse.json({ error: "invalid_email" }, { status: 400 });

  const dryRun = body.send !== true;
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  if (dryRun) {
    let ledger;
    try { ledger = await feedbackStatus(email); } catch {
      return NextResponse.json({ error: "store_unavailable" }, { status: 503 });
    }
    return NextResponse.json({
      ok: true,
      dryRun: true,
      wouldUseSender: "Cleverli <hello@cleverli.ch>",
      wouldReplyTo: "hello@cleverli.ch",
      ledger,
      wouldSend: hasResend && process.env.VERCEL_ENV === "production" && ledger[0].state === "ready",
      hasResend,
    });
  }

  if (!hasResend) {
    return NextResponse.json({ error: "resend_not_configured" }, { status: 503 });
  }

  try {
    const receipt = await sendCustomerFeedbackRequestEmail(email, {
      idempotencyKey: `customer-feedback-email-${email}-${body.test === true ? "test" : "prod"}`,
      test: body.test === true,
    });

    return NextResponse.json({
      ok: true,
      providerId: receipt.id,
      email,
      sender: "Cleverli <hello@cleverli.ch>",
      replyTo: "hello@cleverli.ch",
    });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "customer_feedback_email_failed" }, { status: 500 });
  }
}
