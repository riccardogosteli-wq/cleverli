import Link from "next/link";
import { getTopics } from "@/data/index";

interface Props { params: Promise<{ grade: string; subject: string }> }

export default async function SubjectPage({ params }: Props) {
  const { grade, subject } = await params;
  const topics = getTopics(parseInt(grade), subject);
  const subjectName = subject === "math" ? "Mathematik" : "Deutsch";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← Zurück</Link>
      <h1 className="text-2xl font-bold text-gray-800">{grade}. Klasse — {subjectName}</h1>
      <div className="space-y-3">
        {topics.map(topic => (
          <Link key={topic.id} href={`/learn/${grade}/${subject}/${topic.id}`}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <span className="text-3xl">{topic.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{topic.title}</p>
              <p className="text-sm text-gray-400">{topic.exercises.length} Aufgaben · Erste 3 kostenlos</p>
            </div>
            <span className="text-green-600 text-sm font-medium">Start →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
