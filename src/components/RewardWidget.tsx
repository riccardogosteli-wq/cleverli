"use client";
import { useState, useEffect } from "react";
import { loadRewards, getProgressValue, countTotalStars, checkAndUnlockRewards, TRIGGER_LABELS, Reward, ProgressSnapshot } from "@/lib/rewards";
import { useLang } from "@/lib/LangContext";
import RewardUnlockedModal from "./RewardUnlockedModal";

interface Props {
  profile: { totalExercises: number; totalTopicsComplete: number; dailyStreak: number };
}

export default function RewardWidget({ profile }: Props) {
  const { lang } = useLang();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [snap, setSnap] = useState<ProgressSnapshot | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Reward | null>(null);

  useEffect(() => {
    const totalStars = countTotalStars();
    const snapshot: ProgressSnapshot = { ...profile, totalStars };
    setSnap(snapshot);

    // Check for newly unlocked rewards
    const unlockedIds = checkAndUnlockRewards(snapshot);
    const all = loadRewards();
    setRewards(all);

    if (unlockedIds.length > 0) {
      const first = all.find(r => r.id === unlockedIds[0]);
      if (first) setNewlyUnlocked(first);
    }
  }, [profile.totalExercises, profile.totalTopicsComplete, profile.dailyStreak]);

  const active = rewards.filter(r => r.status === "active");
  const recentlyUnlocked = rewards.filter(r =>
    r.status === "unlocked" &&
    r.unlockedAt &&
    Date.now() - new Date(r.unlockedAt).getTime() < 24 * 60 * 60 * 1000
  );
  const visible = [...active, ...recentlyUnlocked].slice(0, 3);

  if (visible.length === 0) return null;

  const triggerLabel = (type: Reward["triggerType"]) =>
    TRIGGER_LABELS[type][lang as keyof typeof TRIGGER_LABELS[typeof type]] ?? TRIGGER_LABELS[type].de;

  return (
    <>
      {newlyUnlocked && (
        <RewardUnlockedModal
          reward={newlyUnlocked}
          onClose={() => setNewlyUnlocked(null)}
        />
      )}

      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-widest text-amber-600 px-1">
          🎁 {lang === "fr" ? "Mes récompenses" : lang === "it" ? "I miei premi" : lang === "en" ? "My rewards" : "Meine Belohnungen"}
        </div>

        {visible.map(r => {
          const current = snap ? getProgressValue(snap, r.triggerType) : 0;
          const pct = Math.min(100, Math.round((current / r.triggerValue) * 100));
          const isUnlocked = r.status === "unlocked";

          return (
            <div key={r.id}
              className={`rounded-2xl px-4 py-3 border-2 ${
                isUnlocked
                  ? "bg-amber-50 border-amber-300 shadow-md"
                  : "bg-white border-gray-100 shadow-sm"
              }`}>
              <div className="flex items-center gap-3">
                <span className={`text-3xl ${isUnlocked ? "animate-bounce" : ""}`}>{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 text-sm truncate">{r.title}</div>
                  {isUnlocked ? (
                    <div className="text-xs text-amber-700 font-semibold mt-0.5">
                      🎉 Zeig das Mama oder Papa!
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 mt-0.5">
                      {current} / {r.triggerValue} {triggerLabel(r.triggerType)}
                    </div>
                  )}
                </div>
                {isUnlocked && (
                  <div className="text-2xl shrink-0">🔓</div>
                )}
              </div>

              {!isUnlocked && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{pct}%</span>
                    <span>{r.triggerValue - current} {lang === "de" ? "fehlt noch" : lang === "fr" ? "restants" : lang === "it" ? "mancano" : "to go"}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
