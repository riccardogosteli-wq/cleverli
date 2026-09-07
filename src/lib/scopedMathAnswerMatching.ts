export type MathAnswerMode = "number" | "fraction" | "reduced-fraction";

function numeric(value: string): number | null {
  // Accept decimal comma/point and Swiss thousands separators, never expressions.
  const text = value.normalize("NFKC").trim().replace(/[−–]/g, "-");
  if (!/^-?(?:\d+|\d{1,3}(?:['’ ]\d{3})+)(?:[.,]\d+)?$/.test(text)) return null;
  const result = Number(text.replace(/['’ ]/g, "").replace(",", "."));
  return Number.isFinite(result) ? result : null;
}
function fraction(value: string): [number, number] | null {
  const text = value.normalize("NFKC").replace(/⁄/g, "/").replace(/[−–]/g, "-").trim();
  const match = text.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (!match) return null;
  const n = Number(match[1]), d = Number(match[2]);
  return Number.isSafeInteger(n) && Number.isSafeInteger(d) && d > 0 ? [n, d] : null;
}
function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return Math.abs(a);
}
/** Opt-in for individually reviewed records. Other exercises retain their matcher. */
export function matchScopedMathAnswer(input: string, expected: string, mode: MathAnswerMode, unit = ""): boolean {
  if (mode !== "number") {
    const a = fraction(input), b = fraction(expected);
    if (!a || !b) return false;
    if (mode === "reduced-fraction" && gcd(a[0], a[1]) !== 1) return false;
    return BigInt(a[0]) * BigInt(b[1]) === BigInt(b[0]) * BigInt(a[1]);
  }
  let text = input.trim();
  if (unit === "CHF") text = text.replace(/^CHF\s*/i, "").replace(/\s*(?:CHF|Fr\.?|Franken)$/i, "");
  const a = numeric(text), b = numeric(expected);
  return a !== null && b !== null && a === b;
}
