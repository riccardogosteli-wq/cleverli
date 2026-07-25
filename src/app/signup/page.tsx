import type { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Kostenlos registrieren – Cleverli",
  description: "Jetzt kostenlos bei Cleverli anmelden. Die ersten 20 Aufgaben gratis — keine Kreditkarte nötig.",
  robots: { index: false },
  alternates: { canonical: "https://www.cleverli.ch/signup" },
  openGraph: {
    title: "Kostenlos registrieren | Cleverli",
    description: "Jetzt kostenlos bei Cleverli anmelden. Die ersten 20 Aufgaben gratis — keine Kreditkarte nötig.",
    images: [{ url: "https://www.cleverli.ch/og-image-v2.png", width: 1200, height: 630, alt: "Cleverli — Lernen macht Spass" }],
  },
};

export default function Page() {
  return <SignupClient />;
}
