import type { Metadata } from "next";
import AdsPrimarschuleClient from "./AdsPrimarschuleClient";

export const metadata: Metadata = {
  title: "Mathe & Deutsch üben nach Lehrplan 21 — Cleverli",
  description: "Cleverli hilft Kindern der 1.–6. Klasse, kurze Übungen nach Lehrplan 21 selbstständig zu machen. Für Familien in der Schweiz.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: {
    canonical: "https://www.cleverli.ch/ads/primarschule",
  },
};

export default function AdsPrimarschulePage() {
  return <AdsPrimarschuleClient />;
}
