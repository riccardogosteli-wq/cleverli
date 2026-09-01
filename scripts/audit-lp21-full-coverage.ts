import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getSubjects, getTopics } from "../src/data";
import {
  createCurriculumSelection,
  getAvailableCurriculumSubjectIds,
  getCurriculumSubjectIds,
  getCurriculumSystem,
  resolveCurriculumProfile,
  type CurriculumSelection,
  type SchoolLanguage,
  type SwissCanton,
} from "../src/lib/curriculumProfiles";
import type { ExerciseType } from "../src/types/exercise";

const QA_DIR = path.join(process.cwd(), ".qa/lp21-full-coverage-2026-09-01");

const GRADES = [1, 2, 3, 4, 5, 6] as const;
const ALL_EXERCISE_TYPES: ExerciseType[] = [
  "multiple-choice",
  "fill-in-blank",
  "self-review",
  "counting",
  "matching",
  "memory",
  "drag-drop",
  "number-line",
  "word-search",
];

type SelectionCase = {
  label: string;
  selection: CurriculumSelection;
  expectedSupport: boolean;
  expectedProfile: string;
  productStatus: "live_supported" | "guarded_unsupported";
  reason: string;
};

function selection(
  canton: SwissCanton,
  schoolLanguage: SchoolLanguage,
  regionalProfile?: CurriculumSelection["regionalProfile"],
): CurriculumSelection {
  return createCurriculumSelection(canton, schoolLanguage, regionalProfile);
}

const liveE3F5: SwissCanton[] = ["AG", "AR", "GL", "LU", "NW", "OW", "SG", "SH", "SZ", "TG", "ZG", "ZH"];
const liveF3E5: SwissCanton[] = ["BE", "BL", "BS", "FR", "SO", "VS"];
const perOnly: SwissCanton[] = ["GE", "JU", "NE", "VD"];

const selectionCases: SelectionCase[] = [
  ...liveE3F5.map((canton) => ({
    label: `${canton}-DE`,
    selection: selection(canton, "de"),
    expectedSupport: true,
    expectedProfile: "lp21_e3_f5",
    productStatus: "live_supported" as const,
    reason: "LP21 German-school profile: English from grade 3, French from grade 5.",
  })),
  ...liveF3E5.map((canton) => ({
    label: `${canton}-DE`,
    selection: selection(canton, "de"),
    expectedSupport: true,
    expectedProfile: "lp21_f3_e5",
    productStatus: "live_supported" as const,
    reason: "LP21 French-first profile: French from grade 3, English from grade 5.",
  })),
  {
    label: "AI-DE",
    selection: selection("AI", "de"),
    expectedSupport: true,
    expectedProfile: "lp21_e3_only",
    productStatus: "live_supported",
    reason: "LP21 exception: English from grade 3; no required second primary foreign language.",
  },
  {
    label: "UR-DE",
    selection: selection("UR", "de"),
    expectedSupport: true,
    expectedProfile: "lp21_e3_i5_optional",
    productStatus: "live_supported",
    reason: "LP21 exception: English from grade 3; optional Italian from grade 5 is not required content.",
  },
  ...perOnly.map((canton) => ({
    label: `${canton}-FR`,
    selection: selection(canton, "fr"),
    expectedSupport: false,
    expectedProfile: "unsupported_per",
    productStatus: "guarded_unsupported" as const,
    reason: "PER canton, not LP21 product scope yet.",
  })),
  ...(["BE", "FR", "VS"] as const).map((canton) => ({
    label: `${canton}-FR`,
    selection: selection(canton, "fr"),
    expectedSupport: false,
    expectedProfile: "unsupported_per",
    productStatus: "guarded_unsupported" as const,
    reason: "French-school-language region uses PER, not LP21 product scope yet.",
  })),
  {
    label: "TI-IT",
    selection: selection("TI", "it"),
    expectedSupport: false,
    expectedProfile: "unsupported_piano_di_studio",
    productStatus: "guarded_unsupported",
    reason: "Ticino uses Piano di studio, not LP21 product scope yet.",
  },
  ...[
    ["GR-DE Italian region", selection("GR", "de", "de_italian"), "lp21_gr_de_i3_e5"],
    ["GR-DE Romansh region", selection("GR", "de", "de_romansh"), "lp21_gr_de_rm3_e5"],
    ["GR-DE Romansh grade 1", selection("GR", "de", "de_romansh_grade1"), "lp21_gr_de_rm1_e5"],
    ["GR-RM German region", selection("GR", "rm", "romansh_german"), "lp21_gr_rm_d3_e5"],
    ["GR-IT German region", selection("GR", "it", "italian_german"), "lp21_gr_it_d3_e5"],
  ].map(([label, grSelection, expectedProfile]) => ({
    label: label as string,
    selection: grSelection as CurriculumSelection,
    expectedSupport: false,
    expectedProfile: expectedProfile as string,
    productStatus: "guarded_unsupported" as const,
    reason: "Graubuenden needs Italian/Romansh/German-as-foreign-language regional content before honest public support.",
  })),
];

