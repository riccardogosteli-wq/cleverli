import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zahlung erfolgreich – Cleverli",
  robots: { index: false },
};

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 py-16">
        <div className="text-7xl">🎉</div>
        <h1 className="text-3xl font-black text-gray-800">Willkommen bei Cleverli Premium!</h1>
        <p className="text-gray-500 text-lg">
          Dein Abonnement ist aktiv. Du hast jetzt unbegrenzten Zugang zu allen Aufgaben.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-left space-y-2 text-sm text-green-800">
          <div>✅ Alle 50 Aufgaben pro Thema freigeschaltet</div>
          <div>✅ Alle Stufen: Leicht · Mittel · Schwer</div>
          <div>✅ Detaillierte Lernfortschritte</div>
          <div>✅ Elternbereich mit Statistiken</div>
        </div>
        <Link
          href="/dashboard"
          className="inline-block bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 active:scale-95 transition-all shadow-md"
        >
          Jetzt lernen! 🚀
        </Link>
        <p className="text-xs text-gray-400">
          Du erhältst eine Bestätigungs-E-Mail von Payrexx.
        </p>
      </div>
    </main>
  );
}
