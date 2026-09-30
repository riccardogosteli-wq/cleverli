import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { worksheetLandingPage, worksheetLandingPages } from "@/lib/worksheetLandingPages";

const BASE = "https://www.cleverli.ch";
const button = "inline-flex min-h-12 items-center justify-center rounded-2xl px-6 py-3 text-center font-bold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700";

export function generateStaticParams() {
  return worksheetLandingPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = worksheetLandingPage((await params).slug);
  if (!page) return {};
  const url = `${BASE}/arbeitsblaetter/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "de_CH",
      url,
      title: page.title,
      description: page.description,
      images: [{ url: `${BASE}${page.previewHref}`, width: page.previewWidth ?? 849, height: page.previewHeight ?? 1200, alt: page.previewAlt }],
    },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: [`${BASE}${page.previewHref}`] },
  };
}

export default async function WorksheetTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = worksheetLandingPage((await params).slug);
  if (!page) notFound();
  const url = `${BASE}/arbeitsblaetter/${page.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Cleverli", item: BASE },
        { "@type": "ListItem", position: 2, name: "Arbeitsblätter", item: `${BASE}/arbeitsblaetter` },
        { "@type": "ListItem", position: 3, name: `${page.topic}, ${page.grade}. Klasse`, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: page.title,
      description: page.description,
      url,
      inLanguage: "de-CH",
      isAccessibleForFree: true,
      educationalLevel: `${page.grade}. Klasse Primarschule`,
      learningResourceType: "Arbeitsblatt mit Lösung",
      teaches: page.practises,
      hasPart: [
        { "@type": "DigitalDocument", name: `${page.topic} Arbeitsblatt`, encodingFormat: "application/pdf", contentUrl: `${BASE}${page.worksheetHref}` },
        { "@type": "DigitalDocument", name: `${page.topic} Lösung`, encodingFormat: "application/pdf", contentUrl: `${BASE}${page.solutionHref}` },
      ],
      provider: { "@type": "Organization", name: "Cleverli", url: BASE },
    },
  ];

  return <main className="bg-[#fbfaf5] pb-20 text-slate-800">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-16">
      <nav aria-label="Brotkrümel" className="mb-9 flex flex-wrap gap-2 text-sm text-slate-600">
        <Link href="/" className="underline underline-offset-4">Cleverli</Link><span aria-hidden="true">/</span>
        <Link href="/arbeitsblaetter" className="underline underline-offset-4">Arbeitsblätter</Link><span aria-hidden="true">/</span>
        <span>{page.topic}, {page.grade}. Klasse</span>
      </nav>
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <p className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-900">{page.eyebrow}</p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{page.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{page.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={page.worksheetHref} download={page.worksheetDownload} className={`${button} bg-green-700 text-white hover:bg-green-800`}>Arbeitsblatt kostenlos herunterladen ↓</a>
            <a href={page.solutionHref} download={page.solutionDownload} className={`${button} border border-green-200 bg-white text-green-800 hover:bg-green-50`}>Lösung herunterladen ↓</a>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">Je 1 Seite · PDF · A4 · Ohne Anmeldung</p>
        </div>
        <div className="relative mx-auto w-full max-w-sm rounded-[2rem] bg-[#e5eddf] p-7 sm:p-9">
          <span className="absolute -top-3 right-4 z-10 rounded-full bg-amber-200 px-4 py-2 text-sm font-bold text-amber-950 shadow-sm">Kostenloses Beispiel</span>
          <Image src={page.previewHref} alt={page.previewAlt} width={page.previewWidth ?? 849} height={page.previewHeight ?? 1200} priority className="h-auto w-full -rotate-2 rounded-sm bg-white shadow-xl" />
        </div>
      </div>
    </section>

    <section className="border-y border-green-100 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-widest text-green-700">Einfach erklärt</p>
        <h2 className="mt-3 text-3xl font-extrabold">{page.explanationTitle}</h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div className="space-y-4 leading-7 text-slate-600">{page.explanation.map(text => <p key={text}>{text}</p>)}</div>
          <div className="grid gap-3">{page.examples.map(example => <article key={example.label} className="rounded-2xl bg-green-50 p-5"><p className="text-sm font-bold text-green-800">{example.label}</p><p className="mt-2 text-lg font-semibold text-slate-800">{example.text}</p></article>)}</div>
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-2">
      <article className="rounded-3xl border border-stone-200 bg-white p-7 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-widest text-green-700">Das übt dein Kind</p>
        <h2 className="mt-3 text-2xl font-extrabold">Klarer Fokus auf ein Thema</h2>
        <ul className="mt-5 space-y-3">{page.practises.map(item => <li key={item} className="flex gap-3 leading-7"><span aria-hidden="true" className="font-bold text-green-700">✓</span><span>{item}</span></li>)}</ul>
        <Link href={page.exerciseHref} className={`${button} mt-7 border border-green-200 text-green-800 hover:bg-green-50`}>{page.exerciseLabel} →</Link>
      </article>
      <article className="rounded-3xl bg-[#f0f3e9] p-7 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-widest text-green-700">Mehr mit Premium</p>
        <h2 className="mt-3 text-2xl font-extrabold">Die ganze Bibliothek bleibt bereit</h2>
        <p className="mt-4 leading-7 text-slate-600">Dieses Beispiel ist kostenlos. Mit Premium oder einem gültigen Lehrpersonenzugang stehen über 300 Arbeitsblätter mit separaten Lösungen bereit, unter anderem:</p>
        <ul className="mt-5 grid gap-3">{page.premiumTopics.map(item => <li key={item} className="rounded-xl bg-white px-4 py-3 font-semibold text-green-900">{item}</li>)}</ul>
        <Link href={`/arbeitsblaetter/bibliothek?klasse=${page.grade}`} className={`${button} mt-7 bg-green-700 text-white hover:bg-green-800`}>Arbeitsblätter der {page.grade}. Klasse öffnen →</Link>
      </article>
    </section>

    <section className="mx-5 rounded-3xl bg-green-900 px-6 py-10 text-white sm:mx-auto sm:max-w-5xl sm:px-10">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div><p className="text-sm font-bold uppercase tracking-widest text-green-200">Lehrplanbezug</p><h2 className="mt-3 text-2xl font-extrabold">Passend zum Lernstand auswählen</h2><p className="mt-4 max-w-2xl leading-7 text-green-100">{page.curriculumScope} Die Klassenangabe dient als Orientierung. Lernstand und Reihenfolge können je nach Schule und Kanton abweichen.</p></div>
        {page.curriculumUrl ? <a href={page.curriculumUrl} target="_blank" rel="noopener" className={`${button} bg-white text-green-900 hover:bg-green-50`}>Lehrplan {page.curriculumCode}<span className="sr-only"> in neuem Tab öffnen</span></a> : <span className="rounded-2xl bg-green-800 px-5 py-3 text-center font-bold text-green-50">Lehrplan {page.curriculumCode}</span>}
      </div>
    </section>

    <nav aria-label="Weitere kostenlose Arbeitsblätter" className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
      <h2 className="text-2xl font-extrabold">Weitere kostenlose Beispiele</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{worksheetLandingPages.filter(item => item.slug !== page.slug).map(item => <Link key={item.slug} href={`/arbeitsblaetter/${item.slug}`} className="group rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-green-500 hover:shadow-md"><span className="text-sm font-bold text-green-700">{item.grade}. Klasse · {item.subject}</span><span className="mt-2 flex items-center justify-between gap-3 text-lg font-extrabold"><span>{item.topic}</span><span aria-hidden="true" className="text-green-700 transition group-hover:translate-x-1">→</span></span></Link>)}</div>
    </nav>
  </main>;
}
