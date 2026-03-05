"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { generateRoadmapSVG, roadmapToDataURI } from "@/lib/roadmapGenerator";
import { buildProgressMap, getCheckpointProgress, isCheckpointCompleted, MISSION_TITLES, CHECKPOINT_LABELS } from "@/lib/progressMap";
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
  const [unlockedMissions, setUnlockedMissions] = useState<number[]>([]);

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
      const progress = getCheckpointProgress(completed, total);
      const isCompleted = isCheckpointCompleted(completed, total);

      return {
        id: cp.id,
        label: CHECKPOINT_LABELS[lang as keyof typeof CHECKPOINT_LABELS][(cp.difficulty as 1 | 2 | 3)] || cp.label,
        progress,
        isCompleted,
        completed,
        total,
      };
    });

    const unlocked = checkpointProgress
      .filter((cp) => cp.isCompleted)
      .map((cp) => cp.id);
    setUnlockedMissions(unlocked);

    const svg = generateRoadmapSVG({
      title: topicTitle,
      checkpoints: checkpointProgress,
      isMobile: isMobile ?? false,
    });

    setRoadmapSvg(svg);
  }, [completedExercisesByDifficulty, totalExercisesByDifficulty, topicTitle, isMobile, lang, progressMap.checkpoints]);

  if (!roadmapSvg) {
    return <div className="animate-pulse bg-gray-200 rounded-lg h-64" />;
  }

  // Calculate overall stats
  const totalCompleted = Object.values(completedExercisesByDifficulty).reduce((a, b) => a + b, 0);
  const totalExercises = Object.values(totalExercisesByDifficulty).reduce((a, b) => a + b, 0);
  const overallProgress = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;

  return (
    <div className="space-y-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl border-2 border-blue-100 p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">🗺️ Learning Path</h3>
          <p className="text-sm text-gray-600 mt-1">{topicTitle}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-blue-600">{overallProgress}%</div>
          <p className="text-xs text-gray-500 mt-0.5">Complete</p>
        </div>
      </div>

      {/* OVERALL PROGRESS BAR */}
      <div className="bg-gray-200 rounded-full h-3 overflow-hidden shadow-sm">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {/* ROADMAP SVG */}
      <div className="rounded-xl overflow-hidden border border-blue-100 bg-white p-4">
        <img
          src={roadmapToDataURI(roadmapSvg)}
          alt={`Learning roadmap for ${topicTitle}`}
          className="w-full h-auto"
        />
      </div>

      {/* CHECKPOINT DETAILS - GRID */}
      <div className="grid grid-cols-3 gap-3">
        {progressMap.checkpoints.map((cp, idx) => {
          const completed = completedExercisesByDifficulty[cp.difficulty] || 0;
          const total = totalExercisesByDifficulty[cp.difficulty] || 0;
          const progress = getCheckpointProgress(completed, total);
          const isCompleted = progress === 100;

          return (
            <div
              key={cp.id}
              className={`rounded-lg p-3 text-center transition-all ${
                isCompleted
                  ? "bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300 shadow-md"
                  : "bg-gray-100 border border-gray-300"
              }`}
            >
              <div className="text-2xl mb-1">
                {isCompleted ? (idx === 0 ? "🥉" : idx === 1 ? "🥈" : "🥇") : "🔒"}
              </div>
              <p className="text-xs font-bold text-gray-700">{cp.label}</p>
              <p className="text-lg font-black text-gray-900 mt-1">{progress}%</p>
              <p className="text-xs text-gray-600 mt-1">
                {completed}/{total}
              </p>
            </div>
          );
        })}
      </div>

      {/* MISSION UNLOCKS */}
      {unlockedMissions.length > 0 && (
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 border-2 border-amber-300 shadow-sm">
          <p className="text-sm font-bold text-amber-900 mb-2">🎉 Missions Unlocked!</p>
          <div className="flex gap-2">
            {unlockedMissions.map((missionId) => (
              <div
                key={missionId}
                className="flex-1 bg-white rounded-lg p-2 text-center border border-amber-200"
              >
                <p className="text-lg">
                  {missionId === 1 ? "🥉" : missionId === 2 ? "🥈" : "🥇"}
                </p>
                <p className="text-xs font-semibold text-amber-900">
                  {MISSION_TITLES[lang as keyof typeof MISSION_TITLES][(missionId as 1 | 2 | 3)] || `Level ${missionId}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CALL TO ACTION */}
      {overallProgress < 100 ? (
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 text-center">
          <p className="text-sm font-semibold text-blue-900">
            ✨ Keep going! {100 - overallProgress}% to complete
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-lg p-4 text-center shadow-sm">
          <p className="text-lg font-black text-purple-900">👑 Topic Mastered!</p>
          <p className="text-sm text-purple-700 mt-1">You've completed all challenges</p>
        </div>
      )}
    </div>
  );
}
