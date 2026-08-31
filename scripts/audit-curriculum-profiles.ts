import assert from "node:assert/strict";
import {
  getCurriculumSubjectIds,
  getAvailableCurriculumSubjectIds,
  getCurriculumSystem,
  getMiDeliveryProfile,
  requiresRegionalProfile,
  requiresSchoolLanguage,
  resolveCurriculumProfile,
  createCurriculumSelection,
  parseCurriculumSelection,
  type CurriculumSelection,
  type SchoolLanguage,
  type SwissCanton,
} from "../src/lib/curriculumProfiles";

function selection(
  canton: SwissCanton,
  schoolLanguage: SchoolLanguage = "de",
  regionalProfile?: CurriculumSelection["regionalProfile"],
): CurriculumSelection {
  const curriculumSystem = getCurriculumSystem(canton, schoolLanguage);
  return { canton, schoolLanguage, curriculumSystem, regionalProfile, version: 1 };
}

const e3f5 = ["AG", "AR", "GL", "LU", "NW", "OW", "SG", "SH", "SZ", "TG", "ZG", "ZH"] as const;
const f3e5 = ["BE", "BL", "BS", "FR", "SO", "VS"] as const;

assert.equal(resolveCurriculumProfile().id, "legacy_e3_f5");
assert.deepEqual(getCurriculumSubjectIds(2), ["math", "german", "science"]);
assert.deepEqual(getCurriculumSubjectIds(3), ["math", "german", "science", "english"]);
assert.deepEqual(getCurriculumSubjectIds(5), ["math", "german", "science", "english", "french"]);
assert.deepEqual(getAvailableCurriculumSubjectIds(1), ["math", "german", "science"]);
assert.deepEqual(getAvailableCurriculumSubjectIds(4), ["math", "german", "science", "english"]);
assert.deepEqual(getAvailableCurriculumSubjectIds(6), ["math", "german", "science", "english", "french"]);

for (const canton of e3f5) {
  const resolved = resolveCurriculumProfile(selection(canton));
  assert.equal(resolved.id, "lp21_e3_f5", `${canton} must use E3/F5`);
  assert.equal(resolved.supported, true, `${canton} is covered by today's language catalogue`);
  assert.deepEqual(getCurriculumSubjectIds(3, selection(canton)).slice(-1), ["english"]);
}

for (const canton of f3e5) {
  const resolved = resolveCurriculumProfile(selection(canton));
  assert.equal(resolved.id, "lp21_f3_e5", `${canton} must use F3/E5`);
  assert.equal(resolved.supported, false, `${canton} waits for French grades 3–4`);
  assert.deepEqual(getCurriculumSubjectIds(3, selection(canton)).slice(-1), ["french"]);
}
assert.deepEqual(
  getAvailableCurriculumSubjectIds(3, selection("BE")),
  ["math", "german", "science", "english"],
  "unsupported profiles must retain the legacy catalogue until their content is ready",
);

assert.equal(resolveCurriculumProfile(selection("AI")).id, "lp21_e3_only");
assert.deepEqual(getCurriculumSubjectIds(5, selection("AI")), ["math", "german", "science", "english"]);
assert.equal(resolveCurriculumProfile(selection("UR")).id, "lp21_e3_i5_optional");
assert.deepEqual(getCurriculumSubjectIds(5, selection("UR")), ["math", "german", "science", "english"]);

assert.equal(requiresSchoolLanguage("BE"), true);
assert.equal(requiresSchoolLanguage("FR"), true);
assert.equal(requiresSchoolLanguage("VS"), true);
assert.equal(requiresSchoolLanguage("GR"), true);
assert.equal(requiresSchoolLanguage("ZH"), false);
assert.equal(getCurriculumSystem("BE", "fr"), "per");
assert.equal(resolveCurriculumProfile(selection("BE", "fr")).id, "unsupported_per");
assert.equal(getCurriculumSystem("TI", "it"), "piano_di_studio");
assert.equal(resolveCurriculumProfile(selection("TI", "it")).id, "unsupported_piano_di_studio");

const gr = selection("GR", "de", "de_italian");
assert.equal(requiresRegionalProfile("GR", gr.curriculumSystem), true);
assert.equal(resolveCurriculumProfile(gr).id, "lp21_gr_de_i3_e5");
assert.equal(resolveCurriculumProfile(gr).supported, false);
assert.equal(resolveCurriculumProfile(selection("GR", "de", "de_romansh_grade1")).id, "lp21_gr_de_rm1_e5");
assert.deepEqual(
  resolveCurriculumProfile(selection("GR", "rm", "romansh_german")).firstForeignLanguage?.weeklyLessons,
  { 3: 3, 4: 4, 5: 5, 6: 5 },
);

for (const canton of ["LU", "NW", "OW", "VS"] as const) {
  assert.equal(getMiDeliveryProfile(canton), "integrated");
}
for (const canton of ["AI", "SO"] as const) {
  assert.equal(getMiDeliveryProfile(canton), "grades_3_6");
}
assert.equal(getMiDeliveryProfile("ZH"), "grades_5_6");
assert.deepEqual(resolveCurriculumProfile(selection("ZH")).secondForeignLanguage?.weeklyLessons, { 5: 3, 6: 3 });
assert.deepEqual(resolveCurriculumProfile(selection("SZ")).firstForeignLanguage?.weeklyLessons, { 3: 2, 4: 2, 5: 2, 6: 2 });
assert.equal(resolveCurriculumProfile(selection("FR")).firstForeignLanguage?.lessonMinutes, 50);
assert.deepEqual(resolveCurriculumProfile(selection("SH")).secondForeignLanguage?.weeklyLessons, { 5: 3, 6: 2 });

const stored = createCurriculumSelection("ZH");
assert.deepEqual(parseCurriculumSelection(JSON.parse(JSON.stringify(stored))), stored);
assert.equal(parseCurriculumSelection({ canton: "XX", version: 1 }), undefined);

console.log("Curriculum profile audit passed: legacy fallback, 26 cantons, LP21 groups, exceptions and MI delivery profiles.");
