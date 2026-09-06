"use client";
import { useSearchParams } from "next/navigation";
import { Topic } from "@/types/exercise";
import ExercisePlayer from "@/components/ExercisePlayer";
import ProgressMapClient from "@/components/ProgressMapClient";
import { useSession } from "@/hooks/useSession";
import { countExercisesByDifficulty } from "@/lib/exerciseHelpers";
import { getTierProgress } from "@/lib/tierProgress";
import { useEffect, useRef, useState } from "react";
import { getTopicTitle } from "@/data/topicTitles";
import { useLang } from "@/lib/LangContext";
import { getActiveProfileId } from "@/lib/family";
import { readTopicProgressForChild, type NormalisedTopicProgress } from "@/lib/reportingProgress";

interface Props { topic: Topic; grade: number; subject: string; nextTopicId?: string | null; }

function loadProgress(grade: number, subject: string, topic: Topic): NormalisedTopicProgress | null {
  const activeChildId = getActiveProfileId();
  return readTopicProgressForChild(grade, subject, topic, activeChildId);
}

export default function TopicClient({ topic, grade, subject, nextTopicId = null }: Props) {
  const searchParams = useSearchParams();
  const focusExerciseId = searchParams.get("exercise");
  const { session, isPremium, loaded, premiumChecked } = useSession();
  const { lang } = useLang();
  const topicTitle = getTopicTitle(topic.id, lang, topic.title);
  const [exerciseCounts, setExerciseCounts] = useState<ReturnType<typeof countExercisesByDifficulty> | null>(null);
  const exerciseSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const progressData = loadProgress(grade, subject, topic);
    const totalCompleted = progressData?.completed ?? 0;

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

  useEffect(() => {
    if (!focusExerciseId) return;
    window.requestAnimationFrame(() => {
      exerciseSectionRef.current?.scrollIntoView({ block: "start" });
    });
  }, [focusExerciseId]);

  // Re-read from localStorage whenever ExercisePlayer saves (after each answer)
  // By subscribing to the storage event we refresh the roadmap live.
  useEffect(() => {
    const refresh = () => {
      const progressData = loadProgress(grade, subject, topic);
      const totalCompleted = progressData?.completed ?? 0;
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
    <div className="flex flex-col gap-6">
      <div className="order-2 sm:order-1">
        <ProgressMapClient
          topicId={topic.id}
          topicTitle={topicTitle}
          grade={grade}
          subject={subject}
          completedExercisesByDifficulty={exerciseCounts.completed}
          totalExercisesByDifficulty={exerciseCounts.total}
        />
      </div>
      <div id="exercise" ref={exerciseSectionRef} className="scroll-mt-20 order-1 sm:order-2">
        <ExercisePlayer
          topic={topic}
          grade={grade}
          subject={subject}
          isPremium={loaded && premiumChecked ? isPremium : false}
          nextTopicId={nextTopicId}
          focusExerciseId={focusExerciseId}
        />
      </div>
    </div>
  );
}
