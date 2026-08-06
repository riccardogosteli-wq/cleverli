import type { Metadata } from "next";
import IntentLandingPage from "../ads/intent/IntentLandingPage";
import { matheUebungenKinderConfig } from "../ads/intent/configs";

export const metadata: Metadata = {
  title: "Mathe Übungen für Kinder",
  description: "Mathe-Übungen für Kinder in der Schweizer Primarschule. Rechnen, Einmaleins, Geometrie und mehr. 20 Aufgaben gratis testen.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "https://www.cleverli.ch/mathe-uebungen-kinder",
  },
};

export default function MatheUebungenKinderPage() {
  return <IntentLandingPage config={matheUebungenKinderConfig} />;
}
