"use client";

import { useEffect, useState } from "react";
import { localizeExercise } from "@/lib/exerciseLocalization";
import Link from "next/link";
import type { Exercise, Topic } from "@/types/exercise";
import { useProfileContext } from "@/lib/ProfileContext";
import { useLang } from "@/lib/LangContext";
import { getTopicTitle } from "@/data/topicTitles";
import {
  buildTopicDescription,
  getExerciseTypeLabel,
  getLocalizedExerciseQuestion,
  getLocalizedSubjectName,
  getTopicExerciseTypes,
} from "@/lib/seoContent";
import type { Lang } from "@/lib/i18n";
import { getActiveProfileId } from "@/lib/family";
import { readTopicProgressForChild } from "@/lib/reportingProgress";

interface SampleExerciseCard {
  exercise: Exercise;
  topicId: string;
  topicTitle: string;
}

interface Props {
  topic: Topic;
  grade: number;
  subject: string;
  sampleExerciseCards: SampleExerciseCard[];
  relatedTopics: Topic[];
}

const labels = {
  de: {
    exercisesForTopic: "Übungen zum Thema",
    practise: (topicTitle: string) => `${topicTitle} üben`,
    samples: "Beispielaufgaben",
    moreTopics: (subjectName: string) => `Weitere ${subjectName}-Themen`,
  },
  fr: {
    exercisesForTopic: "Exercices sur le thème",
    practise: (topicTitle: string) => `S'exercer avec ${topicTitle}`,
    samples: "Exemples d'exercices",
    moreTopics: (subjectName: string) => `Autres thèmes de ${subjectName}`,
  },
  it: {
    exercisesForTopic: "Esercizi sull'argomento",
    practise: (topicTitle: string) => `Esercitarsi con ${topicTitle}`,
    samples: "Esempi di esercizi",
    moreTopics: (subjectName: string) => `Altri argomenti di ${subjectName}`,
  },
  en: {
    exercisesForTopic: "Exercises for this topic",
    practise: (topicTitle: string) => `Practise ${topicTitle}`,
    samples: "Sample exercises",
    moreTopics: (subjectName: string) => `More ${subjectName} topics`,
  },
};

function getStoredTopicCompleted(topic: Topic, grade: number, subject: string) {
  const activeChildId = getActiveProfileId();
  return readTopicProgressForChild(grade, subject, topic, activeChildId)?.completed ?? 0;
}

function localizedList<T>(
  exercise: Exercise,
  lang: Lang,
  key: "options" | "pairs" | "dragItems" | "dropZones" | "wordList" | "reviewCriteria"
): T[] {
  const localizedKey = lang === "en"
    ? `${key}EN`
    : lang === "fr"
      ? `${key}FR`
      : lang === "it"
        ? `${key}IT`
        : key;
  const localized = exercise[localizedKey as keyof Exercise];
  const base = exercise[key as keyof Exercise];
  return (Array.isArray(localized) ? localized : Array.isArray(base) ? base : []) as T[];
}

function localizedAnswer(exercise: Exercise, lang: Lang) {
  if (lang === "en") return exercise.answerEN ?? exercise.answer;
  if (lang === "fr") return exercise.answerFR ?? exercise.answer;
  if (lang === "it") return exercise.answerIT ?? exercise.answer;
  return exercise.answer;
}

