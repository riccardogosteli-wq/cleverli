import { writeFileSync, readFileSync } from "node:fs";
import { getSubjects, getTopics } from "../src/data";
import { cleanSpeechForLanguage } from "../src/hooks/useVoice";
import { matchOrderedTextAnswer } from "../src/lib/fillInBlankMatching";
import type { Exercise } from "../src/types/exercise";

type Severity = "High" | "Medium" | "Low";
type Finding = { severity: Severity; category: string; detail: string };
type Review = {
  grade: number;
  subjectId: string;
  topicId: string;
  exerciseId: string;
  lp21Score: number;
  lp21Value: string;
  fieldsReviewed: number;
  findings: Finding[];
  signals: string[];
};

const OUTPUT = "/tmp/cleverli-german-editorial-review.json";
const fitReport = JSON.parse(readFileSync(process.env.LP21_FIT_OUTPUT ?? "/tmp/cleverli-lp21-fit-all.json", "utf8"));
const fitByKey = new Map<string, { score: number; sheetValue: string }>(
  fitReport.fits.map((fit: { grade: number; subjectId: string; topicId: string; exerciseId: string; score: number; sheetValue: string }) => [
    `${fit.grade}/${fit.subjectId}/${fit.topicId}/${fit.exerciseId}`,
    fit,
  ]),
);

const GENERIC_HINTS = new Set([
  "Lies die Frage und alle Antwortmöglichkeiten sorgfältig.",
  "Schliesse unpassende Antworten aus und vergleiche die übrigen.",
  "Lies den ganzen Satz und überlege, welcher Eintrag zur Lücke passt.",
  "Prüfe, ob dein Eintrag inhaltlich und sprachlich zum Satz passt.",
  "Nutze den Satzanfang und Wörter aus diesem Thema.",
  "Lies deine Antwort nochmals und prüfe jeden Teil der Aufgabe.",
  "Zähle die Dinge der Reihe nach und zeige dabei auf jedes genau einmal.",
  "Zähle zur Kontrolle noch einmal langsam nach.",
  "Vergleiche die Begriffe und suche zuerst ein eindeutiges Paar.",
  "Prüfe am Schluss, ob jedes Element genau einmal zugeordnet ist.",
  "Merke dir die Positionen und suche nach zusammengehörenden Paaren.",
  "Beginne mit einem Paar, an dessen Positionen du dich sicher erinnerst.",
  "Vergleiche jedes Element mit den möglichen Zielbereichen.",
  "Ordne zuerst die eindeutigen Elemente zu und prüfe danach den Rest.",
  "Achte auf Startwert, Endwert und Schrittweite des Zahlenstrahls.",
  "Zähle die Schritte von einer bekannten Markierung aus.",
  "Suche waagrecht und senkrecht nach den gesuchten Wörtern.",
  "Achte auf den ersten und letzten Buchstaben jedes Wortes.",
]);

