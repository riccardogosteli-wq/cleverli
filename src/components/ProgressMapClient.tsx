"use client";

import { useEffect, useRef, useState } from "react";
import { generateRoadmapSVG } from "@/lib/roadmapGenerator";
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

  // Track previous state for animation
  const prevPlayerPctRef = useRef<number>(0);
  const prevCompletedRef = useRef<Record<number, boolean>>({});
  const [celebrateCheckpoint, setCelebrateCheckpoint] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState<string>("0");

  const progressMap = buildProgressMap(
    topicId, topicTitle, grade, subject, totalExercisesByDifficulty
  );

  useEffect(() => {
    const checkpointProgress = progressMap.checkpoints.map((cp) => {
      const completed = completedExercisesByDifficulty[cp.difficulty] || 0;
      const total = totalExercisesByDifficulty[cp.difficulty] || 0;
      return {
        id: cp.id,
        label: CHECKPOINT_LABELS[lang as keyof typeof CHECKPOINT_LABELS]?.[cp.difficulty as 1|2|3] ?? cp.label,
        progress: getCheckpointProgress(completed, total),
        isCompleted: isCheckpointCompleted(completed, total),
        completed,
        total,
      };
    });

    // Total progress 0–1
    const totalDone = checkpointProgress.reduce((s, c) => s + c.completed, 0);
    const totalAll  = checkpointProgress.reduce((s, c) => s + c.total, 0);
    const curPct = totalAll > 0 ? totalDone / totalAll : 0;

    // Detect newly completed checkpoints
    let celebrate: number | null = null;
    for (const cp of checkpointProgress) {
      const wasCompleted = prevCompletedRef.current[cp.id] ?? false;
      if (!wasCompleted && cp.isCompleted) {
        celebrate = cp.id;
        break;
      }
    }

    const prevPct = prevPlayerPctRef.current;
    const moving = Math.abs(curPct - prevPct) > 0.001;

    // Generate SVG with animation params
    const svg = generateRoadmapSVG({
      title: topicTitle,
      checkpoints: checkpointProgress,
      isMobile: isMobile ?? false,
      prevPlayerPct: prevPct,
      celebrateCheckpoint: celebrate,
      animKey: moving || celebrate ? String(Date.now()) : animKey,
    });

    setRoadmapSvg(svg);

    // ✅ Always update refs — even when celebrating, so next animation starts from correct position
    prevPlayerPctRef.current = curPct;
    prevCompletedRef.current = Object.fromEntries(checkpointProgress.map(c => [c.id, c.isCompleted]));

    if (celebrate) {
      setCelebrateCheckpoint(celebrate);
      setAnimKey(String(Date.now()));
      const t = setTimeout(() => setCelebrateCheckpoint(null), 1200);
      return () => clearTimeout(t);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedExercisesByDifficulty, totalExercisesByDifficulty, topicTitle, isMobile, lang]);



  // Overall progress for footer
  const totalCompleted = Object.values(completedExercisesByDifficulty).reduce((a, b) => a + b, 0);
  const totalExercises = Object.values(totalExercisesByDifficulty).reduce((a, b) => a + b, 0);
  const overallPct = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;
  const isFullyDone = overallPct === 100;

  if (!roadmapSvg) {
    return <div className="animate-pulse bg-green-50 rounded-2xl h-48 border border-green-100" />;
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-green-100 shadow-sm bg-white">
      {/* Inline SVG — enables SMIL animations (animateMotion, animate) */}
      {/* key= forces React to remount the SVG node, restarting SMIL animations */}
      <div
        key={animKey}
        className="w-full"
        style={{ borderRadius: "12px 12px 0 0", overflow: "hidden" }}
        dangerouslySetInnerHTML={{ __html: roadmapSvg }}
      />

      {/* Footer */}
      <div className="px-4 py-2.5 flex items-center gap-3 bg-white border-t border-gray-100">
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
        <span className="text-xs font-bold tabular-nums shrink-0" style={{ color: isFullyDone ? "#b45309" : "#059669" }}>
          {totalCompleted}/{totalExercises}
        </span>
        {isFullyDone ? (
          <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
            👑 Abgeschlossen!
          </span>
        ) : overallPct > 0 ? (
          <span className="text-xs font-semibold text-green-700 shrink-0">{overallPct}% ✨</span>
        ) : (
          <span className="text-xs text-gray-400 shrink-0">Los geht's! 🌱</span>
        )}
      </div>
    </div>
  );
}
