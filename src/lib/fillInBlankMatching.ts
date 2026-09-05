const PUNCTUATION_ONLY = /^[\s.,;:!?\u0027\u0022»«…]+$/u;
const MINUS_SIGN_VARIANTS = /[−–—‒﹣－]/g;

function normalisePunctuation(value: string): string {
  return value.normalize("NFKC").replace(/\s+/gu, "");
}

/**
 * Returns null for ordinary text answers so the caller can continue with its
 * flexible text matcher. Punctuation-only answers must remain exact: stripping
 * punctuation would make every mark normalise to the same empty string.
 */
export function matchPunctuationOnlyAnswer(input: string, expected: string): boolean | null {
  if (!PUNCTUATION_ONLY.test(expected.trim())) return null;
  return normalisePunctuation(input) === normalisePunctuation(expected);
}

/**
 * Text answers are forgiving about case, whitespace and presentation
 * punctuation, but never about word order or required articles. Those are
 * part of the learner's answer and changing/removing them can change meaning.
 */
export function normaliseTextAnswer(value: string): string {
  return value
    .normalize("NFKC")
    .replace(MINUS_SIGN_VARIANTS, "-")
    .trim()
    .toLocaleLowerCase("de-CH")
    .replace(/[.,;:!?\u0027\u0022»«]/g, " ")
    .replace(/[|/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchOrderedTextAnswer(input: string, expected: string): boolean {
  const punctuationMatch = matchPunctuationOnlyAnswer(input, expected);
  if (punctuationMatch !== null) return punctuationMatch;
  return normaliseTextAnswer(input) === normaliseTextAnswer(expected);
}
