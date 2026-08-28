export const DAILY_XP_BONUS = 30;

export interface DailyState {
  date: string;
  completed: boolean;
  correct: boolean;
}

const DAILY_KEY = "cleverli_daily";

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getDailyState(): DailyState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function markDailyComplete(correct: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DAILY_KEY, JSON.stringify({
    date: todayKey(),
    completed: true,
    correct,
  }));
}

export function isDailyDoneToday(): boolean {
  const state = getDailyState();
  return !!state && state.date === todayKey() && state.completed;
}
