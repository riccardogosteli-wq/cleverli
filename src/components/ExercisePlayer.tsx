"use client";
import { useState, useEffect, useRef } from "react";
import { getActiveProfileId } from "@/lib/family";
import { syncTopicProgressToSupabase } from "@/lib/progressSync";
import { Topic, Exercise } from "@/types/exercise";
import MultipleChoice from "./exercises/MultipleChoice";
import FillInBlank from "./exercises/FillInBlank";
import CountingGame from "./exercises/CountingGame";
import HintSystem from "./HintSystem";
import ProgressBar from "./ProgressBar";
import MemoryGame from "./exercises/MemoryGame";
import DragDrop from "./exercises/DragDrop";
import NumberLine from "./exercises/NumberLine";
import WordSearch from "./exercises/WordSearch";
import RewardAnimation from "./RewardAnimation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { selectExercises } from "@/lib/exercisePool";
import { setExerciseInProgress } from "@/app/learn/[grade]/[subject]/[topic]/TopicBreadcrumb";
import { useVoice, getPhrase } from "@/hooks/useVoice";
import { useSound } from "@/hooks/useSound";
import { useLang } from "@/lib/LangContext";
import { useProfileContext } from "@/lib/ProfileContext";

interface Props { topic: Topic; grade: number; subject: string; isPremium?: boolean; allTopics?: Topic[]; topicIndex?: number; }

function calcStars(score: number, total: number) {
  const pct = score / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  return 1;
}

