"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import { useProfileContext } from "@/lib/ProfileContext";
import { getDailyState, markDailyComplete, isDailyDoneToday, DAILY_XP_BONUS, todayKey, getDailyContext } from "@/lib/dailyState";
import type { Exercise } from "@/types/exercise";
import { getTopicTitle } from "@/data/topicTitles";
import { getLocalizedSubjectName } from "@/lib/seoContent";
import MultipleChoice from "@/components/exercises/MultipleChoice";
import FillInBlank from "@/components/exercises/FillInBlank";
import SelfReview from "@/components/exercises/SelfReview";
import CountingGame from "@/components/exercises/CountingGame";
import HintSystem from "@/components/HintSystem";
import { useSound } from "@/hooks/useSound";
import StreakMilestone from "@/components/StreakMilestone";
import { useVoice, getExerciseSpeechText } from "@/hooks/useVoice";
import { getActiveProfileId, loadFamily } from "@/lib/family";
import { getLastGradeStorageKey } from "@/lib/accountScopedStorage";



export default function DailyPage() {
  const { lang } = useLang();
  const [context, setContext] = useState<string | null>(null);
  useEffect(() => {
    const refresh = () => setContext(getDailyContext());
    refresh();
    const timer = window.setInterval(refresh, 1000);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("cleverli-active-profile-change", refresh);
    return () => { clearInterval(timer); window.removeEventListener("storage", refresh); window.removeEventListener("focus", refresh); window.removeEventListener("cleverli-active-profile-change", refresh); };
  }, []);
  return context ? <DailyChallengePage key={`${context}:${lang}`} context={context} /> : null;
}