export const CONFIRMED_EDITORIAL_FINDINGS: Record<string, Finding[]> = {
  vs11: [{ severity: "Medium", category: "Language / typo", detail: "Hint contains the broken form «Fu-ssweg» instead of «Fussweg»." }],
  "g1-science-fuenf-sinne-s34": [{ severity: "High", category: "Language / grammar", detail: "Question says «mit einem Brille» instead of «mit einer Brille»." }],
  lm48: [{ severity: "High", category: "Language / grammar", detail: "Question says «Ein Schnecke» instead of «Eine Schnecke»." }],
  sy21: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «Kein Ecken» instead of «Keine Ecken»." }],
  n2: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «einem feminines Nomen» instead of «einem femininen Nomen»." }],
  n3: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «einem neutrales Nomen» instead of «einem neutralen Nomen»." }],
  n7: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «einem feminines Nomen» instead of «einem femininen Nomen»." }],
  n9: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «einem maskulines Nomen» instead of «einem maskulinen Nomen»." }],
  n10: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «einem feminines Nomen» instead of «einem femininen Nomen»." }],
  n11: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «einem maskulines Nomen» instead of «einem maskulinen Nomen»." }],
  n13: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «einem feminines Nomen» instead of «einem femininen Nomen»." }],
  n14: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «einem maskulines Nomen» instead of «einem maskulinen Nomen»." }],
  n15: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «einem neutrales Nomen» instead of «einem neutralen Nomen»." }],
  pr22: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «zu das Kind» instead of «zu dem Kind»." }],
  pr25: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «zu das Kind» instead of «zu dem Kind»." }],
  pr28: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «zu das Kind» instead of «zu dem Kind»." }],
  pr31: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «zu das Kind» instead of «zu dem Kind»." }],
  pr37: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «zu das Kind» instead of «zu dem Kind»." }],
  pr46: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «zu das Kind» instead of «zu dem Kind»." }],
  pr49: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «zu das Kind» instead of «zu dem Kind»." }],
  wf49: [{ severity: "High", category: "Language / grammar", detail: "Question says «ein Analogiebildung» instead of «eine Analogiebildung»." }],
  br28: [{ severity: "High", category: "Language / grammar", detail: "Question says «eine unechte Bruch» instead of «ein unechter Bruch»." }],
  "g3-german-wortarten-w32": [{ severity: "High", category: "Language / grammar", detail: "Question says «ein Interjektion» instead of «eine Interjektion»." }],
  "g3-science-umwelt-nachhaltigkeit-u6": [{ severity: "Medium", category: "Language / punctuation", detail: "Hint is missing the comma before «wenn»." }],
  rs40: [{ severity: "Medium", category: "Language / typo", detail: "Question uses «Homonim» instead of «Homonym»." }],
  "g3-german-synonyme-antonyme-sa38": [{ severity: "Medium", category: "Language / typo", detail: "Hint uses «Konret» instead of «Konkret»." }],
  ls27: [{ severity: "Medium", category: "Language / typo", detail: "Hint uses «Kompas-Nadel» instead of «Kompassnadel»." }],
  ls30: [{ severity: "Medium", category: "Language / typo", detail: "Hint uses «Wärmesstrahlung» instead of «Wärmestrahlung»." }],
  un48: [{ severity: "Medium", category: "Language / typo", detail: "Hint uses «wiedervwertet» instead of «wiederverwertet»." }],
  sg28: [{ severity: "Medium", category: "Language / typo", detail: "Question uses «Röschtigraben» instead of «Röstigraben»." }],
  g4lr3h: [{ severity: "High", category: "Language / grammar", detail: "Question says «ein invasive Art» instead of «eine invasive Art»." }],
  tech4_36: [{ severity: "High", category: "Language / grammar", detail: "Question says «eines Dampfturbine» instead of «einer Dampfturbine»." }],
  oek4_29: [{ severity: "High", category: "Language / grammar", detail: "Question says «ein invasive Art» instead of «eine invasive Art»." }],
  mk4_43: [{ severity: "Medium", category: "Language / grammar", detail: "Hint says «kein systematische Verfolgung» instead of «keine systematische Verfolgung»." }],
  g4kg2i: [{ severity: "Medium", category: "Language / typo", detail: "Hint uses «Galleproduktion» instead of «Gallenproduktion»." }],
  g4lr2d: [{ severity: "Medium", category: "Language / typo", detail: "Hint uses «Schneehas» instead of «Schneehase»." }],
  tech4_10: [{ severity: "Medium", category: "Language / typo", detail: "Hint contains the malformed word «Busturentüren»." }],
  tech4_11: [{ severity: "Medium", category: "Language / wording", detail: "Hint uses the unclear/nonstandard wording «Rundläufig»." }],
  kan4_17: [{ severity: "Medium", category: "Language / typo", detail: "Hint uses «franzöischer» instead of «französischer»." }],
  ok4_14: [{ severity: "Medium", category: "Language / typo", detail: "Question uses «Himmelrichtungen» instead of «Himmelsrichtungen»." }],
  pfl4_50: [{ severity: "High", category: "Language / grammar", detail: "Question says «Was ist pflanzliche Sekundärmetaboliten?» and has incorrect number/case agreement." }],
  g5au2d: [{ severity: "High", category: "Language / grammar", detail: "Question says «ein Erzählperspektive» instead of «eine Erzählperspektive»." }],
  "ts5-17": [{ severity: "High", category: "Language / grammar", detail: "Question says «ein Inhaltsangabe» instead of «eine Inhaltsangabe»." }],
  "eg5-19": [{ severity: "Medium", category: "Language / grammar", detail: "Question says «die milde Klimata» instead of «die milden Klimata»." }],
  "bv5-6": [{ severity: "High", category: "Language / grammar", detail: "Question says «ein Megacity» instead of «eine Megacity»." }],
  "pt5-42": [{ severity: "High", category: "Language / wording", detail: "Question uses the malformed hybrid «Was ist Island Biogeography-Theorie?»." }],
  g6sg2b: [{ severity: "High", category: "Language / grammar", detail: "Question says «die Föderalismus» instead of «der Föderalismus»." }],
  zh6_23: [{ severity: "Medium", category: "Language / punctuation", detail: "Hint is missing the comma before «falls»." }],
  g6d26: [{ severity: "Medium", category: "Language / typo", detail: "Question uses «Stammstrategegie» instead of «Stammstrategie»." }],
  g6sg3c: [{ severity: "Medium", category: "Language / typo", detail: "Question uses «Subsidiariätsprinzip» instead of «Subsidiaritätsprinzip»." }],
  g6az3k: [{ severity: "High", category: "Language / broken content", detail: "Hint ends with the truncated form «Gefrierpunktsern.»" }],
  dm6_5: [{ severity: "High", category: "Language / broken content", detail: "Question contains a Cyrillic е in «direktе Demokratie»." }],
};

