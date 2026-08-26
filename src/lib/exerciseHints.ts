import type { Exercise, ExerciseType } from "@/types/exercise";

type HintLanguage = "de" | "en" | "fr" | "it";

const SAFE_HINTS: Record<HintLanguage, Record<ExerciseType, [string, string]>> = {
  de: {
    "multiple-choice": [
      "Lies die Frage und alle Antwortmöglichkeiten sorgfältig.",
      "Schliesse unpassende Antworten aus und vergleiche die übrigen.",
    ],
    "fill-in-blank": [
      "Lies den ganzen Satz und überlege, welcher Eintrag zur Lücke passt.",
      "Prüfe, ob dein Eintrag inhaltlich und sprachlich zum Satz passt.",
    ],
    "self-review": [
      "Nutze den Satzanfang und Wörter aus diesem Thema.",
      "Lies deine Antwort nochmals und prüfe jeden Teil der Aufgabe.",
    ],
    counting: [
      "Zähle die Dinge der Reihe nach und zeige dabei auf jedes genau einmal.",
      "Zähle zur Kontrolle noch einmal langsam nach.",
    ],
    matching: [
      "Vergleiche die Begriffe und suche zuerst ein eindeutiges Paar.",
      "Prüfe am Schluss, ob jedes Element genau einmal zugeordnet ist.",
    ],
    memory: [
      "Merke dir die Positionen und suche nach zusammengehörenden Paaren.",
      "Beginne mit einem Paar, an dessen Positionen du dich sicher erinnerst.",
    ],
    "drag-drop": [
      "Vergleiche jedes Element mit den möglichen Zielbereichen.",
      "Ordne zuerst die eindeutigen Elemente zu und prüfe danach den Rest.",
    ],
    "number-line": [
      "Achte auf Startwert, Endwert und Schrittweite des Zahlenstrahls.",
      "Zähle die Schritte von einer bekannten Markierung aus.",
    ],
    "word-search": [
      "Suche waagrecht und senkrecht nach den gesuchten Wörtern.",
      "Achte auf den ersten und letzten Buchstaben jedes Wortes.",
    ],
  },
  en: {
    "multiple-choice": [
      "Read the question and every answer choice carefully.",
      "Rule out choices that do not fit, then compare the remaining ones.",
    ],
    "fill-in-blank": [
      "Read the whole sentence and think about what fits in the blank.",
      "Check that your solution fits the meaning and grammar of the sentence.",
    ],
    "self-review": [
      "Use the sentence starter and words from this topic.",
      "Read your answer again and check every part of the task.",
    ],
    counting: [
      "Count in order and point to each item exactly once.",
      "Count everything again slowly to check your result.",
    ],
    matching: [
      "Compare the terms and start with one pair you know for sure.",
      "Check that every item has been matched exactly once.",
    ],
    memory: [
      "Remember the positions and look for pairs that belong together.",
      "Start with a pair whose positions you remember clearly.",
    ],
    "drag-drop": [
      "Compare each item with the possible target areas.",
      "Place the clearest items first, then check the remaining ones.",
    ],
    "number-line": [
      "Check the start, end and step size of the number line.",
      "Count the steps from a number you already know.",
    ],
    "word-search": [
      "Search across and down for the requested words.",
      "Look for the first and last letter of each word.",
    ],
  },
  fr: {
    "multiple-choice": [
      "Lis attentivement la question et toutes les réponses proposées.",
      "Écarte les réponses qui ne conviennent pas, puis compare les autres.",
    ],
    "fill-in-blank": [
      "Lis toute la phrase et réfléchis à ce qui convient dans le blanc.",
      "Vérifie que ta solution convient au sens et à la grammaire de la phrase.",
    ],
    "self-review": [
      "Utilise le début de phrase et les mots de ce thème.",
      "Relis ta réponse et vérifie chaque partie de l'exercice.",
    ],
    counting: [
      "Compte dans l’ordre en montrant chaque élément une seule fois.",
      "Recompte lentement pour vérifier ton résultat.",
    ],
    matching: [
      "Compare les termes et commence par une paire certaine.",
      "Vérifie que chaque élément est associé une seule fois.",
    ],
    memory: [
      "Mémorise les positions et cherche les paires qui vont ensemble.",
      "Commence par une paire dont tu connais bien les positions.",
    ],
    "drag-drop": [
      "Compare chaque élément avec les zones possibles.",
      "Place d’abord les éléments évidents, puis vérifie les autres.",
    ],
    "number-line": [
      "Observe le début, la fin et le pas de la droite numérique.",
      "Compte les pas à partir d’un nombre que tu connais.",
    ],
    "word-search": [
      "Cherche les mots horizontalement et verticalement.",
      "Repère la première et la dernière lettre de chaque mot.",
    ],
  },
  it: {
    "multiple-choice": [
      "Leggi attentamente la domanda e tutte le risposte possibili.",
      "Escludi le risposte non adatte e confronta quelle rimaste.",
    ],
    "fill-in-blank": [
      "Leggi tutta la frase e pensa a cosa può stare nello spazio.",
      "Controlla che il tuo inserimento sia corretto per senso e grammatica.",
    ],
    "self-review": [
      "Usa l'inizio della frase e le parole di questo argomento.",
      "Rileggi la risposta e controlla ogni parte dell'esercizio.",
    ],
    counting: [
      "Conta in ordine indicando ogni elemento una sola volta.",
      "Conta di nuovo lentamente per controllare il risultato.",
    ],
    matching: [
      "Confronta i termini e inizia da una coppia sicura.",
      "Controlla che ogni elemento sia abbinato una sola volta.",
    ],
    memory: [
      "Ricorda le posizioni e cerca le coppie che vanno insieme.",
      "Inizia da una coppia di cui ricordi bene le posizioni.",
    ],
    "drag-drop": [
      "Confronta ogni elemento con le possibili aree di destinazione.",
      "Sistema prima gli elementi evidenti, poi controlla gli altri.",
    ],
    "number-line": [
      "Osserva l’inizio, la fine e il passo della linea dei numeri.",
      "Conta i passi partendo da un numero che conosci.",
    ],
    "word-search": [
      "Cerca le parole in orizzontale e in verticale.",
      "Osserva la prima e l’ultima lettera di ogni parola.",
    ],
  },
};

