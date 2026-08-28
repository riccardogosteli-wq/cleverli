import { TOPIC_CATALOG } from "./topicCatalog.generated";

export interface TopicSummary {
  id: string;
  title: string;
  emoji: string;
  exerciseCount: number;
  tierCounts: readonly [number, number, number];
}

export const CORE_SUBJECTS = [
  { id: "math", emoji: "🔢", color: "bg-blue-50 border-blue-300 text-blue-700" },
  { id: "german", emoji: "📖", color: "bg-yellow-50 border-yellow-300 text-yellow-700" },
  { id: "science", emoji: "🌍", color: "bg-green-50 border-green-300 text-green-800" },
] as const;

export function getTopicSummaries(grade: number, subject: string): TopicSummary[] {
  const key = `${grade}-${subject}` as keyof typeof TOPIC_CATALOG;
  return (TOPIC_CATALOG[key] ?? []) as unknown as TopicSummary[];
}

export function getProgressSubjectsFromCatalog(grade: number, subject: string, topicId: string): string[] {
  if (subject !== "science" || grade < 4) return [subject];

  const legacySubjects: string[] = [];
  if (getTopicSummaries(grade, "nt").some((topic) => topic.id === topicId)) legacySubjects.push("nt");
  if (getTopicSummaries(grade, "rzg").some((topic) => topic.id === topicId)) legacySubjects.push("rzg");
  return [...new Set([subject, ...legacySubjects])];
}

export function getCatalogSubjects(grade: number) {
  if (grade <= 2) return [...CORE_SUBJECTS];
  if (grade <= 4) {
    return [
      ...CORE_SUBJECTS,
      { id: "english", emoji: "🇬🇧", color: "bg-red-50 border-red-300 text-red-700" },
    ];
  }
  return [
    ...CORE_SUBJECTS,
    { id: "french", emoji: "🇫🇷", color: "bg-purple-50 border-purple-300 text-purple-700" },
    { id: "english", emoji: "🇬🇧", color: "bg-red-50 border-red-300 text-red-700" },
  ];
}
