"use client";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { getActiveProfileId, loadFamily } from "@/lib/family";
import { syncTopicProgressToSupabase } from "@/lib/progressSync";
import { Topic, Exercise } from "@/types/exercise";
import MultipleChoice from "./exercises/MultipleChoice";
import FillInBlank from "./exercises/FillInBlank";
import SelfReview from "./exercises/SelfReview";
import CountingGame from "./exercises/CountingGame";
import Matching from "./exercises/Matching";
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
import { getTierProgress } from "@/lib/tierProgress";
import { setExerciseInProgress } from "@/app/learn/[grade]/[subject]/[topic]/TopicBreadcrumb";
import { useVoice, getPhrase } from "@/hooks/useVoice";
import { useSound } from "@/hooks/useSound";
import PushPrompt from "./PushPrompt";
import ExerciseIssueReporter from "./ExerciseIssueReporter";
import { useLang } from "@/lib/LangContext";
import { useProfileContext } from "@/lib/ProfileContext";
import { useSession } from "@/hooks/useSession";
import Confetti from "./Confetti";
import { checkAndUnlockRewards, loadRewards, countCompletedExercises, countCompletedTopics, countTotalStars, Reward } from "@/lib/rewards";
import RewardUnlockedModal from "./RewardUnlockedModal";
import { getLevelForXp, getNextLevel } from "@/lib/xp";
import SignupPromptModal from "./SignupPromptModal";
import { getProgressSubjectsFromCatalog } from "@/data/topicCatalog";
import { getProfileStorageKey, getTopicProgressStorageKey, hasAuthenticatedStorageScope } from "@/lib/accountScopedStorage";
import { trackExerciseEvent, ExerciseTelemetryPayload } from "@/lib/exerciseTelemetry";
import { startCheckout } from "@/lib/checkoutClient";
import { captureAppError } from "@/lib/monitoring";
import { getEffectiveCompleted, mergeCompletedProgress } from "@/lib/topicProgress";
import { localizeExercise } from "@/lib/exerciseLocalization";
import { normaliseCorrectExerciseIds } from "@/lib/exerciseIdProgress";

interface Props { topic: Topic; grade: number; subject: string; isPremium?: boolean; nextTopicId?: string | null; focusExerciseId?: string | null; }

const FREE_EXERCISE_LIMIT = 20;
const FREE_TRIAL_CHECKOUT_OPTIONS = { trialDays: 7 };
const FREE_TRIAL_SIGNUP_URL = "/signup?checkout=yearly&source=free_exercise_trial_bridge&trial=7";
const FREE_TRIAL_LOGIN_URL = "/login?checkout=yearly&source=free_exercise_trial_bridge&trial=7";

function calcStars(score: number, total: number) {
  const pct = score / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  return 1;
}

function sortByDifficulty(exercises: Exercise[]) {
  return [...exercises].sort((a, b) => (a.difficulty ?? 2) - (b.difficulty ?? 2));
}

function getExerciseId(exercise: Exercise, index: number) {
  return exercise.id ?? `exercise-${index}`;
}

function getCorrectIdSet(topic: Topic, progress: { correctIds?: string[]; completed?: number; score?: number; stars?: number } | null | undefined) {
  const sorted = sortByDifficulty(topic.exercises);
  if (Array.isArray(progress?.correctIds) && progress.correctIds.length > 0) {
    return normaliseCorrectExerciseIds(topic, progress.correctIds);
  }

  const completed = getEffectiveCompleted(progress, topic.exercises.length);
  return new Set(sorted.slice(0, completed).map(getExerciseId));
}

function getStoredCompleted(topic: Topic, grade: number, subject: string) {
  if (typeof window === "undefined") return 0;
  try {
    return getEffectiveCompleted(getStoredProgress(grade, subject, topic.id), topic.exercises.length);
  } catch {
    return 0;
  }
}

function getStoredProgress(grade: number, subject: string, topicId: string) {
  if (typeof window === "undefined") return null;
  const activeChildId = getActiveProfileId();
  for (const progressSubject of getProgressSubjectsFromCatalog(grade, subject, topicId)) {
    const raw = localStorage.getItem(getTopicProgressStorageKey(grade, progressSubject, topicId, activeChildId)) ?? (
      hasAuthenticatedStorageScope() ? null : localStorage.getItem(`cleverli_${grade}_${progressSubject}_${topicId}`)
    );
    if (raw) return JSON.parse(raw);
  }
  return null;
}

function selectCurrentTierExercises(topic: Topic, correctIds: Set<string>) {
  const sorted = sortByDifficulty(topic.exercises);
  const entries = sorted.map((exercise, index) => ({ exercise, index }));
  const easy = entries.filter(({ exercise }) => exercise.difficulty === 1);
  const medium = entries.filter(({ exercise }) => exercise.difficulty === 2);
  const hard = entries.filter(({ exercise }) => (exercise.difficulty ?? 2) === 3);
  const isDone = ({ exercise, index }: { exercise: Exercise; index: number }) => correctIds.has(getExerciseId(exercise, index));
  const remainingEasy = easy.filter(entry => !isDone(entry)).map(({ exercise }) => exercise);
  const remainingMedium = medium.filter(entry => !isDone(entry)).map(({ exercise }) => exercise);
  const remainingHard = hard.filter(entry => !isDone(entry)).map(({ exercise }) => exercise);

  if (remainingEasy.length > 0) return remainingEasy;
  if (remainingMedium.length > 0) return remainingMedium;
  return remainingHard;
}

function getInitialSessionStart(topic: Topic, grade: number, subject: string) {
  const completed = getCorrectIdSet(topic, getStoredProgress(grade, subject, topic.id)).size;
  return completed >= topic.exercises.length ? 0 : completed;
}

function getInitialSessionExercises(topic: Topic, grade: number, subject: string) {
  const correctIds = getCorrectIdSet(topic, getStoredProgress(grade, subject, topic.id));
  return correctIds.size >= topic.exercises.length
    ? sortByDifficulty(topic.exercises)
    : selectCurrentTierExercises(topic, correctIds);
}

function findExerciseById(topic: Topic, exerciseId: string | null | undefined) {
  if (!exerciseId) return null;
  return topic.exercises.find((exercise, index) => getExerciseId(exercise, index) === exerciseId) ?? null;
}

