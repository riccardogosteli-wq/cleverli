/**
 * Swiss curriculum profiles.
 *
 * This module deliberately contains no browser, database or UI dependencies.
 * A child keeps one stable identity and one stable set of progress records;
 * the curriculum selection only changes visibility, ordering and pacing.
 */

export const SWISS_CANTONS = [
  "AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR", "JU", "LU", "NE",
  "NW", "OW", "SG", "SH", "SO", "SZ", "TG", "TI", "UR", "VD", "VS", "ZG", "ZH",
] as const;

export type SwissCanton = (typeof SWISS_CANTONS)[number];
export type SchoolLanguage = "de" | "fr" | "it" | "rm";
export type CurriculumSystem = "lp21" | "per" | "piano_di_studio";
export type ForeignLanguage = "english" | "french" | "italian" | "romansh" | "german";
export type MiDeliveryProfile = "integrated" | "grades_5_6" | "grades_3_6";

export type CurriculumProfileId =
  | "legacy_e3_f5"
  | "lp21_e3_f5"
  | "lp21_f3_e5"
  | "lp21_e3_only"
  | "lp21_e3_i5_optional"
  | "lp21_gr_de_i3_e5"
  | "lp21_gr_de_rm3_e5"
  | "lp21_gr_de_rm1_e5"
  | "lp21_gr_rm_d3_e5"
  | "lp21_gr_it_d3_e5"
  | "unsupported_per"
  | "unsupported_piano_di_studio";

export type GraubuendenRegionalProfile =
  | "de_italian"
  | "de_romansh"
  | "de_romansh_grade1"
  | "romansh_german"
  | "italian_german";

export interface CurriculumSelection {
  canton: SwissCanton;
  schoolLanguage: SchoolLanguage;
  curriculumSystem: CurriculumSystem;
  regionalProfile?: GraubuendenRegionalProfile;
  version: 1;
}

export interface LanguageSequence {
  language: ForeignLanguage;
  startGrade: number;
  required: boolean;
  weeklyLessons?: Partial<Record<1 | 2 | 3 | 4 | 5 | 6, number>>;
  lessonMinutes?: 45 | 50;
}

export interface ResolvedCurriculumProfile {
  id: CurriculumProfileId;
  supported: boolean;
  firstForeignLanguage?: LanguageSequence;
  secondForeignLanguage?: LanguageSequence;
  miDelivery: MiDeliveryProfile;
}

export const CANTON_NAMES: Record<SwissCanton, string> = {
  AG: "Aargau", AI: "Appenzell Innerrhoden", AR: "Appenzell Ausserrhoden", BE: "Bern",
  BL: "Basel-Landschaft", BS: "Basel-Stadt", FR: "Freiburg", GE: "Genf", GL: "Glarus",
  GR: "Graubünden", JU: "Jura", LU: "Luzern", NE: "Neuenburg", NW: "Nidwalden",
  OW: "Obwalden", SG: "St. Gallen", SH: "Schaffhausen", SO: "Solothurn", SZ: "Schwyz",
  TG: "Thurgau", TI: "Tessin", UR: "Uri", VD: "Waadt", VS: "Wallis", ZG: "Zug", ZH: "Zürich",
};

export function createCurriculumSelection(
  canton: SwissCanton,
  schoolLanguage: SchoolLanguage = "de",
  regionalProfile?: GraubuendenRegionalProfile,
): CurriculumSelection {
  return {
    canton,
    schoolLanguage,
    curriculumSystem: getCurriculumSystem(canton, schoolLanguage),
    ...(regionalProfile ? { regionalProfile } : {}),
    version: 1,
  };
}

export function parseCurriculumSelection(value: unknown): CurriculumSelection | undefined {
  if (!value || typeof value !== "object") return undefined;
  const candidate = value as Partial<CurriculumSelection>;
  if (!isSwissCanton(candidate.canton)) return undefined;
  if (!candidate.schoolLanguage || !["de", "fr", "it", "rm"].includes(candidate.schoolLanguage)) return undefined;
  if (!candidate.curriculumSystem || !["lp21", "per", "piano_di_studio"].includes(candidate.curriculumSystem)) return undefined;
  if (candidate.version !== 1) return undefined;
  return {
    canton: candidate.canton,
    schoolLanguage: candidate.schoolLanguage,
    curriculumSystem: candidate.curriculumSystem,
    ...(candidate.regionalProfile ? { regionalProfile: candidate.regionalProfile } : {}),
    version: 1,
  };
}

const E3_F5_CANTONS = new Set<SwissCanton>([
  "AG", "AR", "GL", "LU", "NW", "OW", "SG", "SH", "SZ", "TG", "ZG", "ZH",
]);

const F3_E5_CANTONS = new Set<SwissCanton>(["BE", "BL", "BS", "FR", "SO", "VS"]);
const PER_ONLY_CANTONS = new Set<SwissCanton>(["GE", "JU", "NE", "VD"]);
const MI_INTEGRATED_CANTONS = new Set<SwissCanton>(["LU", "NW", "OW", "VS"]);
const MI_GRADES_3_6_CANTONS = new Set<SwissCanton>(["AI", "SO"]);

