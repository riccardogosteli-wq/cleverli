const FAQ_KEYS = [
  ["faqQ1", "faqA1"],
  ["faqQ2", "faqA2"],
  ["faqQ3", "faqA3"],
  ["faqQ4", "faqA4"],
  ["faqQ5", "faqA5"],
] as const;

export interface HomepageFaqItem {
  question: string;
  answer: string;
}

// Resolve once per render, using the same locale/fallback as the visible page.
export function getHomepageFaq(tr: (key: string) => string): HomepageFaqItem[] {
  return FAQ_KEYS.map(([question, answer]) => ({ question: tr(question), answer: tr(answer) }));
}

export function homepageFaqSchema(items: readonly HomepageFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://www.cleverli.ch/#faq",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

// Prevent HTML script termination while retaining exact strings after JSON.parse.
export function serializeHomepageFaq(items: readonly HomepageFaqItem[]): string {
  return JSON.stringify(homepageFaqSchema(items))
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
