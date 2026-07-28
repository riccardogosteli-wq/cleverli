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

export function trackUserActivity(activityType: UserActivityType, payload: ClientActivityPayload = {}) {
  if (typeof window === "undefined") return;

  const send = (accessToken?: string | null) => {
    fetch("/api/telemetry/activity", {
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
    }).catch(() => {
      // Product telemetry must never break the user flow.
    });
  };

  if (payload.accessToken !== undefined) {
    send(payload.accessToken);
    return;
  }

  getSupabase()?.auth.getSession()
    .then(({ data }) => send(data.session?.access_token))
    .catch(() => send());
}
