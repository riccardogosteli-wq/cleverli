import { Metadata } from "next";
import { getTopicsForSubject } from "@/data";
import SubjectPageClient from "./SubjectPageClient";

interface Props { params: Promise<{ grade: string; subject: string }> }

const SUBJECT_NAMES: Record<string, string> = {
  math: "Mathematik", german: "Deutsch", science: "Sachkunde",
};
const GRADE_NAMES: Record<string, string> = {
  "1": "1. Klasse", "2": "2. Klasse", "3": "3. Klasse",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grade, subject } = await params;
  const subjectName = SUBJECT_NAMES[subject] ?? subject;
  const gradeName = GRADE_NAMES[grade] ?? `${grade}. Klasse`;
  const title = `${subjectName} ${gradeName}`;
  const description = `Interaktive ${subjectName}-Übungen für die ${gradeName} — abgestimmt auf den Lehrplan 21. Kostenlos testen auf Cleverli.`;
  return {
    title,
    description,
    openGraph: { title: `${title} | Cleverli`, description },
    alternates: { canonical: `https://www.cleverli.ch/learn/${grade}/${subject}` },
  };
}

export default async function SubjectPage({ params }: Props) {
  const { grade, subject } = await params;
  const topics = getTopicsForSubject(parseInt(grade), subject);
  return <SubjectPageClient grade={parseInt(grade)} subject={subject} topics={topics} />;
}