export default function ExercisePlayer({ topic, grade, subject, isPremium = false, nextTopicId = null, focusExerciseId = null }: Props) {
  const router = useRouter();

  const getCompletedCoin = (completedCount: number) => {
    const boundaries = getTierProgress(topic, topic.exercises.length);

    if (completedCount >= topic.exercises.length && boundaries.hard.total > 0) {
      return {
        emoji: "🥇",
        label: lang === "fr" ? "Pièce Cleverli or" : lang === "it" ? "Moneta Cleverli oro" : lang === "en" ? "Cleverli gold coin" : "Cleverli Gold-Münze",
        tone: "from-yellow-50 to-amber-100 border-yellow-300 text-yellow-900",
      };
    }

    if (completedCount >= boundaries.mediumBoundary && boundaries.medium.total > 0) {
      return {
        emoji: "🥈",
        label: lang === "fr" ? "Pièce Cleverli argent" : lang === "it" ? "Moneta Cleverli argento" : lang === "en" ? "Cleverli silver coin" : "Cleverli Silber-Münze",
        tone: "from-slate-50 to-gray-100 border-gray-300 text-gray-800",
      };
    }

    if (completedCount >= boundaries.easyBoundary && boundaries.easy.total > 0) {
      return {
        emoji: "🥉",
        label: lang === "fr" ? "Pièce Cleverli bronze" : lang === "it" ? "Moneta Cleverli bronzo" : lang === "en" ? "Cleverli bronze coin" : "Cleverli Bronze-Münze",
        tone: "from-amber-50 to-orange-100 border-orange-300 text-orange-900",
      };
    }

    return null;
  };
  const { speak, stop, isSupported } = useVoice();
  const { play } = useSound();
  const { tr, lang } = useLang();
  const exerciseSpeechLang = subject === "german" || subject === "mi" ? "de" : subject === "english" ? "en" : subject === "french" ? "fr" : lang;
  const { recordAnswer, profile, leveledUp, clearLeveledUp } = useProfileContext();
  const { session } = useSession();
  const level = getLevelForXp(profile.xp);
  const nextLevel = getNextLevel(profile.xp);
  const levelTitle =
    lang === "fr" ? level.titleFr :
    lang === "it" ? level.titleIt :
    lang === "en" ? level.titleEn :
    level.title;
  
  // Track anonymous free usage and offer the trial bridge at the free limit.
  const [anonExerciseCount, setAnonExerciseCount] = useState(0);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const isAnonymous = !session;
  
  useEffect(() => {
    if (isAnonymous) {
      const count = parseInt(localStorage.getItem("cleverli_anon_exercises") ?? "0");
      setAnonExerciseCount(count);
    }
  }, [isAnonymous]);
  const uid = session?.userId ?? "";
  const freeUsageKey = uid ? `cleverli_free_exercises_${uid}` : "cleverli_anon_exercises";
  const [freeExercisesUsed, setFreeExercisesUsed] = useState(() => profile.totalExercises);
  // Select the current difficulty section, so Grün/Gelb/Rot progress matches the actual session.
  const initialFocusedExercise = findExerciseById(topic, focusExerciseId);
  const [sessionStartCompleted, setSessionStartCompleted] = useState(() => initialFocusedExercise ? 0 : getInitialSessionStart(topic, grade, subject));
  const [fullSetExercises, setFullSetExercises] = useState(() => initialFocusedExercise ? [initialFocusedExercise] : getInitialSessionExercises(topic, grade, subject));
  const [exercises, setExercises] = useState(fullSetExercises);
  const [isReplayMode, setIsReplayMode] = useState(() => Boolean(initialFocusedExercise) || getStoredCompleted(topic, grade, subject) >= topic.exercises.length);
  const [correctIds, setCorrectIds] = useState<Set<string>>(() => getCorrectIdSet(topic, getStoredProgress(grade, subject, topic.id)));
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);
  const [showReview, setShowReview] = useState(false); // show "review mistakes?" screen
  const [cardKey, setCardKey] = useState(0);
  const [unlockedReward, setUnlockedReward] = useState<Reward | null>(null);
  const [voiceOn, setVoiceOn] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [comboVisible, setComboVisible] = useState(false);
  const [wrongCountSession, setWrongCountSession] = useState(0);
  const [showPerfect, setShowPerfect] = useState(false);
  const [tierToast, setTierToast] = useState<string | null>(null);
  const [mascotReaction, setMascotReaction] = useState<'correct'|'wrong'|null>(null);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const topicStartRef = useRef<number>(Date.now());
  const answerScrollRef = useRef<{ x: number; y: number } | null>(null);
  const currentCompleted = correctIds.size;
  const tierInfo = getTierProgress(topic, currentCompleted);
  const sessionTotal = Math.max(1, exercises.length);
  const sourceCurrent: Exercise = exercises[idx] ?? sortByDifficulty(topic.exercises)[0];
  const current: Exercise = localizeExercise(sourceCurrent, lang);
  const reportContext = {
    session,
    grade,
    subject,
    topicId: topic.id,
    topicTitle: topic.title,
    exerciseId: sourceCurrent?.id ?? null,
    exerciseType: sourceCurrent?.type ?? null,
    question: current?.question ?? sourceCurrent?.question ?? null,
    childId: getActiveProfileId(),
  };
  const progressLabel = () => {
    if (isReviewMode) {
      return lang === "fr" ? `Révision ${idx + 1} / ${sessionTotal}` : lang === "it" ? `Ripasso ${idx + 1} / ${sessionTotal}` : lang === "en" ? `Review ${idx + 1} of ${sessionTotal}` : `Fehler üben ${idx + 1} von ${sessionTotal}`;
    }
    if (!isReplayMode && sessionStartCompleted > 0) {
      const doneCount = Math.min(topic.exercises.length, correctIds.size);
      const openCount = Math.max(0, topic.exercises.length - doneCount);
      return lang === "fr"
        ? `${doneCount} sur ${topic.exercises.length} terminés · ${openCount} ouverts`
        : lang === "it"
        ? `${doneCount} di ${topic.exercises.length} completati · ${openCount} aperti`
        : lang === "en"
        ? `${doneCount} of ${topic.exercises.length} done · ${openCount} open`
        : `${doneCount} von ${topic.exercises.length} erledigt · ${openCount} offen`;
    }
    return lang === "fr" ? `Exercice ${idx + 1} / ${sessionTotal}` : lang === "it" ? `Esercizio ${idx + 1} / ${sessionTotal}` : lang === "en" ? `Exercise ${idx + 1} of ${sessionTotal}` : `Aufgabe ${idx + 1} von ${sessionTotal}`;
  };
  useEffect(() => {
    try {
      const stored = parseInt(localStorage.getItem(freeUsageKey) ?? "0", 10) || 0;
      const legacyAnon = isAnonymous ? (parseInt(localStorage.getItem("cleverli_anon_exercises") ?? "0", 10) || 0) : 0;
      const used = Math.max(stored, legacyAnon, profile.totalExercises);
      setFreeExercisesUsed(used);
      localStorage.setItem(freeUsageKey, String(used));
      if (isAnonymous) setAnonExerciseCount(used);
    } catch {
      setFreeExercisesUsed(profile.totalExercises);
    }
  }, [freeUsageKey, isAnonymous, profile.totalExercises]);

  const freeExercisesRemaining = Math.max(0, FREE_EXERCISE_LIMIT - freeExercisesUsed);
  const isFreeLimitLocked = !isPremium && freeExercisesUsed >= FREE_EXERCISE_LIMIT;
  const isLocked = isFreeLimitLocked;
  const exerciseStartRef = useRef<number>(Date.now());

  useEffect(() => {
    const focusedExercise = findExerciseById(topic, focusExerciseId);
    if (!focusedExercise) return;

    setSessionStartCompleted(0);
    setFullSetExercises([focusedExercise]);
    setExercises([focusedExercise]);
    setIsReplayMode(true);
    setIsReviewMode(false);
    setWrongIds([]);
    setIdx(0);
    setScore(0);
    setStreak(0);
    setAnswered(null);
    setDone(false);
    setShowReview(false);
    setHintsUsed(0);
    setComboCount(0);
    setWrongCountSession(0);
    setCorrectAnswerCount(0);
    setTierToast(null);
    setMascotReaction(null);
    setCardKey(k => k + 1);
  }, [topic, focusExerciseId]);

  const exerciseTelemetryPayload = (extra: ExerciseTelemetryPayload = {}): ExerciseTelemetryPayload => ({
    exerciseId: current?.id ?? String(idx),
    grade,
    subject,
    topicId: topic.id,
    exerciseType: current?.type,
    attemptIndex: idx + 1,
    wrongCountSession,
    hintsUsed,
    topicIndex: idx + 1,
    topicTotal: sessionTotal,
    lang,
    ...extra,
  });

  useLayoutEffect(() => {
    if (answered === null || !answerScrollRef.current || typeof window === "undefined") return;
    const target = answerScrollRef.current;
    const restore = () => window.scrollTo(target.x, target.y);
    const rafIds: number[] = [];
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    restore();
    rafIds.push(requestAnimationFrame(() => {
      restore();
      rafIds.push(requestAnimationFrame(restore));
    }));
    [50, 150, 350].forEach(delay => timeoutIds.push(setTimeout(restore, delay)));

    return () => {
      rafIds.forEach(cancelAnimationFrame);
      timeoutIds.forEach(clearTimeout);
    };
  }, [answered]);
  

  // (voice is on-demand only — no auto-read)

  useEffect(() => {
    if (done || isLocked || !current) return;

    exerciseStartRef.current = Date.now();
    trackExerciseEvent("exercise_started", exerciseTelemetryPayload());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, idx, done, isLocked]);

  useEffect(() => {
    if (!isLocked) return;

    trackExerciseEvent("paywall_shown", exerciseTelemetryPayload());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked]);

  // Save partial progress when free limit is reached (so stars show on topic list)
  useEffect(() => {
    if (isLocked && score > 0) {
      const completed = Math.min(topic.exercises.length, correctIds.size);
      const s = calcStars(score, Math.max(1, idx)); // stars based on the current free session
      const existing = getStoredProgress(grade, subject, topic.id) ?? {};
      localStorage.setItem(getTopicProgressStorageKey(grade, subject, topic.id, getActiveProfileId()), JSON.stringify({
        ...existing,
        completed,
        score: Math.max(Number(existing?.score ?? 0), completed, score),
        stars: s,
        correctIds: Array.from(correctIds),
        partial: true,
        lastPlayed: new Date().toISOString()
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked]);

  // Save progress when done — only overwrite if new score is better or equal
  useEffect(() => {
    if (done) {
      if (isReplayMode || isReviewMode) return;
      const key = getTopicProgressStorageKey(grade, subject, topic.id, getActiveProfileId());
      const existing = getStoredProgress(grade, subject, topic.id) ?? {};
      const prevScore = existing?.score ?? 0;
      const prevStars = existing?.stars ?? 0;
      const completedCount = Math.min(topic.exercises.length, correctIds.size);
      const fullTopicComplete = completedCount >= topic.exercises.length;
      const effectiveScore = fullTopicComplete ? Math.max(score, completedCount) : Math.max(prevScore, score, completedCount);
      const s = calcStars(effectiveScore, fullTopicComplete ? topic.exercises.length : exercises.length);
      const lastPlayed = new Date().toISOString();
      const progressData = {
        ...existing,
        completed: mergeCompletedProgress(existing, completedCount, topic.exercises.length),
        score: Math.max(prevScore, effectiveScore),
        stars: completedCount >= topic.exercises.length ? Math.max(prevStars, s) : prevStars,
        correctIds: Array.from(correctIds),
        partial: completedCount < topic.exercises.length,
        lastPlayed,
      };
      localStorage.setItem(key, JSON.stringify(progressData));
      // Fire-and-forget sync to Supabase
      const childId = getActiveProfileId();
      if (childId) {
        syncTopicProgressToSupabase(childId, grade, subject, topic.id, {
          ...progressData,
        });
      }
    }
  }, [done, score, grade, subject, topic.id, topic.exercises.length, exercises.length, correctIds, isReplayMode, isReviewMode]);

  const startTopicSession = (mode: "next" | "replay") => {
    topicStartRef.current = Date.now();
    const storedCorrectIds = getCorrectIdSet(topic, getStoredProgress(grade, subject, topic.id));
    const storedCompleted = storedCorrectIds.size;
    const hasRemaining = storedCompleted < topic.exercises.length;
    const replay = mode === "replay" || !hasRemaining;
    const nextStart = replay ? 0 : storedCompleted;
    const nextExercises = replay
      ? sortByDifficulty(topic.exercises)
      : selectCurrentTierExercises(topic, storedCorrectIds);

    setSessionStartCompleted(nextStart);
    setCorrectIds(replay ? new Set() : storedCorrectIds);
    setFullSetExercises(nextExercises);
    setExercises(nextExercises.length > 0 ? nextExercises : sortByDifficulty(topic.exercises));
    setIsReplayMode(replay);
    setIdx(0);
    setScore(0);
    setStreak(0);
    setAnswered(null);
    setDone(false);
    setWrongIds([]);
    setIsReviewMode(false);
    setShowReview(false);
    setHintsUsed(0);
    setComboCount(0);
    setWrongCountSession(0);
    setCorrectAnswerCount(0);
    setTierToast(null);
    setMascotReaction(null);
    setCardKey(k => k + 1);
    window.dispatchEvent(new CustomEvent("cleverli-progress-update"));
  };

  const handleAnswer = (correct: boolean) => {
    stop();
    setExerciseInProgress(true); // UJ-12: mark exercise as in-progress on first answer
    const newStreak = correct ? streak + 1 : 0;
    const newScore = correct ? score + 1 : score;
    const newWrongCount = correct ? wrongCountSession : wrongCountSession + 1;
    const currentId = getExerciseId(exercises[idx] ?? current, sessionStartCompleted + idx);
    const nextCorrectIds = new Set(correctIds);
    if (correct && !isReplayMode) nextCorrectIds.add(currentId);

    trackExerciseEvent(correct ? "exercise_completed" : "exercise_wrong_answer", exerciseTelemetryPayload({
      isCorrect: correct,
      wrongCountSession: newWrongCount,
      durationMs: Date.now() - exerciseStartRef.current,
    }));

    // Combo tracking
    if (correct) {
      setScore(s => s + 1);
      if (!isReplayMode) setCorrectIds(nextCorrectIds);
      setStreak(newStreak);
      const newCombo = comboCount + 1;
      setComboCount(newCombo);

      // Show combo badges at 3, 5, and 8
      if (newCombo === 3 || newCombo === 5 || newCombo === 8) {
        play("combo");
        setComboVisible(true);
        setTimeout(() => setComboVisible(false), 1200);
      }
    } else {
      setComboCount(0);
      setWrongCountSession(w => w + 1);
      setStreak(0);
      // UJ-7: track wrong exercise IDs for review
      const exId = exercises[idx]?.id ?? String(idx);
      setWrongIds(ids => ids.includes(exId) ? ids : [...ids, exId]);
    }
    answerScrollRef.current = typeof window === "undefined" ? null : { x: window.scrollX, y: window.scrollY };
    setAnswered(correct);

    // Mascot reaction overlay
    setMascotReaction(correct ? 'correct' : 'wrong');
    setTimeout(() => setMascotReaction(null), correct ? 1200 : 1000);
    if (correct) setCorrectAnswerCount(c => c + 1);

    // Record XP — topic completion only counts when the full topic is really done.
    const isLast = idx + 1 >= exercises.length;
    const absoluteCompleted = Math.min(topic.exercises.length, nextCorrectIds.size);
    const isFullTopicComplete = correct && isLast && !isReplayMode && !isReviewMode && absoluteCompleted >= topic.exercises.length;
    // Tier crossing detection (for achievements)
    let tierCompleted: "easy" | "medium" | "hard" | undefined;
    if (correct && tierInfo.isTiered) {
      if (absoluteCompleted === tierInfo.easyBoundary)   tierCompleted = "easy";
      if (absoluteCompleted === tierInfo.mediumBoundary) tierCompleted = "medium";
      if (isFullTopicComplete)                           tierCompleted = "hard";
    }
    if (!isReplayMode && !isReviewMode) {
      recordAnswer({
        correct,
        streak: comboCount, // pass comboCount as streak param
        hintsUsed,
        isTopicComplete: isFullTopicComplete,
        score: newScore,
        total: sessionTotal,
        grade,
        subject,
        topicDurationMs: isFullTopicComplete ? Date.now() - topicStartRef.current : undefined,
        lang,
        tierCompleted,
      });
    }

    // Count every answered free task, not only correct answers.
    if (!isPremium) {
      const newCount = Math.max(freeExercisesUsed + 1, profile.totalExercises + (correct ? 1 : 0));
      setFreeExercisesUsed(newCount);
      try {
        localStorage.setItem(freeUsageKey, String(newCount));
        if (isAnonymous) localStorage.setItem("cleverli_anon_exercises", String(newCount));
      } catch {}
      if (isAnonymous) setAnonExerciseCount(newCount);

      if (isAnonymous && newCount >= FREE_EXERCISE_LIMIT && !localStorage.getItem("cleverli_signup_dismissed")) {
        setTimeout(() => setShowSignupPrompt(true), 1000);
      }
    }

    // Update localStorage topic progress with current completed count (for tier display)
    if (correct && !isReplayMode) {
      const topicKey = getTopicProgressStorageKey(grade, subject, topic.id, getActiveProfileId());
      const existing = getStoredProgress(grade, subject, topic.id) ?? {};
      localStorage.setItem(topicKey, JSON.stringify({
        ...existing,
        completed: mergeCompletedProgress(existing, absoluteCompleted, topic.exercises.length),
        score: Math.max(Number(existing?.score ?? 0), absoluteCompleted, newScore),
        correctIds: Array.from(nextCorrectIds),
        lastPlayed: new Date().toISOString(),
      }));
      window.dispatchEvent(new CustomEvent("cleverli-progress-update"));
    }

    // Check reward unlocks after every correct answer
    if (correct && !isReplayMode && !isReviewMode) {
      setTimeout(() => {
        try {
          const activeChildId = getActiveProfileId();
          const family = loadFamily();
          const activeMember = family.members.find((member) => member.id === activeChildId) ?? family.members[0] ?? null;
          const totalTopicsComplete = countCompletedTopics(activeChildId, activeMember?.curriculum);
          const scopedTotalStars = countTotalStars(activeChildId, activeMember?.curriculum);
          // Build snapshot from localStorage profile (rewards.ts reads it internally)
          const profileRaw = typeof window !== "undefined" ? localStorage.getItem(getProfileStorageKey(activeChildId)) : null;
          const prof = profileRaw ? JSON.parse(profileRaw) : null;
          if (prof) {
            const snap = {
              totalExercises: Math.max(prof.totalExercises ?? 0, countCompletedExercises(activeChildId, activeMember?.curriculum)),
              totalTopicsComplete,
              dailyStreak: prof.dailyStreak ?? 0,
              totalStars: scopedTotalStars,
            };
            const newIds = checkAndUnlockRewards(snap, activeChildId);
            if (newIds.length > 0) {
              const all = loadRewards(activeChildId);
              const first = all.find(r => r.id === newIds[0]);
              if (first) setUnlockedReward(first);
            }
          }
        } catch (error) {
          captureAppError(error, { area: "reward_unlock", exerciseId: current?.id ?? String(idx), topicId: topic.id });
        }
      }, 400); // slight delay so profile state has settled
    }

    // Sound first, then voice after a short pause
    if (correct && (newStreak === 3 || newStreak === 5 || newStreak === 8)) {
      play("streak");
      setTimeout(() => { if (voiceOn) speak(getPhrase("streak"), "de"); }, 400);
    } else if (correct) {
      play("correct");
      setTimeout(() => { if (voiceOn) speak(getPhrase("correct"), "de"); }, 300);
    } else {
      play("wrong");
      setTimeout(() => { if (voiceOn) speak(getPhrase("wrong"), "de"); }, 300);
    }
  };

  const handleContinue = () => {
    if (idx + 1 >= exercises.length) {
      // Check for perfect run
      if (wrongCountSession === 0 && topic.exercises.length >= 5) {
        setShowPerfect(true);
        play("perfect");
        setTimeout(() => setShowPerfect(false), 1800);
      } else {
        play("complete");
        setTimeout(() => { if (voiceOn) speak(getPhrase("complete"), "de"); }, 600);
      }
      setExerciseInProgress(false); // UJ-12: clear in-progress flag on completion
      // UJ-7: if review mode done, check if still wrong answers → repeat, else done
      if (isReviewMode) {
        if (wrongIds.length > 0) { setShowReview(true); return; }
        setDone(true); return;
      }
      // UJ-7: if mistakes exist and not already reviewing, show review prompt
      if (wrongIds.length > 0) { setShowReview(true); return; }
      setDone(true);
      return;
    }
    // Tier completion toast (fires when we cross a boundary, non-review mode)
    if (!isReviewMode && answered === true && tierInfo.isTiered) {
      const nextCompleted = Math.min(topic.exercises.length, correctIds.size);
      if (nextCompleted === tierInfo.easyBoundary) {
        setTierToast("🌱 Leichte Aufgaben geschafft! +20 XP");
        setTimeout(() => setTierToast(null), 2500);
      } else if (nextCompleted === tierInfo.mediumBoundary) {
        setTierToast("⚡ Mittlere Aufgaben geschafft! +30 XP");
        setTimeout(() => setTierToast(null), 2500);
      }
    }
    setIdx(i => i + 1);
    setAnswered(null);
    setCardKey(k => k + 1);
    // Notify TopicClient so roadmap animates in real-time
    window.dispatchEvent(new CustomEvent("cleverli-progress-update"));
  };

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

  // UJ-7: start review round
  const startReview = () => {
    if (!isReplayMode && !isReviewMode) {
      const key = getTopicProgressStorageKey(grade, subject, topic.id, getActiveProfileId());
      const existing = getStoredProgress(grade, subject, topic.id) ?? {};
      const prevScore = existing?.score ?? 0;
      const prevStars = existing?.stars ?? 0;
      const completedCount = Math.min(topic.exercises.length, correctIds.size);
      const fullTopicComplete = completedCount >= topic.exercises.length;
      const effectiveScore = fullTopicComplete ? Math.max(score, completedCount) : Math.max(prevScore, score, completedCount);
      const s = calcStars(effectiveScore, fullTopicComplete ? topic.exercises.length : sessionTotal);
      const progressData = {
        ...existing,
        completed: mergeCompletedProgress(existing, completedCount, topic.exercises.length),
        score: Math.max(prevScore, effectiveScore),
        stars: completedCount >= topic.exercises.length ? Math.max(prevStars, s) : prevStars,
        correctIds: Array.from(correctIds),
        partial: completedCount < topic.exercises.length,
        lastPlayed: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify(progressData));
      const childId = getActiveProfileId();
      if (childId) {
        syncTopicProgressToSupabase(childId, grade, subject, topic.id, progressData);
      }
      window.dispatchEvent(new CustomEvent("cleverli-progress-update"));
    }

    const reviewExercises = topic.exercises.filter(e => wrongIds.includes(e.id ?? ""));
    setExercises(reviewExercises.length > 0 ? reviewExercises : topic.exercises.slice(0, 3));
    setIdx(0); setScore(0); setStreak(0); setAnswered(null);
    setCardKey(k => k + 1); setWrongIds([]); setIsReviewMode(true); setShowReview(false);
  };

  // ── UJ-7: Review prompt ─────────────────────────────────────────
  if (showReview) {
    return (
      <div className="space-y-4 max-w-md mx-auto text-center py-4 pb-28">
        <div className="text-5xl">🔄</div>
        <h2 className="text-xl font-bold text-gray-800">{tr("almostPerfect")}</h2>
        <p className="text-gray-500 text-sm">
          {wrongIds.length === 1
            ? tr("reviewWrongSingle")
            : (tr("reviewWrongMany") ?? "").replace("{n}", String(wrongIds.length))}
        </p>
        <button
          onClick={startReview}
          className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold text-base hover:bg-amber-600 active:scale-95 transition-all shadow-md"
        >
          {(tr("reviewBtnLabel") ?? "🔄 Nochmal üben ({n})").replace("{n}", String(wrongIds.length))}
        </button>
        <ExerciseIssueReporter
          {...reportContext}
          context="review"
          exerciseId={wrongIds[0] ?? reportContext.exerciseId}
          question={wrongIds.length ? `${wrongIds.length} Fehler in dieser Runde` : reportContext.question}
        />
        <button
          onClick={() => {
            setShowReview(false);
            setDone(true);
          }}
          className="w-full border-2 border-gray-200 text-gray-500 py-3 rounded-2xl font-medium text-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          {tr("continueWithout")} →
        </button>
      </div>
    );
  }

  // ── Topic Complete ──────────────────────────────────────────────
  if (done) {
    const completedCount = Math.min(topic.exercises.length, correctIds.size);
    const hasRemaining = !isReplayMode && completedCount < topic.exercises.length;
    const showTopicCompleteCelebration = !isReviewMode && !isReplayMode && completedCount >= topic.exercises.length;
    const totalEx = isReviewMode || hasRemaining || isReplayMode ? sessionTotal : topic.exercises.length;
    const displayScore = showTopicCompleteCelebration ? Math.max(score, completedCount) : score;
    const s = calcStars(displayScore, totalEx);
    const perfect = displayScore === totalEx;
    const completedCoin = showTopicCompleteCelebration ? getCompletedCoin(completedCount) : null;
    const primaryCompleteLabel = hasRemaining
      ? (lang === "fr" ? "Continuer ce thème" : lang === "it" ? "Continua questo argomento" : lang === "en" ? "Continue this topic" : "Weiter im Thema")
      : nextTopicId
      ? (tr("nextTopic") ?? "Nächstes Thema")
      : tr("otherTopics");
    return (
      <div className="space-y-4 max-w-md mx-auto">
        <RewardAnimation
          correct={true}
          isTopicComplete={showTopicCompleteCelebration}
          label={hasRemaining ? (lang === "fr" ? "Continue ce thème" : lang === "it" ? "Continua questo argomento" : lang === "en" ? "Continue this topic" : "Weiter in diesem Thema") : undefined}
          buttonLabel={primaryCompleteLabel}
          onContinue={() => hasRemaining ? startTopicSession("next") : nextTopicId ? router.push(`/learn/${grade}/${subject}/${nextTopicId}`) : router.push(`/learn/${grade}/${subject}`)}
        />
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center space-y-3">
          {isReviewMode ? (
            <p className="text-green-700 font-bold">🎉 {tr("allErrorsCorrected") ?? "Alle Fehler korrigiert!"}</p>
          ) : (
            <p className="text-gray-600 font-medium">
              {displayScore} / {totalEx} {tr("correct")}{perfect && (" — " + (tr("perfectRun") ?? "Perfekt! 🌟"))}
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
          {completedCoin && (
            <div className={`rounded-2xl border bg-gradient-to-r px-4 py-3 ${completedCoin.tone}`}>
              <div className="text-4xl mb-1">{completedCoin.emoji}</div>
              <div className="font-black">{completedCoin.label}</div>
              <div className="text-sm opacity-80">
                {lang === "fr"
                  ? "Directement débloquée à la fin du thème."
                  : lang === "it"
                    ? "Sbloccata subito alla fine del tema."
                    : lang === "en"
                      ? "Unlocked immediately at the end of the topic."
                      : "Direkt am Schluss vom Thema freigeschaltet."}
              </div>
            </div>
          )}
          {(hasRemaining || nextTopicId) && (
            <Link href={`/learn/${grade}/${subject}`}
              className="inline-flex min-h-11 items-center justify-center text-sm text-gray-500 underline hover:text-gray-700">
              {tr("otherTopics")}
            </Link>
          )}
          <ExerciseIssueReporter
            {...reportContext}
            context="topic_complete"
            exerciseId={null}
            exerciseType={null}
            question="Abschlussbildschirm / Thema"
          />
        </div>
        <style>{`@keyframes popIn{from{transform:scale(0.3);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
      </div>
    );
  }

  // ── Locked (free limit reached) ──────────────────────────────────
  if (isLocked) {
    // Anonymous users who used their 20 free tasks: show signup CTA.
    if (isAnonymous && isFreeLimitLocked) {
      return (
        <div className="text-center space-y-5 py-8 max-w-sm mx-auto">
          <Image src="/cleverli-wave.png" alt="Cleverli" width={110} height={110} className="mx-auto drop-shadow-md animate-cleverli-jump" />
          <h2 className="text-xl font-bold text-gray-800">
            {lang === "fr" ? "Tu as terminé les 20 exercices gratuits 🎉" : lang === "it" ? "Hai completato i 20 esercizi gratuiti 🎉" : lang === "en" ? "You've completed the 20 free exercises 🎉" : "Du hast 20 Aufgaben geschafft 🎉"}
          </h2>
          <p className="text-gray-500 text-sm">
            {lang === "fr" ? "Teste Premium pendant 7 jours: tous les exercices, toutes les classes, aucun débit aujourd'hui." : lang === "it" ? "Prova Premium per 7 giorni: tutti gli esercizi, tutte le classi, nessun addebito oggi." : lang === "en" ? "Try Premium for 7 days: all exercises, all grades, no charge today." : "Teste jetzt 7 Tage Premium: alle Übungen, alle Klassen, heute CHF 0."}
          </p>
          <div className="mx-auto w-full max-w-xs rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-left text-sm text-green-800 space-y-1">
            <div>✅ {lang === "en" ? "Progress saved" : "Fortschritt speichern"}</div>
            <div>✅ {lang === "en" ? "Up to 3 child profiles" : "Bis zu 3 Kinderprofile"}</div>
            <div>✅ {lang === "en" ? "Charge only after 7 days" : "Zahlung erst nach 7 Tagen"}</div>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
            <Link href={FREE_TRIAL_SIGNUP_URL}
              className="block text-center bg-green-700 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 active:scale-95 transition-all shadow-md text-base">
              🎉 {lang === "fr" ? "Tester 7 jours gratuitement" : lang === "it" ? "Prova gratis per 7 giorni" : lang === "en" ? "Start 7-day free trial" : "7 Tage gratis testen"}
            </Link>
            <Link href={FREE_TRIAL_LOGIN_URL}
              className="block text-center border-2 border-green-700 text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-green-50 active:scale-95 transition-all text-sm">
              {lang === "fr" ? "J'ai déjà un compte" : lang === "it" ? "Ho già un account" : lang === "en" ? "I already have an account" : "Ich habe bereits ein Konto"}
            </Link>
          </div>
          <p className="text-xs text-gray-400">
            {lang === "fr" ? "Annulable avant la fin des 7 jours." : lang === "it" ? "Puoi annullare prima della fine dei 7 giorni." : lang === "en" ? "Cancel before the 7 days end." : "Vor Ablauf der 7 Tage kündbar. Danach CHF 99/Jahr."}
          </p>
        </div>
      );
    }

    return (
      <div className="text-center space-y-4 py-8 max-w-sm mx-auto">
        <Image src="/cleverli-think.png" alt="Cleverli denkt nach" width={110} height={110} className="mx-auto drop-shadow-md" />
        <h2 className="text-xl font-bold text-gray-800">
          {lang === "fr" ? "Prêt pour Premium ?" : lang === "it" ? "Pronto per Premium?" : lang === "en" ? "Ready for Premium?" : "Bereit für Premium?"}
        </h2>
        <p className="text-gray-500 text-sm">
          {lang === "fr" ? "Teste 7 jours gratuitement: tous les exercices disponibles pour l'année, aucun débit aujourd'hui." : lang === "it" ? "Prova gratis per 7 giorni: tutti gli esercizi disponibili per la classe, nessun addebito oggi." : lang === "en" ? "Try 7 days free: all exercises available for the grade, no charge today." : "Teste 7 Tage gratis: alle verfügbaren Übungen für die Klasse, heute CHF 0."}
        </p>
        <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm text-green-800 text-left space-y-1 w-full max-w-xs">
          <div>✅ {lang === "en" ? "Progress saved" : "Fortschritt speichern"}</div>
          <div>✅ {lang === "en" ? "Subjects matched to each grade" : "Passende Fächer je Klasse"}</div>
          <div>✅ {lang === "en" ? "Up to 3 child profiles" : "Bis zu 3 Kinderprofile"}</div>
          <div>✅ {lang === "en" ? "Charge only after 7 days" : "Zahlung erst nach 7 Tagen"}</div>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <button type="button"
            onClick={() => startCheckout("yearly", "exercise_paywall_trial_bridge", uid, FREE_TRIAL_CHECKOUT_OPTIONS)}
            className="block text-center bg-green-700 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md text-base">
            {lang === "fr" ? "Tester Premium 7 jours" : lang === "it" ? "Prova Premium 7 giorni" : lang === "en" ? "Start 7-day Premium trial" : "7 Tage Premium gratis testen"}
          </button>
          <button type="button"
            onClick={() => startCheckout("monthly", "exercise_paywall_trial_bridge", uid, FREE_TRIAL_CHECKOUT_OPTIONS)}
            className="block text-center border-2 border-green-700 text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-green-50 active:scale-95 transition-all text-sm">
            {lang === "fr" ? "Mensuel après le test" : lang === "it" ? "Mensile dopo il test" : lang === "en" ? "Monthly after trial" : "Monatlich nach dem Test"}
          </button>
          {!uid && (
            <Link href={FREE_TRIAL_LOGIN_URL} className="block text-center text-xs text-gray-400 hover:text-gray-600 underline pt-1">
              {lang === "fr" ? "J'ai déjà un compte" : lang === "it" ? "Ho già un account" : lang === "en" ? "I already have an account" : "Ich habe bereits ein Konto"}
            </Link>
          )}
        </div>
        <p className="text-xs text-gray-400">
          {lang === "fr" ? "Annulable avant la fin des 7 jours." : lang === "it" ? "Puoi annullare prima della fine dei 7 giorni." : lang === "en" ? "Cancel before the 7 days end." : "Vor Ablauf der 7 Tage kündbar. Danach CHF 99/Jahr."}
        </p>
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
    <div className="space-y-3 max-w-xl mx-auto relative" style={{ overflowAnchor: "none" }}>
      {/* Level display — shows current level + XP progress */}
      {profile.xp > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-yellow-50 border-2 border-green-200 rounded-xl p-3 flex items-center gap-3">
          <div className="text-3xl">{level.emoji}</div>
          <div className="flex-1">
            <div className="font-bold text-gray-800 text-sm">{levelTitle}</div>
            <div className="text-xs text-gray-600">
              {nextLevel ? `${profile.xp - level.minXp} / ${nextLevel.minXp - level.minXp} XP` : `${profile.xp} XP`}
            </div>
            {nextLevel && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${Math.round(((profile.xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100)}%`,
                    backgroundColor: level.color,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reward unlock modal — fires after exercise triggers a reward */}
      {unlockedReward && (
        <RewardUnlockedModal reward={unlockedReward} onClose={() => setUnlockedReward(null)} />
      )}

      {/* Confetti for perfect run */}
      <Confetti active={showPerfect} />

      {/* Combo badge */}
      {comboVisible && (
        <div
          className={`absolute top-2 left-1/2 -translate-x-1/2 z-10 text-white font-black px-4 py-1.5 rounded-full ${
            comboCount === 3 ? "bg-orange-500" :
            comboCount === 5 ? "bg-red-500" :
            "bg-purple-600"
          }`}
        >
          {comboCount === 3 && "🔥 3x!"}
          {comboCount === 5 && "🔥 5x!"}
          {comboCount === 8 && "💥 8x!"}
        </div>
      )}

      {/* Perfect overlay */}
      {showPerfect && (
        <div className="fixed inset-0 z-40 bg-green-700/90 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-6xl mb-2">🌟</div>
            <div className="text-3xl font-black">PERFEKT!</div>
            <div className="text-lg mt-1">Alle richtig!</div>
          </div>
        </div>
      )}

      {/* Tier completion toast */}
      {tierToast && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-50 bg-white border-2 border-green-300 rounded-2xl px-5 py-2.5 shadow-xl text-sm font-bold text-green-700 whitespace-nowrap"
          style={{ top: "max(4rem, calc(env(safe-area-inset-top) + 3.5rem))" }}
        >
          {tierToast}
        </div>
      )}

      {/* Mascot reaction overlay */}
      {mascotReaction && (
        <div className="fixed bottom-20 right-3 z-[45] pointer-events-none sm:bottom-6">
          <Image
            src={mascotReaction === 'correct' ? '/cleverli-celebrate.png' : '/cleverli-think.png'}
            alt=""
            width={80}
            height={80}
            className={`drop-shadow-lg ${mascotReaction === 'correct' ? 'animate-[mascotPop_0.35s_ease-out]' : 'animate-[mascotShake_0.4s_ease-in-out]'}`}
          />
        </div>
      )}

      {/* Screen reader live region for answer feedback */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {answered === true && tr("correct")}
        {answered === false && tr("wrongFeedback")}
      </div>

      {/* UJ-15: Thin top progress bar — always visible */}
      {!isReviewMode && tierInfo.isTiered ? (
        /* Segmented 3-tier progress bar */
        <div className="w-full h-2 flex gap-px overflow-hidden rounded-full bg-gray-100">
          {(["easy","medium","hard"] as const).map(tier => {
            const t = tierInfo[tier];
            const pct = t.total > 0 ? (t.done / t.total) * 100 : 0;
            const bg = tier === "easy" ? "linear-gradient(to right,#86efac,#16a34a)"
                     : tier === "medium" ? "linear-gradient(to right,#fcd34d,#d97706)"
                     : "linear-gradient(to right,#fca5a5,#dc2626)";
            const segW = (t.total / topic.exercises.length) * 100;
            return (
              <div key={tier} className="relative h-full bg-gray-100 overflow-hidden"
                style={{ width: `${segW}%` }}>
                <div className="h-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: bg }} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((idx + (answered !== null ? 1 : 0)) / sessionTotal) * 100}%`,
              background: isReviewMode
                ? "linear-gradient(to right, #f59e0b, #d97706)"
                : "linear-gradient(to right, #86efac, #16a34a)",
            }}
          />
        </div>
      )}

      {/* Progress bar + voice toggle — hide while reward animation is showing */}
      {answered === null && (
        <div className="flex items-center gap-2">
          {/* ProgressBar shows session progress, matching the visible exercise count */}
          <div className="flex-1">
            {/* Exercise count label for children (explicit X of Y text) */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-gray-500">
                {progressLabel()}
              </span>
              {streak >= 2 && (
                <span className="text-xs font-bold text-orange-500">🔥 {streak}×</span>
              )}
            </div>
            <ProgressBar current={idx + 1} total={sessionTotal} streak={streak} isReviewMode={isReviewMode} />
          </div>
          {isSupported && (
            <button
              onClick={() => {
                const next = !voiceOn;
                setVoiceOn(next);
                if (!next) stop();
              }}
              title={voiceOn ? tr("cleverliVoiceOff") : tr("cleverliVoiceOn")}
              className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all active:scale-95"
              style={{ borderColor: voiceOn ? "#16a34a" : "#d1d5db", background: voiceOn ? "#f0fdf4" : "#f9fafb" }}
            >
              <span className="text-lg">{voiceOn ? "🔊" : "🔇"}</span>
            </button>
          )}
        </div>
      )}

      {/* Exercise card — stays visible on wrong answer so child can see what they picked */}
      {(answered === null || answered === false) && (
        <div
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-4 min-h-[260px] flex flex-col justify-center"
          key={cardKey}
          style={{ animation: "slideIn 0.25s cubic-bezier(.34,1.56,.64,1)" }}
        >
          {/* Listening tasks play their hidden stimulus in its declared language; other tasks read the visible question. */}
          {isSupported && (
            <button
              onClick={() => speak(
                sourceCurrent.listeningText ?? (subject === "math" || subject === "science" ? current.question : sourceCurrent.question),
                sourceCurrent.listeningText ? (sourceCurrent.listeningLanguage ?? "de") : exerciseSpeechLang,
              )}
              className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-xl py-2.5 px-3 hover:bg-green-100 active:scale-95 transition-all"
              title={current.listeningText ? (lang === "fr" ? "Écouter le texte" : lang === "it" ? "Ascolta il testo" : lang === "en" ? "Play audio text" : "Hörtext abspielen") : tr("readAloudTitle")}
              aria-label={current.listeningText ? (lang === "fr" ? "Écouter le texte" : lang === "it" ? "Ascolta il testo" : lang === "en" ? "Play audio text" : "Hörtext abspielen") : tr("readAloudTitle")}
            >
              <span>{current.listeningText ? (lang === "fr" ? "🎧 Écouter" : lang === "it" ? "🎧 Ascolta" : lang === "en" ? "🎧 Play audio" : "🎧 Hörtext abspielen") : tr("readAloud")}</span>
            </button>
          )}
          {current.type === "multiple-choice" && (
            <MultipleChoice
              question={current.question}
              options={current.options ?? []}
              answer={current.answer}
              onAnswer={handleAnswer}
              optionImages={current.optionImages}
              optionEmojis={current.optionEmojis}
              questionImage={current.image}
            />
          )}
          {current.type === "fill-in-blank" && (
            <FillInBlank
              question={current.question}
              answer={current.answer}
              altAnswers={current.altAnswers}
              sequentialAnswer={current.sequentialAnswer}
              onAnswer={handleAnswer}
              questionImage={current.image}
            />
          )}
          {current.type === "self-review" && (
            <SelfReview
              question={current.question}
              exampleAnswer={current.answer}
              criteria={current.reviewCriteria ?? []}
              onAnswer={handleAnswer}
            />
          )}
          {current.type === "counting" && (
            <CountingGame question={current.question} answer={current.answer} emoji={current.emoji} options={current.options ?? []} onAnswer={handleAnswer} questionImage={current.image} />
          )}
          {current.type === "matching" && (
            <Matching question={current.question} pairs={current.pairs ?? []} onAnswer={handleAnswer} />
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
          <HintSystem hints={current.hints} speechLang={exerciseSpeechLang} onHintUsed={() => {
            const nextHintsUsed = hintsUsed + 1;
            setHintsUsed(nextHintsUsed);
            trackExerciseEvent("hint_used", exerciseTelemetryPayload({ hintsUsed: nextHintsUsed }));
          }} />
          <ExerciseIssueReporter {...reportContext} />
        </div>
      )}

      {/* UJ-6: Wrong answer — encouraging amber feedback below the exercise */}
      {answered === false && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 text-center space-y-3 animate-fadeIn" role="alert" aria-live="assertive">
          <div className="text-4xl">💪</div>
          <p className="text-lg font-bold text-amber-800">{tr("wrongFeedback")}</p>
          {/* Answer shown inline in the exercise component above — no duplicate needed */}
          {current.explanation && (
            <p className="text-gray-500 text-xs">{current.explanation}</p>
          )}
          <button
            onClick={handleContinue}
            className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 active:scale-95 transition-all"
          >
            {tr("understoodContinue")}
          </button>
        </div>
      )}

      {/* Correct answer — keep the celebration animation */}
      {answered === true && (
        <div className="space-y-3">
          <RewardAnimation correct={true} onContinue={handleContinue} />
          <ExerciseIssueReporter {...reportContext} />
        </div>
      )}

      {/* Free limit notice — UJ-8: only show on the last free exercise, not from ex.1 */}
      {/* Hide in first 24h for new users to avoid scaring them away */}
      {isPremium === false && freeExercisesRemaining === 1 && (() => {
        const since = parseInt(localStorage.getItem("cleverli_new_user_since") ?? "0");
        const isNew = Date.now() - since < 24 * 60 * 60 * 1000;
        return !isNew;
      })() && (
        <p className="text-center text-xs text-gray-400">
          {tr("freeNoteBanner").replace("{n}", String(freeExercisesRemaining))}{" "}
          <button type="button" onClick={() => startCheckout("yearly", "free_limit_trial_notice", uid, FREE_TRIAL_CHECKOUT_OPTIONS)} className="text-green-700 underline font-semibold">
            7 Tage Premium testen
          </button>
        </p>
      )}

      <PushPrompt correctCount={correctAnswerCount} />

      {/* Anonymous user trial bridge at the free limit */}
      {isAnonymous && (
        <SignupPromptModal 
          isOpen={showSignupPrompt} 
          exerciseCount={anonExerciseCount}
        />
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
