import type { Metadata } from "next";
import IntentLandingPage from "../ads/intent/IntentLandingPage";
import { deutschUebungenKinderConfig } from "../ads/intent/configs";

export const metadata: Metadata = {
  title: "Deutsch Übungen für Kinder",
  description: "Deutsch-Übungen für Kinder in der Schweizer Primarschule. Lesen, Rechtschreibung, Grammatik und Satzbau. 20 Aufgaben gratis testen.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: {
    canonical: "https://www.cleverli.ch/deutsch-uebungen-kinder",
  },
};

export default function DeutschUebungenKinderPage() {
  return <IntentLandingPage config={deutschUebungenKinderConfig} />;
}
