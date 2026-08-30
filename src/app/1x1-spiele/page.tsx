import type { Metadata } from "next";
import IntentLandingPage from "../ads/intent/IntentLandingPage";
import { einsMalEinsSpieleConfig } from "../ads/intent/configs";

export const metadata: Metadata = {
  title: "1x1 Spiele online - Einmaleins spielerisch üben",
  description: "1x1 Spiele für Kinder: Einmaleins mit Memory, Lückenaufgaben und kurzen Runden spielerisch üben. Kostenlos im Browser testen.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "https://www.cleverli.ch/1x1-spiele",
  },
  openGraph: {
    title: "1x1 Spiele online - Einmaleins spielerisch üben",
    description: "Einmaleins mit Memory, Lückenaufgaben und kurzen Runden spielerisch üben.",
    url: "https://www.cleverli.ch/1x1-spiele",
    images: [{ url: "https://www.cleverli.ch/og-cleverli-primarschule-2026.png", width: 1200, height: 630, alt: "Cleverli – Die Lernplattform für die Primarschule" }],
  },
};

export default function EinsMalEinsSpielePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: einsMalEinsSpieleConfig.faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <IntentLandingPage config={einsMalEinsSpieleConfig} />
    </>
  );
}
