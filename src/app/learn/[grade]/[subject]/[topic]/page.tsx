import { Metadata } from "next";
import { getTopics } from "@/data/index";
import TopicClient from "./TopicClient";
import TopicBreadcrumb from "./TopicBreadcrumb";
import Link from "next/link";

const BASE = "https://www.cleverli.ch";

interface Props { params: Promise<{ grade: string; subject: string; topic: string }> }

const SUBJECT_NAMES: Record<string, { de: string; fr: string; it: string; en: string }> = {
  math:    { de: "Mathematik", fr: "Mathématiques", it: "Matematica",   en: "Maths" },
  german:  { de: "Deutsch",    fr: "Allemand",       it: "Tedesco",      en: "German" },
  science: { de: "NMG",        fr: "Sciences",       it: "Scienze",      en: "Science" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grade, subject, topic: topicId } = await params;
  const topics = getTopics(parseInt(grade), subject);
  const topic = topics.find(t => t.id === topicId);
  if (!topic) return { title: "Thema nicht gefunden – Cleverli", robots: { index: false } };

  const subjectNames = SUBJECT_NAMES[subject];
  const subjectName = subjectNames?.de ?? subject; // German for primary SEO (Swiss market)
  const title = `${topic.title} — ${subjectName} ${grade}. Klasse`;
  const description = `${topic.exercises.length} interaktive Übungen zu „${topic.title}" für die ${grade}. Klasse. Lehrplan 21 · Cleverli.`;
  return {
    title,
    description,
    openGraph: { title: `${title} | Cleverli`, description },
    alternates: { canonical: `https://www.cleverli.ch/learn/${grade}/${subject}/${topicId}` },
  };
}

export default async function TopicPage({ params }: Props) {
  const { grade, subject, topic: topicId } = await params;
  const topics = getTopics(parseInt(grade), subject);
  const topic = topics.find(t => t.id === topicId);

  if (!topic) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Thema nicht gefunden.</p>
        <Link href="/dashboard" className="text-green-700 underline mt-4 block">Zurück zur Übersicht</Link>
      </div>
    );
  }

  const subjectNames = SUBJECT_NAMES[subject];
  const subjectName = subjectNames?.de ?? subject; // German for primary SEO (Swiss market)

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Cleverli", "item": BASE },
      { "@type": "ListItem", "position": 2, "name": `${subjectName} ${grade}. Klasse`, "item": `${BASE}/learn/${grade}/${subject}` },
      { "@type": "ListItem", "position": 3, "name": topic.title, "item": `${BASE}/learn/${grade}/${subject}/${topicId}` },
    ],
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <TopicBreadcrumb
        grade={parseInt(grade)}
        subject={subject}
        subjectName={subjectName}
        topicTitle={topic.title}
      />
      <div className="flex items-center gap-2">
        <span className="text-3xl">{topic.emoji}</span>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{topic.title}</h1>
      </div>

      {/* SSR content for Google — exercise count + sample questions */}
      <p className="text-sm text-gray-500">
        {topic.exercises.length} interaktive Übungen · {subjectName} {grade}. Klasse · Lehrplan 21 Schweiz
      </p>
      {topic.exercises.slice(0, 3).some(e => e.question) && (
        <ul className="sr-only" aria-hidden="true">
          {topic.exercises.slice(0, 3).map((ex, i) => (
            <li key={i}>{ex.question}</li>
          ))}
        </ul>
      )}

      <TopicClient
        topic={topic}
        grade={parseInt(grade)}
        subject={subject}
        allTopics={topics}
        topicIndex={topics.findIndex(t => t.id === topicId)}
      />
    </div>
  );
}
