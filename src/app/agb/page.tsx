import type { Metadata } from "next";
import AgbClient from "./AgbClient";

export const metadata: Metadata = {
  title: "AGB – Allgemeine Geschäftsbedingungen – Cleverli",
  description: "Allgemeine Geschäftsbedingungen von Cleverli — der Lernplattform für Kinder der 1.-6. Klasse.",
  robots: { index: false },
  alternates: { canonical: "https://www.cleverli.ch/agb" },
};

export default function Page() {
  return <AgbClient />;
}
