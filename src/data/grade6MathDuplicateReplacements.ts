import type { Exercise, Topic } from "../types/exercise";

type L = { de: string; en: string; fr: string; it: string };
type Task = { q: L; a: string; h: L };

const l = (de: string, en: string, fr: string, it: string): L => ({ de, en, fr, it });
const same = (value: string): L => l(value, value, value, value);
const task = (q: L, a: string | number, h: L): Task => ({ q, a: String(a), h });
const calcHint = l("Rechne schrittweise und prüfe das Ergebnis.", "Calculate step by step and check the result.", "Calcule étape par étape et vérifie le résultat.", "Calcola passo dopo passo e controlla il risultato.");
const modelHint = l("Notiere zuerst die passende Beziehung oder Formel.", "First write the relevant relationship or formula.", "Écris d’abord la relation ou la formule appropriée.", "Scrivi prima la relazione o la formula adatta.");

const targetIds: Record<string, string[]> = {
  "negative-zahlen": ["g6nz3c","g6nz3h","g6nz3d","g6nz3i","g6nz3e","g6nz3j","g6nz3f","g6nz3k","g6nz3g","g6nz3l"],
  prozent: ["g6m18","g6pz3c","g6pz3h","g6m19","g6pz3d","g6pz3i","g6m20","g6pz3e","g6pz3j","g6pz3a","g6pz3f","g6pz3k","g6pz3b","g6pz3g","g6pz3l"],
  gleichungen: ["g6m28","g6gl3c","g6gl3h","g6m29","g6gl3d","g6gl3i","g6m30","g6gl3e","g6gl3j","g6gl3a","g6gl3f","g6gl3k","g6gl3b","g6gl3g","g6gl3l"],
  "verhaeltnisse-6": ["g6vh36","g6vh41","g6vh46","g6vh37","g6vh42","g6vh47","g6vh38","g6vh43","g6vh48","g6vh39","g6vh44","g6vh49","g6vh40","g6vh45","g6vh50"],
  "geometrie-6": ["g6geo36","g6geo41","g6geo46","g6geo37","g6geo42","g6geo47","g6geo38","g6geo43","g6geo48","g6geo39","g6geo44","g6geo49","g6geo40","g6geo45","g6geo50"],
  "statistik-6": ["g6stat36","g6stat41","g6stat46","g6stat37","g6stat42","g6stat47","g6stat38","g6stat43","g6stat48","g6stat39","g6stat44","g6stat49","g6stat40","g6stat45","g6stat50"],
  "wahrscheinlichkeit-6": ["g6wk36","g6wk41","g6wk46","g6wk37","g6wk42","g6wk47","g6wk38","g6wk43","g6wk48","g6wk39","g6wk44","g6wk49","g6wk40","g6wk45","g6wk50"],
  "flaechen-koerper-6": ["g6fk36","g6fk41","g6fk46","g6fk37","g6fk42","g6fk47","g6fk38","g6fk43","g6fk48","g6fk39","g6fk44","g6fk49","g6fk40","g6fk45","g6fk50"],
  "textaufgaben-6": ["g6ta36","g6ta41","g6ta46","g6ta37","g6ta42","g6ta47","g6ta38","g6ta43","g6ta48","g6ta39","g6ta44","g6ta49","g6ta40","g6ta45","g6ta50"],
};

const percentData = [[12,250,30],[18,350,63],[22,450,99],[35,240,84],[7,600,42],[65,180,117],[45,320,144],[28,750,210],[16,425,68],[72,125,90],[2.5,840,21],[125,64,80],[37.5,160,60],[48,275,132],[6,950,57]];
const equationData = [[1,7,25,18],[1,-9,14,23],[2,5,31,13],[3,-4,38,14],[4,7,55,12],[5,-8,47,11],[6,9,81,12],[7,-5,58,9],[8,4,76,9],[9,-7,83,10],[10,15,135,12],[12,-6,102,9],[3,17,68,17],[4,-11,49,15],[5,13,98,17]];
const ratioData = [[3,5,12,20],[4,7,20,35],[6,11,18,33],[8,3,40,15],[5,9,35,63],[7,4,49,28],[2,13,10,65],[9,14,27,42],[12,5,60,25],[15,8,45,24],[11,6,55,30],[4,15,28,105],[13,10,39,30],[16,9,80,45],[7,12,42,72]];

