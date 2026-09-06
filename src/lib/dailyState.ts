import { getAccountStorageScope, getActiveProfileStorageKey } from "@/lib/accountScopedStorage";
import type { Exercise } from "@/types/exercise";
import type { Lang } from "@/lib/i18n";

export const DAILY_XP_BONUS = 30;
export interface DailyReview {
  exercise: Exercise;
  subject: string;
  topic: { id: string; title: string; emoji: string };
  lang: Lang;
}
export interface DailyState {
  date: string;
  completed: boolean;
  correct: boolean;
  review?: DailyReview;
}

export function todayKey(date = new Date()): string {
  // The learning day follows Swiss midnight, not UTC midnight.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function getDailyStorageKey(): string {
  if (typeof window === "undefined") return "cleverli_daily";
  const scope = getAccountStorageScope();
  const child = localStorage.getItem(getActiveProfileStorageKey())
    ?? (scope === "anon" ? localStorage.getItem("cleverli_active_profile") : null);
  const base = scope === "anon" ? "cleverli_daily" : `cleverli_daily__${scope}`;
  return child ? `${base}__child_${child}` : base;
}

export function getDailyContext(): string {
  return `${getDailyStorageKey()}::${todayKey()}`;
}

export function getDailyState(): DailyState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getDailyStorageKey());
    if (!raw) return null;
    const state = JSON.parse(raw) as DailyState;
    // Old wrong attempts were incorrectly marked completed. Reopen them.
    return { ...state, completed: state.completed === true && state.correct === true };
  } catch { return null; }
}

/** Synchronous claim, before awarding XP. False means no award is permitted. */
export function markDailyComplete(correct: boolean, context = getDailyContext(), review?: DailyReview): boolean {
  if (typeof window === "undefined" || context !== getDailyContext()) return false;
  const key = getDailyStorageKey();
  const date = todayKey();
  const previous = getDailyState();
  if (previous?.date === date && previous.completed) return false;
  if (!correct) {
    localStorage.setItem(key, JSON.stringify({ date, completed: false, correct: false }));
    return false;
  }
  const claimKey = `${key}__bonus_${date}`;
  const claimed = localStorage.getItem(claimKey) === "true";
  localStorage.setItem(claimKey, "true");
  localStorage.setItem(key, JSON.stringify({ date, completed: true, correct: true, review }));
  return !claimed;
}

export function isDailyDoneToday(): boolean {
  const state = getDailyState();
  return !!state && state.date === todayKey() && state.completed;
}
