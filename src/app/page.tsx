import { withPageSocial } from "@/lib/pageSocialMetadata";
import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = withPageSocial({
  title: "Lernplattform für die Primarschule Schweiz | Cleverli",
  description: "Cleverli begleitet Kinder der 1. bis 6. Klasse: Mathe, Deutsch, NMG und weitere Fächer üben, Lernfortschritt sehen und im Browser starten.",
  alternates: {
    canonical: "https://www.cleverli.ch/",
  },
  openGraph: {
    title: "Lernplattform für die Primarschule Schweiz | Cleverli",
    description: "Interaktiv Mathe, Deutsch, NMG, Sprachen & Medien üben — Klasse 1–6, Lehrplan 21. Kostenlos testen, keine App.",
    url: "https://www.cleverli.ch",
    images: [{ url: "/og-cleverli-primarschule-2026.png", width: 1200, height: 630, alt: "Cleverli – Die Lernplattform für die Primarschule" }],
  },
});

export default function HomePage() {
  return <HomeClient />;
}
