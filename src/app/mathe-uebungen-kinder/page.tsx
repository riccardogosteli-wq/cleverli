import { withPageSocial } from "@/lib/pageSocialMetadata";
import type { Metadata } from "next";
import IntentLandingPage from "../ads/intent/IntentLandingPage";
import { matheUebungenKinderConfig } from "../ads/intent/configs";

export const metadata: Metadata = withPageSocial({
  title: "Mathe Übungen für Kinder der 1. bis 6. Klasse",
  description: "Mathe für die Schweizer Primarschule: Entdecke Übungen für die 1. bis 6. Klasse und finde passende Aufgaben für dein Kind.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "https://www.cleverli.ch/mathe-uebungen-kinder",
  },
});

export default function MatheUebungenKinderPage() {
  return <IntentLandingPage config={matheUebungenKinderConfig} />;
}
