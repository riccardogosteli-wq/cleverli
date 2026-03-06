"use client";

import { useEffect, useState } from "react";
import { generateRoadmapSVG, roadmapToDataURI } from "@/lib/roadmapGenerator";
import { buildProgressMap, getCheckpointProgress, isCheckpointCompleted, CHECKPOINT_LABELS } from "@/lib/progressMap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLang } from "@/lib/LangContext";

interface ProgressMapClientProps {
  topicId: string;
  topicTitle: string;
  grade: number;
  subject: string;
  completedExercisesByDifficulty: Record<number, number>;
  totalExercisesByDifficulty: Record<number, number>;
}

export default function ProgressMapClient({
  topicId,
  topicTitle,
  grade,
  subject,
  completedExercisesByDifficulty,
  totalExercisesByDifficulty,
}: ProgressMapClientProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { lang } = useLang();
  const [roadmapSvg, setRoadmapSvg] = useState<string | null>(null);

  const progressMap = buildProgressMap(
    topicId,
    topicTitle,
    grade,
    subject,
    totalExercisesByDifficulty
  );

  useEffect(() => {
    const checkpointProgress = progressMap.checkpoints.map((cp) => {
      const completed = completedExercisesByDifficulty[cp.difficulty] || 0;
      const total = totalExercisesByDifficulty[cp.difficulty] || 0;
      return {
        id: cp.id,
        label: CHECKPOINT_LABELS[lang as keyof typeof CHECKPOINT_LABELS]?.[cp.difficulty as 1 | 2 | 3] ?? cp.label,
        progress: getCheckpointProgress(completed, total),
        isCompleted: isCheckpointCompleted(completed, total),
        completed,
        total,
      };
    });

    const svg = generateRoadmapSVG({
      title: topicTitle,
      checkpoints: checkpointProgress,
      isMobile: isMobile ?? false,
    });

    setRoadmapSvg(svg);
  }, [completedExercisesByDifficulty, totalExercisesByDifficulty, topicTitle, isMobile, lang, progressMap.checkpoints]);

  if (!roadmapSvg) {
    return <div className="animate-pulse bg-green-50 rounded-2xl h-48 border border-green-100" />;
  }

  // Overall progress
  const totalCompleted = Object.values(completedExercisesByDifficulty).reduce((a, b) => a + b, 0);
  const totalExercises = Object.values(totalExercisesByDifficulty).reduce((a, b) => a + b, 0);
  const overallPct = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;

  const isFullyDone = overallPct === 100;

  return (
    <div className="rounded-2xl overflow-hidden border border-green-100 shadow-sm bg-white">
      {/* Roadmap SVG — full width, no padding box */}
      <img
        src={roadmapToDataURI(roadmapSvg)}
        alt={`Abenteuer-Pfad für ${topicTitle}`}
        className="w-full h-auto block"
        style={{ borderRadius: "12px 12px 0 0" }}
      />

      {/* Simple footer strip */}
      <div className="px-4 py-2.5 flex items-center gap-3 bg-white border-t border-gray-100">
        {/* Mini progress bar */}
        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${overallPct}%`,
              background: isFullyDone
                ? "linear-gradient(to right,#f59e0b,#d97706)"
                : "linear-gradient(to right,#34d399,#10b981)",
            }}
          />
        </div>

        {/* Progress text */}
        <span className="text-xs font-bold tabular-nums shrink-0" style={{ color: isFullyDone ? "#b45309" : "#059669" }}>
          {totalCompleted}/{totalExercises}
        </span>

        {/* Status badge */}
        {isFullyDone ? (
          <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
            👑 Abgeschlossen!
          </span>
        ) : overallPct > 0 ? (
          <span className="text-xs font-semibold text-green-700 shrink-0">
            {overallPct}% ✨
          </span>
        ) : (
          <span className="text-xs text-gray-400 shrink-0">Los geht's! 🌱</span>
        )}
      </div>
    </div>
  );
}
