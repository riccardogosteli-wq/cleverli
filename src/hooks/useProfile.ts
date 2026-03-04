"use client";
import { useState, useEffect, useCallback } from "react";
import { getLevelForXp, getNextLevel, calcXpGain } from "@/lib/xp";
import { ACHIEVEMENTS, AchievementId } from "@/lib/achievements";
import { getTopics, SUBJECTS } from "@/data/index";
import { getActiveProfileId } from "@/lib/family";
import { syncProfileToSupabase, loadProfileFromSupabase, loadTopicProgressFromSupabase } from "@/lib/progressSync";
import { getTierProgress } from "@/lib/tierProgress";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Profile {
  xp: number;
  totalExercises: number;      // all-time correct answers
  totalTopicsComplete: number;
  dailyStreak: number;
  lastPlayedDate: string;      // "YYYY-MM-DD"
  achievements: AchievementId[];
  usedLanguages: string[];
  costume: number;             // 0=none, 1=hat, 2=cape, 3=crown
  weeklyXp: number;            // resets every Monday
  weeklyXpDate: string;        // "YYYY-WW" for reset detection
  streakGraceUsed: boolean;    // UJ-10: one-time 1-day grace period per streak run
  weekendDays: string[];       // track weekend warrior (e.g., ["2026-W10-SAT", "2026-W10-SUN"])
  coins: number;               // earned currency for avatar shop
  ownedItems: string[];        // shop item IDs owned
  equippedItems: { hat?: string; accessory?: string; background?: string };
}

const PROFILE_KEY = "cleverli_profile";
const STREAK_KEY  = "cleverli_streak";

/** Returns the localStorage key for the currently active child profile, or the global key. */
function getActiveProfileKey(): string {
  const childId = getActiveProfileId();
  return childId ? `cleverli_profile_${childId}` : PROFILE_KEY;
}

const DEFAULT_PROFILE: Profile = {
  xp: 0,
  totalExercises: 0,
  totalTopicsComplete: 0,
  dailyStreak: 0,
  lastPlayedDate: "",
  achievements: [],
  usedLanguages: [],
  costume: 0,
  weeklyXp: 0,
  weeklyXpDate: "",
  streakGraceUsed: false,
  weekendDays: [],
  coins: 0,
  ownedItems: [],
  equippedItems: {},
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function weekStr() {
  const d = new Date();
  const oneJan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function diffDays(a: string, b: string) {
  if (!a || !b) return 999;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

function loadProfile(): Profile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const key = getActiveProfileKey();
    const raw = localStorage.getItem(key);
    // For child profiles: fall back to global key on first switch (migration)
    const fallback = key !== PROFILE_KEY ? localStorage.getItem(PROFILE_KEY) : null;
    const source = raw ?? fallback ?? null;
    if (!source) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(source) };
  } catch { return DEFAULT_PROFILE; }
}

function saveProfile(p: Profile) {
  if (typeof window === "undefined") return;
  const key = getActiveProfileKey();
  localStorage.setItem(key, JSON.stringify(p));
  // Fire-and-forget sync to Supabase (only if a child profile is active)
  const childId = getActiveProfileId();
  if (childId) syncProfileToSupabase(childId, p);
}

// ── Subject completion check ─────────────────────────────────────────────────

function isSubjectComplete(grade: number, subject: string): boolean {
  const topics = getTopics(grade, subject);
  return topics.every(t => {
    const raw = localStorage.getItem(`cleverli_${grade}_${subject}_${t.id}`);
    if (!raw) return false;
    const prog = JSON.parse(raw);
    return prog?.completed >= t.exercises.length;
  });
}

function isGradeComplete(grade: number): boolean {
  return SUBJECTS.every(s => isSubjectComplete(grade, s.id));
}

// ── Achievement evaluation ───────────────────────────────────────────────────

