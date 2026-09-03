import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { randomUUID } from "crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { sendManualPremiumInviteEmail } from "@/lib/email";
import { logUserActivity } from "@/lib/userActivityServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function adminSecret() {
  return process.env.MANUAL_ADMIN_SECRET || process.env.MIGRATION_SECRET || "";
}

function cleanEmail(value: unknown) {
  if (typeof value !== "string") return "";
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function cleanName(value: unknown, email: string) {
  if (typeof value === "string" && value.trim()) return value.trim().slice(0, 80);
  return email.split("@")[0];
}

function authorized(req: NextRequest) {
  const expected = adminSecret();
  if (!expected) return false;
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return token === expected;
}

async function findUserByEmail(supabase: SupabaseClient, email: string) {
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const user = data.users.find((entry) => (entry.email || "").toLowerCase() === email);
    if (user) return user;
    if (data.users.length < 1000) return null;
  }
  return null;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    Sentry.captureMessage("[manual-premium-invite] unauthorized attempt", "warning");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const email = cleanEmail(body.email);
  if (!email) return NextResponse.json({ error: "invalid_email" }, { status: 400 });

  const dryRun = body.send !== true;
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  const hasSupabase = Boolean(SUPABASE_URL && SERVICE_KEY);
  if (dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      wouldUseSender: "Cleverli <hello@cleverli.ch>",
      hasResend,
      hasSupabase,
      wouldSend: hasResend && hasSupabase,
    });
  }

  if (!hasResend) {
    return NextResponse.json({ error: "resend_not_configured" }, { status: 503 });
  }
  if (!hasSupabase) {
    return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  }

  try {
    const name = cleanName(body.name, email);
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    let user = await findUserByEmail(supabase, email);
    let created = false;
    let previousProfile: {
      premium: boolean;
      premium_until: string | null;
      premium_plan: string | null;
      cancelled: boolean;
      stripe_customer_id: string | null;
      stripe_subscription_id: string | null;
    } | null = null;

    if (!user) {
      const password = randomUUID() + randomUUID();
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, source: "manual_premium_invite" },
      });
      if (error) throw error;
      user = data.user;
      created = true;
    } else {
      const { data: profile, error: profileReadError } = await supabase
        .from("parent_profiles")
        .select("premium, premium_until, premium_plan, cancelled, stripe_customer_id, stripe_subscription_id")
        .eq("id", user.id)
        .maybeSingle();
      if (profileReadError) throw profileReadError;
      previousProfile = profile ?? null;

      if (profile?.stripe_customer_id || profile?.stripe_subscription_id) {
        return NextResponse.json({ error: "existing_stripe_customer_blocked" }, { status: 409 });
      }
    }

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: "https://www.cleverli.ch/reset-password?mode=update" },
    });
    if (linkError) throw linkError;

    const passwordSetupUrl = linkData.properties?.action_link;
    if (!passwordSetupUrl) throw new Error("missing_password_setup_link");

    const premiumProfile = {
      id: user.id,
      email,
      name,
      premium: true,
      premium_until: null,
      premium_plan: "schooltime",
      cancelled: false,
      stripe_customer_id: null,
      stripe_subscription_id: null,
    };

    const { error: profileError } = await supabase.from("parent_profiles").upsert(premiumProfile, { onConflict: "id" });
    if (profileError) throw profileError;

    try {
      await sendManualPremiumInviteEmail(email, name, passwordSetupUrl, {
        idempotencyKey: `manual-premium-invite-${user.id}`,
      });
    } catch (emailError) {
      const rollback = previousProfile
        ? supabase.from("parent_profiles").update(previousProfile).eq("id", user.id)
        : supabase.from("parent_profiles").upsert({
          id: user.id,
          email,
          name,
          premium: false,
          premium_until: null,
          premium_plan: null,
          cancelled: false,
          stripe_customer_id: null,
          stripe_subscription_id: null,
        }, { onConflict: "id" });
      const { error: rollbackError } = await rollback;
      if (rollbackError) Sentry.captureException(rollbackError);
      throw emailError;
    }

    await logUserActivity({
      userId: user.id,
      activityType: "schooltime_access_started",
      source: "manual_premium_invite",
      metadata: { plan: "schooltime", grantedFree: true },
    });

    return NextResponse.json({ ok: true, created, userId: user.id, sender: "Cleverli <hello@cleverli.ch>" });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "manual_premium_invite_failed" }, { status: 500 });
  }
}