function displayText(value: string, max = 82) {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trim()}...` : clean;
}

function cleanDisplayText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

const previewTypePriority: Record<string, number> = {
  "number-line": 1,
  memory: 2,
  "drag-drop": 3,
  matching: 4,
  "word-search": 5,
  counting: 6,
  "self-review": 7,
  "multiple-choice": 8,
  "fill-in-blank": 9,
};

function MiniNumberLine({ exercise }: { exercise: Exercise }) {
  const min = exercise.numberMin ?? 0;
  const max = exercise.numberMax ?? 10;
  const parsedAnswer = Number.parseFloat(exercise.answer.replace(",", "."));
  const answer = Number.isFinite(parsedAnswer) ? parsedAnswer : Math.round((min + max) / 2);
  const pct = max === min ? 50 : Math.max(0, Math.min(100, ((answer - min) / (max - min)) * 100));

  return (
    <div className="rounded-xl bg-blue-50 px-3 py-4">
      <div className="relative h-9">
        <div className="absolute left-0 right-0 top-4 h-2 rounded-full bg-blue-100" />
        <div className="absolute top-3 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-blue-600 shadow-sm" style={{ left: `${pct}%` }} />
        <div className="absolute -top-1 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-xs font-black text-blue-700 shadow-sm" style={{ left: `${pct}%` }}>
          {exercise.answer}
        </div>
      </div>
      <div className="mt-1 flex justify-between text-[11px] font-bold text-blue-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function MiniMatching({ exercise, lang }: { exercise: Exercise; lang: Lang }) {
  const pairs = localizedList<{ id: string; label: string; emoji?: string }>(exercise, lang, "pairs").slice(0, 4);
  const visiblePairs = pairs.length >= 4 ? pairs : [
    { id: "a1", label: cleanDisplayText(exercise.answer) },
    { id: "a2", label: cleanDisplayText(getLocalizedExerciseQuestion(exercise, lang)) },
    { id: "b1", label: "passt" },
    { id: "b2", label: "gehört dazu" },
  ];
  const left = visiblePairs.filter((_, index) => index % 2 === 0).slice(0, 2);
  const right = visiblePairs.filter((_, index) => index % 2 === 1).slice(0, 2);

  return (
    <div className="grid grid-cols-2 gap-2">
      {[left, right].map((column, columnIndex) => (
        <div key={columnIndex} className="space-y-2">
          {column.map((item) => (
            <div key={item.id} className="flex min-h-12 items-center justify-center gap-1 rounded-xl border border-green-100 bg-white px-2 py-2 text-center text-[11px] font-bold leading-tight text-gray-700 shadow-sm sm:text-xs">
              {item.emoji && <span className="text-lg leading-none">{item.emoji}</span>}
              <span className="min-w-0 break-words hyphens-auto">{cleanDisplayText(item.label)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function MiniMemory({ exercise, lang }: { exercise: Exercise; lang: Lang }) {
  const pairs = localizedList<{ id: string; label: string; emoji?: string }>(exercise, lang, "pairs").slice(0, 2);
  const fallback = [
    { id: "m1", label: cleanDisplayText(exercise.answer), emoji: exercise.emoji },
    { id: "m2", label: cleanDisplayText(getLocalizedExerciseQuestion(exercise, lang)), emoji: undefined },
  ];
  const cards = (pairs.length ? pairs : fallback).slice(0, 2);

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="min-h-16 rounded-xl bg-green-600 shadow-sm" />
      {cards.map((card) => (
        <div key={card.id} className="flex min-h-16 flex-col items-center justify-center rounded-xl border border-green-100 bg-white p-2 text-center shadow-sm">
          {card.emoji && <span className="text-xl leading-none">{card.emoji}</span>}
          <span className="min-w-0 break-words text-[10px] font-bold leading-tight text-gray-700 sm:text-[11px]">{cleanDisplayText(card.label)}</span>
        </div>
      ))}
      <div className="min-h-16 rounded-xl bg-green-600 shadow-sm" />
    </div>
  );
}

function MiniDragDrop({ exercise, lang }: { exercise: Exercise; lang: Lang }) {
  const items = localizedList<{ id: string; label: string; emoji?: string }>(exercise, lang, "dragItems").slice(0, 3);
  const zones = localizedList<{ id: string; label: string }>(exercise, lang, "dropZones").slice(0, 2);
  const fallbackItems = items.length ? items : [
    { id: "d1", label: cleanDisplayText(exercise.answer), emoji: exercise.emoji },
    { id: "d2", label: cleanDisplayText(getLocalizedExerciseQuestion(exercise, lang)) },
  ];
  const fallbackZones = zones.length ? zones : [
    { id: "z1", label: "1" },
    { id: "z2", label: "2" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {fallbackItems.map((item) => (
          <span key={item.id} className="inline-flex min-h-9 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 shadow-sm">
            {item.emoji && <span>{item.emoji}</span>}
            <span className="break-words">{cleanDisplayText(item.label)}</span>
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {fallbackZones.map((zone) => (
          <div key={zone.id} className="flex min-h-14 items-center justify-center rounded-xl border-2 border-dashed border-amber-200 bg-white px-2 text-center text-[11px] font-black uppercase text-amber-700">
            <span className="break-words">{cleanDisplayText(zone.label)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniWordSearch({ exercise, lang }: { exercise: Exercise; lang: Lang }) {
  const words = localizedList<string>(exercise, lang, "wordList")
    .map((word) => word.replace(/[^A-Za-zÄÖÜäöüÉÈÀÇéèàç]/g, "").toUpperCase())
    .filter(Boolean)
    .slice(0, 3);
  const visibleWords = words.length ? words : [displayText(localizedAnswer(exercise, lang), 8).toUpperCase()];
  const letters = [...visibleWords.join("LERNEN")].filter(Boolean);
  const filler = "CLEVERLI";
  const cells = Array.from({ length: 25 }, (_, index) => letters[index] ?? filler[index % filler.length]);

  return (
    <div className="flex gap-3">
      <div className="grid grid-cols-5 gap-1">
        {cells.map((letter, index) => (
          <span key={`${letter}-${index}`} className="flex h-7 w-7 items-center justify-center rounded-md bg-green-50 text-xs font-black text-green-800">
            {letter}
          </span>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        {visibleWords.map((word) => (
          <span key={word} className="break-all rounded-full border border-green-100 bg-white px-2 py-1 text-[11px] font-bold text-gray-700">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

function MiniChoice({ exercise, lang }: { exercise: Exercise; lang: Lang }) {
  const options = localizedList<string>(exercise, lang, "options").slice(0, 4);
  const visible = options.length ? options : [localizedAnswer(exercise, lang), "Option", "Antwort"];

  return (
    <div className="grid grid-cols-2 gap-2">
      {visible.slice(0, 4).map((option, index) => (
        <div key={`${option}-${index}`} className="flex min-h-12 items-center justify-center rounded-xl border border-gray-100 bg-white px-2 py-2 text-center text-[11px] font-bold leading-tight text-gray-700 shadow-sm sm:text-xs">
          <span className="min-w-0 break-words hyphens-auto">{cleanDisplayText(option)}</span>
        </div>
      ))}
    </div>
  );
}

function MiniFillBlank({ exercise, lang }: { exercise: Exercise; lang: Lang }) {
  const question = getLocalizedExerciseQuestion(exercise, lang).replaceAll("___", "____");
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      {!getLocalizedExerciseQuestion(exercise, lang).includes("___") && (
        <p className="break-words text-sm font-semibold leading-6 text-gray-700">{cleanDisplayText(question)}</p>
      )}
      <div className="mt-3 h-10 rounded-xl border-2 border-dashed border-green-200 bg-green-50" />
    </div>
  );
}

function MiniCounting({ exercise, lang }: { exercise: Exercise; lang: Lang }) {
  const answer = Number.parseInt(localizedAnswer(exercise, lang), 10);
  const count = Number.isFinite(answer) ? Math.max(1, Math.min(answer, 10)) : 5;
  const emoji = exercise.emoji ?? "🍎";
  return (
    <div className="rounded-xl bg-green-50 p-3">
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: count }, (_, index) => (
          <span key={index} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl shadow-sm">
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}

function MiniSelfReview({ exercise, lang }: { exercise: Exercise; lang: Lang }) {
  const criteria = localizedList<string>(exercise, lang, "reviewCriteria").slice(0, 3);
  const visible = criteria.length ? criteria : [localizedAnswer(exercise, lang)];
  return (
    <div className="space-y-2 rounded-xl bg-emerald-50 p-3">
      {visible.map((criterion, index) => (
        <div key={`${criterion}-${index}`} className="flex items-start gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm">
          <span className="mt-0.5 h-4 w-4 rounded-full border-2 border-emerald-300" />
          <span className="break-words">{cleanDisplayText(criterion)}</span>
        </div>
      ))}
    </div>
  );
}

function VisualExercisePreview({ exercise, lang }: { exercise: Exercise; lang: Lang }) {
  if (exercise.type === "number-line") return <MiniNumberLine exercise={exercise} />;
  if (exercise.type === "matching") return <MiniMatching exercise={exercise} lang={lang} />;
  if (exercise.type === "memory") return <MiniMemory exercise={exercise} lang={lang} />;
  if (exercise.type === "drag-drop") return <MiniDragDrop exercise={exercise} lang={lang} />;
  if (exercise.type === "word-search") return <MiniWordSearch exercise={exercise} lang={lang} />;
  if (exercise.type === "self-review") return <MiniSelfReview exercise={exercise} lang={lang} />;
  if (exercise.type === "counting") return <MiniCounting exercise={exercise} lang={lang} />;
  if (exercise.type === "fill-in-blank") return <MiniFillBlank exercise={exercise} lang={lang} />;
  return <MiniChoice exercise={exercise} lang={lang} />;
}

export default function TopicSeoSections({ topic, grade, subject, sampleExerciseCards, relatedTopics }: Props) {
  const { lang } = useLang();
  const { profile, loaded } = useProfileContext();
  const [showSeoSections, setShowSeoSections] = useState(false);
  const copy = labels[lang];
  const topicTitle = getTopicTitle(topic.id, lang, topic.title);
  const subjectName = getLocalizedSubjectName(subject, lang);
  const topicDescription = buildTopicDescription(topic, grade, subject, lang, topicTitle);
  const exerciseTypes = getTopicExerciseTypes(topic, lang);
  const visibleSampleExerciseCards = [...sampleExerciseCards]
    .map(card => grade === 1 && subject === "german" && lang === "de"
      ? { ...card, exercise: localizeExercise(card.exercise, "de") }
      : card)
    .sort((a, b) => (previewTypePriority[a.exercise.type] ?? 20) - (previewTypePriority[b.exercise.type] ?? 20))
    .slice(0, 4);

  useEffect(() => {
    if (!loaded) return;

    const topicCompleted = getStoredTopicCompleted(topic, grade, subject);
    const anonymousCompleted = parseInt(localStorage.getItem("cleverli_anon_exercises") ?? "0", 10) || 0;
    const totalCompleted = Math.max(profile.totalExercises, anonymousCompleted, topicCompleted);

    setShowSeoSections(totalCompleted < 3);
  }, [grade, loaded, profile.totalExercises, subject, topic]);

  if (!showSeoSections) return null;

  return (
    <>
      <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-green-700">{copy.exercisesForTopic}</p>
        <h2 className="mt-2 text-lg font-black text-gray-900">{copy.practise(topicTitle)}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">{topicDescription}</p>
        {exerciseTypes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {exerciseTypes.map((type) => (
              <span key={type} className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-600">
                {type}
              </span>
            ))}
          </div>
        )}
        {sampleExerciseCards.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-black text-gray-900">{copy.samples}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {visibleSampleExerciseCards.map(({ exercise, topicId, topicTitle: fallbackTitle }, index) => {
                const sampleTopicTitle = getTopicTitle(topicId, lang, fallbackTitle);
                const shouldSpan = visibleSampleExerciseCards.length === 3 && index === 2;
                return (
                  <article key={`${topicId}-${exercise.id}`} className={`rounded-2xl border border-gray-100 bg-gray-50 p-3 shadow-sm ${shouldSpan ? "sm:col-span-2" : ""}`}>
                    <span className="mb-1 block text-[11px] font-black uppercase tracking-widest text-green-700">
                      {sampleTopicTitle} · {getExerciseTypeLabel(exercise.type, lang)}
                    </span>
                    <p className="mb-3 break-words text-sm font-semibold leading-6 text-gray-800">
                      {cleanDisplayText(getLocalizedExerciseQuestion(exercise, lang))}
                    </p>
                    <VisualExercisePreview exercise={exercise} lang={lang} />
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {relatedTopics.length > 0 && (
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-gray-900">{copy.moreTopics(subjectName)}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedTopics.map((related) => (
              <Link
                key={related.id}
                href={`/learn/${grade}/${subject}/${related.id}`}
                prefetch={false}
                className="rounded-full border border-green-100 bg-green-50 px-3 py-2 text-sm font-bold text-green-800 hover:bg-green-100"
              >
                {getTopicTitle(related.id, lang, related.title)}
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
