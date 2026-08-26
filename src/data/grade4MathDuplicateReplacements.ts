import type { Exercise, Topic } from "../types/exercise";

type Task = { question: string; answer: string; hint: string; questionEN?: string; questionFR?: string; questionIT?: string };

const targetIds: Record<string, string[]> = {
  "zahlen-bis-10000": ["g4m3c", "g4m3d", "g4m3e", "g4m3f", "g4m3g", "g4m3h", "g4m3i", "g4m3j", "g4m3k", "g4m3l"],
  einmaleins: ["g4m18", "g4m19", "g4e2g", "g4e3a", "g4e3b", "g4e3c", "g4e3d", "g4e3e", "g4e3f", "g4e3g", "g4e3h", "g4e3i", "g4e3j", "g4e3k", "g4e3l", "g4e3m"],
  "brueche-einfuehrung": ["g4m29", "g4m30", "g4b2a", "g4b3a", "g4b3b", "g4b3c", "g4b3d", "g4b3e", "g4b3f", "g4b3g", "g4b3h", "g4b3i", "g4b3j", "g4b3k", "g4b3l"],
  "schriftl-addieren": Array.from({ length: 15 }, (_, i) => `sa${i + 36}`),
  "schriftl-subtrahieren": Array.from({ length: 15 }, (_, i) => `ss${i + 36}`),
  "schriftl-multiplizieren": Array.from({ length: 15 }, (_, i) => `sm${i + 36}`),
  "geometrie-4": Array.from({ length: 15 }, (_, i) => `ge4_${i + 36}`),
  "groessen-messen-4": Array.from({ length: 15 }, (_, i) => `gm4_${i + 36}`),
  "textaufgaben-4": Array.from({ length: 15 }, (_, i) => `ta4_${i + 36}`),
};

const numeric = (q: string, a: number | string, hint: string): Task => ({ question: q, answer: String(a), hint });

const binary = (pairs: number[][], sign: string, operation: (a: number, b: number) => number, hint: string): Task[] =>
  pairs.map(([a, b]) => numeric(`${a} ${sign} ${b} = ___`, operation(a, b), hint));

