import assert from "node:assert/strict";
import fs from "node:fs";
import { getSubjects, getTopics } from "../src/data/index";
import { getTopicSummaries } from "../src/data/topicCatalog";
import { getGradeSubjectSeo, ORGANIC_LANDING_PAGES } from "../src/lib/seoContent";
import { GRADE_SUBJECT_SEO_PAGES } from "../src/lib/gradeSubjectSeo";
import { validateLearningRoute } from "../src/lib/learningRoute";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";

process.env.NEXT_PUBLIC_CURRICULUM_PROFILES_ENABLED = "true";
process.env.NEXT_PUBLIC_CURRICULUM_PROFILES_ROLLOUT_MODE = "all";
const base = "https://www.cleverli.ch";
const rows = [];
for (let grade = 1; grade <= 6; grade++) {
  for (const { id: subject } of getSubjects(grade)) {
    const topics = getTopics(grade, subject);
    const summaries = getTopicSummaries(grade, subject);
    assert.deepEqual(summaries.map(({ id, title, exerciseCount }) => ({ id, title, count: exerciseCount })), topics.map(({ id, title, exercises }) => ({ id, title, count: exercises.length })));
    const seo = getGradeSubjectSeo(grade, subject);
    assert.ok(seo.practice.length >= 2);
    for (const title of seo.practice) assert.ok(topics.some((topic) => topic.title === title), `${grade}/${subject}: ${title}`);
    assert.ok(seo.description.includes(`${grade}. Klasse`) && seo.description.includes("kostenlos testen"));
    assert.ok(!seo.description.includes("Kostenlose"));
    assert.deepEqual(validateLearningRoute(String(grade), subject).map(({ id }) => id), topics.map(({ id }) => id));
    for (const topic of topics) validateLearningRoute(String(grade), subject, topic.id);
    rows.push({ grade, subject, description: seo.description, practice: seo.practice, topics: topics.map(({ id, title, exercises }) => ({ id, title, count: exercises.length, path: `/learn/${grade}/${subject}/${id}` })) });
  }
}
assert.equal(rows.length, 30);
assert.equal(rows.reduce((n, row) => n + row.topics.length, 0), 303);
assert.ok(!JSON.stringify(getGradeSubjectSeo(1, "math")).includes("Einmaleins"));
const invalid = [["0", "math"], ["7", "math"], ["4x", "math"], ["04", "math"], ["-1", "science"], ["1", "french"], ["2", "mi"], ["4", "not-a-subject"], ["4", "english", "not-a-topic"], ["6", "nt", "not-a-topic"]];
for (const [grade, subject, topic] of invalid) assert.throws(() => validateLearningRoute(grade, subject, topic), /NEXT_HTTP_ERROR_FALLBACK;404/);
for (let grade = 1; grade <= 6; grade++) for (const subject of ["nt", "rzg"]) {
  assert.throws(() => validateLearningRoute(String(grade), subject), /NEXT_REDIRECT/);
  for (const topic of getTopics(grade, "science")) assert.throws(() => validateLearningRoute(String(grade), subject, topic.id), /NEXT_REDIRECT/);
}
process.env.NEXT_PUBLIC_CURRICULUM_PROFILES_ENABLED = "false";
for (const grade of [3, 4]) {
  assert.throws(() => validateLearningRoute(String(grade), "french"), /NEXT_HTTP_ERROR_FALLBACK;404/);
  assert.throws(() => validateLearningRoute(String(grade), "french", getTopics(grade, "french")[0].id), /NEXT_HTTP_ERROR_FALLBACK;404/);
}
validateLearningRoute("5", "french");
process.env.NEXT_PUBLIC_CURRICULUM_PROFILES_ENABLED = "true";
const urls = sitemap().map(({ url }) => url);
assert.equal(urls.length, 361);
assert.equal(new Set(urls).size, urls.length);
assert.ok(sitemap().every((entry) => !entry.lastModified));
assert.ok(urls.includes(`${base}/blog`));
for (const row of rows) {
  assert.ok(urls.includes(`${base}/learn/${row.grade}/${row.subject}`));
  for (const topic of row.topics) assert.ok(urls.includes(`${base}${topic.path}`));
}
assert.ok(urls.every((url) => !/\/learn\/\d\/(nt|rzg)(\/|$)|\?|\/dashboard/.test(url)));
const rules = robots().rules;
assert.ok(Array.isArray(rules));
assert.deepEqual(rules[0].allow, ["/", "/_next/static/", "/_next/image"]);
assert.ok(rules[0].disallow?.includes("/api/"));
assert.ok(fs.readFileSync("src/components/ExercisePlayer.tsx", "utf8").includes("const FREE_EXERCISE_LIMIT = 20;"));
const schema = fs.readFileSync("src/components/StructuredData.tsx", "utf8");
assert.ok(!/FAQPage|screenshot|aggregateRating|priceValidUntil|billingDuration|iOS, Android/.test(schema));
assert.ok(schema.includes("UCN8EKFH2QTYlOpYld89OjQQ"));
assert.ok(!fs.readFileSync("src/app/layout.tsx", "utf8").includes("languages:"));
const landingPaths = [...new Set([...ORGANIC_LANDING_PAGES, ...GRADE_SUBJECT_SEO_PAGES].map(({ href }) => href))];
const out = { status: "pass", hubs: rows.length, topics: 303, sitemap: urls.length, rows, landingPaths, urls };
fs.mkdirSync(".qa/seo", { recursive: true });
fs.writeFileSync(".qa/seo/catalog-source.json", JSON.stringify(out, null, 2));
console.log("PASS: 30 hubs, 303 topics, 361 canonical sitemap URLs; current catalog-bound metadata; invalid routes; NT/RZG aliases; French gates; free-count unchanged.");
