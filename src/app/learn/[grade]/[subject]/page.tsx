import { Metadata } from "next";
import { getTopicsForSubject } from "@/data";
import SubjectPageClient from "./SubjectPageClient";

interface Props { params: Promise<{ grade: string; subject: string }> }

const SUBJECT_NAMES: Record<string, string> = {
  math: "Mathematik", german: "Deutsch", science: "NMG",
};
const SUBJECT_KEYWORDS: Record<string, string> = {
  math: "Mathe, Zahlen, Rechnen, Addition, Subtraktion, Geometrie",
  german: "Deutsch, Lesen, Schreiben, Rechtschreibung, Wörter",
  science: "NMG, Natur, Mensch, Gesellschaft, Tiere, Pflanzen, Schweiz",
};
const SUBJECT_SUBTITLES: Record<string, string> = {
  science: "Natur, Mensch, Gesellschaft",
};
const GRADE_NAMES: Record<string, string> = {
  "1": "1. Klasse", "2": "2. Klasse", "3": "3. Klasse",
  "4": "4. Klasse", "5": "5. Klasse", "6": "6. Klasse",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grade, subject } = await params;
  const subjectName = SUBJECT_NAMES[subject] ?? subject;
  const gradeName = GRADE_NAMES[grade] ?? `${grade}. Klasse`;
  const title = `${subjectName} ${gradeName}`;
  const keywords = SUBJECT_KEYWORDS[subject] ?? subjectName;
  const description = `Kostenlose ${subjectName}-Übungen für die ${gradeName} (Lehrplan 21 Schweiz). ${keywords}. Jetzt gratis auf Cleverli üben!`;
  return {
    title,
    description,
    keywords: [subjectName, gradeName, "Lehrplan 21", "Schweiz", "Cleverli", "Übungen kostenlos"],
    openGraph: { title: `${title} | Cleverli`, description },
    alternates: { canonical: `https://www.cleverli.ch/learn/${grade}/${subject}` },
  };
}

export default async function SubjectPage({ params }: Props) {
  const { grade, subject } = await params;
  const topics = getTopicsForSubject(parseInt(grade), subject);
  return <SubjectPageClient grade={parseInt(grade)} subject={subject} topics={topics} />;
}
