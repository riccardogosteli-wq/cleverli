"use client";
import CleverliMascot from "@/components/CleverliMascot";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import { useState } from "react";

const TESTIMONIALS = [
  { name: "Sandra M.", city: "Zürich", text: "Meine Tochter übt jeden Abend freiwillig Mathe — das hätte ich nie gedacht! Cleverli macht Lernen wirklich Spass.", stars: 5 },
  { name: "Patrick K.", city: "Bern", text: "Endlich eine Schweizer Plattform, die auf den Lehrplan 21 abgestimmt ist. Mein Sohn ist in der 2. Klasse und liebt die Aufgaben.", stars: 5 },
  { name: "Léa D.", city: "Lausanne", text: "Super intuitiv, auch für jüngere Kinder. Die Hinweise helfen, ohne einfach die Antwort zu verraten.", stars: 5 },
];

const FAQS = [
  { q: "Ist Cleverli wirklich kostenlos?", a: "Ja! Die ersten 3 Aufgaben pro Thema sind immer kostenlos — ohne Kreditkarte. So kannst du alles in Ruhe ausprobieren." },
  { q: "Für welche Klassen ist Cleverli?", a: "Aktuell decken wir die 1., 2. und 3. Klasse ab (Lehrplan 21). Die 4.–6. Klasse folgt bald." },
  { q: "Wie kündige ich das Abo?", a: "Jederzeit — kein Mindestabo, keine Kündigungsfrist. Einfach in den Einstellungen kündigen." },
  { q: "Gibt es eine App?", a: "Cleverli läuft direkt im Browser — auf Handy, Tablet und Computer. Eine native App ist in Planung." },
  { q: "In welchen Sprachen ist Cleverli verfügbar?", a: "Deutsch, Français, Italiano und English — einfach oben rechts die Flagge wählen." },
];

export default function Home() {
  const { tr } = useLang();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Banner */}
      <div className="bg-green-600 text-white text-center py-2 text-sm font-medium">
        🇨🇭 Lehrplan 21 &nbsp;·&nbsp; 🏅 Von Lehrern empfohlen &nbsp;·&nbsp; 🎮 Über 150 Übungen
      </div>
      {/* Hero */}
      <section className="text-center px-6 pt-10 pb-16 max-w-4xl mx-auto">
        <CleverliMascot size={180} />
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
          {tr("heroTitle1")}<br /><span className="text-green-600">{tr("heroTitle2")}</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto whitespace-pre-line">{tr("subtitle")}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup" className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors">
            {tr("startFree")}
          </Link>
          <Link href="/dashboard" className="border-2 border-green-600 text-green-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-50 transition-colors">
            {tr("watchDemo")}
          </Link>
        </div>
        <p className="mt-3 text-sm text-gray-400">{tr("freeNote")}</p>
      </section>

      {/* Subjects */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">{tr("subjectsTitle")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { emoji: "🔢", key: "math", color: "bg-blue-50 border-blue-200 text-blue-700" },
              { emoji: "📖", key: "german", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
              { emoji: "🌍", key: "science", color: "bg-green-50 border-green-200 text-green-700" },
              { emoji: "🎨", key: "moreSoon", color: "bg-purple-50 border-purple-200 text-purple-700" },
            ].map((s) => (
              <div key={s.key} className={`border-2 rounded-2xl p-5 text-center ${s.color}`}>
                <div className="text-4xl mb-2">{s.emoji}</div>
                <div className="font-semibold text-sm">{tr(s.key)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">{tr("howTitle")}</h2>
        <div className="grid sm:grid-cols-3 gap-8 text-center">
          {[
            { step: "1", titleKey: "step1title", descKey: "step1desc", emoji: "🎯" },
            { step: "2", titleKey: "step2title", descKey: "step2desc", emoji: "🎮" },
            { step: "3", titleKey: "step3title", descKey: "step3desc", emoji: "📊" },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold">{item.step}</div>
              <div className="text-4xl">{item.emoji}</div>
              <h3 className="font-bold text-gray-800">{tr(item.titleKey)}</h3>
              <p className="text-gray-500 text-sm">{tr(item.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-green-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-10">{tr("pricingTitle")}</h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">{tr("free")}</div>
              <div className="text-gray-400 text-sm mt-1">{tr("forever")}</div>
              <ul className="mt-6 text-left text-sm text-gray-600 space-y-2">
                <li>✅ {tr("freeF1")}</li>
                <li>✅ {tr("freeF2")}</li>
                <li>✅ {tr("freeF3")}</li>
                <li>✅ {tr("freeF4")}</li>
              </ul>
              <Link href="/signup" className="mt-6 block text-center bg-gray-100 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                {tr("startFree")}
              </Link>
            </div>
            <div className="bg-green-600 rounded-2xl p-8 border-2 border-green-600 shadow-sm text-white">
              <div className="text-3xl font-bold">CHF 9.90<span className="text-lg font-normal">{tr("perMonth")}</span></div>
              <div className="text-green-200 text-sm mt-1">{tr("yearlyNote")}</div>
              <ul className="mt-6 text-left text-sm space-y-2">
                <li>✅ {tr("premiumF1")}</li>
                <li>✅ {tr("premiumF2")}</li>
                <li>✅ {tr("premiumF3")}</li>
                <li>✅ {tr("premiumF4")}</li>
              </ul>
              <Link href="/signup" className="mt-6 block text-center bg-white text-green-700 px-6 py-2 rounded-full font-semibold hover:bg-green-50 transition-colors">
                {tr("startFree")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Was Eltern sagen 💬</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-yellow-400 text-lg mb-3">{"⭐".repeat(t.stars)}</div>
              <p className="text-gray-600 text-sm italic mb-4">&ldquo;{t.text}&rdquo;</p>
              <p className="text-sm font-semibold text-gray-800">{t.name} · {t.city}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Häufige Fragen</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 font-semibold text-gray-800 flex justify-between items-center hover:bg-gray-50">
                  {faq.q}
                  <span className="text-green-600 text-xl">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-gray-500 text-sm">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-400">
        <p>© 2026 Cleverli · Schweiz 🇨🇭 · <Link href="/impressum" className="hover:text-gray-600">Impressum</Link> · <Link href="/datenschutz" className="hover:text-gray-600">Datenschutz</Link></p>
      </footer>
    </main>
  );
}
