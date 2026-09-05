import { Metadata } from "next";
import { GRADES, getSubjects, getTopics, getTopicsForSubject } from "@/data/index";
import TopicClient from "./TopicClient";
import TopicHeaderClient, { TopicExplainerClient } from "./TopicHeaderClient";
import TopicSeoSections from "./TopicSeoSections";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { buildTopicDescription, getRelatedTopics, getSampleExercises, getSubjectSeo } from "@/lib/seoContent";
import type { Exercise } from "@/types/exercise";

const BASE = "https://www.cleverli.ch";

interface Props {
  params: Promise<{ grade: string; subject: string; topic: string }>;
  searchParams?: Promise<{ exercise?: string }>;
}

export function generateStaticParams() {
  return GRADES.flatMap((grade) =>
    getSubjects(grade).flatMap(({ id: subject }) =>
      getTopics(grade, subject).map(({ id: topic }) => ({
        grade: String(grade),
        subject,
        topic,
      }))
    )
  );
}

const SUBJECT_NAMES: Record<string, { de: string; fr: string; it: string; en: string }> = {
  math:    { de: "Mathematik", fr: "Mathématiques", it: "Matematica",   en: "Maths" },
  german:  { de: "Deutsch",    fr: "Allemand",       it: "Tedesco",      en: "German" },
  science: { de: "NMG",        fr: "Sciences",       it: "Scienze",      en: "Science" },
  nt:      { de: "NMG",        fr: "Sciences",       it: "Scienze",      en: "Science" },
  rzg:     { de: "NMG",        fr: "Sciences",       it: "Scienze",      en: "Science" },
  english: { de: "Englisch",   fr: "Anglais",        it: "Inglese",      en: "English" },
  french:  { de: "Französisch", fr: "Français",      it: "Francese",     en: "French" },
  mi:      { de: "Medien & Informatik", fr: "Médias & informatique", it: "Media & informatica", en: "Media & Computing" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grade, subject, topic: topicId } = await params;
  const isInternalPrimaryFrenchRollout = subject === "french"
    && [3, 4].includes(parseInt(grade))
    && process.env.NEXT_PUBLIC_CURRICULUM_PROFILES_ROLLOUT_MODE !== "all";
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
      images: [{ url: `${BASE}/og-cleverli-primarschule-2026.png`, width: 1200, height: 630, alt: "Cleverli – Die Lernplattform für die Primarschule" }],
    },
    alternates: { canonical: `https://www.cleverli.ch/learn/${grade}/${subject}/${topicId}` },
    robots: isInternalPrimaryFrenchRollout ? { index: false, follow: false } : undefined,
  };
}

export default async function TopicPage({ params, searchParams }: Props) {
  const { grade, subject, topic: topicId } = await params;
  const query = await searchParams;
  if (subject === "french" && [3, 4].includes(parseInt(grade)) && process.env.NEXT_PUBLIC_CURRICULUM_PROFILES_ENABLED !== "true") {
    notFound();
  }
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

  const topicIndex = topics.findIndex(t => t.id === topicId);
  const subjectNames = SUBJECT_NAMES[subject];
  const subjectName = subjectNames?.de ?? subject; // German for primary SEO (Swiss market)
  const subjectSeo = getSubjectSeo(subject);
  const topicDescription = buildTopicDescription(topic, grade, subject);
  const sampleExercises = getSampleExercises(topic, 4);
  const sampleExerciseCards: { exercise: Exercise; topicId: string; topicTitle: string }[] = [];
  const usedSampleTypes = new Set(sampleExerciseCards.map(({ exercise }) => exercise.type));
  const usedSampleIds = new Set(sampleExerciseCards.map(({ exercise, topicId }) => `${topicId}:${exercise.id}`));
  for (const exercise of sampleExercises) {
    const sampleKey = `${topic.id}:${exercise.id}`;
    if (usedSampleTypes.has(exercise.type) || usedSampleIds.has(sampleKey)) continue;
    sampleExerciseCards.push({ exercise, topicId: topic.id, topicTitle: topic.title });
    usedSampleTypes.add(exercise.type);
    usedSampleIds.add(sampleKey);
  }
  const currentGrade = parseInt(grade);
  const subjectGradeOrder = [currentGrade, ...[1, 2, 3, 4, 5, 6].filter((subjectGrade) => subjectGrade !== currentGrade)];
  const subjectTopics = subjectGradeOrder
    .flatMap((subjectGrade) => getTopicsForSubject(subjectGrade, subject))
    .filter((subjectTopic) => subjectTopic.id !== topic.id);

  for (const subjectTopic of subjectTopics) {
    for (const exercise of getSampleExercises(subjectTopic, 4)) {
      if (sampleExerciseCards.length >= 4) break;
      const sampleKey = `${subjectTopic.id}:${exercise.id}`;
      if (usedSampleIds.has(sampleKey) || usedSampleTypes.has(exercise.type)) continue;
      sampleExerciseCards.push({ exercise, topicId: subjectTopic.id, topicTitle: subjectTopic.title });
      usedSampleIds.add(sampleKey);
      usedSampleTypes.add(exercise.type);
    }
    if (sampleExerciseCards.length >= 4) break;
  }

  for (const subjectTopic of subjectTopics) {
    for (const exercise of getSampleExercises(subjectTopic, 4)) {
      if (sampleExerciseCards.length >= 4) break;
      const sampleKey = `${subjectTopic.id}:${exercise.id}`;
      if (usedSampleIds.has(sampleKey)) continue;
      sampleExerciseCards.push({ exercise, topicId: subjectTopic.id, topicTitle: subjectTopic.title });
      usedSampleIds.add(sampleKey);
    }
    if (sampleExerciseCards.length >= 4) break;
  }
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
      <TopicHeaderClient
        topic={topic}
        grade={parseInt(grade)}
        subject={subject}
        gradeSeoHref={gradeSeoHref}
      />

      <TopicClient
        topic={topic}
        grade={parseInt(grade)}
        subject={subject}
        nextTopicId={topics[topicIndex + 1]?.id ?? null}
        focusExerciseId={query?.exercise ?? null}
      />

      <div className="sm:hidden">
        <TopicExplainerClient
          topic={topic}
          grade={parseInt(grade)}
          subject={subject}
          gradeSeoHref={gradeSeoHref}
        />
      </div>

      <TopicSeoSections
        topic={topic}
        grade={parseInt(grade)}
        subject={subject}
        sampleExerciseCards={sampleExerciseCards}
        relatedTopics={relatedTopics}
      />
    </div>
  );
}
