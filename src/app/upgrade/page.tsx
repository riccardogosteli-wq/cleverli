import type { Metadata } from "next";
import UpgradePageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Cleverli Premium — gesamte Primarschulzeit für CHF 249",
  description: "Kurzzeitige Gründeraktion: Cleverli für die gesamte Primarschulzeit und bis zu 3 Kinderprofile. Einmalig CHF 249 statt CHF 594.",
  openGraph: {
    title: "Cleverli für die gesamte Primarschulzeit — einmalig CHF 249",
    description: "Befristete Gründeraktion: alle Klassen 1–6, alle Fächer und bis zu 3 Kinderprofile. CHF 249 statt CHF 594.",
    images: [{ url: "https://www.cleverli.ch/og-cleverli-primarschule-2026.png", width: 1200, height: 630, alt: "Cleverli – Die Lernplattform für die Primarschule" }],
  },
  alternates: { canonical: "https://www.cleverli.ch/upgrade" },
};

export default function UpgradePage() {
  return <UpgradePageClient />;
}
