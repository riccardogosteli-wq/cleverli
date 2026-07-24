import { Metadata } from "next";
import ParentsClient from "./PageClient";

export const metadata: Metadata = {
  title: "Elternbereich — Lernfortschritt deines Kindes verfolgen | Cleverli",
  description: "Im Cleverli-Elternbereich siehst du den Lernfortschritt deines Kindes auf einen Blick. Schwachstellen, Streak-Kalender, Belohnungen einrichten. Kostenlos testen.",
  openGraph: {
    title: "Elternbereich | Cleverli",
    description: "Verfolge den Lernfortschritt deines Kindes in Mathe, Deutsch und NMG. Klasse 1–6, Lehrplan 21 Schweiz.",
    images: [{ url: "https://www.cleverli.ch/og-image-v2.png", width: 1200, height: 630, alt: "Cleverli Elternbereich" }],
  },
  alternates: { canonical: "https://www.cleverli.ch/parents" },
};

export default function ParentsPage() {
  return <ParentsClient />;
}
