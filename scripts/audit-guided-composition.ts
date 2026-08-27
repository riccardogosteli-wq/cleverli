import { readFileSync } from "node:fs";
import { getTopics } from "../src/data";
import { localizeExercise } from "../src/lib/exerciseLocalization";
import type { Exercise } from "../src/types/exercise";

const API_SNAPSHOT = process.env.LP21_API_SNAPSHOT ?? "/tmp/cleverli-lp21-live.json";
const failures: string[] = [];

const expectedAnswers: Record<number, string[]> = {
  1: [
    "Der Hund schläft.", "Mia trägt einen Schirm.", "Der Apfel liegt im Korb.", "Lina malt ein Haus.", "Der Vogel sitzt auf dem Ast.",
    "schläft", "Frühstück", "Schnee", "Wasser", "Stift", "Heute spiele ich draussen.", "Wir gehen nach Hause.", "Kommst du mit?", "Bitte füttere die Katze.", "Einkaufsliste",
    "all", "all", "all", "all", "all", "Zuerst sitzt der Vogel im Nest. Dann fliegt er los.", "Noah fährt mit dem roten Velo.", "Die schwarze Katze sitzt unter dem Baum.", "ein grosses gelbes Haus", "schnell über die Wiese",
    "und", "und", "Dann", "Dann", "Darum", "Liebe Mia", "Liebe Grüsse, Noah", "Buch, Ball, Farbstifte", "Name: Amir", "Danke für das schöne Geschenk!",
    "1. Der Ball rollt weg. 2. Mia läuft hinterher. 3. Sie fängt ihn.", "1. Es beginnt zu regnen. 2. Leo öffnet den Schirm. 3. Er bleibt trocken.", "1. Sara pflanzt einen Samen. 2. Sie giesst ihn. 3. Eine Blume wächst.", "Am Morgen findet Ben seinen Schlüssel nicht.", "Dort findet sie die Mütze.",
    "Der mutige Hund", "Kuchen backen", "Noah sieht einen kleinen Igel im Laub.", "Ich bin auf dem Spielplatz und komme um fünf zurück.", "Mia spielt im Garten.", "Der Hase rennt.", "Wo ist mein Heft?", "Sie", "Er", "Zuerst baut Mia einen Turm. Dann fällt er um. Mia baut ihn noch einmal.",
  ],
  2: [
    "leise durch den dunklen Wald", "in der Küche einen Apfelkuchen", "Nora liest unter dem grossen Baum ein Buch.", "Der junge Hund jagt im Park dem gelben Ball nach.", "Nach der Schule treffe ich Mia auf dem Spielplatz.",
    "und", "aber", "weil", "Dann", "aber", "Eines Morgens hörte Lio ein leises Klopfen am Fenster.", "Erleichtert nimmt Mara den Kater in den Arm.", "Unser Tag im Zoo", "So faltest du ein Papierboot", "Liebe Oma",
    "all", "all", "all", "all", "all", "1. Der Wecker klingelt. 2. Ava steht auf. 3. Sie zieht sich an.", "1. Jan mischt den Teig. 2. Er füllt ihn in die Form. 3. Der Kuchen kommt in den Ofen.", "Es schneit, darum bauen wir einen Schneemann.", "Nina ist müde, aber sie liest noch eine Seite.", "Leo hat ein Velo. Er putzt es.",
    "der eigentliche Brieftext", "Anrede – Brieftext – Gruss – Name", "Komm am Samstag um 14 Uhr zu mir. Wir feiern meinen Geburtstag.", "Hallo Mia, ich warte um 15 Uhr beim Brunnen. Gruss, Lea", "Würfle einmal und ziehe deine Figur um die gewürfelte Zahl vor.",
    "Wald – Pilz – Reh", "Gäste – Spiele – Kuchen – Geschenk", "Ein Tag am See", "Er entdeckt ein nasses Kätzchen unter der Bank.", "Müde und zufrieden fuhren wir nach Hause.", "weil", "aber", "Danach", "Trotzdem wanderten wir weiter.", "Am Abend löste ich meine Mathematikaufgaben.",
    "Nora gab Mia das Buch in der Bibliothek.", "Der nasse Hund trottete langsam zur Tür.", "Mia öffnet die Schachtel. Darin findet sie einen Ring.", "Zuerst fülle ich Erde in den Topf. Dann setze ich die Pflanze ein. Zum Schluss giesse ich sie.", "Am Montag besuchen wir den Zoo.",
    "Mit dieser Anleitung faltest du aus einem Blatt einen Papierflieger.", "Der Igel hat braune Stacheln und rollt sich bei Gefahr zusammen.", "Am Morgen entdeckt Lio eine Spur im Schnee. Er folgt ihr bis zum Gartenhaus. Dort findet er seine Katze.", "Liebe Sara, komm bitte am Mittwoch um 14 Uhr zu mir zum Basteln. Liebe Grüsse, Nina", "Falte danach die obere Ecke bis zur Mittellinie.",
  ],
};

