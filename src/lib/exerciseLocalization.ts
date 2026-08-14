import type { Exercise } from "@/types/exercise";
import type { Lang } from "@/lib/i18n";

function resolveLocalizedAnswer(exercise: Exercise, localizedOptions?: string[], localizedAnswer?: string) {
  if (localizedAnswer) return localizedAnswer;
  if (!exercise.options || !localizedOptions || exercise.options === localizedOptions) return exercise.answer;

  const answerIndex = exercise.options.findIndex((option) => option === exercise.answer);
  return answerIndex >= 0 ? (localizedOptions[answerIndex] ?? exercise.answer) : exercise.answer;
}

const italianTextFixes: Array<[RegExp, string]> = [
  [/\bQuanti Äpfel siehst du\?/g, "Quante mele vedi?"],
  [/\bQuanti Sterne siehst du\?/g, "Quante stelle vedi?"],
  [/\bQuanti Blumen siehst du\?/g, "Quanti fiori vedi?"],
  [/\bQuanti Frösche siehst du\?/g, "Quante rane vedi?"],
  [/\bQuanti Sonnenblumen siehst du\?/g, "Quanti girasoli vedi?"],
  [/\bQuanti Api siehst du\?/g, "Quante api vedi?"],
  [/\bQuanti animali siehst du\?/g, "Quanti animali vedi?"],
  [/\bQuanti Schmetterlinge siehst du\?/g, "Quante farfalle vedi?"],
  [/\bCosa ergibt ([^?]+)\?/g, "Quanto fa $1?"],
  [/\bQuale calcolo ergibt\b/g, "Quale calcolo dà"],
  [/\bQuale numeripaar ergibt\b/g, "Quale coppia di numeri dà"],
  [/\bQuale Kombination ergibt\b/g, "Quale combinazione dà"],
  [/\bergeben zusammen\b/g, "danno insieme"],
  [/\bergeben insieme\b/g, "danno insieme"],
  [/\bergibt\b/g, "dà"],
  [/\bsiehst du\b/g, "vedi"],
  [/\bsteht prima\b/g, "viene prima"],
  [/\bsteht zuerst\b/g, "sta per primo"],
  [/\bsteht an\b/g, "sta al"],
  [/\bkommt vor\b/g, "viene prima"],
  [/\bkommt nach\b/g, "viene dopo"],
  [/\bcomes\b/g, "viene"],
  [/\bErgänzungsstück\b/g, "numero"],
  [/\bNUR\b/g, "SOLO"],
  [/\bNICHT\b/g, "NON"],
  [/\bGRÖSSTE\b/g, "più grande"],
  [/\bZweierschritten rückwärts\b/g, "passi di due all'indietro"],
  [/\brückwärts\b/g, "all'indietro"],
  [/\bZahlenstrahl\b/g, "linea dei numeri"],
  [/\bretta numerica\b/g, "linea dei numeri"],
  [/\bMitte\b/g, "centro"],
  [/\bgenau\b/g, "esattamente"],
  [/\bklein nach gross\b/g, "dal più piccolo al più grande"],
  [/\bdi klein dopo gross\b/g, "dal più piccolo al più grande"],
  [/\bdi gross dopo klein\b/g, "dal più grande al più piccolo"],
  [/\bklein\b/g, "piccolo"],
  [/\bgross\b/g, "grande"],
  [/\bGross\b/g, "Grande"],
  [/\bGerade\b/g, "Pari"],
  [/\bgerade\b/g, "pari"],
  [/\bUnpari\b/g, "Dispari"],
  [/\bunpari\b/g, "dispari"],
  [/\bZahlen\b/g, "numeri"],
  [/\bZahl\b/g, "numero"],
  [/\bnumeripaare\b/g, "coppie di numeri"],
  [/\bnumeripaar\b/g, "coppia di numeri"],
  [/\bÄpfel\b/g, "mele"],
  [/\bBirnen\b/g, "pere"],
  [/\bFrüchte\b/g, "frutti"],
  [/\bKuchen\b/g, "torte"],
  [/\bMurmeln\b/g, "biglie"],
  [/\bHasen\b/g, "lepri"],
  [/\bFüchse\b/g, "volpi"],
  [/\bWald\b/g, "bosco"],
  [/\bPlätze\b/g, "posti"],
  [/\bMünzen\b/g, "monete"],
  [/\bHälfte\b/g, "metà"],
  [/\bDoppelte\b/g, "doppio"],
  [/\bStifte\b/g, "matite"],
  [/\bSchülern\b/g, "alunni"],
  [/\bSchüler\b/g, "alunni"],
  [/\bKinder\b/g, "bambini"],
  [/\bKorb\b/g, "cesto"],
  [/\bGruppe\b/g, "gruppo"],
  [/\bReihe\b/g, "sequenza"],
  [/\bMünze\b/g, "moneta"],
  [/\bmehr\b/g, "in più"],
  [/\bweniger\b/g, "in meno"],
  [/\bbis\b/g, "a"],
  [/\bund\b/g, "e"],
  [/\boder\b/g, "o"],
  [/\bDie numero\b/g, "Il numero"],
  [/\bDie somma\b/g, "La somma"],
  [/\bDas doppio\b/g, "Il doppio"],
  [/\bIch denke an una numero\b/g, "Penso a un numero"],
  [/\bWie viel\b/g, "Quanto"],
  [/\bWelche\b/g, "Quale"],
  [/\bWas\b/g, "Cosa"],
];

function cleanItalianText(text: string) {
  return italianTextFixes.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text);
}

function cleanItalianExercise(exercise: Exercise): Exercise {
  return {
    ...exercise,
    question: cleanItalianText(exercise.question),
    hints: exercise.hints.map(cleanItalianText),
    options: exercise.options?.map(cleanItalianText),
  };
}

export function localizeExercise(exercise: Exercise, lang: Lang): Exercise {
  if (lang === "en") return {
    ...exercise,
    question: exercise.questionEN ?? exercise.question,
    hints: exercise.hintsEN ?? exercise.hints,
    options: exercise.optionsEN ?? exercise.options,
    answer: resolveLocalizedAnswer(exercise, exercise.optionsEN, exercise.answerEN),
  };
  if (lang === "fr") return {
    ...exercise,
    question: exercise.questionFR ?? exercise.question,
    hints: exercise.hintsFR ?? exercise.hints,
    options: exercise.optionsFR ?? exercise.options,
    answer: resolveLocalizedAnswer(exercise, exercise.optionsFR, exercise.answerFR),
  };
  if (lang === "it") return cleanItalianExercise({
    ...exercise,
    question: exercise.questionIT ?? exercise.question,
    hints: exercise.hintsIT ?? exercise.hints,
    options: exercise.optionsIT ?? exercise.options,
    answer: resolveLocalizedAnswer(exercise, exercise.optionsIT, exercise.answerIT),
  });
  return exercise;
}
