"use client";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import { useState } from "react";

const TESTIMONIALS = [
  { name: "Sandra M.", city: "Zürich", text: "Meine Tochter übt jeden Abend freiwillig Mathe — das hätte ich nie gedacht! Cleverli macht Lernen wirklich Spass.", stars: 5 },
  { name: "Patrick K.", city: "Bern", text: "Endlich eine Schweizer Plattform, die auf den Lehrplan 21 abgestimmt ist. Mein Sohn ist in der 2. Klasse und liebt die Aufgaben.", stars: 5 },
  { name: "Léa D.", city: "Lausanne", text: "Super intuitiv, auch für jüngere Kinder. Die Hinweise helfen, ohne einfach die Antwort zu verraten.", stars: 5 },
];

const FAQS = [
  { q: "Kann ich Cleverli kostenlos ausprobieren?", a: "Ja! Die ersten 3 Aufgaben pro Thema kannst du immer kostenlos testen — ganz ohne Anmeldung oder Kreditkarte. Gefällt es dir, kannst du ein Abo abschliessen, um alle Aufgaben freizuschalten." },
  { q: "Für welche Klassen ist Cleverli?", a: "Aktuell decken wir die 1., 2. und 3. Klasse ab (Schweizer Lehrplan 21, alle Kantone). Weitere Klassen folgen." },
  { q: "Wie kündige ich das Abo?", a: "Jederzeit — kein Mindestabo, keine Kündigungsfrist. Einfach in den Einstellungen kündigen, du wirst nicht automatisch verlängert ohne dein Einverständnis." },
  { q: "Brauche ich eine App herunterladen?", a: "Nein! Cleverli läuft direkt im Browser — auf Handy, Tablet und Computer. Einfach die Website öffnen und loslegen, nichts installieren nötig." },
  { q: "In welchen Sprachen ist Cleverli verfügbar?", a: "Deutsch, Français, Italiano und English. Einfach oben rechts die Flagge wählen — die Benutzeroberfläche wechselt sofort." },
];