const META_REVEAL_PATTERN = /\b(?:die antwort|die lösung|gesucht ist|richtig ist|the answer|the solution|correct is|la réponse|la solution|il faut trouver|la bonne réponse|la risposta|la soluzione|devi trovare|la risposta corretta)\b/i;
const APPROVED_SAFE_HINTS = new Set(Object.values(SAFE_HINTS).flatMap((byType) => Object.values(byType).flat()));

export function isApprovedSafeHint(hint: string): boolean {
  return APPROVED_SAFE_HINTS.has(hint);
}

function normalise(value: string): string {
  return value.toLocaleLowerCase().replace(/\s+/g, " ").trim();
}

function hintContainsAnswer(hint: string, answer: string): boolean {
  const normalisedHint = normalise(hint);
  const normalisedAnswer = normalise(answer);
  const commonShortAnswers = new Set(["die", "der", "das", "den", "dem", "ein", "eine", "und", "was", "wer", "er", "es", "in", "an", "zu"]);
  const candidates = [normalisedAnswer, ...normalisedAnswer.split(/\s*(?:\/|;|—)\s*/)]
    .filter((candidate, index, values) => candidate && values.indexOf(candidate) === index);

  return candidates.some((candidate) => {
    if (/^-?\d+(?:[.,]\d+)?$/.test(candidate)) {
      return new RegExp(`(^|[^\\d])${candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\d]|$)`).test(normalisedHint);
    }
    if (candidate.length < 3 || commonShortAnswers.has(candidate)) return false;
    const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`, "u").test(normalisedHint);
  });
}

function hintIsBroken(hint: string, answer: string): boolean {
  const normalisedAnswer = normalise(answer);
  if (!hint.trim()) return true;
  if (hintContainsAnswer(hint, answer)) return true;
  if (["all", "done"].includes(normalisedAnswer) && normalise(hint).includes(normalisedAnswer)) return true;
  if (META_REVEAL_PATTERN.test(hint)) return true;
  if (/\b(?:(?:das wort|die antwort|die lösung)\s+beginnt mit|erst(?:e|en|er) (?:silbe|buchstabe)|schlüsselbegriff|(?:word|answer|solution)\s+starts with|first (?:letter|syllable)|(?:mot|réponse|solution)\s+commence par|première (?:lettre|syllabe)|(?:parola|risposta|soluzione)\s+inizia con|prima (?:lettera|sillaba))\b/i.test(hint)) return true;
  if (/^(?:beginnt mit|starts with|commence par [«'\"]|inizia con)\b/i.test(hint.trim())) return true;
  if (/\b(?:sind falsch|ist falsch|are (?:wrong|incorrect)|is (?:wrong|incorrect)|sont (?:fausses|incorrectes)|est (?:fausse|incorrecte)|sono (?:sbagliate|errate)|è (?:sbagliata|errata))\b/i.test(hint)) return true;
  if (/\.\.|!!|\?\?|,,/.test(hint)) return true;
  if (/^-?\d+(?:[.,]\d+)?$/.test(answer.trim()) && /wort|buchstab|word|letter|mot|lettre|parola/i.test(hint)) return true;
  if ([">", "<", "="].includes(answer.trim()) && /buchstab|letter|lettre/i.test(hint)) return true;
  return false;
}

function sanitiseHintList(
  exercise: Exercise,
  hints: string[] | undefined,
  answer: string,
  language: HintLanguage,
): string[] {
  if (!hints) return [...SAFE_HINTS[language][exercise.type]];
  const fallbacks = SAFE_HINTS[language][exercise.type];
  const candidates = hints.slice(0, 2);

  return fallbacks.map((fallback, index) => {
    const candidate = candidates[index] ?? "";
    return hintIsBroken(candidate, answer) ? fallback : candidate.trim();
  });
}

function localisedAnswer(exercise: Exercise, language: HintLanguage): string {
  if (language === "de") return exercise.answer;
  const explicit = language === "en" ? exercise.answerEN : language === "fr" ? exercise.answerFR : exercise.answerIT;
  if (explicit) return explicit;

  const options = language === "en" ? exercise.optionsEN : language === "fr" ? exercise.optionsFR : exercise.optionsIT;
  const answerIndex = exercise.options?.findIndex((option) => option === exercise.answer) ?? -1;
  return answerIndex >= 0 ? (options?.[answerIndex] ?? exercise.answer) : exercise.answer;
}

/**
 * Repairs unsafe mechanical hints at the shared data boundary. Source exercises stay
 * untouched, while every consumer (app, exports and QA tooling) receives two safe hints.
 */
export function sanitiseExerciseHints(exercise: Exercise): Exercise {
  return {
    ...exercise,
    hints: sanitiseHintList(exercise, exercise.hints, exercise.answer, "de"),
    hintsEN: sanitiseHintList(exercise, exercise.hintsEN, localisedAnswer(exercise, "en"), "en"),
    hintsFR: sanitiseHintList(exercise, exercise.hintsFR, localisedAnswer(exercise, "fr"), "fr"),
    hintsIT: sanitiseHintList(exercise, exercise.hintsIT, localisedAnswer(exercise, "it"), "it"),
  };
}
