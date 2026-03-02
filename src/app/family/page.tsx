import { Metadata } from "next";
import FamilyClient from "./PageClient";

export const metadata: Metadata = {
  title: "Familie",
  description: "Familien-Übersicht auf Cleverli.",
  robots: { index: false, follow: false },
};

export default function FamilyPage() {
  return <FamilyClient />;
}
