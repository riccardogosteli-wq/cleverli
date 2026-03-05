"use client";
import { Topic } from "@/types/exercise";
import ExercisePlayer from "@/components/ExercisePlayer";
import ProgressMapClient from "@/components/ProgressMapClient";
import { useSession } from "@/hooks/useSession";
import { countExercisesByDifficulty } from "@/lib/exerciseHelpers";
import { useEffect, useState } from "react";

interface Props { topic: Topic; grade: number; subject: string; allTopics: Topic[]; topicIndex: number; }

export default function TopicClient({ topic, grade, subject, allTopics, topicIndex }: Props) {
  const { isPremium, loaded } = useSession();
  const [exerciseCounts, setExerciseCounts] = useState<ReturnType<typeof countExercisesByDifficulty> | null>(null);

  // Load completed exercises from localStorage and calculate counts
  useEffect(() => {
    const key = `cleverli_${grade}_${subject}_${topic.id}`;
    const progressData = JSON.parse(localStorage.getItem(key) ?? "{}");
    const totalCompleted = progressData.completed ?? 0;

    // Estimate completed exercises by difficulty (assumes exercises are ordered by difficulty)
    // This is an estimation based on the order of exercises in topic.exercises
    const completedIds: string[] = [];
    let remaining = totalCompleted;

    for (const exercise of topic.exercises) {
      if (remaining <= 0) break;
      completedIds.push(exercise.id);
      remaining--;
    }

    // Count exercises by difficulty
    const counts = countExercisesByDifficulty(topic.exercises, completedIds);
    setExerciseCounts(counts);
  }, [grade, subject, topic]);

  if (!exerciseCounts) {
    return null; // Loading
  }

  return (
    <div className="space-y-6">
      {/* Progress Map — Shows roadmap with mission unlocks */}
      <ProgressMapClient
        topicId={topic.id}
        topicTitle={topic.title}
        grade={grade}
        subject={subject}
        completedExercisesByDifficulty={exerciseCounts.completed}
        totalExercisesByDifficulty={exerciseCounts.total}
      />

      {/* Exercise Player — Interactive exercises */}
      <ExercisePlayer
        topic={topic}
        grade={grade}
        subject={subject}
        isPremium={loaded ? isPremium : true} /* UJ-8: treat as premium until loaded to avoid flash */
        allTopics={allTopics}
        topicIndex={topicIndex}
      />
    </div>
  );
}
