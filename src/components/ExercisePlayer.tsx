"use client";
import { useState, useEffect } from "react";
import { Topic, Exercise } from "@/types/exercise";
import MultipleChoice from "./exercises/MultipleChoice";
import FillInBlank from "./exercises/FillInBlank";
import CountingGame from "./exercises/CountingGame";
import HintSystem from "./HintSystem";
import ProgressBar from "./ProgressBar";
import RewardAnimation from "./RewardAnimation";
import CleverliMascot from "./CleverliMascot";
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

  if (done) {
    const s = stars(score, exercises.length);
    return (
      <div className="text-center space-y-4 py-8">
        <CleverliMascot size={120} mood="celebrate" />
        <h2 className="text-3xl font-bold text-gray-800">Fertig! 🎊</h2>
        <p className="text-gray-500">{score} von {exercises.length} richtig</p>
        <div className="text-5xl">{Array.from({length:3}).map((_,i) => <span key={i}>{i < s ? "⭐" : "☆"}</span>)}</div>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => { setIdx(0); setScore(0); setStreak(0); setAnswered(null); setDone(false); setKey(k=>k+1); }}
            className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700">
            Nochmal spielen
          </button>
          <Link href={`/learn/${grade}/${subject}`} className="border-2 border-green-600 text-green-700 px-6 py-2 rounded-full font-semibold hover:bg-green-50">
            Andere Themen
          </Link>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="text-5xl">🔒</div>
        <h2 className="text-2xl font-bold text-gray-800">Premium-Inhalt</h2>
        <p className="text-gray-500">Die ersten 3 Aufgaben sind kostenlos.<br/>Für alle Aufgaben brauchst du ein Premium-Abo.</p>
        <Link href="/signup" className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700">
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
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 min-h-[280px] flex flex-col justify-center space-y-4" key={key}>
        {current.type === "multiple-choice" && (
          <MultipleChoice question={current.question} options={current.options ?? []} answer={current.answer} onAnswer={handleAnswer} />
        )}
        {current.type === "fill-in-blank" && (
          <FillInBlank question={current.question} answer={current.answer} onAnswer={handleAnswer} />
        )}
        {current.type === "counting" && (
          <CountingGame question={current.question} answer={current.answer} emoji={current.emoji} options={current.options ?? []} onAnswer={handleAnswer} />
        )}
        {answered !== null && <RewardAnimation correct={answered} onContinue={handleContinue} />}
        {answered === null && current.hints.length > 0 && <HintSystem hints={current.hints} />}
      </div>
      {!isPremium && idx < FREE_LIMIT && (
        <p className="text-center text-xs text-gray-400">Aufgabe {idx+1} von 3 kostenlos — <Link href="/signup" className="text-green-600 underline">alle {exercises.length} freischalten</Link></p>
      )}
    </div>
  );
}
