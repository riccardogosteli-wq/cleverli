import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Wie ich meinen Sohn wieder fürs Lernen begeistert habe — Cleverli Blog",
  description: "Als Elternteil kenne ich die Frustration: Das Kind sitzt am Tisch, will aber einfach nicht lernen. Hier teile ich, was bei uns wirklich geholfen hat.",
  openGraph: {
    title: "Wie ich meinen Sohn wieder fürs Lernen begeistert habe",
    description: "Als Elternteil kenne ich die Frustration: Das Kind sitzt am Tisch, will aber einfach nicht lernen. Hier teile ich, was bei uns wirklich geholfen hat.",
    images: [{ url: "https://www.cleverli.ch/og-image.png" }],
  },
  robots: { index: true, follow: true },
};

export default function BlogPost() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 pb-24 sm:pb-12">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-green-600">Startseite</Link>
        <span className="mx-2">›</span>
        <Link href="/blog" className="hover:text-green-600">Blog</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-600">Kinder motivieren</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-3">
          Eltern-Erfahrungsbericht
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          «Ich will nicht lernen!» — Wie ich meinen Sohn wieder fürs Lernen begeistert habe
        </h1>
        <p className="text-gray-500 text-sm">
          Von <strong className="text-gray-700">Alexandra Gosteli</strong> · Mutter von zwei Kindern · Cleverli-Gründerin
        </p>
      </header>

      {/* Hero illustration */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 mb-8 text-center">
        <Image
          src="/cleverli-sit-read.png"
          alt="Cleverli Maskottchen lernt"
          width={140}
          height={140}
          className="mx-auto drop-shadow-lg"
        />
      </div>

      {/* Content */}
      <article className="prose prose-green max-w-none space-y-6 text-gray-700 leading-relaxed">

        <p className="text-lg font-medium text-gray-800">
          Es war ein Dienstagabend. Mein Sohn Luca, damals in der zweiten Klasse, sass vor seinen Mathe-Hausaufgaben und schaute mich mit diesem Blick an — ihr kennt ihn. Der Blick, der sagt: «Bitte nicht.»
        </p>

        <p>
          Ich bin Mutter von zwei Schulkindern und gleichzeitig Mitgründerin von Cleverli. Man könnte meinen, ich hätte die perfekte Antwort auf die Frage parat: <em>Wie bringe ich mein Kind dazu, gerne zu lernen?</em> Aber ehrlich gesagt war ich damals genauso ratlos wie viele andere Eltern.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8">Das Problem: Lernen fühlt sich wie Strafe an</h2>

        <p>
          Das Kernproblem ist einfach erklärt: Für die meisten Kinder ist Lernen eine Pflicht. Es konkurriert mit Spielen, YouTube, Freunden. Und Pflicht verliert gegen Spass fast immer.
        </p>

        <p>
          Was ich bei Luca beobachtet habe: Er brauchte keine Erklärung, warum Mathe wichtig ist. Er brauchte <strong>einen Grund, der ihm jetzt, in diesem Moment, etwas bedeutet.</strong>
        </p>

        <blockquote className="border-l-4 border-green-400 pl-4 italic text-gray-600 bg-green-50 rounded-r-xl py-3 pr-4">
          «Mama, wenn ich 20 Aufgaben löse, darf ich dann ins Schwimmbad?»<br />
          <span className="text-sm not-italic text-gray-500 mt-1 block">— Luca, 7 Jahre</span>
        </blockquote>

        <p>
          Das war der Moment, der alles verändert hat. Nicht ein pädagogisches Konzept, nicht ein neues Arbeitsheft. Sondern eine simple Frage meines Sohnes: <em>Was bekomme ich dafür?</em>
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8">Belohnungen: Falsch verstanden von fast allen</h2>

        <p>
          Wenn ich Eltern vom Belohnungs-System erzähle, kommt oft sofort: «Aber soll mein Kind nicht aus innerer Motivation lernen?» Klar, das ist das Ziel. Aber innere Motivation ist etwas, das wächst — durch positive Erfahrungen, durch das Gefühl von Kompetenz, durch kleine Erfolge, die sich aufschichten.
        </p>

        <p>
          Belohnungen sind nicht das Gegenteil von innerer Motivation. Sie sind die <strong>Brücke dahin.</strong>
        </p>

        <p>
          Das Entscheidende: Die Belohnung muss <em>echt</em> sein. Kein «gut gemacht», das nach dem dritten Mal hohl klingt. Sondern etwas, worauf das Kind wirklich wartet. Ein Ausflug. Ein gemeinsames Spiel. Glace essen gehen. Dinge, die für das Kind zählen.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8">Was wir in Cleverli eingebaut haben — und warum</h2>

        <p>
          Als wir Cleverli entwickelt haben, stand diese Erkenntnis im Mittelpunkt: <strong>Kinder brauchen ein Ziel, das sie sehen können.</strong> Nicht abstrakt («du wirst später froh sein»), sondern konkret und jetzt.
        </p>

        <p>
          Das Belohnungs-System in Cleverli funktioniert so: Als Elternteil legst du eine echte Belohnung fest — zum Beispiel «Ausflug in den Zoo» oder «Extra Spielzeit». Du bestimmst, wie viele Aufgaben dein Kind dafür lösen muss. Dein Kind sieht jeden Tag, wie nah es dem Ziel ist.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 my-6">
          <p className="text-sm font-bold text-amber-800 mb-3">🎯 Wie es in der Praxis aussieht:</p>
          <ul className="space-y-2 text-sm text-amber-900">
            <li>🦁 <strong>Ziel:</strong> «Zoo-Besuch» — 30 Aufgaben lösen</li>
            <li>📊 <strong>Fortschritt:</strong> Luca sieht täglich: «18 von 30 — noch 12!»</li>
            <li>✅ <strong>Ergebnis:</strong> Er öffnet Cleverli von sich aus. Ohne dass ich fragen muss.</li>
          </ul>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mt-8">Was sich bei uns verändert hat</h2>

        <p>
          Ich werde ehrlich sein: Die ersten Wochen war der Zoo-Ausflug der Hauptantrieb. Luca rechnete jeden Abend, wie viele Aufgaben er noch brauchte. Er fragte morgens beim Frühstück, ob er noch schnell eine machen darf.
        </p>

        <p>
          Dann kam etwas Interessantes: Er fing an, Spass an den Aufgaben selbst zu haben. Die Trophäen, die er sammelte. Das Gefühl, Level aufzusteigen. Das tägliche Streak-Feuer. <strong>Die äussere Motivation hatte eine innere geweckt.</strong>
        </p>

        <p>
          Heute, ein Jahr später, lernt Luca regelmässig ohne Belohnungs-Ziel. Aber der Start war der Zoo.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8">Drei Tipps aus unserer Erfahrung</h2>

        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="font-bold text-gray-800 mb-1">1. Lass dein Kind die Belohnung mitbestimmen</p>
            <p className="text-sm text-gray-600">Was du schön findest, zählt nicht. Was dein Kind will, zählt. Frag es direkt: «Was würdest du dir am meisten wünschen?» Die Antworten überraschen oft.</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="font-bold text-gray-800 mb-1">2. Halte die Ziele erreichbar, aber nicht trivial</p>
            <p className="text-sm text-gray-600">20–30 Aufgaben für eine mittelgrosse Belohnung ist ein guter Rahmen. Zu einfach = kein Wert. Zu schwer = Frustration. Passt es an, wenn ihr merkt, es klappt nicht.</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="font-bold text-gray-800 mb-1">3. Feiert den Fortschritt, nicht nur das Ziel</p>
            <p className="text-sm text-gray-600">«Du hast heute schon 3 Aufgaben gemacht — super!» ist mächtiger als Schweigen bis zur Zielerreichung. Anerkennung auf dem Weg ist Treibstoff.</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mt-8">Eine letzte Sache</h2>

        <p>
          Wir sind Eltern, die dieses System für unsere eigenen Kinder entwickelt haben. Nicht Pädagogen, die theoretisch wissen, was funktioniert — sondern Eltern, die es ausprobiert, angepasst und dann in eine App verwandelt haben.
        </p>

        <p>
          Wenn du das nächste Mal vor einem Kind sitzt, das einfach nicht will: Frag nicht «Warum lernst du nicht?» Frag: «Worauf freust du dich gerade am meisten?» Die Antwort ist dein Einstieg.
        </p>

        <p className="text-gray-500 italic">
          — Alexandra
        </p>
      </article>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-7 text-center space-y-4">
        <Image src="/cleverli-wave.png" alt="Cleverli" width={80} height={80} className="mx-auto drop-shadow" />
        <h3 className="text-xl font-bold text-gray-800">Probier das Belohnungs-System aus</h3>
        <p className="text-sm text-gray-600 max-w-sm mx-auto">Kostenlos starten — die ersten 5 Aufgaben pro Thema sind immer gratis.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="bg-green-600 text-white px-7 py-3 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md"
          >
            Kostenlos starten 🚀
          </Link>
          <Link
            href="/upgrade"
            className="bg-amber-500 text-white px-7 py-3 rounded-full font-bold hover:bg-amber-600 active:scale-95 transition-all"
          >
            ⭐ Premium & Belohnungen
          </Link>
        </div>
      </div>

      {/* Back to home */}
      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 underline">← Zurück zur Startseite</Link>
      </div>

    </main>
  );
}
