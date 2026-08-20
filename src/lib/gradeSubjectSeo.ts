export type GradeSeoSubject = "math" | "german";

export type GradeSubjectSeoPage = {
  slug: string;
  href: string;
  grade: number;
  subject: GradeSeoSubject;
  subjectName: string;
  shortSubjectName: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  lead: string;
  focusTitle: string;
  focusItems: string[];
  parentAnswer: string;
  ctaHref: string;
  ctaLabel: string;
  detailIntro?: string;
  detailItems?: {
    title: string;
    body: string;
  }[];
  faqItems?: {
    question: string;
    answer: string;
  }[];
  extraLinks?: {
    href: string;
    label: string;
  }[];
};

const mathFocus: Record<number, string[]> = {
  1: ["Zahlen bis 20 verstehen", "Plus und Minus sicher üben", "Formen, Muster und Mengen erkennen"],
  2: ["Rechnen bis 100 festigen", "Einmaleins aufbauen", "Uhrzeit, Geld und Textaufgaben üben"],
  3: ["Rechnen bis 1000 trainieren", "Mal und geteilt sicherer anwenden", "Geometrie und Sachaufgaben verstehen"],
  4: ["Grosse Zahlen und Grundrechenarten üben", "Brüche und Grössen einordnen", "Sachaufgaben Schritt für Schritt lösen"],
  5: ["Dezimalzahlen und Grössen festigen", "Brüche, Daten und Diagramme üben", "Rechenwege sauber anwenden"],
  6: ["Prozent, Brüche und Dezimalzahlen verbinden", "Gleichungen und Sachaufgaben üben", "Sicherheit für den Übertritt aufbauen"],
};

const germanFocus: Record<number, string[]> = {
  1: ["Buchstaben und Laute festigen", "Silben, Wörter und erste Sätze lesen", "Schreiben Schritt für Schritt üben"],
  2: ["Leseflüssigkeit aufbauen", "Nomen, Verben und Adjektive erkennen", "Rechtschreibung in kurzen Aufgaben üben"],
  3: ["Texte genauer verstehen", "Wortarten und Satzbau festigen", "Rechtschreibung sicherer anwenden"],
  4: ["Längere Texte lesen und verstehen", "Zeitformen und Satzzeichen üben", "Eigene Sätze klarer schreiben"],
  5: ["Textverständnis und Wortschatz stärken", "Grammatik und Rechtschreibung wiederholen", "Schreibaufgaben besser strukturieren"],
  6: ["Lesestrategien festigen", "Grammatik und Rechtschreibung sicher anwenden", "Texte planen, schreiben und überarbeiten"],
};

const mathCtaTopic: Record<number, string> = {
  1: "zahlen-1-10",
  2: "zahlen-bis-100",
  3: "zahlen-bis-1000",
  4: "zahlen-bis-10000",
  5: "dezimalzahlen",
  6: "negative-zahlen",
};

const germanCtaTopic: Record<number, string> = {
  1: "buchstaben",
  2: "nomen-artikel",
  3: "wortarten",
  4: "satzglieder",
  5: "direkte-rede",
  6: "kasus",
};