const negative: Task[] = [
  ["−18 + 27 = ___",9],["14 − 31 = ___",-17],["−12 − 19 = ___",-31],["−7 × 8 = ___",-56],["−72 ÷ 9 = ___",-8],
  ["(−6) × (−11) = ___",66],["−45 + 18 − 7 = ___",-34],["|−23| − 9 = ___",14],["−3³ + 5 = ___",-22],["(−4)² − 21 = ___",-5],
].map(([q,a]) => task(same(String(q)), a as number, calcHint));

const percent: Task[] = percentData.map(([p,b,a]) => task(
  l(`${p} % von ${b} = ___`, `${p}% of ${b} = ___`, `${p} % de ${b} = ___`, `${p}% di ${b} = ___`), a, calcHint));

const equations: Task[] = equationData.map(([coef,constant,total,answer]) => task(
  same(`${coef === 1 ? "" : `${coef} · `}x ${constant < 0 ? "−" : "+"} ${Math.abs(constant)} = ${total}; x = ___`), answer, modelHint));

const ratios: Task[] = ratioData.map(([a,b,c,d]) => task(same(`${a} : ${b} = ${c} : ___`), d, modelHint));

const geometry: Task[] = [
  task(l("Dreieck: Winkel 48° und 67°. Dritter Winkel = ___°", "Triangle: angles 48° and 67°. Third angle = ___°", "Triangle : angles 48° et 67°. Troisième angle = ___°", "Triangolo: angoli 48° e 67°. Terzo angolo = ___°"),65,modelHint),
  task(l("Gleichschenkliges Dreieck: Spitzenwinkel 38°. Ein Basiswinkel = ___°", "Isosceles triangle: vertex angle 38°. One base angle = ___°", "Triangle isocèle : angle au sommet 38°. Un angle à la base = ___°", "Triangolo isoscele: angolo al vertice 38°. Un angolo alla base = ___°"),71,modelHint),
  task(l("Viereck: drei Winkel sind 82°, 104° und 91°. Vierter Winkel = ___°", "Quadrilateral: three angles are 82°, 104° and 91°. Fourth angle = ___°", "Quadrilatère : trois angles mesurent 82°, 104° et 91°. Quatrième angle = ___°", "Quadrilatero: tre angoli sono 82°, 104° e 91°. Quarto angolo = ___°"),83,modelHint),
  task(l("Regelmässiges Sechseck: ein Innenwinkel = ___°", "Regular hexagon: one interior angle = ___°", "Hexagone régulier : un angle intérieur = ___°", "Esagono regolare: un angolo interno = ___°"),120,modelHint),
  task(l("Ein Kreis hat Radius 7 cm. Durchmesser = ___ cm", "A circle has radius 7 cm. Diameter = ___ cm", "Un cercle a un rayon de 7 cm. Diamètre = ___ cm", "Un cerchio ha raggio 7 cm. Diametro = ___ cm"),14,modelHint),
  task(l("Ein Halbkreis hat einen Winkel von ___°", "A semicircle has an angle of ___°", "Un demi-cercle a un angle de ___°", "Un semicerchio ha un angolo di ___°"),180,modelHint),
  task(l("Parallele Geraden: Ein entsprechender Winkel ist 73°. Der andere = ___°", "Parallel lines: one corresponding angle is 73°. The other = ___°", "Droites parallèles : un angle correspondant mesure 73°. L’autre = ___°", "Rette parallele: un angolo corrispondente è 73°. L’altro = ___°"),73,modelHint),
  task(l("Nebenwinkel zu 124° = ___°", "Supplementary angle to 124° = ___°", "Angle supplémentaire de 124° = ___°", "Angolo supplementare a 124° = ___°"),56,modelHint),
  task(l("Ein rechter Winkel wird im Verhältnis 2:3 geteilt. Kleiner Winkel = ___°", "A right angle is split in the ratio 2:3. Smaller angle = ___°", "Un angle droit est partagé selon le rapport 2:3. Petit angle = ___°", "Un angolo retto è diviso nel rapporto 2:3. Angolo minore = ___°"),36,modelHint),
  task(l("Massstab 1:5000: 3 cm auf der Karte = ___ m", "Scale 1:5000: 3 cm on the map = ___ m", "Échelle 1:5000 : 3 cm sur la carte = ___ m", "Scala 1:5000: 3 cm sulla carta = ___ m"),150,modelHint),
  task(l("Ein Würfel hat ___ Kanten.", "A cube has ___ edges.", "Un cube possède ___ arêtes.", "Un cubo ha ___ spigoli."),12,modelHint),
  task(l("Ein Quader hat ___ Flächen.", "A cuboid has ___ faces.", "Un pavé droit possède ___ faces.", "Un parallelepipedo ha ___ facce."),6,modelHint),
  task(l("Ein Dreiecksprisma hat ___ Ecken.", "A triangular prism has ___ vertices.", "Un prisme triangulaire possède ___ sommets.", "Un prisma triangolare ha ___ vertici."),6,modelHint),
  task(l("Spiegelung von P(5|−2) an der y-Achse: x = ___", "Reflection of P(5|−2) across the y-axis: x = ___", "Symétrie de P(5|−2) par rapport à l’axe y : x = ___", "Riflessione di P(5|−2) rispetto all’asse y: x = ___"),-5,modelHint),
  task(l("Mittelpunkt von A(−4|6) und B(8|6): x = ___", "Midpoint of A(−4|6) and B(8|6): x = ___", "Milieu de A(−4|6) et B(8|6) : x = ___", "Punto medio di A(−4|6) e B(8|6): x = ___"),2,modelHint),
];

