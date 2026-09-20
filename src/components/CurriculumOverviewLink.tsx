"use client";

import Link from 'next/link';
import { useLang } from '@/lib/LangContext';

const copy = {
  de: { title: 'Was übt dein Kind nach Lehrplan 21?', text: 'Unsere Übersicht zeigt die Themen nach Klasse und Fach, mit Lehrplancodes und direkten Links zu den Übungen.', link: 'Lehrplanbezug ansehen' },
  fr: { title: 'Quels thèmes sont liés au Lehrplan 21 ?', text: 'Découvrez les thèmes par année et matière, leurs codes du programme et les liens vers les exercices.', link: 'Voir les liens avec le Lehrplan 21' },
  it: { title: 'Quali temi si collegano al Lehrplan 21?', text: 'Scopri i temi per classe e materia, i codici del programma e i collegamenti agli esercizi.', link: 'Scopri i collegamenti al Lehrplan 21' },
  en: { title: 'How do the exercises relate to Lehrplan 21?', text: 'Explore topics by grade and subject, with curriculum codes and direct links to the exercises.', link: 'View curriculum connections' },
};

export default function CurriculumOverviewLink() {
  const { lang } = useLang();
  const c = copy[lang] ?? copy.de;
  return <section aria-label={c.title} className="my-8 rounded-2xl border border-green-100 bg-green-50 p-6 text-gray-800">
    <h2 className="text-xl font-bold">{c.title}</h2>
    <p className="mt-3 leading-relaxed">{c.text}</p>
    <Link href="/lehrplanbezug" className="mt-3 inline-flex min-h-11 items-center py-2 font-semibold text-green-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700">{c.link}</Link>
  </section>;
}
