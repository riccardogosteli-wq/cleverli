import { Metadata } from "next";
import KidsClient from "./PageClient";

export const metadata: Metadata = {
  title: "Kinder-Dashboard",
  description: "Dein persönliches Lern-Abenteuer auf Cleverli.",
  robots: { index: false, follow: false },
};

export default function KidsPage() {
  return <KidsClient />;
}
