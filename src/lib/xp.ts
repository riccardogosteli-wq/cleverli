// ── XP & Level System ──────────────────────────────────────────────────────

export interface Level {
  id: number;
  title: string;
  titleFr: string;
  titleIt: string;
  titleEn: string;
  minXp: number;
  maxXp: number;
  emoji: string;
  color: string;
}

export const LEVELS: Level[] = [
  { id: 1, title: "Lernling",      titleFr: "Apprenti",       titleIt: "Principiante", titleEn: "Beginner",     minXp: 0,    maxXp: 99,   emoji: "🌱", color: "#86efac" },
  { id: 2, title: "Bücherwurm",    titleFr: "Rat de biblio",  titleIt: "Topolino",     titleEn: "Bookworm",     minXp: 100,  maxXp: 299,  emoji: "📚", color: "#67e8f9" },
  { id: 3, title: "Mathe-Ninja",   titleFr: "Ninja des maths",titleIt: "Ninja della Matematica", titleEn: "Math Ninja", minXp: 300, maxXp: 699, emoji: "🥷", color: "#fde68a" },
  { id: 4, title: "Cleverli-Star", titleFr: "Étoile Cleverli",titleIt: "Stella Cleverli",titleEn: "Cleverli Star",minXp: 700, maxXp: 1299,emoji: "⭐", color: "#fca5a5" },
  { id: 5, title: "Cleverli-Meister", titleFr: "Maître Cleverli", titleIt: "Maestro Cleverli", titleEn: "Cleverli Master", minXp: 1300, maxXp: 99999, emoji: "👑", color: "#c4b5fd" },
];

export function getLevelForXp(xp: number): Level {
  return LEVELS.slice().reverse().find(l => xp >= l.minXp) ?? LEVELS[0];
}

export function getNextLevel(xp: number): Level | null {
  const current = getLevelForXp(xp);
  return LEVELS.find(l => l.id === current.id + 1) ?? null;
}

export function getLevelProgress(xp: number): number {
  const current = getLevelForXp(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  const range = next.minXp - current.minXp;
  const earned = xp - current.minXp;
  return Math.min(100, Math.round((earned / range) * 100));
}

// XP rewards
export const XP = {
  CORRECT:      10,  // correct answer
  STREAK_BONUS:  5,  // every answer while streak >= 3
  NO_HINTS:      5,  // topic completed without using any hints
  PERFECT:      20,  // perfect score on a topic (all correct)
  TOPIC_DONE:   15,  // finishing any topic
} as const;

export function calcXpGain(opts: {
  correct: boolean;
  streak: number;
  hintsUsed: number;
  isTopicComplete: boolean;
  score: number;
  total: number;
}): number {
  if (!opts.correct) return 0;
  let xp = XP.CORRECT;
  if (opts.streak >= 3) xp += XP.STREAK_BONUS;
  if (opts.isTopicComplete) {
    xp += XP.TOPIC_DONE;
    if (opts.hintsUsed === 0) xp += XP.NO_HINTS;
    if (opts.score === opts.total) xp += XP.PERFECT;
  }
  return xp;
}