const pageOverrides: Partial<Record<string, Partial<GradeSubjectSeoPage>>> = {
  "mathe-uebungen-1-klasse": {
    title: "Mathe Übungen 1. Klasse - Primarschule Schweiz",
    description:
      "Mathe Übungen 1. Klasse für die Schweizer Primarschule: Zahlen bis 20, Plus, Minus, Mengen und Formen online üben.",
    lead:
      "Mathe Übungen für die 1. Klasse: Zahlen verstehen, Mengen vergleichen, Plus und Minus üben und erste Aufgaben mit direkter Rückmeldung lösen.",
    focusItems: [
      "Zahlen, Mengen und Reihenfolgen sicherer erkennen",
      "Plus und Minus im Zahlenraum bis 20 üben",
      "Formen, Muster und einfache Sachaufgaben verstehen",
    ],
    parentAnswer:
      "In der 1. Klasse zählt vor allem Sicherheit mit Zahlen, Mengen und einfachen Rechenwegen. Cleverli macht daraus kurze Übungen, die Kinder ohne lange Vorbereitung starten können.",
    detailIntro:
      "Die Seite ist auf den Einstieg in die Primarschul-Mathe ausgerichtet. Sie vermeidet lange Theorie und gibt Kindern direkt Rückmeldung, wenn eine Antwort stimmt oder ein Tipp hilft.",
    detailItems: [
      {
        title: "Zahlen bis 20",
        body: "Kinder üben Zahlen lesen, zählen, vergleichen und ordnen, damit die Grundlagen für späteres Rechnen sitzen.",
      },
      {
        title: "Plus und Minus",
        body: "Einfache Rechnungen werden in kleinen Schritten trainiert, passend für kurze Übungsrunden daheim.",
      },
      {
        title: "Muster und Formen",
        body: "Mengen, Formen und Muster helfen, mathematische Zusammenhänge früh sichtbar zu machen.",
      },
    ],
    faqItems: [
      {
        question: "Welche Mathe-Themen sind in der 1. Klasse wichtig?",
        answer:
          "Wichtig sind Zahlen bis 20, Mengen, Plus, Minus, Muster, Formen und erste Sachaufgaben.",
      },
      {
        question: "Kann mein Kind selbstständig üben?",
        answer:
          "Ja. Die Aufgaben sind kurz, geben direkt Rückmeldung und bieten Tipps, wenn dein Kind nicht weiterkommt.",
      },
      {
        question: "Ist das für die Schweiz passend?",
        answer:
          "Ja. Cleverli ist auf die Schweizer Primarschule und Lehrplan 21 ausgerichtet.",
      },
    ],
  },
  "mathe-uebungen-2-klasse": {
    title: "Mathe Übungen 2. Klasse - Rechnen & Einmaleins",
    description:
      "Mathe Übungen 2. Klasse für die Schweizer Primarschule: Rechnen bis 100, Einmaleins, Uhrzeit, Geld und Textaufgaben.",
    lead:
      "Mathe Übungen für die 2. Klasse: Rechnen bis 100 festigen, erste Einmaleins-Reihen aufbauen und Aufgaben im Alltag besser verstehen.",
    focusItems: [
      "Addition und Subtraktion bis 100 festigen",
      "Einmaleins-Reihen Schritt für Schritt aufbauen",
      "Uhrzeit, Geld und einfache Textaufgaben üben",
    ],
    parentAnswer:
      "In der 2. Klasse wird Mathe spürbar breiter. Cleverli hilft mit kurzen Runden für Rechnen bis 100, Einmaleins und Alltagsthemen wie Geld oder Uhrzeit.",
    detailIntro:
      "Die Übungen sind so aufgebaut, dass Kinder einzelne Grundlagen wiederholen können, ohne gleich eine ganze Arbeitsmappe durcharbeiten zu müssen.",
    detailItems: [
      {
        title: "Rechnen bis 100",
        body: "Plus und Minus werden mit passenden Aufgaben gefestigt, damit Rechenwege sicherer werden.",
      },
      {
        title: "Einmaleins vorbereiten",
        body: "Kinder üben Reihen, Muster und Malaufgaben, bevor gemischte 1x1-Aufgaben schwieriger werden.",
      },
      {
        title: "Alltagsmathe",
        body: "Uhrzeit, Geld, Längen und kleine Textaufgaben bringen Mathe näher an Situationen aus Schule und Alltag.",
      },
    ],
    faqItems: [
      {
        question: "Ist Einmaleins in der 2. Klasse schon dabei?",
        answer:
          "Ja. Viele Kinder bauen das Einmaleins in der 2. Klasse auf und festigen es danach weiter.",
      },
      {
        question: "Kann ich gezielt nur Rechnen bis 100 üben lassen?",
        answer:
          "Ja. Du kannst direkt passende Themen auswählen und dein Kind mit kurzen Aufgaben starten lassen.",
      },
      {
        question: "Gibt es auch Textaufgaben?",
        answer:
          "Ja. Cleverli enthält auch einfache Sach- und Textaufgaben, damit Kinder Rechnen im Kontext üben.",
      },
    ],
    extraLinks: [
      { href: "/einmaleins-ueben", label: "Einmaleins üben" },
      { href: "/1x1-spiele", label: "1x1 Spiele" },
    ],
  },
  "deutsch-uebungen-1-klasse": {
    title: "Deutsch Übungen 1. Klasse - Lesen & Schreiben",
    description:
      "Deutsch Übungen 1. Klasse für die Schweizer Primarschule: Buchstaben, Laute, Wörter, erste Sätze und Lesen lernen.",
    lead:
      "Deutsch Übungen für die 1. Klasse: Buchstaben, Laute, erste Wörter und kurze Sätze üben, damit Lesen und Schreiben sicherer werden.",
    focusItems: [
      "Buchstaben und Laute erkennen",
      "Wörter und erste Sätze lesen",
      "Grossschreibung und einfache Schreibmuster üben",
    ],
    parentAnswer:
      "In der 1. Klasse geht es um den Einstieg ins Lesen und Schreiben. Cleverli gibt Kindern kleine, klare Aufgaben, die sofort Rückmeldung geben und nicht überfordern.",
    detailIntro:
      "Die Übungen passen besonders für Kinder, die Buchstaben, Wörter und einfache Sätze häufiger wiederholen sollen.",
    detailItems: [
      {
        title: "Lesen lernen",
        body: "Kinder üben Buchstaben, Laute, Wörter und erste Sätze mit kurzen Aufgaben und Vorlesen.",
      },
      {
        title: "Schreiben vorbereiten",
        body: "Einfache Wörter, Grossschreibung und passende Satzanfänge helfen beim Aufbau sicherer Schreibgrundlagen.",
      },
      {
        title: "Selbstständiger üben",
        body: "Tipps und direkte Rückmeldung helfen, ohne dass Eltern jede Aufgabe vorbereiten müssen.",
      },
    ],
    faqItems: [
      {
        question: "Hilft Cleverli beim Lesen lernen?",
        answer:
          "Ja. Es gibt Übungen zu Buchstaben, Wörtern, Sätzen und erstem Leseverständnis.",
      },
      {
        question: "Ist das für Kinder am Anfang der 1. Klasse geeignet?",
        answer:
          "Ja. Dein Kind kann mit einfachen Themen starten und später zu Sätzen und kleinen Texten wechseln.",
      },
      {
        question: "Kann mein Kind Aufgaben vorlesen lassen?",
        answer:
          "Ja. Die Vorlesen-Funktion unterstützt Kinder, die noch nicht alles flüssig lesen.",
      },
    ],
    extraLinks: [
      { href: "/lesen-lernen", label: "Lesen lernen" },
      { href: "/deutsch-uebungen-kinder", label: "Deutsch Übungen für Kinder" },
    ],
  },
  "deutsch-uebungen-6-klasse": {
    title: "Deutsch Übungen 6. Klasse - Lehrplan 21 Schweiz",
    description:
      "Deutsch Übungen 6. Klasse für die Schweizer Primarschule: Grammatik, Rechtschreibung, Textverständnis, Argumentation und Übertritt sicher üben.",
    lead:
      "Deutsch Übungen für die 6. Klasse, passend zur Schweizer Primarschule: Grammatik, Rechtschreibung, Textverständnis und Schreiben in kurzen Lernrunden festigen.",
    focusItems: [
      "Kasus, Wortarten und Satzbau sicher anwenden",
      "Rechtschreibstrategien und Grammatik wiederholen",
      "Texte verstehen, argumentieren und überarbeiten",
    ],
    parentAnswer:
      "In der 6. Klasse geht es nicht mehr nur um einzelne Regeln. Kinder müssen Texte genauer lesen, Grammatik bewusst anwenden und eigene Gedanken klar formulieren. Cleverli macht daraus kurze, überschaubare Übungen mit direkter Rückmeldung.",
    detailIntro:
      "Die Übungen passen zu typischen Deutsch-Themen der oberen Primarschule in der Schweiz. Dein Kind kann gezielt einzelne Bereiche üben oder einfach mit einer kurzen Runde starten, wenn Hausaufgaben, Prüfungsvorbereitung oder Übertrittsstress anstehen.",
    detailItems: [
      {
        title: "Grammatik verstehen",
        body: "Kasus, Wortarten, Relativsätze, Satzglieder und Zeitformen werden in kleinen Schritten geübt, statt als lange Theorieblöcke.",
      },
      {
        title: "Rechtschreibung festigen",
        body: "Strategien, typische Stolperstellen und sichere Wortformen helfen Kindern, beim Schreiben genauer zu werden.",
      },
      {
        title: "Texte besser meistern",
        body: "Leseverständnis, Textsorten, Argumentation und Überarbeitung bereiten auf anspruchsvollere Aufgaben in der Sekundarstufe vor.",
      },
    ],
    faqItems: [
      {
        question: "Welche Deutsch-Themen sind in der 6. Klasse wichtig?",
        answer:
          "Wichtig sind Grammatik, Kasus, Wortarten, Rechtschreibung, Textverständnis, Textsorten, Argumentation und das Überarbeiten eigener Texte.",
      },
      {
        question: "Hilft Cleverli bei Prüfungsvorbereitung und Übertritt?",
        answer:
          "Ja. Die Übungen sind kurz genug für regelmässiges Wiederholen und decken zentrale Grundlagen ab, die Kinder vor dem Übertritt sicherer beherrschen sollten.",
      },
      {
        question: "Muss ich als Elternteil die Aufgaben vorbereiten?",
        answer:
          "Nein. Dein Kind kann direkt starten, erhält Hinweise und sieht sofort, ob eine Antwort stimmt. Du kannst später den Fortschritt anschauen.",
      },
    ],
    extraLinks: [
      { href: "/deutsch-uebungen-kinder", label: "Deutsch Übungen für Kinder" },
      { href: "/deutsch-uebungen-5-klasse", label: "Deutsch Übungen 5. Klasse" },
      { href: "/deutsch-uebungen-2-klasse", label: "Deutsch Übungen 2. Klasse" },
    ],
  },
};

