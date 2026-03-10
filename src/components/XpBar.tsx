"use client";
import Link from "next/link";
import { getLevelProgress } from "@/lib/xp";
import { useProfileContext } from "@/lib/ProfileContext";
import { useSession } from "@/hooks/useSession";

export default function XpBar() {
  const { profile, level, loaded } = useProfileContext();
  const { session } = useSession();
  // Don't show XP bar if not logged in — avoids stale data from localStorage appearing after logout
  if (!loaded || !session || profile.xp === 0) return null;

  const pct = getLevelProgress(profile.xp);

  return (
    <Link href="/missionen" className="flex items-center gap-2 group cursor-pointer" aria-label="Meine Missionen">
      {/* Emoji + level */}
      <span className="text-base shrink-0" title={level.title}>{level.emoji}</span>
      {/* XP bar */}
      <div className="relative w-16 sm:w-20 h-2 bg-gray-200 rounded-full overflow-hidden shrink-0">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: level.color }}
        />
      </div>
      {/* XP count — hidden on very small screens */}
      <span className="hidden sm:block text-xs text-gray-500 font-medium whitespace-nowrap shrink-0">
        {profile.xp} XP
      </span>
      {/* Coins */}
      {(profile.coins ?? 0) > 0 && (
        <span className="text-xs font-bold text-yellow-700 shrink-0">🪙{profile.coins}</span>
      )}
      {/* Streak */}
      {profile.dailyStreak >= 2 && (
        <span className="text-xs font-bold text-orange-500 shrink-0">🔥{profile.dailyStreak}</span>
      )}
    </Link>
  );
}
