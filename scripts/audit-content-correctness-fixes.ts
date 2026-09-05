import { getSubjects, getTopics } from "../src/data";
import { NORMALIZED_FILL_ANSWERS } from "../src/data/normalizedTopicExercises";

const expectedFillRepairsByGrade: Record<number, number> = {
  1: 0,
  2: 16,
  // Consolidated NMG slots no longer use the legacy energy/light/map/space
  // normalizer. Keep this count tied to the normalized topics that remain.
  3: 14,
  4: 14,
  5: 0,
  6: 13,
};

const expectedFacts: Record<string, { answer: string; questionIncludes: string }> = {
  "4/kan4_6": { answer: "Italienisch", questionIncludes: "drei Amtssprachen" },
  "4/eu4_33": { answer: "Die EU hat 27 Länder; 21 davon nutzen den Euro.", questionIncludes: "EU und Eurozone" },
  "4/gk4_35": { answer: "Glarus und Appenzell Innerrhoden", questionIncludes: "zwei Kantonen" },
  "4/mk4_28": { answer: "Migranten", questionIncludes: "Migrantinnen" },
  "4/ms4_42": { answer: "Kohlenstoff", questionIncludes: "organische Chemie" },
  "4/rr4_8": { answer: "Bernhard", questionIncludes: "Alpenpass der Römer" },
  "5/kb5-39": { answer: "Beim freien Fall wirkt nach dem Loslassen nur die Schwerkraft; ein Wurf startet mit einer Anfangsgeschwindigkeit.", questionIncludes: "freien Fall und Wurf" },
  "5/eg5-21": { answer: "Die 21 EU-Länder, die den Euro als Währung verwenden", questionIncludes: "Eurozone" },
  "5/eg5-25": { answer: "Ein Raum aus 29 Ländern, in dem es normalerweise keine Kontrollen an den Binnengrenzen gibt", questionIncludes: "Schengen-Raum" },
  "5/sp5-43": { answer: "Legislative, Exekutive und Judikative teilen die Staatsmacht und kontrollieren sich gegenseitig", questionIncludes: "Gewaltenteilung" },
  "5/nh5-37": { answer: "Ein Designprinzip, bei dem Materialien in biologischen oder technischen Kreisläufen bleiben", questionIncludes: "Cradle-to-Cradle" },
  "6/ko6_9": { answer: "Es ist der kleinste Kontinent und vollständig von Ozeanen umgeben", questionIncludes: "Australien" },
  "6/mf6_42": { answer: "nicht bindend", questionIncludes: "UN-Migrationspakt" },
};

const stalePatterns = [
  "Eurozone: 20",
  "Schengen: 27",
  "CH stimmte zu",
  "grösste Insel zugleich",
  "Keine Gewaltentrennung zwischen Exekutive und Legislative",
  "nur Deutsch und Rätoromanisch",
];

const failures: string[] = [];
const fillRepairsByGrade: Record<number, number> = {};
const foundFacts = new Set<string>();
let exercises = 0;

for (let grade = 1; grade <= 6; grade += 1) {
  let fillRepairs = 0;
  for (const subject of getSubjects(grade)) {
    for (const topic of getTopics(grade, subject.id)) {
      for (const exercise of topic.exercises) {
        exercises += 1;
        const expectedFillAnswer = NORMALIZED_FILL_ANSWERS[exercise.question];
        if (expectedFillAnswer !== undefined) {
          fillRepairs += 1;
          if (exercise.type !== "fill-in-blank") failures.push(`${grade}/${subject.id}/${topic.id}/${exercise.id}: mapped normalized exercise is not a fill-in`);
          if (exercise.answer !== expectedFillAnswer) failures.push(`${grade}/${subject.id}/${topic.id}/${exercise.id}: expected fill answer ${expectedFillAnswer}, found ${exercise.answer}`);
          const completed = exercise.question.replace("___", exercise.answer);
          if (completed.includes("___")) failures.push(`${grade}/${subject.id}/${topic.id}/${exercise.id}: answer insertion left an unresolved blank`);
        }

        const factKey = `${grade}/${exercise.id}`;
        const expectedFact = expectedFacts[factKey];
        if (expectedFact) {
          foundFacts.add(factKey);
          if (exercise.answer !== expectedFact.answer) failures.push(`${factKey}: wrong corrected answer`);
          if (!exercise.question.includes(expectedFact.questionIncludes)) failures.push(`${factKey}: wrong corrected question`);
          if (exercise.type === "multiple-choice" && !exercise.options?.includes(exercise.answer)) failures.push(`${factKey}: corrected answer missing from options`);
        }

        const searchable = [exercise.question, exercise.answer, ...(exercise.options ?? []), ...exercise.hints].join(" ");
        for (const pattern of stalePatterns) {
          if (searchable.includes(pattern)) failures.push(`${grade}/${subject.id}/${topic.id}/${exercise.id}: stale claim remains: ${pattern}`);
        }
      }
    }
  }
  fillRepairsByGrade[grade] = fillRepairs;
  if (fillRepairs !== expectedFillRepairsByGrade[grade]) {
    failures.push(`Grade ${grade}: expected ${expectedFillRepairsByGrade[grade]} normalized fill repairs, found ${fillRepairs}`);
  }
}

for (const factKey of Object.keys(expectedFacts)) {
  if (!foundFacts.has(factKey)) failures.push(`${factKey}: corrected factual exercise not found`);
}
if (exercises !== 15_190) failures.push(`Expected 15,190 exercises, found ${exercises}`);

console.log(JSON.stringify({ exercises, normalizedFillRepairs: Object.values(fillRepairsByGrade).reduce((sum, count) => sum + count, 0), fillRepairsByGrade, correctedFactualExercises: foundFacts.size, failures: failures.length }, null, 2));
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