const LEGACY_EDITORIAL_DEFECT = /(?:mit einem Brille|\bEin Schnecke\b|\bKein Ecken\b|einem (?:feminines|neutrales|maskulines) Nomen|zu das Kind|ein Analogiebildung|eine unechte Bruch|ein Interjektion|ein invasive Art|eines Dampfturbine|Was ist pflanzliche Sekundärmetaboliten|ein Erzählperspektive|ein Inhaltsangabe|die milde Klimata|ein Megacity|Island Biogeography-Theorie|die Föderalismus|Fu-ssweg|Homonim|Konret|Kompas-Nadel|Wärmesstrahlung|wiedervwertet|Röschtigraben|Galleproduktion|Schneehas\b|Busturentüren|Rundläufig|franzöischer|Himmelrichtungen|kein systematische Verfolgung|Stammstrategegie|Subsidiariätsprinzip|Gefrierpunktsern|direktе Demokratie)/u;

function normalise(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("de-CH").replace(/\s+/g, " ").trim();
}

function labels(exercise: Exercise): string[] {
  return [
    exercise.question,
    exercise.listeningText ?? "",
    exercise.answer,
    ...(exercise.options ?? []),
    ...(exercise.hints ?? []),
    ...(exercise.reviewCriteria ?? []),
    ...(exercise.pairs ?? []).map((item) => item.label),
    ...(exercise.dragItems ?? []).map((item) => item.label),
    ...(exercise.dropZones ?? []).map((item) => item.label),
    ...(exercise.wordList ?? []),
  ].filter(Boolean);
}

