import Link from "next/link";
import { Metadata } from "next";
import ImpressumClient from "./ImpressumClient";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von Cleverli — Lernplattform für Kinder.",
  robots: { index: false },
};

export default function Impressum() {
  return <ImpressumClient />;
}
