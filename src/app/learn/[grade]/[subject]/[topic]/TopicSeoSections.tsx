"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Exercise, Topic } from "@/types/exercise";
import { getProgressSubjects } from "@/data";
import { useProfileContext } from "@/lib/ProfileContext";
import { useLang } from "@/lib/LangContext";
import { getEffectiveCompleted } from "@/lib/topicProgress";
import { getTopicTitle } from "@/data/topicTitles";
import {
  buildTopicDescription,
  getExerciseTypeLabel,
  getLocalizedExerciseQuestion,
  getLocalizedSubjectName,
  getTopicExerciseTypes,
} from "@/lib/seoContent";

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
  for (const progressSubject of getProgressSubjects(grade, subject, topic.id)) {
    const raw = localStorage.getItem(`cleverli_${grade}_${progressSubject}_${topic.id}`);
    if (!raw) continue;
    try {
      return getEffectiveCompleted(JSON.parse(raw), topic.exercises.length);
    } catch {
      return 0;
    }
  }
  return 0;
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
            <ul className="mt-3 space-y-2">
              {sampleExerciseCards.map(({ exercise, topicId, topicTitle: fallbackTitle }) => {
                const sampleTopicTitle = getTopicTitle(topicId, lang, fallbackTitle);
                return (
                  <li key={`${topicId}-${exercise.id}`} className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm leading-6 text-gray-700">
                    <span className="mb-1 block text-[11px] font-black uppercase tracking-widest text-green-700">
                      {sampleTopicTitle} · {getExerciseTypeLabel(exercise.type, lang)}
                    </span>
                    {getLocalizedExerciseQuestion(exercise, lang)}
                  </li>
                );
              })}
            </ul>
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
