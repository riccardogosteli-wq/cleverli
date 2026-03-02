import { Topic } from "@/types/exercise";

const grade2Math: Topic[] = [
  {
    id: "zahlen-bis-100",
    title: "Zahlen bis 100",
    emoji: "💯",
    exercises: [
      { id: "z1", type: "multiple-choice", question: "Was kommt nach 49?", answer: "50", options: ["48","50","51","60"], hints: ["49, dann kommt eine runde Zahl."], difficulty: 1, free: true },
      { id: "z2", type: "fill-in-blank", question: "Schreibe in Zahlen: Siebenunddreissig", answer: "37", hints: ["Dreissig = 30, sieben = 7"], difficulty: 2, free: true },
      { id: "z3", type: "multiple-choice", question: "Was ist die grösste zweistellige Zahl?", answer: "99", options: ["89","95","98","99"], hints: ["Zweistellig = zwei Ziffern, die grösste ist 9 und 9."], difficulty: 2, free: true },
      { id: "z4", type: "fill-in-blank", question: "60 + 7 = ___", answer: "67", hints: ["Sechzig und sieben = siebenundsechzig"], difficulty: 1 },
      { id: "z5", type: "multiple-choice", question: "Welche Zahl liegt zwischen 45 und 47?", answer: "46", options: ["44","45","46","48"], hints: ["45, ___, 47"], difficulty: 1 },
      { id: "z6", type: "fill-in-blank", question: "10 mehr als 73 ist ___.", answer: "83", hints: ["73 + 10 = ?"], difficulty: 2 },
      { id: "z7", type: "multiple-choice", question: "Wie viele Zehner hat die Zahl 85?", answer: "8", options: ["5","8","80","85"], hints: ["8 Zehner und 5 Einer = 85"], difficulty: 2 },
      { id: "z8", type: "fill-in-blank", question: "Wie viele Einer hat die Zahl 63? ___", answer: "3", hints: ["6 Zehner und ___ Einer = 63"], difficulty: 1 },
      { id: "z9", type: "multiple-choice", question: "Was ist 10 weniger als 50?", answer: "40", options: ["30","40","49","60"], hints: ["50 - 10 = ?"], difficulty: 1 },
      { id: "z10", type: "fill-in-blank", question: "Ergänze: 30, 40, 50, ___", answer: "60", hints: ["Zähle in Zehnerschritten."], difficulty: 1 },
    ],
  },
  {
    id: "addition-bis-20",
    title: "Addition bis 20",
    emoji: "➕",
    exercises: [
      { id: "a1", type: "fill-in-blank", question: "8 + 7 = ___", answer: "15", hints: ["8 + 7: erst auf 10 ergänzen: 8+2=10, dann 5 dazu."], difficulty: 1, free: true },
      { id: "a2", type: "multiple-choice", question: "9 + 9 = ?", answer: "18", options: ["16","17","18","19"], hints: ["9+9: 10+9 minus 1 = 18"], difficulty: 1, free: true },
      { id: "a3", type: "fill-in-blank", question: "6 + ___ = 14", answer: "8", hints: ["14 - 6 = ?"], difficulty: 2, free: true },
      { id: "a4", type: "multiple-choice", question: "13 + 5 = ?", answer: "18", options: ["17","18","19","20"], hints: ["13, 14, 15, 16, 17, 18 (5 weiter)"], difficulty: 1 },
      { id: "a5", type: "fill-in-blank", question: "7 + 8 = ___", answer: "15", hints: ["7+8: auf 10 ergänzen: 7+3=10, dann 5 dazu."], difficulty: 1 },
      { id: "a6", type: "multiple-choice", question: "12 + 6 = ?", answer: "18", options: ["16","17","18","19"], hints: ["12 + 6: 12, 13, 14, 15, 16, 17, 18"], difficulty: 1 },
      { id: "a7", type: "fill-in-blank", question: "___ + 9 = 17", answer: "8", hints: ["17 - 9 = ?"], difficulty: 2 },
      { id: "a8", type: "multiple-choice", question: "11 + 8 = ?", answer: "19", options: ["17","18","19","20"], hints: ["11 + 8 = 19"], difficulty: 1 },
      { id: "a9", type: "fill-in-blank", question: "5 + 5 + 5 = ___", answer: "15", hints: ["Erst 5+5=10, dann 10+5=15"], difficulty: 2 },
      { id: "a10", type: "multiple-choice", question: "15 + 4 = ?", answer: "19", options: ["18","19","20","21"], hints: ["15 + 4 = 19"], difficulty: 1 },
    ],
  },
  {
    id: "einmaleins",
    title: "Einmaleins 2er/5er/10er",
    emoji: "✖️",
    exercises: [
      { id: "e1", type: "multiple-choice", question: "2 × 3 = ?", answer: "6", options: ["4","5","6","8"], hints: ["2+2+2 = ?"], difficulty: 1, free: true },
      { id: "e2", type: "fill-in-blank", question: "5 × 4 = ___", answer: "20", hints: ["5, 10, 15, 20 (4 Fünfer)"], difficulty: 1, free: true },
      { id: "e3", type: "multiple-choice", question: "10 × 7 = ?", answer: "70", options: ["17","60","70","80"], hints: ["10 mal eine Zahl: einfach eine 0 anhängen."], difficulty: 1, free: true },
      { id: "e4", type: "fill-in-blank", question: "2 × 8 = ___", answer: "16", hints: ["2, 4, 6, 8, 10, 12, 14, 16"], difficulty: 1 },
      { id: "e5", type: "multiple-choice", question: "5 × 6 = ?", answer: "30", options: ["25","30","35","36"], hints: ["5, 10, 15, 20, 25, 30"], difficulty: 1 },
      { id: "e6", type: "fill-in-blank", question: "10 × 4 = ___", answer: "40", hints: ["10 × 4: vier Nullen? Nein – 40."], difficulty: 1 },
      { id: "e7", type: "multiple-choice", question: "2 × 9 = ?", answer: "18", options: ["16","17","18","19"], hints: ["2 × 9 = 18"], difficulty: 1 },
      { id: "e8", type: "fill-in-blank", question: "5 × 9 = ___", answer: "45", hints: ["5, 10, 15, 20, 25, 30, 35, 40, 45"], difficulty: 2 },
      { id: "e9", type: "multiple-choice", question: "10 × 10 = ?", answer: "100", options: ["10","20","100","1000"], hints: ["10 mal 10 = hundert"], difficulty: 1 },
      { id: "e10", type: "fill-in-blank", question: "2 × ___ = 14", answer: "7", hints: ["2 × ? = 14, also 14 ÷ 2 = ?"], difficulty: 2 },
    ],
  },
  {
    id: "uhrzeit",
    title: "Uhrzeit lesen",
    emoji: "🕐",
    exercises: [
      { id: "u1", type: "multiple-choice", question: "Der grosse Zeiger zeigt auf die 12, der kleine auf die 3. Wie spät ist es?", answer: "3:00 Uhr", options: ["12:00 Uhr","3:00 Uhr","6:00 Uhr","9:00 Uhr"], hints: ["Kleiner Zeiger = Stunden, grosser Zeiger auf 12 = genau die Stunde."], difficulty: 1, free: true },
      { id: "u2", type: "multiple-choice", question: "Der grosse Zeiger zeigt auf die 6, der kleine auf die 8. Wie spät ist es?", answer: "8:30 Uhr", options: ["6:08 Uhr","8:00 Uhr","8:30 Uhr","8:06 Uhr"], hints: ["Grosser Zeiger auf 6 = halb, kleiner auf 8 = 8 Uhr."], difficulty: 2, free: true },
      { id: "u3", type: "multiple-choice", question: "Wann frühstückt man meistens?", answer: "7:00 Uhr morgens", options: ["2:00 Uhr nachts","7:00 Uhr morgens","15:00 Uhr","23:00 Uhr"], hints: ["Frühstück = am Morgen"], difficulty: 1, free: true },
      { id: "u4", type: "fill-in-blank", question: "Halb acht ist gleich ___ Uhr.", answer: "7:30", hints: ["Halb acht = 30 Minuten vor 8 = 7:30"], difficulty: 2 },
      { id: "u5", type: "multiple-choice", question: "Wie viele Minuten hat eine Stunde?", answer: "60", options: ["12","24","60","100"], hints: ["Eine Stunde = 60 Minuten"], difficulty: 1 },
      { id: "u6", type: "fill-in-blank", question: "Nach 6:00 Uhr kommt ___ Uhr.", answer: "7:00", hints: ["Nach sechs kommt..."], difficulty: 1 },
      { id: "u7", type: "multiple-choice", question: "Wie viele Stunden hat ein Tag?", answer: "24", options: ["12","24","60","7"], hints: ["Ein Tag und eine Nacht zusammen = 24 Stunden."], difficulty: 1 },
      { id: "u8", type: "fill-in-blank", question: "Viertel nach 3 ist ___ Uhr.", answer: "3:15", hints: ["Viertel = 15 Minuten", "3 Uhr + 15 Minuten = 3:15"], difficulty: 2 },
    ],
  },
];

export default grade2Math;
