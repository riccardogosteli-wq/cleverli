import { withPageSocial } from "@/lib/pageSocialMetadata";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const title = "Kinder zum Lernen motivieren: Ideen für den Alltag";
const description = "Ein Ratgeber für Eltern mit Anregungen zu kleinen Lernschritten, Mitbestimmung, Pausen und einem bewussten Umgang mit Belohnungen.";

export const metadata: Metadata = withPageSocial({
  title,
  description,
  authors: [{ name: "Cleverli", url: "https://www.cleverli.ch" }],
  openGraph: { type: "article" },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.cleverli.ch/blog/kinder-motivieren-zum-lernen",
  },
});

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  image: "https://www.cleverli.ch/og-cleverli-primarschule-2026.png",
  dateModified: "2026-09-08",
  author: {
    "@id": "https://www.cleverli.ch/#organization",
    "@type": "Organization",
    name: "Cleverli",
    url: "https://www.cleverli.ch",
  },
  publisher: {
    "@id": "https://www.cleverli.ch/#organization",
    "@type": "Organization",
    name: "Cleverli",
    logo: {
      "@type": "ImageObject",
      url: "https://www.cleverli.ch/cleverli-logo.svg",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.cleverli.ch/blog/kinder-motivieren-zum-lernen",
  },
  inLanguage: "de-CH",
  about: [
    { "@type": "Thing", name: "Lernmotivation Kinder" },
    { "@type": "Thing", name: "Primarschule Schweiz" },
  ],
};

