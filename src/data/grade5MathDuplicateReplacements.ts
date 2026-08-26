import type { Exercise, Topic } from "../types/exercise";

type Task = {
  question: string;
  answer: string;
  hint: string;
  questionEN?: string;
  questionFR?: string;
  questionIT?: string;
};

const targetIds: Record<string, string[]> = {
  "brueche-rechnen": ["g5m29","g5br3d","g5br3i","g5m30","g5br3e","g5br3j","g5br3a","g5br3f","g5br3k","g5br3b","g5br3g","g5br3l","g5m28","g5br3c","g5br3h"],
  dezimalzahlen: ["g5dz3d", "g5dz3e"],
  "flaechen-umfang": ["g5m19","g5fu3d","g5fu3i","g5m20","g5fu3e","g5fu3j","g5fu3a","g5fu3f","g5fu3k","g5fu3b","g5fu3g","g5fu3l","g5m18","g5fu3c","g5fu3h"],
  "groessen-5": ["gr5-37","gr5-42","gr5-47","gr5-38","gr5-43","gr5-48","gr5-39","gr5-44","gr5-49","gr5-40","gr5-45","gr5-50","gr5-36","gr5-41","gr5-46"],
  "koordinatensystem-5": ["ks5-37","ks5-42","ks5-47","ks5-38","ks5-43","ks5-48","ks5-39","ks5-44","ks5-49","ks5-40","ks5-45","ks5-50","ks5-36","ks5-41","ks5-46"],
  "prozent-5": ["p5-37","p5-42","p5-47","p5-38","p5-43","p5-48","p5-39","p5-44","p5-49","p5-40","p5-45","p5-50","p5-36","p5-41","p5-46"],
  "statistik-5": ["st5-37","st5-42","st5-47","st5-38","st5-43","st5-48","st5-39","st5-44","st5-49","st5-40","st5-45","st5-50","st5-36","st5-41","st5-46"],
  "volumen-5": ["vol5-37","vol5-42","vol5-47","vol5-38","vol5-43","vol5-48","vol5-39","vol5-44","vol5-49","vol5-40","vol5-45","vol5-50","vol5-36","vol5-41","vol5-46"],
  "wahrscheinlichkeit-5": ["wk5-37","wk5-42","wk5-47","wk5-38","wk5-43","wk5-48","wk5-39","wk5-44","wk5-49","wk5-40","wk5-45","wk5-50","wk5-36","wk5-41","wk5-46"],
};

const t = (question: string, answer: string | number, hint: string, translations?: [string, string, string]): Task => ({
  question,
  answer: String(answer),
  hint,
  questionEN: translations?.[0],
  questionFR: translations?.[1],
  questionIT: translations?.[2],
});

