/**
 * progressSync.ts
 * Fire-and-forget helpers to sync localStorage progress to Supabase.
 * Always writes to localStorage first (offline-safe), then async to Supabase.
 */
import * as Sentry from "@sentry/nextjs";
import { getSupabase } from "@/lib/supabase";
import { ACTIVE_PROFILE_KEY, FAMILY_KEY, type FamilyMember, type FamilyStore } from "@/lib/family";
import {
  getActiveProfileStorageKey,
  getFamilyStorageKey,
  getLastGradeStorageKey,
  getProfileStorageKey,
  getTopicProgressStorageKey,
  hasAuthenticatedStorageScope,
} from "@/lib/accountScopedStorage";
import type { Profile } from "@/hooks/useProfile";
import {
  parseCurriculumSelection,
  type CurriculumSelection,
} from "@/lib/curriculumProfiles";
import { captureProductEvent } from "@/lib/monitoring";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SESSION_KEY = "cleverli_session";

type FamilyRestoreEvent =
  | "family_restore_succeeded"
  | "family_restore_empty"
  | "family_restore_failed"
  | "family_restore_zero_children_premium";

// ── Types matching Supabase schema ───────────────────────────────────────────

export interface SupabaseTopicProgress {
  child_id: string;
  parent_id: string;
  grade: number;
  subject: string;
  topic_id: string;
  stars: number;
  score: number;
  completed: number;
  correct_ids: string[] | null;
  partial: boolean;
  last_played: string | null;
}

export interface SupabaseChildProfile {
  id: string;
  parent_id: string;
  name: string;
  grade: number;
  avatar: string;
  canton: string | null;
  school_language: string | null;
  curriculum_system: string | null;
  regional_profile: string | null;
  curriculum_profile_version: number | null;
  created_at: string;
}

function curriculumFromSupabase(child: SupabaseChildProfile): CurriculumSelection | undefined {
  return parseCurriculumSelection({
    canton: child.canton,
    schoolLanguage: child.school_language,
    curriculumSystem: child.curriculum_system,
    regionalProfile: child.regional_profile ?? undefined,
    version: child.curriculum_profile_version,
  });
}

function curriculumToSupabase(curriculum?: CurriculumSelection) {
  if (!curriculum) return {};
  return {
    canton: curriculum.canton,
    school_language: curriculum.schoolLanguage,
    curriculum_system: curriculum.curriculumSystem,
    regional_profile: curriculum.regionalProfile ?? null,
    curriculum_profile_version: curriculum.version,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getParentId(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

async function getParentIdWithRetry(): Promise<string | null> {
  const supabase = getSupabase();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const parentId = await getParentId();
    if (parentId) return parentId;
    if (attempt === 1 && supabase && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("cleverli_supabase_session");
        const cached = raw ? JSON.parse(raw) : null;
        if (cached?.access_token && cached?.refresh_token) {
          await supabase.auth.setSession({
            access_token: cached.access_token,
            refresh_token: cached.refresh_token,
          });
        }
      } catch {}
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  return null;
}

function getCachedSupabaseAuth(): { accessToken: string; refreshToken?: string; parentId: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("cleverli_supabase_session");
    const cached = raw ? JSON.parse(raw) : null;
    if (!cached?.access_token || !cached?.user?.id) return null;
    return {
      accessToken: cached.access_token,
      refreshToken: cached.refresh_token,
      parentId: cached.user.id,
    };
  } catch {
    return null;
  }
}

function getCachedAppSession(): { email?: string; premium?: boolean; premiumUntil?: string | null; cancelled?: boolean } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isCachedPremiumActive() {
  const session = getCachedAppSession();
  if (!session?.premium || session.cancelled === true) return false;
  if (!session.premiumUntil) return true;
  const premiumUntil = new Date(session.premiumUntil);
  return !Number.isNaN(premiumUntil.getTime()) && premiumUntil > new Date();
}

function sendFamilyRestoreTelemetry(
  activityType: FamilyRestoreEvent,
  metadata: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  try {
    captureProductEvent(activityType, {
      child_count: typeof metadata.child_count === "number" ? metadata.child_count : undefined,
      local_child_count_before: typeof metadata.local_child_count_before === "number" ? metadata.local_child_count_before : undefined,
      restored_from_empty: typeof metadata.restored_from_empty === "boolean" ? metadata.restored_from_empty : undefined,
      cached_auth: typeof metadata.cached_auth === "boolean" ? metadata.cached_auth : undefined,
      duration_ms: typeof metadata.duration_ms === "number" ? metadata.duration_ms : undefined,
      path: window.location.pathname,
    });

    if (activityType === "family_restore_zero_children_premium") {
      Sentry.captureMessage("[family-restore] premium session has zero child profiles", {
        level: "warning",
        tags: { area: "family_restore" },
        extra: metadata,
      });
    }

    if (
      activityType === "family_restore_succeeded" &&
      metadata.restored_from_empty === true &&
      typeof metadata.child_count === "number" &&
      metadata.child_count > 0 &&
      isCachedPremiumActive()
    ) {
      Sentry.captureMessage("[family-restore] premium session restored children from empty local state", {
        level: "warning",
        tags: { area: "family_restore" },
        extra: metadata,
      });
    }
  } catch {
    // Restore telemetry must never affect profile recovery.
  }
}

function getLocalFamilyChildCount() {
  if (typeof window === "undefined") return 0;
  try {
    const localFamilyRaw = localStorage.getItem(getFamilyStorageKey()) ?? (
      hasAuthenticatedStorageScope() ? null : localStorage.getItem(FAMILY_KEY)
    );
    if (!localFamilyRaw) return 0;
    const localFamily = JSON.parse(localFamilyRaw) as Partial<FamilyStore>;
    return Array.isArray(localFamily.members) ? localFamily.members.length : 0;
  } catch {
    return 0;
  }
}

async function fetchSupabaseRows<T>(path: string, accessToken: string): Promise<T[] | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) return null;
    return await res.json() as T[];
  } catch {
    return null;
  }
}

