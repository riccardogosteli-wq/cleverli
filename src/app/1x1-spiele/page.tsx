import type { Metadata } from "next";
import IntentLandingPage from "../ads/intent/IntentLandingPage";
import { einsMalEinsSpieleConfig } from "../ads/intent/configs";

export const metadata: Metadata = {
  title: "1x1 Spiele online üben",
  description: "1x1 Spiele und Einmaleins-Aufgaben für Kinder. 20 Aufgaben gratis testen, direkt im Browser, mit Tipps und Vorlesen.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: {
    canonical: "https://www.cleverli.ch/1x1-spiele",
  },
};

export default function EinsMalEinsSpielePage() {
  return <IntentLandingPage config={einsMalEinsSpieleConfig} />;
}
