import { Metadata } from "next";
import { getTopicSummaries } from "@/data/topicCatalog";
import SubjectPageClient from "./SubjectPageClient";
import { permanentRedirect } from "next/navigation";
import Link from "next/link";
import { getGradeName, getSubjectSeo } from "@/lib/seoContent";

interface Props { params: Promise<{ grade: string; subject: string }> }

const SUBJECT_NAMES: Record<string, string> = {
  math: "Mathematik", german: "Deutsch", science: "NMG", nt: "NMG", rzg: "NMG", english: "Englisch", french: "Französisch",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grade, subject } = await params;
  const subjectSeo = getSubjectSeo(subject);
  const subjectName = SUBJECT_NAMES[subject] ?? subjectSeo.name;
  const gradeName = getGradeName(grade);
  const title = `${subjectSeo.shortName} Übungen ${gradeName}`;
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
  if (parseInt(grade) <= 6 && (subject === "nt" || subject === "rzg")) {
    permanentRedirect(`/learn/${grade}/science`);
  }
  const topics = getTopicSummaries(parseInt(grade), subject);
  const subjectSeo = getSubjectSeo(subject);
  const subjectName = SUBJECT_NAMES[subject] ?? subjectSeo.name;
  const gradeName = getGradeName(grade);
  const title = `${subjectSeo.shortName} Übungen ${gradeName}`;
  const sampleTopics = topics.slice(0, 6);

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
                  className="rounded-full border border-green-100 bg-green-50 px-3 py-2 text-sm font-bold text-green-800 hover:bg-green-100"
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
