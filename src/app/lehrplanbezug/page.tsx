import type { Metadata } from 'next';
import Link from 'next/link';
import { getLehrplanOverview, getLehrplanSchema, LEHRPLAN_URL } from '@/lib/lehrplanOverview';

export const metadata: Metadata = {
  title: 'Lehrplanbezug: Themen und Übungen',
  description: 'Entdecke, wie Cleverli-Themen mit dem Lehrplan 21 verbunden sind. Übersicht nach Klasse, Fach und Themenbereich.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: LEHRPLAN_URL },
  openGraph: { title: 'Lehrplanbezug bei Cleverli', description: 'Themen, Übungen und Lehrplanzuordnungen für die Primarschule.', url: LEHRPLAN_URL },
};

export default function LehrplanOverviewPage() {
  const rows = getLehrplanOverview();
  const topics = rows.flatMap(row => row.subjects.flatMap(subject => subject.topics));
  const count = topics.reduce((sum, topic) => sum + topic.count, 0);
  return (
    <main id="main-content" className="min-h-screen bg-[#f7faf6] px-4 pb-28 pt-10 text-slate-800 sm:px-6 sm:pt-16">
      <script id="lehrplan-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getLehrplanSchema(rows)).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <p className="mb-4 text-sm font-bold tracking-wide text-green-700">LERNEN MIT BEZUG ZUM LEHRPLAN 21</p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">Was dein Kind bei Cleverli übt</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">Vom ersten Zählen bis zu anspruchsvolleren Texten: Hier findest du unsere Themen, die passenden Übungen und ihren Bezug zum Lehrplan 21. Nach Klasse und Fach geordnet, damit du schnell das Passende findest.</p>
        </header>
        <div className="my-9 grid grid-cols-3 gap-3" aria-label="Übersicht des Übungsangebots">
          {[['1 bis 6', 'Klassen'], [String(topics.length), 'Themen'], [new Intl.NumberFormat('de-CH').format(count), 'Übungen']].map(([value, label]) => <div key={label} className="rounded-2xl border border-green-100 bg-white p-4 sm:p-6"><p className="text-2xl font-extrabold text-green-800 sm:text-3xl">{value}</p><p className="mt-1 text-sm text-slate-600">{label}</p></div>)}
        </div>
        <section className="rounded-2xl border border-green-100 bg-green-50 p-6" aria-labelledby="orientation">
          <h2 id="orientation" className="text-xl font-bold text-green-950">So liest du die Übersicht</h2>
          <p className="mt-3 leading-relaxed">Die 1. und 2. Klasse gehören zum ersten Zyklus, die 3. bis 6. Klasse zum zweiten. Der erste Zyklus umfasst im Lehrplan auch den Kindergarten; diese Übersicht zeigt unsere Primarschulübungen.</p>
          <p className="mt-3 leading-relaxed">Die Lehrplancodes zeigen die bestehenden Zuordnungen unserer Themen. Je nach Thema beziehen sie sich auf einen Kompetenzbereich oder eine konkretere Kompetenz. Ein Code bedeutet nicht, dass eine einzelne Übung die gesamte Kompetenz abdeckt.</p>
          <p className="mt-3 leading-relaxed">Die Übersicht zeigt den gesamten Themenbestand. Welche Fremdsprache zuerst gelernt wird und wann Medien und Informatik dazukommen, hängt vom Kanton ab. Grundlage ist der Lehrplan 21 für die deutschsprachige Schule. Der Unterricht und die Begleitung durch Lehrpersonen bleiben wichtig.</p>
        </section>
        <nav aria-label="Klasse auswählen" className="my-8 flex flex-wrap gap-3">
          {rows.map(row => <a key={row.grade} href={`#klasse-${row.grade}`} className="rounded-full border border-green-200 bg-white px-5 py-3 font-bold text-green-800 hover:bg-green-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700">{row.grade}. Klasse</a>)}
        </nav>
        <div className="space-y-10">
          {rows.map(row => <section key={row.grade} id={`klasse-${row.grade}`} className="scroll-mt-24" aria-labelledby={`titel-${row.grade}`}>
            <div className="mb-4 flex items-baseline gap-3"><h2 id={`titel-${row.grade}`} className="text-2xl font-extrabold">{row.grade}. Klasse</h2><span className="text-sm text-slate-500">Zyklus {row.cycle}</span></div>
            <div className="space-y-3">{row.subjects.map(subject => <details key={subject.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white" open={row.grade === 1 && subject.id === 'math'}>
              <summary className="cursor-pointer px-5 py-5 font-bold text-slate-900 focus-visible:outline-2 focus-visible:outline-green-700"><span className="ml-2">{subject.name}</span><span className="ml-3 text-sm font-normal text-slate-500">{subject.topics.length} Themen</span></summary>
              <ul className="divide-y divide-slate-100 border-t border-slate-100">{subject.topics.map(topic => <li key={topic.id} className="grid gap-3 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div><h3 className="font-bold">{topic.title}</h3><p className="mt-1 text-sm text-slate-500">{topic.count} Übungen</p><p className="mt-2 break-words text-sm leading-relaxed text-slate-600"><span className="font-semibold">Lehrplanbezug: </span>{topic.codes.join(' · ')}</p></div>
                <Link prefetch={false} href={topic.url} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-800 hover:bg-green-100 focus-visible:outline-2 focus-visible:outline-green-700" aria-label={`${topic.title}, ${row.grade}. Klasse: Übungen ansehen`}>Übungen ansehen <span aria-hidden="true" className="ml-2">→</span></Link>
              </li>)}</ul>
            </details>)}</div>
          </section>)}
        </div>
        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6" aria-labelledby="sources">
          <h2 id="sources" className="text-xl font-bold">Der Lehrplan als Grundlage</h2>
          <p className="mt-3 leading-relaxed">Die offiziellen Quellen erklären die Kompetenzbereiche und den Aufbau des Lehrplans. Für die Umsetzung ist die jeweilige kantonale Fassung massgebend.</p>
          <ul className="mt-4 space-y-3 text-green-800"><li><a className="inline-block py-2 font-semibold underline underline-offset-4" href="https://www.lehrplan21.ch/">Lehrplan 21: Grundlagen und kantonale Fassungen</a></li><li><a className="inline-block py-2 font-semibold underline underline-offset-4" href="https://zh.lehrplan.ch/">Lehrplan 21 des Kantons Zürich</a></li></ul>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">Diese Zuordnung beschreibt das Übungsangebot von Cleverli. Sie ist keine Zertifizierung oder offizielle Empfehlung durch eine Bildungsbehörde.</p>
        </section>
      </div>
    </main>
  );
}
