import { Metadata } from "next";
import { getTopics } from "@/data/index";
import TopicClient from "./TopicClient";
import TopicBreadcrumb from "./TopicBreadcrumb";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { buildTopicDescription, buildTopicLearningAnswer, getRelatedTopics, getSampleExercises, getSubjectSeo, getTopicExerciseTypes } from "@/lib/seoContent";

const BASE = "https://www.cleverli.ch";

interface Props { params: Promise<{ grade: string; subject: string; topic: string }> }

const SUBJECT_NAMES: Record<string, { de: string; fr: string; it: string; en: string }> = {
  math:    { de: "Mathematik", fr: "Mathématiques", it: "Matematica",   en: "Maths" },
  german:  { de: "Deutsch",    fr: "Allemand",       it: "Tedesco",      en: "German" },
  science: { de: "NMG",        fr: "Sciences",       it: "Scienze",      en: "Science" },
  nt:      { de: "NMG",        fr: "Sciences",       it: "Scienze",      en: "Science" },
  rzg:     { de: "NMG",        fr: "Sciences",       it: "Scienze",      en: "Science" },
  english: { de: "Englisch",   fr: "Anglais",        it: "Inglese",      en: "English" },
  french:  { de: "Französisch", fr: "Français",      it: "Francese",     en: "French" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grade, subject, topic: topicId } = await params;
  const topics = getTopics(parseInt(grade), subject);
  const topic = topics.find(t => t.id === topicId);
  if (!topic) return { title: "Thema nicht gefunden – Cleverli", robots: { index: false } };

  const subjectNames = SUBJECT_NAMES[subject];
  const subjectName = subjectNames?.de ?? subject; // German for primary SEO (Swiss market)
  const title = `${topic.title} — ${subjectName} ${grade}. Klasse`;
  const description = buildTopicDescription(topic, grade, subject);
  return {
    title,
    description,
    openGraph: {
      title: `${title} | Cleverli`,
      description,
      images: [{ url: `${BASE}/og-image-v2.png`, width: 1200, height: 630, alt: "Cleverli — Lernplattform für Kinder" }],
    },
    alternates: { canonical: `https://www.cleverli.ch/learn/${grade}/${subject}/${topicId}` },
  };
}

export default async function TopicPage({ params }: Props) {
  const { grade, subject, topic: topicId } = await params;
  if (parseInt(grade) <= 6 && (subject === "nt" || subject === "rzg")) {
    permanentRedirect(`/learn/${grade}/science/${topicId}`);
  }
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
  const subjectSeo = getSubjectSeo(subject);
  const topicDescription = buildTopicDescription(topic, grade, subject);
  const topicLearningAnswer = buildTopicLearningAnswer(topic, grade, subject);
  const sampleExercises = getSampleExercises(topic, 4);
  const exerciseTypes = getTopicExerciseTypes(topic);
  const relatedTopics = getRelatedTopics(topics, topicId, 4);
  const gradeSeoHref = subject === "math" || subject === "german"
    ? `/${subject === "math" ? "mathe" : "deutsch"}-uebungen-${grade}-klasse`
    : `/learn/${grade}/${subject}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Cleverli", "item": BASE },
      { "@type": "ListItem", "position": 2, "name": `${subjectName} ${grade}. Klasse`, "item": `${BASE}/learn/${grade}/${subject}` },
      { "@type": "ListItem", "position": 3, "name": topic.title, "item": `${BASE}/learn/${grade}/${subject}/${topicId}` },
    ],
  };
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": `${topic.title} Übungen`,
    "description": topicDescription,
    "learningResourceType": "Practice problem",
    "educationalLevel": `${grade}. Klasse`,
    "inLanguage": "de-CH",
    "teaches": [topic.title, subjectName, ...subjectSeo.keywords.slice(0, 3)],
    "provider": {
      "@type": "Organization",
      "name": "Cleverli",
      "url": BASE,
    },
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
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

      <section className="rounded-2xl border border-green-100 bg-green-50 p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-green-700">Kurz erklärt</p>
        <h2 className="mt-2 text-lg font-black text-gray-900">Was lernt mein Kind bei {topic.title}?</h2>
        <p className="mt-2 text-sm leading-6 text-gray-700">{topicLearningAnswer}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={gradeSeoHref}
            className="rounded-full border border-green-200 bg-white px-3 py-2 text-sm font-bold text-green-800 hover:bg-green-100"
          >
            {subjectName} {grade}. Klasse
          </Link>
          <Link
            href={`/learn/${grade}/${subject}`}
            className="rounded-full border border-green-200 bg-white px-3 py-2 text-sm font-bold text-green-800 hover:bg-green-100"
          >
            Alle Themen dieser Klasse
          </Link>
        </div>
      </section>

      <TopicClient
        topic={topic}
        grade={parseInt(grade)}
        subject={subject}
        allTopics={topics}
        topicIndex={topics.findIndex(t => t.id === topicId)}
      />

      <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-green-700">Übungen zum Thema</p>
        <h2 className="mt-2 text-lg font-black text-gray-900">{topic.title} üben</h2>
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
        {sampleExercises.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-black text-gray-900">Beispielaufgaben</h3>
            <ul className="mt-3 space-y-2">
              {sampleExercises.map((exercise) => (
                <li key={exercise.id} className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm leading-6 text-gray-700">
                  {exercise.question}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {relatedTopics.length > 0 && (
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-gray-900">Weitere {subjectName}-Themen</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedTopics.map((related) => (
              <Link
                key={related.id}
                href={`/learn/${grade}/${subject}/${related.id}`}
                className="rounded-full border border-green-100 bg-green-50 px-3 py-2 text-sm font-bold text-green-800 hover:bg-green-100"
              >
                {related.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
