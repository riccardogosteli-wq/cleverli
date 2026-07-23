import { Metadata } from "next";
import { getTopicsForSubject } from "@/data";
import SubjectPageClient from "./SubjectPageClient";
import { permanentRedirect } from "next/navigation";

interface Props { params: Promise<{ grade: string; subject: string }> }

const SUBJECT_NAMES: Record<string, string> = {
  math: "Mathematik", german: "Deutsch", science: "NMG", nt: "NMG", rzg: "NMG",
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
    openGraph: {
      title: `${title} | Cleverli`,
      description,
      images: [{ url: `https://www.cleverli.ch/og-image.png`, width: 1200, height: 630, alt: `${title} — Cleverli` }],
    },
    alternates: { canonical: `https://www.cleverli.ch/learn/${grade}/${subject}` },
  };
}

const BASE = "https://www.cleverli.ch";

export default async function SubjectPage({ params }: Props) {
  const { grade, subject } = await params;
  if (parseInt(grade) <= 6 && (subject === "nt" || subject === "rzg")) {
    permanentRedirect(`/learn/${grade}/science`);
  }
  const topics = getTopicsForSubject(parseInt(grade), subject);
  const subjectName = SUBJECT_NAMES[subject] ?? subject;
  const gradeName = GRADE_NAMES[grade] ?? `${grade}. Klasse`;
  const title = `${subjectName} ${gradeName}`;

  // ItemList structured data for SEO rich snippets
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${title} — Cleverli`,
    "description": `Kostenlose ${subjectName}-Übungen für die ${gradeName}, Lehrplan 21 Schweiz`,
    "url": `${BASE}/learn/${grade}/${subject}`,
    "numberOfItems": topics.length,
    "itemListElement": topics.map((topic, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": topic.title,
      "url": `${BASE}/learn/${grade}/${subject}/${topic.id}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      {/* Static H1 for SEO — visible to Googlebot without JS */}
      <h1 className="sr-only">{title} — Kostenlose Übungen · Lehrplan 21 Schweiz · Cleverli</h1>
      <SubjectPageClient grade={parseInt(grade)} subject={subject} topics={topics} />
    </>
  );
}
