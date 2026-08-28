import { getSubjects, getTopics } from "../src/data";
import {
  LP21_REPLACEMENT_COUNT,
  LP21_REPLACEMENT_GROUP_IDS,
} from "../src/data/lp21ExerciseReplacements";
import { LP21_API_FIT_EXPANDED_TARGET_COUNT } from "../src/data/lp21ApiFitReplacements";

const OFFICIAL_REFERENCES = [
  "https://v-fe.lehrplan.ch/posterMA_printout.php?ekalias=0&fb_id=5&k=1&z=1",
  "https://v-fe.lehrplan.ch/posterMA_printout.php?ekalias=0&fb_id=5&k=1&z=2",
  "https://v-fe.lehrplan.ch/posterSPR_printout.php?ekalias=0&f_id=11&fb_id=1&k=1&z=2",
  "https://v-fe.lehrplan.ch/posterNMG_printout.php?ekalias=0&f_id=1&fb_id=6&k=1&z=2",
] as const;

const FORBIDDEN_BY_GRADE: Record<number, RegExp> = {
  1: /\b(?:Standardabweichung|Boxplot|Quantenmechanik|Konjunktiv|CRISPR|parasitäre Pflanzen|Karnivore|blinder Fleck|Sehnerv|keine Kraft auf)\b/i,
  2: /\b(?:Sublimation|Osmose|Aquifer|Oberflächenspannung|pH-Wert|Saurer Regen|Destillation|Kapillarwirkung|Biolumineszenz|Streudiagramm|Scatterplot|Korrelation)\b|3⁴|π \(Pi\)/i,
  3: /\b(?:Standardabweichung|Streudiagramm|Korrelation|Boxplot|Quartile?|Pythagoras|Hypotenuse|Goldenes Verhältnis|fraktale Geometrie|Euler-Formel|Konjunktiv|episches Theater|Exposé|Leitmotiv|Oxymoron|Exkurs|Snellius|Interferenz|Diffraktion|Polarisation|photoelektrisch|Brechungsindex|Diamagnetismus|elektromagnetische Induktion|Lichtquant|Wellenoptik|Synchrotron|elektromagnetische Strahlung|konvexe Linse|konkave Linse|Lichtgeschwindigkeit|Hologramm|Phosphoreszenz|Geoengineering|Eutrophierung|planetare Grenze|CO₂-Äquivalent|Living Lab|Parlamentarismus|Proporzwahlrecht|Majorzwahlrecht|Checks and Balances|Oligarchie|Verfassungsgerichtsbarkeit|Legitimität eines Staates|politischer Pluralismus)\b|π|√/i,
  4: /\b(?:kgV|Konjunktiv|Keystone-Art|Sublimation|Xylem|Stomata|Rhizom|Calvin-Zyklus|Kambium|Abscisinsäure|Quantenmechanik|ökologische Sukzession|Geoengineering|Weber-Fechner|kortikale Karte|Aquifer|Aquifuge|Eutrophierung|Kapillarwirkung|Kreisumfang|Kreisfläche)\b|π|√/i,
  5: /\b(?:Parataxe|Hypotaxe|Newtons Gravitationsgesetz|Mitose|Meiose|Ruhemembranpotenzial|Homöostase|Apoptose|Quantenmechanik|Relativitätstheorie|Geoengineering|Genomduplizierung|CRISPR|Quantencomputing|Moore's Law|Kohäsionsfonds|Max Weber|Protektionismus|Oligopol|komparativer Vorteil|WTO|Bruttowertschöpfung|Handelsbilanz|Grenznutzen|Nash-Gleichgewicht|Keynes|Bretton-Woods|Hubbles Gesetz|Spektroskopie|Rotverschiebung)\b/i,
  6: /\b(?:Gleichungssystem|rechtsschief|Varianz|Pythagoras|Hypotenuse|Gerundivum|Diathese|Metonymie|Clausius-Clapeyron|Leidenfrost|Massenwirkungsgesetz|dekadischer Logarithmus|photoelektrisch|Quantenoptik|Mitose|Osmose|Eukaryoten|Ribosomen|Meiose|Mutation|Phagozytose|zentrale Dogma|Transkription|Translation|CRISPR|Epigenetik|Apoptose|Perowskit|Quantencomputing|Relativitätstheorie|Hawking-Strahlung|Drake-Gleichung|Zeitdilatation|Geoengineering|Longtermism|superintelligence|existentielles Risiko|Just Transition|Gini-Koeffizient|Washingtoner Konsens|Dependency Theory|Hegemonie im Weltsystem|Quasar|Hertzsprung-Russell|kosmische Hintergrundstrahlung|Olbers-Paradoxon|Fermi-Paradoxon|Chandrasekhar|kosmische Inflation|Anthropische Prinzip)\b|π|√/i,
};

type Failure = { grade: number; subject: string; topic: string; id: string; reason: string };
const failures: Failure[] = [];
const resolvedLocations = new Set<string>();
const validatedFamilies = new Set<string>();
let totalExercises = 0;
let fillExercises = 0;
let fillExercisesWithLiteralBlank = 0;
let multiGapFillExercises = 0;

for (const grade of [1, 2, 3, 4, 5, 6]) {
  for (const subject of getSubjects(grade)) {
    for (const topic of getTopics(grade, subject.id)) {
      for (const exercise of topic.exercises) {
        totalExercises += 1;
        validatedFamilies.add(`${grade}/${subject.id}/${topic.id}/${exercise.type}`);
        const location = `${grade}-${subject.id}-${exercise.id}`;
        const expectedGroup = Object.entries(LP21_REPLACEMENT_GROUP_IDS).find(([group, ids]) => {
          const [groupGrade, groupSubject] = group.split("-");
          return groupGrade === String(grade) && groupSubject === subject.id && (ids as readonly string[]).includes(exercise.id);
        });
        if (expectedGroup) resolvedLocations.add(location);

        const text = [exercise.question, exercise.answer, ...(exercise.options ?? []), ...(exercise.hints ?? [])].join(" ");
        if (FORBIDDEN_BY_GRADE[grade].test(text)) {
          failures.push({ grade, subject: subject.id, topic: topic.id, id: exercise.id, reason: "clear out-of-cycle concept remains" });
        }
        if (!exercise.question.trim() || !exercise.answer.trim()) {
          failures.push({ grade, subject: subject.id, topic: topic.id, id: exercise.id, reason: "missing question or answer" });
        }
        if (exercise.type === "multiple-choice" && !(exercise.options ?? []).includes(exercise.answer)) {
          failures.push({ grade, subject: subject.id, topic: topic.id, id: exercise.id, reason: "answer absent from options" });
        }
        if (exercise.type === "fill-in-blank") {
          fillExercises += 1;
          const blankCount = (exercise.question.match(/___/g) ?? []).length;
          if (blankCount > 0) {
            fillExercisesWithLiteralBlank += 1;
            if (blankCount > 1) multiGapFillExercises += 1;
            const completedQuestion = exercise.question.replace(/___/g, exercise.answer.trim());
            if (completedQuestion.includes("___") || completedQuestion === exercise.question) {
              failures.push({ grade, subject: subject.id, topic: topic.id, id: exercise.id, reason: "answer could not be inserted into every literal blank" });
            }
          }
        }
        if (expectedGroup && exercise.type === "fill-in-blank") {
          const blankCount = (exercise.question.match(/___/g) ?? []).length;
          if (blankCount !== 1) failures.push({ grade, subject: subject.id, topic: topic.id, id: exercise.id, reason: `replacement has ${blankCount} blanks` });
        }
      }
    }
  }
}

if (totalExercises !== 13_918) {
  failures.push({ grade: 0, subject: "all", topic: "all", id: "count", reason: `expected 13,918 exercises, found ${totalExercises}` });
}
if (fillExercises !== 6_761 || fillExercisesWithLiteralBlank !== 5_048 || multiGapFillExercises !== 160) {
  failures.push({ grade: 0, subject: "all", topic: "all", id: "fill-catalogue", reason: `expected 6,761 fill exercises / 5,048 literal-blank exercises / 160 multi-gap exercises, found ${fillExercises} / ${fillExercisesWithLiteralBlank} / ${multiGapFillExercises}` });
}
if (validatedFamilies.size !== 708) {
  failures.push({ grade: 0, subject: "all", topic: "all", id: "families", reason: `expected validation coverage for 708 grade/subject/topic/type families, found ${validatedFamilies.size}` });
}
if (resolvedLocations.size !== LP21_REPLACEMENT_COUNT) {
  failures.push({ grade: 0, subject: "all", topic: "all", id: "replacements", reason: `expected ${LP21_REPLACEMENT_COUNT} replacements, resolved ${resolvedLocations.size}` });
}

console.log(JSON.stringify({
  officialReferences: OFFICIAL_REFERENCES,
  scope: "content alignment, not Sheet parity or full LP21 competency coverage",
  totalExercises,
  lp21Replacements: resolvedLocations.size,
  lp21ApiFitReplacements: LP21_API_FIT_EXPANDED_TARGET_COUNT,
  fillExercises,
  fillExercisesWithLiteralBlank,
  multiGapFillExercises,
  validatedFamilies: validatedFamilies.size,
  failures: failures.length,
}, null, 2));

if (failures.length) {
  console.error(JSON.stringify(failures.slice(0, 100), null, 2));
  process.exit(1);
}
