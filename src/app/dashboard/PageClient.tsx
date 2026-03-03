"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OnboardingModal from "@/components/OnboardingModal";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { getTopics, SUBJECTS } from "@/data/index";
import { getTopicTitle } from "@/data/topicTitles";
import { isDailyDoneToday } from "@/lib/daily";
import { useProfile } from "@/hooks/useProfile";
import { getLevelForXp } from "@/lib/xp";
import RewardWidget from "@/components/RewardWidget";

const GRADE_COLORS = [
  { base: "bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100 active:bg-blue-200", emoji: "🐣" },
  { base: "bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-100 active:bg-purple-200", emoji: "🦊" },
  { base: "bg-orange-50 border-orange-300 text-orange-800 hover:bg-orange-100 active:bg-orange-200", emoji: "🦁" },
];

const SUBJECT_META: Record<string, {
  emoji: string;
  iconBg: string;
  subtitle: { de: string; fr: string; it: string; en: string };
  label: { de: string; fr: string; it: string; en: string };
}> = {
  math:    {
    emoji: "🔢", iconBg: "bg-blue-100",
    label:    { de: "Mathematik",   fr: "Mathématiques", it: "Matematica",   en: "Maths" },
    subtitle: { de: "Zahlen & Rechnen", fr: "Chiffres & calcul", it: "Numeri & calcolo", en: "Numbers & Maths" },
  },
  german:  {
    emoji: "📖", iconBg: "bg-yellow-100",
    label:    { de: "Deutsch",      fr: "Allemand",      it: "Tedesco",      en: "German" },
    subtitle: { de: "Lesen & Schreiben", fr: "Lecture & écriture", it: "Lettura & scrittura", en: "Reading & Writing" },
  },
  science: {
    emoji: "🌍", iconBg: "bg-green-100",
    label:    { de: "NMG",          fr: "NHS",           it: "NUS",          en: "Science" },
    subtitle: { de: "Natur, Mensch, Gesellschaft", fr: "Nature, Humain et Société", it: "Natura, Uomo e Società", en: "Nature & Society" },
  },
};

const GRADE_KEY = "cleverli_last_grade";

