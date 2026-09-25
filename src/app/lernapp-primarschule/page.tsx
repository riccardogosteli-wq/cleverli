import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { withPageSocial } from "@/lib/pageSocialMetadata";

export const metadata: Metadata = withPageSocial({
  title: "Lernapp für die Primarschule: Mit Cleverli üben",
  description: "Mathe üben, Texte verstehen und Neues entdecken: Cleverli begleitet Kinder der 1. bis 6. Klasse mit interaktiven Aufgaben für die Schweizer Primarschule.",
  alternates: { canonical: "https://www.cleverli.ch/lernapp-primarschule" },
  robots: { index: true, follow: true },
});
const faqs = [
  { question: "Für welche Klassen ist Cleverli geeignet?", answer: "Cleverli bietet Übungen für die 1. bis 6. Klasse. Ihr wählt die Klasse, das Fach und ein Thema, das dein Kind gerade beschäftigt." },
  { question: "Was kann mein Kind mit Cleverli üben?", answer: "Zur Auswahl stehen Mathematik, Deutsch, Natur, Mensch, Gesellschaft (NMG), Sprachen sowie Medien und Informatik. Die Themenübersicht zeigt euch die Fächer und Aufgaben der jeweiligen Klasse." },
  { question: "Was hilft, wenn mein Kind bei einer Aufgabe nicht weiterkommt?", answer: "Dein Kind kann sich die Aufgabe vorlesen lassen oder einen Tipp öffnen. Nach dem Überprüfen erhält es eine Rückmeldung zu seiner Antwort. Ihr könnt die Aufgabe auch gemeinsam anschauen." },
  { question: "Brauchen wir eine App zum Herunterladen?", answer: "Nein. Cleverli läuft direkt auf cleverli.ch im Browser, auf dem Tablet, Computer oder Handy. Zum Üben braucht ihr eine Internetverbindung." },
  { question: "Kann ich Cleverli wie eine App vom Startbildschirm öffnen?", answer: "Ja. Füge cleverli.ch in Safari auf dem iPhone oder in Chrome auf Android zum Startbildschirm hinzu. Als installierte Web-App kann Cleverli in einem eigenen Fenster ohne die übliche Browserleiste starten. Je nach Gerät und gewählter Option entsteht stattdessen eine Verknüpfung, die den Browser öffnet. Zum Üben braucht ihr weiterhin eine Internetverbindung." },
  { question: "Wo sehe ich die Fortschritte meines Kindes?", answer: "Im Elternbereich findest du den gespeicherten Lernfortschritt deines Kindes. Unter Belohnungen kannst du persönliche Belohnungen festlegen, auf die dein Kind hinarbeiten kann." },
];
const linkClass = "inline-flex min-h-11 items-center py-2 font-semibold text-green-800 underline underline-offset-4";
export default function LearningAppGuide() {
  return <main lang="de" className="bg-white text-gray-900">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }) }} />
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-bold text-green-700">Für Kinder der 1. bis 6. Klasse</p>
      <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">Die Lernapp für die Schweizer Primarschule</h1>
      <p className="mt-6 text-lg leading-8 text-gray-700">Eine Matheaufgabe lösen, einen Text verstehen oder etwas Neues über die Natur entdecken: Mit Cleverli kann dein Kind den Schulstoff zu Hause üben. Interaktive Aufgaben, Tipps und direkte Rückmeldungen begleiten es dabei, Schritt für Schritt und im eigenen Tempo.</p>
      <Link href="/primarschule-uebungen" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-green-700 px-6 py-3 font-bold text-white hover:bg-green-800">Passende Übungen entdecken</Link>
      <nav aria-label="Inhaltsverzeichnis" className="my-8 flex flex-wrap gap-x-5 gap-y-2 rounded-2xl bg-green-50 p-5">
        {[["beispiele", "So übt dein Kind"], ["themen", "Fächer und Themen"], ["eltern", "Für Eltern"], ["startbildschirm", "Auf dem Handy hinzufügen"], ["fragen", "Häufige Fragen"]].map(([id, label]) => <a key={id} className={linkClass} href={'#' + id}>{label}</a>)}
      </nav>
      <section id="beispiele" className="scroll-mt-24">
        <h2 className="text-2xl font-bold">Eine Aufgabe nach der anderen</h2>
        <p className="mt-4 leading-7">Dein Kind wählt eine Antwort, ordnet Begriffe zu oder trägt eine Lösung ein. Ein Tipp hilft beim Weiterdenken. Nach dem Überprüfen sieht es, ob die Antwort stimmt.</p>
        <figure className="mt-6">
          <Image src="/images/seo/mathe-uebung-live.png" alt="Screenshot der interaktiven Matheaufgabe «Was bedeutet 0,5?» in Cleverli" width={1088} height={1454} className="mx-auto h-auto w-full max-w-xl rounded-2xl border border-gray-200" sizes="(min-width:640px) 576px, 100vw" />
          <figcaption className="mt-2 text-sm text-gray-500">Ein Blick in Cleverli: eine Aufgabe zu Dezimalzahlen aus der 5. Klasse.</figcaption>
        </figure>
        <Link className={linkClass} href="/learn/5/math/dezimalzahlen">Diese Matheaufgaben direkt ausprobieren</Link>
      </section>
      <section id="themen" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-bold">Was möchte dein Kind heute üben?</h2>
        <p className="mt-4 leading-7">Wählt eine Klasse und ein Fach. Danach findet ihr die Themen, die gerade zum Unterricht passen oder die dein Kind nochmals anschauen möchte.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["Mathematik", "Zählen, rechnen, Formen erkunden: Von den ersten Zahlen bis zu Brüchen und Dezimalzahlen gibt es viel zu üben.", "/mathe-uebungen-kinder", "Matheübungen entdecken"],
            ["Deutsch", "Wörter untersuchen, Texte verstehen und die Rechtschreibung üben. Dein Kind kann gezielt an einem Thema arbeiten.", "/deutsch-uebungen-kinder", "Deutschübungen entdecken"],
            ["Noch mehr entdecken", "Natur, Mensch, Gesellschaft, Sprachen sowie Medien und Informatik ergänzen die Auswahl. Die Fächer findet ihr bei der jeweiligen Klasse.", "/primarschule-uebungen", "Alle Fächer ansehen"],
          ].map(([title, text, href, label]) => <div key={title} className="rounded-2xl border border-green-100 bg-green-50 p-5"><h3 className="font-bold">{title}</h3><p className="mt-3 text-sm leading-7">{text}</p><Link href={href} className={linkClass}>{label}</Link></div>)}
        </div>
        <p className="mt-5 leading-7">Du möchtest genauer wissen, welche Themen zum Schulstoff gehören? In unserer <Link href="/lehrplanbezug" className="font-semibold text-green-800 underline underline-offset-4">Übersicht zum Lehrplan 21</Link> findest du die Zuordnungen und die passenden Übungen.</p>
        <div className="mt-3 flex flex-col items-start"><Link href="/mathe-uebungen-5-klasse" className={linkClass}>Mathebeispiele für die 5. Klasse ansehen</Link><Link href="/deutsch-uebungen-3-klasse" className={linkClass}>Deutschbeispiele für die 3. Klasse ansehen</Link></div>
      </section>
      <section id="eltern" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-bold">Den Lernweg gemeinsam begleiten</h2>
        <p className="mt-4 leading-7">Manchmal reicht eine kurze Übungsrunde nach den Hausaufgaben. Manchmal möchtet ihr euch gemeinsam Zeit für ein Thema nehmen. Ihr entscheidet, was heute passt.</p>
        <p className="mt-3 leading-7">Im Elternbereich siehst du die gespeicherten Fortschritte deines Kindes. Mit persönlichen Belohnungen könnt ihr euch gemeinsam auf kleine Ziele freuen.</p>
        <Link href="/parents" className={linkClass}>Den Elternbereich kennenlernen</Link>
      </section>
      <section className="mt-12 rounded-2xl bg-green-50 p-6">
        <h2 className="text-2xl font-bold">Einfach losüben</h2>
        <p className="mt-4 leading-7">Cleverli läuft direkt im Browser auf Tablet, Computer und Handy. Öffnet cleverli.ch, wählt ein Thema und probiert die ersten Aufgaben aus. Zum Üben braucht ihr eine Internetverbindung.</p>
        <Link href="/primarschule-uebungen" className={linkClass}>Jetzt Übungen auswählen</Link>
      </section>
      <section id="startbildschirm" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-bold">Cleverli auf dem Handy wie eine App öffnen</h2>
        <p className="mt-4 leading-7">Einmal hinzufügen, danach auf das Cleverli-Symbol tippen: So findet dein Kind die Übungen direkt auf dem Startbildschirm. Ihr braucht dafür keinen Download aus dem App Store oder Play Store.</p>
        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-green-50 p-5">
          <Image src="/murmeli-icon-v3-192.png" alt="Cleverli-App-Symbol mit dem Murmeltier" width={72} height={72} className="rounded-2xl" />
          <p className="text-sm leading-6"><strong>Dieses Symbol sucht ihr danach auf dem Handy.</strong><br />Als Web-App kann Cleverli in einem eigenen Fenster ohne die übliche Browserleiste starten. Eine einfache Verknüpfung öffnet dagegen den Browser.</p>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-green-100 p-5">
            <h3 className="text-xl font-bold">iPhone: mit Safari</h3>
            <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7">
              <li>Öffne <a href="https://www.cleverli.ch/" className="font-semibold text-green-800 underline">cleverli.ch</a> in <strong>Safari</strong>.</li>
              <li>Öffne das Menü zum <strong>Teilen</strong>, erkennbar am Quadrat mit dem Pfeil nach oben. Je nach Safari-Version findest du es im Menü mit den drei Punkten.</li>
              <li>Wähle <strong>«Zu Home-Bildschirm hinzufügen»</strong>. Fehlt der Eintrag, schaue unter «Aktionen bearbeiten» nach.</li>
              <li>Aktiviere <strong>«Als Web-App öffnen»</strong>, falls diese Option angezeigt wird. Bestätige den Namen Cleverli mit <strong>«Hinzufügen»</strong>.</li>
            </ol>
            <a href="https://support.apple.com/de-ch/guide/iphone/iph42ab2f3a7/ios" className={linkClass}>Anleitung von Apple ansehen</a>
          </div>
          <div className="rounded-2xl border border-green-100 p-5">
            <h3 className="text-xl font-bold">Android: mit Chrome</h3>
            <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7">
              <li>Öffne <a href="https://www.cleverli.ch/" className="font-semibold text-green-800 underline">cleverli.ch</a> in <strong>Chrome</strong>.</li>
              <li>Tippe auf das <strong>Menü mit den drei Punkten</strong> neben der Adressleiste.</li>
              <li>Wähle <strong>«Installieren und Verknüpfung erstellen»</strong> und danach <strong>«Installieren»</strong>. Je nach Version heisst der Eintrag auch «App installieren» oder «Zum Startbildschirm hinzufügen».</li>
              <li>Bestätige die angezeigten Schritte. Danach findest du Cleverli bei deinen Apps oder auf dem Startbildschirm.</li>
            </ol>
            <a href="https://support.google.com/chrome/answer/9658361?hl=de&amp;co=GENIE.Platform%3DAndroid" className={linkClass}>Anleitung von Google ansehen</a>
          </div>
        </div>
        <p className="mt-5 text-sm leading-7 text-gray-600">Öffne Cleverli anschliessend über das neue Symbol. Die Menüs und das Aussehen können je nach Handy und Browser-Version abweichen. Wenn du den Link in WhatsApp oder einer anderen App geöffnet hast, wechsle zuerst zu Safari oder Chrome. Zum Üben braucht ihr weiterhin eine Internetverbindung.</p>
      </section>
      <section id="fragen" className="mt-12 scroll-mt-24"><h2 className="text-2xl font-bold">Häufige Fragen zur Lernapp</h2><div className="mt-5 space-y-3">{faqs.map(f => <details key={f.question} className="rounded-2xl border border-gray-200 p-5"><summary className="cursor-pointer py-2 font-bold">{f.question}</summary><p className="mt-3 leading-7 text-gray-700">{f.answer}</p></details>)}</div></section>
      <aside className="mt-12 border-t border-green-100 pt-6"><h2 className="text-xl font-bold">Mehr über Cleverli</h2><div className="mt-3 flex flex-col items-start"><Link href="/" className={linkClass}>Cleverli kennenlernen</Link><Link href="/lehrpersonen" className={linkClass}>Cleverli für Lehrpersonen</Link><Link href="/upgrade" className={linkClass}>Premium und Preise</Link><Link href="/datenschutz" className={linkClass}>Datenschutz</Link><Link href="/impressum" className={linkClass}>Kontakt und Impressum</Link></div></aside>
    </article>
  </main>;
}
