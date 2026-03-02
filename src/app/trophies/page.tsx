import { Metadata } from "next";
import TrophiesClient from "./PageClient";

export const metadata: Metadata = {
  title: "Trophäen",
  description: "Deine Trophäen und Erfolge auf Cleverli.",
  robots: { index: false, follow: false },
};

export default function TrophiesPage() {
  return <TrophiesClient />;
}
