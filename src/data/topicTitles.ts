/**
 * Multilingual topic titles.
 * Key = topic id, value = { de, fr, it, en }
 * de = canonical (matches Topic.title in data files)
 */
export const TOPIC_TITLES: Record<string, Record<string, string>> = {
  // ── Math ──────────────────────────────────────────────────────────────────
  "zahlen-1-10": {
    de: "Zahlen 1–10",
    fr: "Nombres 1–10",
    it: "Numeri 1–10",
    en: "Numbers 1–10",
  },
  "zahlen-bis-20": {
    de: "Zahlen 11–20",
    fr: "Nombres 11–20",
    it: "Numeri 11–20",
    en: "Numbers 11–20",
  },
  "zahlen-bis-100": {
    de: "Zahlen bis 100",
    fr: "Nombres jusqu'à 100",
    it: "Numeri fino a 100",
    en: "Numbers up to 100",
  },
  "zahlen-bis-1000": {
    de: "Zahlen bis 1000",
    fr: "Nombres jusqu'à 1000",
    it: "Numeri fino a 1000",
    en: "Numbers up to 1000",
  },
  "rechnen-bis-1000": {
    de: "Rechnen bis 1000",
    fr: "Calcul jusqu'à 1000",
    it: "Calcolo fino a 1000",
    en: "Arithmetic up to 1000",
  },
  "addition-bis-10": {
    de: "Addition bis 10",
    fr: "Addition jusqu'à 10",
    it: "Addizione fino a 10",
    en: "Addition up to 10",
  },
  "addition-bis-20": {
    de: "Addition bis 20",
    fr: "Addition jusqu'à 20",
    it: "Addizione fino a 20",
    en: "Addition up to 20",
  },
  "subtraktion-bis-10": {
    de: "Subtraktion bis 10",
    fr: "Soustraction jusqu'à 10",
    it: "Sottrazione fino a 10",
    en: "Subtraction up to 10",
  },
  "subtraktion-bis-20": {
    de: "Subtraktion bis 20",
    fr: "Soustraction jusqu'à 20",
    it: "Sottrazione fino a 20",
    en: "Subtraction up to 20",
  },
  "einmaleins": {
    de: "Einmaleins 2er/5er/10er",
    fr: "Tables de 2, 5 et 10",
    it: "Tabelline del 2, 5 e 10",
    en: "Times tables 2×, 5×, 10×",
  },
  "einmaleins-komplett": {
    de: "Einmaleins komplett",
    fr: "Tables de multiplication complètes",
    it: "Tabelline complete",
    en: "Full times tables",
  },
  "division": {
    de: "Division",
    fr: "Division",
    it: "Divisione",
    en: "Division",
  },
  "vergleichen": {
    de: "Grösser & Kleiner",
    fr: "Plus grand & plus petit",
    it: "Maggiore e minore",
    en: "Greater & less than",
  },
  "formen": {
    de: "Formen erkennen",
    fr: "Reconnaître les formes",
    it: "Riconoscere le forme",
    en: "Recognising shapes",
  },
  "geometrie": {
    de: "Geometrie",
    fr: "Géométrie",
    it: "Geometria",
    en: "Geometry",
  },
  "muster": {
    de: "Muster & Reihen",
    fr: "Suites et motifs",
    it: "Sequenze e pattern",
    en: "Patterns & sequences",
  },
  "uhrzeit": {
    de: "Uhrzeit lesen",
    fr: "Lire l'heure",
    it: "Leggere l'orologio",
    en: "Telling the time",
  },
  "geld-chf": {
    de: "Geld & CHF",
    fr: "L'argent & CHF",
    it: "Denaro e CHF",
    en: "Money & CHF",
  },
  "laengen-messen": {
    de: "Längen messen",
    fr: "Mesurer les longueurs",
    it: "Misurare le lunghezze",
    en: "Measuring lengths",
  },
  "textaufgaben": {
    de: "Textaufgaben",
    fr: "Problèmes écrits",
    it: "Problemi scritti",
    en: "Word problems",
  },
  "brueche": {
    de: "Brüche",
    fr: "Fractions",
    it: "Frazioni",
    en: "Fractions",
  },
  // ── German / Deutsch ──────────────────────────────────────────────────────
  "buchstaben": {
    de: "Buchstaben",
    fr: "Lettres",
    it: "Lettere",
    en: "Letters",
  },
  "einfache-woerter": {
    de: "Einfache Wörter",
    fr: "Mots simples",
    it: "Parole semplici",
    en: "Simple words",
  },
  "reime": {
    de: "Reimwörter",
    fr: "Mots qui riment",
    it: "Parole in rima",
    en: "Rhyming words",
  },
  "saetze-lesen": {
    de: "Sätze lesen",
    fr: "Lire des phrases",
    it: "Leggere frasi",
    en: "Reading sentences",
  },
  "abc-reihenfolge": {
    de: "ABC & Reihenfolge",
    fr: "Alphabet & ordre",
    it: "Alfabeto e ordine",
    en: "Alphabet & ordering",
  },
  "nomen-artikel": {
    de: "Nomen mit Artikel",
    fr: "Noms avec article",
    it: "Nomi con articolo",
    en: "Nouns with articles",
  },
  "verben": {
    de: "Verben",
    fr: "Verbes",
    it: "Verbi",
    en: "Verbs",
  },
  "adjektive-gr2": {
    de: "Adjektive einsetzen",
    fr: "Utiliser les adjectifs",
    it: "Usare gli aggettivi",
    en: "Using adjectives",
  },
  "adjektive": {
    de: "Adjektive",
    fr: "Adjectifs",
    it: "Aggettivi",
    en: "Adjectives",
  },
  "silben": {
    de: "Silben zählen",
    fr: "Compter les syllabes",
    it: "Contare le sillabe",
    en: "Counting syllables",
  },
  "satzzeichen": {
    de: "Satzzeichen",
    fr: "Ponctuation",
    it: "Punteggiatura",
    en: "Punctuation",
  },
  "gross-kleinschreibung": {
    de: "Gross- und Kleinschreibung",
    fr: "Majuscules et minuscules",
    it: "Maiuscole e minuscole",
    en: "Capitalisation",
  },
  "rechtschreibung": {
    de: "Rechtschreibung",
    fr: "Orthographe",
    it: "Ortografia",
    en: "Spelling",
  },
  "saetze": {
    de: "Sätze bauen",
    fr: "Construire des phrases",
    it: "Costruire frasi",
    en: "Building sentences",
  },
  "wortarten": {
    de: "Wortarten",
    fr: "Classes de mots",
    it: "Parti del discorso",
    en: "Parts of speech",
  },
  "leseverstaendnis": {
    de: "Leseverständnis",
    fr: "Compréhension de lecture",
    it: "Comprensione della lettura",
    en: "Reading comprehension",
  },
  "texte-lesen": {
    de: "Texte lesen",
    fr: "Lire des textes",
    it: "Leggere testi",
    en: "Reading texts",
  },
};

/**
 * Returns the translated title for a topic, falling back to the German title.
 */
export function getTopicTitle(topicId: string, lang: string, fallback: string): string {
  return TOPIC_TITLES[topicId]?.[lang] ?? TOPIC_TITLES[topicId]?.["de"] ?? fallback;
}
