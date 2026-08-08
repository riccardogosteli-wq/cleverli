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

  return {
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
