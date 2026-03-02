import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/LangContext";
import Navigation from "@/components/Navigation";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cleverli — Lernen macht Spass",
  description: "Die Lernplattform für Schweizer Kinder der 1.–3. Klasse. Interaktiv, auf Lehrplan 21 abgestimmt.",
  keywords: ["Lernen", "Schule", "Schweiz", "Klasse 1", "Klasse 2", "Klasse 3", "Mathematik", "Deutsch"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${geist.className} bg-green-50 min-h-screen`}>
        <LangProvider>
          <Navigation />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
