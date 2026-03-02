// ── Reward System ────────────────────────────────────────────────────────────
// Rewards are defined by parents and tracked per-device in localStorage.
// When a child reaches a trigger, the reward unlocks and shows a celebration.

export type TriggerType = "tasks" | "topics" | "streak" | "stars";
export type RewardStatus = "active" | "unlocked" | "redeemed";

export interface Reward {
  id: string;
  emoji: string;
  title: string;               // parent's custom label
  triggerType: TriggerType;
  triggerValue: number;        // e.g. 20 tasks, 3 topics, 7-day streak
  status: RewardStatus;
  createdAt: string;
  unlockedAt?: string;
  redeemedAt?: string;
}

export interface RewardProgress {
  reward: Reward;
  current: number;     // current value toward trigger
  pct: number;         // 0–100
  isNew: boolean;      // true if just unlocked this session
}

const REWARDS_KEY = "cleverli_rewards";
const MAX_ACTIVE = 3;

// ── Pre-built templates ───────────────────────────────────────────────────────
export interface RewardTemplate {
  emoji: string;
  title: { de: string; fr: string; it: string; en: string };
}

export const REWARD_TEMPLATES: RewardTemplate[] = [
  { emoji: "🦁", title: { de: "Wir gehen in den Zoo!", fr: "On va au zoo!", it: "Andiamo allo zoo!", en: "Trip to the zoo!" } },
  { emoji: "🍦", title: { de: "Ein Glace aussuchen", fr: "Choisir une glace", it: "Scegliere un gelato", en: "Pick an ice cream" } },
  { emoji: "🎬", title: { de: "Kinoabend aussuchen", fr: "Choisir un film", it: "Serata cinema", en: "Pick a movie night" } },
  { emoji: "🧁", title: { de: "Zusammen Kuchen backen", fr: "Cuisiner ensemble", it: "Cucinare insieme", en: "Bake a cake together" } },
  { emoji: "🎨", title: { de: "Neuen Malblock aussuchen", fr: "Choisir un cahier", it: "Nuovo album da disegno", en: "Pick a new sketchbook" } },
  { emoji: "🛒", title: { de: "Einen Wunsch erfüllen", fr: "Un petit souhait", it: "Un piccolo desiderio", en: "One small wish granted" } },
  { emoji: "🏊", title: { de: "Ins Schwimmbad gehen", fr: "Aller à la piscine", it: "Andare in piscina", en: "Go to the swimming pool" } },
  { emoji: "🎠", title: { de: "Einen Ausflug machen", fr: "Faire une excursion", it: "Fare una gita", en: "Go on a day trip" } },
  { emoji: "🍕", title: { de: "Pizza-Abend selbst gestalten", fr: "Soirée pizza", it: "Serata pizza", en: "Design your own pizza night" } },
  { emoji: "📚", title: { de: "Neues Buch aussuchen", fr: "Choisir un livre", it: "Scegliere un libro", en: "Pick a new book" } },
];

export const TRIGGER_LABELS: Record<TriggerType, { de: string; fr: string; it: string; en: string }> = {
  tasks:  { de: "Aufgaben erledigt", fr: "exercices réalisés", it: "esercizi completati", en: "tasks completed" },
  topics: { de: "Themen abgeschlossen", fr: "thèmes terminés", it: "argomenti completati", en: "topics completed" },
  streak: { de: "Tage Streak", fr: "jours consécutifs", it: "giorni di fila", en: "day streak" },
  stars:  { de: "Sterne gesammelt", fr: "étoiles collectées", it: "stelle raccolte", en: "stars collected" },
};

// ── Storage ───────────────────────────────────────────────────────────────────
export function loadRewards(): Reward[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REWARDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveRewards(rewards: Reward[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
}

export function addReward(data: Omit<Reward, "id" | "status" | "createdAt">): Reward {
  const rewards = loadRewards();
  const active = rewards.filter(r => r.status === "active");
  if (active.length >= MAX_ACTIVE) throw new Error(`Max ${MAX_ACTIVE} active rewards`);
  const reward: Reward = {
    ...data,
    id: `reward_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  rewards.push(reward);
  saveRewards(rewards);
  return reward;
}

export function markRedeemed(id: string) {
  const rewards = loadRewards();
  const r = rewards.find(r => r.id === id);
  if (r) { r.status = "redeemed"; r.redeemedAt = new Date().toISOString(); }
  saveRewards(rewards);
}

export function removeReward(id: string) {
  saveRewards(loadRewards().filter(r => r.id !== id));
}

// ── Progress calculation ──────────────────────────────────────────────────────
export interface ProgressSnapshot {
  totalExercises: number;
  totalTopicsComplete: number;
  dailyStreak: number;
  totalStars: number;          // computed from topic localStorage entries
}

export function getProgressValue(snap: ProgressSnapshot, type: TriggerType): number {
  switch (type) {
    case "tasks":  return snap.totalExercises;
    case "topics": return snap.totalTopicsComplete;
    case "streak": return snap.dailyStreak;
    case "stars":  return snap.totalStars;
  }
}

/** Count total stars from all topic progress entries. */
export function countTotalStars(): number {
  if (typeof window === "undefined") return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith("cleverli_") || key.split("_").length < 4) continue;
    // key format: cleverli_{grade}_{subject}_{topicId}
    try {
      const val = JSON.parse(localStorage.getItem(key) ?? "null");
      if (val?.stars) total += val.stars;
    } catch { /* skip */ }
  }
  return total;
}

/**
 * Check all active rewards against current progress.
 * Returns list of newly unlocked reward IDs.
 */
export function checkAndUnlockRewards(snap: ProgressSnapshot): string[] {
  const rewards = loadRewards();
  const newlyUnlocked: string[] = [];

  rewards.forEach(r => {
    if (r.status !== "active") return;
    const current = getProgressValue(snap, r.triggerType);
    if (current >= r.triggerValue) {
      r.status = "unlocked";
      r.unlockedAt = new Date().toISOString();
      newlyUnlocked.push(r.id);
    }
  });

  if (newlyUnlocked.length > 0) saveRewards(rewards);
  return newlyUnlocked;
}

/** Get progress info for all active + recently unlocked rewards (for child widget). */
export function getRewardProgress(snap: ProgressSnapshot): RewardProgress[] {
  const rewards = loadRewards();
  const recentlyUnlocked = rewards.filter(r =>
    r.status === "unlocked" &&
    r.unlockedAt &&
    Date.now() - new Date(r.unlockedAt).getTime() < 24 * 60 * 60 * 1000 // last 24h
  );

  return [...rewards.filter(r => r.status === "active"), ...recentlyUnlocked].map(r => {
    const current = getProgressValue(snap, r.triggerType);
    const pct = Math.min(100, Math.round((current / r.triggerValue) * 100));
    return { reward: r, current, pct, isNew: false };
  });
}