const tasks: Record<string, Task[]> = {
  "brueche-rechnen": [
    t("3/4 + 5/8 = ___", "11/8", "Erweitere zuerst auf Achtel."),
    t("7/9 − 2/3 = ___", "1/9", "Erweitere den zweiten Bruch auf Neuntel."),
    t("5/6 + 1/4 = ___", "13/12", "Nutze den gemeinsamen Nenner 12."),
    t("11/15 − 2/5 = ___", "1/3", "Erweitere auf Fünfzehntel und kürze am Schluss."),
    t("3/7 × 14 = ___", 6, "Kürze 14 mit dem Nenner."),
    t("5/8 von 32 = ___", 20, "Teile zuerst durch 8.", ["5/8 of 32 = ___", "5/8 de 32 = ___", "5/8 di 32 = ___"]),
    t("2 1/3 + 1 1/6 = ___", "3 1/2", "Addiere Ganze und Bruchteile getrennt."),
    t("4 3/5 − 2 1/10 = ___", "2 1/2", "Schreibe die Fünftel als Zehntel."),
    t("18/24 vollständig gekürzt = ___", "3/4", "Teile Zähler und Nenner durch ihren grössten gemeinsamen Teiler.", ["18/24 in lowest terms = ___", "18/24 simplifié au maximum = ___", "18/24 ridotto ai minimi termini = ___"]),
    t("___/20 = 3/5", 12, "Erweitere den Nenner von 5 auf 20."),
    t("7/12 + ___/12 = 1", 5, "Ein Ganzes entspricht zwölf Zwölfteln."),
    t("9/10 − 3/10 = ___", "3/5", "Subtrahiere und kürze das Ergebnis."),
    t("2/3 ÷ 4 = ___", "1/6", "Teilen durch 4 bedeutet mit einem Viertel multiplizieren."),
    t("1 3/4 als unechter Bruch = ___", "7/4", "Multipliziere die ganze Zahl mit dem Nenner und addiere den Zähler.", ["1 3/4 as an improper fraction = ___", "1 3/4 sous forme de fraction impropre = ___", "1 3/4 come frazione impropria = ___"]),
    t("13/6 als gemischte Zahl = ___", "2 1/6", "Bestimme, wie oft 6 vollständig in 13 passt.", ["13/6 as a mixed number = ___", "13/6 sous forme de nombre mixte = ___", "13/6 come numero misto = ___"]),
  ],
  dezimalzahlen: [
    t("8,4 − 3,75 = ___", "4,65", "Schreibe 8,4 als 8,40 und subtrahiere stellenweise."),
    t("0,48 × 25 = ___", 12, "Nutze 25 × 48 und setze das Komma danach richtig."),
  ],
  "flaechen-umfang": [
    t("Rechteck 18 cm × 7 cm: Fläche = ___ cm²", 126, "Multipliziere Länge und Breite.", ["Rectangle 18 cm × 7 cm: area = ___ cm²", "Rectangle 18 cm × 7 cm : aire = ___ cm²", "Rettangolo 18 cm × 7 cm: area = ___ cm²"]),
    t("Rechteck 24 cm × 9 cm: Umfang = ___ cm", 66, "Addiere Länge und Breite und verdopple.", ["Rectangle 24 cm × 9 cm: perimeter = ___ cm", "Rectangle 24 cm × 9 cm : périmètre = ___ cm", "Rettangolo 24 cm × 9 cm: perimetro = ___ cm"]),
    t("Quadrat mit Seite 13 cm: Fläche = ___ cm²", 169, "Multipliziere die Seitenlänge mit sich selbst.", ["Square with side 13 cm: area = ___ cm²", "Carré de 13 cm de côté : aire = ___ cm²", "Quadrato con lato di 13 cm: area = ___ cm²"]),
    t("Quadrat mit Seite 17 cm: Umfang = ___ cm", 68, "Ein Quadrat hat vier gleich lange Seiten.", ["Square with side 17 cm: perimeter = ___ cm", "Carré de 17 cm de côté : périmètre = ___ cm", "Quadrato con lato di 17 cm: perimetro = ___ cm"]),
    t("Dreieck: Grundseite 16 cm, Höhe 9 cm. Fläche = ___ cm²", 72, "Halbiere das Produkt aus Grundseite und Höhe.", ["Triangle: base 16 cm, height 9 cm. Area = ___ cm²", "Triangle : base 16 cm, hauteur 9 cm. Aire = ___ cm²", "Triangolo: base 16 cm, altezza 9 cm. Area = ___ cm²"]),
    t("Parallelogramm: Grundseite 14 cm, Höhe 8 cm. Fläche = ___ cm²", 112, "Multipliziere Grundseite und senkrechte Höhe.", ["Parallelogram: base 14 cm, height 8 cm. Area = ___ cm²", "Parallélogramme : base 14 cm, hauteur 8 cm. Aire = ___ cm²", "Parallelogramma: base 14 cm, altezza 8 cm. Area = ___ cm²"]),
    t("Rechteckfläche 180 cm², Länge 15 cm: Breite = ___ cm", 12, "Teile die Fläche durch die Länge.", ["Rectangle area 180 cm², length 15 cm: width = ___ cm", "Aire du rectangle 180 cm², longueur 15 cm : largeur = ___ cm", "Area del rettangolo 180 cm², lunghezza 15 cm: larghezza = ___ cm"]),
    t("Rechteckumfang 54 cm, Länge 16 cm: Breite = ___ cm", 11, "Halbiere den Umfang und ziehe die Länge ab.", ["Rectangle perimeter 54 cm, length 16 cm: width = ___ cm", "Périmètre du rectangle 54 cm, longueur 16 cm : largeur = ___ cm", "Perimetro del rettangolo 54 cm, lunghezza 16 cm: larghezza = ___ cm"]),
    t("Ein 20-m-×-12-m-Garten hat Fläche ___ m².", 240, "Multipliziere die beiden Seitenlängen.", ["A 20 m × 12 m garden has area ___ m².", "Un jardin de 20 m × 12 m a une aire de ___ m².", "Un giardino di 20 m × 12 m ha un'area di ___ m²."]),
    t("Ein Quadrat hat 196 cm² Fläche. Seine Seite misst ___ cm.", 14, "Suche die Zahl, deren Quadrat 196 ergibt.", ["A square has area 196 cm². Its side measures ___ cm.", "Un carré a une aire de 196 cm². Son côté mesure ___ cm.", "Un quadrato ha un'area di 196 cm². Il lato misura ___ cm."]),
    t("Dreieckseiten 12 cm, 15 cm und 17 cm: Umfang = ___ cm", 44, "Addiere alle drei Seiten.", ["Triangle sides 12 cm, 15 cm and 17 cm: perimeter = ___ cm", "Côtés du triangle 12 cm, 15 cm et 17 cm : périmètre = ___ cm", "Lati del triangolo 12 cm, 15 cm e 17 cm: perimetro = ___ cm"]),
    t("Rechteck 2,5 m × 4 m: Fläche = ___ m²", 10, "Multipliziere die Dezimalzahl mit 4.", ["Rectangle 2.5 m × 4 m: area = ___ m²", "Rectangle 2,5 m × 4 m : aire = ___ m²", "Rettangolo 2,5 m × 4 m: area = ___ m²"]),
    t("Eine Fläche von 3 m² entspricht ___ cm².", 30000, "Ein Quadratmeter besteht aus 100 × 100 Quadratzentimetern.", ["An area of 3 m² equals ___ cm².", "Une aire de 3 m² correspond à ___ cm².", "Un'area di 3 m² equivale a ___ cm²."]),
    t("Zwei Rechtecke mit je 45 cm² haben zusammen ___ cm².", 90, "Addiere die beiden gleich grossen Flächen.", ["Two rectangles of 45 cm² each have a total area of ___ cm².", "Deux rectangles de 45 cm² chacun ont une aire totale de ___ cm².", "Due rettangoli di 45 cm² ciascuno hanno un'area totale di ___ cm²."]),
    t("Ein Rechteck wird von 8 cm × 6 cm auf 8 cm × 9 cm vergrössert. Die Fläche wächst um ___ cm².", 24, "Berechne beide Flächen und bilde die Differenz.", ["A rectangle grows from 8 cm × 6 cm to 8 cm × 9 cm. The area increases by ___ cm².", "Un rectangle passe de 8 cm × 6 cm à 8 cm × 9 cm. L'aire augmente de ___ cm².", "Un rettangolo passa da 8 cm × 6 cm a 8 cm × 9 cm. L'area aumenta di ___ cm²."]),
  ],
  "groessen-5": [
    t("4,75 km = ___ m", 4750, "Multipliziere Kilometer mit 1000."),
    t("3,6 kg = ___ g", 3600, "Multipliziere Kilogramm mit 1000."),
    t("2,45 l = ___ ml", 2450, "Ein Liter sind 1000 Milliliter."),
    t("1,8 m = ___ cm", 180, "Ein Meter sind 100 Zentimeter."),
    t("2 h 47 min = ___ min", 167, "Wandle die Stunden zuerst in Minuten um."),
    t("3 Tage 8 h = ___ h", 80, "Ein Tag hat 24 Stunden."),
    t("CHF 125.40 − CHF 38.75 = CHF ___", "86.65", "Subtrahiere Franken und Rappen stellenweise."),
    t("5,2 t = ___ kg", 5200, "Eine Tonne sind 1000 Kilogramm."),
    t("8400 cm = ___ m", 84, "Teile Zentimeter durch 100."),
    t("0,65 m² = ___ cm²", 6500, "Ein Quadratmeter sind 10 000 Quadratzentimeter."),
    t("1,25 h = ___ min", 75, "Eine Viertelstunde entspricht 15 Minuten."),
    t("7250 ml = ___ l", "7,25", "Teile Milliliter durch 1000."),
    t("4 km 85 m = ___ m", 4085, "Wandle Kilometer in Meter um und addiere."),
    t("6 kg 35 g = ___ g", 6035, "Wandle Kilogramm in Gramm um und addiere."),
    t("2,4 m³ = ___ l", 2400, "Ein Kubikmeter sind 1000 Liter."),
  ],
  "koordinatensystem-5": [
    t("P(4|−3): x = ___", 4, "Die x-Koordinate steht an erster Stelle."),
    t("Q(−6|2): y = ___", 2, "Die y-Koordinate steht an zweiter Stelle."),
    t("A(2|5) wird 4 nach rechts verschoben: x' = ___", 6, "Addiere 4 zur x-Koordinate.", ["A(2|5) moves 4 units right: x' = ___", "A(2|5) est déplacé de 4 vers la droite : x' = ___", "A(2|5) viene spostato di 4 a destra: x' = ___"]),
    t("B(−1|3) wird 5 nach unten verschoben: y' = ___", -2, "Subtrahiere 5 von der y-Koordinate.", ["B(−1|3) moves 5 units down: y' = ___", "B(−1|3) est déplacé de 5 vers le bas : y' = ___", "B(−1|3) viene spostato di 5 verso il basso: y' = ___"]),
    t("Spiegelung von C(7|−4) an der y-Achse: x' = ___", -7, "Bei der Spiegelung an der y-Achse wechselt x das Vorzeichen.", ["Reflection of C(7|−4) across the y-axis: x' = ___", "Symétrie de C(7|−4) par rapport à l'axe y : x' = ___", "Riflessione di C(7|−4) rispetto all'asse y: x' = ___"]),
    t("Spiegelung von D(−3|6) an der x-Achse: y' = ___", -6, "Bei der Spiegelung an der x-Achse wechselt y das Vorzeichen.", ["Reflection of D(−3|6) across the x-axis: y' = ___", "Symétrie de D(−3|6) par rapport à l'axe x : y' = ___", "Riflessione di D(−3|6) rispetto all'asse x: y' = ___"]),
    t("A(1|2), B(8|2): Länge AB = ___", 7, "Die y-Koordinaten sind gleich; bilde die Differenz der x-Werte.", ["A(1|2), B(8|2): length AB = ___", "A(1|2), B(8|2) : longueur AB = ___", "A(1|2), B(8|2): lunghezza AB = ___"]),
    t("E(−2|−5), F(−2|4): Länge EF = ___", 9, "Die x-Koordinaten sind gleich; bestimme den vertikalen Abstand.", ["E(−2|−5), F(−2|4): length EF = ___", "E(−2|−5), F(−2|4) : longueur EF = ___", "E(−2|−5), F(−2|4): lunghezza EF = ___"]),
    t("Mittelpunkt von A(2|4) und B(8|4): x = ___", 5, "Bilde den Mittelwert der beiden x-Koordinaten.", ["Midpoint of A(2|4) and B(8|4): x = ___", "Milieu de A(2|4) et B(8|4) : x = ___", "Punto medio di A(2|4) e B(8|4): x = ___"]),
    t("Mittelpunkt von C(−3|1) und D(−3|9): y = ___", 5, "Bilde den Mittelwert der beiden y-Koordinaten.", ["Midpoint of C(−3|1) and D(−3|9): y = ___", "Milieu de C(−3|1) et D(−3|9) : y = ___", "Punto medio di C(−3|1) e D(−3|9): y = ___"]),
    t("P(3|−7) liegt im Quadranten ___.", 4, "Positives x und negatives y kennzeichnen den vierten Quadranten.", ["P(3|−7) lies in quadrant ___.", "P(3|−7) se trouve dans le quadrant ___.", "P(3|−7) si trova nel quadrante ___."]),
    t("Q(−5|6) liegt im Quadranten ___.", 2, "Negatives x und positives y kennzeichnen den zweiten Quadranten.", ["Q(−5|6) lies in quadrant ___.", "Q(−5|6) se trouve dans le quadrant ___.", "Q(−5|6) si trova nel quadrante ___."]),
    t("Vom Ursprung bis R(0|−8) sind es ___ Einheiten.", 8, "Der Punkt liegt auf der y-Achse.", ["The distance from the origin to R(0|−8) is ___ units.", "La distance de l'origine à R(0|−8) est de ___ unités.", "La distanza dall'origine a R(0|−8) è di ___ unità."]),
    t("S(−4|0) liegt auf der ___-Achse.", "x", "Eine y-Koordinate von 0 kennzeichnet die waagrechte Achse.", ["S(−4|0) lies on the ___-axis.", "S(−4|0) se trouve sur l'axe ___.", "S(−4|0) si trova sull'asse ___."]),
    t("A(−2|3) → B(4|3): Verschiebung in x-Richtung = ___", 6, "Bilde 4 minus −2.", ["A(−2|3) → B(4|3): shift in the x-direction = ___", "A(−2|3) → B(4|3) : déplacement dans la direction x = ___", "A(−2|3) → B(4|3): spostamento nella direzione x = ___"]),
  ],
  "prozent-5": [
    t("15 % × 200 = ___", 30, "Wandle 15 Prozent in 0,15 um."),
    t("35 % × 80 = ___", 28, "Berechne zuerst 10 Prozent."),
    t("12 % × 250 = ___", 30, "Ein Prozent von 250 ist 2,5."),
    t("75 % × 64 = ___", 48, "75 Prozent entsprechen drei Vierteln."),
    t("5 % × 360 = ___", 18, "Fünf Prozent sind die Hälfte von zehn Prozent."),
    t("45 von 180 = ___ %", 25, "Teile 45 durch 180 und multipliziere mit 100."),
    t("84 von 120 = ___ %", 70, "Kürze den Bruch 84/120."),
    t("18 von 72 = ___ %", 25, "18 ist ein Viertel von 72."),
    t("Preis CHF 80, Rabatt 15 %: Rabatt = CHF ___", 12, "Berechne 15 Prozent von 80.", ["Price CHF 80, discount 15%: discount = CHF ___", "Prix CHF 80, remise 15 % : remise = CHF ___", "Prezzo CHF 80, sconto 15%: sconto = CHF ___"]),
    t("Preis CHF 240, Rabatt 25 %: neuer Preis = CHF ___", 180, "Ziehe ein Viertel des Preises ab.", ["Price CHF 240, discount 25%: new price = CHF ___", "Prix CHF 240, remise 25 % : nouveau prix = CHF ___", "Prezzo CHF 240, sconto 25%: nuovo prezzo = CHF ___"]),
    t("Eine Zahl steigt von 50 auf 60: Zunahme = ___ %", 20, "Die Zunahme 10 wird mit dem Ausgangswert 50 verglichen.", ["A number rises from 50 to 60: increase = ___%", "Un nombre passe de 50 à 60 : augmentation = ___ %", "Un numero aumenta da 50 a 60: aumento = ___%"]),
    t("Eine Zahl sinkt von 200 auf 150: Abnahme = ___ %", 25, "Die Abnahme 50 ist ein Viertel des Ausgangswerts.", ["A number falls from 200 to 150: decrease = ___%", "Un nombre passe de 200 à 150 : diminution = ___ %", "Un numero scende da 200 a 150: diminuzione = ___%"]),
    t("40 % einer Zahl sind 36. Die Zahl ist ___.", 90, "Teile 36 durch 0,4.", ["40% of a number is 36. The number is ___.", "40 % d'un nombre vaut 36. Ce nombre est ___.", "Il 40% di un numero è 36. Il numero è ___."]),
    t("120 % von 50 = ___", 60, "100 Prozent sind 50; addiere weitere 20 Prozent."),
    t("0,35 = ___ %", 35, "Multipliziere die Dezimalzahl mit 100."),
  ],
  "statistik-5": [
    t("Mittelwert von 6, 8, 10, 12 = ___", 9, "Addiere alle Werte und teile durch vier.", ["Mean of 6, 8, 10, 12 = ___", "Moyenne de 6, 8, 10, 12 = ___", "Media di 6, 8, 10, 12 = ___"]),
    t("Median von 3, 5, 7, 9, 11 = ___", 7, "Der Median ist der mittlere geordnete Wert.", ["Median of 3, 5, 7, 9, 11 = ___", "Médiane de 3, 5, 7, 9, 11 = ___", "Mediana di 3, 5, 7, 9, 11 = ___"]),
    t("Median von 2, 4, 8, 10 = ___", 6, "Bei vier Werten ist der Median der Mittelwert der beiden mittleren.", ["Median of 2, 4, 8, 10 = ___", "Médiane de 2, 4, 8, 10 = ___", "Mediana di 2, 4, 8, 10 = ___"]),
    t("Modalwert von 2, 3, 3, 4, 5 = ___", 3, "Suche den am häufigsten vorkommenden Wert.", ["Mode of 2, 3, 3, 4, 5 = ___", "Mode de 2, 3, 3, 4, 5 = ___", "Moda di 2, 3, 3, 4, 5 = ___"]),
    t("Spannweite von 14, 9, 21, 17 = ___", 12, "Subtrahiere den kleinsten vom grössten Wert.", ["Range of 14, 9, 21, 17 = ___", "Étendue de 14, 9, 21, 17 = ___", "Intervallo di 14, 9, 21, 17 = ___"]),
    t("Mittelwert von 4, 7, 7, 10 = ___", 7, "Die Summe der vier Werte wird durch vier geteilt.", ["Mean of 4, 7, 7, 10 = ___", "Moyenne de 4, 7, 7, 10 = ___", "Media di 4, 7, 7, 10 = ___"]),
    t("In 5 Spielen fallen 3, 1, 4, 2, 5 Tore. Insgesamt: ___", 15, "Addiere alle fünf Werte.", ["Goals in 5 games: 3, 1, 4, 2, 5. Total: ___", "Buts en 5 matchs : 3, 1, 4, 2, 5. Total : ___", "Gol in 5 partite: 3, 1, 4, 2, 5. Totale: ___"]),
    t("Häufigkeit der 4 in 1, 4, 2, 4, 4, 3 = ___", 3, "Zähle, wie oft der Wert 4 vorkommt.", ["Frequency of 4 in 1, 4, 2, 4, 4, 3 = ___", "Fréquence de 4 dans 1, 4, 2, 4, 4, 3 = ___", "Frequenza di 4 in 1, 4, 2, 4, 4, 3 = ___"]),
    t("25 befragte Kinder, davon 10 mit Velo: Anteil = ___ %", 40, "Teile 10 durch 25 und multipliziere mit 100.", ["25 children surveyed, 10 use a bicycle: share = ___%", "25 enfants interrogés, 10 utilisent un vélo : part = ___ %", "25 bambini intervistati, 10 usano la bicicletta: quota = ___%"]),
    t("Mittelwert 12 bei 5 Werten: Summe = ___", 60, "Multipliziere Mittelwert und Anzahl Werte.", ["Mean 12 for 5 values: sum = ___", "Moyenne 12 pour 5 valeurs : somme = ___", "Media 12 per 5 valori: somma = ___"]),
    t("Summe 72 bei 8 Werten: Mittelwert = ___", 9, "Teile die Summe durch die Anzahl Werte.", ["Sum 72 for 8 values: mean = ___", "Somme 72 pour 8 valeurs : moyenne = ___", "Somma 72 per 8 valori: media = ___"]),
    t("Geordnete Werte 5, 8, 8, 9, 12, 14: Median = ___", "8,5", "Bilde den Mittelwert der beiden mittleren Werte.", ["Ordered values 5, 8, 8, 9, 12, 14: median = ___", "Valeurs ordonnées 5, 8, 8, 9, 12, 14 : médiane = ___", "Valori ordinati 5, 8, 8, 9, 12, 14: mediana = ___"]),
    t("Spannweite 18, kleinster Wert 7: grösster Wert = ___", 25, "Addiere die Spannweite zum kleinsten Wert.", ["Range 18, smallest value 7: largest value = ___", "Étendue 18, plus petite valeur 7 : plus grande valeur = ___", "Intervallo 18, valore minimo 7: valore massimo = ___"]),
    t("Modalwert von 6, 7, 7, 8, 8, 8, 9 = ___", 8, "Suche den Wert mit den meisten Vorkommen.", ["Mode of 6, 7, 7, 8, 8, 8, 9 = ___", "Mode de 6, 7, 7, 8, 8, 8, 9 = ___", "Moda di 6, 7, 7, 8, 8, 8, 9 = ___"]),
    t("30 Messungen, davon 9 über dem Grenzwert: Anteil = ___ %", 30, "Teile 9 durch 30 und multipliziere mit 100.", ["30 measurements, 9 above the limit: share = ___%", "30 mesures, dont 9 au-dessus de la limite : part = ___ %", "30 misurazioni, 9 sopra il limite: quota = ___%"]),
  ],
  "volumen-5": [
    t("V = 8 cm × 5 cm × 3 cm = ___ cm³", 120, "Multipliziere Länge, Breite und Höhe."),
    t("V = 12 cm × 4 cm × 6 cm = ___ cm³", 288, "Multipliziere die drei Kantenlängen."),
    t("Würfelkante 7 cm: V = ___ cm³", 343, "Berechne 7 × 7 × 7.", ["Cube edge 7 cm: V = ___ cm³", "Arête du cube 7 cm : V = ___ cm³", "Spigolo del cubo 7 cm: V = ___ cm³"]),
    t("Würfelvolumen 512 cm³: Kante = ___ cm", 8, "Suche die Zahl, deren dritte Potenz 512 ist.", ["Cube volume 512 cm³: edge = ___ cm", "Volume du cube 512 cm³ : arête = ___ cm", "Volume del cubo 512 cm³: spigolo = ___ cm"]),
    t("Quader V = 360 cm³, Grundfläche 45 cm²: Höhe = ___ cm", 8, "Teile das Volumen durch die Grundfläche.", ["Cuboid V = 360 cm³, base area 45 cm²: height = ___ cm", "Pavé droit V = 360 cm³, aire de base 45 cm² : hauteur = ___ cm", "Parallelepipedo V = 360 cm³, area di base 45 cm²: altezza = ___ cm"]),
    t("2,5 l = ___ cm³", 2500, "Ein Liter entspricht 1000 Kubikzentimetern."),
    t("4500 cm³ = ___ l", "4,5", "Teile Kubikzentimeter durch 1000."),
    t("V = 15 m × 6 m × 2 m = ___ m³", 180, "Multipliziere die drei Masse."),
    t("Ein Aquarium 50 cm × 30 cm × 40 cm fasst ___ l.", 60, "Berechne cm³ und teile durch 1000.", ["An aquarium 50 cm × 30 cm × 40 cm holds ___ l.", "Un aquarium de 50 cm × 30 cm × 40 cm contient ___ l.", "Un acquario di 50 cm × 30 cm × 40 cm contiene ___ l."]),
    t("Würfelkante verdoppelt: Volumen wird ___-mal so gross.", 8, "Das Volumen hängt von drei Kantenlängen ab.", ["Cube edge doubled: volume becomes ___ times as large.", "Arête du cube doublée : le volume devient ___ fois plus grand.", "Spigolo del cubo raddoppiato: il volume diventa ___ volte maggiore."]),
    t("V = 9 cm × 9 cm × 10 cm = ___ cm³", 810, "Multipliziere zuerst 9 × 9."),
    t("Ein Behälter enthält 3 m³ Wasser = ___ l.", 3000, "Ein Kubikmeter sind 1000 Liter.", ["A container holds 3 m³ of water = ___ l.", "Un récipient contient 3 m³ d'eau = ___ l.", "Un contenitore contiene 3 m³ d'acqua = ___ l."]),
    t("Quader V = 924 cm³, Länge 11 cm, Breite 7 cm: Höhe = ___ cm", 12, "Teile das Volumen durch 11 × 7.", ["Cuboid V = 924 cm³, length 11 cm, width 7 cm: height = ___ cm", "Pavé droit V = 924 cm³, longueur 11 cm, largeur 7 cm : hauteur = ___ cm", "Parallelepipedo V = 924 cm³, lunghezza 11 cm, larghezza 7 cm: altezza = ___ cm"]),
    t("Drei Würfel mit je 125 cm³ haben zusammen ___ cm³.", 375, "Multipliziere das Einzelvolumen mit drei.", ["Three cubes of 125 cm³ each have a total volume of ___ cm³.", "Trois cubes de 125 cm³ chacun ont un volume total de ___ cm³.", "Tre cubi di 125 cm³ ciascuno hanno un volume totale di ___ cm³."]),
    t("V = 0,4 m × 0,5 m × 2 m = ___ m³", "0,4", "Multipliziere die Dezimalzahlen schrittweise."),
  ],
  "wahrscheinlichkeit-5": [
    t("P = 3/10 = ___ %", 30, "Multipliziere den Bruch mit 100."),
    t("P = 1/8 = ___ %", "12,5", "Teile 100 durch 8."),
    t("P = 7/20 = ___ %", 35, "Erweitere den Bruch auf Hundertstel."),
    t("P = 9/12, vollständig gekürzt = ___", "3/4", "Teile Zähler und Nenner durch 3.", ["P = 9/12, in lowest terms = ___", "P = 9/12, simplifié au maximum = ___", "P = 9/12, ridotto ai minimi termini = ___"]),
    t("Würfel: P(Zahl > 4) = ___/6", 2, "Günstig sind 5 und 6.", ["Die: P(number > 4) = ___/6", "Dé : P(nombre > 4) = ___/6", "Dado: P(numero > 4) = ___/6"]),
    t("Würfel: P(gerade Zahl) = ___/6", 3, "Zähle 2, 4 und 6.", ["Die: P(even number) = ___/6", "Dé : P(nombre pair) = ___/6", "Dado: P(numero pari) = ___/6"]),
    t("Beutel: 4 rote, 3 blaue, 3 grüne Kugeln. P(rot) = ___/10", 4, "Der Nenner zählt alle Kugeln.", ["Bag: 4 red, 3 blue, 3 green balls. P(red) = ___/10", "Sac : 4 boules rouges, 3 bleues, 3 vertes. P(rouge) = ___/10", "Sacchetto: 4 palline rosse, 3 blu, 3 verdi. P(rossa) = ___/10"]),
    t("Beutel: 5 weisse, 2 schwarze Kugeln. P(nicht schwarz) = ___/7", 5, "Nicht schwarz bedeutet weiss.", ["Bag: 5 white, 2 black balls. P(not black) = ___/7", "Sac : 5 boules blanches, 2 noires. P(pas noire) = ___/7", "Sacchetto: 5 palline bianche, 2 nere. P(non nera) = ___/7"]),
    t("Glücksrad mit 8 gleichen Feldern, davon 2 Sterne: P(Stern) = ___/4", 1, "Kürze 2/8.", ["Spinner with 8 equal sections, 2 stars: P(star) = ___/4", "Roue à 8 secteurs égaux, dont 2 étoiles : P(étoile) = ___/4", "Ruota con 8 settori uguali, 2 stelle: P(stella) = ___/4"]),
    t("Zwei Münzwürfe: Anzahl gleich wahrscheinlicher Ergebnisse = ___", 4, "Liste Kopf-Kopf, Kopf-Zahl, Zahl-Kopf und Zahl-Zahl.", ["Two coin tosses: number of equally likely outcomes = ___", "Deux lancers de pièce : nombre d'issues équiprobables = ___", "Due lanci di moneta: numero di esiti equiprobabili = ___"]),
    t("Zwei Münzwürfe: P(zweimal Kopf) = 1/___", 4, "Nur eines der vier Ergebnisse passt.", ["Two coin tosses: P(two heads) = 1/___", "Deux lancers de pièce : P(deux fois pile) = 1/___", "Due lanci di moneta: P(due teste) = 1/___"]),
    t("Zwei Würfel: kleinste mögliche Summe = ___", 2, "Jeder Würfel zeigt mindestens 1.", ["Two dice: smallest possible sum = ___", "Deux dés : plus petite somme possible = ___", "Due dadi: somma minima possibile = ___"]),
    t("Zwei Würfel: grösste mögliche Summe = ___", 12, "Jeder Würfel zeigt höchstens 6.", ["Two dice: largest possible sum = ___", "Deux dés : plus grande somme possible = ___", "Due dadi: somma massima possibile = ___"]),
    t("Bei 50 Versuchen tritt ein Ereignis 18-mal ein: relative Häufigkeit = ___ %", 36, "Teile 18 durch 50 und multipliziere mit 100.", ["In 50 trials an event occurs 18 times: relative frequency = ___%", "Sur 50 essais, un événement se produit 18 fois : fréquence relative = ___ %", "In 50 prove un evento si verifica 18 volte: frequenza relativa = ___%"]),
    t("P(Ereignis) = 0 bedeutet: ___ Prozent", 0, "Ein unmögliches Ereignis hat keine Chance.", ["P(event) = 0 means: ___ percent", "P(événement) = 0 signifie : ___ pour cent", "P(evento) = 0 significa: ___ percento"]),
  ],
};

