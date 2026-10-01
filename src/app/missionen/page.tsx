import { withPageSocial } from "@/lib/pageSocialMetadata";
import { Metadata } from "next";
import MissionenClient from "./PageClient";

export const metadata: Metadata = withPageSocial({
  title: "Lernfortschritt & Missionen — verfügbare Fächer",
  description: "Verfolge deinen Lernfortschritt auf Cleverli. Missionen für die verfügbaren Fächer je Klasse — Bronze, Silber, Gold. Lehrplan 21 Schweiz.",
  openGraph: {
    title: "Lernfortschritt & Missionen | Cleverli",
    description: "Dein persönlicher Lernweg — alle passenden Themen und verfügbaren Fächer je Klasse. Kostenlos ausprobieren.",
    images: [{ url: "https://www.cleverli.ch/og-cleverli-primarschule-2026.png", width: 1200, height: 630, alt: "Cleverli – Die Lernplattform für die Primarschule" }],
  },
  alternates: { canonical: "https://www.cleverli.ch/missionen" },
});

export default function MissionenPage() {
  return <>
    <section className="border-b border-green-100 bg-white px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-green-700">Dein Lernweg</p>
        <h1 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">Missionen zeigen deinen Fortschritt</h1>
        <p className="mt-4 max-w-xl leading-7 text-gray-600">Jedes Thema ist in drei Lernstufen gegliedert. Gelöste Aufgaben füllen Bronze, Silber und Gold, sammeln XP und machen sichtbar, was du schon geschafft hast und was als Nächstes passt.</p>
      </div>
    </section>
    <MissionenClient />
  </>;
}
