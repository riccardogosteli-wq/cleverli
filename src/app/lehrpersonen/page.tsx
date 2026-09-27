import type { Metadata } from 'next';
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
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(teacherOffer) }} /><TeacherPage /></>;
}