export default function BlogPost() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 pb-24 sm:pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <nav aria-label="Brotkrümelnavigation" className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-green-700">Startseite</Link>
        <span className="mx-2">›</span>
        <Link href="/blog" className="hover:text-green-700">Blog</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-600">Kinder motivieren</span>
      </nav>

      <header className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-green-700 mb-3">
          Ratgeber für Eltern
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          {title}
        </h1>
        <p className="text-gray-500 text-sm">
          Redaktion: <strong className="text-gray-700">Cleverli</strong>
        </p>
      </header>

      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 mb-8 text-center">
        <Image
          src="/cleverli-sit-read.png"
          alt="Cleverli Maskottchen liest ein Buch"
          width={140}
          height={140}
          className="mx-auto drop-shadow-lg"
        />
      </div>

      <article className="prose prose-green max-w-none space-y-6 text-gray-700 leading-relaxed">
        <p className="text-lg font-medium text-gray-800">
          Wenn dein Kind gerade nicht lernen möchte, braucht es nicht sofort einen neuen Anreiz. Vielleicht ist es müde, versteht die Aufgabe noch nicht oder weiss nicht, wo es anfangen soll. Nimm dir zuerst Zeit, gemeinsam hinzuschauen.
        </p>
        <p>
          Dieser Ratgeber bietet Anregungen für den Alltag mit einem Kind in der Primarschule. Wähle aus, was zu euch passt. Nicht jede Idee hilft jedem Kind, und nicht jede Übungsrunde muss gelingen.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8">Zuerst zuhören</h2>
        <p>
          Frag dein Kind, welcher Teil der Aufgabe gerade schwierig ist. Lass es die Aufgabenstellung in eigenen Worten erklären oder zeigen, wo es nicht weiterkommt. So könnt ihr gemeinsam überlegen, ob eine Erklärung, eine Pause oder ein anderer Einstieg sinnvoll ist.
        </p>
        <p>
          Wenn die Stimmung angespannt ist, unterbrecht die Übungsrunde. Besprecht später in Ruhe, wie es weitergeht. Zuwendung sollte nicht davon abhängen, ob eine Aufgabe richtig gelöst wurde.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8">Mit einem kleinen Schritt beginnen</h2>
        <p>
          Wählt eine überschaubare Aufgabe statt eines ganzen Stapels. Schaut euch zuerst ein Beispiel an oder lest die Aufgabenstellung gemeinsam. Vereinbart vor dem Start, wann ihr eine Pause macht, und passt den Umfang an die Tagesform an.
        </p>
        <p>
          Ein ruhiger Platz und griffbereites Material sind praktische Vorbereitungen. Probiert aus, welche Tageszeit zu eurem Familienalltag passt, ohne die freie Zeit vollständig mit Üben zu füllen.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8">Mitbestimmung ermöglichen</h2>
        <p>
          Wenn die Aufgabe es zulässt, lass dein Kind die Reihenfolge oder das Material mitwählen. Es kann zum Beispiel entscheiden, ob es zuerst mit Zahlen oder mit Wörtern üben möchte. Bleibt dabei bei den vereinbarten Aufgaben und klärt offene Fragen mit der Lehrperson.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8">Anstrengung und Lösungswege wahrnehmen</h2>
        <p>
          Beschreibe konkret, was dir aufgefallen ist: Dein Kind hat die Aufgabe nochmals gelesen, einen anderen Rechenweg ausprobiert oder um Hilfe gebeten. Richte den Blick nicht nur auf richtige Antworten, Noten oder den Vergleich mit anderen Kindern.
        </p>
        <p>
          Schaut bei einem Fehler gemeinsam nach, an welcher Stelle der Lösungsweg unklar wurde. Lass deinem Kind Raum, selbst weiterzudenken, bevor du die Lösung vorgibst.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8">Belohnungen bewusst einsetzen</h2>
        <p>
          Wenn ihr eine Belohnung vereinbart, wählt gemeinsam ein erreichbares Ziel und eine passende Aktivität. Das könnte ein gemeinsames Spiel oder ein Ausflug sein. Solche Ideen sind Beispiele, keine Berichte über bestimmte Familien.
        </p>
        <p>
          Eine Belohnung garantiert weder bessere Leistungen noch dauerhafte Lernfreude. Prüft gemeinsam, ob die Vereinbarung hilfreich ist oder zusätzlichen Druck auslöst. Nicht jede Aufgabe braucht eine Gegenleistung. Gemeinsame Zeit und Anerkennung sollten auch unabhängig vom Lernergebnis Platz haben.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8">Bei anhaltenden Schwierigkeiten Unterstützung suchen</h2>
        <p>
          Wenn das Lernen regelmässig mit grosser Belastung verbunden ist oder Aufgaben dauerhaft unverständlich bleiben, sprich mit der Lehrperson. Beschreibe konkrete Beobachtungen und fragt gemeinsam nach passenden nächsten Schritten. Eine Lernplattform ersetzt diese Begleitung nicht.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8">Cleverli als Ergänzung kennenlernen</h2>
        <p>
          Cleverli bietet Übungen für die Primarschule sowie Funktionen für Fortschritt und persönliche Belohnungen. Wähle Aufgaben, die zum aktuellen Lernstoff passen, und begleite dein Kind bei Bedarf. Ob und wie ihr digitale Übungen nutzt, bleibt eure Entscheidung.
        </p>
        <p className="text-gray-600">
          Für den nächsten Einstieg genügt eine Frage: Welcher kleine Schritt passt heute zu deinem Kind? Plant von dort aus weiter, ohne einen bestimmten Lernerfolg vorauszusetzen.
        </p>
      </article>

      <div className="mt-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-7 text-center space-y-4">
        <Image src="/cleverli-wave.png" alt="Cleverli" width={80} height={80} className="mx-auto drop-shadow" />
        <h3 className="text-xl font-bold text-gray-800">Üben mit Cleverli entdecken</h3>
        <p className="text-sm text-gray-600 max-w-sm mx-auto">
          Informiere dich in Ruhe über die Übungen und die Möglichkeiten von Premium.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup" className="bg-green-700 text-white px-7 py-3 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md">
            Kostenloses Konto erstellen
          </Link>
          <Link href="/upgrade" className="bg-amber-500 text-white px-7 py-3 rounded-full font-bold hover:bg-amber-600 active:scale-95 transition-all">
            Premium ansehen
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="inline-flex min-h-11 items-center px-2 text-sm text-gray-400 hover:text-gray-600 underline">← Zurück zur Startseite</Link>
      </div>
    </main>
  );
}
