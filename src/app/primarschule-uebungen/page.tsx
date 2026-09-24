import { withPageSocial } from "@/lib/pageSocialMetadata";
import CurriculumOverviewLink from "@/components/CurriculumOverviewLink";
import Link from "next/link";
import type { Metadata } from "next";
import AdsPrimarschuleClient from "../ads/primarschule/AdsPrimarschuleClient";

export const metadata: Metadata = withPageSocial({
  title: "Primarschule üben nach Lehrplan 21",
  description: "Online-Übungen für Mathe, Deutsch, NMG, Sprachen und Medien in der Schweizer Primarschule. Kostenlos testen, danach für die ganze Familie.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "https://www.cleverli.ch/primarschule-uebungen",
  },
});

export default function PrimarschuleUebungenPage() {
  return <><AdsPrimarschuleClient /><div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6"><CurriculumOverviewLink /><nav aria-label="Cleverli kennenlernen" className="flex flex-wrap gap-5"><Link href="/" className="py-3 font-semibold text-green-800 underline">Die Lernplattform für Familien kennenlernen</Link><Link href="/lernapp-primarschule" className="py-3 font-semibold text-green-800 underline">Welche Lernapp passt zur Primarschule?</Link></nav></div></>;
}
