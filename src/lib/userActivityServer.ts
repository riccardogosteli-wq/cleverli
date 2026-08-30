import * as Sentry from "@sentry/nextjs";
import { createClient } from "@supabase/supabase-js";

export type UserActivityType =
  | "login"
  | "signup"
  | "signup_started"
  | "password_reset_requested"
  | "password_updated"
  | "checkout_started"
  | "subscription_trial_started"
  | "subscription_started"
  | "schooltime_access_started"
  | "subscription_updated"
  | "subscription_cancel_requested"
  | "subscription_cancelled"
  | "ads_lp_ab_assignment"
  | "ads_lp_cta_click"
  | "exercise_started"
  | "exercise_completed"
  | "exercise_wrong_answer"
  | "hint_used"
  | "paywall_shown";

type UserActivityPayload = {
  userId?: string | null;
  email?: string | null;
  activityType: UserActivityType;
  path?: string | null;
  source?: string | null;
  exerciseId?: string | null;
  grade?: number | null;
  subject?: string | null;
  topicId?: string | null;
  metadata?: Record<string, unknown>;
};

function cleanText(value: string | null | undefined, max = 160) {
  return value ? value.slice(0, max) : null;
}

function cleanInt(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : null;
}

function cleanMetadata(metadata: Record<string, unknown> | undefined) {
  if (!metadata) return {};
  return JSON.parse(JSON.stringify(metadata));
}

export async function logUserActivity(payload: UserActivityPayload) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    Sentry.captureMessage("[user-activity] Supabase service env missing", "warning");
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from("user_activity_events").insert({
      user_id: cleanText(payload.userId, 80),
      email: cleanText(payload.email, 180)?.toLowerCase() ?? null,
      activity_type: payload.activityType,
      path: cleanText(payload.path),
      source: cleanText(payload.source, 120),
      exercise_id: cleanText(payload.exerciseId, 120),
      grade: cleanInt(payload.grade),
      subject: cleanText(payload.subject, 40),
      topic_id: cleanText(payload.topicId, 120),
      metadata: cleanMetadata(payload.metadata),
    });

    if (error) throw error;
  } catch (error) {
    Sentry.captureException(error);
    console.error("[user-activity]", error);
  }
}
