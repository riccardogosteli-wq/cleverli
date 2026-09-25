import type { Lang } from "./i18n";

const labels = {
  de: { logo: "Cleverli, zur Startseite", mascot: "Cleverli, unser Murmeltier, winkt", avatar: "Dein Cleverli Avatar", star: "Stern", stars: "Sterne", fish: "Illustration eines Fisches", illustration: "Illustration zur Aufgabe" },
  fr: { logo: "Cleverli, accueil", mascot: "Cleverli, notre marmotte, fait un signe de la patte", avatar: "Ton avatar Cleverli", star: "étoile", stars: "étoiles", fish: "Illustration d’un poisson", illustration: "Illustration de l’exercice" },
  it: { logo: "Cleverli, pagina iniziale", mascot: "Cleverli, la nostra marmotta, saluta", avatar: "Il tuo avatar Cleverli", star: "stella", stars: "stelle", fish: "Illustrazione di un pesce", illustration: "Illustrazione dell’esercizio" },
  en: { logo: "Cleverli, home", mascot: "Cleverli, our marmot mascot, waving", avatar: "Your Cleverli avatar", star: "star", stars: "stars", fish: "Illustration of a fish", illustration: "Exercise illustration" },
} satisfies Record<Lang, Record<string, string>>;

export function imageLabel(key: keyof typeof labels.de, lang: Lang): string {
  return labels[lang][key];
}

/** Only describe visible image content. Never derive alt text from an answer or a filename. */
export const describedExerciseImages = ["/images/animals/Fisch.svg"] as const;
export function exerciseImageAlt(src: string, lang: Lang): string {
  return imageLabel(src === "/images/animals/Fisch.svg" ? "fish" : "illustration", lang);
}
