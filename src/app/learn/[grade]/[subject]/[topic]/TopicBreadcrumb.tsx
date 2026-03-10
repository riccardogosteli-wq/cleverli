"use client";
import { useState } from "react";
import Link from "next/link";

interface Props {
  grade: number;
  subject: string;
  subjectName: string;
  topicTitle: string;
  exerciseActive: boolean; // passed from ExercisePlayer via context — simplest: use a global flag
}

// Simple in-module signal: ExercisePlayer sets this to true once first answer given
export let exerciseInProgress = false;
export function setExerciseInProgress(v: boolean) { exerciseInProgress = v; }

export default function TopicBreadcrumb({ grade, subject, subjectName, topicTitle }: Omit<Props, "exerciseActive">) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetHref, setTargetHref] = useState("");

  const handleNav = (href: string) => (e: React.MouseEvent) => {
    if (exerciseInProgress) {
      e.preventDefault();
      setTargetHref(href);
      setShowConfirm(true);
    }
  };

  return (
    <>
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
        <Link href="/dashboard" onClick={handleNav("/dashboard")} className="hover:text-green-700 transition-colors">Dashboard</Link>
        <span>›</span>
        <Link href={`/learn/${grade}/${subject}`} onClick={handleNav(`/learn/${grade}/${subject}`)} className="hover:text-green-700 transition-colors">
          {grade}. Klasse · {subjectName}
        </Link>
        <span>›</span>
        <span className="text-green-700 font-semibold">{topicTitle}</span>
      </nav>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-xs w-full text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-lg font-bold text-gray-900">Übung abbrechen?</h2>
            <p className="text-gray-500 text-sm">Dein Fortschritt in dieser Aufgabe geht verloren.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-2xl font-semibold hover:bg-gray-50 active:scale-95 transition-all"
              >
                Weiterlernen
              </button>
              <Link
                href={targetHref}
                className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-bold hover:bg-red-600 active:scale-95 transition-all text-center"
                onClick={() => { setExerciseInProgress(false); setShowConfirm(false); }}
              >
                Verlassen
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
