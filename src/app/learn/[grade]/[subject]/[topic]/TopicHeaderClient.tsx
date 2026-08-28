"use client";

import Link from "next/link";
import type { Topic } from "@/types/exercise";
import { useLang } from "@/lib/LangContext";
import { getTopicTitle } from "@/data/topicTitles";
import {
  buildTopicLearningAnswer,
  getLocalizedGradeName,
  getLocalizedSubjectName,
  getLocalizedSubjectShortName,
} from "@/lib/seoContent";
import TopicBreadcrumb from "./TopicBreadcrumb";

interface Props {
  topic: Topic;
  grade: number;
  subject: string;
  gradeSeoHref: string;
}

const labels = {
  de: {
    explained: "Kurz erklärt",
    question: (topicTitle: string) => `Was lernt mein Kind bei ${topicTitle}?`,
    allTopics: "Alle Themen dieser Klasse",
    exerciseCount: "interaktive Übungen",
    curriculum: "Lehrplan 21 Schweiz",
  },
  fr: {
    explained: "En bref",
    question: (topicTitle: string) => `Qu'apprend mon enfant avec ${topicTitle}?`,
    allTopics: "Tous les thèmes de cette année",
    exerciseCount: "exercices interactifs",
    curriculum: "Programme suisse",
  },
  it: {
    explained: "In breve",
    question: (topicTitle: string) => `Cosa impara mio figlio con ${topicTitle}?`,
    allTopics: "Tutti gli argomenti di questa classe",
    exerciseCount: "esercizi interattivi",
    curriculum: "Programma svizzero",
  },
  en: {
    explained: "Quick overview",
    question: (topicTitle: string) => `What will my child learn in ${topicTitle}?`,
    allTopics: "All topics in this grade",
    exerciseCount: "interactive exercises",
    curriculum: "Swiss LP21 curriculum",
  },
};

export function TopicExplainerClient({ topic, grade, subject, gradeSeoHref }: Props) {
  const { lang } = useLang();
  const copy = labels[lang];
  const topicTitle = getTopicTitle(topic.id, lang, topic.title);
  const subjectShortName = getLocalizedSubjectShortName(subject, lang);
  const gradeName = getLocalizedGradeName(grade, lang);
  const topicLearningAnswer = buildTopicLearningAnswer(topic, grade, subject, lang, topicTitle);

  return (
    <section className="rounded-2xl border border-green-100 bg-green-50 p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-green-700">{copy.explained}</p>
      <h2 className="mt-2 text-lg font-black text-gray-900">{copy.question(topicTitle)}</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">{topicLearningAnswer}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={gradeSeoHref}
          className="rounded-full border border-green-200 bg-white px-3 py-2 text-sm font-bold text-green-800 hover:bg-green-100"
        >
          {subjectShortName} {gradeName}
        </Link>
        <Link
          href={`/learn/${grade}/${subject}`}
          className="rounded-full border border-green-200 bg-white px-3 py-2 text-sm font-bold text-green-800 hover:bg-green-100"
        >
          {copy.allTopics}
        </Link>
      </div>
    </section>
  );
}

export default function TopicHeaderClient({ topic, grade, subject, gradeSeoHref }: Props) {
  const { lang } = useLang();
  const copy = labels[lang];
  const topicTitle = getTopicTitle(topic.id, lang, topic.title);
  const subjectName = getLocalizedSubjectName(subject, lang);
  const gradeName = getLocalizedGradeName(grade, lang);

  return (
    <>
      <TopicBreadcrumb
        grade={grade}
        subject={subject}
        subjectName={subjectName}
        topicTitle={topicTitle}
      />
      <div className="flex items-center gap-2">
        <span className="text-3xl">{topic.emoji}</span>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{topicTitle}</h1>
      </div>

      <p className="text-sm text-gray-500">
        {topic.exercises.length} {copy.exerciseCount} · {subjectName} {gradeName} · {copy.curriculum}
      </p>

      <div className="hidden sm:block">
        <TopicExplainerClient topic={topic} grade={grade} subject={subject} gradeSeoHref={gradeSeoHref} />
      </div>
    </>
  );
}