const taskSets: Record<string, Task[]> = {
  "schriftl-addieren": binary([[3478,2567],[4826,3175],[5904,2088],[1649,7352],[2768,4587],[6305,1896],[4097,3824],[7156,1348],[5289,2466],[1937,6805],[3648,4279],[8056,947],[2495,5398],[6714,2287],[4569,3436]], "+", (a,b)=>a+b, "Addiere stellenweise und beachte Überträge."),
  "schriftl-subtrahieren": binary([[8432,2758],[7004,1867],[9650,4386],[6123,2947],[8000,3568],[7541,2895],[9036,4778],[6810,2594],[5200,1846],[9999,5637],[7364,4289],[8502,3975],[6040,2786],[9187,6498],[7777,3888]], "−", (a,b)=>a-b, "Subtrahiere stellenweise und tausche, wenn nötig."),
  "schriftl-multiplizieren": binary([[124,6],[208,4],[315,7],[432,5],[156,8],[243,9],[507,3],[684,6],[729,4],[318,7],[845,5],[962,3],[476,8],[593,6],[707,9]], "×", (a,b)=>a*b, "Zerlege die dreistellige Zahl und addiere die Teilprodukte."),
  einmaleins: binary([[6,7],[8,9],[12,4],[7,8],[9,6],[11,7],[12,8],[6,9],[7,12],[8,11],[9,9],[12,12],[7,7],[6,11],[8,8],[9,12]], "×", (a,b)=>a*b, "Nutze eine bekannte Nachbaraufgabe.")
    .map(task => ({ ...task, question: `Einmaleins: ${task.question}`, questionEN:`Times tables: ${task.question}`, questionFR:`Tables de multiplication : ${task.question}`, questionIT:`Tabelline: ${task.question}` })),
  "zahlen-bis-10000": [
    numeric("Welche Zahl ist 1000 grösser als 6842? ___",7842,"Verändere nur die Tausenderstelle."),
    numeric("Welche Zahl ist 100 kleiner als 5307? ___",5207,"Verändere nur die Hunderterstelle."),
    numeric("Runde 7648 auf den nächsten Hunderter: ___",7600,"Betrachte die Zehnerstelle."),
    numeric("Runde 8951 auf den nächsten Tausender: ___",9000,"Betrachte die Hunderterstelle."),
    numeric("Setze fort: 3250, 3500, 3750, ___",4000,"Bestimme den gleichbleibenden Abstand."),
    numeric("9200 − 6750 = ___",2450,"Kontrolliere das Ergebnis durch Addition."),
    numeric("8 Tausender + 3 Hunderter + 6 Einer = ___",8306,"Die Zehnerstelle bleibt leer."),
    numeric("Die Hälfte von 9600 ist ___.",4800,"Halbiere zuerst 96."),
    numeric("Welche Zahl liegt genau zwischen 4200 und 5000? ___",4600,"Bestimme die Hälfte des Abstands."),
    numeric("Neuntausendvierhundertachtzehn = ___",9418,"Ordne jede Ziffer der richtigen Stelle zu."),
  ],
  "brueche-einfuehrung": [
    numeric("Die Hälfte von 18 ist ___.",9,"Teile 18 in zwei gleiche Teile."), numeric("Ein Viertel von 28 ist ___.",7,"Teile 28 in vier gleiche Teile."),
    numeric("Drei Viertel von 20 sind ___.",15,"Bestimme erst ein Viertel."), numeric("Zwei Drittel von 24 sind ___.",16,"Bestimme erst ein Drittel."),
    numeric("Ergänze den Zähler: 1/2 entspricht ___/8.",4,"Erweitere Zähler und Nenner mit derselben Zahl."), numeric("Ergänze den Nenner: 3/5 entspricht 12/___.",20,"Der Zähler wurde vervierfacht."),
    numeric("Ergänze den Zähler der Summe: 1/8 + 3/8 ergibt ___/8.",4,"Addiere bei gleichem Nenner die Zähler."), numeric("Ergänze den Zähler der Differenz: 7/10 − 2/10 ergibt ___/10.",5,"Der Nenner bleibt gleich."),
    numeric("Wie viele Viertel ergeben zwei Ganze? ___",8,"Ein Ganzes besteht aus vier Vierteln."), numeric("5/20 gekürzt = 1/___",4,"Teile Zähler und Nenner durch 5."),
    numeric("6 von 10 Feldern sind markiert: ___/10",6,"Der Zähler nennt die markierten Felder."), numeric("___/6 = 1/2",3,"Gesucht ist die Hälfte von 6."),
    numeric("Ergänze den Zähler der Summe: 2/5 + 1/5 ergibt ___/5.",3,"Addiere die Zähler."), numeric("9/12 gekürzt durch 3 ergibt ___/4.",3,"Teile beide Zahlen durch 3."),
    numeric("Ergänze den Zähler: 6/6 − 1/6 ergibt ___/6.",5,"Subtrahiere einen von sechs Teilen."),
  ],
  "geometrie-4": [
    numeric("Rechteck 12 cm × 7 cm: Umfang = ___ cm",38,"Addiere Länge und Breite und verdopple."), numeric("Rechteck 9 cm × 6 cm: Fläche = ___ cm²",54,"Multipliziere Länge und Breite."),
    numeric("Quadrat mit Seite 11 cm: Umfang = ___ cm",44,"Ein Quadrat hat vier gleiche Seiten."), numeric("Quadrat mit Seite 8 cm: Fläche = ___ cm²",64,"Multipliziere die Seite mit sich selbst."),
    numeric("Dreieckseiten 6 cm, 8 cm, 9 cm: Umfang = ___ cm",23,"Addiere alle drei Seiten."), numeric("Ein rechter Winkel misst ___ Grad.",90,"Denke an eine Blattecke."),
    numeric("Eine halbe Drehung misst ___ Grad.",180,"Eine ganze Drehung hat 360 Grad."), numeric("Ein Rechteck hat ___ Symmetrieachsen.",2,"Eine ist waagrecht, eine senkrecht."),
    numeric("Ein Quadrat hat ___ Symmetrieachsen.",4,"Denke auch an die Diagonalen."), numeric("Ein Würfel hat ___ Flächen.",6,"Zähle oben, unten und die Seiten."),
    numeric("Ein Quader hat ___ Ecken.",8,"Oben und unten sind gleich viele."), numeric("Zwei rechte Winkel ergeben ___ Grad.",180,"Verdopple einen rechten Winkel."),
    numeric("Ein gleichseitiges Dreieck hat ___ gleich lange Seiten.",3,"Bei ihm sind alle Seiten gleich."), numeric("Ein Fünfeck hat ___ Seiten.",5,"Der Name verrät die Anzahl."),
    numeric("Rechteckfläche 72 cm², Länge 9 cm: Breite = ___ cm",8,"Teile die Fläche durch die Länge."),
  ],
  "groessen-messen-4": [
    numeric("3 km 250 m = ___ m",3250,"Wandle Kilometer zuerst in Meter um."), numeric("4 m 8 cm = ___ cm",408,"Ein Meter sind 100 Zentimeter."),
    numeric("2750 g = ___ kg und 750 g",2,"Tausend Gramm sind ein Kilogramm."), numeric("6 l 300 ml = ___ ml",6300,"Ein Liter sind 1000 Milliliter."),
    numeric("2 h 35 min = ___ min",155,"Eine Stunde sind 60 Minuten."), numeric("CHF 24.50 + CHF 8.50 = CHF ___",33,"Addiere Franken und Rappen stellenweise."),
    numeric("5 kg − 1750 g = ___ g",3250,"Wandle zuerst alles in Gramm um."), numeric("7 m 40 cm − 2 m 85 cm = ___ cm",455,"Wandle zuerst alles in Zentimeter um."),
    numeric("1 Tag und 6 Stunden = ___ Stunden",30,"Ein Tag hat 24 Stunden."), numeric("4500 ml = ___ l und 500 ml",4,"Tausend Milliliter sind ein Liter."),
    numeric("Ein Viertel von 2 kg sind ___ g",500,"Zwei Kilogramm sind 2000 Gramm."), numeric("3 Wochen haben ___ Tage.",21,"Eine Woche hat sieben Tage."),
    numeric("2,5 km = ___ m",2500,"Ein Kilometer sind 1000 Meter."), numeric("CHF 50 − CHF 18 = CHF ___",32,"Subtrahiere die Frankenbeträge."),
    numeric("1 h 45 min + 35 min = ___ min",140,"Wandle die Stunde zuerst in Minuten um."),
  ],
  "textaufgaben-4": Array.from({ length: 15 }, (_, i) => {
    const boxes=i+4, each=18+i*2;
    return { question:`${boxes} Schachteln enthalten je ${each} Farbstifte. Zusammen sind es ___ Farbstifte.`, questionEN:`${boxes} boxes contain ${each} coloured pencils each. Altogether there are ___ pencils.`, questionFR:`${boxes} boîtes contiennent chacune ${each} crayons. Il y a ___ crayons en tout.`, questionIT:`${boxes} scatole contengono ${each} matite ciascuna. In tutto ci sono ___ matite.`, answer:String(boxes*each), hint:"Multipliziere Schachteln mit Stiften pro Schachtel." };
  }),
};

