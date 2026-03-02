"use client";
import Link from "next/link";
import { Topic } from "@/types/exercise";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/LangContext";

interface Props { grade: number; subject: string; topics: Topic[]; }

const SUBJECT_META: Record<string, { emoji: string; nameKey: string; color: string }> = {
  math:   { emoji: "🔢", nameKey: "math",   color: "text-blue-700 bg-blue-50" },
  german: { emoji: "📖", nameKey: "german", color: "text-yellow-700 bg-yellow-50" },
};

export default function SubjectPageClient({ grade, subject, topics }: Props) {
  const { tr } = useLang();
  const [progress, setProgress] = useState<Record<string, { stars: number; completed: number }>>({});

  useEffect(() => {
    const p: typeof progress = {};
    for (const t of topics) {
      const raw = localStorage.getItem(`cleverli_${grade}_${subject}_${t.id}`);
      if (raw) {
        try { p[t.id] = JSON.parse(raw); } catch { /* ignore */ }
      }
    }
    setProgress(p);
  }, [grade, subject, topics]);

  const meta = SUBJECT_META[subject] ?? { emoji: "📚", nameKey: subject, color: "text-gray-700 bg-gray-50" };
  const subjectName = tr(meta.nameKey) || subject;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
        <Link href="/dashboard" className="hover:text-green-600 transition-colors">Dashboard</Link>
        <span>›</span>
        <span className="text-gray-600 font-medium">{grade}. Klasse</span>
        <span>›</span>
        <span className="text-green-700 font-semibold">{subjectName}</span>
      </nav>
      <div className="flex items-center gap-3">
        <span className="text-4xl">{meta.emoji}</span>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{subjectName} — {grade}. Klasse</h1>
          <p className="text-sm text-gray-400">
            {["NMG","NHS","NUS"].includes(subjectName) && <span className="text-gray-500">{tr("scienceFull")} · </span>}
            {topics.length} Themen · Lehrplan 21
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {topics.map((topic, i) => {
          const prog = progress[topic.id];
          const stars = prog?.stars ?? 0;
          const done = !!prog;
          return (
            <Link key={topic.id} href={`/learn/${grade}/${subject}/${topic.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 border-2 border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all group shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl shrink-0">
                {topic.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 group-hover:text-green-700">{topic.title}</div>
                <div className="text-xs text-gray-400">{topic.exercises.length} Aufgaben</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {done ? (
                  <div className="flex items-center gap-1">
                    <div className="text-sm">
                      {Array.from({length:3}).map((_,j) => (
                        <span key={j}>{j < stars ? "⭐" : "☆"}</span>
                      ))}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">✓</span>
                  </div>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-50 text-blue-600">
                    {topic.exercises.length} Aufg.
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
