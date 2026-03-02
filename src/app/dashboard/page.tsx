"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { getTopics, SUBJECTS } from "@/data/index";
import { getTopicTitle } from "@/data/topicTitles";
import { isDailyDoneToday } from "@/lib/daily";
import { useProfile } from "@/hooks/useProfile";
import RewardWidget from "@/components/RewardWidget";

const GRADE_COLORS = [
  "bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100 active:bg-blue-200",
  "bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-100 active:bg-purple-200",
  "bg-orange-50 border-orange-300 text-orange-800 hover:bg-orange-100 active:bg-orange-200",
];

const SUBJECT_META: Record<string, { emoji: string; label: { de: string; fr: string; it: string; en: string } }> = {
  math:    { emoji: "🔢", label: { de: "Mathematik", fr: "Mathématiques", it: "Matematica", en: "Maths" } },
  german:  { emoji: "📖", label: { de: "Deutsch", fr: "Allemand", it: "Tedesco", en: "German" } },
  science: { emoji: "🌍", label: { de: "Natur, Mensch, Gesellschaft", fr: "Nature, Humain et Société", it: "Natura, Uomo e Società", en: "Nature & Society" } },
};

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

  useEffect(() => {
    setDailyDone(isDailyDoneToday());
  }, []);

  // When ?subject= changes (e.g. back navigation), sync state
  useEffect(() => {
    setSubject(preselectedSubject);
    setGrade(null);
  }, [preselectedSubject]);

  const subjectLabel = (id: string) => {
    const meta = SUBJECT_META[id];
    if (!meta) return id;
    return meta.label[lang as keyof typeof meta.label] ?? meta.label.de;
  };

  // ── STEP 1: Choose grade ──────────────────────────────────────────────────
  if (!grade) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        {/* Daily Challenge banner */}
        <Link href="/daily"
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 border-2 transition-all active:scale-95 ${dailyDone ? "bg-green-50 border-green-300 opacity-70" : "bg-amber-50 border-amber-300 hover:bg-amber-100"}`}>
          <span className="text-3xl">{dailyDone ? "✅" : "⚡"}</span>
          <div className="flex-1">
            <div className="font-bold text-amber-800 text-sm">
              {lang === "fr" ? "Défi du jour" : lang === "it" ? "Sfida del giorno" : lang === "en" ? "Daily Challenge" : "Tagesaufgabe"}
            </div>
            <div className="text-xs text-amber-600">
              {dailyDone
                ? (lang === "fr" ? "Terminé ! Reviens demain." : lang === "it" ? "Fatto! Torna domani." : lang === "en" ? "Done! Come back tomorrow." : "Erledigt! Morgen gibt es eine neue.")
                : (lang === "fr" ? "+30 XP bonus · Un essai par jour" : lang === "it" ? "+30 XP bonus · Un tentativo al giorno" : lang === "en" ? "+30 Bonus XP · One try per day" : "+30 Bonus-XP · Einmal pro Tag")}
            </div>
          </div>
          <Image src={dailyDone ? "/cleverli-celebrate.png" : "/cleverli-run.png"} alt="" width={44} height={44} className="drop-shadow-sm shrink-0" />
        </Link>

        <div className="text-center space-y-2">
          <Image src="/cleverli-wave.png" alt="Cleverli" width={100} height={100} className="mx-auto drop-shadow-md" />
          {/* If subject pre-selected, show what we're about to learn */}
          {subject && SUBJECT_META[subject] && (
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full">
              <span>{SUBJECT_META[subject].emoji}</span>
              <span>{subjectLabel(subject)}</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{tr("selectGrade")}</h1>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((g, i) => (
            <button key={g} onClick={() => setGrade(g)}
              style={{ minHeight: "90px", transition: "all 0.15s ease" }}
              className={`border-2 rounded-2xl font-bold text-xl sm:text-2xl active:scale-95 ${GRADE_COLORS[i]}`}>
              <div className="text-2xl sm:text-3xl">{g}.</div>
              <div className="text-sm font-medium mt-1">{tr("gradeLabel")}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 opacity-50">
          {[4, 5, 6].map(g => (
            <div key={g} style={{ minHeight: "90px" }}
              className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-not-allowed">
              <div className="text-xl font-bold">{g}.</div>
              <div className="text-xs mt-1">{tr("comingSoonShort")}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 -mt-2">
          {tr("gradesComingSoon")} · <a href="mailto:hello@cleverli.ch" className="text-green-600 underline">{tr("notifyMe")}</a>
        </p>

        {/* Reward widget — shows active goals with progress */}
        {profile && (
          <RewardWidget profile={{
            totalExercises: profile.totalExercises,
            totalTopicsComplete: profile.totalTopicsComplete,
            dailyStreak: profile.dailyStreak,
          }} />
        )}
      </div>
    );
  }

  // ── STEP 2: Choose subject (only if NOT pre-selected from URL) ────────────
  if (!subject) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <Image src="/cleverli-sit-read.png" alt="Cleverli" width={90} height={90} className="mx-auto drop-shadow-md" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {grade}. {tr("gradeLabel")} — {tr("selectSubject")}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {SUBJECTS.map(s => (
            <button key={s.id} onClick={() => setSubject(s.id)}
              style={{ minHeight: "110px", transition: "all 0.15s ease" }}
              className={`border-2 rounded-2xl font-bold text-lg active:scale-95 ${s.color}`}>
              <div className="text-4xl mb-2">{s.emoji}</div>
              {tr(s.id)}
            </button>
          ))}
        </div>

        <button onClick={() => setGrade(null)} className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">
          {tr("back")}
        </button>
      </div>
    );
  }

  // ── STEP 3: Topic list ────────────────────────────────────────────────────
  const topics = getTopics(grade, subject);
  const currentSubject = SUBJECTS.find(s => s.id === subject) ?? SUBJECTS[0];

  // Back: if subject came from URL → back to grade selection (clear grade)
  // if subject was chosen manually → back to subject selection (clear subject)
  const handleBack = () => {
    if (preselectedSubject) {
      setGrade(null); // stay on same subject, pick another grade
    } else {
      setSubject(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={handleBack} className="text-sm text-gray-400 hover:text-gray-600 py-2 pr-2">
          ← {tr("back")}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentSubject.emoji}</span>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            {subjectLabel(subject)} — {grade}. {tr("gradeLabel")}
          </h1>
        </div>
      </div>

      {/* Quick subject switcher (only when pre-selected from URL) */}
      {preselectedSubject && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SUBJECTS.map(s => (
            <button key={s.id}
              onClick={() => setSubject(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
                s.id === subject
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
              }`}>
              {s.emoji} {subjectLabel(s.id)}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-3">
        {topics.map((topic) => {
          const prog = getProgress(grade, subject, topic.id);
          const stars = prog?.stars ?? 0;
          const done = !!prog;
          return (
            <Link key={topic.id} href={`/learn/${grade}/${subject}/${topic.id}`}
              style={{ minHeight: "64px" }}
              className="flex items-center gap-4 bg-white rounded-2xl px-4 py-3 border-2 border-gray-100 hover:border-green-300 hover:bg-green-50 active:scale-95 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl shrink-0">
                {topic.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm sm:text-base">{getTopicTitle(topic.id, lang, topic.title)}</div>
                <div className="text-xs text-gray-400">{topic.exercises.length} {tr("exerciseCount")}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {done && (
                  <div className="text-xs sm:text-sm">
                    {Array.from({length:3}).map((_,j) => <span key={j}>{j < stars ? "⭐" : "☆"}</span>)}
                  </div>
                )}
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${done ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-600"}`}>
                  {done ? "✓" : `${topic.exercises.length} ${tr("exerciseShort")}`}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-gray-400">Laden…</div>}>
      <DashboardInner />
    </Suspense>
  );
}
