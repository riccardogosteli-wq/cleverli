import type { Metadata } from "next";
import IntentLandingPage from "../ads/intent/IntentLandingPage";
import { deutschUebungenKinderConfig } from "../ads/intent/configs";

export const metadata: Metadata = {
  title: "Deutsch Übungen für Kinder - Primarschule Schweiz",
  description: "Deutsch Übungen für Kinder: Lesen, Rechtschreibung, Grammatik, Satzbau und Wortschatz für die Schweizer Primarschule.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "https://www.cleverli.ch/deutsch-uebungen-kinder",
  },
};

export default function DeutschUebungenKinderPage() {
  return <IntentLandingPage config={deutschUebungenKinderConfig} />;
}
