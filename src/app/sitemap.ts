import { MetadataRoute } from "next";

const BASE = "https://www.cleverli.ch";

const SUBJECTS: Record<number, string[]> = {
  1: ["math", "german", "science"],
  2: ["math", "german", "science"],
  3: ["math", "german", "science"],
};

const TOPICS: Record<string, string[]> = {
  // Grade 1
  "1/math":    ["zahlen-1-10","addition-bis-10","subtraktion-bis-10","formen","vergleichen","muster","zahlen-bis-20"],
  "1/german":  ["buchstaben","einfache-woerter","gross-kleinschreibung","reime","abc-reihenfolge","saetze-lesen"],
  "1/science": ["tiere","jahreszeiten","mein-koerper","pflanzen-gr1","fuenf-sinne","familie-gemeinschaft","verkehr-sicherheit","zeit-uhr-gr1","wochentage-monate-gr1"],
  // Grade 2
  "2/math":    ["zahlen-bis-100","addition-bis-20","subtraktion-bis-20","einmaleins","laengen-messen","uhrzeit","geld-chf"],
  "2/german":  ["nomen-artikel","verben","silben","adjektive-gr2","satzzeichen","texte-lesen"],
  "2/science": ["lebewesen","wasser","gesunde-ernaehrung","lebensraeume","schweiz-symbole","berufe","uhr-viertel-gr2","kalender-gr2"],
  // Grade 3
  "3/math":    ["zahlen-bis-1000","rechnen-bis-1000","geometrie","einmaleins-komplett","division","brueche","textaufgaben"],
  "3/german":  ["wortarten","adjektive","saetze","leseverstaendnis","rechtschreibung"],
  "3/science": ["unsere-erde","materialien","licht-schatten","umwelt-nachhaltigkeit","schweizer-geschichte","demokratie","energie","uhr-24h-gr3","kalender-gr3"],
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    // Public marketing pages — indexable
    { url: BASE,                lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/login`,     lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/signup`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    // NOTE: /dashboard, /trophies, /rewards, /daily, /family, /kids, /parents
    //       are in-app pages (localStorage-dependent) — excluded from sitemap + marked noindex in their metadata
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