function buildPage(grade: number, subject: GradeSeoSubject): GradeSubjectSeoPage {
  const isMath = subject === "math";
  const subjectName = isMath ? "Mathematik" : "Deutsch";
  const shortSubjectName = isMath ? "Mathe" : "Deutsch";
  const slugSubject = isMath ? "mathe" : "deutsch";
  const titleSubject = isMath ? "Mathe Übungen" : "Deutsch Übungen";
  const focusItems = isMath ? mathFocus[grade] : germanFocus[grade];
  const ctaTopic = isMath ? mathCtaTopic[grade] : germanCtaTopic[grade];
  const slug = `${slugSubject}-uebungen-${grade}-klasse`;
  const h1 = `${titleSubject} ${grade}. Klasse`;
  const description = `${h1} für die Schweizer Primarschule: kurze Online-Aufgaben nach Lehrplan 21, direkt im Browser und 20 Aufgaben gratis testen.`;

  const basePage: GradeSubjectSeoPage = {
    slug,
    href: `/${slug}`,
    grade,
    subject,
    subjectName,
    shortSubjectName,
    title: h1,
    description,
    h1,
    eyebrow: `${shortSubjectName} · ${grade}. Klasse · Schweizer Primarschule`,
    lead: `${h1} passend zur Schweizer Primarschule: kurze Aufgaben, direkte Rückmeldung und Vorlesen, wenn dein Kind Unterstützung braucht.`,
    focusTitle: `Was dein Kind in ${shortSubjectName} ${grade}. Klasse übt`,
    focusItems,
    parentAnswer: `Cleverli bündelt passende Übungen für die ${grade}. Klasse in ruhigen, klaren Lernrunden. Dein Kind kann selbst starten, bekommt sofort Rückmeldung und du siehst, was schon gut klappt.`,
    ctaHref: `/learn/${grade}/${subject}/${ctaTopic}`,
    ctaLabel: `${shortSubjectName} ${grade}. Klasse gratis starten`,
  };

  return {
    ...basePage,
    ...pageOverrides[slug],
  };
}

export const GRADE_SUBJECT_SEO_PAGES: GradeSubjectSeoPage[] = [1, 2, 3, 4, 5, 6].flatMap((grade) => [
  buildPage(grade, "math"),
  buildPage(grade, "german"),
]);

export function getGradeSubjectSeoPage(slug: string) {
  return GRADE_SUBJECT_SEO_PAGES.find((page) => page.slug === slug);
}

export function getGradeSubjectSeoLinks(limit?: number) {
  return typeof limit === "number" ? GRADE_SUBJECT_SEO_PAGES.slice(0, limit) : GRADE_SUBJECT_SEO_PAGES;
}
