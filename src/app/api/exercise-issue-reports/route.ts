import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@supabase/supabase-js";
import {
  EXERCISE_ISSUE_REPORTER_EMAIL,
  EXERCISE_ISSUE_REPORTER_USER_ID,
} from "@/lib/exerciseIssueReports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const buckets = new Map<string, { count: number; resetAt: number }>();

function cleanText(value: unknown, max = 300) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}

function cleanInt(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isInteger(number) ? number : null;
}

function joinParts(parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(" · ");
}

function rateLimited(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

function requestIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "unknown";
}

async function getReporter(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return { supabase: null, user: null, error: "not_configured" as const };

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { supabase: null, user: null, error: "missing_token" as const };

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { supabase, user: null, error: "invalid_token" as const };

  const email = data.user.email?.toLowerCase() ?? "";
  if (data.user.id !== EXERCISE_ISSUE_REPORTER_USER_ID || email !== EXERCISE_ISSUE_REPORTER_EMAIL) {
    return { supabase, user: data.user, error: "forbidden" as const };
  }

  return { supabase, user: data.user, error: null };
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  const reporter = await getReporter(req);
  if (reporter.error === "not_configured") return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (reporter.error) return NextResponse.json({ error: reporter.error }, { status: reporter.error === "forbidden" ? 403 : 401 });
  if (!reporter.supabase || !reporter.user) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  if (rateLimited(`${reporter.user.id}:${requestIp(req)}`)) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const grade = cleanInt(body.grade);
  const subject = cleanText(body.subject, 40);
  const topicId = cleanText(body.topicId, 120);
  const exerciseId = cleanText(body.exerciseId, 160);

  if (!grade || grade < 1 || grade > 6 || !subject || !topicId) {
    return NextResponse.json({ error: "missing_context" }, { status: 400 });
  }

  try {
    const note = cleanText(body.note, 1200);
    const topicTitle = cleanText(body.topicTitle, 160);
    const exerciseType = cleanText(body.exerciseType, 40);
    const context = cleanText(body.context, 60) || "exercise";
    const path = cleanText(body.path, 300);
    const childId = cleanText(body.childId, 120);

    const { error } = await reporter.supabase.from("customer_feedback").insert({
      email: EXERCISE_ISSUE_REPORTER_EMAIL,
      rating: null,
      liked: cleanText(body.question, 1200) || null,
      disliked: null,
      missing: joinParts([`${grade}. Klasse`, subject, topicTitle || topicId]),
      issues: note || "Report ohne Notiz",
      child_reaction: null,
      improvement_idea: joinParts([
        exerciseId ? `Übung: ${exerciseId}` : null,
        exerciseType ? `Typ: ${exerciseType}` : null,
        `Kontext: ${context}`,
        path ? `Pfad: ${path}` : null,
        childId ? `Kind: ${childId}` : null,
        `User: ${reporter.user.id}`,
      ]),
      allow_followup: false,
      giveaway_opt_in: false,
      giveaway_months: 0,
      source: "exercise_issue_report",
      user_agent: cleanText(req.headers.get("user-agent"), 300) || null,
    });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    Sentry.captureException(error);
    console.error("[exercise-issue-reports]", error);
    return NextResponse.json({ error: "report_failed" }, { status: 500 });
  }
}
