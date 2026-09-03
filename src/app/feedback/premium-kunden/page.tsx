import type { Metadata } from "next";
import Link from "next/link";
import FeedbackFormClient from "./FeedbackFormClient";

export const metadata: Metadata = {
  title: "Cleverli Feedback",
  description: "Private Feedback-Seite für Cleverli Premium Familien.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.cleverli.ch/feedback/premium-kunden" },
};

export default function PremiumCustomerFeedbackPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf7] px-4 py-8 text-gray-950 sm:px-6 sm:py-12">
      <style>{`
        body > nav,
        body > div[aria-hidden="true"] {
          display: none !important;
        }
        #main-content {
          padding-bottom: 0 !important;
        }
      `}</style>
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="pt-2">
          <Link href="/" className="inline-flex min-h-11 items-center text-sm font-bold text-green-700 hover:text-green-800">
            Cleverli
          </Link>
          <p className="mt-8 text-sm font-black uppercase tracking-widest text-green-700">Premium Feedback</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-gray-950 sm:text-5xl">
            Was hilft euch wirklich beim Lernen?
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
            Danke, dass ihr Cleverli nutzt. Eure Rückmeldung hilft uns zu verstehen,
            was für Familien schon gut funktioniert und was wir als Nächstes verbessern sollen.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-gray-700">
            <div className="rounded-lg border border-green-100 bg-white p-4">
              <p className="font-bold text-gray-950">Dauert etwa 3 Minuten</p>
              <p className="mt-1">Kurze, ehrliche Antworten reichen völlig.</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="font-bold text-amber-950">Optional: 3 Monate Premium gratis</p>
              <p className="mt-1 text-amber-900">Wer möchte, kann am Ende freiwillig an der Verlosung teilnehmen.</p>
            </div>
          </div>
        </section>

        <FeedbackFormClient />
      </div>
    </main>
  );
}
