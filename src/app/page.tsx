import CleverliMascot from "@/components/CleverliMascot";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-green-700">cleverli</span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">beta</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Anmelden / Login</Link>
          <Link href="/signup" className="text-sm bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors">
            Kostenlos starten
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-12 pb-16 max-w-4xl mx-auto">
        <CleverliMascot size={180} />
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
          Lernen macht Spass —<br />
          <span className="text-green-600">mit Cleverli!</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
          Die Lernplattform für Schweizer Kinder der 1.–3. Klasse.<br />
          Interaktiv · Auf Lehrplan 21 abgestimmt · Auf Deutsch, Français, Italiano & English
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup" className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors">
            Jetzt kostenlos lernen
          </Link>
          <Link href="/learn" className="border-2 border-green-600 text-green-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-50 transition-colors">
            Demo ansehen
          </Link>
        </div>
        <p className="mt-3 text-sm text-gray-400">Klassen 1–2 komplett kostenlos · Kein Kreditkarte nötig</p>
      </section>

      {/* Subjects */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Was lernt Cleverli heute? 🎒</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { emoji: "🔢", name: "Mathematik", color: "bg-blue-50 border-blue-200 text-blue-700" },
              { emoji: "📖", name: "Deutsch", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
              { emoji: "🌍", name: "Sachkunde", color: "bg-green-50 border-green-200 text-green-700" },
              { emoji: "🎨", name: "Mehr bald...", color: "bg-purple-50 border-purple-200 text-purple-700" },
            ].map((s) => (
              <div key={s.name} className={`border-2 rounded-2xl p-5 text-center ${s.color}`}>
                <div className="text-4xl mb-2">{s.emoji}</div>
                <div className="font-semibold text-sm">{s.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">So funktioniert&apos;s</h2>
        <div className="grid sm:grid-cols-3 gap-8 text-center">
          {[
            { step: "1", title: "Klasse wählen", desc: "Dein Kind wählt seine Klasse und sein Fach.", emoji: "🎯" },
            { step: "2", title: "Üben & spielen", desc: "Interaktive Übungen, Spiele und Hinweise auf Knopfdruck.", emoji: "🎮" },
            { step: "3", title: "Fortschritt verfolgen", desc: "Eltern sehen den Lernstand auf dem Dashboard.", emoji: "📊" },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold">{item.step}</div>
              <div className="text-4xl">{item.emoji}</div>
              <h3 className="font-bold text-gray-800">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-green-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-10">Einfache Preise</h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">Gratis</div>
              <div className="text-gray-400 text-sm mt-1">Für immer</div>
              <ul className="mt-6 text-left text-sm text-gray-600 space-y-2">
                <li>✅ Alle Klasse-1-Inhalte</li>
                <li>✅ Alle Klasse-2-Inhalte</li>
                <li>✅ Kein Abo nötig</li>
              </ul>
              <Link href="/signup" className="mt-6 block text-center bg-gray-100 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                Kostenlos starten
              </Link>
            </div>
            <div className="bg-green-600 rounded-2xl p-8 border-2 border-green-600 shadow-sm text-white">
              <div className="text-3xl font-bold">CHF 9.90<span className="text-lg font-normal">/Mt.</span></div>
              <div className="text-green-200 text-sm mt-1">Jahresabo CHF 118.80</div>
              <ul className="mt-6 text-left text-sm space-y-2">
                <li>✅ Alle Inhalte 1.–3. Klasse</li>
                <li>✅ Eltern-Dashboard</li>
                <li>✅ Bis zu 3 Kinder</li>
                <li>✅ TWINT & PayPal</li>
              </ul>
              <Link href="/signup" className="mt-6 block text-center bg-white text-green-700 px-6 py-2 rounded-full font-semibold hover:bg-green-50 transition-colors">
                Jetzt starten
              </Link>
            </div>
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
