import type { Metadata } from "next";
import IntentLandingPage from "../ads/intent/IntentLandingPage";
import { lesenLernenConfig } from "../ads/intent/configs";

export const metadata: Metadata = {
  title: "Lesen lernen online üben - Primarschule Schweiz",
  description:
    "Lesen lernen mit kurzen Online-Übungen für Kinder: Buchstaben, Wörter und erste Sätze. 20 Aufgaben gratis testen.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "https://www.cleverli.ch/lesen-lernen",
  },
};

export default function LesenLernenPage() {
  return <IntentLandingPage config={lesenLernenConfig} />;
}
