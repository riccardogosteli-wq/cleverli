"use client";
import { useState, useEffect, useRef } from "react";
import { Topic, Exercise } from "@/types/exercise";
import MultipleChoice from "./exercises/MultipleChoice";
import FillInBlank from "./exercises/FillInBlank";
import CountingGame from "./exercises/CountingGame";
import HintSystem from "./HintSystem";
import ProgressBar from "./ProgressBar";
import RewardAnimation from "./RewardAnimation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props { topic: Topic; grade: number; subject: string; isPremium?: boolean; }

function calcStars(score: number, total: number) {
  const pct = score / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  return 1;
}

export default function ExercisePlayer({ topic, grade, subject, isPremium = false }: Props) {
  const router = useRouter();
  const FREE_LIMIT = 3;
  const exercises = topic.exercises;
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const rewardRef = useRef<HTMLDivElement>(null);

  const current: Exercise = exercises[idx];
  const isLocked = !isPremium && idx >= FREE_LIMIT;

  // Save partial progress when free limit is reached (so stars show on topic list)
  useEffect(() => {
    if (isLocked && score > 0) {
      const s = calcStars(score, FREE_LIMIT); // stars based on free exercises only
      localStorage.setItem(`cleverli_${grade}_${subject}_${topic.id}`, JSON.stringify({
        completed: FREE_LIMIT, score, stars: s, partial: true, lastPlayed: new Date().toISOString()
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked]);

  // Save progress when done — only overwrite if new score is better or equal
  useEffect(() => {
    if (done) {
      const key = `cleverli_${grade}_${subject}_${topic.id}`;
      const existing = JSON.parse(localStorage.getItem(key) ?? "{}");
      const prevScore = existing?.score ?? 0;
      if (score >= prevScore) {
        const s = calcStars(score, exercises.length);
        localStorage.setItem(key, JSON.stringify({
          completed: exercises.length, score, stars: s, lastPlayed: new Date().toISOString()
        }));
      }
    }
  }, [done, score, grade, subject, topic.id, exercises.length]);

  // Enter key to continue after answering (desktop)
  useEffect(() => {
    if (answered === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleContinue();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, idx]);

  // Scroll reward into view on mobile
  useEffect(() => {
    if (answered !== null && rewardRef.current) {
      setTimeout(() => {
        rewardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  }, [answered]);

  const handleAnswer = (correct: boolean) => {
    if (correct) { setScore(s => s + 1); setStreak(s => s + 1); }
    else setStreak(0);
    setAnswered(correct);
  };

  const handleContinue = () => {
    if (idx + 1 >= exercises.length) { setDone(true); return; }
    setIdx(i => i + 1);
    setAnswered(null);
    setCardKey(k => k + 1);
  };

  // ── Topic Complete ──────────────────────────────────────────────
  if (done) {
    const s = calcStars(score, exercises.length);
    const perfect = score === exercises.length;
    return (
      <div className="space-y-4 max-w-md mx-auto">
        <RewardAnimation correct={true} isTopicComplete={true} onContinue={() => router.push(`/learn/${grade}/${subject}`)} />
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center space-y-3">
          <p className="text-gray-600 font-medium">
            {score} / {exercises.length} richtig{perfect && " — Perfekt! 🌟"}
          </p>
          <div className="text-4xl flex justify-center gap-2">
            {Array.from({length: 3}).map((_, i) => (
              <span key={i} style={{
                display: "inline-block",
                animation: i < s ? `popIn 0.4s ${0.15 + i * 0.15}s cubic-bezier(.34,1.56,.64,1) both` : "none",
              }}>
                {i < s ? "⭐" : "☆"}
              </span>
            ))}
          </div>
          <div className="flex gap-3 justify-center flex-wrap pt-1">
            <button onClick={() => {
              setIdx(0); setScore(0); setStreak(0); setAnswered(null); setDone(false); setCardKey(k=>k+1);
            }} className="text-sm border-2 border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50 active:scale-95 transition-all">
              🔄 Nochmal
            </button>
            <Link href={`/learn/${grade}/${subject}`}
              className="text-sm bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700 active:scale-95 transition-all">
              Andere Themen →
            </Link>
          </div>
        </div>
        <style>{`@keyframes popIn{from{transform:scale(0.3);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
      </div>
    );
  }

  // ── Locked (free limit reached) ──────────────────────────────────
  if (isLocked) {
    return (
      <div className="text-center space-y-4 py-8 max-w-sm mx-auto">
        <Image src="/cleverli-think.png" alt="" width={100} height={100} className="mx-auto drop-shadow-md" />
        <h2 className="text-xl font-bold text-gray-800">Weiter mit Premium 🔒</h2>
        <p className="text-gray-500 text-sm">
          Du hast alle 3 kostenlosen Aufgaben gemacht! 🎉<br/>
          Mit Premium erhältst du <strong>unbegrenzten Zugriff</strong> auf alle Aufgaben, alle Fächer und alle Klassen 1–3.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm text-green-800 text-left space-y-1 w-full max-w-xs">
          <div>✅ Alle {exercises.length} Aufgaben in diesem Thema</div>
          <div>✅ Alle Fächer: Mathe, Deutsch & mehr</div>
          <div>✅ Klassen 1, 2 und 3 komplett</div>
          <div>✅ Bis zu 3 Kinder pro Konto</div>
        </div>
        <Link href="/signup"
          className="inline-block bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md text-base">
          Jetzt starten — CHF 9.90/Mt.
        </Link>
        <div>
          <Link href={`/learn/${grade}/${subject}`} className="text-sm text-gray-400 hover:text-gray-600 underline">
            Anderes Thema wählen
          </Link>
        </div>
      </div>
    );
  }

  // ── Exercise ─────────────────────────────────────────────────────
  return (
    <div className="space-y-3 max-w-xl mx-auto">
      {/* Progress bar — hide while reward animation is showing */}
      {answered === null && (
        <ProgressBar current={idx + 1} total={exercises.length} streak={streak} />
      )}

      {/* Exercise card — hidden when answered, replaced by reward */}
      {answered === null && (
        <div
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-4 min-h-[260px] flex flex-col justify-center"
          key={cardKey}
          style={{ animation: "slideIn 0.25s cubic-bezier(.34,1.56,.64,1)" }}
        >
          {current.type === "multiple-choice" && (
            <MultipleChoice question={current.question} options={current.options ?? []} answer={current.answer} onAnswer={handleAnswer} />
          )}
          {current.type === "fill-in-blank" && (
            <FillInBlank question={current.question} answer={current.answer} onAnswer={handleAnswer} />
          )}
          {current.type === "counting" && (
            <CountingGame question={current.question} answer={current.answer} emoji={current.emoji} options={current.options ?? []} onAnswer={handleAnswer} />
          )}
          <HintSystem hints={current.hints} />
        </div>
      )}

      {/* Reward replaces the card — no overlap */}
      {answered !== null && (
        <div ref={rewardRef}>
          <RewardAnimation correct={answered} onContinue={handleContinue} />
        </div>
      )}

      {/* Free limit notice */}
      {!isPremium && idx < FREE_LIMIT && (
        <p className="text-center text-xs text-gray-400">
          💡 {FREE_LIMIT} kostenlose Aufgaben pro Thema —{" "}
          <Link href="/signup" className="text-green-600 underline">alle Klassen & Aufgaben freischalten</Link>
        </p>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(10px) scale(0.98); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
