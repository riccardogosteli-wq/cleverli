"use client";
import { Topic } from "@/types/exercise";
import ExercisePlayer from "@/components/ExercisePlayer";
import ProgressMapClient from "@/components/ProgressMapClient";
import { useSession } from "@/hooks/useSession";
import { countExercisesByDifficulty } from "@/lib/exerciseHelpers";
import { getTierProgress } from "@/lib/tierProgress";
import { useEffect, useState } from "react";
import { getProgressSubjects } from "@/data";
import { getEffectiveCompleted } from "@/lib/topicProgress";
import { getTopicTitle } from "@/data/topicTitles";
import { useLang } from "@/lib/LangContext";

interface Props { topic: Topic; grade: number; subject: string; allTopics: Topic[]; topicIndex: number; }

function loadProgress(grade: number, subject: string, topic: Topic) {
  for (const progressSubject of getProgressSubjects(grade, subject, topic.id)) {
    const raw = localStorage.getItem(`cleverli_${grade}_${progressSubject}_${topic.id}`);
    if (raw) {
      const progress = JSON.parse(raw);
      return {
        ...progress,
        completed: getEffectiveCompleted(progress, topic.exercises.length),
      };
    }
  }
  return {};
}

export default function TopicClient({ topic, grade, subject, allTopics, topicIndex }: Props) {
  const { session, isPremium, loaded, premiumChecked } = useSession();
  const { lang } = useLang();
  const topicTitle = getTopicTitle(topic.id, lang, topic.title);
  const [exerciseCounts, setExerciseCounts] = useState<ReturnType<typeof countExercisesByDifficulty> | null>(null);

  useEffect(() => {
    const progressData = loadProgress(grade, subject, topic);
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
    const refresh = () => {
      const progressData = loadProgress(grade, subject, topic);
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

  const waitingForPremium = loaded && !!session && !premiumChecked;
  if (waitingForPremium) {
    return (
      <div className="rounded-2xl border border-green-100 bg-green-50 px-5 py-6 text-center text-sm font-semibold text-green-800">
        Premium-Zugang wird geprüft...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProgressMapClient
        topicId={topic.id}
        topicTitle={topicTitle}
        grade={grade}
        subject={subject}
        completedExercisesByDifficulty={exerciseCounts.completed}
        totalExercisesByDifficulty={exerciseCounts.total}
      />
      <ExercisePlayer
        topic={topic}
        grade={grade}
        subject={subject}
        isPremium={loaded && premiumChecked ? isPremium : false}
        allTopics={allTopics}
        topicIndex={topicIndex}
      />
    </div>
  );
}
