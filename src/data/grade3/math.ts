import { Topic } from "@/types/exercise";

const grade3Math: Topic[] = [
  {
    id: "einmaleins-komplett",
    title: "Einmaleins komplett",
    emoji: "✖️",
    exercises: [
      { id: "e1", type: "fill-in-blank", question: "6 × 7 = ___", answer: "42", hints: ["6 × 7: 6×6=36, dann +6=42", "Merke: 6·7=42"], difficulty: 2, free: true },
      { id: "e2", type: "multiple-choice", question: "8 × 4 = ?", answer: "32", options: ["28","30","32","36"], hints: ["8 × 4: 8×2=16, doppelt=32"], difficulty: 2, free: true },
      { id: "e3", type: "fill-in-blank", question: "9 × 9 = ___", answer: "81", hints: ["9×9=81 — Merkhilfe: 9+9=18, also 81"], difficulty: 2, free: true },
      { id: "e4", type: "multiple-choice", question: "7 × 8 = ?", answer: "56", options: ["48","54","56","63"], hints: ["7×8=56 — Merke: 5,6,7,8 → 56=7×8"], difficulty: 2 },
      { id: "e5", type: "fill-in-blank", question: "6 × 6 = ___", answer: "36", hints: ["6×6=36"], difficulty: 1 },
      { id: "e6", type: "multiple-choice", question: "3 × 9 = ?", answer: "27", options: ["24","27","28","30"], hints: ["3×9: 3×10=30, minus 3=27"], difficulty: 2 },
      { id: "e7", type: "fill-in-blank", question: "4 × 7 = ___", answer: "28", hints: ["4×7=28"], difficulty: 2 },
      { id: "e8", type: "multiple-choice", question: "9 × 6 = ?", answer: "54", options: ["48","54","56","63"], hints: ["9×6=54"], difficulty: 2 },
      { id: "e9", type: "fill-in-blank", question: "8 × 8 = ___", answer: "64", hints: ["8×8=64"], difficulty: 2 },
      { id: "e10", type: "multiple-choice", question: "___ × 7 = 63", answer: "9", options: ["7","8","9","10"], hints: ["63 ÷ 7 = ?", "9 × 7 = 63"], difficulty: 2 },
      { id: "e11", type: "fill-in-blank", question: "6 × ___ = 48", answer: "8", hints: ["48 ÷ 6 = ?"], difficulty: 2 },
      { id: "e12", type: "multiple-choice", question: "5 × 8 = ?", answer: "40", options: ["35","40","45","48"], hints: ["5×8=40"], difficulty: 1 },
    ],
  },
  {
    id: "division",
    title: "Division",
    emoji: "➗",
    exercises: [
      { id: "d1", type: "fill-in-blank", question: "12 ÷ 3 = ___", answer: "4", hints: ["Wie oft passt 3 in 12? 3, 6, 9, 12 → 4 mal"], difficulty: 1, free: true },
      { id: "d2", type: "multiple-choice", question: "20 ÷ 4 = ?", answer: "5", options: ["4","5","6","8"], hints: ["4 × ? = 20"], difficulty: 1, free: true },
      { id: "d3", type: "fill-in-blank", question: "35 ÷ 7 = ___", answer: "5", hints: ["7 × 5 = 35"], difficulty: 2, free: true },
      { id: "d4", type: "multiple-choice", question: "36 ÷ 6 = ?", answer: "6", options: ["5","6","7","8"], hints: ["6 × 6 = 36"], difficulty: 2 },
      { id: "d5", type: "fill-in-blank", question: "48 ÷ 8 = ___", answer: "6", hints: ["8 × 6 = 48"], difficulty: 2 },
      { id: "d6", type: "multiple-choice", question: "56 ÷ 7 = ?", answer: "8", options: ["6","7","8","9"], hints: ["7 × 8 = 56"], difficulty: 2 },
      { id: "d7", type: "fill-in-blank", question: "72 ÷ 9 = ___", answer: "8", hints: ["9 × 8 = 72"], difficulty: 2 },
      { id: "d8", type: "multiple-choice", question: "18 ÷ 3 = ?", answer: "6", options: ["4","5","6","7"], hints: ["3 × 6 = 18"], difficulty: 1 },
      { id: "d9", type: "fill-in-blank", question: "45 ÷ 5 = ___", answer: "9", hints: ["5 × 9 = 45"], difficulty: 1 },
      { id: "d10", type: "multiple-choice", question: "64 ÷ 8 = ?", answer: "8", options: ["6","7","8","9"], hints: ["8 × 8 = 64"], difficulty: 2 },
    ],
  },
  {
    id: "brueche",
    title: "Brüche",
    emoji: "🍕",
    exercises: [
      { id: "br1", type: "multiple-choice", question: "Eine Pizza wird in 2 gleiche Teile geteilt. Du nimmst einen Teil. Was hast du?", answer: "1/2", options: ["1/4","1/2","1/3","2/3"], hints: ["Geteilt durch 2 = Hälfte = 1/2"], difficulty: 1, free: true },
      { id: "br2", type: "multiple-choice", question: "Was ist grösser: 1/2 oder 1/4?", answer: "1/2", options: ["1/2","1/4","beide gleich"], hints: ["Je kleiner die Zahl unten, desto grösser der Bruch."], difficulty: 2, free: true },
      { id: "br3", type: "multiple-choice", question: "Wie viele Viertel machen ein Ganzes?", answer: "4", options: ["2","3","4","8"], hints: ["1/4 + 1/4 + 1/4 + 1/4 = 1"], difficulty: 1, free: true },
      { id: "br4", type: "multiple-choice", question: "3/4 einer Torte sind noch übrig. Wie viel fehlt auf das Ganze?", answer: "1/4", options: ["1/4","1/2","2/4","3/4"], hints: ["4/4 - 3/4 = 1/4"], difficulty: 2 },
      { id: "br5", type: "multiple-choice", question: "Was ist 1/2 von 10?", answer: "5", options: ["2","5","8","10"], hints: ["10 durch 2 = 5"], difficulty: 1 },
      { id: "br6", type: "fill-in-blank", question: "1/2 von 20 = ___", answer: "10", hints: ["20 ÷ 2 = 10"], difficulty: 1 },
      { id: "br7", type: "multiple-choice", question: "Was ist 1/4 von 8?", answer: "2", options: ["1","2","3","4"], hints: ["8 ÷ 4 = 2"], difficulty: 2 },
      { id: "br8", type: "fill-in-blank", question: "Wie viele Hälften machen ein Ganzes? ___", answer: "2", hints: ["1/2 + 1/2 = 1"], difficulty: 1 },
    ],
  },
  {
    id: "textaufgaben",
    title: "Textaufgaben",
    emoji: "📖",
    exercises: [
      { id: "t1", type: "fill-in-blank", question: "Lisa hat 8 Äpfel. Sie schenkt 3 davon ihrer Freundin. Wie viele Äpfel hat Lisa noch?", answer: "5", hints: ["8 − 3 = ?"], difficulty: 1, free: true },
      { id: "t2", type: "fill-in-blank", question: "Ein Bus hat 32 Plätze. Es sitzen 24 Personen drin. Wie viele Plätze sind noch frei?", answer: "8", hints: ["32 − 24 = ?"], difficulty: 2, free: true },
      { id: "t3", type: "fill-in-blank", question: "Tom kauft 3 Hefte à CHF 2.00. Wie viel bezahlt er?", answer: "6", hints: ["3 × 2 = ?"], difficulty: 1, free: true },
      { id: "t4", type: "fill-in-blank", question: "In der Klasse sind 28 Kinder. Es fehlen 4. Wie viele sind heute da?", answer: "24", hints: ["28 − 4 = ?"], difficulty: 1 },
      { id: "t5", type: "fill-in-blank", question: "Anna hat 5 Schachteln mit je 6 Buntstiften. Wie viele Stifte hat sie?", answer: "30", hints: ["5 × 6 = ?"], difficulty: 2 },
      { id: "t6", type: "fill-in-blank", question: "42 Kinder werden in Gruppen zu 7 aufgeteilt. Wie viele Gruppen gibt es?", answer: "6", hints: ["42 ÷ 7 = ?"], difficulty: 2 },
    ],
  },
];

export default grade3Math;
