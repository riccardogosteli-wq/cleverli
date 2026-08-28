import generated from "./generatedExerciseLocalizations.json";
import type { Exercise, Topic } from "@/types/exercise";

type Locale = "en" | "fr" | "it";
type LocalizedExercise = Partial<Exercise>;
type RecordEntry = {
  sourceQuestion: string;
  en: LocalizedExercise;
  fr: LocalizedExercise;
  it: LocalizedExercise;
};

const records = generated.records as Record<string, RecordEntry>;

const languageInstructions: Record<Locale, Partial<Record<Exercise["type"], string>>> = {
  en: {
    "multiple-choice": "Choose the correct answer.", "fill-in-blank": "Complete the gap.", "self-review": "Review your answer.", counting: "Count and answer.", matching: "Match the pairs.", memory: "Find the matching pairs.", "drag-drop": "Sort the items.", "number-line": "Mark the correct number.", "word-search": "Find the words.",
  },
  fr: {
    "multiple-choice": "Choisis la bonne réponse.", "fill-in-blank": "Complète le blanc.", "self-review": "Vérifie ta réponse.", counting: "Compte et réponds.", matching: "Relie les paires.", memory: "Trouve les paires.", "drag-drop": "Classe les éléments.", "number-line": "Marque le bon nombre.", "word-search": "Trouve les mots.",
  },
  it: {
    "multiple-choice": "Scegli la risposta corretta.", "fill-in-blank": "Completa lo spazio.", "self-review": "Controlla la tua risposta.", counting: "Conta e rispondi.", matching: "Abbina le coppie.", memory: "Trova le coppie.", "drag-drop": "Ordina gli elementi.", "number-line": "Segna il numero corretto.", "word-search": "Trova le parole.",
  },
};

function languageSubjectValues(exercise: Exercise, subject: string, locale: Locale): LocalizedExercise {
  const source = subject === "english" ? "en" : subject === "french" ? "fr" : "de";
  return {
    question: locale === source ? exercise.question : `${languageInstructions[locale][exercise.type] ?? languageInstructions[locale]["multiple-choice"]} ${exercise.question}`,
    answer: exercise.answer,
    altAnswers: exercise.altAnswers,
    options: exercise.options,
    hints: exercise.hints,
    reviewCriteria: exercise.reviewCriteria,
    pairs: exercise.pairs,
    dragItems: exercise.dragItems,
    dropZones: exercise.dropZones,
    wordList: exercise.wordList,
  };
}

function suffixFields(locale: Locale, values: LocalizedExercise): Partial<Exercise> {
  const suffix = locale.toUpperCase() as "EN" | "FR" | "IT";
  return {
    [`question${suffix}`]: values.question,
    [`hints${suffix}`]: values.hints,
    [`options${suffix}`]: values.options,
    [`answer${suffix}`]: values.answer,
    [`altAnswers${suffix}`]: values.altAnswers,
    [`reviewCriteria${suffix}`]: values.reviewCriteria,
    [`pairs${suffix}`]: values.pairs,
    [`dragItems${suffix}`]: values.dragItems,
    [`dropZones${suffix}`]: values.dropZones,
    [`wordList${suffix}`]: values.wordList,
  } as Partial<Exercise>;
}

/**
 * Applies complete, context-keyed localisation after every content replacement.
 * Only Maths and NMG are translated wholesale. Language-learning subjects keep
 * their target-language content and their separately authored instructions.
 */
export function applyExerciseLocalizations(
  grade: number,
  subject: string,
  topics: Topic[],
): Topic[] {
  return topics.map((topic) => ({
    ...topic,
    exercises: topic.exercises.map((exercise, index) => {
      if (subject !== "math" && subject !== "science") {
        return {
          ...exercise,
          completeLocalization: true,
          preserveGermanContent: true,
          ...suffixFields("en", languageSubjectValues(exercise, subject, "en")),
          ...suffixFields("fr", languageSubjectValues(exercise, subject, "fr")),
          ...suffixFields("it", languageSubjectValues(exercise, subject, "it")),
        };
      }
      const key = `${grade}/${subject}/${topic.id}/${index}/${exercise.id}`;
      const entry = records[key];
      if (!entry || entry.sourceQuestion !== exercise.question) return exercise;

      return {
        ...exercise,
        completeLocalization: true,
        preserveGermanContent: subject !== "math" && subject !== "science" ? true : exercise.preserveGermanContent,
        ...suffixFields("en", entry.en),
        ...suffixFields("fr", entry.fr),
        ...suffixFields("it", entry.it),
      };
    }),
  }));
}