function getProgress(grade: number, subject: string, topicId: string) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`cleverli_${grade}_${subject}_${topicId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function DashboardInner() {
  const { tr, lang } = useLang();
  const { profile } = useProfile();
  const searchParams = useSearchParams();
  const preselectedSubject = searchParams.get("subject");

  const [grade, setGrade] = useState<number | null>(null);
  const [subject, setSubject] = useState<string | null>(preselectedSubject);
  const [dailyDone, setDailyDone] = useState(false);

  // Restore last-used grade from localStorage
  useEffect(() => {
    setDailyDone(isDailyDoneToday());
    if (!preselectedSubject) {
      const saved = localStorage.getItem(GRADE_KEY);
      if (saved) setGrade(parseInt(saved));
    }
  }, []);

  useEffect(() => {
    setSubject(preselectedSubject);
    if (preselectedSubject) setGrade(null);
  }, [preselectedSubject]);

  const chooseGrade = (g: number) => {
    localStorage.setItem(GRADE_KEY, String(g));
    setGrade(g);
  };

  const subjectL = (id: string, key: "label" | "subtitle") => {
    const meta = SUBJECT_META[id];
    if (!meta) return id;
    return meta[key][lang as keyof typeof meta.label] ?? meta[key].de;
  };

  const level = profile ? getLevelForXp(profile.xp) : null;
  const nextLevel = profile && level ? (level.id < 5 ? getLevelForXp(profile.xp + 1) : null) : null;

  // Localized level title
  const levelTitle = (lv: ReturnType<typeof getLevelForXp>) => {
    if (lang === "fr") return lv.titleFr;
    if (lang === "it") return lv.titleIt;
    if (lang === "en") return lv.titleEn;
    return lv.title;
  };

  // ── Shared sidebar (shows on md+ for all steps) ──────────────────────────
  const Sidebar = () => {
    if (!profile || !level) return null;
    const xpToNext = nextLevel ? nextLevel.minXp - profile.xp : 0;
    const xpPct = nextLevel
      ? Math.round((profile.xp - level.minXp) / (nextLevel.minXp - level.minXp) * 100)
      : 100;
    return (
      <aside className="space-y-4">
        {/* XP strip */}
        {(profile.xp > 0 || profile.dailyStreak > 0) && (
          <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
            <span className="text-2xl">{level.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-800 text-sm">{levelTitle(level)}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${xpPct}%`, backgroundColor: level.color }} />
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {nextLevel ? `${xpToNext} XP` : `${profile.xp} XP`}
                </span>
              </div>
            </div>
            {profile.dailyStreak >= 2 && (
              <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
                <span className="text-base">🔥</span>
                <span className="text-sm font-bold text-orange-700">{profile.dailyStreak}</span>
              </div>
            )}
          </div>
        )}
        {/* Reward widget */}
        <RewardWidget profile={{
          totalExercises: profile.totalExercises,
          totalTopicsComplete: profile.totalTopicsComplete,
          dailyStreak: profile.dailyStreak,
        }} />
        {/* Daily challenge */}
        <Link href="/daily"
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 border-2 transition-all active:scale-95 ${dailyDone ? "bg-green-50 border-green-300 opacity-70" : "bg-amber-50 border-amber-300 hover:bg-amber-100"}`}>
          <span className="text-3xl">{dailyDone ? "✅" : "⚡"}</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-amber-800 text-sm">
              {lang === "fr" ? "Défi du jour" : lang === "it" ? "Sfida del giorno" : lang === "en" ? "Daily Challenge" : "Tagesaufgabe"}
            </div>
            <div className="text-xs text-amber-600">
              {dailyDone
                ? (lang === "fr" ? "Terminé ! Reviens demain." : lang === "it" ? "Fatto! Torna domani." : lang === "en" ? "Done! Come back tomorrow." : "Erledigt! Morgen gibt es eine neue.")
                : (lang === "fr" ? "+30 XP bonus · Un essai par jour" : lang === "it" ? "+30 XP bonus" : lang === "en" ? "+30 Bonus XP · One try per day" : "+30 Bonus-XP · Einmal pro Tag")}
            </div>
          </div>
          <Image src={dailyDone ? "/cleverli-celebrate.png" : "/cleverli-run.png"}
            alt={dailyDone ? "Cleverli feiert" : "Cleverli läuft"}
            width={44} height={44} className="drop-shadow-sm shrink-0" />
        </Link>
      </aside>
    );
  };

  // ── STEP 1: Choose grade ──────────────────────────────────────────────────
  if (!grade) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="md:grid md:grid-cols-[280px_1fr] md:gap-8">
          {/* Sidebar — hidden on mobile (shown inline below) */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          <div className="space-y-5">
            {/* Mobile-only: sidebar content inline */}
            <div className="md:hidden space-y-4">
              <Sidebar />
            </div>

            {/* Grade picker header */}
            <div className="text-center space-y-1">
              {subject && SUBJECT_META[subject] && (
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm font-semibold px-3 py-1.5 rounded-full mb-1">
                  {SUBJECT_META[subject].emoji} {subjectL(subject, "subtitle")}
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-800">
                {lang === "fr" ? "Quelle classe?" : lang === "it" ? "Che classe?" : lang === "en" ? "Which class?" : "In welcher Klasse bist du?"}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((g, i) => (
                <button key={g} onClick={() => chooseGrade(g)}
                  style={{ minHeight: "100px", transition: "all 0.15s ease" }}
                  className={`border-2 rounded-2xl font-bold active:scale-95 flex flex-col items-center justify-center gap-1 ${GRADE_COLORS[i].base}`}>
                  <div className="text-3xl">{GRADE_COLORS[i].emoji}</div>
                  <div className="text-2xl font-black">{g}.</div>
                  <div className="text-xs font-medium opacity-70">{tr("gradeLabel")}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 opacity-40">
              {[4, 5, 6].map(g => (
                <div key={g} style={{ minHeight: "100px" }}
                  className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-not-allowed gap-1">
                  <div className="text-xl font-bold">{g}.</div>
                  <div className="text-xs">🚀 {tr("comingSoonShort")}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400">
              {tr("gradesComingSoon")} · <a href="mailto:hello@cleverli.ch" className="text-green-600 underline">{tr("notifyMe")}</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 2: Choose subject (only if NOT pre-selected from URL) ────────────
  if (!subject) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="md:grid md:grid-cols-[280px_1fr] md:gap-8">
          <div className="hidden md:block"><Sidebar /></div>
          <div className="space-y-5">
            <div className="md:hidden mb-4"><Sidebar /></div>
            <div className="flex items-center gap-2">
              <button onClick={() => setGrade(null)} className="text-sm text-gray-400 hover:text-gray-600 py-2 pr-3 min-w-[44px]">←</button>
              <span className="text-2xl">{GRADE_COLORS[grade-1].emoji}</span>
              <h2 className="text-lg font-bold text-gray-800">
                {grade}. {tr("gradeLabel")} — {lang === "fr" ? "Que veux-tu apprendre?" : lang === "it" ? "Cosa vuoi imparare?" : lang === "en" ? "What to learn?" : "Was lernen?"}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-1">
              {SUBJECTS.map(s => {
                const meta = SUBJECT_META[s.id];
                const topics = getTopics(grade, s.id);
                const done = topics.filter(t => getProgress(grade, s.id, t.id)).length;
                return (
                  <button key={s.id} onClick={() => setSubject(s.id)}
                    style={{ minHeight: "80px", transition: "all 0.15s ease" }}
                    className={`border-2 rounded-2xl font-bold active:scale-95 flex items-center gap-4 px-5 text-left ${s.color}`}>
                    <div className={`w-12 h-12 ${meta?.iconBg ?? "bg-gray-100"} rounded-xl flex items-center justify-center text-2xl shrink-0`}>
                      {s.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base">{subjectL(s.id, "label")}</div>
                      <div className="text-xs font-normal opacity-70">{subjectL(s.id, "subtitle")}</div>
                    </div>
                    {done > 0 && (
                      <div className="text-xs font-semibold opacity-60 shrink-0">{done}/{topics.length} ✓</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 3: Topic list ────────────────────────────────────────────────────
  const topics = getTopics(grade, subject);
  const currentSubjectMeta = SUBJECT_META[subject];
  const completedCount = topics.filter(t => getProgress(grade, subject, t.id)).length;
  // First not-done topic index — that's where we show "Start ✨"
  const firstNotDoneIdx = topics.findIndex(t => !getProgress(grade, subject, t.id));

  const handleBack = () => {
    if (preselectedSubject) setGrade(null);
    else setSubject(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-5">
      {/* UJ-11: Onboarding modal for first-time users */}
      <OnboardingModal />
      <div className="md:grid md:grid-cols-[280px_1fr] md:gap-8">
      <div className="hidden md:block"><Sidebar /></div>
      <div className="space-y-4">
      <div className="md:hidden mb-2"><Sidebar /></div>

      {/* Header */}
      <div className="flex items-center gap-2">
        <button onClick={handleBack} className="text-sm text-gray-400 hover:text-gray-600 py-2 pr-2 min-w-[44px]">←</button>
        <div className={`w-9 h-9 ${currentSubjectMeta?.iconBg ?? "bg-gray-100"} rounded-xl flex items-center justify-center text-lg`}>
          {currentSubjectMeta?.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-gray-800 leading-tight">{subjectL(subject, "label")} — {grade}. {tr("gradeLabel")}</h2>
          <div className="text-xs text-gray-400">{subjectL(subject, "subtitle")}</div>
        </div>
      </div>

      {/* Subject switcher — always visible, colored by subject */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {SUBJECTS.map(s => {
          const isActive = s.id === subject;
          const activeCls = s.id === "math"
            ? "bg-blue-500 text-white border-blue-500"
            : s.id === "german"
              ? "bg-yellow-500 text-white border-yellow-500"
              : "bg-green-600 text-white border-green-600";
          return (
            <button key={s.id}
              onClick={() => setSubject(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-colors shrink-0 shadow-sm ${
                isActive ? activeCls : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}>
              {SUBJECT_META[s.id]?.emoji} {subjectL(s.id, "label")}
            </button>
          );
        })}
      </div>

      {/* Progress summary */}
      {completedCount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div className="flex-1">
            <div className="text-sm font-bold text-green-800">
              {completedCount} {lang === "fr" ? "thèmes terminés" : lang === "it" ? "argomenti completati" : lang === "en" ? "topics done" : "Themen geschafft"}
              {" "}/ {topics.length}
            </div>
            <div className="h-1.5 bg-green-200 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${Math.round((completedCount / topics.length) * 100)}%` }} />
            </div>
          </div>
          {completedCount === topics.length && <span className="text-2xl">🎉</span>}
        </div>
      )}

      {/* UJ-13: Empty state nudge for new users (no progress yet) */}
      {profile && profile.xp === 0 && firstNotDoneIdx === 0 && (
        <div className="flex items-center gap-3 bg-green-50 border-2 border-green-300 rounded-2xl px-4 py-3 text-sm text-green-800 font-medium">
          <span className="text-2xl">🚀</span>
          <span>Hier starten! Dein erstes Thema wartet auf dich.</span>
        </div>
      )}

      {/* Topic list */}
      <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        {topics.map((topic, idx) => {
          const prog = getProgress(grade, subject, topic.id);
          const stars = prog?.stars ?? 0;
          const done = !!prog;
          const isNext = idx === firstNotDoneIdx; // first not-done topic = "start here"
          const iconBg = currentSubjectMeta?.iconBg ?? "bg-green-100";

          return (
            <Link key={topic.id} href={`/learn/${grade}/${subject}/${topic.id}`}
              style={{ minHeight: "66px" }}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 border-2 transition-all active:scale-95 shadow-sm ${
                done
                  ? "bg-white border-green-200 hover:border-green-400"
                  : isNext && profile?.xp === 0
                    ? "bg-green-600 border-green-600 text-white hover:bg-green-700"
                  : isNext
                    ? "bg-green-50 border-green-300 hover:border-green-500"
                    : "bg-white border-gray-100 hover:border-green-300 hover:bg-green-50"
              }`}>

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${iconBg}`}>
                {topic.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm leading-tight">
                  {getTopicTitle(topic.id, lang, topic.title)}
                  {isNext && <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">Start ✨</span>}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {done
                    ? Array.from({length: 3}).map((_, j) => (
                        <span key={j} className={j < stars ? "text-yellow-400" : "text-gray-300"}>★</span>
                      ))
                    : `${topic.exercises.length} ${tr("exerciseCount")}`
                  }
                </div>
              </div>

              <div className="shrink-0">
                {done
                  ? <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                  : <span className="w-8 h-8 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-base">›</span>
                }
              </div>
            </Link>
          );
        })}
      </div>
      </div> {/* end space-y-4 */}
      </div> {/* end md:grid */}
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
        <img src="/images/mascot/cleverli-thumbsup.jpg" alt="Cleverli" className="w-16 h-16 object-contain animate-bounce" />
        <div className="text-sm">Laden…</div>
      </div>
    }>
      <DashboardInner />
    </Suspense>
  );
}
