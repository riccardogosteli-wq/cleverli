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
  [/\b2 Katzen \+ 3 Katzen = wie viele\?/g, "2 gatti + 3 gatti = quanti?"],
  [/\bAnna ha 3 Bonbons, Lena ha 5\. Quanti insieme\?/g, "Anna ha 3 caramelle, Lena ne ha 5. Quante sono insieme?"],
  [/\bIm Korb liegen (\d+) Äpfel e (\d+) Birnen\. Quanti Früchte sono il\?/g, "Nel cesto ci sono $1 mele e $2 pere. Quanti frutti sono?"],
  [/\bTim ha 3 Murmeln\. Er findet ancora 4\. Dann verliert er 2\. Quanti ha er adesso\?/g, "Tim ha 3 biglie. Ne trova altre 4. Poi ne perde 2. Quante ne ha adesso?"],
  [/\bQuale zwei numeri ergeben insieme 10\? Beide müssen più grande come 5 sein\./g, "Quali due numeri danno insieme 10? Entrambi devono essere maggiori di 5."],
  [/\bIn un Wald sono 4 Hasen e 3 Füchse\. Un weiterer volpe viene\. Quanti animali sono es adesso\?/g, "Nel bosco ci sono 4 lepri e 3 volpi. Arriva un'altra volpe. Quanti animali ci sono adesso?"],
  [/\bMorgen backt Oma 3 Kuchen, übermorgen ancora 5\. Zusammen werden es ___ Kuchen\./g, "Domani la nonna prepara 3 torte, dopodomani altre 5. In totale saranno ___ torte."],
  [/\bWenn 4 \+ 6 = 10, cosa è dann 6 \+ 4\?/g, "Se 4 + 6 = 10, quanto fa 6 + 4?"],
  [/\bIch denke an una numero\. Wenn ich 4 dazuzähle, erhalte ich 9\. Quale numero è es\?/g, "Penso a un numero. Se aggiungo 4, ottengo 9. Quale numero è?"],
  [/\bcinque uccelli sitzen su un Ast\. tre fliegen weg, dann kommen zwei neue\. Quanti uccelli sitzen adesso sul Ast\?/g, "Cinque uccelli sono su un ramo. Tre volano via, poi arrivano due nuovi uccelli. Quanti uccelli sono adesso sul ramo?"],
  [/\bLena ha gleich viele Stifte wie Mia\. Lena ha 4\. Zusammen hanno sie ___ Stifte\./g, "Lena ha tante matite quante Mia. Lena ne ha 4. Insieme hanno ___ matite."],
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
    reviewCriteria: exercise.reviewCriteriaEN ?? exercise.reviewCriteria,
  };
  if (lang === "fr") return {
    ...exercise,
    question: exercise.questionFR ?? exercise.question,
    hints: exercise.hintsFR ?? exercise.hints,
    options: exercise.optionsFR ?? exercise.options,
    answer: resolveLocalizedAnswer(exercise, exercise.optionsFR, exercise.answerFR),
    reviewCriteria: exercise.reviewCriteriaFR ?? exercise.reviewCriteria,
  };
  if (lang === "it") return cleanItalianExercise({
    ...exercise,
    question: exercise.questionIT ?? exercise.question,
    hints: exercise.hintsIT ?? exercise.hints,
    options: exercise.optionsIT ?? exercise.options,
    answer: resolveLocalizedAnswer(exercise, exercise.optionsIT, exercise.answerIT),
    reviewCriteria: exercise.reviewCriteriaIT ?? exercise.reviewCriteria,
  });
  return exercise;
}
