/**
 * progressSync.ts
 * Fire-and-forget helpers to sync localStorage progress to Supabase.
 * Always writes to localStorage first (offline-safe), then async to Supabase.
 */
import { getSupabase } from "@/lib/supabase";
import { ACTIVE_PROFILE_KEY, FAMILY_KEY, type FamilyMember, type FamilyStore } from "@/lib/family";
import type { Profile } from "@/hooks/useProfile";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

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
  created_at: string;
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
    await supabase.from("child_progress").upsert({
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
    const { error } = await supabase.from("topic_progress").upsert(payload, { onConflict: "child_id, grade, subject, topic_id" });
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
      await supabase.from("topic_progress").upsert(legacyPayload, { onConflict: "child_id, grade, subject, topic_id" });
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
      .single();
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
    const key = `cleverli_${t.grade}_${t.subject}_${t.topic_id}`;
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
    const key = `cleverli_profile_${childId}`;
    const raw = localStorage.getItem(key);
    const localProfile = raw ? JSON.parse(raw) : {};
    localStorage.setItem(key, JSON.stringify({ ...localProfile, ...remoteProfile }));
  }

  if (topicData) writeTopicProgressToLocalStorage(topicData);
}

export async function restoreFamilyFromSupabase(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || typeof window === "undefined") return;
  const cachedAuth = getCachedSupabaseAuth();
  const parentId = cachedAuth?.parentId ?? await getParentIdWithRetry();
  if (!parentId) return;

  try {
    const restData = cachedAuth?.accessToken
      ? await fetchSupabaseRows<SupabaseChildProfile>(`child_profiles?parent_id=eq.${parentId}&select=id,parent_id,name,grade,avatar,created_at&order=created_at.asc`, cachedAuth.accessToken)
      : null;
    const query = !restData ? await supabase
      .from("child_profiles")
      .select("id, parent_id, name, grade, avatar, created_at")
      .eq("parent_id", parentId)
      .order("created_at", { ascending: true }) : null;
    const childData = restData ?? query?.data;
    if (!childData || childData.length === 0) return;

    const remoteMembers: FamilyMember[] = (childData as SupabaseChildProfile[]).map(child => ({
      id: child.id,
      name: child.name,
      grade: child.grade,
      avatar: child.avatar,
      createdAt: child.created_at,
    }));
    const existingRaw = localStorage.getItem(FAMILY_KEY);
    const existingStore = existingRaw ? JSON.parse(existingRaw) as FamilyStore : { members: [] };
    const existingById = new Map((existingStore.members ?? []).map(member => [member.id, member]));
    const mergedMembers = remoteMembers.map(member => ({ ...existingById.get(member.id), ...member }));

    localStorage.setItem(FAMILY_KEY, JSON.stringify({ members: mergedMembers }));

    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    const validActiveId = activeId && mergedMembers.some(member => member.id === activeId)
      ? activeId
      : mergedMembers[0].id;
    localStorage.setItem(ACTIVE_PROFILE_KEY, validActiveId);
    localStorage.setItem("cleverli_last_grade", String(mergedMembers.find(member => member.id === validActiveId)?.grade ?? 1));

    await restoreActiveChildProgress(validActiveId, cachedAuth?.accessToken);
    window.dispatchEvent(new CustomEvent("cleverli-family-restored"));
    window.dispatchEvent(new CustomEvent("cleverli-progress-update"));
  } catch (e) {
    console.warn("progressSync: family restore failed", e);
  }
}

// ── Sync child profile creation/deletion ─────────────────────────────────────

export async function createChildInSupabase(
  childId: string,
  name: string,
  grade: number,
  avatar: string
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const parentId = await getParentId();
  if (!parentId) return;
  try {
    await supabase.from("child_profiles").upsert({
      id: childId,
      parent_id: parentId,
      name,
      grade,
      avatar,
    }, { onConflict: "id" });
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

export async function updateChildInSupabase(childId: string, updates: { grade?: number; name?: string; avatar?: string }): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("child_profiles").update(updates).eq("id", childId);
  } catch (e) {
    console.warn("progressSync: child profile update failed", e);
  }
}
