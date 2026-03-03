import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Anmelden – Cleverli",
  description: "Bei Cleverli anmelden und weiterlernen. Die Lernplattform für Schweizer Kinder der 1.–6. Klasse.",
  alternates: { canonical: "https://www.cleverli.ch/login" },
};

export default function Page() {
  return <LoginClient />;
}
