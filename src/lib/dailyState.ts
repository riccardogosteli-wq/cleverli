export const DAILY_XP_BONUS = 30;

export interface DailyState {
  date: string;
  completed: boolean;
  correct: boolean;
}

const DAILY_KEY = "cleverli_daily";
const SESSION_KEY = "cleverli_session";

type StoredSession = {
  email?: string;
  userId?: string;
  user?: { id?: string; email?: string };
};

function hashScope(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

function getDailyStorageKey(): { key: string; allowLegacyFallback: boolean } {
  if (typeof window === "undefined") return { key: DAILY_KEY, allowLegacyFallback: true };

  const session = readJson<StoredSession>(SESSION_KEY);
  const stableId = session?.userId || session?.user?.id || session?.email || session?.user?.email || "";
  if (!stableId) return { key: DAILY_KEY, allowLegacyFallback: true };

  const scope = `account_${hashScope(stableId.toLowerCase())}`;
  const activeChildId = window.localStorage.getItem(`cleverli_active_profile__${scope}`);
  if (!activeChildId) return { key: `${DAILY_KEY}__${scope}`, allowLegacyFallback: false };

  return { key: `${DAILY_KEY}__${scope}__child_${activeChildId}`, allowLegacyFallback: false };
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getDailyState(): DailyState | null {
  if (typeof window === "undefined") return null;
  try {
    const { key, allowLegacyFallback } = getDailyStorageKey();
    const raw = localStorage.getItem(key) ?? (allowLegacyFallback ? localStorage.getItem(DAILY_KEY) : null);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function markDailyComplete(correct: boolean) {
  if (typeof window === "undefined") return;
  const { key } = getDailyStorageKey();
  localStorage.setItem(key, JSON.stringify({
    date: todayKey(),
    completed: true,
    correct,
  }));
}

export function isDailyDoneToday(): boolean {
  const state = getDailyState();
  return !!state && state.date === todayKey() && state.completed;
}
