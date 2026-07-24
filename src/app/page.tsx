import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Cleverli — Lernen macht Spass 🇨🇭",
  description: "Die interaktive Lernplattform für Kinder der 1.-6. Klasse. Mathe, Deutsch & NMG nach Lehrplan 21. Kostenlos starten, kein Download nötig.",
  alternates: {
    canonical: "https://www.cleverli.ch/",
  },
  openGraph: {
    title: "Cleverli — Lernen macht Spass 🇨🇭",
    description: "Interaktiv Mathe, Deutsch & NMG üben — Klasse 1–6, Lehrplan 21. Erste 20 Aufgaben gratis, kein Download, keine App.",
    url: "https://www.cleverli.ch",
    images: [{ url: "/og-image-v2.png", width: 1200, height: 630, alt: "Cleverli — Lernplattform für Kinder" }],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
