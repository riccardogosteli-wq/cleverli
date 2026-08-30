import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@supabase/supabase-js";

const ALLOWED_EVENTS = new Set([
  "exercise_started",
  "exercise_completed",
  "exercise_wrong_answer",
  "hint_used",
  "exercise_error",
  "paywall_shown",
  "checkout_error",
]);

const MAX_BODY_BYTES = 4096;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 120;
const buckets = new Map<string, { count: number; resetAt: number }>();

function cleanText(value: unknown, max = 120) {
  return typeof value === "string" ? value.slice(0, max) : null;
}

function cleanInt(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : null;
}

function cleanBool(value: unknown) {
  return typeof value === "boolean" ? value : null;
}

function cleanMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function requestIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "unknown";
}

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return false;

  const host = req.headers.get("host");
  if (!host) return false;

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host || originUrl.hostname.endsWith(".cleverli.ch");
  } catch {
    return false;
  }
}

function rateLimited(ip: string) {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 204 });
  }

  if (!sameOrigin(req)) {
    return new NextResponse(null, { status: 204 });
  }

  if (rateLimited(requestIp(req))) {
    Sentry.captureMessage("[telemetry] rate limited exercise events", "warning");
    return new NextResponse(null, { status: 204 });
  }

  let body: Record<string, unknown>;

  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const eventName = cleanText(body.eventName, 80);
  if (!eventName || !ALLOWED_EVENTS.has(eventName)) {
    return new NextResponse(null, { status: 204 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    Sentry.captureMessage("[telemetry] Supabase service env missing", "warning");
    return new NextResponse(null, { status: 204 });
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from("exercise_events").insert({
      event_name: eventName,
      exercise_id: cleanText(body.exerciseId),
      grade: cleanInt(body.grade),
      subject: cleanText(body.subject, 40),
      topic_id: cleanText(body.topicId),
      exercise_type: cleanText(body.exerciseType, 40),
      is_correct: cleanBool(body.isCorrect),
      attempt_index: cleanInt(body.attemptIndex),
      wrong_count_session: cleanInt(body.wrongCountSession),
      hints_used: cleanInt(body.hintsUsed),
      duration_ms: cleanInt(body.durationMs),
      topic_index: cleanInt(body.topicIndex),
      topic_total: cleanInt(body.topicTotal),
      lang: cleanText(body.lang, 8),
      path: cleanText(body.path, 160),
      anonymous_session_id: cleanText(body.anonymousSessionId),
      metadata: {
        attribution: cleanMetadata(body.attribution),
      },
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    Sentry.captureException(error);
    console.error("[telemetry/exercise]", error);
  }

  return new NextResponse(null, { status: 204 });
}
