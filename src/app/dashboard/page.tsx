"use client";
import { useState } from "react";
import Link from "next/link";
import CleverliMascot from "@/components/CleverliMascot";
import { useLang } from "@/lib/LangContext";
import { getTopics, SUBJECTS } from "@/data/index";

const GRADE_COLORS = [
  "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200",
  "bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200",
  "bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200",
];

export default function Dashboard() {
  const { tr } = useLang();
  const [grade, setGrade] = useState<number | null>(null);
  const [subject, setSubject] = useState<string | null>(null);

  function getProgress(grade: number, subject: string, topicId: string) {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(`cleverli_${grade}_${subject}_${topicId}`);
    return raw ? JSON.parse(raw) : null;
  }

  if (!grade) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center space-y-6">
        <CleverliMascot size={120} />
        <h1 className="text-3xl font-bold text-gray-800">{tr("selectGrade")}</h1>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((g, i) => (
            <button key={g} onClick={() => setGrade(g)}
              className={`border-2 rounded-2xl p-6 font-bold text-2xl transition-all ${GRADE_COLORS[i]}`}>
              {g}. {tr("gradeLabel")}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 opacity-40">
          {[4, 5, 6].map(g => (
            <div key={g} className="border-2 border-gray-200 rounded-2xl p-6 font-bold text-2xl text-gray-400">
              {g}. {tr("gradeLabel")}<br /><span className="text-sm font-normal">{tr("comingSoon")}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center space-y-6">
        <button onClick={() => setGrade(null)} className="text-sm text-gray-400 hover:text-gray-600">{tr("back")}</button>
        <CleverliMascot size={100} />
        <h1 className="text-3xl font-bold text-gray-800">{grade}. {tr("gradeLabel")} — {tr("selectSubject")}</h1>
        <div className="grid grid-cols-2 gap-4">
          {SUBJECTS.map(s => (
            <button key={s.id} onClick={() => setSubject(s.id)}
              className={`border-2 rounded-2xl p-6 font-bold text-xl transition-all ${s.color}`}>
              <div className="text-4xl mb-2">{s.emoji}</div>
              {s.name}
            </button>
          ))}
          <div className="border-2 border-gray-200 rounded-2xl p-6 font-bold text-xl text-gray-300 col-span-2">
            🌍 {tr("science")} — {tr("comingSoon")}
          </div>
        </div>
      </div>
    );
  }

  // Topic list
  const topics = getTopics(grade, subject);
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <button onClick={() => setSubject(null)} className="text-sm text-gray-400 hover:text-gray-600">{tr("back")}</button>
      <h1 className="text-2xl font-bold text-gray-800">{tr("selectTopic")}</h1>
      <div className="space-y-3">
        {topics.map(topic => {
          const prog = getProgress(grade, subject, topic.id);
          return (
            <Link key={topic.id} href={`/learn/${grade}/${subject}/${topic.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <span className="text-3xl">{topic.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{topic.title}</p>
                <p className="text-sm text-gray-400">{topic.exercises.length} {tr("exercises")} · {tr("freeNote").split("·")[1]?.trim()}</p>
              </div>
              {prog ? (
                <span className="text-yellow-500">{Array.from({length:3}).map((_,i) => i < prog.stars ? "⭐" : "☆")}</span>
              ) : (
                <span className="text-green-600 text-sm font-medium">Start →</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
