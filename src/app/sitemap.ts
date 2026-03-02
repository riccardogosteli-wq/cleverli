import { MetadataRoute } from "next";

const BASE = "https://www.cleverli.ch";

const SUBJECTS: Record<number, string[]> = {
  1: ["math", "german"],
  2: ["math", "german"],
  3: ["math", "german"],
};

const TOPICS: Record<string, string[]> = {
  "1/math": ["zahlen-1-10","addition-bis-10","subtraktion-bis-10","formen","vergleichen","muster","zahlen-bis-20"],
  "1/german": ["buchstaben","einfache-woerter","gross-kleinschreibung","reime","abc-reihenfolge","saetze-lesen"],
  "2/math": ["zahlen-bis-100","addition-bis-20","subtraktion-bis-20","einmaleins","laengen-messen","uhrzeit","geld-chf"],
  "2/german": ["nomen-artikel","verben","silben","adjektive-gr2","satzzeichen","texte-lesen"],
  "3/math": ["zahlen-bis-1000","rechnen-bis-1000","geometrie","einmaleins-komplett","division","brueche","textaufgaben"],
  "3/german": ["wortarten","adjektive","saetze","leseverstaendnis","rechtschreibung"],
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/dashboard`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  // Grade/subject pages
  for (const [grade, subjects] of Object.entries(SUBJECTS)) {
    for (const subject of subjects) {
      routes.push({
        url: `${BASE}/learn/${grade}/${subject}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.9,
      });

      // Topic pages
      const key = `${grade}/${subject}`;
      const topics = TOPICS[key] ?? [];
      for (const topic of topics) {
        routes.push({
          url: `${BASE}/learn/${grade}/${subject}/${topic}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  }

  return routes;
}
