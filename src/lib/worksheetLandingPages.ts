export type WorksheetLandingPage = {
  slug: string;
  grade: number;
  subject: "Mathematik" | "Deutsch";
  topic: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  explanationTitle: string;
  explanation: string[];
  examples: { label: string; text: string }[];
  practises: string[];
  premiumTopics: string[];
  exerciseHref: string;
  exerciseLabel: string;
  worksheetHref: string;
  worksheetDownload: string;
  solutionHref: string;
  solutionDownload: string;
  previewHref: string;
  previewAlt: string;
  previewWidth?: number;
  previewHeight?: number;
  curriculumCode: string;
  curriculumScope: string;
  curriculumUrl?: string;
};

export const worksheetLandingPages: WorksheetLandingPage[] = [
  {
    slug: "buchstaben-1-klasse",
    grade: 1,
    subject: "Deutsch",
    topic: "Buchstaben",
    eyebrow: "Deutsch · 1. Klasse",
    title: "Buchstaben Arbeitsblatt für die 1. Klasse",
    description: "Buchstaben lernen in der 1. Klasse: kostenloses Arbeitsblatt als PDF mit separater Lösung, einfachen Beispielen und passender Onlineübung.",
    intro: "Grossbuchstaben, Kleinbuchstaben und erste Laute lassen sich mit kurzen Aufgaben gut festigen. Dieses kostenlose Arbeitsblatt bietet einen ruhigen Einstieg für zu Hause oder den Unterricht.",
    explanationTitle: "Buchstaben Schritt für Schritt kennenlernen",
    explanation: [
      "Kinder begegnen Buchstaben zuerst als Form und Laut. Hilfreich ist, einen Grossbuchstaben direkt mit seinem Kleinbuchstaben zu verbinden und den Laut gemeinsam auszusprechen.",
      "Bei Anlauten wird der erste hörbare Laut eines Wortes gesucht. Das stärkt die Verbindung zwischen gesprochener und geschriebener Sprache.",
    ],
    examples: [
      { label: "Gross und klein", text: "M gehört zu m." },
      { label: "Anlaut", text: "Maus beginnt mit M." },
    ],
    practises: ["Grossbuchstaben und Kleinbuchstaben zuordnen", "Buchstaben leserlich schreiben", "Den ersten Laut einfacher Wörter erkennen"],
    premiumTopics: ["ABC Reihenfolge", "Vokale und Konsonanten", "Einfache Wörter"],
    exerciseHref: "/learn/1/german/buchstaben",
    exerciseLabel: "Buchstaben online üben",
    worksheetHref: "/worksheets/buchstaben-1-klasse-arbeitsblatt.pdf",
    worksheetDownload: "Cleverli-Buchstaben-1-Klasse-Arbeitsblatt.pdf",
    solutionHref: "/worksheets/buchstaben-1-klasse-loesungen.pdf",
    solutionDownload: "Cleverli-Buchstaben-1-Klasse-Loesungen.pdf",
    previewHref: "/worksheets/buchstaben-1-klasse.png",
    previewAlt: "Vorschau des Cleverli Buchstaben Arbeitsblatts für die 1. Klasse",
    previewWidth: 778,
    previewHeight: 1100,
    curriculumCode: "D.4.A.1",
    curriculumScope: "Gross- und Kleinbuchstaben schreiben und Anfangslaute passenden Buchstaben zuordnen.",
    curriculumUrl: "https://v-fe.lehrplan.ch/index.php?code=a|1|11|4|1|1",
  },
  {
    slug: "einmaleins-2-klasse",
    grade: 2,
    subject: "Mathematik",
    topic: "Einmaleins",
    eyebrow: "Mathematik · 2. Klasse",
    title: "Einmaleins Arbeitsblatt für die 2. Klasse",
    description: "Einmaleins Arbeitsblatt für die 2. Klasse: 2er, 5er und 10er Reihe als kostenloses PDF mit Lösung und passender Onlineübung.",
    intro: "Die 2er, 5er und 10er Reihe bilden einen verständlichen Einstieg ins Einmaleins. Das kostenlose Arbeitsblatt verbindet wiederholtes Addieren mit ersten Malaufgaben.",
    explanationTitle: "Einmaleins mit Reihen verstehen",
    explanation: [
      "Eine Malaufgabe fasst gleich grosse Gruppen zusammen. Statt 4 + 4 + 4 + 4 + 4 zu schreiben, kann man 5 × 4 rechnen.",
      "Die 2er, 5er und 10er Reihe lassen sich gut durch Zählen in gleich grossen Schritten entdecken. Erst verstehen, dann wiederholen, so bleiben die Reihen besser hängen.",
    ],
    examples: [
      { label: "5er Reihe", text: "5 × 4 = 4 + 4 + 4 + 4 + 4 = 20" },
      { label: "Tauschaufgabe", text: "2 × 3 = 3 × 2 = 6" },
    ],
    practises: ["2er, 5er und 10er Reihe", "Malaufgaben als wiederholte Addition", "Einfache Tauschaufgaben"],
    premiumTopics: ["Einmaleins 3er und 4er", "Sachaufgaben", "Addition und Subtraktion bis 100"],
    exerciseHref: "/learn/2/math/einmaleins",
    exerciseLabel: "Einmaleins online üben",
    worksheetHref: "/worksheets/einmaleins-2-klasse-arbeitsblatt.pdf",
    worksheetDownload: "Cleverli-Einmaleins-2-Klasse-Arbeitsblatt.pdf",
    solutionHref: "/worksheets/einmaleins-2-klasse-loesungen.pdf",
    solutionDownload: "Cleverli-Einmaleins-2-Klasse-Loesungen.pdf",
    previewHref: "/worksheets/einmaleins-2-klasse.png",
    previewAlt: "Vorschau des Cleverli Einmaleins Arbeitsblatts für die 2. Klasse",
    previewWidth: 778,
    previewHeight: 1100,
    curriculumCode: "MA.1.A.3.c",
    curriculumScope: "Produkte mit den Faktoren 2, 5 und 10 verstehen und festigen.",
  },
  {
    slug: "brueche-3-klasse",
    grade: 3,
    subject: "Mathematik",
    topic: "Brüche",
    eyebrow: "Mathematik · 3. Klasse",
    title: "Brüche Arbeitsblatt für die 3. Klasse",
    description: "Brüche Arbeitsblatt für die 3. Klasse: kostenloses PDF mit separater Lösung, verständlichen Beispielen und passender Onlineübung.",
    intro: "Brüche werden verständlich, wenn Kinder ein Ganzes in gleich grosse Teile zerlegen. Das kostenlose Arbeitsblatt verbindet Bilder, Bruchschreibweise und einfache Mengen.",
    explanationTitle: "Brüche anschaulich verstehen",
    explanation: [
      "Ein Bruch beschreibt gleich grosse Teile eines Ganzen. Der Nenner zeigt, in wie viele gleich grosse Teile das Ganze geteilt ist. Der Zähler zeigt, wie viele Teile gemeint sind.",
      "Bei 3/4 ist das Ganze in vier gleich grosse Teile geteilt. Drei davon werden betrachtet oder markiert.",
    ],
    examples: [
      { label: "Ein Halb", text: "1 von 2 gleich grossen Teilen ist 1/2." },
      { label: "Drei Viertel", text: "3 von 4 gleich grossen Teilen sind 3/4." },
    ],
    practises: ["Bruchteile in Bildern erkennen", "Ausgewählte und gesamte Teile unterscheiden", "Einfache Bruchteile von Mengen bestimmen"],
    premiumTopics: ["Zahlen bis 1000", "Schriftlich rechnen", "Fläche und Umfang"],
    exerciseHref: "/learn/3/math/brueche",
    exerciseLabel: "Brüche online üben",
    worksheetHref: "/worksheets/beispiel-klasse-3.pdf",
    worksheetDownload: "Cleverli-Brueche-3-Klasse-Arbeitsblatt.pdf",
    solutionHref: "/worksheets/beispiel-klasse-3-loesungen.pdf",
    solutionDownload: "Cleverli-Brueche-3-Klasse-Loesungen.pdf",
    previewHref: "/worksheets/beispiel-klasse-3.png",
    previewAlt: "Vorschau des Cleverli Brüche Arbeitsblatts für die 3. Klasse",
    curriculumCode: "MA.1.A.1",
    curriculumScope: "Einfache Bruchteile an gleich grossen Teilflächen und Mengen erkennen.",
    curriculumUrl: "https://v-fe.lehrplan.ch/index.php?code=a|5|0|1|1|1",
  },
  {
    slug: "schriftlich-multiplizieren-4-klasse",
    grade: 4,
    subject: "Mathematik",
    topic: "Schriftlich multiplizieren",
    eyebrow: "Mathematik · 4. Klasse",
    title: "Schriftlich multiplizieren Arbeitsblatt für die 4. Klasse",
    description: "Schriftlich multiplizieren in der 4. Klasse: kostenloses Arbeitsblatt als PDF mit Lösung, Beispielen und passender Onlineübung.",
    intro: "Beim schriftlichen Multiplizieren hilft eine klare Stellenordnung. Das kostenlose Arbeitsblatt führt von einfachen Aufgaben zu Rechnungen mit Übertrag.",
    explanationTitle: "Schriftliche Multiplikation sicher aufbauen",
    explanation: [
      "Die Zahlen werden stellenrichtig untereinander geschrieben. Gerechnet wird von rechts nach links, zuerst mit den Einern, dann mit den Zehnern und Hundertern.",
      "Entsteht ein zweistelliges Zwischenergebnis, wird die Einerziffer notiert und die Zehnerziffer als Übertrag zur nächsten Stelle mitgenommen.",
    ],
    examples: [
      { label: "Ohne Übertrag", text: "123 × 3 = 369" },
      { label: "Mit Übertrag", text: "308 × 6 = 1848" },
    ],
    practises: ["Stellenrichtig notieren", "Einstellige Faktoren schriftlich multiplizieren", "Überträge kontrollieren"],
    premiumTopics: ["Schriftlich addieren", "Schriftlich subtrahieren", "Grössen und Messen"],
    exerciseHref: "/learn/4/math/schriftl-multiplizieren",
    exerciseLabel: "Schriftlich multiplizieren online üben",
    worksheetHref: "/worksheets/schriftlich-multiplizieren-4-klasse-arbeitsblatt.pdf",
    worksheetDownload: "Cleverli-Schriftlich-Multiplizieren-4-Klasse-Arbeitsblatt.pdf",
    solutionHref: "/worksheets/schriftlich-multiplizieren-4-klasse-loesungen.pdf",
    solutionDownload: "Cleverli-Schriftlich-Multiplizieren-4-Klasse-Loesungen.pdf",
    previewHref: "/worksheets/schriftlich-multiplizieren-4-klasse.png",
    previewAlt: "Vorschau des Cleverli Arbeitsblatts zum schriftlichen Multiplizieren für die 4. Klasse",
    previewWidth: 778,
    previewHeight: 1100,
    curriculumCode: "MA.1.A.3",
    curriculumScope: "Eine dreistellige Zahl schriftlich mit einem einstelligen Faktor multiplizieren.",
    curriculumUrl: "https://v-fe.lehrplan.ch/index.php?code=a|5|0|1|1|3",
  },
  {
    slug: "dezimalzahlen-5-klasse",
    grade: 5,
    subject: "Mathematik",
    topic: "Dezimalzahlen",
    eyebrow: "Mathematik · 5. Klasse",
    title: "Dezimalzahlen Arbeitsblatt für die 5. Klasse",
    description: "Dezimalzahlen Arbeitsblatt für die 5. Klasse: kostenloses PDF mit Lösung zu Zehnteln, Hundertsteln, Vergleichen und Rechnen.",
    intro: "Zehntel und Hundertstel werden leichter, wenn jede Ziffer ihren festen Platz erhält. Das kostenlose Arbeitsblatt übt Rechnen, Vergleichen und Erklären.",
    explanationTitle: "Dezimalzahlen richtig lesen und rechnen",
    explanation: [
      "Nach dem Komma stehen zuerst die Zehntel und dann die Hundertstel. Die Zahl 2,35 besteht aus zwei Ganzen, drei Zehnteln und fünf Hundertsteln.",
      "Beim Addieren und Subtrahieren stehen gleiche Stellen untereinander. Deshalb werden auch die Kommas genau untereinander notiert.",
    ],
    examples: [
      { label: "Stellenwert", text: "2,35 = 2 + 3/10 + 5/100" },
      { label: "Gleicher Wert", text: "2,5 und 2,50 sind gleich viel." },
    ],
    practises: ["Zehntel und Hundertstel verstehen", "Dezimalzahlen vergleichen", "Dezimalzahlen addieren und subtrahieren"],
    premiumTopics: ["Brüche rechnen", "Fläche und Umfang", "Statistik"],
    exerciseHref: "/learn/5/math/dezimalzahlen",
    exerciseLabel: "Dezimalzahlen online üben",
    worksheetHref: "/worksheets/dezimalzahlen-5-klasse-arbeitsblatt.pdf",
    worksheetDownload: "Cleverli-Dezimalzahlen-5-Klasse-Arbeitsblatt.pdf",
    solutionHref: "/worksheets/dezimalzahlen-5-klasse-loesungen.pdf",
    solutionDownload: "Cleverli-Dezimalzahlen-5-Klasse-Loesungen.pdf",
    previewHref: "/worksheets/dezimalzahlen-5-klasse.png",
    previewAlt: "Vorschau des Cleverli Dezimalzahlen Arbeitsblatts für die 5. Klasse",
    previewWidth: 778,
    previewHeight: 1100,
    curriculumCode: "MA.1.A.3",
    curriculumScope: "Dezimalzahlen bis Hundertstel addieren, subtrahieren und vergleichen.",
    curriculumUrl: "https://v-fe.lehrplan.ch/index.php?code=b%7C5%7C0%7C1",
  },
  {
    slug: "prozentrechnung-6-klasse",
    grade: 6,
    subject: "Mathematik",
    topic: "Prozentrechnung",
    eyebrow: "Mathematik · 6. Klasse",
    title: "Prozentrechnung Arbeitsblatt für die 6. Klasse",
    description: "Prozentrechnung Arbeitsblatt für die 6. Klasse: kostenloses PDF mit Lösung zu Prozenten, Brüchen, Anteilen und einfachen Rabatten.",
    intro: "Prozent bedeutet von hundert. Das kostenlose Arbeitsblatt verbindet vertraute Brüche mit Prozentangaben und führt zu einfachen Anteilen und Rabatten.",
    explanationTitle: "Prozentrechnung aus Brüchen ableiten",
    explanation: [
      "Eine Prozentangabe beschreibt einen Anteil von hundert. 20 Prozent bedeutet 20 von 100 und entspricht dem Bruch 1/5.",
      "Für einfache Anteile hilft das Zerlegen. 25 Prozent sind ein Viertel. Bei einem Preis von CHF 60 sind 25 Prozent deshalb CHF 15.",
    ],
    examples: [
      { label: "Bruch und Prozent", text: "1/2 = 50 % und 1/4 = 25 %" },
      { label: "Anteil", text: "20 % von 150 sind 30." },
    ],
    practises: ["Brüche in Prozent umwandeln", "Einfache Prozentanteile berechnen", "Rabatt und neuen Preis bestimmen"],
    premiumTopics: ["Einfache Gleichungen", "Verhältnisse", "Statistik"],
    exerciseHref: "/learn/6/math/prozent",
    exerciseLabel: "Prozentrechnung online üben",
    worksheetHref: "/worksheets/prozentrechnung-6-klasse-arbeitsblatt.pdf",
    worksheetDownload: "Cleverli-Prozentrechnung-6-Klasse-Arbeitsblatt.pdf",
    solutionHref: "/worksheets/prozentrechnung-6-klasse-loesungen.pdf",
    solutionDownload: "Cleverli-Prozentrechnung-6-Klasse-Loesungen.pdf",
    previewHref: "/worksheets/prozentrechnung-6-klasse.png",
    previewAlt: "Vorschau des Cleverli Prozentrechnung Arbeitsblatts für die 6. Klasse",
    previewWidth: 778,
    previewHeight: 1100,
    curriculumCode: "MA.1.A.1",
    curriculumScope: "Vertraute Brüche mit Prozentangaben verbinden und einfache Anteile berechnen.",
    curriculumUrl: "https://v-fe.lehrplan.ch/index.php?code=b%7C5%7C0%7C1",
  },
];

export function worksheetLandingPage(slug: string) {
  return worksheetLandingPages.find(page => page.slug === slug);
}