const languageFields = [
  ["de", "question", "answer", "options", "hints"],
  ["en", "questionEN", "answerEN", "optionsEN", "hintsEN"],
  ["fr", "questionFR", "answerFR", "optionsFR", "hintsFR"],
  ["it", "questionIT", "answerIT", "optionsIT", "hintsIT"],
] as const;

const normalize = (value: string) => value.toLocaleLowerCase("de-CH").replace(/[^\p{L}\p{N}]+/gu, " ").trim();

function validateExercise(grade: number, exercise: Exercise, index: number): void {
  const expectedId = `g${grade}gs${index + 1}`;
  if (exercise.id !== expectedId) failures.push(`Grade ${grade} position ${index + 1}: expected ${expectedId}, found ${exercise.id}`);
  if (exercise.answer !== expectedAnswers[grade][index]) failures.push(`${exercise.id}: answer drift; expected «${expectedAnswers[grade][index]}», found «${exercise.answer}»`);
  const expectedDifficulty = index < 15 ? 1 : index < 35 ? 2 : 3;
  if (exercise.difficulty !== expectedDifficulty) failures.push(`${exercise.id}: expected difficulty ${expectedDifficulty}`);
  if ((index < 3) !== Boolean(exercise.free)) failures.push(`${exercise.id}: free flag does not match first-three rule`);
  if (!(["multiple-choice", "fill-in-blank", "drag-drop"] as string[]).includes(exercise.type)) failures.push(`${exercise.id}: unsupported composition type ${exercise.type}`);
  if (!exercise.preserveGermanContent) failures.push(`${exercise.id}: German target content is not protected from automatic localisation cleanup`);

  for (const [language, questionField, answerField, optionsField, hintsField] of languageFields) {
    const question = exercise[questionField];
    const answer = exercise[answerField] ?? exercise.answer;
    const languageHints = exercise[hintsField] ?? exercise.hints;
    if (!question?.trim()) failures.push(`${exercise.id}/${language}: missing question`);
    if (!answer?.trim()) failures.push(`${exercise.id}/${language}: missing answer`);
    if (!languageHints || languageHints.length !== 2 || languageHints.some(hint => !hint.trim())) failures.push(`${exercise.id}/${language}: expected two hints`);
    if (language !== "de" && question === exercise.question) failures.push(`${exercise.id}/${language}: untranslated instruction`);
    const normalizedAnswer = normalize(answer);
    if (languageHints.some(hint => new RegExp(`(?:^| )${normalizedAnswer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?: |$)`, "u").test(normalize(hint))) && normalizedAnswer.length > 0) failures.push(`${exercise.id}/${language}: hint reveals answer`);

    if (exercise.type === "multiple-choice") {
      const options = exercise[optionsField] ?? exercise.options;
      if (!options || options.length !== 4 || new Set(options).size !== 4) failures.push(`${exercise.id}/${language}: invalid options`);
      if (options && !options.includes(answer)) failures.push(`${exercise.id}/${language}: answer not present in options`);
    }
  }

  if (exercise.type === "fill-in-blank") {
    for (const [, questionField] of languageFields) {
      const question = exercise[questionField] ?? exercise.question;
      if ((question.match(/___/g) ?? []).length !== 1) failures.push(`${exercise.id}/${questionField}: fill-in must contain exactly one blank`);
    }
    if (exercise.answer.length <= 2 && !new RegExp(`(?:\\(|/|→|«)[^»)]*${exercise.answer}`, "iu").test(exercise.question) && !/(Verbinde|Ersetze)/.test(exercise.question)) {
      failures.push(`${exercise.id}: short fill-in answer is not sufficiently constrained by the prompt`);
    }
  }

  if (exercise.type === "drag-drop") {
    const items = exercise.dragItems ?? [];
    const zones = exercise.dropZones ?? [];
    if (items.length < 3 || items.length !== zones.length) failures.push(`${exercise.id}: invalid ordering item/zone count`);
    if (new Set(items.map(item => item.id)).size !== items.length || new Set(zones.map(zone => zone.id)).size !== zones.length) failures.push(`${exercise.id}: duplicate drag IDs`);
    items.forEach((item, itemIndex) => {
      if (exercise.dropAnswers?.[item.id] !== zones[itemIndex]?.id) failures.push(`${exercise.id}: incorrect ordered mapping for ${item.id}`);
    });
  }

  for (const language of ["en", "fr", "it"] as const) {
    const localized = localizeExercise(exercise, language);
    if (localized.answer !== exercise.answer) failures.push(`${exercise.id}/${language}: runtime answer changed from the German learning target`);
    if (exercise.type === "multiple-choice" && (!localized.options?.includes(localized.answer) || JSON.stringify(localized.options) !== JSON.stringify(exercise.options))) {
      failures.push(`${exercise.id}/${language}: runtime choices changed or no longer contain the answer`);
    }
    if (exercise.type === "fill-in-blank" && (localized.question.match(/___/g) ?? []).length !== 1) failures.push(`${exercise.id}/${language}: runtime fill-in lost its blank`);
  }
}

