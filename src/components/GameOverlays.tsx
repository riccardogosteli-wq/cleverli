"use client";
import { useEffect, useState } from "react";
import { useProfileContext } from "@/lib/ProfileContext";
import { ACHIEVEMENTS, Achievement } from "@/lib/achievements";
import { getLevelForXp } from "@/lib/xp";
import XpPopup from "./XpPopup";
import LevelUpOverlay from "./LevelUpOverlay";
import AchievementToast from "./AchievementToast";

export default function GameOverlays() {
  const { xpGained, leveledUp, newAchievements, profile,
          clearXpGained, clearLeveledUp, clearNewAchievements } = useProfileContext();

  const [showXp, setShowXp] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);
  const [currentAch, setCurrentAch] = useState<Achievement | null>(null);

  // XP popup
  useEffect(() => {
    if (xpGained > 0) { setShowXp(true); }
  }, [xpGained]);

  // Level up overlay
  useEffect(() => {
    if (leveledUp) { setShowLevelUp(true); }
  }, [leveledUp]);

  // Achievement toasts — queue them so they show one at a time
  useEffect(() => {
    if (newAchievements.length === 0) return;
    const achs = newAchievements
      .map(id => ACHIEVEMENTS.find(a => a.id === id))
      .filter(Boolean) as Achievement[];
    setAchievementQueue(q => [...q, ...achs]);
    clearNewAchievements();
  }, [newAchievements, clearNewAchievements]);

  // Dequeue achievements
  useEffect(() => {
    if (!currentAch && achievementQueue.length > 0) {
      setCurrentAch(achievementQueue[0]);
      setAchievementQueue(q => q.slice(1));
    }
  }, [currentAch, achievementQueue]);

  return (
    <>
      {showXp && xpGained > 0 && (
        <XpPopup xp={xpGained} onDone={() => { setShowXp(false); clearXpGained(); }} />
      )}
      {showLevelUp && (
        <LevelUpOverlay
          level={getLevelForXp(profile.xp)}
          onDone={() => { setShowLevelUp(false); clearLeveledUp(); }}
        />
      )}
      {currentAch && (
        <AchievementToast
          achievement={currentAch}
          onDone={() => setCurrentAch(null)}
        />
      )}
    </>
  );
}
