import type { Exercise, Topic } from "@/types/exercise";

type Enrichment = Record<number, Record<string, Exercise[]>>;

const pair = (id: string, label: string, emoji?: string) => ({ id, label, emoji });
const item = (id: string, label: string, emoji?: string) => ({ id, label, emoji });
const zone = (id: string, label: string) => ({ id, label });

const ENRICHMENTS: Enrichment = {
  3: {
    "zahlen-bis-1000": [
      {
        id: "math3-rich-zahlen-line-1", type: "number-line", difficulty: 1,
        question: "Zeige 340 auf dem Zahlenstrahl.", answer: "340",
        numberMin: 300, numberMax: 400, numberStep: 10,
        hints: ["340 liegt vier Zehnerschritte nach 300.", "Zähle 300, 310, 320, 330, 340."],
      },
      {
        id: "math3-rich-zahlen-match-1", type: "matching", difficulty: 2, answer: "all",
        question: "Verbinde Zahl und Stellenwert.", 
        pairs: [pair("482", "482", "🔢"), pair("482w", "4 Hunderter, 8 Zehner, 2 Einer", "🧱"), pair("705", "705", "🔢"), pair("705w", "7 Hunderter, 0 Zehner, 5 Einer", "🧱"), pair("630", "630", "🔢"), pair("630w", "6 Hunderter, 3 Zehner, 0 Einer", "🧱"), pair("219", "219", "🔢"), pair("219w", "2 Hunderter, 1 Zehner, 9 Einer", "🧱")],
        hints: ["Hunderter stehen vorne.", "Achte auch auf die Null in der Mitte."],
      },
    ],
    "einmaleins-komplett": [
      {
        id: "math3-rich-1x1-memory-1", type: "memory", difficulty: 1, answer: "all",
        question: "Finde Einmaleins-Aufgabe und Ergebnis.",
        pairs: [pair("6x4", "6 × 4", "✖️"), pair("24", "24", "✅"), pair("7x3", "7 × 3", "✖️"), pair("21", "21", "✅"), pair("8x5", "8 × 5", "✖️"), pair("40", "40", "✅"), pair("9x2", "9 × 2", "✖️"), pair("18", "18", "✅")],
        hints: ["Nutze Reihen, die du sicher kennst.", "8 × 5 passt zur 5er-Reihe."],
      },
      {
        id: "math3-rich-1x1-drag-1", type: "drag-drop", difficulty: 2, answer: "all",
        question: "Ordne die Aufgaben zur passenden Einmaleins-Reihe.",
        dragItems: [item("4x6", "4 × 6", "✖️"), item("4x8", "4 × 8", "✖️"), item("6x3", "6 × 3", "✖️"), item("6x7", "6 × 7", "✖️")],
        dropZones: [zone("vierer", "4er-Reihe"), zone("sechser", "6er-Reihe")],
        dropAnswers: { "4x6": "vierer", "4x8": "vierer", "6x3": "sechser", "6x7": "sechser" },
        hints: ["Die erste Zahl zeigt hier die Reihe.", "4 × 8 gehört zur 4er-Reihe."],
      },
      {
        id: "math3-rich-1x1-match-2", type: "matching", difficulty: 3, answer: "all",
        question: "Verbinde schwierige Einmaleins-Aufgaben mit dem Ergebnis.",
        pairs: [pair("7x8", "7 × 8", "✖️"), pair("56", "56", "✅"), pair("6x9", "6 × 9", "✖️"), pair("54", "54", "✅"), pair("8x8", "8 × 8", "✖️"), pair("64", "64", "✅"), pair("7x7", "7 × 7", "✖️"), pair("49", "49", "✅")],
        hints: ["Denke an Nachbaraufgaben, wenn du unsicher bist.", "7 × 8 ist eins mehr als 7 × 7."],
      },
    ],
    division: [
      {
        id: "math3-rich-division-match-1", type: "matching", difficulty: 2, answer: "all",
        question: "Verbinde Division und passende Malaufgabe.",
        pairs: [pair("24d6", "24 ÷ 6", "➗"), pair("6x4", "6 × 4 = 24", "✖️"), pair("35d5", "35 ÷ 5", "➗"), pair("5x7", "5 × 7 = 35", "✖️"), pair("42d7", "42 ÷ 7", "➗"), pair("7x6", "7 × 6 = 42", "✖️"), pair("32d4", "32 ÷ 4", "➗"), pair("4x8", "4 × 8 = 32", "✖️")],
        hints: ["Division ist die Umkehrung vom Malrechnen.", "Suche die Malaufgabe mit derselben Gesamtzahl."],
      },
      {
        id: "math3-rich-division-drag-1", type: "memory", difficulty: 2, answer: "all",
        question: "Verteile 36 Karten gleichmässig auf Gruppen.",
        pairs: [pair("d2", "2 Gruppen", "👥"), pair("18", "18 Karten pro Gruppe", "🃏"), pair("d3", "3 Gruppen", "👥"), pair("12", "12 Karten pro Gruppe", "🃏"), pair("d4", "4 Gruppen", "👥"), pair("9", "9 Karten pro Gruppe", "🃏"), pair("d6", "6 Gruppen", "👥"), pair("6", "6 Karten pro Gruppe", "🃏")],
        hints: ["Rechne 36 durch die Anzahl Gruppen.", "Je mehr Gruppen, desto weniger Karten pro Gruppe."],
      },
    ],
    brueche: [
      {
        id: "math3-rich-brueche-drag-1", type: "drag-drop", difficulty: 3, answer: "all",
        question: "Ordne Bruch und Beschreibung.",
        dragItems: [item("halb", "1/2", "◐"), item("viertel", "1/4", "◔"), item("drei-viertel", "3/4", "◕"), item("ganz", "4/4", "●")],
        dropZones: [zone("haelfte", "eine Hälfte"), zone("eins-von-vier", "ein Teil von vier"), zone("drei-von-vier", "drei Teile von vier"), zone("alles", "ein Ganzes")],
        dropAnswers: { halb: "haelfte", viertel: "eins-von-vier", "drei-viertel": "drei-von-vier", ganz: "alles" },
        hints: ["Der Nenner zeigt, in wie viele Teile geteilt wird.", "4/4 bedeutet alle vier Teile."],
      },
      {
        id: "math3-rich-brueche-line-1", type: "number-line", difficulty: 3,
        question: "Zeige 1/2 auf dem Zahlenstrahl von 0 bis 1.", answer: "0.5",
        numberMin: 0, numberMax: 1, numberStep: 0.25,
        hints: ["1/2 liegt genau in der Mitte.", "Die Mitte zwischen 0 und 1 ist 0,5."],
      },
    ],
    "flaeche-umfang": [
      {
        id: "math3-rich-flaeche-line-1", type: "number-line", difficulty: 2,
        question: "Ein Rechteck ist 3 Kästchen breit und 4 Kästchen lang. Zeige die Fläche.", answer: "12",
        numberMin: 0, numberMax: 20, numberStep: 1,
        hints: ["Zähle alle Kästchen oder rechne 3 × 4.", "Die Fläche umfasst 12 Kästchen."],
      },
      {
        id: "math3-rich-umfang-line-1", type: "number-line", difficulty: 2,
        question: "Ein Rechteck hat Seiten 4 cm und 6 cm. Zeige den Umfang.", answer: "20",
        numberMin: 0, numberMax: 30, numberStep: 1,
        hints: ["Umfang heisst einmal rundherum.", "Rechne 4 + 6 + 4 + 6."],
      },
    ],
    "diagramme-daten": [
      {
        id: "math3-rich-daten-review-1", type: "self-review", difficulty: 1, answer: "review",
        question: "Du hast eine Strichliste zu Lieblingsfrüchten. Wie erkennst du, welche Frucht am beliebtesten ist?",
        reviewCriteria: ["Beschreibt, dass die meisten Striche gesucht werden.", "Nennt Vergleichen oder Zählen.", "Bleibt bei der gegebenen Strichliste."],
        hints: ["Suche den Eintrag mit den meisten Strichen.", "Eine gute Antwort erklärt, was du vergleichst."],
      },
    ],
  },
  4: {
    "zahlen-bis-10000": [
      {
        id: "math4-rich-zahlen-line-1", type: "number-line", difficulty: 1,
        question: "Zeige 7500 auf dem Zahlenstrahl.", answer: "7500",
        numberMin: 7000, numberMax: 8000, numberStep: 100,
        hints: ["7500 liegt genau zwischen 7000 und 8000.", "Zähle in Hunderterschritten."],
      },
      {
        id: "math4-rich-zahlen-match-1", type: "matching", difficulty: 2, answer: "all",
        question: "Verbinde Zahl und gerundete Zahl.",
        pairs: [pair("3421", "3421", "🔢"), pair("3400", "auf Hunderter: 3400", "🎯"), pair("6788", "6788", "🔢"), pair("6800", "auf Hunderter: 6800", "🎯"), pair("9051", "9051", "🔢"), pair("9100", "auf Hunderter: 9100", "🎯"), pair("1249", "1249", "🔢"), pair("1200", "auf Hunderter: 1200", "🎯")],
        hints: ["Schau auf die Zehnerstelle.", "Ab 50 rundest du zum nächsten Hunderter."],
      },
    ],
    einmaleins: [
      {
        id: "math4-rich-1x1-memory-1", type: "memory", difficulty: 1, answer: "all",
        question: "Finde Aufgabe und Ergebnis.",
        pairs: [pair("12x3", "12 × 3", "✖️"), pair("36", "36", "✅"), pair("11x4", "11 × 4", "✖️"), pair("44", "44", "✅"), pair("9x6", "9 × 6", "✖️"), pair("54", "54", "✅"), pair("8x7", "8 × 7", "✖️"), pair("56", "56", "✅")],
        hints: ["Zerlege grössere Aufgaben in bekannte Reihen.", "12 × 3 ist 10 × 3 plus 2 × 3."],
      },
      {
        id: "math4-rich-1x1-drag-1", type: "drag-drop", difficulty: 2, answer: "all",
        question: "Ordne die Aufgaben nach Ergebnis.",
        dragItems: [item("6x6", "6 × 6", "✖️"), item("4x9", "4 × 9", "✖️"), item("7x8", "7 × 8", "✖️"), item("8x8", "8 × 8", "✖️")],
        dropZones: [zone("36", "36"), zone("56", "56"), zone("64", "64")],
        dropAnswers: { "6x6": "36", "4x9": "36", "7x8": "56", "8x8": "64" },
        hints: ["Zwei Aufgaben können dasselbe Ergebnis haben.", "6 × 6 und 4 × 9 ergeben beide 36."],
      },
    ],
    "brueche-einfuehrung": [
      {
        id: "math4-rich-brueche-line-1", type: "number-line", difficulty: 2,
        question: "Zeige 3/4 auf dem Zahlenstrahl von 0 bis 1.", answer: "0.75",
        numberMin: 0, numberMax: 1, numberStep: 0.25,
        hints: ["Teile den Weg in vier gleiche Schritte.", "3/4 ist drei Viertelschritte nach 0."],
      },
      {
        id: "math4-rich-brueche-match-1", type: "matching", difficulty: 3, answer: "all",
        question: "Verbinde gleich grosse Brüche.",
        pairs: [pair("1-2", "1/2", "◐"), pair("2-4", "2/4", "◐"), pair("2-3", "2/3", "◔"), pair("4-6", "4/6", "◔"), pair("3-4", "3/4", "◕"), pair("6-8", "6/8", "◕"), pair("1-4", "1/4", "◔"), pair("2-8", "2/8", "◔")],
        hints: ["Erweitern verändert den Wert nicht.", "1/2 ist gleich gross wie 2/4."],
      },
    ],
    "geometrie-4": [
      {
        id: "math4-rich-geometrie-match-1", type: "matching", difficulty: 2, answer: "all",
        question: "Verbinde Figur und Eigenschaft.",
        pairs: [pair("quadrat", "Quadrat", "⬛"), pair("vier-gleich", "vier gleich lange Seiten", "📏"), pair("rechteck", "Rechteck", "▭"), pair("gegenueber", "gegenüberliegende Seiten gleich lang", "↔️"), pair("dreieck", "Dreieck", "🔺"), pair("drei-seiten", "drei Seiten", "3️⃣"), pair("kreis", "Kreis", "⭕"), pair("rund", "keine Ecken", "🔄")],
        hints: ["Zähle Seiten und Ecken.", "Ein Kreis hat keine Ecken."],
      },
      {
        id: "math4-rich-geometrie-drag-1", type: "drag-drop", difficulty: 3, answer: "all",
        question: "Ordne Körper und passende Fläche.",
        dragItems: [item("wuerfel", "Würfel", "🎲"), item("quader", "Quader", "📦"), item("zylinder", "Zylinder", "🥫"), item("kegel", "Kegel", "🍦")],
        dropZones: [zone("quadrat", "hat quadratische Flächen"), zone("rechteck", "hat rechteckige Flächen"), zone("kreis", "hat Kreisflächen")],
        dropAnswers: { wuerfel: "quadrat", quader: "rechteck", zylinder: "kreis", kegel: "kreis" },
        hints: ["Stell dir vor, welche Flächen du anfassen kannst.", "Zylinder und Kegel haben Kreisflächen."],
      },
    ],
    "groessen-messen-4": [
      {
        id: "math4-rich-groessen-line-1", type: "number-line", difficulty: 1,
        question: "Zeige 150 cm in Metern auf dem Zahlenstrahl.", answer: "1.5",
        numberMin: 0, numberMax: 3, numberStep: 0.5,
        hints: ["100 cm sind 1 m.", "150 cm sind 1,5 m."],
      },
      {
        id: "math4-rich-groessen-memory-1", type: "memory", difficulty: 2, answer: "all",
        question: "Finde Einheit und passende Grösse.",
        pairs: [pair("meter", "Meter", "📏"), pair("zimmer", "Länge eines Zimmers", "🏠"), pair("gramm", "Gramm", "⚖️"), pair("apfel", "Gewicht eines Apfels", "🍎"), pair("liter", "Liter", "🥤"), pair("flasche", "Inhalt einer Flasche", "🧴"), pair("minute", "Minute", "⏱️"), pair("pause", "Dauer einer kurzen Pause", "🎒")],
        hints: ["Denke an Messen im Alltag.", "Liter passt zu Flüssigkeiten."],
      },
    ],
    "daten-diagramme-zufall-4": [
      {
        id: "math4-rich-daten-line-1", type: "number-line", difficulty: 3,
        question: "In einem Balkendiagramm sind es 18 Stimmen. Zeige 18.", answer: "18",
        numberMin: 0, numberMax: 30, numberStep: 2,
        hints: ["Zähle in Zweierschritten.", "18 liegt zwischen 16 und 20."],
      },
      {
        id: "math4-rich-daten-review-1", type: "self-review", difficulty: 2, answer: "review",
        question: "Ein Diagramm zeigt Lieblingssportarten. Wie erklärst du einem Kind, welche Sportart am häufigsten gewählt wurde?",
        reviewCriteria: ["Nennt den höchsten Balken oder die grösste Zahl.", "Beschreibt den Vergleich verständlich.", "Erfindet keine Daten dazu."],
        hints: ["Suche den höchsten Balken.", "Eine gute Erklärung bleibt beim Diagramm."],
      },
    ],
  },
  5: {
    dezimalzahlen: [
      {
        id: "math5-rich-dezimal-match-0", type: "matching", difficulty: 1, answer: "all",
        question: "Verbinde Dezimalzahl und Wort.",
        pairs: [pair("0-1", "0,1", "🔢"), pair("ein-zehntel", "ein Zehntel", "▰"), pair("0-2", "0,2", "🔢"), pair("zwei-zehntel", "zwei Zehntel", "▰"), pair("0-5", "0,5", "🔢"), pair("fuenf-zehntel", "fünf Zehntel", "▰"), pair("1-0", "1,0", "🔢"), pair("ein-ganzes", "ein Ganzes", "●")],
        hints: ["Die Stelle nach dem Komma zeigt Zehntel.", "0,5 sind fünf Zehntel."],
      },
      {
        id: "math5-rich-dezimal-line-1", type: "number-line", difficulty: 1,
        question: "Zeige 2,4 auf dem Zahlenstrahl.", answer: "2.4",
        numberMin: 2, numberMax: 3, numberStep: 0.1,
        hints: ["2,4 liegt vier Zehntel nach 2.", "Zähle 2,1, 2,2, 2,3, 2,4."],
      },
      {
        id: "math5-rich-dezimal-match-1", type: "matching", difficulty: 2, answer: "all",
        question: "Verbinde Dezimalzahl und Bruch.",
        pairs: [pair("0-5", "0,5", "🔢"), pair("1-2", "1/2", "◐"), pair("0-25", "0,25", "🔢"), pair("1-4", "1/4", "◔"), pair("0-75", "0,75", "🔢"), pair("3-4", "3/4", "◕"), pair("0-1", "0,1", "🔢"), pair("1-10", "1/10", "▰")],
        hints: ["Zehntel und Hundertstel helfen beim Vergleichen.", "0,5 ist die Hälfte."],
      },
    ],
    "brueche-rechnen": [
      {
        id: "math5-rich-brueche-line-1", type: "number-line", difficulty: 2,
        question: "Zeige 1 1/2 auf dem Zahlenstrahl.", answer: "1.5",
        numberMin: 0, numberMax: 3, numberStep: 0.5,
        hints: ["1 1/2 ist eine ganze Zahl plus eine Hälfte.", "Das ist 1,5."],
      },
      {
        id: "math5-rich-brueche-drag-1", type: "drag-drop", difficulty: 3, answer: "all",
        question: "Ordne Bruchrechnungen zum Ergebnis.",
        dragItems: [item("1-4-1-4", "1/4 + 1/4", "➕"), item("1-2-1-4", "1/2 + 1/4", "➕"), item("3-4-1-4", "3/4 - 1/4", "➖"), item("1-1-2", "1 - 1/2", "➖")],
        dropZones: [zone("1-2", "1/2"), zone("3-4", "3/4")],
        dropAnswers: { "1-4-1-4": "1-2", "1-2-1-4": "3-4", "3-4-1-4": "1-2", "1-1-2": "1-2" },
        hints: ["Bringe die Brüche auf gleiche Nenner.", "1/2 ist gleich 2/4."],
      },
    ],
    "prozent-5": [
      {
        id: "math5-rich-prozent-match-1", type: "matching", difficulty: 2, answer: "all",
        question: "Verbinde Prozent und Bedeutung.",
        pairs: [pair("50p", "50 %", "▰"), pair("haelfte", "die Hälfte", "◐"), pair("25p", "25 %", "▰"), pair("viertel", "ein Viertel", "◔"), pair("100p", "100 %", "▰"), pair("ganz", "das Ganze", "●"), pair("10p", "10 %", "▰"), pair("zehntel", "ein Zehntel", "🔟")],
        hints: ["Prozent bedeutet von hundert.", "50 % ist die Hälfte."],
      },
      {
        id: "math5-rich-prozent-memory-1", type: "memory", difficulty: 3, answer: "all",
        question: "Finde einfache Prozentwerte.",
        pairs: [pair("50-von-80", "50 % von 80", "🧮"), pair("40", "40", "✅"), pair("25-von-80", "25 % von 80", "🧮"), pair("20", "20", "✅"), pair("10-von-90", "10 % von 90", "🧮"), pair("9", "9", "✅"), pair("100-von-35", "100 % von 35", "🧮"), pair("35", "35", "✅")],
        hints: ["50 % ist die Hälfte.", "10 % findest du, indem du durch 10 teilst."],
      },
    ],
    "koordinatensystem-5": [
      {
        id: "math5-rich-koordinaten-drag-1", type: "drag-drop", difficulty: 2, answer: "all",
        question: "Ordne Punkte nach ihrer Lage im Koordinatensystem.",
        dragItems: [item("a", "A(2|1)", "📍"), item("b", "B(5|1)", "📍"), item("c", "C(2|4)", "📍"), item("d", "D(5|4)", "📍")],
        dropZones: [zone("unten", "unten"), zone("oben", "oben")],
        dropAnswers: { a: "unten", b: "unten", c: "oben", d: "oben" },
        hints: ["Die zweite Zahl zeigt die Höhe.", "Punkte mit y = 4 liegen höher als Punkte mit y = 1."],
      },
    ],
    "groessen-5": [
      {
        id: "math5-rich-groessen-memory-1", type: "memory", difficulty: 1, answer: "all",
        question: "Finde gleich grosse Längen.",
        pairs: [pair("100cm", "100 cm", "📏"), pair("1m", "1 m", "📏"), pair("1000m", "1000 m", "🏃"), pair("1km", "1 km", "🗺️"), pair("50cm", "50 cm", "📏"), pair("0-5m", "0,5 m", "📏"), pair("250cm", "250 cm", "📏"), pair("2-5m", "2,5 m", "📏")],
        hints: ["100 cm sind 1 m.", "1000 m sind 1 km."],
      },
      {
        id: "math5-rich-groessen-line-1", type: "number-line", difficulty: 2,
        question: "Zeige 2,5 km auf dem Zahlenstrahl.", answer: "2.5",
        numberMin: 0, numberMax: 5, numberStep: 0.5,
        hints: ["2,5 liegt genau zwischen 2 und 3.", "Zähle in halben Kilometern."],
      },
    ],
    "wahrscheinlichkeit-5": [
      {
        id: "math5-rich-wahrscheinlichkeit-line-1", type: "number-line", difficulty: 3,
        question: "Bei 10 gleich grossen Feldern sind 3 rot. Zeige die Wahrscheinlichkeit als Dezimalzahl.", answer: "0.3",
        numberMin: 0, numberMax: 1, numberStep: 0.1,
        hints: ["3 von 10 sind drei Zehntel.", "Drei Zehntel schreibt man 0,3."],
      },
      {
        id: "math5-rich-wahrscheinlichkeit-review-1", type: "self-review", difficulty: 2, answer: "review",
        question: "Ein Glücksrad hat mehr blaue als rote Felder. Wie erklärst du, welche Farbe wahrscheinlicher ist?",
        reviewCriteria: ["Nennt die Farbe mit mehr Feldern.", "Begründet mit Anzahl oder Anteil.", "Sagt nicht, dass das Ergebnis sicher ist."],
        hints: ["Mehr gleich grosse Felder bedeuten grössere Chance.", "Wahrscheinlich heisst nicht sicher."],
      },
    ],
  },
  6: {
    "negative-zahlen": [
      {
        id: "math6-rich-negativ-line-1", type: "number-line", difficulty: 1,
        question: "Zeige -3 auf dem Zahlenstrahl.", answer: "-3",
        numberMin: -10, numberMax: 10, numberStep: 1,
        hints: ["Negative Zahlen liegen links von 0.", "Gehe drei Schritte nach links."],
      },
      {
        id: "math6-rich-negativ-match-1", type: "matching", difficulty: 1, answer: "all",
        question: "Verbinde Alltagssituation und Zahl.",
        pairs: [pair("minus5", "-5 °C", "❄️"), pair("kalt", "5 Grad unter null", "🌡️"), pair("plus3", "+3 m", "⬆️"), pair("hoeher", "3 Meter über dem Start", "📏"), pair("minus2", "-2 m", "⬇️"), pair("tiefer", "2 Meter unter dem Start", "📏"), pair("null", "0", "0️⃣"), pair("start", "Startpunkt", "📍")],
        hints: ["Unter null passt zu negativen Zahlen.", "Der Startpunkt ist oft 0."],
      },
    ],
    prozent: [
      {
        id: "math6-rich-prozent-line-1", type: "number-line", difficulty: 2,
        question: "Zeige 37,5 % als Dezimalzahl.", answer: "0.375",
        numberMin: 0, numberMax: 1, numberStep: 0.125,
        hints: ["37,5 % sind 37,5 von 100.", "37,5 % ist 0,375."],
      },
      {
        id: "math6-rich-prozent-memory-1", type: "memory", difficulty: 3, answer: "all",
        question: "Finde Prozent, Bruch und Bedeutung.",
        pairs: [pair("75p", "75 %", "▰"), pair("3-4", "3/4", "◕"), pair("20p", "20 %", "▰"), pair("1-5", "1/5", "◔"), pair("12-5p", "12,5 %", "▰"), pair("1-8", "1/8", "◔"), pair("150p", "150 %", "▰"), pair("1-5x", "eineinhalb Ganze", "●")],
        hints: ["100 % ist ein Ganzes.", "150 % ist mehr als ein Ganzes."],
      },
    ],
    gleichungen: [
      {
        id: "math6-rich-gleichungen-drag-1", type: "drag-drop", difficulty: 2, answer: "all",
        question: "Ordne Gleichungen und Lösungen.",
        dragItems: [item("x3", "x + 3 = 10", "🧮"), item("x4", "4x = 24", "🧮"), item("x2", "x - 2 = 5", "🧮"), item("x9", "x / 3 = 3", "🧮")],
        dropZones: [zone("6", "x = 6"), zone("7", "x = 7"), zone("9", "x = 9")],
        dropAnswers: { x3: "7", x4: "6", x2: "7", x9: "9" },
        hints: ["Setze die Lösung gedanklich ein.", "Bei x + 3 = 10 muss x gleich 7 sein."],
      },
      {
        id: "math6-rich-gleichungen-match-1", type: "matching", difficulty: 3, answer: "all",
        question: "Verbinde Gleichung und passenden Rechenschritt.",
        pairs: [pair("xplus5", "x + 5 = 13", "🧮"), pair("minus5", "auf beiden Seiten 5 abziehen", "➖"), pair("3x", "3x = 21", "🧮"), pair("durch3", "durch 3 teilen", "➗"), pair("xminus4", "x - 4 = 9", "🧮"), pair("plus4", "auf beiden Seiten 4 addieren", "➕"), pair("xhalb", "x/2 = 6", "🧮"), pair("mal2", "mit 2 multiplizieren", "✖️")],
        hints: ["Du machst auf beiden Seiten denselben Schritt.", "Das Ziel ist, x allein zu haben."],
      },
    ],
    "verhaeltnisse-6": [
      {
        id: "math6-rich-verhaeltnis-drag-1", type: "drag-drop", difficulty: 2, answer: "all",
        question: "Ordne Verhältnis und passende Beschreibung.",
        dragItems: [item("1zu2", "1 : 2", "⚖️"), item("2zu3", "2 : 3", "⚖️"), item("3zu1", "3 : 1", "⚖️"), item("4zu4", "4 : 4", "⚖️")],
        dropZones: [zone("halb", "ein Teil zu zwei Teilen"), zone("zwei-drei", "zwei Teile zu drei Teilen"), zone("dreimal", "dreimal so viel wie ein Teil"), zone("gleich", "gleich viel")],
        dropAnswers: { "1zu2": "halb", "2zu3": "zwei-drei", "3zu1": "dreimal", "4zu4": "gleich" },
        hints: ["Lies Verhältnisse von links nach rechts.", "4 : 4 bedeutet gleich viel."],
      },
      {
        id: "math6-rich-verhaeltnis-review-1", type: "self-review", difficulty: 3, answer: "review",
        question: "Ein Sirup wird im Verhältnis 1 : 5 gemischt. Erkläre, was das für Sirup und Wasser bedeutet.",
        reviewCriteria: ["Erklärt 1 Teil Sirup und 5 Teile Wasser.", "Bleibt beim Verhältnis statt bei festen Litern.", "Formuliert verständlich mit Teilen."],
        hints: ["Das Verhältnis sagt etwas über Teile.", "Zu jedem Teil Sirup kommen fünf Teile Wasser."],
      },
    ],
    "geometrie-6": [
      {
        id: "math6-rich-geometrie-match-1", type: "matching", difficulty: 1, answer: "all",
        question: "Verbinde Körper und Merkmal.",
        pairs: [pair("prisma", "Prisma", "🔷"), pair("parallel", "zwei parallele Grundflächen", "↔️"), pair("pyramide", "Pyramide", "🔺"), pair("spitze", "eine Spitze", "📍"), pair("zylinder", "Zylinder", "🥫"), pair("kreis", "zwei Kreisflächen", "⭕"), pair("quader", "Quader", "📦"), pair("rechtecke", "rechteckige Flächen", "▭")],
        hints: ["Achte auf Grundflächen und Seitenflächen.", "Ein Zylinder hat Kreisflächen."],
      },
    ],
    "statistik-6": [
      {
        id: "math6-rich-statistik-line-1", type: "number-line", difficulty: 2,
        question: "Die Werte 4, 6 und 8 haben welchen Durchschnitt? Zeige ihn.", answer: "6",
        numberMin: 0, numberMax: 10, numberStep: 1,
        hints: ["Addiere die Werte und teile durch 3.", "4 + 6 + 8 = 18, und 18 ÷ 3 = 6."],
      },
      {
        id: "math6-rich-statistik-memory-1", type: "memory", difficulty: 2, answer: "all",
        question: "Finde Statistik-Begriff und Bedeutung.",
        pairs: [pair("mittelwert", "Mittelwert", "⚖️"), pair("durchschnitt", "Durchschnitt", "➗"), pair("maximum", "Maximum", "⬆️"), pair("groesster", "grösster Wert", "🔝"), pair("minimum", "Minimum", "⬇️"), pair("kleinster", "kleinster Wert", "🔻"), pair("spannweite", "Spannweite", "↔️"), pair("abstand", "Abstand zwischen Minimum und Maximum", "📏")],
        hints: ["Der Mittelwert ist der Durchschnitt.", "Maximum und Minimum sind die äussersten Werte."],
      },
    ],
    "flaechen-koerper-6": [
      {
        id: "math6-rich-koerper-line-1", type: "number-line", difficulty: 2,
        question: "Ein Quader ist 4 cm lang, 3 cm breit und 2 cm hoch. Zeige das Volumen.", answer: "24",
        numberMin: 0, numberMax: 40, numberStep: 1,
        hints: ["Volumen beim Quader: Länge mal Breite mal Höhe.", "4 × 3 × 2 = 24."],
      },
    ],
  },
};

export function addMathRichEnrichment(grade: number, subject: string, topics: Topic[]): Topic[] {
  if (subject !== "math") return topics;
  const byTopic = ENRICHMENTS[grade];
  if (!byTopic) return topics;

  return topics.map((topic) => {
    const exercises = byTopic[topic.id];
    if (!exercises) return topic;
    const existingIds = new Set(topic.exercises.map((exercise) => exercise.id));
    return {
      ...topic,
      exercises: [
        ...topic.exercises,
        ...exercises.filter((exercise) => !existingIds.has(exercise.id)),
      ],
    };
  });
}

export function getMathRichEnrichmentIds() {
  return Object.entries(ENRICHMENTS).flatMap(([grade, topics]) =>
    Object.entries(topics).flatMap(([topicId, exercises]) =>
      exercises.map((exercise) => ({
        grade: Number(grade),
        subject: "math",
        topicId,
        exerciseId: exercise.id,
      })),
    ),
  );
}
