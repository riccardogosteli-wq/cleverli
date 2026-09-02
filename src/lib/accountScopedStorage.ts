"use client";

const SESSION_KEY = "cleverli_session";
const SUPABASE_SESSION_KEY = "cleverli_supabase_session";

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

export function getAccountStorageScope(): string {
  if (typeof window === "undefined") return "anon";

  const cached = readJson<StoredSession>(SESSION_KEY);
  const supabaseCached = readJson<StoredSession>(SUPABASE_SESSION_KEY);
  const stableId =
    cached?.userId ||
    supabaseCached?.user?.id ||
    cached?.email ||
    supabaseCached?.user?.email ||
    "";

  return stableId ? `account_${hashScope(stableId.toLowerCase())}` : "anon";
}

export function hasAuthenticatedStorageScope(): boolean {
  return getAccountStorageScope() !== "anon";
}

export function scopedStorageKey(baseKey: string): string {
  return `${baseKey}__${getAccountStorageScope()}`;
}

export function getFamilyStorageKey(): string {
  return scopedStorageKey("cleverli_family");
}

export function getActiveProfileStorageKey(): string {
  return scopedStorageKey("cleverli_active_profile");
}

export function getParentPinHashStorageKey(): string {
  return scopedStorageKey("cleverli_parent_pin");
}

export function getParentPinUnlockStorageKey(): string {
  return scopedStorageKey("cleverli_parent_unlocked");
}

export function getRewardsStorageKey(): string {
  return scopedStorageKey("cleverli_rewards");
}

export function getLastGradeStorageKey(): string {
  return scopedStorageKey("cleverli_last_grade");
}

export function getProfileStorageKey(childId?: string | null): string {
  return scopedStorageKey(childId ? `cleverli_profile_${childId}` : "cleverli_profile");
}

export function getTopicProgressStorageKey(
  grade: number,
  subject: string,
  topicId: string,
  childId?: string | null,
): string {
  const childScope = childId ? `child_${childId}` : "child_none";
  return scopedStorageKey(`cleverli_${grade}_${subject}_${topicId}_${childScope}`);
}

export function getLegacyTopicProgressStorageKey(grade: number, subject: string, topicId: string): string {
  return `cleverli_${grade}_${subject}_${topicId}`;
}

export function clearLocalProgressForChild(childId: string) {
  if (typeof window === "undefined" || !childId) return;

  window.localStorage.removeItem(getProfileStorageKey(childId));
  window.localStorage.removeItem(`cleverli_profile_${childId}`);

  for (const key of Object.keys(window.localStorage)) {
    if (key.includes(`_child_${childId}__`)) {
      window.localStorage.removeItem(key);
    }
  }
}

export function clearLegacyFamilyState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("cleverli_family");
  window.localStorage.removeItem("cleverli_active_profile");
  window.localStorage.removeItem("cleverli_parent_pin");
  window.localStorage.removeItem("cleverli_parent_unlocked");
  window.localStorage.removeItem("cleverli_rewards");
  window.localStorage.removeItem("cleverli_profile");
  window.localStorage.removeItem("cleverli_last_grade");
}

function isLegacyTopicProgressKey(key: string): boolean {
  return /^cleverli_[1-6]_[a-z]+_[a-z0-9-]+$/.test(key);
}

function isLegacyChildProfileKey(key: string): boolean {
  return /^cleverli_profile_[a-f0-9-]{8,}$/i.test(key);
}

export function clearParentUnlockedSessions() {
  if (typeof window === "undefined") return;
  for (const key of Object.keys(window.localStorage)) {
    if (key === "cleverli_parent_unlocked" || key.startsWith("cleverli_parent_unlocked__account_")) {
      window.localStorage.removeItem(key);
    }
  }
}

export function clearLocalFamilyStateOnLogout() {
  if (typeof window === "undefined") return;
  clearLegacyFamilyState();
  clearParentUnlockedSessions();
  for (const key of Object.keys(window.localStorage)) {
    if (
      isLegacyTopicProgressKey(key) ||
      isLegacyChildProfileKey(key) ||
      key.startsWith("cleverli_family__account_") ||
      key.startsWith("cleverli_active_profile__account_") ||
      key.startsWith("cleverli_last_grade__account_")
    ) {
      window.localStorage.removeItem(key);
    }
  }
}
