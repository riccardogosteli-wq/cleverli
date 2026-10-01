import { withPageSocial } from "@/lib/pageSocialMetadata";
import { Metadata } from "next";
import ParentsClient from "./PageClient";

export const metadata: Metadata = withPageSocial({
  title: "Elternbereich — Lernfortschritt deines Kindes verfolgen",
  description: "Im Cleverli-Elternbereich siehst du den Lernfortschritt deines Kindes auf einen Blick. Schwachstellen, Streak-Kalender, Belohnungen einrichten. Kostenlos testen.",
  openGraph: {
    title: "Elternbereich | Cleverli",
    description: "Verfolge den Lernfortschritt deines Kindes in allen Cleverli-Fächern. Klasse 1–6, Lehrplan 21 Schweiz.",
    images: [{ url: "https://www.cleverli.ch/og-cleverli-primarschule-2026.png", width: 1200, height: 630, alt: "Cleverli – Die Lernplattform für die Primarschule" }],
  },
  alternates: { canonical: "https://www.cleverli.ch/parents" },
});

export default function ParentsPage() {
  return <>
    <section className="border-b border-green-100 bg-white px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-green-700">Für Eltern</p>
        <h1 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">Im Elternbereich gemeinsam begleiten</h1>
        <p className="mt-4 max-w-xl leading-7 text-gray-600">Im Elternbereich siehst du, welche Themen dein Kind bereits sicher löst, wo es noch übt und wie sich XP, Streaks und Belohnungen entwickeln. Kinderprofile und Lernfortschritt bleiben übersichtlich an einem Ort.</p>
      </div>
    </section>
    <ParentsClient />
  </>;
}