export default function ExercisePlayer({ topic, grade, subject, isPremium = false, allTopics = [], topicIndex = 0 }: Props) {
  const router = useRouter();
  const { speak, stop, isSupported } = useVoice();
  const { play } = useSound();
  const { tr, lang } = useLang();
  const { recordAnswer } = useProfileContext();
  const FREE_LIMIT = 3;
  // Select a rotated pool of exercises — different each session if pool > 10
  const [exercises, setExercises] = useState(() => selectExercises(topic.id, topic.exercises));
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);
  const [showReview, setShowReview] = useState(false); // show "review mistakes?" screen
  const [cardKey, setCardKey] = useState(0);
  const [voiceOn, setVoiceOn] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const topicStartRef = useRef<number>(Date.now());
  const nextTopic = allTopics[topicIndex + 1] ?? null;
  const rewardRef = useRef<HTMLDivElement>(null);

  const current: Exercise = exercises[idx];
  const isLocked = !isPremium && idx >= FREE_LIMIT;

  // (voice is on-demand only — no auto-read)

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
        const lastPlayed = new Date().toISOString();
        const progressData = { completed: exercises.length, score, stars: s, lastPlayed };
        localStorage.setItem(key, JSON.stringify(progressData));
        // Fire-and-forget sync to Supabase
        const childId = getActiveProfileId();
        if (childId) {
          syncTopicProgressToSupabase(childId, grade, subject, topic.id, {
            ...progressData, partial: false
          });
        }
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
    stop();
    setExerciseInProgress(true); // UJ-12: mark exercise as in-progress on first answer
    const newStreak = correct ? streak + 1 : 0;
    const newScore = correct ? score + 1 : score;
    if (correct) { setScore(s => s + 1); setStreak(newStreak); }
    else {
      setStreak(0);
      // UJ-7: track wrong exercise IDs for review
      const exId = exercises[idx]?.id ?? String(idx);
      setWrongIds(ids => ids.includes(exId) ? ids : [...ids, exId]);
    }
    setAnswered(correct);

    // Record XP — isTopicComplete will be true when this was the last exercise
    const isLast = idx + 1 >= exercises.length;
    recordAnswer({
      correct,
      streak: newStreak,
      hintsUsed,
      isTopicComplete: correct && isLast,
      score: newScore,
      total: exercises.length,
      grade,
      subject,
      topicDurationMs: correct && isLast ? Date.now() - topicStartRef.current : undefined,
      lang,
    });

    // Sound first, then voice after a short pause
    if (newStreak >= 3 && correct) {
      play("streak");
      setTimeout(() => { if (voiceOn) speak(getPhrase("streak")); }, 400);
    } else if (correct) {
      play("correct");
      setTimeout(() => { if (voiceOn) speak(getPhrase("correct")); }, 300);
    } else {
      play("wrong");
      setTimeout(() => { if (voiceOn) speak(getPhrase("wrong")); }, 300);
    }
  };

  const handleContinue = () => {
    if (idx + 1 >= exercises.length) {
      play("complete");
      setTimeout(() => { if (voiceOn) speak(getPhrase("complete")); }, 600);
      setExerciseInProgress(false); // UJ-12: clear in-progress flag on completion
      // UJ-7: if review mode done, just show done
      if (isReviewMode) { setDone(true); return; }
      // UJ-7: if mistakes exist and not already reviewing, show review prompt
      if (wrongIds.length > 0) { setShowReview(true); return; }
      setDone(true);
      return;
    }
    setIdx(i => i + 1);
    setAnswered(null);
    setCardKey(k => k + 1);
  };

  // UJ-7: start review round
  const startReview = () => {
    const reviewExercises = topic.exercises.filter(e => wrongIds.includes(e.id ?? ""));
    setExercises(reviewExercises.length > 0 ? reviewExercises : topic.exercises.slice(0, 3));
    setIdx(0); setScore(0); setStreak(0); setAnswered(null);
    setCardKey(k => k + 1); setWrongIds([]); setIsReviewMode(true); setShowReview(false);
  };

  // ── UJ-7: Review prompt ─────────────────────────────────────────
  if (showReview) {
    return (
      <div className="space-y-4 max-w-md mx-auto text-center py-4">
        <div className="text-5xl">🔄</div>
        <h2 className="text-xl font-bold text-gray-800">Fast perfekt!</h2>
        <p className="text-gray-500 text-sm">
          {wrongIds.length === 1
            ? "Eine Aufgabe war noch nicht richtig. Üben wir sie nochmal?"
            : `${wrongIds.length} Aufgaben waren noch nicht richtig. Üben wir sie nochmal?`}
        </p>
        <button
          onClick={startReview}
          className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold text-base hover:bg-amber-600 active:scale-95 transition-all shadow-md"
        >
          🔄 Nochmal üben ({wrongIds.length})
        </button>
        <button
          onClick={() => setDone(true)}
          className="w-full border-2 border-gray-200 text-gray-500 py-3 rounded-2xl font-medium text-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          Weiter ohne Üben →
        </button>
      </div>
    );
  }

  // ── Topic Complete ──────────────────────────────────────────────
  if (done) {
    const totalEx = isReviewMode ? exercises.length : topic.exercises.length;
    const s = calcStars(score, totalEx);
    const perfect = score === totalEx;
    return (
      <div className="space-y-4 max-w-md mx-auto">
        <RewardAnimation correct={true} isTopicComplete={true} onContinue={() => router.push(`/learn/${grade}/${subject}`)} />
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center space-y-3">
          {isReviewMode ? (
            <p className="text-green-700 font-bold">🎉 Alle Fehler korrigiert!</p>
          ) : (
            <p className="text-gray-600 font-medium">
              {score} / {totalEx} richtig{perfect && " — Perfekt! 🌟"}
            </p>
          )}
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
              setExercises(selectExercises(topic.id, topic.exercises));
              setIdx(0); setScore(0); setStreak(0); setAnswered(null);
              setDone(false); setWrongIds([]); setIsReviewMode(false); setCardKey(k=>k+1);
            }} className="text-sm border-2 border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50 active:scale-95 transition-all">
              {tr("playAgainShort")}
            </button>
            {/* UJ-5: Next topic button */}
            {nextTopic && (
              <Link href={`/learn/${grade}/${subject}/${nextTopic.id}`}
                className="text-sm bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700 active:scale-95 transition-all flex items-center gap-1">
                Nächstes Thema →
              </Link>
            )}
            <Link href={`/learn/${grade}/${subject}`}
              className="text-sm border-2 border-gray-200 text-gray-500 px-4 py-2 rounded-full hover:bg-gray-50 active:scale-95 transition-all">
              {tr("otherTopics")}
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
        <Image src="/cleverli-think.png" alt="" width={110} height={110} className="mx-auto drop-shadow-md" />
        <h2 className="text-xl font-bold text-gray-800">{tr("unlockTitle")}</h2>
        <p className="text-gray-500 text-sm">
          {tr("unlockDesc").replace("{n}", String(FREE_LIMIT))}<br/>
          {tr("unlockDetail")}
        </p>
        <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm text-green-800 text-left space-y-1 w-full max-w-xs">
          <div>✅ {tr("unlockFeature1")}</div>
          <div>✅ {tr("premiumF1")}</div>
          <div>✅ {tr("premiumF3")}</div>
          <div>✅ {tr("premiumF4")}</div>
        </div>
        <Link href="/signup"
          className="inline-block bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md text-base">
          {tr("upgrade")} — CHF 9.90{tr("perMonth")}
        </Link>
        <div>
          <Link href={`/learn/${grade}/${subject}`} className="text-sm text-gray-400 hover:text-gray-600 underline">
            {tr("selectTopic")}
          </Link>
        </div>
      </div>
    );
  }

  // ── Exercise ─────────────────────────────────────────────────────
  return (
    <div className="space-y-3 max-w-xl mx-auto">
      {/* UJ-15: Thin top progress bar — always visible */}
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((idx + (answered !== null ? 1 : 0)) / exercises.length) * 100}%`,
            background: isReviewMode
              ? "linear-gradient(to right, #f59e0b, #d97706)"
              : "linear-gradient(to right, #86efac, #16a34a)",
          }}
        />
      </div>

      {/* Progress bar + voice toggle — hide while reward animation is showing */}
      {answered === null && (
        <div className="flex items-center gap-2">
          {/* UJ-15: Exercise counter */}
          <span className="text-xs font-bold text-gray-400 shrink-0 tabular-nums">
            {isReviewMode ? "🔄 " : ""}{idx + 1}/{exercises.length}
          </span>
          <div className="flex-1">
            <ProgressBar current={idx + 1} total={exercises.length} streak={streak} />
          </div>
          {isSupported && (
            <button
              onClick={() => {
                const next = !voiceOn;
                setVoiceOn(next);
                if (!next) stop();
              }}
              title={voiceOn ? tr("cleverliVoiceOff") : tr("cleverliVoiceOn")}
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all active:scale-95"
              style={{ borderColor: voiceOn ? "#16a34a" : "#d1d5db", background: voiceOn ? "#f0fdf4" : "#f9fafb" }}
            >
              <span className="text-lg">{voiceOn ? "🔊" : "🔇"}</span>
            </button>
          )}
        </div>
      )}

      {/* Exercise card — hidden when answered, replaced by reward */}
      {answered === null && (
        <div
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-4 min-h-[260px] flex flex-col justify-center"
          key={cardKey}
          style={{ animation: "slideIn 0.25s cubic-bezier(.34,1.56,.64,1)" }}
        >
          {/* Read question aloud — bigger, tappable */}
          {isSupported && (
            <button
              onClick={() => speak(current.question)}
              className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-xl py-2.5 px-3 hover:bg-green-100 active:scale-95 transition-all"
              title={tr("readAloudTitle")}
              aria-label={tr("readAloudTitle")}
            >
              <span style={{ fontSize: "20px" }}>🔊</span>
              <span>{tr("readAloud")}</span>
            </button>
          )}
          {current.type === "multiple-choice" && (
            <MultipleChoice
              question={current.question}
              options={current.options ?? []}
              answer={current.answer}
              onAnswer={handleAnswer}
              optionImages={current.optionImages}
              questionImage={current.image}
            />
          )}
          {current.type === "fill-in-blank" && (
            <FillInBlank question={current.question} answer={current.answer} onAnswer={handleAnswer} questionImage={current.image} />
          )}
          {current.type === "counting" && (
            <CountingGame question={current.question} answer={current.answer} emoji={current.emoji} options={current.options ?? []} onAnswer={handleAnswer} questionImage={current.image} />
          )}
          {current.type === "memory" && (
            <MemoryGame pairs={current.pairs ?? []} onAnswer={handleAnswer} />
          )}
          {current.type === "drag-drop" && (
            <DragDrop
              question={current.question}
              items={current.dragItems ?? []}
              zones={current.dropZones ?? []}
              answers={current.dropAnswers ?? {}}
              onAnswer={handleAnswer}
            />
          )}
          {current.type === "number-line" && (
            <NumberLine
              question={current.question}
              min={current.numberMin ?? 0}
              max={current.numberMax ?? 10}
              answer={Number(current.answer)}
              step={current.numberStep ?? 1}
              onAnswer={handleAnswer}
            />
          )}
          {current.type === "word-search" && (
            <WordSearch
              question={current.question}
              words={current.wordList ?? []}
              gridSize={current.gridSize}
              onAnswer={handleAnswer}
            />
          )}
          <HintSystem hints={current.hints} onHintUsed={() => setHintsUsed(h => h + 1)} />
        </div>
      )}

      {/* UJ-6: Wrong answer — full red feedback panel */}
      {answered === false && (
        <div ref={rewardRef} className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 text-center space-y-3 animate-fadeIn">
          <div className="text-4xl">❌</div>
          <p className="text-lg font-bold text-red-700">Nicht ganz richtig</p>
          <div className="bg-white border border-red-200 rounded-xl px-4 py-3 text-sm text-gray-700 text-left space-y-1">
            <p className="font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Richtige Antwort:</p>
            <p className="font-bold text-gray-900 text-base">{current.answer}</p>
            {current.explanation && (
              <p className="text-gray-500 text-xs mt-1">{current.explanation}</p>
            )}
          </div>
          <button
            onClick={handleContinue}
            className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 active:scale-95 transition-all"
          >
            Verstanden — Weiter →
          </button>
        </div>
      )}

      {/* Correct answer — keep the celebration animation */}
      {answered === true && (
        <div ref={rewardRef}>
          <RewardAnimation correct={true} onContinue={handleContinue} />
        </div>
      )}

      {/* Free limit notice — UJ-8: only show after hydration (isPremium prop is stable) */}
      {isPremium === false && idx < FREE_LIMIT && (
        <p className="text-center text-xs text-gray-400">
          {tr("freeNoteBanner").replace("{n}", String(FREE_LIMIT))}{" "}
          <Link href="/signup" className="text-green-600 underline">{tr("unlockAll")}</Link>
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