function DailyChallengePage({ context }: { context: string }) {
  const { tr, lang } = useLang();
  const { recordAnswer, profile } = useProfileContext();
  const { play } = useSound();
  const { speak, stop, isSupported } = useVoice();
  const submitted = useRef(false);
  const active = useRef(true);
  const initialStreak = useRef(profile.dailyStreak);
  const [streakMilestone, setStreakMilestone] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [saveError, setSaveError] = useState(false);
  useEffect(() => {
    active.current = true;
    return () => { active.current = false; stop(); };
  }, [stop]);
  useEffect(() => {
    if (submitted.current && profile.dailyStreak > initialStreak.current && [3, 7, 14, 30].includes(profile.dailyStreak)) setStreakMilestone(profile.dailyStreak);
    initialStreak.current = profile.dailyStreak;
  }, [profile.dailyStreak]);
  // Use the last-selected grade from dashboard, default to grade 1
  const [grade] = useState(() => {
    if (typeof window === "undefined") return 1;
    // ✅ Prefer active child's grade from family store
    try {
      const activeId = getActiveProfileId();
      const family = loadFamily();
      const member = (family.members ?? []).find((m: { id: string; grade: number }) => m.id === activeId);
      if (member?.grade && [1,2,3,4,5,6].includes(member.grade)) return member.grade;
    } catch { /* fall through */ }
    const saved = localStorage.getItem(getLastGradeStorageKey());
    const g = saved ? parseInt(saved) : 1;
    return [1,2,3,4,5,6].includes(g) ? g : 1;
  });
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(() => Date.now());
  const [alreadyDone, setAlreadyDone] = useState(false);

  const [challenge, setChallenge] = useState<{
    exercise: Exercise;
    subject: string;
    topic: { id: string; title: string; emoji: string };
  } | null | undefined>(undefined);

  useEffect(() => {
    setAlreadyDone(isDailyDoneToday());
  }, []);

  useEffect(() => {
    const saved = getDailyState();
    if (isDailyDoneToday() && saved?.review) {
      setChallenge(saved.review);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/daily-challenge?grade=${grade}&lang=${lang}&date=${todayKey()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Daily challenge HTTP ${response.status}`);
        return response.json();
      })
      .then(setChallenge)
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("[daily] Failed to load challenge", error);
        setChallenge(null);
      });
    return () => controller.abort();
  }, [grade, lang]);

  if (challenge === undefined) return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <p className="text-gray-400">{lang === "fr" ? "Chargement…" : lang === "it" ? "Caricamento…" : lang === "en" ? "Loading…" : "Wird geladen…"}</p>
    </div>
  );

  if (!challenge) return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <p className="text-gray-400">{lang === "fr" ? "Pas d'exercice disponible." : lang === "it" ? "Nessun esercizio disponibile." : lang === "en" ? "No exercise available." : "Keine Aufgabe verfügbar."}</p>
    </div>
  );

  const { exercise, topic, subject } = challenge;
  const localizedExercise = exercise;

  const done = alreadyDone || answered === true;
  const reviewLang = done ? (getDailyState()?.review?.lang ?? lang) : lang;
  const speechLang = subject === "german" ? "de" : subject === "english" ? "en" : subject === "french" ? "fr" : reviewLang;
  const handleAnswer = async (correct: boolean) => {
    if (!active.current || submitted.current || done || context !== getDailyContext()) return;
    submitted.current = true;
    const save = () => {
      if (!active.current || context !== getDailyContext()) return;
      if (isDailyDoneToday()) { setAlreadyDone(true); return; }
      const award = markDailyComplete(correct, context, { ...challenge, lang });
      play(correct ? "correct" : "wrong");
      setAnswered(correct);
      if (!correct || award) recordAnswer({
        correct, streak: 0, hintsUsed, isTopicComplete: false,
        score: correct ? 1 : 0, total: 1, grade, subject,
        topicDurationMs: Date.now() - startTime, lang,
        bonusXp: award ? DAILY_XP_BONUS : 0,
      });
    };
    try {
      // Serialise simultaneous tabs; the synchronous persistent claim also
      // protects reloads, repeated callbacks and retry-button double clicks.
      if (navigator.locks) await navigator.locks.request(context, save);
      else save();
    } catch {
      setSaveError(true);
      submitted.current = false;
    }
  };
  const subjectLabel = getLocalizedSubjectName(subject, lang);

  // ── Active challenge ─────────────────────────────────────────────
  return (
    <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
      {streakMilestone && <StreakMilestone streak={streakMilestone} lang={lang} onDismiss={() => setStreakMilestone(null)} />}
      {/* UJ-10: Streak reminder — warn if streak > 0 and not yet done */}
      {!done && profile.dailyStreak > 0 && (
        <div className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium border-2 ${
          profile.streakGraceUsed
            ? "bg-red-50 border-red-300 text-red-800"
            : "bg-orange-50 border-orange-300 text-orange-800"
        }`}>
          <span className="text-xl">{profile.streakGraceUsed ? "🚨" : "🔥"}</span>
          <div>
            <span className="font-bold">
              {profile.streakGraceUsed
                ? (lang === "fr" ? "⚠️ Dernière chance — ta série expire ce soir!"
                   : lang === "it" ? "⚠️ Ultima possibilità — la tua serie scade stasera!"
                   : lang === "en" ? "⚠️ Last chance — your streak expires tonight!"
                   : "⚠️ Letzte Chance — dein Streak endet heute Nacht!")
                : (lang === "fr" ? `🔥 Série de ${profile.dailyStreak} jours — continue!`
                   : lang === "it" ? `🔥 Serie di ${profile.dailyStreak} giorni — continua!`
                   : lang === "en" ? `🔥 ${profile.dailyStreak}-day streak — keep it up!`
                   : `🔥 ${profile.dailyStreak}-Tage-Streak — halte ihn aufrecht!`)
              }
            </span>
            <span className="ml-2 text-xs opacity-70">
              {lang === "fr" ? "Termine aujourd'hui avant minuit"
               : lang === "it" ? "Completa prima di mezzanotte"
               : lang === "en" ? "Complete before midnight"
               : "Aufgabe vor Mitternacht lösen"}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-300 rounded-2xl px-4 py-3">
        <span className="text-3xl">⚡</span>
        <div>
          <div className="font-black text-amber-800 text-base">
            {tr("dailyTitle")}
          </div>
          <div className="text-xs text-amber-600">
            {subjectLabel} · {topic.emoji} {getTopicTitle(topic.id, lang, topic.title)} · +{DAILY_XP_BONUS} Bonus-XP
          </div>
        </div>
        <Image src="/cleverli-run.png" alt="Cleverli" width={52} height={52} className="ml-auto drop-shadow-sm" />
      </div>

      {(answered !== null || alreadyDone) && (
        <section role="status" className={`rounded-2xl border-2 p-4 space-y-3 ${done ? "bg-green-50 border-green-300" : "bg-orange-50 border-orange-300"}`}>
          <h1 className="text-xl font-black">{done ? tr("dailyDone") : tr("wrong")}</h1>
          <p>{done ? tr("dailyTomorrow") : tr("correctAnswerWas") + " " + exercise.answer}</p>
          {!done && <button type="button" onClick={() => { submitted.current = false; setAnswered(null); setAttempt(a => a + 1); }} className="min-h-12 rounded-xl bg-green-700 px-5 py-3 font-bold text-white">{lang === "fr" ? "Réessayer" : lang === "it" ? "Riprova" : lang === "en" ? "Try again" : "Noch einmal versuchen"}</button>}
        </section>
      )}
      {saveError && <p role="alert">{lang === "de" ? "Speichern nicht möglich. Bitte erlaube den lokalen Speicher und lade die Seite neu." : "Unable to save. Please enable local storage and reload."}</p>}
      {/* Exercise card remains mounted after an incorrect answer. */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-4 min-h-[260px] flex flex-col justify-center">
        {isSupported && <button type="button" onClick={() => speak(getExerciseSpeechText(exercise, localizedExercise, subject, speechLang), speechLang)} aria-label={tr("readAloudTitle")} title={tr("readAloudTitle")} className="min-h-12 w-full rounded-xl border border-green-200 bg-green-50 px-3 py-3 font-semibold text-green-700">{tr("readAloud")}</button>}
        {done ? <section aria-label={lang === "de" ? "Aufgabe und Lösung" : "Question and answer"} className="space-y-4">
          <p className="text-lg font-semibold">{exercise.question}</p>
          {exercise.image && <Image src={exercise.image} alt="" width={180} height={180} />}
          {exercise.type === "counting" && <p className="text-3xl break-words">{Array.from({ length: Math.min(100, Number(exercise.answer) || 0) }, () => exercise.emoji ?? "⭐").join(" ")}</p>}
          <p className="rounded-xl bg-green-50 p-3 font-bold">{exercise.type === "self-review" ? tr("exampleAnswer") : tr("correctAnswerWas")} {exercise.answer}</p>
          {exercise.reviewCriteria?.map(item => <p key={item}>✓ {item}</p>)}
        </section> : <div key={attempt}>
        {exercise.type === "multiple-choice" && (
          <MultipleChoice
            question={localizedExercise.question}
            options={localizedExercise.options ?? []}
            answer={localizedExercise.answer}
            onAnswer={handleAnswer}
            optionImages={localizedExercise.optionImages}
            optionEmojis={localizedExercise.optionEmojis}
            questionImage={localizedExercise.image}
          />
        )}
        {exercise.type === "fill-in-blank" && (
          <FillInBlank
            question={localizedExercise.question}
            answer={localizedExercise.answer}
            altAnswers={localizedExercise.altAnswers}
            sequentialAnswer={localizedExercise.sequentialAnswer}
            onAnswer={handleAnswer}
            questionImage={localizedExercise.image}
          />
        )}
        {exercise.type === "self-review" && (
          <SelfReview
            question={localizedExercise.question}
            exampleAnswer={localizedExercise.answer}
            criteria={localizedExercise.reviewCriteria ?? []}
            onAnswer={handleAnswer}
          />
        )}
        {exercise.type === "counting" && (
          <CountingGame
            question={localizedExercise.question}
            answer={localizedExercise.answer}
            emoji={localizedExercise.emoji}
            options={localizedExercise.options ?? []}
            onAnswer={handleAnswer}
          />
        )}
        </div>}
        <HintSystem hints={localizedExercise.hints} speechLang={speechLang} onHintUsed={() => setHintsUsed(h => h + 1)} />
      </div>

      {done && <Link href="/dashboard" className="block rounded-xl bg-green-700 p-3 text-center font-bold text-white">{tr("learnNav")}</Link>}
      <p className="text-center text-xs text-gray-400">
        {tr("dailyMotivation")}
      </p>
    </main>
  );
}
