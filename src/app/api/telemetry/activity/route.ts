import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@supabase/supabase-js";
import { logUserActivity, UserActivityType } from "@/lib/userActivityServer";

const ALLOWED_EVENTS = new Set<UserActivityType>([
  "login",
  "signup",
  "password_reset_requested",
  "password_updated",
  "exercise_started",
  "exercise_completed",
  "exercise_wrong_answer",
  "hint_used",
  "paywall_shown",
]);

const MAX_BODY_BYTES = 4096;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 80;
const buckets = new Map<string, { count: number; resetAt: number }>();

function cleanText(value: unknown, max = 160) {
  return typeof value === "string" ? value.slice(0, max) : null;
}

function cleanInt(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : null;
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

async function getTokenUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return null;

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
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
    Sentry.captureMessage("[telemetry] rate limited user activity events", "warning");
    return new NextResponse(null, { status: 204 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const activityType = cleanText(body.activityType, 80) as UserActivityType | null;
  if (!activityType || !ALLOWED_EVENTS.has(activityType)) {
    return new NextResponse(null, { status: 204 });
  }

  const user = await getTokenUser(req);
  const email = user?.email ?? cleanText(body.email, 180);

  if (!user && activityType !== "password_reset_requested") {
    return new NextResponse(null, { status: 204 });
  }

  await logUserActivity({
    userId: user?.id ?? null,
    email,
    activityType,
    path: cleanText(body.path),
    source: cleanText(body.source, 120),
    exerciseId: cleanText(body.exerciseId, 120),
    grade: cleanInt(body.grade),
    subject: cleanText(body.subject, 40),
    topicId: cleanText(body.topicId, 120),
    metadata: cleanMetadata(body.metadata),
  });

  return new NextResponse(null, { status: 204 });
}
