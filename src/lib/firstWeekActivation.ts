"use client";

import { scopedStorageKey } from "@/lib/accountScopedStorage";

export const FIRST_WEEK_MISSION_SIZE = 5;
export const FIRST_WEEK_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export type FirstWeekActivationState = {
  version: 1;
  childId: string;
  startedAt: string;
  grade: number;
  subject?: string;
  topicId?: string;
  nextPath?: string;
  firstMissionStartedAt?: string;
  firstMissionCompletedAt?: string;
  dismissedAt?: string;
};

function storageKey(childId: string) {
  return scopedStorageKey(`cleverli_first_week_activation_v1_${childId}`);
}

export function readFirstWeekActivation(childId: string | null | undefined): FirstWeekActivationState | null {
  if (typeof window === "undefined" || !childId) return null;
  try {
    const raw = window.localStorage.getItem(storageKey(childId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FirstWeekActivationState>;
    if (parsed.version !== 1 || parsed.childId !== childId || typeof parsed.startedAt !== "string") return null;
    return parsed as FirstWeekActivationState;
  } catch {
    return null;
  }
}

export function writeFirstWeekActivation(state: FirstWeekActivationState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(state.childId), JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("cleverli-activation-update", { detail: state }));
}

export function beginFirstWeekActivation(childId: string, grade: number) {
  const existing = readFirstWeekActivation(childId);
  const state: FirstWeekActivationState = existing ?? {
    version: 1,
    childId,
    grade,
    startedAt: new Date().toISOString(),
  };
  const next = { ...state, grade };
  writeFirstWeekActivation(next);
  return next;
}

export function selectFirstWeekGoal(childId: string, grade: number, subject: string, topicId: string) {
  const state = beginFirstWeekActivation(childId, grade);
  const nextPath = `/learn/${grade}/${subject}/${topicId}`;
  const next: FirstWeekActivationState = {
    ...state,
    subject,
    topicId,
    nextPath,
    firstMissionStartedAt: new Date().toISOString(),
  };
  writeFirstWeekActivation(next);
  return next;
}

export function completeFirstWeekMission(childId: string, grade: number, subject: string, topicId: string) {
  const state = readFirstWeekActivation(childId) ?? beginFirstWeekActivation(childId, grade);
  if (state.firstMissionCompletedAt) return state;
  const nextPath = `/learn/${grade}/${subject}/${topicId}`;
  const next = {
    ...state,
    grade,
    subject,
    topicId,
    nextPath,
    firstMissionStartedAt: state.firstMissionStartedAt ?? new Date().toISOString(),
    firstMissionCompletedAt: new Date().toISOString(),
  };
  writeFirstWeekActivation(next);
  return next;
}

export function dismissFirstWeekActivation(childId: string) {
  const state = readFirstWeekActivation(childId);
  if (!state) return;
  writeFirstWeekActivation({ ...state, dismissedAt: new Date().toISOString() });
}

export function isFirstWeekActivationVisible(state: FirstWeekActivationState | null) {
  if (!state || state.dismissedAt) return false;
  const started = Date.parse(state.startedAt);
  return Number.isFinite(started) && Date.now() - started <= FIRST_WEEK_WINDOW_MS;
}
