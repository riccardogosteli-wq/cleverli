import { Topic } from "@/types/exercise";

const grade6Math: Topic[] = [
  {
    id: "negative-zahlen",
    title: "Negative Zahlen",
    emoji: "🌡️",
    exercises: [
      { id: "g6m1", type: "multiple-choice", question: "Welche Zahl ist kleiner: −3 oder −7?", answer: "−7", options: ["−3","−7","Gleich gross","0"], hints: ["Auf dem Zahlenstrahl: je weiter links, desto kleiner."], difficulty: 1, free: true },
      { id: "g6m2", type: "fill-in-blank", question: "Es ist −5°C. Die Temperatur steigt um 8°C. Wie warm ist es dann?", answer: "3", hints: ["−5 + 8 = ? Zähle vom Minuspunkt aufwärts."], difficulty: 1, free: true },
      { id: "g6m3", type: "number-line", question: "Zeige die Zahl −4 auf dem Zahlenstrahl!", answer: "-4", numberMin: -10, numberMax: 10, numberStep: 1, hints: ["Gehe vom 0 nach links — links von 0 sind die negativen Zahlen."], difficulty: 1, free: true },
      { id: "g6m4", type: "multiple-choice", question: "Was ergibt −3 + 5?", answer: "2", options: ["−2","2","8","−8"], hints: ["Starte bei −3 auf dem Zahlenstrahl und gehe 5 Schritte nach rechts."], difficulty: 2 },
      { id: "g6m5", type: "fill-in-blank", question: "Was ergibt 4 − 7?", answer: "−3", hints: ["4 − 7: du gehst 7 Schritte nach links von 4 — du kommst in den negativen Bereich."], difficulty: 2 },
      { id: "g6m6", type: "multiple-choice", question: "Ordne von klein nach gross: 2, −5, 0, −1", answer: "−5, −1, 0, 2", options: ["2, 0, −1, −5","−5, −1, 0, 2","0, −1, −5, 2","−1, −5, 0, 2"], hints: ["Negative Zahlen kommen zuerst — die kleinste ist die am weitesten links."], difficulty: 2 },
      { id: "g6m7", type: "fill-in-blank", question: "Was ergibt −6 + 6?", answer: "0", hints: ["Eine Zahl und ihr Gegenteil ergeben immer 0."], difficulty: 2 },
      { id: "g6m8", type: "multiple-choice", question: "Was ergibt −3 − (−2)?", answer: "−1", options: ["−5","5","−1","1"], hints: ["Minus mal Minus = Plus: −3 − (−2) = −3 + 2."], difficulty: 3 },
      { id: "g6m9", type: "fill-in-blank", question: "Welche Zahl liegt genau zwischen −4 und 2?", answer: "−1", hints: ["Addiere beide Zahlen und teile durch 2: (−4 + 2) ÷ 2 = ?"], difficulty: 3 },
      { id: "g6m10", type: "multiple-choice", question: "Was ergibt (−3) × (−4)?", answer: "12", options: ["−12","12","7","−7"], hints: ["Negativ × Negativ = Positiv. −3 × −4 = +12."], difficulty: 3 },
    ],
  },
  {
    id: "prozent",
    title: "Prozent und Brüche",
    emoji: "💯",
    exercises: [
      { id: "g6m11", type: "multiple-choice", question: "Was bedeutet 50%?", answer: "Die Hälfte", options: ["Ein Viertel","Die Hälfte","Drei Viertel","Das Doppelte"], hints: ["Prozent = von Hundert. 50 von 100 = die Hälfte."], difficulty: 1, free: true },
      { id: "g6m12", type: "fill-in-blank", question: "25% von 100 sind ___.", answer: "25", hints: ["25 von 100 = ein Viertel von 100."], difficulty: 1, free: true },
      { id: "g6m13", type: "multiple-choice", question: "Wie viel Prozent entspricht dem Bruch ½?", answer: "50%", options: ["25%","75%","50%","100%"], hints: ["½ = 1 geteilt durch 2 = 0.5 = 50 von 100."], difficulty: 1, free: true },
      { id: "g6m14", type: "fill-in-blank", question: "10% von 200 sind ___.", answer: "20", hints: ["10% = 1/10. Teile 200 durch 10."], difficulty: 2 },
      { id: "g6m15", type: "multiple-choice", question: "Ein T-Shirt kostet CHF 40, wird um 20% reduziert. Was kostet es?", answer: "CHF 32", options: ["CHF 20","CHF 28","CHF 32","CHF 38"], hints: ["20% von 40 = 8. 40 − 8 = ?"], difficulty: 2 },
      { id: "g6m16", type: "fill-in-blank", question: "Schreibe den Bruch ¾ als Prozentzahl: ___ %", answer: "75", hints: ["¾ = 3 ÷ 4 = 0.75 = 75 von 100 = 75%."], difficulty: 2 },
      { id: "g6m17", type: "multiple-choice", question: "Welcher Bruch ist gleich 40%?", answer: "2/5", options: ["1/4","2/5","3/5","1/3"], hints: ["40% = 40/100 = 2/5 (kürzen: beide durch 20 teilen)."], difficulty: 2 },
      { id: "g6m18", type: "fill-in-blank", question: "Ein Preis steigt von CHF 80 auf CHF 100. Das ist eine Steigerung von ___ %.", answer: "25", hints: ["Differenz = 20. 20 von 80 = 20/80 = 1/4 = 25%."], difficulty: 3 },
      { id: "g6m19", type: "multiple-choice", question: "Was ergibt 15% von 60?", answer: "9", options: ["6","9","12","15"], hints: ["10% von 60 = 6. 5% von 60 = 3. 10% + 5% = 15%."], difficulty: 3 },
      { id: "g6m20", type: "fill-in-blank", question: "Wenn 30% eines Betrags CHF 12 sind, wie gross ist der ganze Betrag?", answer: "40", hints: ["30% = 12 → 1% = 12/30 → 100% = (12/30) × 100."], difficulty: 3 },
    ],
  },
  {
    id: "gleichungen",
    title: "Einfache Gleichungen",
    emoji: "⚖️",
    exercises: [
      { id: "g6m21", type: "fill-in-blank", question: "x + 5 = 12. Was ist x?", answer: "7", hints: ["Was musst du zu 5 addieren, um 12 zu erhalten? Oder: 12 − 5 = ?"], difficulty: 1, free: true },
      { id: "g6m22", type: "multiple-choice", question: "2 × x = 16. Was ist x?", answer: "8", options: ["6","7","8","9"], hints: ["Dividiere beide Seiten durch 2: x = 16 ÷ 2."], difficulty: 1, free: true },
      { id: "g6m23", type: "fill-in-blank", question: "x − 4 = 11. Was ist x?", answer: "15", hints: ["Addiere 4 auf beiden Seiten: x = 11 + 4."], difficulty: 1, free: true },
      { id: "g6m24", type: "fill-in-blank", question: "3 × x = 24. Was ist x?", answer: "8", hints: ["Dividiere durch 3 auf beiden Seiten: x = 24 ÷ 3."], difficulty: 2 },
      { id: "g6m25", type: "multiple-choice", question: "x + 13 = 30. Was ist x?", answer: "17", options: ["13","17","43","30"], hints: ["Subtrahiere 13 auf beiden Seiten: x = 30 − 13."], difficulty: 2 },
      { id: "g6m26", type: "fill-in-blank", question: "x ÷ 4 = 7. Was ist x?", answer: "28", hints: ["Multipliziere beide Seiten mit 4: x = 7 × 4."], difficulty: 2 },
      { id: "g6m27", type: "multiple-choice", question: "2x + 3 = 11. Was ist x?", answer: "4", options: ["3","4","5","7"], hints: ["Zuerst 3 subtrahieren: 2x = 8. Dann durch 2 dividieren."], difficulty: 2 },
      { id: "g6m28", type: "fill-in-blank", question: "5x − 2 = 23. Was ist x?", answer: "5", hints: ["Addiere 2: 5x = 25. Dividiere durch 5: x = ?"], difficulty: 3 },
      { id: "g6m29", type: "multiple-choice", question: "Welcher Wert von x löst die Gleichung 3x + 6 = 21?", answer: "5", options: ["3","4","5","6"], hints: ["3x = 21 − 6 = 15 → x = 15 ÷ 3."], difficulty: 3 },
      { id: "g6m30", type: "fill-in-blank", question: "x/3 + 4 = 10. Was ist x?", answer: "18", hints: ["Subtrahiere 4: x/3 = 6. Multipliziere mit 3: x = ?"], difficulty: 3 },
    ],
  },
];

export default grade6Math;
