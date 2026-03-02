"use client";
/**
 * Kids Dashboard — visual journey map for children.
 * Shows: mascot with costume, XP bar, subject progress islands, daily streak,
 * recent achievements, and motivational CTA.
 */
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProfileContext } from "@/lib/ProfileContext";
import { useLang } from "@/lib/LangContext";
import { getLevelProgress } from "@/lib/xp";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { getTopics, SUBJECTS } from "@/data/index";
import { isDailyDoneToday } from "@/lib/daily";

const COSTUME_IMAGES = [
  "/cleverli-wave.png",
  "/cleverli-sit-read.png",
  "/cleverli-run.png",
  "/cleverli-jump-star.png",
];
const COSTUME_ACCESSORY = ["", "🎩", "🦸", "👑"];

const GRADE_COLORS = [
  { bg: "from-blue-100 to-blue-200", border: "border-blue-300", text: "text-blue-800", btn: "bg-blue-500 hover:bg-blue-600" },
  { bg: "from-purple-100 to-purple-200", border: "border-purple-300", text: "text-purple-800", btn: "bg-purple-500 hover:bg-purple-600" },
  { bg: "from-orange-100 to-orange-200", border: "border-orange-300", text: "text-orange-800", btn: "bg-orange-500 hover:bg-orange-600" },
];

function getTopicDone(grade: number, subject: string, topicId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(`cleverli_${grade}_${subject}_${topicId}`);
    if (!raw) return false;
    const p = JSON.parse(raw);
    return p?.stars >= 1;
  } catch { return false; }
}

