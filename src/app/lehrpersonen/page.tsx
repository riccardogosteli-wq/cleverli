import type { Metadata } from 'next';
import Link from 'next/link';
import TeacherPage from './TeacherPage';
export const metadata: Metadata = { title:'Cleverli für Lehrpersonen', description:'Cleverli im Unterricht und in der begleiteten Förderung: Lehrerkonto mit unbegrenzt vielen Kinderprofilen auf Anfrage.', alternates:{canonical:'https://www.cleverli.ch/lehrpersonen'} };
const teacherOffer = {
  "@context": "https://schema.org",
  "@type": "Offer",
  "@id": "https://www.cleverli.ch/lehrpersonen#offer",
  url: "https://www.cleverli.ch/lehrpersonen",
  name: "Lehrerkonto für eine Klasse",
  description: "CHF 99 pro Klasse und Jahr, auf Anfrage. Unbegrenzt viele Kinderprofile für eine Klasse. Mehrere Lehrpersonen derselben Klasse dürfen den gemeinsamen Zugang nutzen. Manuelle Freischaltung, kein Online-Kauf.",
  price: "99",
  priceCurrency: "CHF",
  priceSpecification: {
    "@type": "UnitPriceSpecification",
    price: "99",
    priceCurrency: "CHF",
    referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "ANN" },
  },
  seller: { "@id": "https://www.cleverli.ch/#organization" },
  itemOffered: { "@id": "https://www.cleverli.ch/#app" },
};
export default function Page() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(teacherOffer) }} /><TeacherPage /><section className="mx-auto max-w-5xl px-5 py-10"><h2 className="text-2xl font-bold">Auch auf Papier üben</h2><p className="mt-3 leading-7 text-slate-600">Arbeitsblätter für die 1. bis 6. Klasse mit separaten Lösungen. Mit gültigem Lehrpersonenzugang ist die Bibliothek bereits enthalten.</p><Link href="/arbeitsblaetter" className="mt-4 inline-flex min-h-12 items-center rounded-xl bg-green-700 px-5 py-3 font-bold text-white">Arbeitsblätter entdecken →</Link></section></>;
}
