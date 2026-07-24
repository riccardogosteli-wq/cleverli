"use client";

import { captureProductEvent } from "@/lib/monitoring";

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

const SESSION_KEY = "cleverli_telemetry_session";

function getAnonymousSessionId() {
  if (typeof window === "undefined") return "";
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, id);
  return id;
}

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

  captureProductEvent(eventName, safePayload);

  const body = JSON.stringify({
    eventName,
    ...safePayload,
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/telemetry/exercise", blob);
      return;
    }
  } catch {
    // Fall through to fetch.
  }

  fetch("/api/telemetry/exercise", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Product telemetry must never break the exercise flow.
  });
}