function SubjectIsland({ grade, subject, emoji, label, colorIdx }: {
  grade: number; subject: string; emoji: string; label: string; colorIdx: number;
}) {
  const topics = getTopics(grade, subject);
  const done = topics.filter(t => getTopicDone(grade, subject, t.id)).length;
  const pct = topics.length > 0 ? Math.round((done / topics.length) * 100) : 0;
  const c = GRADE_COLORS[colorIdx];

  return (
    <Link href={`/dashboard`}
      className={`bg-gradient-to-br ${c.bg} border-2 ${c.border} rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-all shadow-sm`}>
      <span className="text-4xl">{emoji}</span>
      <span className={`font-bold text-sm ${c.text}`}>{label}</span>
      <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-white/80 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-semibold ${c.text}`}>{done}/{topics.length}</span>
    </Link>
  );
}

function GradeSection({ grade, idx }: { grade: number; idx: number }) {
  const { lang, tr } = useLang();
  const label = lang === "fr" ? `${grade}re année` : lang === "it" ? `${grade}a classe` : lang === "en" ? `Grade ${grade}` : `${grade}. Klasse`;
  const c = GRADE_COLORS[idx];

  return (
    <div className={`bg-gradient-to-br ${c.bg} border-2 ${c.border} rounded-3xl p-4 space-y-3`}>
      <h2 className={`font-black text-base ${c.text}`}>{label}</h2>
      <div className="grid grid-cols-2 gap-2">
        {SUBJECTS.map((s, si) => (
          <SubjectIsland key={s.id} grade={grade} subject={s.id} emoji={s.emoji} label={s.name} colorIdx={(idx + si) % GRADE_COLORS.length} />
        ))}
      </div>
    </div>
  );
}

export default function KidsDashboard() {
  const { profile, level, loaded } = useProfileContext();
  const { lang, tr } = useLang();
  const [activeGrade, setActiveGrade] = useState(1);
  const pct = getLevelProgress(profile.xp);
  const dailyDone = isDailyDoneToday();

  const recentAchievements = useMemo(() =>
    profile.achievements
      .slice(-3)
      .map(id => ACHIEVEMENTS.find(a => a.id === id))
      .filter(Boolean),
    [profile.achievements]
  );

  const levelTitle =
    lang === "fr" ? level.titleFr :
    lang === "it" ? level.titleIt :
    lang === "en" ? level.titleEn :
    level.title;

  if (!loaded) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-5xl animate-bounce">🐿️</span>
    </div>
  );

  return (
    <main className="max-w-lg mx-auto px-4 py-6 pb-12 space-y-5">

      {/* ── Mascot hero ── */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-3xl p-5 flex items-center gap-4">
        <div className="relative shrink-0">
          <Image
            src={COSTUME_IMAGES[profile.costume] ?? "/cleverli-wave.png"}
            alt="Cleverli"
            width={96} height={96}
            className="drop-shadow-lg"
            style={{ animation: "float 3s ease-in-out infinite" }}
          />
          {profile.costume > 0 && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">
              {COSTUME_ACCESSORY[profile.costume]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{level.emoji}</span>
            <span className="font-black text-green-800">{levelTitle}</span>
          </div>
          {/* XP bar */}
          <div className="space-y-0.5">
            <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700 bg-green-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-green-700 font-semibold">
              <span>{profile.xp} XP</span>
              <span>⭐ {profile.achievements.length} Trophäen</span>
            </div>
          </div>
          {/* Streak */}
          {profile.dailyStreak >= 1 && (
            <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full text-xs font-bold">
              🔥 {profile.dailyStreak} {tr("streakDays")}
            </div>
          )}
        </div>
      </div>

      {/* ── Daily challenge ── */}
      <Link href="/daily"
        className={`flex items-center gap-3 rounded-2xl px-4 py-3 border-2 transition-all active:scale-95 ${dailyDone ? "bg-green-50 border-green-300" : "bg-amber-50 border-amber-300 hover:bg-amber-100"}`}>
        <span className="text-3xl">{dailyDone ? "✅" : "⚡"}</span>
        <div className="flex-1">
          <div className="font-bold text-amber-800 text-sm">
            {tr("dailyTitle")}
          </div>
          <div className="text-xs text-amber-600">
            {dailyDone
              ? tr("dailyDoneShort")
              : "+30 Bonus-XP"}
          </div>
        </div>
        <Image src={dailyDone ? "/cleverli-celebrate.png" : "/cleverli-run.png"} alt="" width={44} height={44} className="shrink-0" />
      </Link>

      {/* ── Recent achievements ── */}
      {recentAchievements.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-700 text-sm">Neueste Trophäen 🏆</h2>
            <Link href="/trophies" className="text-xs text-green-600 underline">Alle ansehen</Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recentAchievements.map(ach => ach && (
              <div key={ach.id} className="shrink-0 bg-white border border-gray-100 rounded-2xl px-3 py-2 flex items-center gap-2 shadow-sm">
                <span className="text-2xl">{ach.emoji}</span>
                <div>
                  <div className="text-xs font-bold text-gray-800 whitespace-nowrap">
                    {lang === "fr" ? ach.titleFr : lang === "it" ? ach.titleIt : lang === "en" ? ach.titleEn : ach.title}
                  </div>
                  <div className="text-[10px] text-gray-400">+{ach.xpReward} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Costume next unlock ── */}
      {profile.costume < 3 && profile.totalExercises < 100 && (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl opacity-40">
            {profile.costume === 0 ? "🎩" : profile.costume === 1 ? "🦸" : "👑"}
          </span>
          <div className="flex-1">
            <div className="text-xs font-bold text-gray-600">
              {profile.costume === 0
                ? `${tr("unlockHat")}: ${Math.max(0, 10 - profile.totalExercises)} ${tr("statExercises")}`
                : profile.costume === 1
                ? `${tr("unlockCape")}: ${Math.max(0, 50 - profile.totalExercises)} ${tr("statExercises")}`
                : `${tr("unlockCrown")}: ${Math.max(0, 100 - profile.totalExercises)} ${tr("statExercises")}`}
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-green-400 rounded-full transition-all" style={{
                width: `${profile.costume === 0
                  ? Math.min(100, (profile.totalExercises / 10) * 100)
                  : profile.costume === 1
                  ? Math.min(100, (profile.totalExercises / 50) * 100)
                  : Math.min(100, (profile.totalExercises / 100) * 100)}%`
              }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Grade tabs + progress islands ── */}
      <div className="space-y-3">
        <div className="flex gap-2">
          {[1, 2, 3].map((g, i) => (
            <button
              key={g}
              onClick={() => setActiveGrade(g)}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${activeGrade === g ? `${GRADE_COLORS[i].btn} text-white shadow-sm` : "bg-gray-100 text-gray-500"}`}
            >
              {lang === "fr" ? `${g}re` : lang === "it" ? `${g}a` : lang === "en" ? `Gr. ${g}` : `${g}. Kl.`}
            </button>
          ))}
        </div>
        <GradeSection grade={activeGrade} idx={activeGrade - 1} />
      </div>

      {/* ── CTA ── */}
      <div className="flex flex-col gap-3 items-center pt-2">
        <Link href="/dashboard"
          className="w-full text-center bg-green-600 text-white py-4 rounded-full font-black text-lg hover:bg-green-700 active:scale-95 transition-all shadow-md">
          🎒 {tr("keepLearning")}
        </Link>
        <Link href="/trophies" className="text-sm text-gray-400 underline">
          🏆 {tr("trophyRoom")}
        </Link>
      </div>

      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </main>
  );
}
