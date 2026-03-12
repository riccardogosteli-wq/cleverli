import { Metadata } from "next";
import MissionenClient from "./PageClient";

export const metadata: Metadata = {
  title: "Lernfortschritt & Missionen — Mathe, Deutsch, NMG | Cleverli",
  description: "Verfolge deinen Lernfortschritt auf Cleverli. Missionen in Mathe, Deutsch und NMG für Klasse 1–6 — Bronze, Silber, Gold. Lehrplan 21 Schweiz.",
  openGraph: {
    title: "Lernfortschritt & Missionen | Cleverli",
    description: "Dein persönlicher Lernweg — alle Themen, alle Fächer, alle Klassen. Kostenlos ausprobieren.",
  },
  alternates: { canonical: "https://www.cleverli.ch/missionen" },
};

export default function MissionenPage() {
  return <MissionenClient />;
}
