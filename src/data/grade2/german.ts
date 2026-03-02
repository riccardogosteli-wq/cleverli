import { Topic } from "@/types/exercise";

const grade2German: Topic[] = [
  {
    id: "nomen-artikel",
    title: "Nomen mit Artikel",
    emoji: "📝",
    exercises: [
      { id: "n1", type: "multiple-choice", question: "___ Hund bellt laut.", answer: "Der", options: ["Der","Die","Das","Ein"], hints: ["Hund ist männlich (maskulin) → der"], difficulty: 1, free: true },
      { id: "n2", type: "multiple-choice", question: "___ Katze schläft.", answer: "Die", options: ["Der","Die","Das","Eine"], hints: ["Katze ist weiblich (feminin) → die"], difficulty: 1, free: true },
      { id: "n3", type: "multiple-choice", question: "___ Kind spielt.", answer: "Das", options: ["Der","Die","Das"], hints: ["Kind ist sächlich (neutral) → das"], difficulty: 1, free: true },
      { id: "n4", type: "multiple-choice", question: "___ Apfel ist rot.", answer: "Der", options: ["Der","Die","Das"], hints: ["Apfel ist maskulin → der"], difficulty: 1 },
      { id: "n5", type: "multiple-choice", question: "___ Blume ist schön.", answer: "Die", options: ["Der","Die","Das"], hints: ["Blume ist feminin → die"], difficulty: 1 },
      { id: "n6", type: "multiple-choice", question: "___ Buch liegt auf dem Tisch.", answer: "Das", options: ["Der","Die","Das"], hints: ["Buch ist neutral → das"], difficulty: 1 },
      { id: "n7", type: "fill-in-blank", question: "___ Schule beginnt um 8 Uhr.", answer: "Die", hints: ["Schule ist feminin."], difficulty: 1 },
      { id: "n8", type: "multiple-choice", question: "___ Auto fährt schnell.", answer: "Das", options: ["Der","Die","Das"], hints: ["Auto ist neutral → das"], difficulty: 1 },
      { id: "n9", type: "fill-in-blank", question: "___ Baum ist gross.", answer: "Der", hints: ["Baum ist maskulin."], difficulty: 1 },
      { id: "n10", type: "multiple-choice", question: "___ Sonne scheint.", answer: "Die", options: ["Der","Die","Das"], hints: ["Sonne ist feminin → die"], difficulty: 1 },
    ],
  },
  {
    id: "verben",
    title: "Verben",
    emoji: "🏃",
    exercises: [
      { id: "v1", type: "multiple-choice", question: "Das Kind ___ (laufen) auf dem Spielplatz.", answer: "läuft", options: ["lauft","läuft","laufen","lief"], hints: ["er/sie/es + laufen → läuft"], difficulty: 2, free: true },
      { id: "v2", type: "multiple-choice", question: "Welches Wort ist ein Verb?", answer: "schlafen", options: ["Hund","gross","schlafen","Tisch"], hints: ["Verben sind Tätigkeitswörter (was man tut)."], difficulty: 1, free: true },
      { id: "v3", type: "fill-in-blank", question: "Ich ___ (essen) ein Brot.", answer: "esse", hints: ["ich + essen → esse"], difficulty: 2, free: true },
      { id: "v4", type: "multiple-choice", question: "Wir ___ (spielen) Fussball.", answer: "spielen", options: ["spiele","spielst","spielen","spielt"], hints: ["wir + spielen → spielen"], difficulty: 1 },
      { id: "v5", type: "multiple-choice", question: "Du ___ (haben) einen Hund.", answer: "hast", options: ["habe","hast","hat","haben"], hints: ["du + haben → hast"], difficulty: 2 },
      { id: "v6", type: "fill-in-blank", question: "Er ___ (gehen) zur Schule.", answer: "geht", hints: ["er + gehen → geht"], difficulty: 2 },
      { id: "v7", type: "multiple-choice", question: "Welches ist KEIN Verb?", answer: "Schule", options: ["rennen","Schule","trinken","singen"], hints: ["Nomen (Dinge) sind keine Verben."], difficulty: 1 },
      { id: "v8", type: "fill-in-blank", question: "Sie ___ (lesen) ein Buch.", answer: "liest", hints: ["sie (Einzahl) + lesen → liest"], difficulty: 2 },
      { id: "v9", type: "multiple-choice", question: "Ich ___ (sein) müde.", answer: "bin", options: ["bin","bist","ist","sind"], hints: ["ich + sein → bin"], difficulty: 2 },
      { id: "v10", type: "fill-in-blank", question: "Das Baby ___ (schlafen).", answer: "schläft", hints: ["er/sie/es + schlafen → schläft"], difficulty: 2 },
    ],
  },
  {
    id: "silben",
    title: "Silben zählen",
    emoji: "👏",
    exercises: [
      { id: "s1", type: "multiple-choice", question: "Wie viele Silben hat 'Apfel'?", answer: "2", options: ["1","2","3","4"], hints: ["Ap-fel: klatschen beim Sprechen hilft!"], difficulty: 1, free: true },
      { id: "s2", type: "multiple-choice", question: "Wie viele Silben hat 'Schule'?", answer: "2", options: ["1","2","3","4"], hints: ["Schu-le"], difficulty: 1, free: true },
      { id: "s3", type: "multiple-choice", question: "Wie viele Silben hat 'Katze'?", answer: "2", options: ["1","2","3","4"], hints: ["Kat-ze"], difficulty: 1, free: true },
      { id: "s4", type: "multiple-choice", question: "Wie viele Silben hat 'Hund'?", answer: "1", options: ["1","2","3","4"], hints: ["Hund — nur ein Klatscher!"], difficulty: 1 },
      { id: "s5", type: "multiple-choice", question: "Wie viele Silben hat 'Schokolade'?", answer: "4", options: ["2","3","4","5"], hints: ["Scho-ko-la-de"], difficulty: 2 },
      { id: "s6", type: "fill-in-blank", question: "Wie viele Silben hat 'Elefant'?", answer: "3", hints: ["E-le-fant"], difficulty: 2 },
      { id: "s7", type: "multiple-choice", question: "Wie viele Silben hat 'Tisch'?", answer: "1", options: ["1","2","3","4"], hints: ["Tisch — ein Klatscher."], difficulty: 1 },
      { id: "s8", type: "fill-in-blank", question: "Wie viele Silben hat 'Schmetterlinge'?", answer: "4", hints: ["Schmet-ter-lin-ge"], difficulty: 3 },
    ],
  },
];

export default grade2German;
