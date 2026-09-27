import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Anmelden – Cleverli",
  description: "Bei Cleverli anmelden und weiterlernen. Die Lernplattform für Kinder der 1.-6. Klasse.",
  robots: { index: false },
  alternates: { canonical: "https://www.cleverli.ch/login" },
  openGraph: {
    title: "Anmelden | Cleverli",
    description: "Bei Cleverli anmelden und weiterlernen.",
    images: [{ url: "https://www.cleverli.ch/og-cleverli-primarschule-2026.png", width: 1200, height: 630, alt: "Cleverli – Die Lernplattform für die Primarschule" }],
  },
};

export default function Page() {
  return <Suspense fallback={<main className="min-h-screen bg-green-50 p-10 text-center text-gray-800">Anmeldung wird geladen …</main>}><LoginClient /></Suspense>;
}
