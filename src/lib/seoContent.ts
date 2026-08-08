import type { Exercise, Topic } from "@/types/exercise";

export const SUBJECT_SEO: Record<string, {
  name: string;
  shortName: string;
  keywords: string[];
  intro: string;
  practice: string[];
}> = {
  math: {
    name: "Mathematik",
    shortName: "Mathe",
    keywords: ["Mathe Übungen", "Rechnen", "Einmaleins", "Geometrie", "Textaufgaben"],
    intro: "Kurze Mathe-Übungen für die Schweizer Primarschule: rechnen, Muster erkennen, Geometrie verstehen und Aufgaben Schritt für Schritt festigen.",
    practice: ["Zahlen und Rechnen", "Einmaleins und Division", "Geometrie, Uhrzeit und Daten"],
  },
  german: {
    name: "Deutsch",
    shortName: "Deutsch",
    keywords: ["Deutsch Übungen", "Lesen", "Rechtschreibung", "Grammatik", "Satzbau"],
    intro: "Deutsch üben mit klaren Aufgaben für Lesen, Schreiben, Rechtschreibung, Wortarten und Satzbau, passend zum Schulalltag in der Schweiz.",
    practice: ["Lesen und Verstehen", "Wörter und Rechtschreibung", "Grammatik und Satzbau"],
  },
  science: {
    name: "NMG",
    shortName: "NMG",
    keywords: ["NMG Übungen", "Natur Mensch Gesellschaft", "Sachkunde", "Schweiz", "Tiere"],
    intro: "NMG-Übungen zu Natur, Mensch und Gesellschaft: beobachten, vergleichen, ordnen und Zusammenhänge aus dem Alltag verstehen.",
    practice: ["Natur und Tiere", "Mensch und Gesundheit", "Schweiz und Zusammenleben"],
  },
  english: {
    name: "Englisch",
    shortName: "Englisch",
    keywords: ["Englisch Übungen", "Wortschatz", "Sätze", "Grammatik", "Primarschule"],
    intro: "Englisch-Übungen für Primarschulkinder mit Wortschatz, einfachen Sätzen, Hörverstehen und Grammatik in kurzen Runden.",
    practice: ["Wortschatz aufbauen", "Sätze verstehen", "Grammatik sicherer anwenden"],
  },
  french: {
    name: "Französisch",
    shortName: "Französisch",
    keywords: ["Französisch Übungen", "Wortschatz", "Verben", "Sätze", "Primarschule"],
    intro: "Französisch-Übungen für die Primarschule: Wortschatz, einfache Sätze und Grundlagen wiederholen, ohne lange Vorbereitung daheim.",
    practice: ["Wortschatz wiederholen", "Verben und Formen", "Sätze lesen und verstehen"],
  },
};

export const GRADE_NAMES: Record<string, string> = {
  "1": "1. Klasse",
  "2": "2. Klasse",
  "3": "3. Klasse",
  "4": "4. Klasse",
  "5": "5. Klasse",
  "6": "6. Klasse",
};

export const ORGANIC_LANDING_PAGES = [
  {
    href: "/primarschule-uebungen",
    title: "Primarschule Übungen",
    description: "Mathe, Deutsch und NMG für die Schweizer Primarschule.",
  },
  {
    href: "/mathe-uebungen-kinder",
    title: "Mathe Übungen für Kinder",
    description: "Rechnen, Einmaleins, Geometrie und Textaufgaben üben.",
  },
  {
    href: "/deutsch-uebungen-kinder",
    title: "Deutsch Übungen für Kinder",
    description: "Lesen, Rechtschreibung, Grammatik und Satzbau festigen.",
  },
  {
    href: "/einmaleins-ueben",
    title: "Einmaleins üben",
    description: "1x1-Aufgaben mit Tipps und direktem Feedback.",
  },
  {
    href: "/1x1-spiele",
    title: "1x1 Spiele",
    description: "Spielerische Einmaleins-Runden direkt im Browser.",
  },
];

const exerciseTypeLabels: Record<string, string> = {
  "multiple-choice": "Auswahlaufgaben",
  "fill-in-blank": "Lückentexte",
  counting: "Zählaufgaben",
  matching: "Zuordnungen",
  memory: "Memory",
  "drag-drop": "Drag & Drop",
  "number-line": "Zahlenstrahl",
  "word-search": "Wortsuche",
};

export function getSubjectSeo(subject: string) {
  return SUBJECT_SEO[subject] ?? {
    name: subject,
    shortName: subject,
    keywords: [subject],
    intro: "Kurze interaktive Übungen für die Schweizer Primarschule.",
    practice: ["Grundlagen üben", "Wissen festigen", "Fortschritt sehen"],
  };
}

export function getGradeName(grade: string | number) {
  return GRADE_NAMES[String(grade)] ?? `${grade}. Klasse`;
}

export function getTopicExerciseTypes(topic: Topic) {
  const labels = Array.from(new Set(topic.exercises.map((exercise) => exerciseTypeLabels[exercise.type] ?? exercise.type)));
  return labels.slice(0, 4);
}

export function getSampleExercises(topic: Topic, limit = 4): Exercise[] {
  return topic.exercises.filter((exercise) => Boolean(exercise.question)).slice(0, limit);
}

export function buildTopicDescription(topic: Topic, grade: string | number, subject: string) {
  const subjectSeo = getSubjectSeo(subject);
  const gradeName = getGradeName(grade);
  const types = getTopicExerciseTypes(topic);
  const typeText = types.length ? ` Mit ${types.join(", ")}.` : "";
  return `${topic.exercises.length} interaktive Übungen zu ${topic.title} für die ${gradeName}. ${subjectSeo.shortName} nach Lehrplan 21 Schweiz.${typeText}`;
}

export function buildTopicLearningAnswer(topic: Topic, grade: string | number, subject: string) {
  const subjectSeo = getSubjectSeo(subject);
  const gradeName = getGradeName(grade);
  const types = getTopicExerciseTypes(topic);
  const typeText = types.length ? ` Die Aufgaben nutzen ${types.join(", ")} und geben direkt Rückmeldung.` : " Die Aufgaben geben direkt Rückmeldung.";
  return `${topic.title} gehört zu ${subjectSeo.shortName} in der ${gradeName}. Dein Kind übt kurze, klare Aufgaben, die zum Schulstoff der Schweizer Primarschule passen.${typeText} So wird sichtbar, was schon klappt und wo noch Übung hilft.`;
}

export function getRelatedTopics(topics: Topic[], topicId: string, limit = 4) {
  const currentIndex = topics.findIndex((topic) => topic.id === topicId);
  if (currentIndex < 0) return topics.slice(0, limit);

  const before = topics.slice(Math.max(0, currentIndex - 2), currentIndex);
  const after = topics.slice(currentIndex + 1, currentIndex + 1 + limit);
  return [...before, ...after].slice(0, limit);
}
