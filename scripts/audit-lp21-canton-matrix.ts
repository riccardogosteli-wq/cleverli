import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getTopics } from "../src/data";
import {
  CANTON_NAMES,
  createCurriculumSelection,
  getAvailableCurriculumSubjectIds,
  getCurriculumSubjectIds,
  getCurriculumSystem,
  resolveCurriculumProfile,
  type CurriculumSelection,
  type GraubuendenRegionalProfile,
  type SchoolLanguage,
  type SwissCanton,
  SWISS_CANTONS,
} from "../src/lib/curriculumProfiles";

const QA_DIR = path.join(process.cwd(), ".qa/lp21-canton-matrix-2026-09-01");
const GRADES = [1, 2, 3, 4, 5, 6] as const;
const FRENCH_ONLY_PER_CANTONS = new Set<SwissCanton>(["GE", "JU", "NE", "VD"]);

type MatrixCase = {
  key: string;
  canton: SwissCanton;
  schoolLanguage: SchoolLanguage;
  regionalProfile?: GraubuendenRegionalProfile;
  note: string;
};

const multilingualRows: MatrixCase[] = [
  { key: "BE-DE", canton: "BE", schoolLanguage: "de", note: "German-school-language region; LP21 supported." },
  { key: "BE-FR", canton: "BE", schoolLanguage: "fr", note: "French-school-language region; PER guarded." },
  { key: "FR-DE", canton: "FR", schoolLanguage: "de", note: "German-school-language region; LP21 supported." },
  { key: "FR-FR", canton: "FR", schoolLanguage: "fr", note: "French-school-language region; PER guarded." },
  { key: "VS-DE", canton: "VS", schoolLanguage: "de", note: "German-school-language region; LP21 supported." },
  { key: "VS-FR", canton: "VS", schoolLanguage: "fr", note: "French-school-language region; PER guarded." },
  { key: "GR-DE-I", canton: "GR", schoolLanguage: "de", regionalProfile: "de_italian", note: "Graubuenden German school with Italian first foreign language; guarded until Italian content exists." },
  { key: "GR-DE-RM", canton: "GR", schoolLanguage: "de", regionalProfile: "de_romansh", note: "Graubuenden German school with Romansh from grade 3; guarded until Romansh content exists." },
  { key: "GR-DE-RM1", canton: "GR", schoolLanguage: "de", regionalProfile: "de_romansh_grade1", note: "Graubuenden German school with Romansh from grade 1; guarded until Romansh content exists." },
  { key: "GR-RM-DE", canton: "GR", schoolLanguage: "rm", regionalProfile: "romansh_german", note: "Romansh-school-language region; guarded until German-as-foreign/Romansh support exists." },
  { key: "GR-IT-DE", canton: "GR", schoolLanguage: "it", regionalProfile: "italian_german", note: "Italian-school-language region; guarded until German-as-foreign/Italian support exists." },
];

const baseRows: MatrixCase[] = SWISS_CANTONS
  .filter((canton) => !["BE", "FR", "VS", "GR"].includes(canton))
  .map((canton) => ({
    key: canton === "TI" ? "TI-IT" : FRENCH_ONLY_PER_CANTONS.has(canton) ? `${canton}-FR` : `${canton}-DE`,
    canton,
    schoolLanguage: canton === "TI" ? "it" : FRENCH_ONLY_PER_CANTONS.has(canton) ? "fr" : "de",
    note: canton === "TI"
      ? "Piano di studio guarded."
      : FRENCH_ONLY_PER_CANTONS.has(canton)
        ? "French-school-language canton; PER guarded."
        : "Default LP21 German-school-language row.",
  }));

const matrixCases = [...baseRows, ...multilingualRows].sort((a, b) => a.key.localeCompare(b.key));
const failures: string[] = [];

function selectionFor(row: MatrixCase): CurriculumSelection {
  return createCurriculumSelection(row.canton, row.schoolLanguage, row.regionalProfile);
}

function subjectLabel(subjectId: string) {
  return ({
    math: "Math",
    german: "Deutsch",
    science: "NMG",
    english: "Englisch",
    french: "Franzoesisch",
    italian: "Italienisch",
    romansh: "Romanisch",
    mi: "MI",
  } as Record<string, string>)[subjectId] ?? subjectId;
}

function lessonPlanText(selection: CurriculumSelection) {
  const profile = resolveCurriculumProfile(selection);
  const format = (prefix: string, lang?: NonNullable<typeof profile.firstForeignLanguage>) => {
    if (!lang) return "";
    const lessons = lang.weeklyLessons
      ? Object.entries(lang.weeklyLessons).map(([grade, count]) => `${grade}:${count}`).join("/")
      : "not modelled";
    return `${prefix} ${lang.language} from grade ${lang.startGrade}${lang.required ? "" : " optional"} (${lessons}, ${lang.lessonMinutes ?? 45}min)`;
  };
  return [format("L2", profile.firstForeignLanguage), format("L3", profile.secondForeignLanguage)].filter(Boolean).join("; ");
}

