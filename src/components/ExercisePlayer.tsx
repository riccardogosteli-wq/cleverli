"use client";
import { useState, useEffect } from "react";
import { Topic, Exercise } from "@/types/exercise";
import MultipleChoice from "./exercises/MultipleChoice";
import FillInBlank from "./exercises/FillInBlank";
import CountingGame from "./exercises/CountingGame";
import HintSystem from "./HintSystem";
import ProgressBar from "./ProgressBar";
import RewardAnimation from "./RewardAnimation";
import Image from "next/image";
import Link from "next/link";

interface Props { topic: Topic; grade: number; subject: string; isPremium?: boolean; }

function stars(score: number, total: number) {
  const pct = score / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  return 1;
}

export default function ExercisePlayer({ topic, grade, subject, isPremium = false }: Props) {
  const FREE_LIMIT = 3;
  const exercises = topic.exercises;
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);
  const [key, setKey] = useState(0);

  const current: Exercise = exercises[idx];
  const isLocked = !isPremium && idx >= FREE_LIMIT;

  useEffect(() => {
    if (done) {
      const s = stars(score, exercises.length);
      localStorage.setItem(`cleverli_${grade}_${subject}_${topic.id}`, JSON.stringify({
        completed: exercises.length, score, stars: s, lastPlayed: new Date().toISOString()
      }));
    }
  }, [done, score, grade, subject, topic.id, exercises.length]);

  // Enter key to continue after answering
  useEffect(() => {
    if (answered === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleContinue();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const handleAnswer = (correct: boolean) => {
    if (correct) { setScore(s => s + 1); setStreak(s => s + 1); }
    else setStreak(0);
    setAnswered(correct);
  };

  const handleContinue = () => {
    if (idx + 1 >= exercises.length) { setDone(true); return; }
    setIdx(i => i + 1);
    setAnswered(null);
    setKey(k => k + 1);
  };

  // Topic complete screen
  if (done) {
    const s = stars(score, exercises.length);
    const perfect = score === exercises.length;
    return (
      <div className="text-center space-y-5 py-4 max-w-md mx-auto">
        {/* Big confetti reward */}
        <RewardAnimation correct={true} isTopicComplete={true} onContinue={() => {
          setIdx(0); setScore(0); setStreak(0); setAnswered(null); setDone(false); setKey(k=>k+1);
        }} />

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
          <p className="text-gray-600">
            {score} von {exercises.length} richtig
            {perfect && " — Perfekt! 🌟"}
          </p>
          <div className="text-4xl flex justify-center gap-1">
            {Array.from({length:3}).map((_,i) => (
              <span key={i} style={{
                animation: i < s ? `popIn 0.4s ${0.2 + i * 0.15}s cubic-bezier(.34,1.56,.64,1) both` : "none",
                display: "inline-block",
              }}>
                {i < s ? "⭐" : "☆"}
              </span>
            ))}
          </div>
          <Link href={`/learn/${grade}/${subject}`}
            className="block border-2 border-green-600 text-green-700 px-6 py-2 rounded-full font-semibold hover:bg-green-50 text-sm">
            ← Andere Themen
          </Link>
        </div>
        <style>{`@keyframes popIn{from{transform:scale(0.3);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="text-center space-y-4 py-8 max-w-sm mx-auto">
        <Image src="/cleverli-think.png" alt="" width={100} height={100} className="mx-auto drop-shadow-md" />
        <h2 className="text-2xl font-bold text-gray-800">Premium-Inhalt 🔒</h2>
        <p className="text-gray-500 text-sm">Die ersten 3 Aufgaben sind kostenlos.<br/>Für alle Aufgaben brauchst du ein Abo.</p>
        <Link href="/signup" className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 shadow-md">
          Jetzt upgraden — CHF 9.90/Mt.
        </Link>
        <br/>
        <Link href={`/learn/${grade}/${subject}`} className="text-sm text-gray-400 hover:text-gray-600 underline">
          Anderes Thema wählen
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <ProgressBar current={idx} total={exercises.length} streak={streak} />

      <div
        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 min-h-[300px] flex flex-col justify-center space-y-4"
        key={key}
        style={{ animation: "slideIn 0.25s cubic-bezier(.34,1.56,.64,1)" }}
      >
        {current.type === "multiple-choice" && (
          <MultipleChoice
            question={current.question}
            options={current.options ?? []}
            answer={current.answer}
            onAnswer={handleAnswer}
          />
        )}
        {current.type === "fill-in-blank" && (
          <FillInBlank
            question={current.question}
            answer={current.answer}
            onAnswer={handleAnswer}
          />
        )}
        {current.type === "counting" && (
          <CountingGame
            question={current.question}
            answer={current.answer}
            emoji={current.emoji}
            options={current.options ?? []}
            onAnswer={handleAnswer}
          />
        )}

        {answered !== null && (
          <RewardAnimation correct={answered} onContinue={handleContinue} />
        )}
        {answered === null && current.hints.length > 0 && (
          <HintSystem hints={current.hints} />
        )}
      </div>

      {!isPremium && idx < FREE_LIMIT && (
        <p className="text-center text-xs text-gray-400">
          Aufgabe {idx+1} von 3 kostenlos —{" "}
          <Link href="/signup" className="text-green-600 underline">
            alle {exercises.length} freischalten
          </Link>
        </p>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(12px) scale(0.97); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
