"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import { useProfileContext } from "@/lib/ProfileContext";
import { getDailyChallenge, getDailyState, markDailyComplete, isDailyDoneToday, DAILY_XP_BONUS } from "@/lib/daily";
import MultipleChoice from "@/components/exercises/MultipleChoice";
import FillInBlank from "@/components/exercises/FillInBlank";
import CountingGame from "@/components/exercises/CountingGame";
import HintSystem from "@/components/HintSystem";
import { useSound } from "@/hooks/useSound";

const GRADE_DEFAULT = 1; // TODO: use profile's grade preference once auth exists

export default function DailyPage() {
  const { tr, lang } = useLang();
  const { recordAnswer, profile } = useProfileContext();
  const { play } = useSound();
  const [grade] = useState(GRADE_DEFAULT);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [alreadyDone, setAlreadyDone] = useState(false);

  const challenge = getDailyChallenge(grade);

  useEffect(() => {
    setAlreadyDone(isDailyDoneToday());
  }, []);

  if (!challenge) return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <p className="text-gray-400">Keine Aufgabe verfügbar.</p>
    </div>
  );

  const { exercise, topic, subject } = challenge;

  const handleAnswer = (correct: boolean) => {
    play(correct ? "correct" : "wrong");
    setAnswered(correct);
    markDailyComplete(correct);

    recordAnswer({
      correct,
      streak: 0,
      hintsUsed,
      isTopicComplete: false,
      score: correct ? 1 : 0,
      total: 1,
      grade,
      subject,
      topicDurationMs: Date.now() - startTime,
      lang,
    });

    // Bonus XP for daily (record a second time with topic bonus signal)
    if (correct) {
      setTimeout(() => {
        recordAnswer({
          correct: true,
          streak: 0,
          hintsUsed,
          isTopicComplete: true, // triggers TOPIC_DONE bonus used as daily bonus proxy
          score: 1,
          total: 1,
          grade,
          subject,
          lang,
        });
      }, 800);
    }
  };

  const subjectLabel = subject === "math" ?
    (lang === "fr" ? "Mathématiques" : lang === "it" ? "Matematica" : lang === "en" ? "Mathematics" : "Mathematik") :
    (lang === "fr" ? "Allemand" : lang === "it" ? "Tedesco" : lang === "en" ? "German" : "Deutsch");

  // ── Already completed today ──────────────────────────────────────
  if (alreadyDone) {
    const state = getDailyState();
    return (
      <main className="max-w-md mx-auto px-4 py-8 text-center space-y-5">
        <Image src="/cleverli-jump-star.png" alt="Cleverli" width={120} height={120} className="mx-auto drop-shadow-lg" style={{ animation: "float 3s ease-in-out infinite" }} />
        <h1 className="text-2xl font-black text-green-700">
          {tr("dailyDone")}
        </h1>
        <p className="text-gray-500 text-sm">
          {state?.correct
            ? (tr("dailyCorrect"))
            : (tr("dailyWrong"))
          }
        </p>
        <div className="flex flex-col gap-3 items-center">
          <Link href="/dashboard" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md">
            {tr("learnNav")}
          </Link>
          <Link href="/trophies" className="text-sm text-gray-400 hover:text-gray-600 underline">🏆 Trophäen ansehen</Link>
        </div>
        <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      </main>
    );
  }

  // ── Post-answer ──────────────────────────────────────────────────
  if (answered !== null) {
    return (
      <main className="max-w-md mx-auto px-4 py-8 space-y-5">
        <div className={`rounded-3xl p-6 text-center space-y-3 ${answered ? "bg-green-50 border-2 border-green-300" : "bg-orange-50 border-2 border-orange-300"}`}>
          <Image
            src={answered ? "/cleverli-jump-star.png" : "/cleverli-think.png"}
            alt="Cleverli"
            width={110} height={110}
            className="mx-auto drop-shadow-lg"
          />
          <h2 className="text-2xl font-black" style={{ color: answered ? "#15803d" : "#ea580c" }}>
            {answered ? tr("correct") : tr("wrong")}
          </h2>
          {answered && (
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold">
              <span>⚡</span>
              <span>+{DAILY_XP_BONUS} Bonus-XP</span>
            </div>
          )}
          <p className="text-xs text-gray-400">
            {tr("dailyTomorrow")}
          </p>
        </div>
        <div className="flex flex-col gap-3 items-center">
          <Link href="/dashboard" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md">
            {tr("learnNav")}
          </Link>
          <Link href="/trophies" className="text-sm text-gray-400 hover:text-gray-600 underline">🏆 Trophäen ansehen</Link>
        </div>
      </main>
    );
  }

  // ── Active challenge ─────────────────────────────────────────────
  return (
    <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-300 rounded-2xl px-4 py-3">
        <span className="text-3xl">⚡</span>
        <div>
          <div className="font-black text-amber-800 text-base">
            {tr("dailyTitle")}
          </div>
          <div className="text-xs text-amber-600">
            {subjectLabel} · {topic.emoji} {topic.title} · +{DAILY_XP_BONUS} Bonus-XP
          </div>
        </div>
        <Image src="/cleverli-run.png" alt="" width={52} height={52} className="ml-auto drop-shadow-sm" />
      </div>

      {/* Exercise card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-4 min-h-[260px] flex flex-col justify-center">
        {exercise.type === "multiple-choice" && (
          <MultipleChoice
            question={exercise.question}
            options={exercise.options ?? []}
            answer={exercise.answer}
            onAnswer={handleAnswer}
            optionImages={exercise.optionImages}
            questionImage={exercise.image}
          />
        )}
        {exercise.type === "fill-in-blank" && (
          <FillInBlank
            question={exercise.question}
            answer={exercise.answer}
            onAnswer={handleAnswer}
            questionImage={exercise.image}
          />
        )}
        {exercise.type === "counting" && (
          <CountingGame
            question={exercise.question}
            answer={exercise.answer}
            emoji={exercise.emoji}
            options={exercise.options ?? []}
            onAnswer={handleAnswer}
          />
        )}
        <HintSystem hints={exercise.hints} onHintUsed={() => setHintsUsed(h => h + 1)} />
      </div>

      <p className="text-center text-xs text-gray-400">
        {tr("dailyMotivation")}
      </p>
    </main>
  );
}
