import type { Metadata } from "next";
import MissionenPage from "../missionen/PageClient";

export const metadata: Metadata = {
  title: "Lernfortschritt & Missionen — verfügbare Fächer",
  description: "Verfolge deinen Lernfortschritt auf Cleverli. Missionen für die verfügbaren Fächer je Klasse - Bronze, Silber, Gold. Lehrplan 21 Schweiz.",
  alternates: { canonical: "https://www.cleverli.ch/missionen" },
};

// Keep the legacy /trophies URL stable, but render the unified Missionen view.
export default function TrophiesPage() {
  return <MissionenPage />;
}
