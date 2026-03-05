"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { generateRoadmapSVG, roadmapToDataURI } from "@/lib/roadmapGenerator";
import { buildProgressMap, getCheckpointProgress, isCheckpointCompleted, MISSION_TITLES, CHECKPOINT_LABELS } from "@/lib/progressMap";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useLang } from "@/lib/LangContext";

interface ProgressMapClientProps {
  topicId: string;
  topicTitle: string;
  grade: number;
  subject: string;
  completedExercisesByDifficulty: Record<number, number>; // { 1: 10, 2: 15, 3: 5 }
  totalExercisesByDifficulty: Record<number, number>;      // { 1: 15, 2: 20, 3: 15 }
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
  const { li } = useLang();
  const [roadmapSvg, setRoadmapSvg] = useState<string | null>(null);
  const [unlockedMissions, setUnlockedMissions] = useState<number[]>([]);

  // Build progress map
  const progressMap = buildProgressMap(
    topicId,
    topicTitle,
    grade,
    subject,
    totalExercisesByDifficulty
  );

  // Calculate progress per checkpoint and generate roadmap
  useEffect(() => {
    const checkpointProgress = progressMap.checkpoints.map((cp) => {
      const completed = completedExercisesByDifficulty[cp.difficulty] || 0;
      const total = totalExercisesByDifficulty[cp.difficulty] || 0;
      const progress = getCheckpointProgress(completed, total);
      const isCompleted = isCheckpointCompleted(completed, total);

      return {
        id: cp.id,
        label: CHECKPOINT_LABELS[li as keyof typeof CHECKPOINT_LABELS][cp.difficulty] || cp.label,
        progress,
        isCompleted,
        exerciseCount: total,
      };
    });

    // Track unlocked missions
    const unlocked = checkpointProgress
      .filter((cp) => cp.isCompleted)
      .map((cp) => cp.id);
    setUnlockedMissions(unlocked);

    // Generate SVG
    const svg = generateRoadmapSVG({
      title: topicTitle,
      checkpoints: checkpointProgress,
      isMobile: isMobile ?? false,
    });

    setRoadmapSvg(svg);
  }, [completedExercisesByDifficulty, totalExercisesByDifficulty, topicTitle, isMobile, li, progressMap.checkpoints]);

  if (!roadmapSvg) {
    return <div className="animate-pulse bg-gray-200 rounded-lg h-64" />;
  }

  return (
    <div className="space-y-6 bg-white rounded-lg border border-gray-200 p-6">
      {/* Roadmap SVG */}
      <div className="overflow-x-auto">
        <img
          src={roadmapToDataURI(roadmapSvg)}
          alt={`Roadmap für ${topicTitle}`}
          className="w-full h-auto min-h-[200px]"
        />
      </div>

      {/* Mission Unlocks */}
      {unlockedMissions.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-3">
            🎯 Missionen freigeschaltet
          </h3>
          <div className="grid gap-2">
            {unlockedMissions.map((missionId) => (
              <div
                key={missionId}
                className="bg-white rounded-lg p-3 border-l-4 border-amber-500 flex items-center gap-3"
              >
                <span className="text-xl">
                  {missionId === 1 ? "🥉" : missionId === 2 ? "🥈" : "🥇"}
                </span>
                <div>
                  <p className="font-semibold text-amber-900">
                    {MISSION_TITLES[li as keyof typeof MISSION_TITLES][missionId] || `Mission ${missionId}`}
                  </p>
                  <p className="text-sm text-amber-700">
                    {missionId === 1 &&
                      "Du hast alle einfachen Aufgaben abgeschlossen! Großartig! 🎉"}
                    {missionId === 2 &&
                      "Du wirst immer besser! Mittlere Aufgaben gemeistert! 🚀"}
                    {missionId === 3 &&
                      "Du bist ein Meister! Alle schweren Aufgaben gelöst! 👑"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">📊 Dein Fortschritt</h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {progressMap.checkpoints.map((cp) => {
            const completed = completedExercisesByDifficulty[cp.difficulty] || 0;
            const total = totalExercisesByDifficulty[cp.difficulty] || 0;
            const progress = getCheckpointProgress(completed, total);

            return (
              <div key={cp.id} className="bg-white rounded p-2 text-center">
                <p className="font-semibold text-blue-900">{cp.label}</p>
                <p className="text-xs text-gray-600">
                  {completed} / {total}
                </p>
                <p className="font-bold text-blue-600">{Math.round(progress)}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      {unlockedMissions.length < 3 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-800">
            ✨ Löse mehr Aufgaben, um weitere Missionen freizuschalten!
          </p>
          <p className="text-xs text-green-700 mt-1">
            Jede schwierigere Aufgabe bringt dich näher zum Meister-Status.
          </p>
        </div>
      )}

      {unlockedMissions.length === 3 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm font-semibold text-purple-900">
            🏆 Alle Missionen abgeschlossen!
          </p>
          <p className="text-xs text-purple-700 mt-1">
            Du bist jetzt ein Meister in {topicTitle}! Glückwunsch! 👑
          </p>
        </div>
      )}
    </div>
  );
}
