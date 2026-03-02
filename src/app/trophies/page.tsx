"use client";
import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProfileContext } from "@/lib/ProfileContext";
import { useLang } from "@/lib/LangContext";
import { ACHIEVEMENTS, RARITY_COLORS, RARITY_GLOW, Achievement } from "@/lib/achievements";
import { LEVELS, getLevelProgress, getNextLevel } from "@/lib/xp";

const COSTUME_LABELS = ["", "🎩 Hut", "🦸 Cape", "👑 Krone"];
const COSTUME_IMAGES = [
  "/cleverli-wave.png",
  "/cleverli-sit-read.png",
  "/cleverli-run.png",
  "/cleverli-jump-star.png",
];

function RarityBadge({ rarity }: { rarity: Achievement["rarity"] }) {
  const { tr } = useLang();
  const labels: Record<Achievement["rarity"], string> = {
    common: tr("rarityCommon"), rare: tr("rarityRare"), epic: tr("rarityEpic"), legendary: tr("rarityLegendary")
  };
  const colors: Record<Achievement["rarity"], string> = {
    common: "bg-gray-100 text-gray-500",
    rare: "bg-blue-100 text-blue-600",
    epic: "bg-purple-100 text-purple-700",
    legendary: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full ${colors[rarity]}`}>
      {labels[rarity]}
    </span>
  );
}

export default function TrophiesPage() {
  const { profile, level, loaded } = useProfileContext();
  const { lang, tr } = useLang();

  const nextLevel = getNextLevel(profile.xp);
  const pct = getLevelProgress(profile.xp);

  const earned = useMemo(() => new Set(profile.achievements), [profile.achievements]);

  // Group achievements by rarity for display
  const groups: Achievement["rarity"][] = ["legendary", "epic", "rare", "common"];

  if (!loaded) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-4xl animate-bounce">🐿️</div>
    </div>
  );

  const levelTitle =
    lang === "fr" ? level.titleFr :
    lang === "it" ? level.titleIt :
    lang === "en" ? level.titleEn :
    level.title;

  const xpToNext = nextLevel ? nextLevel.minXp - profile.xp : 0;

  return (
    <main className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-12">

      {/* ── Hero: Cleverli + level ── */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 text-center space-y-3">
        <div className="relative inline-block">
          <Image
            src={COSTUME_IMAGES[profile.costume] ?? "/cleverli-wave.png"}
            alt="Cleverli"
            width={110}
            height={110}
            className="mx-auto drop-shadow-lg"
            style={{ animation: "float 3s ease-in-out infinite" }}
          />
          {profile.costume > 0 && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl">
              {profile.costume === 3 ? "👑" : profile.costume === 2 ? "🦸" : "🎩"}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{level.emoji}</span>
            <h1 className="text-xl font-black text-gray-800">{levelTitle}</h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Level {level.id}</p>
        </div>

        {/* XP bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{profile.xp} XP</span>
            {nextLevel && <span>→ {nextLevel.minXp} XP für {lang === "fr" ? nextLevel.titleFr : lang === "it" ? nextLevel.titleIt : lang === "en" ? nextLevel.titleEn : nextLevel.title}</span>}
            {!nextLevel && <span>Max Level! 🏆</span>}
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: level.color }}
            />
          </div>
          {nextLevel && (
            <p className="text-xs text-gray-400 text-center">
              Noch {xpToNext} XP bis zum nächsten Level
            </p>
          )}
        </div>

        {/* Costume unlock hint */}
        {profile.costume < 3 && (
          <div className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2">
            {profile.costume === 0 && `🎩 Hut bei 10 Aufgaben (${Math.max(0, 10 - profile.totalExercises)} fehlen)`}
            {profile.costume === 1 && `🦸 Cape bei 50 Aufgaben (${Math.max(0, 50 - profile.totalExercises)} fehlen)`}
            {profile.costume === 2 && `👑 Krone bei 100 Aufgaben (${Math.max(0, 100 - profile.totalExercises)} fehlen)`}
          </div>
        )}
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: tr("statExercises"), value: profile.totalExercises, emoji: "✏️" },
          { label: tr("statStreak"), value: `${profile.dailyStreak}🔥`, emoji: "" },
          { label: tr("statTrophies"), value: `${profile.achievements.length}/${ACHIEVEMENTS.length}`, emoji: "🏆" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <div className="text-xl font-black text-gray-800">{s.emoji}{s.value}</div>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Level track ── */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-700 text-sm">Level-Weg 🗺️</h2>
          <span className="text-xs text-gray-400 bg-gray-50 rounded-full px-2 py-0.5">
            {level.id}/{LEVELS.length}
          </span>
        </div>

        {/* Track */}
        <div className="flex items-end justify-between gap-1 px-1">
          {LEVELS.map((l, i) => {
            const isActive = level.id === l.id;
            const isDone   = level.id > l.id;
            const isFuture = level.id < l.id;

            const lTitle = lang === "fr" ? l.titleFr : lang === "it" ? l.titleIt : lang === "en" ? l.titleEn : l.title;

            return (
              <div key={l.id} className="flex flex-col items-center gap-1.5 shrink-0" style={{ flex: 1 }}>
                {/* Connecting bar (LEFT of icon) */}
                {i > 0 && (
                  <div className="absolute" style={{ display: "none" }} />
                )}

                {/* Icon circle */}
                <div className="relative flex flex-col items-center">
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{ backgroundColor: l.color, transform: "scale(1.4)" }}
                    />
                  )}
                  <div
                    className={`relative flex items-center justify-center rounded-full font-bold transition-all duration-500 ${
                      isActive
                        ? "ring-4 ring-offset-2 shadow-lg"
                        : isDone
                          ? "shadow-md"
                          : "opacity-35 grayscale"
                    }`}
                    style={{
                      width: isActive ? 60 : 46,
                      height: isActive ? 60 : 46,
                      fontSize: isActive ? "1.75rem" : "1.3rem",
                      backgroundColor: isDone || isActive ? l.color + "33" : "#f3f4f6",
                      borderWidth: 3,
                      borderStyle: "solid",
                      borderColor: isDone || isActive ? l.color : "#e5e7eb",

                      boxShadow: isActive ? `0 0 20px ${l.color}88` : isDone ? `0 2px 8px ${l.color}44` : "none",
                    }}
                  >
                    {isDone ? "✓" : isFuture ? "🔒" : l.emoji}
                  </div>

                  {/* "JETZT" badge on active */}
                  {isActive && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: l.color }}>
                        Jetzt
                      </span>
                    </div>
                  )}
                </div>

                {/* Label */}
                <div className={`text-center leading-tight transition-all ${isActive ? "font-bold" : "font-medium opacity-50"}`}
                  style={{ fontSize: "9px", color: isActive ? l.color : "#9ca3af", maxWidth: 56 }}>
                  {lTitle}
                </div>
              </div>
            );
          })}
        </div>

        {/* Connecting line beneath the icons */}
        <div className="relative mx-4 -mt-8 mb-5" style={{ zIndex: 0 }}>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${((level.id - 1) / (LEVELS.length - 1)) * 100 + pct / (LEVELS.length - 1)}%`,
                background: `linear-gradient(to right, #86efac, ${level.color})`,
              }}
            />
          </div>
        </div>

        {/* XP to next level */}
        {nextLevel && (
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs text-gray-400">
              noch <strong className="text-gray-600">{xpToNext} XP</strong> bis{" "}
              <strong style={{ color: nextLevel.color }}>
                {nextLevel.emoji} {lang === "fr" ? nextLevel.titleFr : lang === "it" ? nextLevel.titleIt : lang === "en" ? nextLevel.titleEn : nextLevel.title}
              </strong>
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
        )}
        {!nextLevel && (
          <div className="text-center text-xs font-bold text-amber-600 mt-1">
            🏆 Max Level erreicht!
          </div>
        )}
      </div>

      {/* ── Trophy room ── */}
      <div className="space-y-4">
        <h2 className="font-bold text-gray-700 text-sm">
          Trophäen-Zimmer 🏆 ({profile.achievements.length}/{ACHIEVEMENTS.length})
        </h2>

        {groups.map(rarity => {
          const inGroup = ACHIEVEMENTS.filter(a => a.rarity === rarity);
          return (
            <div key={rarity}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                {rarity === "legendary" ? "⚡ Legendär" : rarity === "epic" ? "💜 Episch" : rarity === "rare" ? "🔵 Selten" : "⚪ Gewöhnlich"}
                <span className="ml-2 font-normal text-gray-300">
                  {inGroup.filter(a => earned.has(a.id)).length}/{inGroup.length}
                </span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {inGroup.map(ach => {
                  const isEarned = earned.has(ach.id);
                  const title = lang === "fr" ? ach.titleFr : lang === "it" ? ach.titleIt : lang === "en" ? ach.titleEn : ach.title;
                  const desc  = lang === "fr" ? ach.descFr  : lang === "it" ? ach.descIt  : lang === "en" ? ach.descEn  : ach.desc;
                  return (
                    <div
                      key={ach.id}
                      className={`bg-gradient-to-br ${isEarned ? RARITY_COLORS[ach.rarity] : "from-gray-50 to-gray-100 border-gray-100"} border-2 rounded-2xl p-3 flex items-start gap-2.5 shadow-sm ${isEarned && RARITY_GLOW[ach.rarity] ? `shadow-md ${RARITY_GLOW[ach.rarity]}` : ""}`}
                      style={{ opacity: isEarned ? 1 : 0.4 }}
                    >
                      <div className="text-2xl shrink-0" style={{ filter: isEarned ? "none" : "grayscale(1)" }}>
                        {isEarned ? ach.emoji : "🔒"}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-800 leading-tight mb-0.5">{isEarned ? title : "???"}</div>
                        {isEarned && <div className="text-[10px] text-gray-500 leading-tight">{desc}</div>}
                        {isEarned && ach.xpReward > 0 && (
                          <div className="text-[10px] text-green-600 font-semibold mt-0.5">+{ach.xpReward} XP</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center pt-2">
        <Link href="/dashboard"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md">
          🎒 Weiterlernen
        </Link>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </main>
  );
}
