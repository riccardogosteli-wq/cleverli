import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { getSubjects, getTopicsForSubject } from "../src/data";
import { describedExerciseImages, exerciseImageAlt, imageLabel } from "../src/lib/imageAlt";
import type { Lang } from "../src/lib/i18n";
let placements = 0;
function inspect(dir: string) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, e.name);
    if (e.isDirectory()) { inspect(file); continue; }
    if (!/\.[jt]sx$/.test(file)) continue;
    const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node: ts.Node) {
      if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ["Image", "img"].includes(node.tagName.getText(source))) {
        placements++;
        const alt = node.attributes.properties.find(a => ts.isJsxAttribute(a) && a.name.getText(source) === "alt") as ts.JsxAttribute | undefined;
        assert.ok(alt?.initializer, `${file}: missing alt`);
        const value = alt.initializer.getText(source);
        assert.ok(!['"Aufgabe"', '"Trophy"', '"Rewards"', '{s.key}', '{s.id}', '{subjectId}', '{s.subject}', '{subject}'].includes(value), `${file}: weak alt ${value}`);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
}
inspect("src");
const langs: Lang[] = ["de", "fr", "it", "en"];
for (const lang of langs) {
  for (const key of ["logo", "mascot", "avatar", "star", "stars"] as const) assert.ok(imageLabel(key, lang).length > 0);
  const alt = exerciseImageAlt("/images/animals/Fisch.svg", lang);
  assert.ok(alt.length > 10);
  assert.ok(!/wasser|water|eau|acqua/i.test(alt), "Fish habitat answer must not appear in alt");
}
assert.equal(new Set(langs.map(l => exerciseImageAlt("/images/animals/Fisch.svg", l))).size, 4);
let illustrations = 0;
for (let grade = 1; grade <= 6; grade++) for (const subject of getSubjects(grade)) for (const topic of getTopicsForSubject(grade, subject.id)) for (const exercise of topic.exercises) {
  if (!exercise.image) continue;
  illustrations++;
  assert.ok((describedExerciseImages as readonly string[]).includes(exercise.image), `Add a reviewed description for ${exercise.id}: ${exercise.image}`);
}
const nav = readFileSync("src/components/Navigation.tsx", "utf8");
assert.match(nav, /href="\/dashboard"\s+aria-label=\{tr\("learnNav"\)\}/);
assert.ok(nav.includes('aria-label={tr("navRewardsShort")}'));
const memory = readFileSync("src/components/exercises/MemoryGame.tsx", "utf8");
assert.ok(memory.includes('isFlipped ? card.label : "verdeckt"'), "Do not expose hidden card labels");
assert.ok(memory.includes('alt=""'), "Card image duplicates visible/accessible card label");
for (const file of ["src/components/exercises/MultipleChoice.tsx", "src/components/exercises/FillInBlank.tsx", "src/app/daily/PageClient.tsx"]) assert.ok(readFileSync(file,"utf8").includes("exerciseImageAlt("));
console.log(`PASS: ${placements} image placements, ${illustrations} canonical main illustration(s), four-language descriptions, answer protection and labelled navigation.`);
