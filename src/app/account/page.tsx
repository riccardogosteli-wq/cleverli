import type { Metadata } from "next";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "Mein Konto – Cleverli",
  description: "Konto verwalten: Passwort, Abonnement und Profileinstellungen.",
  robots: { index: false },
  alternates: { canonical: "https://www.cleverli.ch/account" },
};

export default function Page() {
  return <AccountClient />;
}