const localisedQuestions: Record<string, [string, string, string][]> = {
  "zahlen-bis-10000": [
    ["What number is 1,000 greater than 6,842? ___","Quel nombre est supérieur de 1 000 à 6 842 ? ___","Quale numero è maggiore di 1 000 rispetto a 6 842? ___"],
    ["What number is 100 less than 5,307? ___","Quel nombre est inférieur de 100 à 5 307 ? ___","Quale numero è minore di 100 rispetto a 5 307? ___"],
    ["Round 7,648 to the nearest hundred: ___","Arrondis 7 648 à la centaine la plus proche : ___","Arrotonda 7 648 al centinaio più vicino: ___"],
    ["Round 8,951 to the nearest thousand: ___","Arrondis 8 951 au millier le plus proche : ___","Arrotonda 8 951 al migliaio più vicino: ___"],
    ["Continue the sequence: 3,250, 3,500, 3,750, ___","Continue la suite : 3 250, 3 500, 3 750, ___","Continua la sequenza: 3 250, 3 500, 3 750, ___"],
    ["9,200 − 6,750 = ___","9 200 − 6 750 = ___","9 200 − 6 750 = ___"],
    ["8 thousands + 3 hundreds + 6 ones = ___","8 milliers + 3 centaines + 6 unités = ___","8 migliaia + 3 centinaia + 6 unità = ___"],
    ["Half of 9,600 is ___.","La moitié de 9 600 est ___.","La metà di 9 600 è ___."],
    ["What number is exactly halfway between 4,200 and 5,000? ___","Quel nombre se trouve exactement entre 4 200 et 5 000 ? ___","Quale numero si trova esattamente a metà tra 4 200 e 5 000? ___"],
    ["Nine thousand four hundred and eighteen = ___","Neuf mille quatre cent dix-huit = ___","Novemilaquattrocentodiciotto = ___"],
  ],
  "brueche-einfuehrung": [
    ["Half of 18 is ___.","La moitié de 18 est ___.","La metà di 18 è ___."], ["One quarter of 28 is ___.","Un quart de 28 est ___.","Un quarto di 28 è ___."],
    ["Three quarters of 20 are ___.","Trois quarts de 20 font ___.","Tre quarti di 20 sono ___."], ["Two thirds of 24 are ___.","Deux tiers de 24 font ___.","Due terzi di 24 sono ___."],
    ["Complete the numerator: 1/2 equals ___/8.","Complète le numérateur : 1/2 équivaut à ___/8.","Completa il numeratore: 1/2 equivale a ___/8."],
    ["Complete the denominator: 3/5 equals 12/___.","Complète le dénominateur : 3/5 équivaut à 12/___.","Completa il denominatore: 3/5 equivale a 12/___."],
    ["Complete the numerator: 1/8 + 3/8 equals ___/8.","Complète le numérateur : 1/8 + 3/8 donne ___/8.","Completa il numeratore: 1/8 + 3/8 dà ___/8."],
    ["Complete the numerator: 7/10 − 2/10 equals ___/10.","Complète le numérateur : 7/10 − 2/10 donne ___/10.","Completa il numeratore: 7/10 − 2/10 dà ___/10."],
    ["How many quarters make two wholes? ___","Combien de quarts forment deux entiers ? ___","Quanti quarti formano due interi? ___"],
    ["5/20 in lowest terms equals 1/___","5/20 simplifié donne 1/___","5/20 ridotto ai minimi termini dà 1/___"],
    ["6 of 10 squares are shaded: ___/10","6 cases sur 10 sont coloriées : ___/10","6 caselle su 10 sono colorate: ___/10"],
    ["___/6 equals 1/2","___/6 équivaut à 1/2","___/6 equivale a 1/2"],
    ["Complete the numerator: 2/5 + 1/5 equals ___/5.","Complète le numérateur : 2/5 + 1/5 donne ___/5.","Completa il numeratore: 2/5 + 1/5 dà ___/5."],
    ["9/12 divided by 3 equals ___/4.","9/12 simplifié par 3 donne ___/4.","9/12 semplificato per 3 dà ___/4."],
    ["Complete the numerator: 6/6 − 1/6 equals ___/6.","Complète le numérateur : 6/6 − 1/6 donne ___/6.","Completa il numeratore: 6/6 − 1/6 dà ___/6."],
  ],
  "geometrie-4": [
    ["Rectangle 12 cm × 7 cm: perimeter = ___ cm","Rectangle 12 cm × 7 cm : périmètre = ___ cm","Rettangolo 12 cm × 7 cm: perimetro = ___ cm"],
    ["Rectangle 9 cm × 6 cm: area = ___ cm²","Rectangle 9 cm × 6 cm : aire = ___ cm²","Rettangolo 9 cm × 6 cm: area = ___ cm²"],
    ["Square with side 11 cm: perimeter = ___ cm","Carré de 11 cm de côté : périmètre = ___ cm","Quadrato con lato di 11 cm: perimetro = ___ cm"],
    ["Square with side 8 cm: area = ___ cm²","Carré de 8 cm de côté : aire = ___ cm²","Quadrato con lato di 8 cm: area = ___ cm²"],
    ["Triangle sides 6 cm, 8 cm, 9 cm: perimeter = ___ cm","Côtés du triangle 6 cm, 8 cm, 9 cm : périmètre = ___ cm","Lati del triangolo 6 cm, 8 cm, 9 cm: perimetro = ___ cm"],
    ["A right angle measures ___ degrees.","Un angle droit mesure ___ degrés.","Un angolo retto misura ___ gradi."],
    ["Half a turn measures ___ degrees.","Un demi-tour mesure ___ degrés.","Mezzo giro misura ___ gradi."],
    ["A rectangle has ___ axes of symmetry.","Un rectangle a ___ axes de symétrie.","Un rettangolo ha ___ assi di simmetria."],
    ["A square has ___ axes of symmetry.","Un carré a ___ axes de symétrie.","Un quadrato ha ___ assi di simmetria."],
    ["A cube has ___ faces.","Un cube a ___ faces.","Un cubo ha ___ facce."],
    ["A cuboid has ___ vertices.","Un pavé droit a ___ sommets.","Un parallelepipedo ha ___ vertici."],
    ["Two right angles total ___ degrees.","Deux angles droits mesurent ensemble ___ degrés.","Due angoli retti misurano insieme ___ gradi."],
    ["An equilateral triangle has ___ equal sides.","Un triangle équilatéral a ___ côtés égaux.","Un triangolo equilatero ha ___ lati uguali."],
    ["A pentagon has ___ sides.","Un pentagone a ___ côtés.","Un pentagono ha ___ lati."],
    ["Rectangle area 72 cm², length 9 cm: width = ___ cm","Aire du rectangle 72 cm², longueur 9 cm : largeur = ___ cm","Area del rettangolo 72 cm², lunghezza 9 cm: larghezza = ___ cm"],
  ],
  "groessen-messen-4": [
    ["3 km 250 m = ___ m","3 km 250 m = ___ m","3 km 250 m = ___ m"], ["4 m 8 cm = ___ cm","4 m 8 cm = ___ cm","4 m 8 cm = ___ cm"],
    ["2,750 g = ___ kg and 750 g","2 750 g = ___ kg et 750 g","2 750 g = ___ kg e 750 g"], ["6 l 300 ml = ___ ml","6 l 300 ml = ___ ml","6 l 300 ml = ___ ml"],
    ["2 h 35 min = ___ min","2 h 35 min = ___ min","2 h 35 min = ___ min"], ["CHF 24.50 + CHF 8.50 = CHF ___","CHF 24.50 + CHF 8.50 = CHF ___","CHF 24.50 + CHF 8.50 = CHF ___"],
    ["5 kg − 1,750 g = ___ g","5 kg − 1 750 g = ___ g","5 kg − 1 750 g = ___ g"], ["7 m 40 cm − 2 m 85 cm = ___ cm","7 m 40 cm − 2 m 85 cm = ___ cm","7 m 40 cm − 2 m 85 cm = ___ cm"],
    ["1 day and 6 hours = ___ hours","1 jour et 6 heures = ___ heures","1 giorno e 6 ore = ___ ore"], ["4,500 ml = ___ l and 500 ml","4 500 ml = ___ l et 500 ml","4 500 ml = ___ l e 500 ml"],
    ["One quarter of 2 kg is ___ g","Un quart de 2 kg représente ___ g","Un quarto di 2 kg è ___ g"], ["3 weeks have ___ days.","3 semaines comptent ___ jours.","3 settimane hanno ___ giorni."],
    ["2.5 km = ___ m","2,5 km = ___ m","2,5 km = ___ m"], ["CHF 50 − CHF 18 = CHF ___","CHF 50 − CHF 18 = CHF ___","CHF 50 − CHF 18 = CHF ___"],
    ["1 h 45 min + 35 min = ___ min","1 h 45 min + 35 min = ___ min","1 h 45 min + 35 min = ___ min"],
  ],
};

