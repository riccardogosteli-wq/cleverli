import { Topic } from "@/types/exercise";

const grade3German: Topic[] = [
  {
    id: "wortarten",
    title: "Wortarten",
    emoji: "🏷️",
    exercises: [
      { id: "w1", type: "multiple-choice", question: "Was ist 'Hund'?", answer: "Nomen", options: ["Nomen","Verb","Adjektiv"], hints: ["Nomen = Dinge, Tiere, Personen (immer gross geschrieben)"], difficulty: 1, free: true },
      { id: "w2", type: "multiple-choice", question: "Was ist 'rennen'?", answer: "Verb", options: ["Nomen","Verb","Adjektiv"], hints: ["Verben = Tätigkeiten (was man tut)"], difficulty: 1, free: true },
      { id: "w3", type: "multiple-choice", question: "Was ist 'schön'?", answer: "Adjektiv", options: ["Nomen","Verb","Adjektiv"], hints: ["Adjektive = Eigenschaften (wie etwas ist)"], difficulty: 1, free: true },
      { id: "w4", type: "multiple-choice", question: "Was ist 'Schule'?", answer: "Nomen", options: ["Nomen","Verb","Adjektiv"], hints: ["Schule ist ein Ort → Nomen, wird gross geschrieben"], difficulty: 1 },
      { id: "w5", type: "multiple-choice", question: "Was ist 'gross'?", answer: "Adjektiv", options: ["Nomen","Verb","Adjektiv"], hints: ["Gross beschreibt eine Eigenschaft."], difficulty: 1 },
      { id: "w6", type: "multiple-choice", question: "Was ist 'essen'?", answer: "Verb", options: ["Nomen","Verb","Adjektiv"], hints: ["Essen ist eine Tätigkeit."], difficulty: 1 },
      { id: "w7", type: "fill-in-blank", question: "'Blume' ist ein ___ (Nomen/Verb/Adjektiv).", answer: "Nomen", hints: ["Blume ist eine Pflanze = Ding = Nomen"], difficulty: 1 },
      { id: "w8", type: "multiple-choice", question: "Welches Wort ist ein Adjektiv?", answer: "kalt", options: ["Eis","kalt","frieren","Schnee"], hints: ["Kalt beschreibt eine Eigenschaft."], difficulty: 2 },
      { id: "w9", type: "multiple-choice", question: "Welches Wort ist ein Verb?", answer: "lachen", options: ["Freude","lustig","lachen","Clown"], hints: ["Lachen ist eine Tätigkeit."], difficulty: 1 },
      { id: "w10", type: "fill-in-blank", question: "'Schnell' ist ein ___ (Nomen/Verb/Adjektiv).", answer: "Adjektiv", hints: ["Schnell beschreibt wie jemand etwas tut."], difficulty: 2 },
    ],
  },
  {
    id: "adjektive",
    title: "Adjektive",
    emoji: "🌈",
    exercises: [
      { id: "aj1", type: "multiple-choice", question: "Das Gegenteil von 'alt' ist...?", answer: "jung", options: ["gross","jung","schnell","laut"], hints: ["Alt ↔ Jung"], difficulty: 1, free: true },
      { id: "aj2", type: "multiple-choice", question: "Das Gegenteil von 'laut' ist...?", answer: "leise", options: ["schnell","stark","leise","gross"], hints: ["Laut ↔ Leise"], difficulty: 1, free: true },
      { id: "aj3", type: "fill-in-blank", question: "Das Gegenteil von 'kalt' ist ___.", answer: "warm", hints: ["Kalt ↔ ?"], difficulty: 1, free: true },
      { id: "aj4", type: "multiple-choice", question: "Welches Adjektiv passt? Der ___ Hund bellt.", answer: "grosse", options: ["grossen","grosse","grosser","gross"], hints: ["Vor Nomen: der grosse..."], difficulty: 2 },
      { id: "aj5", type: "fill-in-blank", question: "Das Gegenteil von 'dunkel' ist ___.", answer: "hell", hints: ["Dunkel ↔ Hell"], difficulty: 1 },
      { id: "aj6", type: "multiple-choice", question: "Welches passt? Die Katze ist ___.", answer: "weich", options: ["weich","rennen","Fell","schlafen"], hints: ["Es muss eine Eigenschaft sein."], difficulty: 1 },
      { id: "aj7", type: "fill-in-blank", question: "Das Gegenteil von 'traurig' ist ___.", answer: "fröhlich", hints: ["Wenn man lacht, ist man..."], difficulty: 1 },
      { id: "aj8", type: "multiple-choice", question: "Was ist kein Adjektiv?", answer: "springen", options: ["schnell","blau","springen","rund"], hints: ["Adjektive beschreiben Eigenschaften, Verben Tätigkeiten."], difficulty: 2 },
      { id: "aj9", type: "fill-in-blank", question: "Das Gegenteil von 'lang' ist ___.", answer: "kurz", hints: ["Lang ↔ Kurz"], difficulty: 1 },
      { id: "aj10", type: "multiple-choice", question: "Das Gegenteil von 'schwer' ist...?", answer: "leicht", options: ["klein","leicht","dünn","schwach"], hints: ["Ein Federball ist sehr ..."], difficulty: 1 },
    ],
  },
  {
    id: "saetze",
    title: "Sätze bauen",
    emoji: "🔨",
    exercises: [
      { id: "sb1", type: "multiple-choice", question: "Was ist ein vollständiger Satz?", answer: "Der Hund schläft.", options: ["Hund schläft","Der Hund","Der Hund schläft.","schläft Hund der"], hints: ["Ein Satz braucht: Subjekt + Verb + Satzzeichen"], difficulty: 1, free: true },
      { id: "sb2", type: "multiple-choice", question: "Welches Satzzeichen kommt ans Ende einer Frage?", answer: "?", options: [".","!","?",","], hints: ["Eine Frage endet mit..."], difficulty: 1, free: true },
      { id: "sb3", type: "multiple-choice", question: "Bringe die Wörter in die richtige Reihenfolge: 'spielt / Ball / das / Kind / mit dem'", answer: "Das Kind spielt mit dem Ball.", options: ["Das Kind spielt mit dem Ball.","Spielt das Kind mit dem Ball.","Das Ball spielt Kind mit dem.","Mit dem Ball das Kind spielt."], hints: ["Das Subjekt (wer?) kommt meist zuerst."], difficulty: 2, free: true },
      { id: "sb4", type: "multiple-choice", question: "Was fehlt in diesem Satz? 'Die Katze ___ auf dem Sofa.'", answer: "liegt", options: ["schön","liegt","Katze","gross"], hints: ["Es fehlt ein Verb (was tut die Katze?)."], difficulty: 1 },
      { id: "sb5", type: "fill-in-blank", question: "Ein Satz beginnt immer mit einem ___ Buchstaben.", answer: "grossen", hints: ["Grossschreibung am Satzanfang!"], difficulty: 1 },
      { id: "sb6", type: "multiple-choice", question: "Welches Satzzeichen passt? 'Wie schön der Regenbogen ist___'", answer: "!", options: [".","!","?",","], hints: ["Ausrufe oder Begeisterung → Ausrufezeichen"], difficulty: 1 },
      { id: "sb7", type: "multiple-choice", question: "Welches ist ein Fragesatz?", answer: "Wo wohnst du?", options: ["Ich wohne in Zürich.","Wo wohnst du?","Wohne in Zürich!","Zürich schön ist."], hints: ["Fragesätze enden mit ? und beginnen mit einem Fragewort."], difficulty: 1 },
      { id: "sb8", type: "fill-in-blank", question: "Am Ende eines Aussagesatzes steht ein ___.", answer: "Punkt", hints: ["Es ist das runde Satzzeichen."], difficulty: 1 },
    ],
  },
];

export default grade3German;
