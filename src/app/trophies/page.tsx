import type { Metadata } from "next";
import MissionenPage from "../missionen/PageClient";

export const metadata: Metadata = {
  title: "Lernfortschritt & Missionen — Mathe, Deutsch, NMG | Cleverli",
  description: "Verfolge deinen Lernfortschritt auf Cleverli. Missionen in Mathe, Deutsch und NMG für Klasse 1-6 - Bronze, Silber, Gold. Lehrplan 21 Schweiz.",
  alternates: { canonical: "https://www.cleverli.ch/missionen" },
};

// Keep the legacy /trophies URL stable, but render the unified Missionen view.
export default function TrophiesPage() {
  return <MissionenPage />;
}
