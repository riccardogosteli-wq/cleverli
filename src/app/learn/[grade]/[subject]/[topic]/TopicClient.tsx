"use client";
import { Topic } from "@/types/exercise";
import ExercisePlayer from "@/components/ExercisePlayer";
import ProgressMapClient from "@/components/ProgressMapClient";
import { useSession } from "@/hooks/useSession";
import { countExercisesByDifficulty } from "@/lib/exerciseHelpers";
import { getTierProgress } from "@/lib/tierProgress";
import { useEffect, useState } from "react";

interface Props { topic: Topic; grade: number; subject: string; allTopics: Topic[]; topicIndex: number; }

export default function TopicClient({ topic, grade, subject, allTopics, topicIndex }: Props) {
  const { isPremium, loaded } = useSession();
  const [exerciseCounts, setExerciseCounts] = useState<ReturnType<typeof countExercisesByDifficulty> | null>(null);

  useEffect(() => {
    const key = `cleverli_${grade}_${subject}_${topic.id}`;
    const progressData = JSON.parse(localStorage.getItem(key) ?? "{}");
    const totalCompleted = progressData.completed ?? 0;

    // ✅ Use getTierProgress directly — same logic ExercisePlayer uses.
    // This gives accurate per-difficulty counts, not a proportional guess.
    const tierProgress = getTierProgress(topic, totalCompleted);

    const counts = {
      completed: {
        1: tierProgress.easy.done,
        2: tierProgress.medium.done,
        3: tierProgress.hard.done,
      },
      total: {
        1: tierProgress.easy.total,
        2: tierProgress.medium.total,
        3: tierProgress.hard.total,
      },
    };

    setExerciseCounts(counts);
  }, [grade, subject, topic]);

  // Re-read from localStorage whenever ExercisePlayer saves (after each answer)
  // By subscribing to the storage event we refresh the roadmap live.
  useEffect(() => {
    const key = `cleverli_${grade}_${subject}_${topic.id}`;
    const refresh = () => {
      const progressData = JSON.parse(localStorage.getItem(key) ?? "{}");
      const totalCompleted = progressData.completed ?? 0;
      const tierProgress = getTierProgress(topic, totalCompleted);
      setExerciseCounts({
        completed: { 1: tierProgress.easy.done, 2: tierProgress.medium.done, 3: tierProgress.hard.done },
        total:     { 1: tierProgress.easy.total, 2: tierProgress.medium.total, 3: tierProgress.hard.total },
      });
    };
    // ExercisePlayer writes to localStorage in the same tab — poll on storage event
    // (same-tab writes don't fire storage events, so we use a custom event)
    window.addEventListener("cleverli-progress-update", refresh);
    return () => window.removeEventListener("cleverli-progress-update", refresh);
  }, [grade, subject, topic]);

  if (!exerciseCounts) return null;

  return (
    <div className="space-y-6">
      <ProgressMapClient
        topicId={topic.id}
        topicTitle={topic.title}
        grade={grade}
        subject={subject}
        completedExercisesByDifficulty={exerciseCounts.completed}
        totalExercisesByDifficulty={exerciseCounts.total}
      />
      <ExercisePlayer
        topic={topic}
        grade={grade}
        subject={subject}
        isPremium={loaded ? isPremium : true}
        allTopics={allTopics}
        topicIndex={topicIndex}
      />
    </div>
  );
}
