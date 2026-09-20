"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/LangContext';
import type { Lang } from '@/lib/i18n';
import type { getLehrplanOverview } from '@/lib/lehrplanOverview';
import { getLehrplanSchema } from '@/lib/lehrplanSchema';
import { LEHRPLAN_LANGS, lehrplanCopy, lehrplanGrade, lehrplanUrl } from '@/lib/lehrplanCopy';

export default function LehrplanOverviewClient({ allRows, initialLang }: { allRows: Record<Lang, ReturnType<typeof getLehrplanOverview>>; initialLang: Lang }) {
  const { lang: selectedLang, setLang } = useLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const lang = mounted ? selectedLang : initialLang;
  const router = useRouter();
  const previousUrlLang = useRef(initialLang);
  useEffect(() => {
    if (!mounted) return;
    if (previousUrlLang.current !== initialLang) {
      previousUrlLang.current = initialLang;
      if (selectedLang !== initialLang) setLang(initialLang);
      return;
    }
    if (selectedLang !== initialLang) router.replace(lehrplanUrl(selectedLang), { scroll: false });
  }, [mounted, selectedLang, initialLang, router, setLang]);
  const c = lehrplanCopy[lang];
  const rows = allRows[lang];
  const topics = rows.flatMap(row => row.subjects.flatMap(subject => subject.topics));
  const count = topics.reduce((sum, topic) => sum + topic.count, 0);
  return (
    <main lang={lang} className="min-h-screen bg-[#f7faf6] px-4 pb-28 pt-10 text-slate-800 sm:px-6 sm:pt-16">
      <script id="lehrplan-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getLehrplanSchema(rows, lang)).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-5xl">
        <nav aria-label={{de:"Sprache",fr:"Langue",it:"Lingua",en:"Language"}[lang]} className="mb-6 flex flex-wrap gap-3">{LEHRPLAN_LANGS.map(l => <a key={l} href={l === 'de' ? `${lehrplanUrl(l)}?lang=de` : lehrplanUrl(l)} hrefLang={l} lang={l} aria-current={l === lang ? "page" : undefined} className="inline-flex min-h-11 items-center rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-800">{{de:"Deutsch",fr:"Français",it:"Italiano",en:"English"}[l]}</a>)}</nav>
        <header className="max-w-3xl">
          <p className="mb-4 text-sm font-bold tracking-wide text-green-700">{c.eyebrow}</p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">{c.heading}</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">{c.intro}</p>
        </header>
        <div className="my-9 grid grid-cols-3 gap-3" aria-label={c.overview}>
          {[[c.range, c.grades], [String(topics.length), c.topics], [new Intl.NumberFormat(c.locale).format(count), c.exercises]].map(([value, label]) => <div key={label} className="rounded-2xl border border-green-100 bg-white p-3 sm:p-6"><p className="text-base font-extrabold text-green-800 min-[360px]:text-xl sm:text-3xl">{value}</p><p className="mt-1 text-xs text-slate-600 min-[360px]:text-sm">{label}</p></div>)}
        </div>
        <section className="rounded-2xl border border-green-100 bg-green-50 p-6" aria-labelledby="orientation">
          <h2 id="orientation" className="text-xl font-bold text-green-950">{c.orientation}</h2>
          <p className="mt-3 leading-relaxed">{c.paragraphs[0]}</p>
          <p className="mt-3 leading-relaxed">{c.paragraphs[1]}</p>
          <p className="mt-3 leading-relaxed">{c.paragraphs[2]}</p>
          <p className="mt-3 leading-relaxed">{c.scope}</p>
        </section>
        <nav aria-label={c.select} className="my-8 flex flex-wrap gap-3">
          {rows.map(row => <a key={row.grade} href={`#klasse-${row.grade}`} className="rounded-full border border-green-200 bg-white px-5 py-3 font-bold text-green-800 hover:bg-green-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700">{lehrplanGrade(row.grade, lang)}</a>)}
        </nav>
        <div className="space-y-10">
          {rows.map(row => <section key={row.grade} id={`klasse-${row.grade}`} className="scroll-mt-24" aria-labelledby={`titel-${row.grade}`}>
            <div className="mb-4 flex items-baseline gap-3"><h2 id={`titel-${row.grade}`} className="text-2xl font-extrabold">{lehrplanGrade(row.grade, lang)}</h2><span className="text-sm text-slate-500">{c.cycle} {row.cycle}</span></div>
            <div className="space-y-3">{row.subjects.map(subject => <details key={subject.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white" open={row.grade === 1 && subject.id === 'math'}>
              <summary className="cursor-pointer px-5 py-5 font-bold text-slate-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-700"><span className="ml-2">{subject.name}</span><span className="ml-3 text-sm font-normal text-slate-500">{subject.topics.length} {c.topics}</span></summary>
              <ul className="divide-y divide-slate-100 border-t border-slate-100">{subject.topics.map(topic => <li key={topic.id} className="grid gap-3 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div><h3 className="font-bold">{topic.title}</h3><p className="mt-1 text-sm text-slate-500">{topic.count} {c.exercises}</p><p className="mt-2 break-words text-sm leading-relaxed text-slate-600"><span className="font-semibold">{c.alignment}: </span>{topic.codes.join(' · ')}</p></div>
                <Link prefetch={false} href={lang === 'de' ? topic.url : `${topic.url}?lang=${lang}`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-800 hover:bg-green-100 focus-visible:outline-2 focus-visible:outline-green-700" aria-label={`${topic.title}, ${lehrplanGrade(row.grade, lang)}: ${c.view}`}>{c.view} <span aria-hidden="true" className="ml-2">→</span></Link>
              </li>)}</ul>
            </details>)}</div>
          </section>)}
        </div>
        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6" aria-labelledby="sources">
          <h2 id="sources" className="text-xl font-bold">{c.sources}</h2>
          <p className="mt-3 leading-relaxed">{c.sourceText}</p>
          <ul className="mt-4 space-y-3 text-green-800"><li><a className="inline-block py-2 font-semibold underline underline-offset-4" href="https://www.lehrplan21.ch/">{c.sourceGeneral}</a></li><li><a className="inline-block py-2 font-semibold underline underline-offset-4" href="https://zh.lehrplan.ch/">{c.sourceZurich}</a></li></ul>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">{c.disclaimer}</p>
        </section>
      </div>
    </main>
  );
}
