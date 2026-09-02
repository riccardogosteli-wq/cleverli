"use client";

import {
  getCatalogSubjects,
  getProgressSubjectsFromCatalog,
  getTopicSummaries,
  type TopicSummary,
} from "@/data/topicCatalog";
import {
  getAvailableCurriculumSubjectIds,
  type CurriculumSelection,
} from "@/lib/curriculumProfiles";
import { getActiveProfileId } from "@/lib/family";
import {
  getTopicProgressStorageKey,
  hasAuthenticatedStorageScope,
} from "@/lib/accountScopedStorage";
import { getEffectiveCompleted, getEffectiveScore, getEffectiveStars } from "@/lib/topicProgress";

export interface NormalisedTopicProgress {
  stars: number;
  score: number;
  completed: number;
  lastPlayed: string;
  partial: boolean;
}

export function getReportingSubjects(grade: number, curriculum?: CurriculumSelection | null) {
  const allowed = new Set(getAvailableCurriculumSubjectIds(grade, curriculum));
  return getCatalogSubjects(grade).filter((subject) => allowed.has(subject.id));
}

export function readTopicProgressForChild(
  grade: number,
  subject: string,
  topic: TopicSummary | { id: string; exerciseCount?: number; exercises?: readonly unknown[] },
  childId: string | null = getActiveProfileId(),
): NormalisedTopicProgress | null {
  if (typeof window === "undefined") return null;

  const topicId = topic.id;
  const total = "exerciseCount" in topic && typeof topic.exerciseCount === "number"
    ? topic.exerciseCount
    : "exercises" in topic && Array.isArray(topic.exercises)
      ? topic.exercises.length
      : 0;

  try {
    for (const progressSubject of getProgressSubjectsFromCatalog(grade, subject, topicId)) {
      const scoped = window.localStorage.getItem(getTopicProgressStorageKey(grade, progressSubject, topicId, childId));
      const legacy = hasAuthenticatedStorageScope()
        ? null
        : window.localStorage.getItem(`cleverli_${grade}_${progressSubject}_${topicId}`);
      const raw = scoped ?? legacy;
      if (!raw) continue;

      const progress = JSON.parse(raw);
      const completed = getEffectiveCompleted(progress, total);
      return {
        stars: getEffectiveStars(progress, total),
        score: getEffectiveScore(progress, total),
        completed,
        lastPlayed: progress.lastPlayed ?? "",
        partial: progress.partial ?? (total > 0 && completed < total),
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function countCompletedTopicsForChild(
  childId: string | null = getActiveProfileId(),
  curriculum?: CurriculumSelection | null,
): number {
  if (typeof window === "undefined") return 0;

  let total = 0;
  for (const grade of [1, 2, 3, 4, 5, 6]) {
    for (const subject of getReportingSubjects(grade, curriculum)) {
      for (const topic of getTopicSummaries(grade, subject.id)) {
        const progress = readTopicProgressForChild(grade, subject.id, topic, childId);
        if (progress && progress.completed >= topic.exerciseCount) total += 1;
      }
    }
  }
  return total;
}

export function countCompletedExercisesForChild(
  childId: string | null = getActiveProfileId(),
  curriculum?: CurriculumSelection | null,
): number {
  if (typeof window === "undefined") return 0;

  let total = 0;
  for (const grade of [1, 2, 3, 4, 5, 6]) {
    for (const subject of getReportingSubjects(grade, curriculum)) {
      for (const topic of getTopicSummaries(grade, subject.id)) {
        const progress = readTopicProgressForChild(grade, subject.id, topic, childId);
        if (progress) total += Math.min(topic.exerciseCount, Math.max(0, progress.completed));
      }
    }
  }
  return total;
}

export function countTotalStarsForChild(
  childId: string | null = getActiveProfileId(),
  curriculum?: CurriculumSelection | null,
): number {
  if (typeof window === "undefined") return 0;

  let total = 0;
  for (const grade of [1, 2, 3, 4, 5, 6]) {
    for (const subject of getReportingSubjects(grade, curriculum)) {
      for (const topic of getTopicSummaries(grade, subject.id)) {
        const progress = readTopicProgressForChild(grade, subject.id, topic, childId);
        if (progress && progress.completed >= topic.exerciseCount && progress.stars > 0) {
          total += progress.stars;
        }
      }
    }
  }
  return total;
}
