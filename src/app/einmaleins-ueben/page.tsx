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
};

export default function EinmaleinsUebenPage() {
  return <IntentLandingPage config={einmaleinsUebenConfig} />;
}