function answerAppearsInHint(exercise: Exercise): boolean {
  const answer = normalise(exercise.answer);
  if (answer.length < 2 || ["all", "done"].includes(answer)) return false;
  if (["der", "die", "das", "den", "dem", "des", "ein", "eine", "la", "le", "les", "un", "une", "in", "on", "at"].includes(answer)) return false;
  const escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return exercise.hints.some((hint) => new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`, "u").test(normalise(hint)));
}

function validateStructure(exercise: Exercise, subject: string): Finding[] {
  const findings: Finding[] = [];
  if (!exercise.question.trim()) findings.push({ severity: "High", category: "Missing content", detail: "Question is empty." });
  if (!exercise.answer.trim()) findings.push({ severity: "High", category: "Missing content", detail: "Stored answer is empty." });
  if (exercise.hints.length !== 2 || exercise.hints.some((hint) => !hint.trim())) {
    findings.push({ severity: "Medium", category: "Hints", detail: "Exercise does not provide exactly two populated hints." });
  }
  if (answerAppearsInHint(exercise)) findings.push({ severity: "High", category: "Hints", detail: "A hint directly reveals the stored answer." });
  if (exercise.hints.length === 2 && exercise.hints.every((hint) => GENERIC_HINTS.has(hint))) {
    findings.push({ severity: "Medium", category: "Hints", detail: "Both hints are generic interaction advice rather than content-specific help." });
  }
  if (["math", "science"].includes(subject) && exercise.hints.some((hint) => /(?:Das|das) (?:gesuchte )?Wort hat \d+ Buchstaben|Es ist ein einzelner Buchstabe/i.test(hint))) {
    findings.push({ severity: "Medium", category: "Hints", detail: "A maths/NMG hint gives a word-length clue instead of helping with the subject content." });
  }

  if (exercise.type === "multiple-choice") {
    const options = exercise.options ?? [];
    const exactCounts = new Map<string, number>();
    for (const option of options) exactCounts.set(option.trim(), (exactCounts.get(option.trim()) ?? 0) + 1);
    if (options.length < 2) findings.push({ severity: "High", category: "Answer options", detail: "Multiple-choice exercise has fewer than two options." });
    if (!options.includes(exercise.answer)) findings.push({ severity: "High", category: "Scoring", detail: "Stored answer is not present in the answer options." });
    if ([...exactCounts.values()].some((count) => count > 1)) {
      findings.push({ severity: "High", category: "Answer options", detail: "The same visible answer option occurs more than once." });
    }
    if (options.some((option) => /^(?:Das Gegenteil des beschriebenen Konzepts|Eine unvollständige Version des Begriffs|Ein verwandter Begriff aus einem anderen Fachgebiet|Eine mathematische Formel für Sprachregeln|Ein Lautzeichen ohne grammatische Funktion|Eine sprachliche Ausnahme ohne Regelbezug|Eine geometrische Figur ohne Zahlenwert|Ein algebraisches Symbol ohne Bedeutung|Eine logische Aussage ohne numerische Basis|all|done|Listenenede)$/i.test(option.trim()))) {
      findings.push({ severity: "Medium", category: "Answer options", detail: "Answer choices contain generic placeholder distractors instead of plausible topic-specific alternatives." });
    }
    const countTerms = (value: string) => value.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
    const answerTerms = countTerms(exercise.answer);
    if (options.some((option) => option !== exercise.answer && ((answerTerms >= 4 && countTerms(option) === 1) || (answerTerms >= 7 && countTerms(option) <= 2)))) {
      findings.push({ severity: "Medium", category: "Answer options", detail: "A distractor is structurally much shorter than the correct answer and makes the solution too obvious." });
    }
  }

  if (exercise.type === "fill-in-blank") {
    const blanks = (exercise.question.match(/___/g) ?? []).length;
    if (blanks > 1) findings.push({ severity: "High", category: "Scoring / interaction", detail: `${blanks} visible blanks are scored through one input field and one stored answer.` });
    if (blanks === 1) {
      const [prefix, suffix] = exercise.question.split("___");
      const answer = normalise(exercise.answer).replace(/[^\p{L}\p{N}]+/gu, " ").trim();
      const prefixTail = normalise(prefix).replace(/[^\p{L}\p{N}]+/gu, " ").trim().split(" ").slice(-2).join(" ");
      const suffixHead = normalise(suffix).replace(/[^\p{L}\p{N}]+/gu, " ").trim().split(" ").slice(0, 2).join(" ");
      if (prefixTail.length >= 6 && suffixHead.length >= 6 && answer.includes(prefixTail) && answer.includes(suffixHead)) {
        findings.push({ severity: "High", category: "Scoring / answer", detail: "Stored answer appears to contain sentence text outside the blank rather than only the missing fragment." });
      }
    }
    const answerWords = normalise(exercise.answer)
      .replace(/[^\p{L}\p{N}-]+/gu, " ")
      .split(/\s+/)
      .filter(Boolean);
    if (answerWords.length > 1) {
      const reversed = answerWords.toReversed().join(" ");
      if (reversed !== answerWords.join(" ") && matchOrderedTextAnswer(reversed, exercise.answer)) {
        findings.push({ severity: "High", category: "Scoring / interaction", detail: "The fill-in checker accepts an arbitrary word order as correct." });
      }
      if (/^(?:der|die|das|den|dem|des|ein|eine|einen|einem|einer)\b/i.test(exercise.answer.trim())) {
        const missingArticle = exercise.answer.trim().replace(/^\S+\s+/, "");
        if (matchOrderedTextAnswer(missingArticle, exercise.answer)) {
          findings.push({ severity: "High", category: "Scoring / interaction", detail: "The fill-in checker accepts omission of the leading German article." });
        }
      }
    }
  }

  if (["matching", "memory"].includes(exercise.type)) {
    const pairs = exercise.pairs ?? [];
    if (pairs.length < 2 || new Set(pairs.map((item) => item.id)).size !== pairs.length) findings.push({ severity: "High", category: "Interaction structure", detail: "Pair exercise has too few pairs or duplicate pair IDs." });
  }
  if (exercise.type === "drag-drop") {
    const items = exercise.dragItems ?? [];
    const zones = exercise.dropZones ?? [];
    const answers = exercise.dropAnswers ?? {};
    const itemIds = new Set(items.map((item) => item.id));
    const zoneIds = new Set(zones.map((zone) => zone.id));
    if (!items.length || !zones.length || Object.keys(answers).length !== items.length || Object.entries(answers).some(([item, zone]) => !itemIds.has(item) || !zoneIds.has(zone))) {
      findings.push({ severity: "High", category: "Interaction structure", detail: "Drag/drop items, zones and answer mapping are incomplete or inconsistent." });
    }
  }
  if (exercise.type === "number-line") {
    const value = Number(exercise.answer.replace(",", "."));
    if (exercise.numberMin == null || exercise.numberMax == null || exercise.numberStep == null || !Number.isFinite(value) || value < exercise.numberMin || value > exercise.numberMax) {
      findings.push({ severity: "High", category: "Interaction structure", detail: "Number-line bounds, step or answer are invalid." });
    }
  }
  if (exercise.type === "word-search" && (!(exercise.wordList?.length) || !exercise.gridSize)) findings.push({ severity: "High", category: "Interaction structure", detail: "Word search has no word list or grid size." });
  if (exercise.type === "self-review" && !(exercise.reviewCriteria?.length)) findings.push({ severity: "High", category: "Scoring / interaction", detail: "Self-review exercise has no review criteria." });
  return findings;
}

function validateLanguage(exercise: Exercise): Finding[] {
  const findings: Finding[] = [];
  const text = labels(exercise).join(" \n ");
  if (/ß/.test(text)) findings.push({ severity: "High", category: "Swiss spelling", detail: "German source contains ß instead of Swiss ss." });
  if (/(?:^|\s)(?:undefined|NaN)(?:\s|$)/.test(text)) findings.push({ severity: "High", category: "Broken content", detail: "Source contains a technical placeholder value." });
  if (/\.\.\?/.test(text)) findings.push({ severity: "Medium", category: "Language / punctuation", detail: "Uses malformed two-dot question punctuation («..?»)." });
  if (/!!|\?\?|,,/.test(text)) findings.push({ severity: "Medium", category: "Language / punctuation", detail: "Contains duplicated punctuation." });
  if (/\?!/.test(text)) findings.push({ severity: "Medium", category: "Language / punctuation", detail: "Uses an over-emphatic combined question/exclamation mark («?!»)." });
  if (/ein Komma, dann klein weitergeht/i.test(text)) findings.push({ severity: "High", category: "Language / answer", detail: "Stored answer is grammatically malformed («ein Komma, dann klein weitergeht»)." });
  if (LEGACY_EDITORIAL_DEFECT.test(text)) findings.push({ severity: "High", category: "Language / confirmed regression", detail: "A confirmed German editorial defect from the final audit remains in learner-facing text." });
  return findings;
}

function validateSpeech(exercise: Exercise): Finding[] {
  const findings: Finding[] = [];
  const source = exercise.listeningText ?? exercise.question;
  const speech = cleanSpeechForLanguage(source, "de");
  if (!speech.trim()) findings.push({ severity: "High", category: "Voice", detail: "Speech preprocessing produces an empty utterance." });
  if (/___|[_#*`]|[×÷=]/.test(speech)) findings.push({ severity: "High", category: "Voice", detail: `Speech preprocessing leaves an unreadable token: «${speech.slice(0, 180)}».` });
  if (/\b(?:nach dem|vor dem)\s+(?:erste|zweite|dritte|vierte|fünfte|sechste|siebte|achte|neunte|zehnte)\s/i.test(speech)
    || /\ban\s+(?:erste|zweite|dritte|vierte|fünfte|sechste|siebte|achte|neunte|zehnte)\s+Stelle\b/i.test(speech)) {
    findings.push({ severity: "Medium", category: "Voice", detail: "Ordinal speech expansion uses a fixed adjective ending and can produce wrong German case/gender inflection." });
  }
  if (/\b\d{1,2}\s+Uhr\s+\d{1,2}\b/.test(speech) && /(?:Massstab|Verhältnis|Lehrer:Schüler|Vereinfache)/i.test(source)) {
    findings.push({ severity: "High", category: "Voice", detail: "A ratio/scale is interpreted by TTS as a clock time." });
  }
  if (speech.length > 1_500) findings.push({ severity: "Medium", category: "Voice", detail: `Spoken text is very long (${speech.length} characters) for one playback action.` });
  return findings;
}

