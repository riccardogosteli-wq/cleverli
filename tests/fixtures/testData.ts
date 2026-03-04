export const TEST_ACCOUNT = {
  email: "test@cleverli.ch",
  password: "CleverliTest2026!",
};

export const BASE_URL = "https://www.cleverli.ch";

// Child profile used throughout tests
export const TEST_CHILD = {
  name: "Testino",
  grade: 1,
};

// Languages to test
export const LANGUAGES = ["de", "fr", "it", "en"] as const;

// Key i18n strings to check per language
export const I18N_CHECKS: Record<string, { selector: string; contains: string }[]> = {
  de: [
    { selector: "h1, h2, [data-testid=hero-title]", contains: "Klasse" },
  ],
  fr: [
    { selector: "h1, h2, [data-testid=hero-title]", contains: "classe" },
  ],
  it: [
    { selector: "h1, h2, [data-testid=hero-title]", contains: "classe" },
  ],
  en: [
    { selector: "h1, h2, [data-testid=hero-title]", contains: "grade" },
  ],
};

export const GRADES = [1, 2, 3, 4, 5, 6];
export const SUBJECTS = ["math", "german", "science"];