function checkAchievements(profile: Profile, opts: {
  exerciseDone: boolean;
  topicComplete: boolean;
  perfect: boolean;
  hintsUsed: number;
  topicDurationMs?: number;
  grade: number;
  subject: string;
}): AchievementId[] {
  const earned: AchievementId[] = [];
  const has = (id: AchievementId) => profile.achievements.includes(id);

  if (opts.exerciseDone) {
    if (!has("first_exercise")) earned.push("first_exercise");
    if (!has("exercises_10")  && profile.totalExercises >= 10)  earned.push("exercises_10");
    if (!has("exercises_50")  && profile.totalExercises >= 50)  earned.push("exercises_50");
    if (!has("exercises_100") && profile.totalExercises >= 100) earned.push("exercises_100");
    if (!has("exercises_250") && profile.totalExercises >= 250) earned.push("exercises_250");
  }

  if (opts.topicComplete) {
    if (!has("first_topic"))  earned.push("first_topic");
    if (opts.perfect && !has("perfect_score")) earned.push("perfect_score");
    if (opts.hintsUsed === 0 && !has("no_hints")) earned.push("no_hints");
    if (opts.topicDurationMs && opts.topicDurationMs < 2 * 60 * 1000 && !has("speed_run")) earned.push("speed_run");

    // Subject masters
    if (opts.subject === "math") {
      const mid = `math_master_${opts.grade}` as AchievementId;
      if (!has(mid) && isSubjectComplete(opts.grade, "math")) earned.push(mid);
    }
    if (opts.subject === "german") {
      const gid = `german_master_${opts.grade}` as AchievementId;
      if (!has(gid) && isSubjectComplete(opts.grade, "german")) earned.push(gid);
    }

    // Grade complete
    const gcid = `grade_${opts.grade}_complete` as AchievementId;
    if (!has(gcid) && isGradeComplete(opts.grade)) earned.push(gcid);
  }

  // Streak
  if (!has("streak_3")  && profile.dailyStreak >= 3)  earned.push("streak_3");
  if (!has("streak_7")  && profile.dailyStreak >= 7)  earned.push("streak_7");
  if (!has("streak_14") && profile.dailyStreak >= 14) earned.push("streak_14");
  if (!has("streak_30") && profile.dailyStreak >= 30) earned.push("streak_30");

  // Levels
  const levelId = getLevelForXp(profile.xp).id;
  if (levelId >= 2 && !has("level_2")) earned.push("level_2");
  if (levelId >= 3 && !has("level_3")) earned.push("level_3");
  if (levelId >= 4 && !has("level_4")) earned.push("level_4");
  if (levelId >= 5 && !has("level_5")) earned.push("level_5");

  // New achievements
  if (!has("exercises_500") && profile.totalExercises >= 500) earned.push("exercises_500");

  // Time-based achievements
  const hour = new Date().getHours();
  if (opts.exerciseDone && hour < 8 && !has("early_bird")) earned.push("early_bird");
  if (opts.exerciseDone && hour >= 21 && !has("night_owl")) earned.push("night_owl");

  // Comeback achievement
  if (opts.exerciseDone) {
    const today = todayStr();
    const diff = diffDays(profile.lastPlayedDate, today);
    if (diff >= 3 && profile.dailyStreak > 0 && !has("comeback")) earned.push("comeback");
  }

  // Science explorer — all science topics for any grade
  if (opts.topicComplete && !has("science_explorer")) {
    const scienceComplete = [1,2,3,4,5,6].some(g => {
      const topics = getTopics(g, "science");
      if (!topics.length) return false;
      return topics.every((t: { id: string }) => {
        try {
          return !!localStorage.getItem(`cleverli_${g}_science_${t.id}`);
        } catch {
          return false;
        }
      });
    });
    if (scienceComplete) earned.push("science_explorer");
  }

  // Seasonal achievements
  if (profile.totalTopicsComplete >= 3) {
    const month = new Date().getMonth();
    if ([2, 3, 4].includes(month) && !has("spring_learner")) earned.push("spring_learner");
    if ([5, 6, 7].includes(month) && !has("summer_learner")) earned.push("summer_learner");
    if ([8, 9, 10].includes(month) && !has("autumn_learner")) earned.push("autumn_learner");
    if ([11, 0, 1].includes(month) && !has("winter_learner")) earned.push("winter_learner");
  }

  return earned;
}

// ── Costume thresholds ───────────────────────────────────────────────────────

