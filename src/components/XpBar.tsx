"use client";
import Link from "next/link";
import { getLevelProgress } from "@/lib/xp";
import { useProfileContext } from "@/lib/ProfileContext";

export default function XpBar() {
  const { profile, level, loaded } = useProfileContext();
  if (!loaded || profile.xp === 0) return null;

  const pct = getLevelProgress(profile.xp);

  return (
    <Link href="/trophies" className="flex items-center gap-2 group cursor-pointer" aria-label="Meine Trophäen">
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
      {/* Streak */}
      {profile.dailyStreak >= 2 && (
        <span className="text-xs font-bold text-orange-500 shrink-0">🔥{profile.dailyStreak}</span>
      )}
    </Link>
  );
}