const rows = matrixCases.map((row) => {
  const selection = selectionFor(row);
  const profile = resolveCurriculumProfile(selection);
  const system = getCurriculumSystem(row.canton, row.schoolLanguage);
  const gradeSubjects = GRADES.map((grade) => {
    const expected = getCurriculumSubjectIds(grade, selection);
    const visible = getAvailableCurriculumSubjectIds(grade, selection);
    const missingVisible = visible.filter((subject) => getTopics(grade, subject).length === 0);
    if (profile.supported && missingVisible.length) {
      failures.push(`${row.key} grade ${grade}: visible subject has no catalogue topics: ${missingVisible.join(", ")}`);
    }
    return {
      grade,
      expected,
      visible,
      missingVisible,
    };
  });

  return {
    key: row.key,
    canton: row.canton,
    cantonName: CANTON_NAMES[row.canton],
    schoolLanguage: row.schoolLanguage,
    regionalProfile: row.regionalProfile ?? "",
    curriculumSystem: system,
    profileId: profile.id,
    productStatus: profile.supported ? "supported_in_shipped_scope" : "guarded",
    miDelivery: profile.miDelivery,
    languagePlan: lessonPlanText(selection),
    visibleByGrade: Object.fromEntries(gradeSubjects.map((item) => [
      item.grade,
      profile.supported
        ? item.visible.map(subjectLabel).join(" + ")
        : `Guarded fallback: ${item.visible.map(subjectLabel).join(" + ")}`,
    ])),
    note: row.note,
  };
});

const supported = rows.filter((row) => row.productStatus === "supported_in_shipped_scope");
const guarded = rows.filter((row) => row.productStatus === "guarded");

const report = {
  generatedAt: new Date().toISOString(),
  verdict: failures.length ? "changes_requested" : "approved",
  interpretation: "Cleverli supports the German-school-language LP21 canton profiles in its shipped academic scope. PER, Ticino/Piano di studio and Graubuenden regional-language profiles remain intentionally guarded.",
  officialSourcesChecked: [
    "https://www.lehrplan21.ch/",
    "https://www.lehrplan21.ch/stundentafeln",
    "https://edk.ch/de/bildungssystem/kantonale-schulorganisation/kantonsumfrage/b-11-fremdsprachen-sprache-beginn",
    "https://v-fe.lehrplan.ch/index.php?code=e%7C10%7C4",
  ],
  counts: {
    rows: rows.length,
    supportedRows: supported.length,
    guardedRows: guarded.length,
    lp21CantonsRepresented: new Set(rows.filter((row) => row.curriculumSystem === "lp21").map((row) => row.canton)).size,
  },
  rows,
  failures,
};

const csvHeader = [
  "key",
  "canton",
  "cantonName",
  "schoolLanguage",
  "regionalProfile",
  "curriculumSystem",
  "profileId",
  "productStatus",
  "miDelivery",
  "languagePlan",
  "grade1",
  "grade2",
  "grade3",
  "grade4",
  "grade5",
  "grade6",
  "note",
];

function csvEscape(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

const csvRows = rows.map((row) => [
  row.key,
  row.canton,
  row.cantonName,
  row.schoolLanguage,
  row.regionalProfile,
  row.curriculumSystem,
  row.profileId,
  row.productStatus,
  row.miDelivery,
  row.languagePlan,
  row.visibleByGrade[1],
  row.visibleByGrade[2],
  row.visibleByGrade[3],
  row.visibleByGrade[4],
  row.visibleByGrade[5],
  row.visibleByGrade[6],
  row.note,
]);

const markdown = `# LP21 Canton Matrix - 2026-09-01

## Verdict

${report.verdict}

${report.interpretation}

## Official Basis

- Lehrplan 21 is the common curriculum basis for the 21 German-speaking and multilingual cantons; each canton decides on its own implementation and cantonal version.
- LP21 Stundentafeln remain canton-owned: lesson time and Fachbereich structure can differ by canton.
- EDK foreign-language survey is the source for first/second foreign-language sequence and start grade.
- MI basis: Lehrplan 21 module Medien und Informatik, with Medien, Informatik and application competences; application competences are partly integrated into other Fachbereiche.

## Summary

- Matrix rows: ${rows.length}
- Supported in Cleverli shipped scope: ${supported.length}
- Guarded: ${guarded.length}
- LP21 cantons represented: ${report.counts.lp21CantonsRepresented}

## Matrix

| Row | Canton | Lang | System | Profile | Status | MI | G1 | G2 | G3 | G4 | G5 | G6 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
${rows.map((row) => `| ${row.key} | ${row.cantonName} | ${row.schoolLanguage}${row.regionalProfile ? `/${row.regionalProfile}` : ""} | ${row.curriculumSystem} | ${row.profileId} | ${row.productStatus} | ${row.miDelivery} | ${row.visibleByGrade[1]} | ${row.visibleByGrade[2]} | ${row.visibleByGrade[3]} | ${row.visibleByGrade[4]} | ${row.visibleByGrade[5]} | ${row.visibleByGrade[6]} |`).join("\n")}

## Guarded Scope

- PER rows: French-school-language BE/FR/VS plus GE/JU/NE/VD.
- Piano di studio: TI.
- Graubuenden: regional language profiles need Italian, Romansh and German-as-foreign-language content before support can be unguarded.

## Failures

${failures.length ? failures.map((failure) => `- ${failure}`).join("\n") : "- None."}
`;

mkdirSync(QA_DIR, { recursive: true });
writeFileSync(path.join(QA_DIR, "matrix.json"), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(path.join(QA_DIR, "matrix.csv"), `${csvHeader.join(",")}\n${csvRows.map((line) => line.map(csvEscape).join(",")).join("\n")}\n`);
writeFileSync(path.join(QA_DIR, "REPORT.md"), markdown);

console.log(JSON.stringify({
  verdict: report.verdict,
  rows: rows.length,
  supportedRows: supported.length,
  guardedRows: guarded.length,
  failures: failures.length,
  report: path.relative(process.cwd(), path.join(QA_DIR, "REPORT.md")),
}, null, 2));

if (failures.length) process.exit(1);
