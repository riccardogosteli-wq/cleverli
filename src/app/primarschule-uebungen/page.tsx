import type { Metadata } from "next";
import AdsPrimarschuleClient from "../ads/primarschule/AdsPrimarschuleClient";

export const metadata: Metadata = {
  title: "Primarschule üben nach Lehrplan 21",
  description: "Online-Übungen für Mathe, Deutsch und NMG in der Schweizer Primarschule. Kostenlos testen, danach für die ganze Familie.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "https://www.cleverli.ch/primarschule-uebungen",
  },
};

export default function PrimarschuleUebungenPage() {
  return <AdsPrimarschuleClient />;
}