type LanguageLessonPlan = {
  first: LanguageSequence["weeklyLessons"];
  second?: LanguageSequence["weeklyLessons"];
  lessonMinutes?: 45 | 50;
};

const LANGUAGE_LESSON_PLANS: Partial<Record<SwissCanton, LanguageLessonPlan>> = {
  AG: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 3, 6: 3 } },
  AR: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 3, 6: 3 } },
  BE: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 2, 6: 2 } },
  BL: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 2, 6: 2 } },
  BS: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 2, 6: 2 } },
  FR: { first: { 3: 3, 4: 2, 5: 2, 6: 2 }, second: { 5: 2, 6: 2 }, lessonMinutes: 50 },
  GL: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 2, 6: 2 } },
  LU: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 3, 6: 3 } },
  NW: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 3, 6: 3 } },
  OW: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 3, 6: 3 } },
  SG: { first: { 3: 2, 4: 3, 5: 2, 6: 2 }, second: { 5: 2, 6: 2 }, lessonMinutes: 50 },
  SH: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 3, 6: 2 } },
  SO: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 2, 6: 2 } },
  SZ: { first: { 3: 2, 4: 2, 5: 2, 6: 2 }, second: { 5: 2, 6: 2 } },
  TG: { first: { 3: 3, 4: 2, 5: 2, 6: 2 }, second: { 5: 2, 6: 2 } },
  UR: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 2, 6: 2 } },
  VS: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 2, 6: 2 } },
  ZG: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 3, 6: 3 } },
  ZH: { first: { 3: 3, 4: 3, 5: 2, 6: 2 }, second: { 5: 3, 6: 3 } },
  AI: { first: { 3: 2, 4: 2, 5: 2, 6: 2 } },
};

function withLanguageLessonPlan(
  profile: ResolvedCurriculumProfile,
  canton: SwissCanton,
): ResolvedCurriculumProfile {
  const plan = LANGUAGE_LESSON_PLANS[canton];
  if (!plan) return profile;
  return {
    ...profile,
    firstForeignLanguage: profile.firstForeignLanguage
      ? { ...profile.firstForeignLanguage, weeklyLessons: plan.first, lessonMinutes: plan.lessonMinutes ?? 45 }
      : undefined,
    secondForeignLanguage: profile.secondForeignLanguage
      ? { ...profile.secondForeignLanguage, weeklyLessons: plan.second, lessonMinutes: plan.lessonMinutes ?? 45 }
      : undefined,
  };
}

export const LEGACY_CURRICULUM_PROFILE: ResolvedCurriculumProfile = {
  id: "legacy_e3_f5",
  supported: true,
  firstForeignLanguage: { language: "english", startGrade: 3, required: true },
  secondForeignLanguage: { language: "french", startGrade: 5, required: true },
  miDelivery: "grades_5_6",
};

export function isSwissCanton(value: unknown): value is SwissCanton {
  return typeof value === "string" && (SWISS_CANTONS as readonly string[]).includes(value);
}

export function getCurriculumSystem(canton: SwissCanton, schoolLanguage: SchoolLanguage): CurriculumSystem {
  if (canton === "TI") return "piano_di_studio";
  if (PER_ONLY_CANTONS.has(canton)) return "per";
  if (["BE", "FR", "VS"].includes(canton) && schoolLanguage === "fr") return "per";
  return "lp21";
}

export function requiresSchoolLanguage(canton: SwissCanton): boolean {
  return canton === "BE" || canton === "FR" || canton === "VS" || canton === "GR";
}

export function requiresRegionalProfile(canton: SwissCanton, curriculumSystem: CurriculumSystem): boolean {
  return canton === "GR" && curriculumSystem === "lp21";
}

export function getMiDeliveryProfile(canton: SwissCanton): MiDeliveryProfile {
  if (MI_INTEGRATED_CANTONS.has(canton)) return "integrated";
  if (MI_GRADES_3_6_CANTONS.has(canton)) return "grades_3_6";
  return "grades_5_6";
}