const statistics: Task[] = [
  [[5,7,9,11,13],9],[[4,6,6,8,11],6],[[2,5,7,10,14,16],14],[[12,15,15,17,20],"15,8"],[[3,8,9,12,18],9],
  [[6,6,7,8,8,8,9],3],[[21,18,24,27,30],24],[[1,4,4,5,7,9],"4,5"],[[14,16,19,23,28],14],[[32,28,35,25,30],30],
  [[7,9,10,10,12,15,21],10],[[45,50,55,60],15],[[2,4,8,12,16,24],11],[[18,18,19,20,22,25],"19,5"],[[11,14,17,20,23,26],15],
].map(([values,answer],index) => task(
  l(`${index % 3 === 0 ? "Mittelwert" : index % 3 === 1 ? "Median" : "Spannweite"} von ${(values as number[]).join(", ")} = ___`, `${index % 3 === 0 ? "Mean" : index % 3 === 1 ? "Median" : "Range"} of ${(values as number[]).join(", ")} = ___`, `${index % 3 === 0 ? "Moyenne" : index % 3 === 1 ? "Médiane" : "Étendue"} de ${(values as number[]).join(", ")} = ___`, `${index % 3 === 0 ? "Media" : index % 3 === 1 ? "Mediana" : "Intervallo"} di ${(values as number[]).join(", ")} = ___`), answer as string | number, calcHint));

const probabilityData = [[1,6],[2,6],[3,8],[5,12],[1,4],[3,10],[7,20],[2,9],[4,15],[5,16],[1,3],[9,25],[11,30],[13,40],[17,50]];
const probability: Task[] = probabilityData.map(([fav,total]) => task(
  l(`${fav} von ${total} gleich möglichen Ergebnissen sind günstig. P = ___`, `${fav} of ${total} equally likely outcomes are favourable. P = ___`, `${fav} résultats sur ${total} sont favorables. P = ___`, `${fav} risultati su ${total} sono favorevoli. P = ___`), `${fav}/${total}`, modelHint));

