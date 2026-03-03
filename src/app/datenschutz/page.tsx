import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von Cleverli.",
  robots: { index: false },
};

export default function Datenschutz() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Zurück zur Startseite</Link>
      <h1 className="text-3xl font-bold text-gray-900">Datenschutzerklärung</h1>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="font-bold text-gray-900 text-base mb-2">1. Verantwortliche Stelle</h2>
          <p>Cleverli, Schweiz. Kontakt: <a href="mailto:hello@cleverli.ch" className="text-green-600 hover:underline">hello@cleverli.ch</a></p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 text-base mb-2">2. Welche Daten wir sammeln</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li><strong>Lernfortschritt:</strong> Lokal im Browser gespeichert (localStorage), nicht auf unseren Servern.</li>
            <li><strong>Konto (optional):</strong> Name, E-Mail-Adresse beim Erstellen eines Kontos.</li>
            <li><strong>Technische Daten:</strong> Serverlog-Daten (IP, Browser) durch den Hosting-Anbieter Vercel.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 text-base mb-2">3. Cookies &amp; Tag-Management</h2>
          <p className="text-gray-600">Wir verwenden keine Tracking-Cookies für Werbung oder persönliche Profile. Kein Facebook Pixel.</p>
          <p className="text-gray-600 mt-2">Wir setzen <strong>Google Tag Manager (GTM)</strong> als technische Infrastruktur ein. GTM selbst erhebt keine personenbezogenen Daten — es dient als Container für Analyse-Tags (z. B. Google Analytics 4, Google Ads), die nur nach expliziter Konfiguration aktiviert werden. Sofern solche Tags aktiv sind, wird dies in dieser Erklärung aktualisiert.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 text-base mb-2">4. Kinder & Datenschutz</h2>
          <p className="text-gray-600">Cleverli richtet sich an Kinder unter 13 Jahren. Wir erheben bewusst minimale Daten und empfehlen, dass Eltern das Konto für ihre Kinder erstellen. Gemäss DSG (Schweiz) und DSGVO.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 text-base mb-2">5. Deine Rechte</h2>
          <p className="text-gray-600">Du hast das Recht auf Auskunft, Berichtigung und Löschung deiner Daten. Kontaktiere uns unter <a href="mailto:hello@cleverli.ch" className="text-green-600 hover:underline">hello@cleverli.ch</a>.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 text-base mb-2">6. Hosting</h2>
          <p className="text-gray-600">Diese Website wird gehostet bei Vercel Inc., USA. Vercel ist dem EU-US Data Privacy Framework beigetreten.</p>
        </section>

        <p className="text-gray-400 text-xs pt-2">Stand: März 2026</p>
      </div>
    </div>
  );
}
