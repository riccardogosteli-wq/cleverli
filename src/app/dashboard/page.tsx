"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { getTopics, SUBJECTS } from "@/data/index";
import { isDailyDoneToday } from "@/lib/daily";

const GRADE_COLORS = [
  "bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100 active:bg-blue-200",
  "bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-100 active:bg-purple-200",
  "bg-orange-50 border-orange-300 text-orange-800 hover:bg-orange-100 active:bg-orange-200",
];

function getProgress(grade: number, subject: string, topicId: string) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`cleverli_${grade}_${subject}_${topicId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export default function Dashboard() {
  const { tr, lang } = useLang();
  const [grade, setGrade] = useState<number | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [dailyDone, setDailyDone] = useState(false);

  useEffect(() => {
    setDailyDone(isDailyDoneToday());
  }, []);

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{tr("selectGrade")}</h1>
        </div>

        {/* Grade grid — full-width touch-friendly cards */}
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

        {/* Coming soon */}
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
      </div>
    );
  }

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
              {s.name}
            </button>
          ))}
        </div>

        <button onClick={() => setGrade(null)}
          className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">
          {tr("back")}
        </button>
      </div>
    );
  }

  const topics = getTopics(grade, subject);
  const currentSubject = SUBJECTS.find(s => s.id === subject)!;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setSubject(null)} className="text-sm text-gray-400 hover:text-gray-600 py-2 pr-2">{tr("back")}</button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentSubject.emoji}</span>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            {tr(currentSubject.id)} — {grade}. {tr("gradeLabel")}
          </h1>
        </div>
      </div>

      <div className="grid gap-3">
        {topics.map((topic, i) => {
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
                <div className="font-semibold text-gray-800 text-sm sm:text-base">{topic.title}</div>
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
