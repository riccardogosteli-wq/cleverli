import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Cleverli — Online-Übungen für die Schweizer Primarschule",
  description: "Die interaktive Lernplattform für Kinder der 1.-6. Klasse. Mathe, Deutsch, NMG, Sprachen & Medien nach Lehrplan 21. Kostenlos starten.",
  alternates: {
    canonical: "https://www.cleverli.ch/",
  },
  openGraph: {
    title: "Cleverli — Online-Übungen für die Schweizer Primarschule",
    description: "Interaktiv Mathe, Deutsch, NMG, Sprachen & Medien üben — Klasse 1–6, Lehrplan 21. Kostenlos testen, keine App.",
    url: "https://www.cleverli.ch",
    images: [{ url: "/og-cleverli-primarschule-2026.png", width: 1200, height: 630, alt: "Cleverli – Die Lernplattform für die Primarschule" }],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