export function applyGrade4MathDuplicateReplacements(topics: Topic[]): Topic[] {
  return topics.map(topic => {
    const ids = targetIds[topic.id], tasks = taskSets[topic.id];
    if (!ids || !tasks) return topic;
    if (ids.length !== tasks.length) throw new Error(`Grade 4 math replacement mismatch: ${topic.id}`);
    const replacements = new Map(ids.map((id, i) => [id, { ...tasks[i], localised: localisedQuestions[topic.id]?.[i] }]));
    return { ...topic, exercises: topic.exercises.map((exercise): Exercise => {
      const task = replacements.get(exercise.id);
      if (!task) return exercise;
      const common = "Kontrolliere deine Rechnung, ohne die Lösung vorwegzunehmen.";
      const [questionEN, questionFR, questionIT] = task.localised ?? [task.questionEN ?? task.question, task.questionFR ?? task.question, task.questionIT ?? task.question];
      return { ...exercise, question:task.question, questionEN, questionFR, questionIT, answer:task.answer, answerEN:task.answer, answerFR:task.answer, answerIT:task.answer, hints:[task.hint,common], hintsEN:["Work step by step.","Check your calculation."], hintsFR:["Calcule étape par étape.","Vérifie ton calcul."], hintsIT:["Calcola passo dopo passo.","Controlla il calcolo."], options:undefined, optionsEN:undefined, optionsFR:undefined, optionsIT:undefined };
    }) };
  });
}
