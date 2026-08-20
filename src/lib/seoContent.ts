import type { Exercise, Topic } from "@/types/exercise";
import type { Lang } from "@/lib/i18n";

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
    href: "/lesen-lernen",
    title: "Lesen lernen",
    description: "Buchstaben, Wörter und erste Sätze online üben.",
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

const localizedExerciseTypeLabels: Record<Lang, Record<string, string>> = {
  de: exerciseTypeLabels,
  fr: {
    "multiple-choice": "Choix",
    "fill-in-blank": "Textes à trous",
    counting: "Comptage",
    matching: "Associations",
    memory: "Memory",
    "drag-drop": "Glisser-déposer",
    "number-line": "Ligne numérique",
    "word-search": "Mots cachés",
  },
  it: {
    "multiple-choice": "Scelta multipla",
    "fill-in-blank": "Testi con lacune",
    counting: "Conteggio",
    matching: "Abbinamenti",
    memory: "Memory",
    "drag-drop": "Drag & Drop",
    "number-line": "Retta numerica",
    "word-search": "Cerca parole",
  },
  en: {
    "multiple-choice": "Multiple choice",
    "fill-in-blank": "Fill-in blanks",
    counting: "Counting tasks",
    matching: "Matching",
    memory: "Memory",
    "drag-drop": "Drag & drop",
    "number-line": "Number line",
    "word-search": "Word search",
  },
};

const localizedSubjectNames: Record<string, Record<Lang, { name: string; shortName: string }>> = {
  math: {
    de: { name: "Mathematik", shortName: "Mathe" },
    fr: { name: "Mathématiques", shortName: "Maths" },
    it: { name: "Matematica", shortName: "Matematica" },
    en: { name: "Maths", shortName: "Maths" },
  },
  german: {
    de: { name: "Deutsch", shortName: "Deutsch" },
    fr: { name: "Allemand", shortName: "Allemand" },
    it: { name: "Tedesco", shortName: "Tedesco" },
    en: { name: "German", shortName: "German" },
  },
  science: {
    de: { name: "NMG", shortName: "NMG" },
    fr: { name: "Sciences", shortName: "Sciences" },
    it: { name: "Scienze", shortName: "Scienze" },
    en: { name: "Science", shortName: "Science" },
  },
  english: {
    de: { name: "Englisch", shortName: "Englisch" },
    fr: { name: "Anglais", shortName: "Anglais" },
    it: { name: "Inglese", shortName: "Inglese" },
    en: { name: "English", shortName: "English" },
  },
  french: {
    de: { name: "Französisch", shortName: "Französisch" },
    fr: { name: "Français", shortName: "Français" },
    it: { name: "Francese", shortName: "Francese" },
    en: { name: "French", shortName: "French" },
  },
};

export function getExerciseTypeLabel(type: string, lang: Lang = "de") {
  return localizedExerciseTypeLabels[lang]?.[type] ?? exerciseTypeLabels[type] ?? type;
}

export function getLocalizedSubjectName(subject: string, lang: Lang = "de") {
  return localizedSubjectNames[subject]?.[lang]?.name ?? getSubjectSeo(subject).name;
}

export function getLocalizedSubjectShortName(subject: string, lang: Lang = "de") {
  return localizedSubjectNames[subject]?.[lang]?.shortName ?? getSubjectSeo(subject).shortName;
}

export function getLocalizedGradeName(grade: string | number, lang: Lang = "de") {
  const n = String(grade);
  if (lang === "en") return `Grade ${n}`;
  if (lang === "fr") return n === "1" ? "1re année" : `${n}e année`;
  if (lang === "it") return `${n}a classe`;
  return getGradeName(grade);
}

export function getLocalizedExerciseQuestion(exercise: Exercise, lang: Lang = "de") {
  if (lang === "en") return exercise.questionEN ?? exercise.question;
  if (lang === "fr") return exercise.questionFR ?? exercise.question;
  if (lang === "it") return exercise.questionIT ?? exercise.question;
  return exercise.question;
}

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

export function getTopicExerciseTypes(topic: Topic, lang: Lang = "de") {
  const labels = Array.from(new Set(topic.exercises.map((exercise) => getExerciseTypeLabel(exercise.type, lang))));
  return labels.slice(0, 4);
}

