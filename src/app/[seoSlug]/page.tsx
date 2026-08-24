import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopicsForSubject } from "@/data";
import {
  GRADE_SUBJECT_SEO_PAGES,
  getGradeSubjectSeoLinks,
  getGradeSubjectSeoPage,
} from "@/lib/gradeSubjectSeo";
import { getExerciseTypeLabel, getSampleExercises } from "@/lib/seoContent";

const BASE = "https://www.cleverli.ch";

type Props = {
  params: Promise<{ seoSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return GRADE_SUBJECT_SEO_PAGES.map((page) => ({ seoSlug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seoSlug } = await params;
  const page = getGradeSubjectSeoPage(seoSlug);
  if (!page) return { title: "Seite nicht gefunden - Cleverli", robots: { index: false } };

  return {
    title: page.title,
    description: page.description,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: { canonical: `${BASE}${page.href}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${BASE}${page.href}`,
      images: [{ url: `${BASE}/og-image-v2.png`, width: 1200, height: 630, alt: "Cleverli - Schweizer Primarschule" }],
    },
  };
}

export default async function GradeSubjectSeoRoute({ params }: Props) {
  const { seoSlug } = await params;
  const page = getGradeSubjectSeoPage(seoSlug);
  if (!page) notFound();

  const topics = getTopicsForSubject(page.grade, page.subject);
  const topicLinks = topics.slice(0, 8);
  const sampleExercises = topics.flatMap((topic) => getSampleExercises(topic, 2).map((exercise) => ({
    ...exercise,
    topicTitle: topic.title,
  }))).filter((exercise) => Boolean(exercise.question)).slice(0, 5);
  const heroExercise = sampleExercises[0];
  const heroImage = page.subject === "math"
    ? {
      src: "/images/scenes/cleverli-math-ask.jpg",
      alt: `Cleverli Beispielszene für ${page.h1}`,
    }
    : {
      src: "/images/scenes/cleverli-reading-abc.jpg",
      alt: `Cleverli Beispielszene für ${page.h1}`,
    };
  const relatedPages = getGradeSubjectSeoLinks()
    .filter((related) => related.href !== page.href && (related.grade === page.grade || related.subject === page.subject))
    .slice(0, 5);
  const usedRelatedHrefs = new Set([...relatedPages.map((related) => related.href), "/primarschule-uebungen"]);
  const extraLinks = (page.extraLinks ?? []).filter((link) => !usedRelatedHrefs.has(link.href));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${page.h1} - Themen`,
    url: `${BASE}${page.href}`,
    numberOfItems: topics.length,
    itemListElement: topics.map((topic, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: topic.title,
      url: `${BASE}/learn/${page.grade}/${page.subject}/${topic.id}`,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Sind die ${page.h1} kostenlos?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Die ersten 20 Aufgaben können gratis getestet werden. Für alle Aufgaben, Klassen und Familienprofile gibt es Cleverli Premium.",
        },
      },
      {
        "@type": "Question",
        name: "Passt Cleverli zur Schweizer Primarschule?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja. Cleverli ist auf die Schweizer Primarschule und Lehrplan 21 ausgerichtet.",
        },
      },
      ...(page.faqItems ?? []).map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    ],
  };

  return (
    <main className="bg-white text-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="border-b border-green-100 bg-green-50 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="min-w-0">
            <p className="break-words text-sm font-bold uppercase tracking-widest text-green-700">{page.eyebrow}</p>
            <h1 className="mt-3 max-w-3xl break-words text-4xl font-black leading-tight text-gray-950 sm:text-5xl">{page.h1}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-700">{page.lead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={page.ctaHref}
                className="rounded-full bg-green-700 px-7 py-4 text-center text-base font-bold text-white shadow-lg shadow-green-100 transition-colors hover:bg-green-800"
              >
                {page.ctaLabel}
              </Link>
              <Link
                href={`/learn/${page.grade}/${page.subject}`}
                className="rounded-full border-2 border-green-700 px-7 py-4 text-center text-base font-bold text-green-800 transition-colors hover:bg-white"
              >
                Alle Themen ansehen
              </Link>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-xl shadow-green-100/70">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              width={900}
              height={620}
              priority
              sizes="(min-width: 1024px) 420px, 100vw"
              className="h-56 w-full object-cover sm:h-72"
            />
            {heroExercise && (
              <div className="border-t border-green-100 p-5">
                <p className="text-xs font-black uppercase tracking-widest text-green-700">Beispielaufgabe · {getExerciseTypeLabel(heroExercise.type)}</p>
                <p className="mt-1 text-xs font-bold text-gray-500">{heroExercise.topicTitle}</p>
                <p className="mt-2 text-base font-bold leading-7 text-gray-950">{heroExercise.question}</p>
                <p className="mt-3 text-sm leading-6 text-gray-600">Mit Vorlesen, Tipps und direkter Rückmeldung.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-green-700">Überblick</p>
            <h2 className="mt-2 text-2xl font-black text-gray-950">{page.focusTitle}</h2>
            <p className="mt-4 text-base leading-7 text-gray-700">{page.parentAnswer}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {page.focusItems.map((item) => (
              <div key={item} className="rounded-2xl border border-green-100 bg-green-50 p-4">
                <p className="text-sm font-bold leading-6 text-green-950">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {page.detailItems && page.detailItems.length > 0 && (
        <section className="border-y border-green-100 bg-green-50/60 px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-widest text-green-700">Vertiefung</p>
              <h2 className="mt-2 text-2xl font-black text-gray-950">
                {page.detailHeading ?? `${page.shortSubjectName} ${page.grade}. Klasse gezielt festigen`}
              </h2>
              {page.detailIntro && (
                <p className="mt-4 text-base leading-7 text-gray-700">{page.detailIntro}</p>
              )}
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {page.detailItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-black text-gray-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-700">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gray-50 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-green-700">Themen</p>
              <h2 className="mt-2 text-2xl font-black text-gray-950">Beliebte Übungen in der {page.grade}. Klasse</h2>
            </div>
            <Link href={`/learn/${page.grade}/${page.subject}`} className="text-sm font-bold text-green-800 hover:text-green-900">
              Ganze Übersicht öffnen
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topicLinks.map((topic) => (
              <Link
                key={topic.id}
                href={`/learn/${page.grade}/${page.subject}/${topic.id}`}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-green-300 hover:bg-green-50"
              >
                <p className="text-2xl">{topic.emoji}</p>
                <h3 className="mt-2 text-sm font-black text-gray-950">{topic.title}</h3>
                <p className="mt-2 text-xs leading-5 text-gray-600">{topic.exercises.length} interaktive Aufgaben</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {sampleExercises.length > 0 && (
        <section className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-widest text-green-700">Beispiele</p>
            <h2 className="mt-2 text-2xl font-black text-gray-950">So sehen kurze Cleverli-Aufgaben aus</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {sampleExercises.map((exercise) => (
                <div key={exercise.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    {exercise.topicTitle} · {getExerciseTypeLabel(exercise.type)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-800">{exercise.question}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.faqItems && page.faqItems.length > 0 && (
        <section className="bg-white px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-widest text-green-700">Fragen</p>
            <h2 className="mt-2 text-2xl font-black text-gray-950">Häufige Fragen zu {page.h1}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {page.faqItems.map((item) => (
                <article key={item.question} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <h3 className="text-sm font-black leading-6 text-gray-950">{item.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-700">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-green-700 px-4 py-10 text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-green-100">Weiterüben</p>
          <h2 className="mt-2 text-2xl font-black">Passende Seiten und verwandte Klassen</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {relatedPages.map((related) => (
              <Link
                key={related.href}
                href={related.href}
                className="rounded-full bg-white px-4 py-3 text-sm font-bold text-green-800 hover:bg-green-50"
              >
                {related.h1}
              </Link>
            ))}
            <Link href="/primarschule-uebungen" className="rounded-full border border-white px-4 py-3 text-sm font-bold text-white hover:bg-green-800">
              Primarschule Übungen
            </Link>
            {extraLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/70 px-4 py-3 text-sm font-bold text-white hover:bg-green-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
