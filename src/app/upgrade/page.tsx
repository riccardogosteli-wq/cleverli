import type { Metadata } from "next";
import UpgradePageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Premium freischalten — CHF 9.90/Monat | Cleverli",
  description: "Alle Aufgaben in Mathe, Deutsch & NMG für CHF 9.90/Monat oder CHF 99/Jahr. TWINT, Visa & Mastercard. Jederzeit kündbar.",
  openGraph: {
    title: "Cleverli Premium — Alle Aufgaben freischalten",
    description: "CHF 9.90/Monat · Alle Klassen 1–6 · Alle Fächer · TWINT & Karte · Jederzeit kündbar.",
    images: [{ url: "https://www.cleverli.ch/og-image.png", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://www.cleverli.ch/upgrade" },
};

export default function UpgradePage() {
  return <UpgradePageClient />;
}
