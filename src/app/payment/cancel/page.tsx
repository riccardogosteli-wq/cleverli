import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zahlung abgebrochen – Cleverli",
  robots: { index: false },
};

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 py-16">
        <div className="text-6xl">😕</div>
        <h1 className="text-2xl font-bold text-gray-800">Zahlung abgebrochen</h1>
        <p className="text-gray-500">
          Kein Problem — du kannst jederzeit ein Abonnement starten.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/api/checkout?plan=monthly"
            className="bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all"
          >
            CHF 9.90/Monat
          </Link>
          <Link
            href="/api/checkout?plan=yearly"
            className="bg-green-700 text-white px-6 py-3 rounded-full font-bold hover:bg-green-800 active:scale-95 transition-all"
          >
            CHF 99/Jahr
          </Link>
        </div>
        <Link href="/dashboard" className="block text-sm text-gray-400 hover:text-gray-600 underline">
          Zurück zum Dashboard
        </Link>
      </div>
    </main>
  );
}