function calcCostume(totalExercises: number): number {
  if (totalExercises >= 100) return 3; // crown
  if (totalExercises >= 50)  return 2; // cape
  if (totalExercises >= 10)  return 1; // hat
  return 0;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);
  const [newAchievements, setNewAchievements] = useState<AchievementId[]>([]);
  const [xpGained, setXpGained] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    const today = todayStr();
    const diff = diffDays(p.lastPlayedDate, today);
    let streak = p.dailyStreak;
    let graceUsed = p.streakGraceUsed;
    if (diff === 1) {
      // consecutive day — streak maintained, grace resets for next time
      graceUsed = false;
    } else if (diff === 2 && !graceUsed && streak > 0) {
      // UJ-10: missed exactly 1 day → apply grace period (streak survives, grace now used)
      graceUsed = true;
    } else if (diff > 1) {
      streak = 0;
      graceUsed = false;
    }
    const updated = { ...p, dailyStreak: streak, streakGraceUsed: graceUsed };

    // New device/browser: localStorage is empty — try loading from Supabase
    const childId = getActiveProfileId();
    if (childId && p.xp === 0 && p.totalExercises === 0) {
      Promise.all([
        loadProfileFromSupabase(childId),
        loadTopicProgressFromSupabase(childId),
      ]).then(([remote, topicData]) => {
        // Restore profile stats
        if (remote && (remote.xp ?? 0) > 0) {
          const merged = { ...DEFAULT_PROFILE, ...remote };
          saveProfile(merged as Profile);
          setProfile(merged as Profile);
        } else {
          setProfile(updated);
        }
        // Restore topic progress into localStorage
        if (topicData) {
          for (const t of topicData) {
            const key = `cleverli_${t.grade}_${t.subject}_${t.topic_id}`;
            if (!localStorage.getItem(key)) {
              localStorage.setItem(key, JSON.stringify({
                stars: t.stars, score: t.score, completed: t.completed,
                partial: t.partial, lastPlayed: t.last_played,
              }));
            }
          }
        }
        setLoaded(true);
      });
    } else {
      setProfile(updated);
      setLoaded(true);
    }
  }, []);

  /**
   * Call after each correct answer (and optionally when a topic is completed).
   */
  const recordAnswer = useCallback((opts: {
    correct: boolean;
    streak: number;        // current streak (BEFORE this answer)
    hintsUsed: number;
    isTopicComplete: boolean;
    score: number;
    total: number;
    grade: number;
    subject: string;
    topicDurationMs?: number;
    lang?: string;
    topicId?: string;
    tierCompleted?: "easy" | "medium" | "hard";
  }) => {
    setProfile(prev => {
      const today = todayStr();
      const diff = diffDays(prev.lastPlayedDate, today);

      // Weekend warrior tracking
      const day = new Date().getDay(); // 0=Sun 6=Sat
      const wk = weekStr();
      const newWeekendDays = [...(prev.weekendDays ?? [])];
      if (opts.correct) {
        if (day === 6 && !newWeekendDays.includes(wk + "-SAT")) {
          newWeekendDays.push(wk + "-SAT");
        }
        if (day === 0 && !newWeekendDays.includes(wk + "-SUN")) {
          newWeekendDays.push(wk + "-SUN");
        }
      }

      const xpEarned = calcXpGain({
        correct: opts.correct,
        streak: opts.streak,
        hintsUsed: opts.hintsUsed,
        isTopicComplete: opts.isTopicComplete,
        score: opts.score,
        total: opts.total,
      });

      // Achievement XP rewards
      const achievementXp = 0; // calculated below after we know new achievements

      // Streak update (UJ-10: grace period handled on load; here we just increment/set on correct answer)
      let newStreak = prev.dailyStreak;
      let newGraceUsed = prev.streakGraceUsed;
      if (opts.correct) {
        if (prev.lastPlayedDate !== today) {
          if (diff === 1) {
            newStreak = prev.dailyStreak + 1;
            newGraceUsed = false; // fresh consecutive day, reset grace
          } else if (diff === 2 && !prev.streakGraceUsed && prev.dailyStreak > 0) {
            // Grace day — they missed yesterday but grace was preserved on load
            newStreak = prev.dailyStreak + 1;
            newGraceUsed = true;
          } else {
            newStreak = 1;
            newGraceUsed = false;
          }
        }
      }

      // Languages
      const usedLanguages = opts.lang && !prev.usedLanguages.includes(opts.lang)
        ? [...prev.usedLanguages, opts.lang]
        : prev.usedLanguages;

      // Polyglot
      let polyglotNew: AchievementId[] = [];
      if (usedLanguages.length >= 2 && !prev.achievements.includes("polyglot")) {
        polyglotNew = ["polyglot"];
      }

      const totalExercises = opts.correct ? prev.totalExercises + 1 : prev.totalExercises;
      const totalTopicsComplete = opts.isTopicComplete ? prev.totalTopicsComplete + 1 : prev.totalTopicsComplete;
      const costume = calcCostume(totalExercises);

      // Week XP
      const currentWeek = weekStr();
      const weeklyXp = prev.weeklyXpDate === currentWeek ? prev.weeklyXp + xpEarned : xpEarned;

      const newXp = prev.xp + xpEarned;

      // Coins: +1 per correct answer, +5 bonus on topic complete
      const newCoins = (prev.coins ?? 0)
        + (opts.correct ? 1 : 0)
        + (opts.correct && opts.isTopicComplete ? 5 : 0);

      const updated: Profile = {
        ...prev,
        xp: newXp,
        totalExercises,
        totalTopicsComplete,
        dailyStreak: newStreak,
        lastPlayedDate: opts.correct ? today : prev.lastPlayedDate,
        usedLanguages,
        costume,
        weeklyXp,
        weeklyXpDate: currentWeek,
        streakGraceUsed: newGraceUsed,
        weekendDays: newWeekendDays,
        coins: newCoins,
      };

      // Tier completion achievements
      const tierAchievements: AchievementId[] = [];
      if (opts.tierCompleted === "easy"   && !prev.achievements.includes("tier_easy_complete"))   tierAchievements.push("tier_easy_complete");
      if (opts.tierCompleted === "medium" && !prev.achievements.includes("tier_medium_complete")) tierAchievements.push("tier_medium_complete");
      if (opts.tierCompleted === "hard"   && !prev.achievements.includes("tier_hard_complete"))   tierAchievements.push("tier_hard_complete");

      // Check achievements
      const earned = [
        ...checkAchievements(updated, {
          exerciseDone: opts.correct,
          topicComplete: opts.isTopicComplete,
          perfect: opts.score === opts.total && opts.isTopicComplete,
          hintsUsed: opts.hintsUsed,
          topicDurationMs: opts.topicDurationMs,
          grade: opts.grade,
          subject: opts.subject,
        }),
        ...polyglotNew,
        ...tierAchievements,
      ].filter(id => !prev.achievements.includes(id));

      // Achievement XP
      const achXp = earned.reduce((sum, id) => {
        const a = ACHIEVEMENTS.find(a => a.id === id);
        return sum + (a?.xpReward ?? 0);
      }, 0);

      const finalXp = newXp + achXp;
      const finalProfile: Profile = {
        ...updated,
        xp: finalXp,
        achievements: [...prev.achievements, ...earned],
      };

      saveProfile(finalProfile);

      // Side effects (state updates via setTimeout to avoid batching issues)
      if (xpEarned + achXp > 0) setXpGained(xpEarned + achXp);
      if (earned.length > 0) setNewAchievements(earned);

      const prevLevel = getLevelForXp(prev.xp).id;
      const newLevel  = getLevelForXp(finalXp).id;
      if (newLevel > prevLevel) setLeveledUp(true);

      return finalProfile;
    });
  }, []);

  const clearNewAchievements = useCallback(() => setNewAchievements([]), []);
  const clearXpGained        = useCallback(() => setXpGained(0), []);
  const clearLeveledUp       = useCallback(() => setLeveledUp(false), []);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      saveProfile(updated);
      return updated;
    });
  }, []);

  const level    = getLevelForXp(profile.xp);
  const nextLevel = getNextLevel(profile.xp);

  return {
    profile,
    loaded,
    level,
    nextLevel,
    newAchievements,
    xpGained,
    leveledUp,
    recordAnswer,
    updateProfile,
    clearNewAchievements,
    clearXpGained,
    clearLeveledUp,
  };
}
