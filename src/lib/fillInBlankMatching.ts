const PUNCTUATION_ONLY = /^[\s.,;:!?\u0027\u0022»«…]+$/u;

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
