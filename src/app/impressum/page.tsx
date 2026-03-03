import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von Cleverli — Lernplattform für Schweizer Kinder.",
  robots: { index: false },
};

export default function Impressum() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Zurück zur Startseite</Link>
      <h1 className="text-3xl font-bold text-gray-900">Impressum</h1>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 text-gray-700">
        <div>
          <h2 className="font-bold text-gray-900 mb-1">Betreiber / Verantwortliche</h2>
          <p>Alexandra Gosteli<br />Langenmooserstrasse 22<br />8467 Truttikon<br />Schweiz 🇨🇭</p>
        </div>
        <div>
          <h2 className="font-bold text-gray-900 mb-1">Kontakt</h2>
          <p>E-Mail: <a href="mailto:hello@cleverli.ch" className="text-green-600 hover:underline">hello@cleverli.ch</a></p>
        </div>
        <div>
          <h2 className="font-bold text-gray-900 mb-1">Haftungsausschluss</h2>
          <p className="text-sm text-gray-500">
            Die Inhalte dieser Website wurden mit grösster Sorgfalt erstellt. 
            Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir keine Gewähr.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-gray-900 mb-1">Urheberrecht</h2>
          <p className="text-sm text-gray-500">
            © 2026 Cleverli. Alle Rechte vorbehalten. Die Inhalte dieser Website sind urheberrechtlich geschützt.
          </p>
        </div>
      </div>
    </div>
  );
}