function validateTopicSemantics(topicId: string, exercise: Exercise): Finding[] {
  const findings: Finding[] = [];
  if (/silben/.test(topicId) && /^\d+$/.test(exercise.answer.trim())) {
    const claimedCounts = exercise.hints.flatMap((hint) => [...hint.matchAll(/=\s*(\d+)\s*[!?]?/g)].map((match) => match[1]));
    if (claimedCounts.some((count) => count !== exercise.answer.trim())) {
      findings.push({ severity: "High", category: "Correctness / hint", detail: "The stored syllable count conflicts with the exercise's explicit syllable count in its hint." });
    }
  }
  return findings;
}

const reviews: Review[] = [];
const seen = new Set<string>();
let fieldsReviewed = 0;

for (let grade = 1; grade <= 6; grade += 1) {
  for (const subject of getSubjects(grade)) {
    for (const topic of getTopics(grade, subject.id)) {
      for (const exercise of topic.exercises) {
        const key = `${grade}/${subject.id}/${topic.id}/${exercise.id}`;
        if (seen.has(key)) throw new Error(`Duplicate review key ${key}`);
        seen.add(key);
        const fit = fitByKey.get(key);
        if (!fit) throw new Error(`Missing LP21 fit for ${key}`);
        const findings = [
          ...validateStructure(exercise, subject.id),
          ...validateLanguage(exercise),
          ...validateSpeech(exercise),
          ...validateTopicSemantics(topic.id, exercise),
        ];
        if (fit.score > 3) findings.push({ severity: "High", category: "LP21 level", detail: `LP21 grade-suitability score is ${fit.score}; maximum accepted score is 3.` });
        const allFields = labels(exercise);
        fieldsReviewed += allFields.length;
        reviews.push({
          grade,
          subjectId: subject.id,
          topicId: topic.id,
          exerciseId: exercise.id,
          lp21Score: fit.score,
          lp21Value: fit.sheetValue,
          fieldsReviewed: allFields.length,
          findings,
          signals: [],
        });
      }
    }
  }
}

if (reviews.length !== 13_918) throw new Error(`Expected 13,918 reviews, found ${reviews.length}`);
const counts: Record<string, number> = {};
for (const finding of reviews.flatMap((review) => review.findings)) counts[`${finding.severity}: ${finding.category}`] = (counts[`${finding.severity}: ${finding.category}`] ?? 0) + 1;
const report = {
  exercisesReviewed: reviews.length,
  fieldsReviewed,
  exercisesWithFindings: reviews.filter((review) => review.findings.length).length,
  findings: reviews.reduce((sum, review) => sum + review.findings.length, 0),
  genericHintPairs: reviews.filter((review) => review.signals.length).length,
  lp21Scores: reviews.reduce((result: Record<string, number>, review) => ({ ...result, [review.lp21Score]: (result[review.lp21Score] ?? 0) + 1 }), {}),
  counts,
  reviews,
};
writeFileSync(OUTPUT, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, reviews: undefined }, null, 2));
