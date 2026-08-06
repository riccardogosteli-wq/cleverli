import type { Metadata } from "next";
import IntentLandingPage from "../ads/intent/IntentLandingPage";
import { einmaleinsUebenConfig } from "../ads/intent/configs";

export const metadata: Metadata = {
  title: "Einmaleins online üben",
  description: "Einmaleins-Aufgaben für die Schweizer Primarschule. 20 Aufgaben gratis testen, mit Vorlesen, Tipps und direktem Feedback.",
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
