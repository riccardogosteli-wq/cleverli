export interface StoredTopicProgress {
  completed?: number;
  score?: number;
  stars?: number;
  correctIds?: string[];
  partial?: boolean;
  lastPlayed?: string;
}

export function getEffectiveCompleted(progress: StoredTopicProgress | null | undefined, total: number) {
  const safeTotal = Math.max(0, total);
  if (Array.isArray(progress?.correctIds) && progress.correctIds.length > 0) {
    return Math.min(safeTotal, new Set(progress.correctIds).size);
  }

  const completed = Math.max(0, Number(progress?.completed ?? 0));
  const stars = Math.max(0, Number(progress?.stars ?? 0));

  // Older builds could mark a topic complete after all cards were attempted,
  // even with a weak score such as 15/50. Treat those states as still in progress.
  if (completed >= safeTotal && stars < 2) {
    return Math.max(0, Math.min(safeTotal - 1, Number(progress?.score ?? 0)));
  }

  return Math.min(safeTotal, completed);
}

export function mergeCompletedProgress(existing: StoredTopicProgress | null | undefined, nextCompleted: number, total: number) {
  const effectiveExisting = getEffectiveCompleted(existing, total);
  return Math.max(effectiveExisting, Math.min(Math.max(0, nextCompleted), Math.max(0, total)));
}
