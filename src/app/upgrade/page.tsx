import type { Metadata } from "next";
import UpgradePageClient from "./PageClient";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Premium freischalten – Cleverli",
  description: "Alle 50 Aufgaben pro Thema für CHF 9.90/Monat oder CHF 99/Jahr. TWINT, Visa & Mastercard.",
};

export default function UpgradePage() {
  return (
    <>
      <Navigation />
      <main className="pb-24 sm:pb-8">
        <UpgradePageClient />
      </main>
    </>
  );
}
