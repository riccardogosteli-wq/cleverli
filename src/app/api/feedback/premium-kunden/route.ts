import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MAX_BODY_BYTES = 16 * 1024;

function cleanText(value: unknown, max = 1200) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}

function cleanEmail(value: unknown) {
  const email = cleanText(value, 180).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function cleanBoolean(value: unknown) {
  return value === true;
}

function cleanRating(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(number) || number < 1 || number > 5) return null;
  return number;
}

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";
}

function hashIp(req: NextRequest) {
  const salt = process.env.FEEDBACK_IP_HASH_SALT || process.env.MIGRATION_SECRET;
  if (!salt) return null;
  return crypto.createHash("sha256").update(`${salt}:${clientIp(req)}`).digest("hex");
}

export async function POST(req: NextRequest) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return NextResponse.json({ error: "feedback_not_configured" }, { status: 503 });
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (cleanText(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const email = cleanEmail(body.email);
  const rating = cleanRating(body.rating);
  const liked = cleanText(body.liked);
  const disliked = cleanText(body.disliked);
  const missing = cleanText(body.missing);
  const issues = cleanText(body.issues);
  const childReaction = cleanText(body.childReaction);
  const improvementIdea = cleanText(body.improvementIdea);

  if (!email) return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  if (!rating) return NextResponse.json({ error: "missing_rating" }, { status: 400 });
  if (!liked && !disliked && !missing && !issues && !childReaction && !improvementIdea) {
    return NextResponse.json({ error: "missing_feedback" }, { status: 400 });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const ipHash = hashIp(req);
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    let recentQuery = supabase
      .from("customer_feedback")
      .select("id")
      .gte("created_at", since)
      .limit(1);
    recentQuery = ipHash
      ? recentQuery.or(`email.eq.${email},ip_hash.eq.${ipHash}`)
      : recentQuery.eq("email", email);
    const { data: recent, error: recentError } = await recentQuery;
    if (recentError) throw recentError;
    if ((recent?.length ?? 0) > 0) {
      return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
    }

    const { error } = await supabase.from("customer_feedback").insert({
      email,
      rating,
      liked: liked || null,
      disliked: disliked || null,
      missing: missing || null,
      issues: issues || null,
      child_reaction: childReaction || null,
      improvement_idea: improvementIdea || null,
      allow_followup: cleanBoolean(body.allowFollowup),
      giveaway_opt_in: cleanBoolean(body.giveawayOptIn),
      giveaway_months: 3,
      source: cleanText(body.source, 120) || "premium_customer_feedback",
      user_agent: cleanText(req.headers.get("user-agent"), 300) || null,
      ip_hash: ipHash,
    });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    Sentry.captureException(error);
    console.error("[customer-feedback]", error);
    return NextResponse.json({ error: "feedback_failed" }, { status: 500 });
  }
}
