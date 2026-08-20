"use client";

import { getSupabase } from "@/lib/supabase";
import type { UserActivityType } from "@/lib/userActivityServer";

type ClientActivityPayload = {
  email?: string | null;
  path?: string | null;
  source?: string | null;
  exerciseId?: string | null;
  grade?: number | null;
  subject?: string | null;
  topicId?: string | null;
  metadata?: Record<string, unknown>;
  accessToken?: string | null;
};

export function trackUserActivity(activityType: UserActivityType, payload: ClientActivityPayload = {}): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const send = (accessToken?: string | null) => {
    return fetch("/api/telemetry/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        activityType,
        email: payload.email,
        path: payload.path ?? window.location.pathname,
        source: payload.source,
        exerciseId: payload.exerciseId,
        grade: payload.grade,
        subject: payload.subject,
        topicId: payload.topicId,
        metadata: payload.metadata,
      }),
      keepalive: true,
    }).then(() => undefined).catch(() => {
      // Product telemetry must never break the user flow.
    });
  };

  if (payload.accessToken !== undefined) {
    return send(payload.accessToken);
  }

  const supabase = getSupabase();
  if (!supabase) return send();

  return supabase.auth.getSession()
    .then(({ data }) => send(data.session?.access_token))
    .catch(() => send())
    .then(() => undefined);
}
