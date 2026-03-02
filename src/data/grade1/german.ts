import { Topic } from "@/types/exercise";

const grade1German: Topic[] = [
  {
    id: "buchstaben",
    title: "Buchstaben",
    emoji: "🔤",
    exercises: [
      { id: "b1", type: "multiple-choice", question: "🍎 Welcher Buchstabe beginnt das Wort 'Apfel'?", answer: "A", options: ["A","B","E","O"], hints: ["A wie Apfel."], difficulty: 1, free: true },
      { id: "b2", type: "multiple-choice", question: "🐻 Welcher Buchstabe beginnt 'Bär'?", answer: "B", options: ["A","B","D","P"], hints: ["B wie Bär."], difficulty: 1, free: true },
      { id: "b3", type: "multiple-choice", question: "🐱 Welcher Buchstabe beginnt 'Katze'?", answer: "K", options: ["C","G","K","T"], hints: ["K wie Katze."], difficulty: 1, free: true },
      { id: "b4", type: "multiple-choice", question: "🐶 Welcher Buchstabe beginnt 'Hund'?", answer: "H", options: ["B","H","N","U"], hints: ["H wie Hund."], difficulty: 1 },
      { id: "b5", type: "multiple-choice", question: "🌞 Welcher Buchstabe beginnt 'Sonne'?", answer: "S", options: ["S","Z","T","N"], hints: ["S wie Sonne."], difficulty: 1 },
      { id: "b6", type: "multiple-choice", question: "🐟 Welcher Buchstabe beginnt 'Fisch'?", answer: "F", options: ["E","F","V","W"], hints: ["F wie Fisch."], difficulty: 1 },
      { id: "b7", type: "multiple-choice", question: "🏠 Welcher Buchstabe beginnt 'Haus'?", answer: "H", options: ["A","H","M","U"], hints: ["H wie Haus."], difficulty: 1 },
      { id: "b8", type: "fill-in-blank", question: "🦁 Der erste Buchstabe von 'Löwe' ist: ___", answer: "L", hints: ["L wie Löwe."], difficulty: 1 },
      { id: "b9", type: "multiple-choice", question: "🐘 Welcher Buchstabe beginnt 'Elefant'?", answer: "E", options: ["A","E","I","O"], hints: ["E wie Elefant."], difficulty: 1 },
      { id: "b10", type: "fill-in-blank", question: "🎈 Der erste Buchstabe von 'Ball' ist: ___", answer: "B", hints: ["B wie Ball."], difficulty: 1 },
    ],
  },
  {
    id: "einfache-woerter",
    title: "Einfache Wörter",
    emoji: "✏️",
    exercises: [
      { id: "ew1", type: "multiple-choice", question: "Welches Wort beschreibt das Bild? 🐱", answer: "Katze", options: ["Hund","Katze","Maus","Vogel"], hints: ["Es ist ein Haustier mit Schnurrhaaren."], difficulty: 1, free: true },
      { id: "ew2", type: "fill-in-blank", question: "E___ ist rund und rot. (Apfel)", answer: "Apfel", hints: ["A_fel", "Es wächst am Baum."], difficulty: 1, free: true },
      { id: "ew3", type: "multiple-choice", question: "Was trinken Kinder gern? 🥛", answer: "Milch", options: ["Brot","Milch","Stuhl","Haus"], hints: ["Es kommt von der Kuh und ist weiss."], difficulty: 1, free: true },
      { id: "ew4", type: "multiple-choice", question: "Wo schläft man? 🛏️", answer: "Bett", options: ["Tisch","Bett","Schule","Auto"], hints: ["Man schläft dort in der Nacht."], difficulty: 1 },
      { id: "ew5", type: "fill-in-blank", question: "Das Gegenteil von 'gross' ist ___.", answer: "klein", hints: ["Ein Maus ist ... , ein Elefant ist gross."], difficulty: 2 },
      { id: "ew6", type: "multiple-choice", question: "Womit schreibt man? ✏️", answer: "Bleistift", options: ["Schere","Lineal","Bleistift","Kleber"], hints: ["Man schreibt damit auf Papier."], difficulty: 1 },
      { id: "ew7", type: "multiple-choice", question: "Was ist blau und nass? 💧", answer: "Wasser", options: ["Feuer","Wasser","Wind","Erde"], hints: ["Man trinkt es."], difficulty: 1 },
      { id: "ew8", type: "fill-in-blank", question: "Der ___ scheint am Tag. (Sonne)", answer: "Sonne", hints: ["Es ist hell und warm.", "Die S___e"], difficulty: 1 },
      { id: "ew9", type: "multiple-choice", question: "Wo lernen Kinder? 🏫", answer: "Schule", options: ["Markt","Schule","Wald","See"], hints: ["Man geht täglich dorthin um zu lernen."], difficulty: 1 },
      { id: "ew10", type: "fill-in-blank", question: "Das Gegenteil von 'Tag' ist ___.", answer: "Nacht", hints: ["Wenn die Sonne untergeht, kommt die ..."], difficulty: 1 },
    ],
  },
  {
    id: "gross-kleinschreibung",
    title: "Gross- und Kleinschreibung",
    emoji: "🔡",
    exercises: [
      { id: "gk1", type: "multiple-choice", question: "Wie schreibt man 'Hund' richtig?", answer: "Hund", options: ["hund","HUND","Hund","HuNd"], hints: ["Nomen (Dinge, Tiere) schreibt man gross."], difficulty: 1, free: true },
      { id: "gk2", type: "multiple-choice", question: "Wie beginnt jeder Satz?", answer: "Mit einem grossen Buchstaben", options: ["Mit einem kleinen Buchstaben","Mit einem grossen Buchstaben","Mit einem Punkt","Mit einem Komma"], hints: ["Jeder neue Satz beginnt gross."], difficulty: 1, free: true },
      { id: "gk3", type: "multiple-choice", question: "Welches Wort ist richtig geschrieben?", answer: "Tisch", options: ["tisch","TISCH","Tisch","tiSch"], hints: ["Nomen schreibt man mit grossem Anfangsbuchstaben."], difficulty: 1, free: true },
      { id: "gk4", type: "multiple-choice", question: "Ist 'laufen' ein Nomen oder ein Verb?", answer: "Verb", options: ["Nomen","Verb"], hints: ["Verben sind Tätigkeiten (laufen, springen, essen)."], difficulty: 2 },
      { id: "gk5", type: "multiple-choice", question: "Welches Wort muss gross geschrieben werden?", answer: "Baum", options: ["schnell","schön","Baum","rennen"], hints: ["Dinge und Lebewesen = Nomen = gross."], difficulty: 1 },
      { id: "gk6", type: "multiple-choice", question: "Welches ist richtig?", answer: "Die Katze schläft.", options: ["die Katze schläft.","Die Katze schläft.","Die katze schläft.","die katze schläft."], hints: ["Satzanfang gross, Nomen gross."], difficulty: 2 },
      { id: "gk7", type: "fill-in-blank", question: "Das Wort 'Auto' ist ein ___ (Nomen/Verb).", answer: "Nomen", hints: ["Auto ist ein Ding."], difficulty: 2 },
      { id: "gk8", type: "multiple-choice", question: "Welche Schreibweise ist falsch?", answer: "apfel", options: ["Apfel","apfel"], hints: ["Nomen schreibt man IMMER gross."], difficulty: 1 },
    ],
  },
];

export default grade1German;