type SubjectSummary = {
  grade: number;
  subject: string;
  topics: number;
  exercises: number;
  exerciseTypes: Partial<Record<ExerciseType, number>>;
};

const failures: string[] = [];
const subjectSummaries: SubjectSummary[] = [];
const totalByType: Record<ExerciseType, number> = Object.fromEntries(ALL_EXERCISE_TYPES.map((type) => [type, 0])) as Record<ExerciseType, number>;
let totalTopics = 0;
let totalExercises = 0;
let listeningExercises = 0;
let localisedExercises = 0;

for (const grade of GRADES) {
  for (const subject of getSubjects(grade)) {
    const topics = getTopics(grade, subject.id);
    const exerciseTypes: Partial<Record<ExerciseType, number>> = {};
    let exercises = 0;
    for (const topic of topics) {
      if (!topic.curriculumCodes?.length) {
        failures.push(`${grade}/${subject.id}/${topic.id} has no curriculumCodes`);
      }
      for (const exercise of topic.exercises) {
        exercises += 1;
        totalExercises += 1;
        exerciseTypes[exercise.type] = (exerciseTypes[exercise.type] ?? 0) + 1;
        totalByType[exercise.type] += 1;
        if (exercise.listeningText) listeningExercises += 1;
        if (exercise.completeLocalization) localisedExercises += 1;
      }
    }
    totalTopics += topics.length;
    subjectSummaries.push({ grade, subject: subject.id, topics: topics.length, exercises, exerciseTypes });
  }
}

const cantonResults = selectionCases.map((testCase) => {
  const resolved = resolveCurriculumProfile(testCase.selection);
  if (resolved.supported !== testCase.expectedSupport) {
    failures.push(`${testCase.label}: expected support=${testCase.expectedSupport}, got ${resolved.supported}`);
  }
  if (resolved.id !== testCase.expectedProfile) {
    failures.push(`${testCase.label}: expected profile ${testCase.expectedProfile}, got ${resolved.id}`);
  }

  const subjectChecks = GRADES.map((grade) => {
    const desiredSubjects = getCurriculumSubjectIds(grade, testCase.selection);
    const visibleSubjects = getAvailableCurriculumSubjectIds(grade, testCase.selection);
    const missingCatalogSubjects = visibleSubjects.filter((subject) => getTopics(grade, subject).length === 0);
    if (testCase.expectedSupport && missingCatalogSubjects.length) {
      failures.push(`${testCase.label} grade ${grade}: missing catalog subjects ${missingCatalogSubjects.join(", ")}`);
    }
    return { grade, desiredSubjects, visibleSubjects, missingCatalogSubjects };
  });

  return {
    label: testCase.label,
    system: getCurriculumSystem(testCase.selection.canton, testCase.selection.schoolLanguage),
    profile: resolved.id,
    supported: resolved.supported,
    productStatus: testCase.productStatus,
    reason: testCase.reason,
    subjectChecks,
  };
});

const liveSupported = cantonResults.filter((result) => result.productStatus === "live_supported");
const guarded = cantonResults.filter((result) => result.productStatus === "guarded_unsupported");

const fullLp21SubjectAreas = [
  "Sprachen",
  "Mathematik",
  "Natur, Mensch, Gesellschaft",
  "Gestalten",
  "Musik",
  "Bewegung und Sport",
  "Medien und Informatik",
] as const;

const shippedSubjectAreas = [
  "Deutsch",
  "Mathematik",
  "NMG/Science",
  "Englisch",
  "Franzoesisch",
  "Medien und Informatik",
] as const;

const missingForFullLp21 = [
  "Gestalten is not a standalone Cleverli subject.",
  "Musik is not a standalone Cleverli subject.",
  "Bewegung und Sport is not a standalone Cleverli subject.",
  "Graubuenden regional languages need Italian/Romansh/German-as-foreign-language content before support can be unguarded.",
  "PER and Piano di studio need separate curriculum/content projects before French-school-language regions and Ticino can be called supported.",
  "Speaking/oral production is not covered as an evaluated exercise mode; writing is partly covered through self-review.",
] as const;

