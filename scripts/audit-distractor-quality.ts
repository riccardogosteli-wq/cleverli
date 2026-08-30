import { getSubjects, getTopics } from "../src/data";

const PLACEHOLDER = /^(?:Das Gegenteil des beschriebenen Konzepts|Eine unvollständige Version des Begriffs|Ein verwandter Begriff aus einem anderen Fachgebiet|Eine mathematische Formel für Sprachregeln|Ein Lautzeichen ohne grammatische Funktion|Eine sprachliche Ausnahme ohne Regelbezug|Eine geometrische Figur ohne Zahlenwert|Ein algebraisches Symbol ohne Bedeutung|Eine logische Aussage ohne numerische Basis|all|done|Listenenede)$/i;

const normalise = (value: string) => value
  .normalize("NFKC")
  .toLocaleLowerCase("de-CH")
  .replace(/[^\p{L}\p{N}]+/gu, " ")
  .trim();

const termCount = (value: string) => value.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;

const failures: string[] = [];
const gradeCounts: Record<number, number> = {};

for (let grade = 1; grade <= 6; grade += 1) {
  let multipleChoice = 0;
  for (const subject of getSubjects(grade)) {
    for (const topic of getTopics(grade, subject.id)) {
      for (const exercise of topic.exercises) {
        if (exercise.type !== "multiple-choice") continue;
        multipleChoice += 1;
        const key = `${grade}/${subject.id}/${topic.id}/${exercise.id}`;
        const options = exercise.options ?? [];
        if (!options.includes(exercise.answer)) failures.push(`${key}: answer is missing from options`);
        if (new Set(options.map(normalise)).size !== options.length) failures.push(`${key}: duplicate visible options`);
        const answerTerms = termCount(exercise.answer);
        for (const option of options) {
          if (normalise(option) === normalise(exercise.answer)) continue;
          if (PLACEHOLDER.test(option.trim())) failures.push(`${key}: placeholder distractor «${option}»`);
          const optionTerms = termCount(option);
          if ((answerTerms >= 4 && optionTerms === 1) || (answerTerms >= 7 && optionTerms <= 2)) {
            failures.push(`${key}: distractor is structurally much shorter than the answer «${option}»`);
          }
        }
      }
    }
  }
  gradeCounts[grade] = multipleChoice;
}

console.log(JSON.stringify({
  grades: gradeCounts,
  multipleChoiceExercises: Object.values(gradeCounts).reduce((sum, count) => sum + count, 0),
  failures,
}, null, 2));

if (failures.length) process.exit(1);
