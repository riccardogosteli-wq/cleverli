"use client";

import { captureProductEvent } from "@/lib/monitoring";
import { trackUserActivity } from "@/lib/userActivityClient";
import {
  checkoutAttributionEventParams,
  getAnonymousSessionId,
  getTelemetryAttribution,
  telemetryAttributionMetadata,
} from "@/lib/attribution";
import { pushDataLayerEvent } from "@/lib/analytics";

export type ExerciseTelemetryEvent =
  | "exercise_started"
  | "exercise_completed"
  | "exercise_wrong_answer"
  | "hint_used"
  | "exercise_error"
  | "paywall_shown"
  | "checkout_error";

export type ExerciseTelemetryPayload = {
  exerciseId?: string;
  grade?: number;
  subject?: string;
  topicId?: string;
  exerciseType?: string;
  isCorrect?: boolean;
  attemptIndex?: number;
  wrongCountSession?: number;
  hintsUsed?: number;
  durationMs?: number;
  topicIndex?: number;
  topicTotal?: number;
  lang?: string;
  path?: string;
};

function sanitizePayload(payload: ExerciseTelemetryPayload): ExerciseTelemetryPayload {
  return {
    exerciseId: payload.exerciseId?.slice(0, 120),
    grade: payload.grade,
    subject: payload.subject?.slice(0, 40),
    topicId: payload.topicId?.slice(0, 120),
    exerciseType: payload.exerciseType?.slice(0, 40),
    isCorrect: payload.isCorrect,
    attemptIndex: payload.attemptIndex,
    wrongCountSession: payload.wrongCountSession,
    hintsUsed: payload.hintsUsed,
    durationMs: payload.durationMs,
    topicIndex: payload.topicIndex,
    topicTotal: payload.topicTotal,
    lang: payload.lang?.slice(0, 8),
    path: payload.path?.slice(0, 160),
  };
}

export function trackExerciseEvent(eventName: ExerciseTelemetryEvent, payload: ExerciseTelemetryPayload = {}) {
  if (typeof window === "undefined") return;

  const safePayload = {
    ...sanitizePayload(payload),
    anonymousSessionId: getAnonymousSessionId(),
    path: payload.path ?? window.location.pathname,
  };
  const attribution = getTelemetryAttribution();

  captureProductEvent(eventName, safePayload);
  pushDataLayerEvent(eventName, {
    exercise_id: safePayload.exerciseId,
    grade: safePayload.grade,
    subject: safePayload.subject,
    topic_id: safePayload.topicId,
    exercise_type: safePayload.exerciseType,
    is_correct: safePayload.isCorrect,
    duration_ms: safePayload.durationMs,
    anonymous_session_id: safePayload.anonymousSessionId,
    ...checkoutAttributionEventParams(),
  });

  const body = JSON.stringify({
    eventName,
    ...safePayload,
    attribution,
  });

  let sentWithBeacon = false;
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      sentWithBeacon = navigator.sendBeacon("/api/telemetry/exercise", blob);
    }
  } catch {
    // Fall through to fetch.
  }

  if (!sentWithBeacon) {
    fetch("/api/telemetry/exercise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // Product telemetry must never break the exercise flow.
    });
  }

  if (
    eventName === "exercise_started"
    || eventName === "exercise_completed"
    || eventName === "exercise_wrong_answer"
    || eventName === "hint_used"
    || eventName === "paywall_shown"
  ) {
    trackUserActivity(eventName, {
      path: safePayload.path,
      exerciseId: safePayload.exerciseId,
      grade: safePayload.grade,
      subject: safePayload.subject,
      topicId: safePayload.topicId,
      metadata: {
        exerciseType: safePayload.exerciseType,
        isCorrect: safePayload.isCorrect,
        attemptIndex: safePayload.attemptIndex,
        wrongCountSession: safePayload.wrongCountSession,
        hintsUsed: safePayload.hintsUsed,
        durationMs: safePayload.durationMs,
        topicIndex: safePayload.topicIndex,
        topicTotal: safePayload.topicTotal,
        lang: safePayload.lang,
        ...telemetryAttributionMetadata(),
      },
    });
  }
}