function resolveGraubuenden(selection: CurriculumSelection): ResolvedCurriculumProfile {
  const common = { supported: false, miDelivery: getMiDeliveryProfile("GR") } as const;
  switch (selection.regionalProfile) {
    case "de_italian":
      return {
        ...common,
        id: "lp21_gr_de_i3_e5",
        firstForeignLanguage: { language: "italian", startGrade: 3, required: true, weeklyLessons: { 3: 3, 4: 3, 5: 2, 6: 2 }, lessonMinutes: 45 },
        secondForeignLanguage: { language: "english", startGrade: 5, required: true, weeklyLessons: { 5: 2, 6: 2 }, lessonMinutes: 45 },
      };
    case "de_romansh":
      return {
        ...common,
        id: "lp21_gr_de_rm3_e5",
        firstForeignLanguage: { language: "romansh", startGrade: 3, required: true, weeklyLessons: { 3: 3, 4: 3, 5: 2, 6: 2 }, lessonMinutes: 45 },
        secondForeignLanguage: { language: "english", startGrade: 5, required: true, weeklyLessons: { 5: 2, 6: 2 }, lessonMinutes: 45 },
      };
    case "de_romansh_grade1":
      return {
        ...common,
        id: "lp21_gr_de_rm1_e5",
        firstForeignLanguage: { language: "romansh", startGrade: 1, required: true, weeklyLessons: { 1: 2, 2: 2, 3: 3, 4: 3, 5: 2, 6: 2 }, lessonMinutes: 45 },
        secondForeignLanguage: { language: "english", startGrade: 5, required: true, weeklyLessons: { 5: 2, 6: 2 }, lessonMinutes: 45 },
      };
    case "romansh_german":
      return {
        ...common,
        id: "lp21_gr_rm_d3_e5",
        firstForeignLanguage: { language: "german", startGrade: 3, required: true, weeklyLessons: { 3: 3, 4: 4, 5: 5, 6: 5 }, lessonMinutes: 45 },
        secondForeignLanguage: { language: "english", startGrade: 5, required: true, weeklyLessons: { 5: 2, 6: 2 }, lessonMinutes: 45 },
      };
    case "italian_german":
      return {
        ...common,
        id: "lp21_gr_it_d3_e5",
        firstForeignLanguage: { language: "german", startGrade: 3, required: true, weeklyLessons: { 3: 3, 4: 3, 5: 3, 6: 3 }, lessonMinutes: 45 },
        secondForeignLanguage: { language: "english", startGrade: 5, required: true, weeklyLessons: { 5: 2, 6: 2 }, lessonMinutes: 45 },
      };
    default:
      return { ...common, id: "lp21_gr_de_i3_e5" };
  }
}

export function resolveCurriculumProfile(
  selection?: CurriculumSelection | null,
): ResolvedCurriculumProfile {
  if (!selection) return LEGACY_CURRICULUM_PROFILE;

  if (selection.curriculumSystem === "per") {
    return { id: "unsupported_per", supported: false, miDelivery: getMiDeliveryProfile(selection.canton) };
  }
  if (selection.curriculumSystem === "piano_di_studio") {
    return { id: "unsupported_piano_di_studio", supported: false, miDelivery: "integrated" };
  }
  if (selection.canton === "GR") return resolveGraubuenden(selection);

  const miDelivery = getMiDeliveryProfile(selection.canton);
  if (E3_F5_CANTONS.has(selection.canton)) {
    return withLanguageLessonPlan({
      id: "lp21_e3_f5",
      supported: true,
      firstForeignLanguage: { language: "english", startGrade: 3, required: true },
      secondForeignLanguage: { language: "french", startGrade: 5, required: true },
      miDelivery,
    }, selection.canton);
  }
  if (F3_E5_CANTONS.has(selection.canton)) {
    return withLanguageLessonPlan({
      id: "lp21_f3_e5",
      supported: true,
      firstForeignLanguage: { language: "french", startGrade: 3, required: true },
      secondForeignLanguage: { language: "english", startGrade: 5, required: true },
      miDelivery,
    }, selection.canton);
  }
  if (selection.canton === "AI") {
    return withLanguageLessonPlan({
      id: "lp21_e3_only",
      supported: true,
      firstForeignLanguage: { language: "english", startGrade: 3, required: true },
      miDelivery,
    }, selection.canton);
  }
  if (selection.canton === "UR") {
    return withLanguageLessonPlan({
      id: "lp21_e3_i5_optional",
      supported: true,
      firstForeignLanguage: { language: "english", startGrade: 3, required: true },
      secondForeignLanguage: { language: "italian", startGrade: 5, required: false },
      miDelivery,
    }, selection.canton);
  }

  return LEGACY_CURRICULUM_PROFILE;
}

export function getCurriculumSubjectIds(
  grade: number,
  selection?: CurriculumSelection | null,
): string[] {
  const profile = resolveCurriculumProfile(selection);
  const subjects = ["math", "german", "science"];
  if (
    (profile.miDelivery === "grades_3_6" || profile.miDelivery === "integrated")
      ? grade >= 3 && grade <= 6
      : grade >= 5 && grade <= 6
  ) {
    subjects.push("mi");
  }
  for (const language of [profile.firstForeignLanguage, profile.secondForeignLanguage]) {
    if (!language || grade < language.startGrade || !language.required) continue;
    subjects.push(language.language);
  }
  return subjects;
}

export function getAvailableCurriculumSubjectIds(
  grade: number,
  selection?: CurriculumSelection | null,
): string[] {
  const profile = resolveCurriculumProfile(selection);
  return profile.supported
    ? getCurriculumSubjectIds(grade, selection)
    : getCurriculumSubjectIds(grade, undefined);
}
