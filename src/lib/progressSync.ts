/**
 * progressSync.ts
 * Fire-and-forget helpers to sync localStorage progress to Supabase.
 * Always writes to localStorage first (offline-safe), then async to Supabase.
 */
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/hooks/useProfile";

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
  partial: boolean;
  last_played: string | null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getParentId(): Promise<string | null> {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

// ── Sync profile (XP, streak, etc.) ─────────────────────────────────────────

export async function syncProfileToSupabase(childId: string, profile: Profile): Promise<void> {
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
  data: { stars: number; score: number; completed: number; partial: boolean; lastPlayed: string }
): Promise<void> {
  if (!supabase || !childId) return;
  const parentId = await getParentId();
  if (!parentId) return;

  try {
    await supabase.from("topic_progress").upsert({
      child_id: childId,
      parent_id: parentId,
      grade,
      subject,
      topic_id: topicId,
      stars: data.stars,
      score: data.score,
      completed: data.completed,
      partial: data.partial,
      last_played: data.lastPlayed,
    }, { onConflict: "child_id, grade, subject, topic_id" });
  } catch (e) {
    console.warn("progressSync: topic sync failed", e);
  }
}

// ── Load progress from Supabase (used on new device / first load) ────────────

export async function loadProfileFromSupabase(childId: string): Promise<Partial<Profile> | null> {
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

// ── Sync child profile creation/deletion ─────────────────────────────────────

export async function createChildInSupabase(
  childId: string,
  name: string,
  grade: number,
  avatar: string
): Promise<void> {
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
  if (!supabase) return;
  try {
    await supabase.from("child_profiles").delete().eq("id", childId);
  } catch (e) {
    console.warn("progressSync: child profile delete failed", e);
  }
}
