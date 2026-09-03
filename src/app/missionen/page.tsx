import { Metadata } from "next";
import MissionenClient from "./PageClient";

export const metadata: Metadata = {
  title: "Lernfortschritt & Missionen — verfügbare Fächer",
  description: "Verfolge deinen Lernfortschritt auf Cleverli. Missionen für die verfügbaren Fächer je Klasse — Bronze, Silber, Gold. Lehrplan 21 Schweiz.",
  openGraph: {
    title: "Lernfortschritt & Missionen | Cleverli",
    description: "Dein persönlicher Lernweg — alle passenden Themen und verfügbaren Fächer je Klasse. Kostenlos ausprobieren.",
    images: [{ url: "https://www.cleverli.ch/og-cleverli-primarschule-2026.png", width: 1200, height: 630, alt: "Cleverli – Die Lernplattform für die Primarschule" }],
  },
  alternates: { canonical: "https://www.cleverli.ch/missionen" },
};

export default function MissionenPage() {
  return <MissionenClient />;
}
