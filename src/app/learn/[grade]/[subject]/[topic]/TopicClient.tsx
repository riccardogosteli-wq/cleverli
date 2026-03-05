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

  // Load progress from localStorage and calculate counts by difficulty
  useEffect(() => {
    const key = `cleverli_${grade}_${subject}_${topic.id}`;
    const progressData = JSON.parse(localStorage.getItem(key) ?? "{}");
    
    // Get total exercises from progress data
    const totalExercises = progressData.completed ?? 0;
    const score = progressData.score ?? 0;

    // Count all exercises by difficulty
    const allCounts = countExercisesByDifficulty(topic.exercises, []);
    
    // If there's progress data, calculate completed per difficulty
    // For now, proportionally distribute the completed count
    const completedPerDifficulty: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    
    if (totalExercises > 0) {
      // Estimate: distribute completed across difficulties proportionally
      [1, 2, 3].forEach((diff) => {
        const totalForDiff = allCounts.total[diff] || 0;
        if (totalForDiff > 0 && totalExercises > 0) {
          // Calculate proportion and estimate completed for this difficulty
          const proportion = totalForDiff / Math.max(1, Object.values(allCounts.total).reduce((a, b) => a + b, 0));
          completedPerDifficulty[diff] = Math.floor(totalExercises * proportion);
        }
      });
    }

    const counts = {
      completed: completedPerDifficulty,
      total: allCounts.total,
    };
    
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
