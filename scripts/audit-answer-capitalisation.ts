import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { matchOrderedTextAnswer } from "../src/lib/fillInBlankMatching";

// Parse the actual shared component, so a reintroduced conditional or sentence
// default fails for every blank, not only a lowercase-answer test fixture.
const file = process.argv[2] ?? "src/components/exercises/FillInBlank.tsx";
const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let inputs = 0;
function visit(node: ts.Node) {
  if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.tagName.getText(source) === "input") {
    inputs++;
    const attr = node.attributes.properties.find(p => ts.isJsxAttribute(p) && p.name.getText(source) === "autoCapitalize");
    assert.ok(attr && ts.isJsxAttribute(attr) && attr.initializer && ts.isStringLiteral(attr.initializer), "Answer input needs an explicit, unconditional autocapitalize setting");
    assert.equal(attr.initializer.text, "off", "A sentence-capitalising keyboard is wrong for a mid-sentence blank");
  }
  ts.forEachChild(node, visit);
}
visit(source);
assert.equal(inputs, 1);
const cases: [string,string,boolean][] = [
  ["werde","werde",true], ["Werde","werde",true],
  ["Baum","Baum",true], ["Ich komme morgen.","Ich komme morgen.",true],
  ["Äpfel","Äpfel",true], ["très bien","très bien",true],
  ["the tree","the tree",true], ["l'albero","l'albero",true],
  ["-7","−7",true], ["3,5","3,5",true], ["42","42",true],
  ["werden","werde",false], ["Baum der","der Baum",false], ["!","?",false],
];
for (const [actual,expected,correct] of cases) assert.equal(matchOrderedTextAnswer(actual,expected),correct,JSON.stringify([actual,expected]));
console.log(JSON.stringify({sharedAnswerInputs: inputs,automaticCapitals:"off",matchingRegressions:cases.length,caseMatchingUnchanged:true}));