export function applyGrade5MathDuplicateReplacements(topics: Topic[]): Topic[] {
  return topics.map(topic => {
    const ids = targetIds[topic.id];
    const topicTasks = tasks[topic.id];
    if (!ids || !topicTasks) return topic;
    if (ids.length !== topicTasks.length) throw new Error(`Grade 5 math replacement mismatch: ${topic.id}`);
    const replacements = new Map(ids.map((id, index) => [id, topicTasks[index]]));
    return {
      ...topic,
      exercises: topic.exercises.map((exercise): Exercise => {
        const task = replacements.get(exercise.id);
        if (!task) return exercise;
        return {
          ...exercise,
          question: task.question,
          questionEN: task.questionEN ?? task.question,
          questionFR: task.questionFR ?? task.question,
          questionIT: task.questionIT ?? task.question,
          answer: task.answer,
          answerEN: task.answer,
          answerFR: task.answer,
          answerIT: task.answer,
          hints: [task.hint, "Kontrolliere jeden Rechenschritt, ohne die Lösung vorwegzunehmen."],
          hintsEN: ["Work through the calculation step by step.", "Check each step without guessing the answer."],
          hintsFR: ["Effectue le calcul étape par étape.", "Vérifie chaque étape sans deviner la réponse."],
          hintsIT: ["Esegui il calcolo passo dopo passo.", "Controlla ogni passaggio senza indovinare la risposta."],
          options: undefined,
          optionsEN: undefined,
          optionsFR: undefined,
          optionsIT: undefined,
        };
      }),
    };
  });
}
