/** Swiss spelling for generated German copy; do not change umlauts. */
export function swissOrthography(text: string): string {
  return text.replace(/\u00df/g, "ss").replace(/\u1e9e/g, "SS");
}
