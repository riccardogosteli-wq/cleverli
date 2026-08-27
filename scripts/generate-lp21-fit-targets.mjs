import { readFileSync, writeFileSync } from "node:fs";

const reportPath = process.env.LP21_FIT_REPORT ?? "/tmp/cleverli-lp21-fit-all.json";
const outputPath = new URL("../src/data/lp21ApiFitTargets.json", import.meta.url);
const report = JSON.parse(readFileSync(reportPath, "utf8"));
const targets = report.fits
  .filter((fit) => fit.score >= 4)
  .map(({ grade, subjectId, topicId, exerciseId, score, code }) => ({
    grade,
    subject: subjectId,
    topic: topicId,
    id: exerciseId,
    previousScore: score,
    previousCode: code,
  }));

if (targets.length !== 743) {
  throw new Error(`Expected 743 LP21 score-4/5 targets, found ${targets.length}`);
}

writeFileSync(outputPath, `${JSON.stringify(targets, null, 2)}\n`);
console.log(`Wrote ${targets.length} targets to ${outputPath.pathname}`);