const solidsData = [[8,6,5,240],[12,7,4,336],[9,9,9,729],[15,8,3,360],[20,5,6,600],[11,10,7,770],[14,9,2,252],[16,6,8,768],[13,4,5,260],[18,12,3,648],[7,7,12,588],[25,4,9,900],[10,10,15,1500],[22,5,5,550],[24,8,6,1152]];
const solids: Task[] = solidsData.map(([a,b,c,v]) => task(
  l(`Quader ${a} cm × ${b} cm × ${c} cm: Volumen = ___ cm³`, `Cuboid ${a} cm × ${b} cm × ${c} cm: volume = ___ cm³`, `Pavé droit ${a} cm × ${b} cm × ${c} cm : volume = ___ cm³`, `Parallelepipedo ${a} cm × ${b} cm × ${c} cm: volume = ___ cm³`), v, modelHint));

const wordProblemData = [[6,18,108],[8,24,192],[15,7,105],[12,35,420],[9,48,432],[14,27,378],[16,22,352],[25,19,475],[18,32,576],[11,45,495],[20,28,560],[13,36,468],[17,29,493],[21,26,546],[24,31,744]];
const wordProblems: Task[] = wordProblemData.map(([count,price,total],index) => task(
  l(`${count} ${index % 2 ? "Eintrittskarten" : "Hefte"} kosten je CHF ${price}. Gesamtpreis = CHF ___`, `${count} ${index % 2 ? "tickets" : "notebooks"} cost CHF ${price} each. Total price = CHF ___`, `${count} ${index % 2 ? "billets" : "cahiers"} coûtent CHF ${price} chacun. Prix total = CHF ___`, `${count} ${index % 2 ? "biglietti" : "quaderni"} costano CHF ${price} ciascuno. Prezzo totale = CHF ___`), total, modelHint));

const tasks: Record<string, Task[]> = {
  "negative-zahlen": negative,
  prozent: percent,
  gleichungen: equations,
  "verhaeltnisse-6": ratios,
  "geometrie-6": geometry,
  "statistik-6": statistics,
  "wahrscheinlichkeit-6": probability,
  "flaechen-koerper-6": solids,
  "textaufgaben-6": wordProblems,
};

const value = (entry: L, language: keyof L) => entry[language];

export function applyGrade6MathDuplicateReplacements(topics: Topic[]): Topic[] {
  return topics.map(topic => {
    const ids = targetIds[topic.id];
    const replacements = tasks[topic.id];
    if (!ids || !replacements) return topic;
    if (ids.length !== replacements.length) throw new Error(`Grade 6 math replacement mismatch: ${topic.id}`);
    const map = new Map(ids.map((id, index) => [id, replacements[index]]));
    return {
      ...topic,
      exercises: topic.exercises.map((exercise): Exercise => {
        const replacement = map.get(exercise.id);
        if (!replacement) return exercise;
        if (exercise.type !== "fill-in-blank") throw new Error(`Grade 6 math type mismatch: ${exercise.id}`);
        return {
          ...exercise,
          question: value(replacement.q, "de"), questionEN: value(replacement.q, "en"), questionFR: value(replacement.q, "fr"), questionIT: value(replacement.q, "it"),
          answer: replacement.a, answerEN: replacement.a, answerFR: replacement.a, answerIT: replacement.a,
          hints: [value(replacement.h, "de"), "Kontrolliere Vorzeichen, Einheiten und Rechenweg."],
          hintsEN: [value(replacement.h, "en"), "Check signs, units and each calculation step."],
          hintsFR: [value(replacement.h, "fr"), "Vérifie les signes, les unités et chaque étape du calcul."],
          hintsIT: [value(replacement.h, "it"), "Controlla segni, unità e ogni passaggio del calcolo."],
        };
      }),
    };
  });
}