for (const grade of [1, 2]) {
  const topic = getTopics(grade, "german").find(candidate => candidate.id === `gefuehrtes-schreiben-${grade}`);
  if (!topic) {
    failures.push(`Grade ${grade}: topic missing`);
    continue;
  }
  if (topic.exercises.length !== 50) failures.push(`Grade ${grade}: expected 50 exercises, found ${topic.exercises.length}`);
  if (expectedAnswers[grade].length !== 50) failures.push(`Grade ${grade}: expected-answer registry is incomplete`);
  topic.exercises.forEach((exercise, index) => validateExercise(grade, exercise, index));

  const counts = Object.fromEntries([1, 2, 3].map(difficulty => [difficulty, topic.exercises.filter(exercise => exercise.difficulty === difficulty).length]));
  if (counts[1] !== 15 || counts[2] !== 20 || counts[3] !== 15) failures.push(`Grade ${grade}: wrong difficulty distribution ${JSON.stringify(counts)}`);
}

for (const grade of [1, 2]) {
  const all = getTopics(grade, "german").flatMap(topic => topic.exercises);
  for (const [, questionField, answerField] of languageFields) {
    const seen = new Map<string, string>();
    for (const exercise of all) {
      const structure = exercise.type === "drag-drop" ? JSON.stringify({ items: exercise.dragItems, zones: exercise.dropZones, answers: exercise.dropAnswers }) : "";
      const key = `${normalize(exercise[questionField] ?? exercise.question)}::${normalize(exercise[answerField] ?? exercise.answer)}::${structure}`;
      const previous = seen.get(key);
      if (previous && (previous.startsWith(`g${grade}gs`) || exercise.id.startsWith(`g${grade}gs`))) failures.push(`Grade ${grade}/${questionField}: duplicate ${previous}/${exercise.id}`);
      seen.set(key, exercise.id);
    }
  }
}

type Snapshot = { source: string; fetchedAt: string; nodes: Record<string, { code?: string; strukturtyp?: string; zyklus?: string }> };
const snapshot = JSON.parse(readFileSync(API_SNAPSHOT, "utf8")) as Snapshot;
const ageMs = Date.now() - new Date(snapshot.fetchedAt).getTime();
if (!snapshot.source.includes("api.lehrplan.ch") || !Number.isFinite(ageMs) || ageMs > 24 * 60 * 60 * 1000) failures.push("Authenticated LP21 snapshot is missing or older than 24 hours");
const nodes = Object.values(snapshot.nodes);
for (const code of ["D.4.B.1", "D.4.C.1", "D.4.D.1", "D.4.E.1", "D.4.F.1"]) {
  if (!nodes.some(node => node.code === code)) failures.push(`LP21 API competency ${code} is missing`);
  if (!nodes.some(node => node.strukturtyp === "Kompetenzstufe" && node.code?.startsWith(`${code}.`) && String(node.zyklus).includes("1"))) failures.push(`LP21 API competency ${code} has no Cycle 1 stage`);
}

console.log(JSON.stringify({
  topics: [1, 2].map(grade => {
    const topic = getTopics(grade, "german").find(candidate => candidate.id === `gefuehrtes-schreiben-${grade}`)!;
    return {
      grade,
      id: topic.id,
      exercises: topic.exercises.length,
      difficulties: Object.fromEntries([1, 2, 3].map(difficulty => [difficulty, topic.exercises.filter(exercise => exercise.difficulty === difficulty).length])),
      types: Object.fromEntries(["multiple-choice", "fill-in-blank", "drag-drop"].map(type => [type, topic.exercises.filter(exercise => exercise.type === type).length])),
    };
  }),
  lp21Competencies: ["D.4.B.1", "D.4.C.1", "D.4.D.1", "D.4.E.1", "D.4.F.1"],
  localisedExerciseChecks: 400,
  failures,
}, null, 2));

if (failures.length) process.exit(1);