export default function Home() {
  const { tr } = useLang();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white">
      {/* Banner */}
      <div className="bg-green-600 text-white text-center py-2 text-sm font-medium tracking-wide">
        🇨🇭 Lehrplan 21 &nbsp;·&nbsp; 🏅 Von Lehrern empfohlen &nbsp;·&nbsp; 🎮 Über 150 Übungen
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-yellow-50 px-6 pt-12 pb-16">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-8">
          {/* Mascot */}
          <div className="flex-shrink-0 relative">
            <Image src="/cleverli-wave.png" alt="Cleverli" width={220} height={220}
              className="drop-shadow-xl animate-bounce-slow" style={{animation:"cleverli-jump 2.5s ease-in-out infinite"}} priority />
            <style>{`@keyframes cleverli-jump{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
          </div>
          {/* Text */}
          <div className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              {tr("heroTitle1")}<br />
              <span className="text-green-600">{tr("heroTitle2")}</span>
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-lg">{tr("subtitle").split("\n")[0]}</p>
            <p className="mt-1 text-sm text-gray-400">{tr("subtitle").split("\n")[1]}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
              <Link href="/dashboard" className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-green-700 transition-colors shadow-md">
                {tr("startFree")} →
              </Link>
              <Link href="/signup" className="border-2 border-green-600 text-green-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-50 transition-colors">
                Konto erstellen
              </Link>
            </div>
            <p className="mt-3 text-xs text-gray-400">{tr("freeNote")}</p>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">{tr("subjectsTitle")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { emoji: "🔢", key: "math", color: "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100" },
              { emoji: "📖", key: "german", color: "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100" },
              { emoji: "🌍", key: "science", color: "bg-green-50 border-green-200 text-green-800 hover:bg-green-100" },
              { emoji: "🎨", key: "moreSoon", color: "bg-purple-50 border-purple-200 text-purple-800" },
            ].map((s) => (
              <div key={s.key} className={`border-2 rounded-2xl p-5 text-center transition-colors cursor-default ${s.color}`}>
                <div className="text-4xl mb-2">{s.emoji}</div>
                <div className="font-semibold text-sm">{tr(s.key)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — with mascot poses */}
      <section className="bg-green-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">{tr("howTitle")}</h2>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { step: "1", titleKey: "step1title", descKey: "step1desc", img: "/cleverli-sit-read.png" },
              { step: "2", titleKey: "step2title", descKey: "step2desc", img: "/cleverli-celebrate.png" },
              { step: "3", titleKey: "step3title", descKey: "step3desc", img: "/cleverli-think.png" },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-3 bg-white rounded-2xl p-6 shadow-sm">
                <Image src={item.img} alt="" width={100} height={100} className="drop-shadow-md" />
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">{item.step}</div>
                <h3 className="font-bold text-gray-800">{tr(item.titleKey)}</h3>
                <p className="text-gray-500 text-sm">{tr(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">{tr("pricingTitle")}</h2>
          <p className="text-center text-gray-400 text-sm mb-10">Die ersten 3 Aufgaben pro Thema kannst du immer kostenlos ausprobieren.</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Trial */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-1">
                <Image src="/cleverli-run.png" alt="" width={50} height={50} />
                <div className="text-3xl font-bold text-gray-900">{tr("free")}</div>
              </div>
              <div className="text-gray-400 text-sm mb-6">{tr("forever")}</div>
              <ul className="text-sm text-gray-600 space-y-2 flex-1">
                <li>✅ {tr("freeF1")}</li>
                <li>✅ {tr("freeF2")}</li>
                <li>✅ {tr("freeF3")}</li>
                <li>✅ {tr("freeF4")}</li>
              </ul>
              <Link href="/dashboard" className="mt-6 block text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                {tr("startFree")}
              </Link>
            </div>
            {/* Premium */}
            <div className="bg-green-600 rounded-2xl p-8 border-2 border-green-600 shadow-lg text-white flex flex-col relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">⭐ Beliebt</div>
              <div className="flex items-center gap-3 mb-1">
                <Image src="/cleverli-jump-star.png" alt="" width={50} height={50} />
                <div className="text-3xl font-bold">CHF 9.90<span className="text-lg font-normal">{tr("perMonth")}</span></div>
              </div>
              <div className="text-green-200 text-sm mb-6">{tr("yearlyNote")}</div>
              <ul className="text-sm space-y-2 flex-1">
                <li>✅ {tr("premiumF1")}</li>
                <li>✅ {tr("premiumF2")}</li>
                <li>✅ {tr("premiumF3")}</li>
                <li>✅ {tr("premiumF4")}</li>
              </ul>
              <Link href="/signup" className="mt-6 block text-center bg-white text-green-700 px-6 py-3 rounded-full font-bold hover:bg-green-50 transition-colors">
                Jetzt starten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-green-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
            <Image src="/cleverli-wave.png" alt="" width={100} height={100} className="drop-shadow-md shrink-0" />
            <h2 className="text-2xl font-bold text-gray-800">Was Eltern sagen 💬</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-yellow-400 text-lg mb-3">{"⭐".repeat(t.stars)}</div>
                <p className="text-gray-600 text-sm italic mb-4">&ldquo;{t.text}&rdquo;</p>
                <p className="text-sm font-semibold text-gray-800">{t.name} · {t.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8 justify-center">
            <Image src="/cleverli-think.png" alt="" width={70} height={70} className="drop-shadow-md" />
            <h2 className="text-2xl font-bold text-gray-800">Häufige Fragen</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-2 border-gray-100 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 font-semibold text-gray-800 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <span>{faq.q}</span>
                  <span className="text-green-600 text-xl ml-3 shrink-0">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-green-600 py-12 px-6 text-center text-white">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-6 justify-center">
          <Image src="/cleverli-jump-star.png" alt="" width={100} height={100} className="drop-shadow-lg" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Bereit zum Ausprobieren?</h2>
            <p className="text-green-100 mb-4">Keine Anmeldung nötig — einfach loslegen!</p>
            <Link href="/dashboard" className="inline-block bg-white text-green-700 px-8 py-3 rounded-full font-bold hover:bg-green-50 transition-colors shadow-md">
              {tr("startFree")} →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-green-700">cleverli</span>
            <span>· Schweiz 🇨🇭</span>
          </div>
          <div className="flex gap-4">
            <Link href="/impressum" className="hover:text-gray-600">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-gray-600">Datenschutz</Link>
            <Link href="mailto:hello@cleverli.ch" className="hover:text-gray-600">Kontakt</Link>
          </div>
          <p>© 2026 Cleverli</p>
        </div>
      </footer>
    </main>
  );
}
