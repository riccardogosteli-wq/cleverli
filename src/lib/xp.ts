// Rank thresholds are presentation derived from XP. Never migrate or reset profiles.
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

// IDs and thresholds of the first five ranks must remain stable.
export const LEVELS: Level[] = [
  { id: 1, title: "Lernling", titleFr: "Apprenti", titleIt: "Principiante", titleEn: "Beginner", minXp: 0, maxXp: 99, emoji: "🌱", color: "#86efac" },
  { id: 2, title: "Bücherwurm", titleFr: "Rat de biblio", titleIt: "Topolino", titleEn: "Bookworm", minXp: 100, maxXp: 299, emoji: "📚", color: "#67e8f9" },
  { id: 3, title: "Cleverli-Ninja", titleFr: "Ninja Cleverli", titleIt: "Ninja Cleverli", titleEn: "Cleverli Ninja", minXp: 300, maxXp: 699, emoji: "🥷", color: "#fde68a" },
  { id: 4, title: "Cleverli-Star", titleFr: "Étoile Cleverli", titleIt: "Stella Cleverli", titleEn: "Cleverli Star", minXp: 700, maxXp: 1299, emoji: "⭐", color: "#fca5a5" },
  { id: 5, title: "Cleverli-Meister", titleFr: "Maître Cleverli", titleIt: "Maestro Cleverli", titleEn: "Cleverli Master", minXp: 1300, maxXp: 2499, emoji: "👑", color: "#c4b5fd" },
  { id: 6, title: "Cleverli Entdecker", titleFr: "Explorateur Cleverli", titleIt: "Esploratore Cleverli", titleEn: "Cleverli Explorer", minXp: 2500, maxXp: 4499, emoji: "🧭", color: "#6ee7b7" },
  { id: 7, title: "Cleverli Forscher", titleFr: "Chercheur Cleverli", titleIt: "Ricercatore Cleverli", titleEn: "Cleverli Researcher", minXp: 4500, maxXp: 7499, emoji: "🔬", color: "#7dd3fc" },
  { id: 8, title: "Cleverli Experte", titleFr: "Expert Cleverli", titleIt: "Esperto Cleverli", titleEn: "Cleverli Expert", minXp: 7500, maxXp: 11499, emoji: "💎", color: "#a5b4fc" },
  { id: 9, title: "Cleverli Champion", titleFr: "Champion Cleverli", titleIt: "Campione Cleverli", titleEn: "Cleverli Champion", minXp: 11500, maxXp: 16499, emoji: "🏆", color: "#fcd34d" },
  { id: 10, title: "Cleverli Legende", titleFr: "Légende Cleverli", titleIt: "Leggenda Cleverli", titleEn: "Cleverli Legend", minXp: 16500, maxXp: 18999, emoji: "🌟", color: "#f9a8d4" },
];

export const LEGEND_STEP = 2500;
const legend = LEVELS[LEVELS.length - 1];
const rankXp = (xp: number) => Number.isFinite(xp) ? Math.max(0, Math.floor(xp)) : 0;

function legendLevel(step: number): Level {
  if (step === 0) return legend;
  const number = step + 1;
  const minXp = legend.minXp + step * LEGEND_STEP;
  return { ...legend, id: legend.id + step, minXp, maxXp: minXp + LEGEND_STEP - 1,
    title: legend.title + " " + number, titleFr: legend.titleFr + " " + number,
    titleIt: legend.titleIt + " " + number, titleEn: legend.titleEn + " " + number };
}

export function getLevelForXp(xp: number): Level {
  const value = rankXp(xp);
  if (value >= legend.minXp) return legendLevel(Math.floor((value - legend.minXp) / LEGEND_STEP));
  return LEVELS.slice().reverse().find(l => value >= l.minXp) ?? LEVELS[0];
}

// A next milestone always exists, including after every legend stage.
export function getNextLevel(xp: number): Level {
  const current = getLevelForXp(xp);
  return current.id < legend.id ? LEVELS[current.id] : legendLevel(current.id - legend.id + 1);
}

export function getLevelProgress(xp: number): number {
  const current = getLevelForXp(xp);
  const next = getNextLevel(xp);
  // Never show 100% while an unearned next goal remains.
  return Math.min(99, Math.max(0, Math.floor((rankXp(xp) - current.minXp) / (next.minXp - current.minXp) * 100)));
}

export function getLevelTitle(level: Level, lang: string): string {
  return lang === "fr" ? level.titleFr : lang === "it" ? level.titleIt : lang === "en" ? level.titleEn : level.title;
}

// Bounded render list, even for years of learning: all named ranks plus current/next legend.
export function getRankTrack(xp: number): Level[] {
  const current = getLevelForXp(xp), next = getNextLevel(xp);
  return [...new Map([...LEVELS, current, next].map(level => [level.id, level])).values()];
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