// ── Sync profile (XP, streak, etc.) ─────────────────────────────────────────

export async function syncProfileToSupabase(childId: string, profile: Profile): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || !childId) return;
  const parentId = await getParentId();
  if (!parentId) return;

  try {
    const { error } = await supabase.from("child_progress").upsert({
      child_id: childId,
      parent_id: parentId,
      xp: profile.xp,
      daily_streak: profile.dailyStreak,
      last_played_date: profile.lastPlayedDate,
      weekly_xp: profile.weeklyXp,
      weekly_xp_date: profile.weeklyXpDate,
      total_exercises: profile.totalExercises,
      total_topics_done: profile.totalTopicsComplete,
      costume: profile.costume,
      updated_at: new Date().toISOString(),
    }, { onConflict: "child_id" });
    if (error) throw error;
  } catch (e) {
    console.warn("progressSync: profile sync failed", e);
  }
}

// ── Sync topic progress ──────────────────────────────────────────────────────

export async function syncTopicProgressToSupabase(
  childId: string,
  grade: number,
  subject: string,
  topicId: string,
  data: { stars: number; score: number; completed: number; correctIds?: string[]; partial: boolean; lastPlayed: string }
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || !childId) return;
  const parentId = await getParentId();
  if (!parentId) return;

  try {
    const payload = {
      child_id: childId,
      parent_id: parentId,
      grade,
      subject,
      topic_id: topicId,
      stars: data.stars,
      score: data.score,
      completed: data.completed,
      correct_ids: data.correctIds ?? [],
      partial: data.partial,
      last_played: data.lastPlayed,
    };
    const { error } = await supabase.from("topic_progress").upsert(payload, { onConflict: "child_id,grade,subject,topic_id" });
    if (error && /correct_ids/i.test(error.message)) {
      const legacyPayload = {
        child_id: payload.child_id,
        parent_id: payload.parent_id,
        grade: payload.grade,
        subject: payload.subject,
        topic_id: payload.topic_id,
        stars: payload.stars,
        score: payload.score,
        completed: payload.completed,
        partial: payload.partial,
        last_played: payload.last_played,
      };
      const { error: legacyError } = await supabase.from("topic_progress").upsert(legacyPayload, { onConflict: "child_id,grade,subject,topic_id" });
      if (legacyError) throw legacyError;
    } else if (error) {
      throw error;
    }
  } catch (e) {
    console.warn("progressSync: topic sync failed", e);
  }
}

// ── Load progress from Supabase (used on new device / first load) ────────────

export async function loadProfileFromSupabase(childId: string): Promise<Partial<Profile> | null> {
  const supabase = getSupabase();
  if (!supabase || !childId) return null;
  try {
    const { data, error } = await supabase
      .from("child_progress")
      .select("*")
      .eq("child_id", childId)
      .maybeSingle();
    if (error || !data) return null;

    return {
      xp: data.xp ?? 0,
      dailyStreak: data.daily_streak ?? 0,
      lastPlayedDate: data.last_played_date ?? "",
      weeklyXp: data.weekly_xp ?? 0,
      weeklyXpDate: data.weekly_xp_date ?? "",
      totalExercises: data.total_exercises ?? 0,
      totalTopicsComplete: data.total_topics_done ?? 0,
      costume: data.costume ?? 0,
    };
  } catch { return null; }
}

