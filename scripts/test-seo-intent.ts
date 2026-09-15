import assert from "node:assert/strict";
import { getTopicsForSubject } from "../src/data";
import { GRADE_SUBJECT_SEO_PAGES, getGradeSubjectSeoPage } from "../src/lib/gradeSubjectSeo";
import { getGradeSeoSamples } from "../src/lib/gradeSeoSamples";
import { getSampleExercises } from "../src/lib/seoContent";
let checks = 0;
const page = getGradeSubjectSeoPage("einmaleins-uebungen-2-klasse")!;
const topics = getTopicsForSubject(2, "math");
const before = JSON.stringify(topics);
const examples = getGradeSeoSamples(page, topics);
assert.equal(examples.length, 5); checks++;
assert.equal(new Set(examples.map(x => x.question)).size, 5); checks++;
assert.deepEqual(examples.map(x => String(x.answer)), ["6", "20", "70", "16", "30"]); checks++;
for (const example of examples) {
  const match = example.question.match(/^(2|5|10) × (\d+) = /)!;
  assert.ok(match, example.question); checks++;
  assert.equal(Number(example.answer), Number(match[1]) * Number(match[2])); checks++;
  assert.ok(Number(example.answer) <= 100 && example.difficulty === 1); checks++;
  if (example.options) { assert.equal(new Set(example.options).size, example.options.length); assert.equal(example.options.filter(x => x === example.answer).length, 1); checks += 2; }
  assert.ok(example.explanation?.includes(`= ${example.answer}`)); checks++;
  assert.deepEqual(topics.find(t => t.id === "einmaleins")!.exercises.find(e => e.id === example.id)?.question, example.question); checks++;
}
assert.equal(JSON.stringify(topics), before); checks++;
assert.throws(() => getGradeSeoSamples({ ...page, sampleRefs: [{ topicId: "missing", exerciseId: "missing", explanation: "" }] }, topics), /Missing SEO sample/); checks++;
for (const other of GRADE_SUBJECT_SEO_PAGES.filter(x => x.slug !== page.slug)) {
  const ts = getTopicsForSubject(other.grade, other.subject);
  const original = ts.flatMap(t => getSampleExercises(t, 2).map(e => ({ ...e, topicTitle: t.title }))).filter(e => Boolean(e.question)).slice(0, 5);
  assert.deepEqual(getGradeSeoSamples(other, ts), original); checks++;
}
for (const slug of ["mathe-uebungen-3-klasse", "deutsch-uebungen-3-klasse"]) {
  const p = getGradeSubjectSeoPage(slug)!;
  assert.equal(p.detailItems?.length, 3); checks++;
  for (const item of p.detailItems!) {
    const [, , grade, subject, topicId] = item.link!.href.split("/");
    assert.ok(getTopicsForSubject(Number(grade), subject).some(t => t.id === topicId)); checks++;
    assert.ok(!/[ß]|[–—]/.test(item.body)); checks++;
  }
  assert.equal(p.ctaHref, slug.startsWith("mathe") ? "/learn/3/math/zahlen-bis-1000" : "/learn/3/german/wortarten"); checks++;
}
assert.ok(getTopicsForSubject(3, "math").find(t => t.id === "zahlen-bis-1000")!.exercises.some(e => e.question === "500 + 60 + 3 = ___" && e.answer === "563")); checks++;
assert.ok(getTopicsForSubject(3, "german").find(t => t.id === "wortarten")!.exercises.some(e => e.question === "Welche Wortart ist «Hund»?" && e.answer === "Nomen")); checks++;
console.log(`${checks} SEO intent deterministic assertions passed against the final runtime exercise pipeline.`);
