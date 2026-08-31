import { Metadata } from "next";
import { getTopicSummaries } from "@/data/topicCatalog";
import SubjectPageClient from "./SubjectPageClient";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { getGradeName, getSubjectSeo } from "@/lib/seoContent";
import { getGradeSubjectSeoLinks } from "@/lib/gradeSubjectSeo";

interface Props { params: Promise<{ grade: string; subject: string }> }

const SUBJECT_NAMES: Record<string, string> = {
  math: "Mathematik", german: "Deutsch", science: "NMG", nt: "NMG", rzg: "NMG", english: "Englisch", french: "Französisch",
};

type ContextualSeoLink = {
  href: string;
  title: string;
  description: string;
};

function subjectPageTitle(grade: string, subject: string, shortSubjectName: string) {
  if (grade === "5" && subject === "french") return "Französisch Übungen 5. Klasse – Schweiz";
  return `${shortSubjectName} Übungen ${getGradeName(grade)}`;
}

function getContextualSeoLinks(grade: number, subject: string): ContextualSeoLink[] {
  const links: ContextualSeoLink[] = [];
  const gradePage = getGradeSubjectSeoLinks().find((page) => page.grade === grade && page.subject === subject);

  if (gradePage) {
    links.push({
      href: gradePage.href,
      title: gradePage.h1,
      description: `Übungen, Erklärungen und Beispiele passend zur ${grade}. Klasse.`,
    });
  }

  if (subject === "math") {
    links.push({
      href: "/mathe-uebungen-kinder",
      title: "Mathe-Übungen für Kinder",
      description: "Rechnen, Geometrie und Sachaufgaben für die Schweizer Primarschule.",
    });
    if (grade === 2 || grade === 3) {
      links.push({
        href: "/1x1-spiele",
        title: "1x1-Spiele online",
        description: "Das Einmaleins mit kurzen Spielrunden und direkter Rückmeldung festigen.",
      });
    }
  }

  if (subject === "german") {
    links.push({
      href: "/deutsch-uebungen-kinder",
      title: "Deutsch-Übungen für Kinder",
      description: "Lesen, Rechtschreibung und Grammatik für die Primarschule üben.",
    });
    if (grade === 1 || grade === 2) {
      links.push({
        href: "/lesen-lernen",
        title: "Lesen lernen",
        description: "Buchstaben, Wörter und erste Sätze Schritt für Schritt üben.",
      });
    }
    if (grade === 2) {
      links.push({
        href: "/leseverstaendnis-uebungen-2-klasse",
        title: "Leseverständnis 2. Klasse",
        description: "Kurze Texte lesen, Informationen finden und Fragen beantworten.",
      });
    }
  }

  if (subject === "science" && grade === 4) {
    links.push({
      href: "/learn/4/science/kantone-schweiz-4",
      title: "Schweizer Kantone lernen",
      description: "Kantone, Hauptorte, Wappen und Schweizer Geografie online üben.",
    });
  }

  return links.filter((link, index, all) => all.findIndex((candidate) => candidate.href === link.href) === index).slice(0, 4);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grade, subject } = await params;
  const subjectSeo = getSubjectSeo(subject);
  const subjectName = SUBJECT_NAMES[subject] ?? subjectSeo.name;
  const gradeName = getGradeName(grade);
  const title = subjectPageTitle(grade, subject, subjectSeo.shortName);
  const description = `Kostenlose ${subjectName}-Übungen für die ${gradeName}: ${subjectSeo.keywords.slice(1, 4).join(", ")}. Lehrplan 21 Schweiz, direkt im Browser.`;
  return {
    title,
    description,
    keywords: [subjectName, gradeName, "Lehrplan 21", "Schweiz", "Cleverli", "Übungen kostenlos", ...subjectSeo.keywords],
    openGraph: {
      title: `${title} | Cleverli`,
      description,
      images: [{ url: `https://www.cleverli.ch/og-cleverli-primarschule-2026.png`, width: 1200, height: 630, alt: `${title} — Cleverli` }],
    },
    alternates: { canonical: `https://www.cleverli.ch/learn/${grade}/${subject}` },
  };
}

const BASE = "https://www.cleverli.ch";

export default async function SubjectPage({ params }: Props) {
  const { grade, subject } = await params;
  if (subject === "french" && [3, 4].includes(parseInt(grade)) && process.env.NEXT_PUBLIC_CURRICULUM_PROFILES_ENABLED !== "true") {
    notFound();
  }
  if (parseInt(grade) <= 6 && (subject === "nt" || subject === "rzg")) {
    permanentRedirect(`/learn/${grade}/science`);
  }
  const topics = getTopicSummaries(parseInt(grade), subject);
  const subjectSeo = getSubjectSeo(subject);
  const subjectName = SUBJECT_NAMES[subject] ?? subjectSeo.name;
  const gradeName = getGradeName(grade);
  const title = subjectPageTitle(grade, subject, subjectSeo.shortName);
  const sampleTopics = topics.slice(0, 6);
  const contextualSeoLinks = getContextualSeoLinks(parseInt(grade), subject);

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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Was übt mein Kind in ${subjectName} ${gradeName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": subjectSeo.intro,
        },
      },
      {
        "@type": "Question",
        "name": "Sind die Übungen kostenlos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die ersten 20 Aufgaben können gratis getestet werden. Für alle Aufgaben und Familienprofile gibt es Cleverli Premium.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <SubjectPageClient grade={parseInt(grade)} subject={subject} topics={topics} />
      <section className="mx-auto max-w-2xl px-4 pb-24 pt-2">
        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-green-700">Lehrplan 21 Schweiz</p>
          <h2 className="mt-2 text-xl font-black text-gray-900">{title}: Themen und Beispiele</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">{subjectSeo.intro}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {subjectSeo.practice.map((item) => (
              <div key={item} className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-5">
            <h3 className="text-sm font-black text-gray-900">Beliebte Themen in dieser Klasse</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {sampleTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/learn/${grade}/${subject}/${topic.id}`}
                  prefetch={false}
                  className="rounded-full border border-green-100 bg-green-50 px-3 py-2 text-sm font-bold text-green-800 hover:bg-green-100"
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          </div>
          {contextualSeoLinks.length > 0 && (
            <div className="mt-6 border-t border-green-100 pt-5">
              <h3 className="text-sm font-black text-gray-900">Passende Übungsseiten</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Vertiefe einzelne Lernbereiche mit passenden Übungen und Beispielen.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {contextualSeoLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    className="rounded-xl border border-green-100 bg-green-50 p-3 transition-colors hover:bg-green-100"
                  >
                    <span className="block text-sm font-black text-green-900">{link.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-gray-600">{link.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