const report = {
  generatedAt: new Date().toISOString(),
  officialSourcesChecked: [
    "https://www.lehrplan21.ch/",
    "https://www.lehrplan21.ch/stundentafeln",
    "https://edk.ch/de/bildungssystem/kantonale-schulorganisation/kantonsumfrage/b-11-fremdsprachen-sprache-beginn",
    "https://regionalkonferenzen.ch/stundentafeln-0",
  ],
  verdict: failures.length ? "changes_requested" : "approved_with_product_gaps",
  interpretation: "Cleverli is compatible with the live-supported LP21 canton language profiles for the shipped academic subject scope. It is not a full all-Fachbereich LP21 product yet.",
  cantonCoverage: {
    liveSupportedCases: liveSupported.length,
    guardedCases: guarded.length,
    results: cantonResults,
  },
  subjectCoverage: {
    lp21FullSubjectAreas: fullLp21SubjectAreas,
    shippedSubjectAreas,
    summaries: subjectSummaries,
  },
  exerciseCoverage: {
    totalTopics,
    totalExercises,
    totalByType,
    listeningExercises,
    localisedExercises,
  },
  gapsBeforeAdaptiveRecommendations: missingForFullLp21,
  failures,
};

function formatTypeCounts(counts: Partial<Record<ExerciseType, number>>) {
  return ALL_EXERCISE_TYPES
    .filter((type) => counts[type])
    .map((type) => `${type}: ${counts[type]}`)
    .join(", ");
}

const markdown = `# LP21 Full Coverage Audit - 2026-09-01

## Verdict

${report.verdict}

Cleverli is compatible with the live-supported LP21 canton language profiles for the shipped academic subject scope. It is not a full all-Fachbereich LP21 product yet.

## Official Sources Checked

- Lehrplan 21 overview and canton-version model: https://www.lehrplan21.ch/
- Lehrplan 21 Stundentafeln: https://www.lehrplan21.ch/stundentafeln
- EDK foreign-language start survey: https://edk.ch/de/bildungssystem/kantonale-schulorganisation/kantonsumfrage/b-11-fremdsprachen-sprache-beginn
- 2025 Stundentafel comparison downloads: https://regionalkonferenzen.ch/stundentafeln-0

## Canton Coverage

- Live-supported LP21 cases: ${liveSupported.length}
- Guarded/unsupported cases: ${guarded.length}
- Publicly safe today: E3/F5, F3/E5, AI E3-only, UR E3 plus optional Italian guard.
- Correctly guarded today: PER regions/cantons, Ticino, Graubuenden regional-language profiles.

${cantonResults.map((result) => `- ${result.label}: ${result.productStatus}, ${result.profile}, ${result.reason}`).join("\n")}

## Subject / Fach Coverage

LP21 full Fachbereiche:
${fullLp21SubjectAreas.map((area) => `- ${area}`).join("\n")}

Cleverli shipped Faecher:
${shippedSubjectAreas.map((area) => `- ${area}`).join("\n")}

Current shipped catalogue by grade/subject:

| Grade | Subject | Topics | Exercises | Exercise types |
|---:|---|---:|---:|---|
${subjectSummaries.map((summary) => `| ${summary.grade} | ${summary.subject} | ${summary.topics} | ${summary.exercises} | ${formatTypeCounts(summary.exerciseTypes)} |`).join("\n")}

## Exercise-Type Coverage

- Total topics: ${totalTopics}
- Total exercises: ${totalExercises}
- Listening-stimulus exercises: ${listeningExercises}
- Fully localised exercises: ${localisedExercises}

| Type | Count |
|---|---:|
${ALL_EXERCISE_TYPES.map((type) => `| ${type} | ${totalByType[type]} |`).join("\n")}

## Gaps Before Adaptive Recommendations

${missingForFullLp21.map((gap) => `- ${gap}`).join("\n")}

## Failures

${failures.length ? failures.map((failure) => `- ${failure}`).join("\n") : "- None in the audited live-supported scope."}
`;

mkdirSync(QA_DIR, { recursive: true });
writeFileSync(path.join(QA_DIR, "coverage.json"), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(path.join(QA_DIR, "REPORT.md"), markdown);

console.log(JSON.stringify({
  verdict: report.verdict,
  liveSupportedCases: liveSupported.length,
  guardedCases: guarded.length,
  totalTopics,
  totalExercises,
  totalByType,
  listeningExercises,
  localisedExercises,
  gaps: missingForFullLp21.length,
  failures: failures.length,
  report: path.relative(process.cwd(), path.join(QA_DIR, "REPORT.md")),
}, null, 2));

if (failures.length) process.exit(1);
