import type { Metadata } from "next";
import IntentLandingPage from "../ads/intent/IntentLandingPage";
import { einmaleinsUebenConfig } from "../ads/intent/configs";

export const metadata: Metadata = {
  title: "Einmaleins üben online - 1x1 Aufgaben Schweiz",
  description: "Einmaleins online üben: 1x1-Reihen, gemischte Aufgaben und Divisionen für die Schweizer Primarschule. 20 Aufgaben gratis testen.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "https://www.cleverli.ch/einmaleins-ueben",
  },
  openGraph: {
    title: "Einmaleins üben online - 1x1 Aufgaben Schweiz",
    description: "1x1-Reihen, gemischte Aufgaben und Divisionen für die Schweizer Primarschule üben.",
    url: "https://www.cleverli.ch/einmaleins-ueben",
    images: [{ url: "https://www.cleverli.ch/og-cleverli-primarschule-2026.png", width: 1200, height: 630, alt: "Cleverli – Die Lernplattform für die Primarschule" }],
  },
};

export default function EinmaleinsUebenPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: einmaleinsUebenConfig.faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <IntentLandingPage config={einmaleinsUebenConfig} />
    </>
  );
}
