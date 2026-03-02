import { Metadata } from "next";
import { getTopics } from "@/data/index";
import TopicClient from "./TopicClient";
import Link from "next/link";

interface Props { params: Promise<{ grade: string; subject: string; topic: string }> }

const SUBJECT_NAMES: Record<string, string> = {
  math: "Mathematik", german: "Deutsch", science: "NMG",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grade, subject, topic: topicId } = await params;
  const topics = getTopics(parseInt(grade), subject);
  const topic = topics.find(t => t.id === topicId);
  if (!topic) return { title: "Thema nicht gefunden" };

  const subjectName = SUBJECT_NAMES[subject] ?? subject;
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
        <Link href="/dashboard" className="text-green-600 underline mt-4 block">Zurück zur Übersicht</Link>
      </div>
    );
  }

  const subjectName = SUBJECT_NAMES[subject] ?? subject;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
        <Link href="/dashboard" className="hover:text-green-600 transition-colors">Dashboard</Link>
        <span>›</span>
        <Link href={`/learn/${grade}/${subject}`} className="hover:text-green-600 transition-colors">
          {grade}. Klasse · {subjectName}
        </Link>
        <span>›</span>
        <span className="text-green-700 font-semibold">{topic.title}</span>
      </nav>
      <div className="flex items-center gap-2">
        <span className="text-3xl">{topic.emoji}</span>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{topic.title}</h1>
      </div>
      {/* TopicClient reads session from localStorage to determine isPremium */}
      <TopicClient topic={topic} grade={parseInt(grade)} subject={subject} />
    </div>
  );
}
