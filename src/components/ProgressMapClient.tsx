"use client";

import { useEffect, useRef, useState } from "react";
import { generateRoadmapSVG } from "@/lib/roadmapGenerator";
import { buildProgressMap, getCheckpointProgress, isCheckpointCompleted, CHECKPOINT_LABELS } from "@/lib/progressMap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLang } from "@/lib/LangContext";
import { useSound } from "@/hooks/useSound";
import { useVoice } from "@/hooks/useVoice";

// Coin celebration messages by language and level
const COIN_VOICES: Record<string, Record<number, string>> = {
  de: {
    0: "Wow! Glückwunsch zur Cleverli Bronze-Münze! Du bist großartig!",
    1: "Fantastisch! Die Cleverli Silber-Münze ist dein! Du wirst immer besser!",
    2: "Unglaublich! Die Cleverli Gold-Münze! Du bist ein echter Champion!",
  },
  fr: {
    0: "Wow! Félicitations pour la pièce Cleverli bronze! Tu es formidable!",
    1: "Fantastique! La pièce Cleverli argent est à toi! Tu t'améliores de plus en plus!",
    2: "Incroyable! La pièce Cleverli or! Tu es un vrai champion!",
  },
  it: {
    0: "Wow! Congratulazioni per la moneta Cleverli bronzo! Sei fantastico!",
    1: "Fantastico! La moneta Cleverli argento è tua! Stai migliorando sempre di più!",
    2: "Incredibile! La moneta Cleverli oro! Sei un vero campione!",
  },
  en: {
    0: "Wow! Congratulations on the Cleverli bronze coin! You're amazing!",
    1: "Fantastic! The Cleverli silver coin is yours! You're getting better and better!",
    2: "Incredible! The Cleverli gold coin! You're a true champion!",
  },
};

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
  const { lang, tr } = useLang();
  const { play } = useSound();
  const { speak } = useVoice();
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
    const allCheckpointProgress = progressMap.checkpoints.map((cp) => {
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
    // ✅ Only show checkpoints that have actual exercises — filter out empty tiers
    // (topics with only difficulty-1 exercises would otherwise show fake ✅ on tier 2+3)
    const checkpointProgress = allCheckpointProgress.filter(cp => cp.total > 0);

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
      topicId,
    });

    setRoadmapSvg(svg);

    // ✅ Always update refs — even when celebrating, so next animation starts from correct position
    prevPlayerPctRef.current = curPct;
    prevCompletedRef.current = Object.fromEntries(checkpointProgress.map(c => [c.id, c.isCompleted]));

    if (celebrate) {
      setCelebrateCheckpoint(celebrate);
      setAnimKey(String(Date.now()));
      
      // Play celebration sound + voice when coin is unlocked
      // checkpointProgress is indexed 0, 1, 2 (Bronze, Silver, Gold coin)
      const checkpointIndex = checkpointProgress.findIndex(cp => cp.id === celebrate);
      if (checkpointIndex === 0) {
        play("achievement");  // Bronze coin
      } else if (checkpointIndex === 1) {
        play("levelup");       // Silver coin
      } else if (checkpointIndex === 2) {
        play("perfect");       // Gold coin
      }
      
      // Play voice celebration in the correct language (200ms delay for audio sync)
      setTimeout(() => {
        const langCode = lang === "de" ? "de" : lang === "fr" ? "fr" : lang === "it" ? "it" : "en";
        const message = COIN_VOICES[langCode]?.[checkpointIndex] || COIN_VOICES.en[checkpointIndex];
        speak(message);
      }, 200);
      
      const t = setTimeout(() => setCelebrateCheckpoint(null), 1200);
      return () => clearTimeout(t);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedExercisesByDifficulty, totalExercisesByDifficulty, topicTitle, isMobile, lang, play, speak]);



  // Overall progress for footer
  const totalCompleted = Object.values(completedExercisesByDifficulty).reduce((a, b) => a + b, 0);
  const totalExercises = Object.values(totalExercisesByDifficulty).reduce((a, b) => a + b, 0);
  const overallPct = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;
  const isFullyDone = overallPct === 100;

  if (!roadmapSvg) {
    return <div className="animate-pulse bg-green-50 rounded-2xl h-48 border border-green-100" />;
  }

  return (
    <div className="rounded-2xl border border-green-100 shadow-sm bg-white" style={{ overflow: "visible" }}>
      {/* Inline SVG — enables SMIL animations (animateMotion, animate) */}
      {/* key= forces React to remount the SVG node, restarting SMIL animations */}
      <div
        key={animKey}
        className="w-full"
        style={{ borderRadius: "12px 12px 0 0", overflow: "visible" }}
        dangerouslySetInnerHTML={{ __html: roadmapSvg }}
      />

      {/* Footer — only status, no duplicate counter (ExercisePlayer already shows X/Y Aufgaben) */}
      <div className="px-4 py-2 flex items-center gap-2 bg-white border-t border-gray-100">
        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
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
        {isFullyDone ? (
          <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
            {tr("mapCompleted")}
          </span>
        ) : overallPct > 0 ? (
          <span className="text-xs font-semibold text-green-700 shrink-0">{overallPct}%</span>
        ) : (
          <span className="text-xs text-gray-400 shrink-0">{tr("mapLetsGo")}</span>
        )}
      </div>
    </div>
  );
}