export function getSampleExercises(topic: Topic, limit = 4): Exercise[] {
  const candidates = topic.exercises.filter((exercise) => Boolean(exercise.question));
  const selected: Exercise[] = [];
  const usedTypes = new Set<string>();
  const usedQuestions = new Set<string>();

  const add = (exercise: Exercise) => {
    const normalizedQuestion = exercise.question.toLowerCase().replace(/\s+/g, " ").trim();
    if (selected.length >= limit || usedQuestions.has(normalizedQuestion)) return;

    selected.push(exercise);
    usedTypes.add(exercise.type);
    usedQuestions.add(normalizedQuestion);
  };

  for (const exercise of candidates) {
    if (!usedTypes.has(exercise.type)) add(exercise);
    if (selected.length >= limit) return selected;
  }

  for (const exercise of candidates) {
    add(exercise);
    if (selected.length >= limit) return selected;
  }

  return selected;
}

export function buildTopicDescription(topic: Topic, grade: string | number, subject: string, lang: Lang = "de", topicTitle = topic.title) {
  const subjectName = getLocalizedSubjectShortName(subject, lang);
  const gradeName = getLocalizedGradeName(grade, lang);
  const types = getTopicExerciseTypes(topic, lang);
  if (lang === "en") {
    const typeText = types.length ? ` With ${types.join(", ")}.` : "";
    return `${topic.exercises.length} interactive exercises for ${topicTitle} in ${gradeName}. ${subjectName} aligned with the Swiss LP21 curriculum.${typeText}`;
  }
  if (lang === "fr") {
    const typeText = types.length ? ` Avec ${types.join(", ")}.` : "";
    return `${topic.exercises.length} exercices interactifs sur ${topicTitle} pour la ${gradeName}. ${subjectName} selon le programme suisse.${typeText}`;
  }
  if (lang === "it") {
    const typeText = types.length ? ` Con ${types.join(", ")}.` : "";
    return `${topic.exercises.length} esercizi interattivi su ${topicTitle} per la ${gradeName}. ${subjectName} secondo il programma svizzero.${typeText}`;
  }
  const typeText = types.length ? ` Mit ${types.join(", ")}.` : "";
  return `${topic.exercises.length} interaktive Übungen zu ${topicTitle} für die ${gradeName}. ${subjectName} nach Lehrplan 21 Schweiz.${typeText}`;
}

export function buildTopicLearningAnswer(topic: Topic, grade: string | number, subject: string, lang: Lang = "de", topicTitle = topic.title) {
  const subjectName = getLocalizedSubjectShortName(subject, lang);
  const gradeName = getLocalizedGradeName(grade, lang);
  const types = getTopicExerciseTypes(topic, lang);
  if (lang === "en") {
    const typeText = types.length ? ` The exercises use ${types.join(", ")} and give instant feedback.` : " The exercises give instant feedback.";
    return `${topicTitle} belongs to ${subjectName} in ${gradeName}. Your child practises short, clear tasks that fit Swiss primary school lessons.${typeText} This makes it clear what already works and where more practice helps.`;
  }
  if (lang === "fr") {
    const typeText = types.length ? ` Les exercices utilisent ${types.join(", ")} et donnent un feedback direct.` : " Les exercices donnent un feedback direct.";
    return `${topicTitle} fait partie des ${subjectName} en ${gradeName}. Ton enfant s'entraîne avec des tâches courtes et claires adaptées à l'école primaire suisse.${typeText} On voit ainsi ce qui fonctionne déjà et où il faut encore s'exercer.`;
  }
  if (lang === "it") {
    const typeText = types.length ? ` Gli esercizi usano ${types.join(", ")} e danno un feedback immediato.` : " Gli esercizi danno un feedback immediato.";
    return `${topicTitle} fa parte di ${subjectName} nella ${gradeName}. Il tuo bambino si esercita con compiti brevi e chiari, adatti alla scuola primaria svizzera.${typeText} Così si vede cosa funziona già e dove serve ancora esercizio.`;
  }
  const typeText = types.length ? ` Die Aufgaben nutzen ${types.join(", ")} und geben direkt Rückmeldung.` : " Die Aufgaben geben direkt Rückmeldung.";
  return `${topicTitle} gehört zu ${subjectName} in der ${gradeName}. Dein Kind übt kurze, klare Aufgaben, die zum Schulstoff der Schweizer Primarschule passen.${typeText} So wird sichtbar, was schon klappt und wo noch Übung hilft.`;
}

export function getRelatedTopics(topics: Topic[], topicId: string, limit = 4) {
  const currentIndex = topics.findIndex((topic) => topic.id === topicId);
  if (currentIndex < 0) return topics.slice(0, limit);

  const before = topics.slice(Math.max(0, currentIndex - 2), currentIndex);
  const after = topics.slice(currentIndex + 1, currentIndex + 1 + limit);
  return [...before, ...after].slice(0, limit);
}