export async function loadTopicProgressFromSupabase(
  childId: string
): Promise<SupabaseTopicProgress[] | null> {
  const supabase = getSupabase();
  if (!supabase || !childId) return null;
  try {
    const { data, error } = await supabase
      .from("topic_progress")
      .select("*")
      .eq("child_id", childId);
    if (error || !data) return null;
    return data as SupabaseTopicProgress[];
  } catch { return null; }
}

function writeTopicProgressToLocalStorage(topicData: SupabaseTopicProgress[]) {
  if (typeof window === "undefined") return;
  for (const t of topicData) {
    const key = getTopicProgressStorageKey(t.grade, t.subject, t.topic_id, t.child_id);
    const remote = {
      stars: t.stars,
      score: t.score,
      completed: t.completed,
      correctIds: Array.isArray(t.correct_ids) ? t.correct_ids : [],
      partial: t.partial,
      lastPlayed: t.last_played,
    };

    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(remote));
      continue;
    }

    try {
      const local = JSON.parse(raw);
      const localCompleted = local.completed ?? 0;
      const remoteCompleted = remote.completed ?? 0;
      const localPlayed = local.lastPlayed ? new Date(local.lastPlayed).getTime() : 0;
      const remotePlayed = remote.lastPlayed ? new Date(remote.lastPlayed).getTime() : 0;
      if (remoteCompleted > localCompleted || remotePlayed > localPlayed) {
        localStorage.setItem(key, JSON.stringify({ ...local, ...remote }));
      }
    } catch {
      localStorage.setItem(key, JSON.stringify(remote));
    }
  }
}

function profileHasProgress(profile: Partial<Profile> | null): boolean {
  return !!profile && (
    (profile.xp ?? 0) > 0 ||
    (profile.totalExercises ?? 0) > 0 ||
    (profile.totalTopicsComplete ?? 0) > 0 ||
    (profile.dailyStreak ?? 0) > 0
  );
}

async function restoreActiveChildProgress(childId: string, accessToken?: string) {
  const [remoteProfileRows, topicData] = accessToken
    ? await Promise.all([
        fetchSupabaseRows<Record<string, unknown>>(`child_progress?child_id=eq.${childId}&select=*`, accessToken),
        fetchSupabaseRows<SupabaseTopicProgress>(`topic_progress?child_id=eq.${childId}&select=*`, accessToken),
      ])
    : await Promise.all([
        loadProfileFromSupabase(childId).then(profile => profile ? [profile as Record<string, unknown>] : null),
        loadTopicProgressFromSupabase(childId),
      ]);
  const remoteProfileRow = remoteProfileRows?.[0];
  const remoteProfile = remoteProfileRow ? {
    xp: remoteProfileRow.xp ?? 0,
    dailyStreak: remoteProfileRow.daily_streak ?? 0,
    lastPlayedDate: remoteProfileRow.last_played_date ?? "",
    weeklyXp: remoteProfileRow.weekly_xp ?? 0,
    weeklyXpDate: remoteProfileRow.weekly_xp_date ?? "",
    totalExercises: remoteProfileRow.total_exercises ?? 0,
    totalTopicsComplete: remoteProfileRow.total_topics_done ?? 0,
    costume: remoteProfileRow.costume ?? 0,
  } as Partial<Profile> : null;

  if (typeof window === "undefined") return;
  if (profileHasProgress(remoteProfile)) {
    const key = getProfileStorageKey(childId);
    const raw = localStorage.getItem(key);
    const localProfile = raw ? JSON.parse(raw) : {};
    localStorage.setItem(key, JSON.stringify({ ...localProfile, ...remoteProfile }));
  }

  if (topicData) writeTopicProgressToLocalStorage(topicData);
}

export async function restoreFamilyFromSupabase(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || typeof window === "undefined") return;
  const startedAt = Date.now();
  const cachedAuth = getCachedSupabaseAuth();
  const parentId = cachedAuth?.parentId ?? await getParentIdWithRetry();
  if (!parentId) return;

  try {
    const localChildCountBefore = getLocalFamilyChildCount();
    const restData = cachedAuth?.accessToken
      ? await fetchSupabaseRows<SupabaseChildProfile>(`child_profiles?parent_id=eq.${parentId}&select=id,parent_id,name,grade,avatar,canton,school_language,curriculum_system,regional_profile,curriculum_profile_version,created_at&order=created_at.asc`, cachedAuth.accessToken)
      : null;
    const query = !restData ? await supabase
      .from("child_profiles")
      .select("id, parent_id, name, grade, avatar, canton, school_language, curriculum_system, regional_profile, curriculum_profile_version, created_at")
      .eq("parent_id", parentId)
      .order("created_at", { ascending: true }) : null;
    const childData = restData ?? query?.data;
    if (!childData || childData.length === 0) {
      const metadata = {
        child_count: 0,
        local_child_count_before: localChildCountBefore,
        cached_auth: !!cachedAuth,
        duration_ms: Date.now() - startedAt,
      };
      sendFamilyRestoreTelemetry("family_restore_empty", metadata);
      if (isCachedPremiumActive()) {
        sendFamilyRestoreTelemetry("family_restore_zero_children_premium", metadata);
      }
      return;
    }

    const remoteMembers: FamilyMember[] = (childData as SupabaseChildProfile[]).map(child => {
      const curriculum = curriculumFromSupabase(child);
      return {
        id: child.id,
        name: child.name,
        grade: child.grade,
        avatar: child.avatar,
        createdAt: child.created_at,
        ...(curriculum ? { curriculum } : {}),
      };
    });
    const existingRaw = localStorage.getItem(getFamilyStorageKey()) ?? (
      hasAuthenticatedStorageScope() ? null : localStorage.getItem(FAMILY_KEY)
    );
    const existingStore = existingRaw ? JSON.parse(existingRaw) as FamilyStore : { members: [] };
    const existingById = new Map((existingStore.members ?? []).map(member => [member.id, member]));
    const mergedMembers = remoteMembers.map(member => ({ ...existingById.get(member.id), ...member }));

    localStorage.setItem(getFamilyStorageKey(), JSON.stringify({ members: mergedMembers }));

    const activeId = localStorage.getItem(getActiveProfileStorageKey()) ?? (
      hasAuthenticatedStorageScope() ? null : localStorage.getItem(ACTIVE_PROFILE_KEY)
    );
    const validActiveId = activeId && mergedMembers.some(member => member.id === activeId)
      ? activeId
      : mergedMembers[0].id;
    localStorage.setItem(getActiveProfileStorageKey(), validActiveId);
    localStorage.setItem(getLastGradeStorageKey(), String(mergedMembers.find(member => member.id === validActiveId)?.grade ?? 1));

    await restoreActiveChildProgress(validActiveId, cachedAuth?.accessToken);
    sendFamilyRestoreTelemetry("family_restore_succeeded", {
      child_count: mergedMembers.length,
      local_child_count_before: localChildCountBefore,
      restored_from_empty: localChildCountBefore === 0,
      cached_auth: !!cachedAuth,
      duration_ms: Date.now() - startedAt,
    });
    window.dispatchEvent(new CustomEvent("cleverli-family-restored"));
    window.dispatchEvent(new CustomEvent("cleverli-progress-update"));
  } catch (e) {
    sendFamilyRestoreTelemetry("family_restore_failed", {
      cached_auth: !!cachedAuth,
      duration_ms: Date.now() - startedAt,
    });
    console.warn("progressSync: family restore failed", e);
  }
}

// ── Sync child profile creation/deletion ─────────────────────────────────────

export async function createChildInSupabase(
  childId: string,
  name: string,
  grade: number,
  avatar: string,
  curriculum?: CurriculumSelection,
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const parentId = await getParentId();
  if (!parentId) return;
  try {
    const { error } = await supabase.from("child_profiles").upsert({
      id: childId,
      parent_id: parentId,
      name,
      grade,
      avatar,
      ...curriculumToSupabase(curriculum),
    }, { onConflict: "id" });
    if (error) throw error;
  } catch (e) {
    console.warn("progressSync: child profile create failed", e);
  }
}

export async function deleteChildFromSupabase(childId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("child_profiles").delete().eq("id", childId);
  } catch (e) {
    console.warn("progressSync: child profile delete failed", e);
  }
}

export async function resetChildProgressInSupabase(childId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || !childId) return;
  const parentId = await getParentId();
  if (!parentId) return;

  try {
    const { error: topicError } = await supabase
      .from("topic_progress")
      .delete()
      .eq("child_id", childId)
      .eq("parent_id", parentId);
    if (topicError) throw topicError;

    const { error: profileError } = await supabase
      .from("child_progress")
      .delete()
      .eq("child_id", childId)
      .eq("parent_id", parentId);
    if (profileError) throw profileError;
  } catch (e) {
    console.warn("progressSync: child progress reset failed", e);
  }
}

export async function updateChildInSupabase(
  childId: string,
  updates: { grade?: number; name?: string; avatar?: string; curriculum?: CurriculumSelection },
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    const { curriculum, ...profileUpdates } = updates;
    const { error } = await supabase
      .from("child_profiles")
      .update({ ...profileUpdates, ...curriculumToSupabase(curriculum) })
      .eq("id", childId);
    if (error) throw error;
  } catch (e) {
    console.warn("progressSync: child profile update failed", e);
  }
}
