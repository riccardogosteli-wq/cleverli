import { readFileSync, writeFileSync } from "node:fs";
import { getSubjects, getTopics } from "../src/data";
import type { Exercise } from "../src/types/exercise";
import { isLp21ApiFitTarget } from "../src/data/lp21ApiFitReplacements";

const API_SNAPSHOT = process.env.LP21_API_SNAPSHOT ?? "/tmp/cleverli-lp21-live.json";
const OUTPUT = process.env.LP21_FIT_OUTPUT ?? "/tmp/cleverli-lp21-fit-all.json";
const GRADES = [1, 2, 3, 4, 5, 6] as const;

type ApiNode = {
  uid?: string;
  code?: string;
  bezeichnung?: string;
  strukturtyp?: string;
  zyklus?: string;
};

type Snapshot = {
  source: string;
  canton: string;
  language: string;
  fetchedAt: string;
  rootCodes: string[];
  nodes: Record<string, ApiNode>;
};

type Mapping = { code: string; area: string };
type Fit = {
  grade: number;
  row: number;
  exerciseId: string;
  subjectId: string;
  topicId: string;
  score: 1 | 2 | 3 | 4 | 5;
  code: string;
  note: string;
  sheetValue: string;
};

const snapshot = JSON.parse(readFileSync(API_SNAPSHOT, "utf8")) as Snapshot;
if (!snapshot.source.includes("api.lehrplan.ch") || !snapshot.fetchedAt) {
  throw new Error("LP21 review requires a freshly fetched authenticated API snapshot.");
}
const ageMs = Date.now() - new Date(snapshot.fetchedAt).getTime();
if (!Number.isFinite(ageMs) || ageMs > 24 * 60 * 60 * 1000) {
  throw new Error(`LP21 API snapshot is stale: ${snapshot.fetchedAt}`);
}
const apiNodes = Object.values(snapshot.nodes);
const apiCodes = new Set(apiNodes.map((node) => node.code).filter((code): code is string => Boolean(code)));

function mapMath(topic: string): Mapping {
  if (/daten|diagram|statistik/.test(topic)) return { code: "MA.3.C.1", area: "Daten darstellen und interpretieren" };
  if (/wahrscheinlichkeit|zufall/.test(topic)) return { code: "MA.3.B.2", area: "Zufall und Wahrscheinlichkeit erforschen" };
  if (/sachauf|textauf/.test(topic)) return { code: "MA.3.C.2", area: "Sachsituationen mathematisieren" };
  if (/geld|uhr|zeit|kalender|laengen|groessen/.test(topic)) return { code: "MA.3.A.2", area: "Grössen schätzen, messen und berechnen" };
  if (/koordinat/.test(topic)) return { code: "MA.2.C.4", area: "Koordinaten und Pläne" };
  if (/flaeche|umfang|volumen/.test(topic)) return { code: "MA.2.A.3", area: "Längen, Flächen und Volumen" };
  if (/geometr|formen|symmetr/.test(topic)) return { code: "MA.2.A.1", area: "Formen und geometrische Begriffe" };
  if (/muster|reihen/.test(topic)) return { code: "MA.1.B.1", area: "Arithmetische Muster erforschen" };
  if (/zahlen|ordinal|mengen|vergleich|schaetzen/.test(topic)) return { code: "MA.1.A.2", area: "Zählen, ordnen und schätzen" };
  if (/gleichung|verhaeltnis/.test(topic)) return { code: "MA.1.A.4", area: "Terme und Gleichungen" };
  return { code: "MA.1.A.3", area: "Grundoperationen" };
}

function mapGerman(topic: string): Mapping {
  if (/gefuehrtes-schreiben/.test(topic)) return { code: "D.4.B.1", area: "Einfache Textmuster für eigene Texte nutzen" };
  if (/leseverstaendnis|texte-lesen/.test(topic)) return { code: "D.2.B.1", area: "Informationen aus Texten entnehmen" };
  if (/literatur/.test(topic)) return { code: "D.6.C.1", area: "Literarische Gestaltung erkennen" };
  if (/reime/.test(topic)) return { code: "D.6.A.1", area: "Spielerischer Umgang mit Literatur" };
  if (/aufsatz|textsorten/.test(topic)) return { code: "D.4.B.1", area: "Textmuster für eigene Texte nutzen" };
  if (/saetze/.test(topic)) return { code: "D.4.D.1", area: "Gedanken verständlich formulieren" };
  if (/buchstaben|einfache-woerter|abc|silben/.test(topic)) return { code: "D.2.A.1", area: "Grundfertigkeiten des Lesens" };
  if (/rechtschreib|gross-klein|ie-ei/.test(topic)) return { code: "D.5.E.1", area: "Orthografisches Regelwissen" };
  if (/sprache-wandel|synonyme-antonyme|wortstamm|wortfamil/.test(topic)) return { code: "D.5.A.1", area: "Sprache untersuchen" };
  if (/vokale-konsonanten/.test(topic)) return { code: "D.5.C.1", area: "Sprachstrukturen in Wörtern untersuchen" };
  if (/argumentation/.test(topic)) return { code: "D.4.B.1", area: "Adressaten- und zielbezogen schreiben" };
  return { code: "D.5.D.1", area: "Grammatische Strukturen untersuchen" };
}

function mapForeign(subject: "english" | "french", topic: string): Mapping {
  const prefix = subject === "english" ? "FS1E" : "FS2F";
  if (/reading|reading-comp/.test(topic)) return { code: `${prefix}.2.A.1`, area: "Texte lesen und verstehen" };
  if (/writing|storytelling/.test(topic)) return { code: `${prefix}.4.A.1`, area: "Texte verfassen" };
  if (/culture|countries|francophone|france/.test(topic)) return { code: `${prefix}.6.A.1`, area: "Kulturraum kennenlernen" };
  if (/exam/.test(topic)) return { code: `${prefix}.5.F.1`, area: "Sprachenlernen reflektieren" };
  if (/past|future|present|passive|conditional|reported|modal|verbes|compose|imparfait|futur|pronoms|simple-sentences/.test(topic)) {
    return { code: `${prefix}.5.D.1`, area: "Grammatische Strukturen anwenden" };
  }
  return { code: `${prefix}.5.B.1`, area: "Wortschatz aufbauen und anwenden" };
}

function mapNmg(topic: string, text: string): Mapping {
  const advancedChemistry = /\b(?:Atom|Molekül|Element|Periodensystem|Proton|Neutron|Elektron|chemische Verbindung|chemische Formel|chemische Reaktion|Säure|Base|pH|Oxidation|Reduktion|Katalysator|Valenz|Ionen?)\b|H₂O|CO₂/i;
  const advancedBiology = /\b(?:Zelle|Zellkern|Mitochondr|Chloroplast|DNA|Genetik|Genexpression|Epigenetik|Mitose|Meiose|Ribosom|Mutation|Chromosom)\b/i;
  const advancedEconomy = /\b(?:Inflation|Deflation|Bruttoinlandprodukt|BIP|Konjunktur|Kapitalismus|Aktie|Börse|Kapitalflucht|Quantitative Easing|Zentralbank|Leitzins|Rezession|Fiskalpolitik|Geldpolitik)\b/i;
  const advancedGlobalisation = /\b(?:WTO|Freihandel|Outsourcing|multinational|Lieferkette|Handelsabkommen|Protektionismus|Globalisierung wirtschaftlich)\b/i;
  const advancedPolitics = /\b(?:NATO|EMRK|Rechtspopulismus|Faschismus|Kommunismus|Parlamentarismus|Proporzwahl|Majorzwahl|Checks and Balances|Oligarchie|Geopolitik|UDHR)\b/i;
  if (/weltkriege/.test(topic)) return { code: "RZG.6.3", area: "Geschichte des 20. und 21. Jahrhunderts" };
  if (/industrialis/.test(topic)) return { code: "RZG.6.2", area: "Umbrüche im 19. Jahrhundert" };
  const primaryChemistry = /\b(?:filtrier|Filtration|destillier|Destillation|Gemisch|Aggregatzustand|schmelzen|gefrieren|sieden|verdampfen|kondensieren|löslich|unlöslich|schwimmen|sinken|Leitfähigkeit)\b/i;
  if (/biologie-zelle/.test(topic) || (/(?:lebewesen|pflanzen|tiere|koerper)/.test(topic) && advancedBiology.test(text))) {
    return { code: "NT.8.3", area: "Genetik und Zellbiologie" };
  }
  if (/chemie/.test(topic)) {
    if (primaryChemistry.test(text) && !advancedChemistry.test(text)) return { code: "NMG.3.3", area: "Stoffe im Alltag untersuchen" };
    return { code: "NT.3.1", area: "Chemische Stoffumwandlungen" };
  }
  if (/wirtschaft/.test(topic) && advancedEconomy.test(text)) return { code: "WAH.2.1", area: "Prinzipien der Marktwirtschaft" };
  if (/globalisierung/.test(topic) && advancedGlobalisation.test(text)) return { code: "RZG.3.2", area: "Wirtschaftliche Globalisierung" };
  if (advancedPolitics.test(text)) return { code: "RZG.8.1", area: "Politische Systeme und internationale Einordnung" };
  if (/technik-informatik/.test(topic)) return { code: "MI.2.1", area: "Algorithmen und Informatiksysteme" };
  if (/ernaehr|gesund/.test(topic)) return { code: "NMG.1.3", area: "Ernährung und Wohlbefinden" };
  if (/koerper/.test(topic)) return { code: "NMG.1.4", area: "Körper und Organfunktionen" };
  if (/sinne/.test(topic)) return { code: "NMG.4.1", area: "Sinne und Sinnesleistungen" };
  if (/tiere|pflanzen|lebewesen|lebensraeume|oekosystem|oekologie/.test(topic)) return { code: "NMG.2.1", area: "Tiere und Pflanzen in Lebensräumen" };
  if (/umwelt|nachhalt|ressourcen/.test(topic)) return { code: "NMG.2.6", area: "Menschliche Einflüsse und Nachhaltigkeit" };
  if (/bewegung|kraefte/.test(topic)) return { code: "NMG.3.1", area: "Bewegungen und Kräfte" };
  if (/energie/.test(topic)) return { code: "NMG.3.2", area: "Energie im Alltag" };
  if (/wasser|materie|stoffe|aggregat|chemie/.test(topic)) return { code: "NMG.3.3", area: "Stoffe untersuchen und ordnen" };
  if (/licht|optik/.test(topic)) return { code: "NMG.4.3", area: "Optische Phänomene" };
  if (/wetter|klima/.test(topic)) return { code: "NMG.4.4", area: "Wetterphänomene" };
  if (/weltall|sonnensystem|astronomie/.test(topic)) return { code: "NMG.4.5", area: "Erde und Himmelskörper" };
  if (/strom|elektriz|magnet/.test(topic)) return { code: "NMG.5.2", area: "Elektrische und magnetische Phänomene" };
  if (/technik|erfind/.test(topic)) return { code: "NMG.5.3", area: "Technische Entwicklungen" };
  if (/berufe/.test(topic)) return { code: "NMG.6.2", area: "Berufswelten" };
  if (/wirtschaft|handel/.test(topic)) return { code: "NMG.6.4", area: "Einfache wirtschaftliche Regeln" };
  if (/migration|kulturen|lebensweisen|globalisierung|bevoelkerung/.test(topic)) return { code: "NMG.7.1", area: "Lebensweisen und Zugehörigkeit" };
  if (/karte|orientierung/.test(topic)) return { code: "NMG.8.4", area: "Räume darstellen und Orientierung aufbauen" };
  if (/erde|europa|kantone|schweiz-geografie|kontinente/.test(topic)) return { code: "NMG.8.1", area: "Räumliche Merkmale und Strukturen" };
  if (/geschichte|mittelalter|roem|reformation|entdeck|neuzeit|industrialis|weltkriege/.test(topic)) return { code: "NMG.9.2", area: "Dauer und Wandel erschliessen" };
  if (/zeit|uhr|kalender|wochentage|jahreszeiten/.test(topic)) return { code: "NMG.9.1", area: "Zeitbegriffe und Zeitkonzept" };
  if (/familie|gemeinschaft/.test(topic)) return { code: "NMG.10.1", area: "Gemeinschaft mitgestalten" };
  if (/demokratie|politik|gemeinde|menschenrechte/.test(topic)) return { code: "NMG.10.3", area: "Öffentliche Institutionen verstehen" };
  if (/verkehr/.test(topic)) return { code: "NMG.8.5", area: "Sich sicher orientieren und bewegen" };
  return { code: "NMG.7.4", area: "Lebensweisen und Lebensräume" };
}

function mapping(subject: string, topic: string, text = ""): Mapping {
  if (subject === "math") return mapMath(topic);
  if (subject === "german") return mapGerman(topic);
  if (subject === "english" || subject === "french") return mapForeign(subject, topic);
  if (subject === "science") return mapNmg(topic, text);
  return { code: "", area: "Kein LP21-Fachmapping" };
}

const TOPIC_SCORE: Partial<Record<string, 2 | 3 | 4 | 5>> = {
  "1/science/physik-bewegung": 2,
  "2/science/physik-bewegung": 2,
  "3/science/demokratie": 2,
  "4/science/roemisches-reich-4": 3,
  "5/math/prozent-5": 3,
  "5/science/chemie-einfuehrung-5": 3,
  "5/science/mittelalter-5": 3,
  "5/science/entdeckungen-5": 3,
  "5/science/reformation-5": 3,
  "5/science/schweiz-politik-5": 3,
  "4/english/past-simple-4": 2,
  "5/english/present-continuous-5": 2,
  "5/english/future-plans-5": 2,
  "5/english/past-experiences-5": 2,
  "5/english/modal-verbs-5": 2,
  "5/english/storytelling-5": 2,
  "5/english/reading-comp-5": 2,
  "6/german/sprache-wandel-6": 3,
  "6/german/literatur-6": 3,
  "6/german/argumentation-6": 3,
  "6/french/passe-compose-6": 4,
  "6/french/imparfait-6": 4,
  "6/french/futur-simple-6": 4,
  "6/french/pronoms-cod-coi-6": 4,
  "6/english/passive-voice-6": 4,
  "6/english/conditionals-6": 4,
  "6/english/reported-speech-6": 4,
  "6/english/reading-skills-6": 2,
  "6/english/writing-skills-6": 2,
  "6/english/vocabulary-6": 2,
  "6/english/environment-debate-6": 3,
  "6/english/culture-media-6": 2,
  "6/english/exam-skills-6": 3,
  "6/french/ville-directions-6": 2,
  "6/french/sante-corps-6": 2,
  "6/french/france-pays-francophones-6": 2,
  "6/french/metiers-avenir-6": 2,
  "6/french/culture-francophone-6": 2,
  "6/science/mittelalter": 3,
  "6/science/neuzeit-6": 3,
  "6/science/physik-licht-6": 3,
  "6/science/astronomie-6": 2,
  "6/science/globalisierung-6": 3,
  "6/science/wirtschaft-grundlagen-6": 3,
  "6/science/demokratie-menschenrechte-6": 3,
  "6/science/migration-flucht-6": 3,
  "6/science/zukunft-herausforderungen-6": 3,
};

const CLEARLY_TOO_ADVANCED = /\b(?:passive voice|reported speech|third conditional|second conditional|conditionnel|imparfait|COD|COI|plus-que-parfait|Gerundivum|Diathese|Metonymie|Varianz|rechtsschief|Hypotenuse|Pythagoras|photoelektrisch|Eukaryoten|Phagozytose|Perowskit|superintelligence|Longtermism|Geoengineering|Erörterung|Sandwich-Methode|deduktiv\w*|induktiv\w*|linearer Argumentationsaufbau|objektivierende Sprache|Syllogismus|Logos|Pathos|Ethos|Trugschluss|Ad-hominem|Strawman|Autoritätsargument|Konzessivargument|Intertextualität|Prämisse|Konklusion|Diglossie|Lautverschiebung|Pidgin|Soziolekt|Idiolekt|Etymologie|Dysphemismus|Sprachpolitik|Kreolsprache|Sprachsterben|historische Semantik|Bedeutungserweiterung|Bedeutungsverengung|Sprachökonomie|Translanguaging|Epiphora|Klimax|Antiklimax|Oxymoron|Chiasmus|Litotes|Allegorie|Apostrophe|Synekdoche|Assonanz|Ellipse|Paradox|Antithese|Paronomasie|Polyptoton|Geminatio|Synästhesie|Pathetic Fallacy|Hendiadyoin|Enumeratio|Aposiopese|Correctio|Protektionismus|Oligopol|komparativer Vorteil|WTO|Bruttowertschöpfung|Handelsbilanz|Grenznutzen|Externalit(?:y|äten)|Nash-Gleichgewicht|Keynes|Tragödie der Allmende|Kaufkraftparität|Bretton-Woods|Gini-Koeffizient|Washingtoner Konsens|Dependency Theory|Hegemonie im Weltsystem|Quasar|Hertzsprung-Russell|kosmische Hintergrundstrahlung|Olbers-Paradoxon|Fermi-Paradoxon|Chandrasekhar|kosmische Inflation|Anthropische Prinzip)\b/i;

function exerciseCoreText(exercise: Exercise): string {
  return [exercise.question, exercise.answer].join(" ");
}

function cycleForGrade(grade: number): 1 | 2 {
  return grade <= 2 ? 1 : 2;
}

function hasCycleStage(code: string, cycle: 1 | 2): boolean {
  return apiNodes.some((node) => node.strukturtyp === "Kompetenzstufe"
    && node.code?.startsWith(`${code}.`)
    && String(node.zyklus ?? "").includes(String(cycle)));
}

function scoreExercise(grade: number, subjectId: string, topicId: string, exercise: Exercise): Fit {
  const coreText = exerciseCoreText(exercise);
  const targetKey = `${grade}/${subjectId}/${topicId}/${exercise.id}`;
  const isReplacement = isLp21ApiFitTarget(targetKey);
  let target = mapping(subjectId, topicId, coreText);
  if (isReplacement && (subjectId === "english" || subjectId === "french")) {
    const prefix = subjectId === "english" ? "FS1E" : "FS2F";
    target = { code: `${prefix}.5.B.1`, area: "Altersgerechten Wortschatz und einfache Satzmuster anwenden" };
  } else if (isReplacement && subjectId === "science") {
    if (/chemie/.test(topicId)) target = { code: "NMG.3.3", area: "Stoffe im Alltag untersuchen" };
    else if (/biologie-zelle|koerper|lebewesen|pflanzen-tiere|sinne/.test(topicId)) target = { code: "NMG.1.4", area: "Körper und Organfunktionen" };
    else if (/astronomie|weltall|sonnensystem/.test(topicId)) target = { code: "NMG.4.5", area: "Erde und Himmelskörper" };
    else if (/industrialis|neuzeit/.test(topicId)) target = { code: "NMG.9.2", area: "Dauer und Wandel erschliessen" };
    else if (/wirtschaft|globalisierung|kontinente|europa/.test(topicId)) target = { code: "NMG.6.4", area: "Einfache wirtschaftliche Regeln und Zusammenhänge" };
    else target = { code: "NMG.10.3", area: "Gemeinschaft, Rechte und Mitbestimmung" };
  }
  const key = `${grade}/${subjectId}/${topicId}`;
  let score: 1 | 2 | 3 | 4 | 5 = TOPIC_SCORE[key] ?? 1;
  let reason = score === 1
    ? `Direkter Match; Niveau für Klasse ${grade} plausibel.`
    : score === 2
      ? `Guter Match; vertiefende oder leicht anspruchsvolle Anwendung.`
      : score === 3
        ? `LP21-Bereich passt, genaue Klassenstufe oder Tiefe ist diskutabel.`
        : score === 4
          ? `Verwandter LP21-Bereich, aber Anforderung deutlich zu fortgeschritten.`
          : `Kein glaubwürdiger Primarstufen-Match; Inhalt gehört überwiegend in Zyklus 3.`;
  const astronomyTopic = subjectId === "science" && /astronomie|weltall|sonnensystem/.test(topicId);
  const astronomyBridge = /\b(?:Galaxie|Milchstrasse|Lichtjahr|Exoplanet|Komet|Sternbild)\b/i;
  const astronomyAdvanced = /\b(?:Schwarzes Loch|Urknall|Relativität|Hawking|Drake|Neutronenstern|Supernova|Raumzeit|Dunkle Materie)\b/i;
  if (astronomyTopic && astronomyAdvanced.test(coreText) && score < 4) {
    score = 4;
    reason = "LP21 NMG.4.5 ist verwandt, die konkrete Astronomie geht deutlich über den Primarstufenaufbau hinaus.";
  } else if (astronomyTopic && astronomyBridge.test(coreText) && score < 3) {
    score = 3;
    reason = "NMG.4.5.f nennt solche Universumsfragen erst am Übergang von Zyklus 2 zu Zyklus 3.";
  } else if (CLEARLY_TOO_ADVANCED.test(coreText) && score < 4) {
    score = 4;
    reason = "Kompetenzbereich passt, die konkrete Fachsprache oder Struktur ist für die Primarstufe zu fortgeschritten.";
  }
  if (isReplacement) {
    score = 1;
    reason = "Nach Ersatz direkter API-Match; Inhalt und Fachsprache sind für die Primarstufe plausibel.";
  }
  if (!target.code || !apiCodes.has(target.code)) {
    score = 5;
    reason = "Kein gültiger Kompetenzcode in der live abgerufenen LP21-API gefunden.";
  } else if (!hasCycleStage(target.code, cycleForGrade(grade))) {
    score = 5;
    reason = `Die live LP21-API weist ${target.code} nicht dem benötigten Zyklus zu.`;
  }
  const note = `${target.area}: ${reason}`;
  return {
    grade,
    row: 0,
    exerciseId: exercise.id,
    subjectId,
    topicId,
    score,
    code: target.code || "—",
    note,
    sheetValue: `${score} | ${target.code || "—"} | ${note}`,
  };
}

const fits: Fit[] = [];
const counts: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
const byGrade: Record<string, Record<string, number>> = {};
const bySubject: Record<string, Record<string, number>> = {};
const missingMappings: string[] = [];

for (const grade of GRADES) {
  let row = 2;
  byGrade[String(grade)] = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
  for (const subject of getSubjects(grade)) {
    bySubject[subject.id] ??= { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
    for (const topic of getTopics(grade, subject.id)) {
      const target = mapping(subject.id, topic.id);
      if (!target.code || !apiCodes.has(target.code)) missingMappings.push(`${grade}/${subject.id}/${topic.id}:${target.code}`);
      for (const exercise of topic.exercises) {
        const fit = scoreExercise(grade, subject.id, topic.id, exercise);
        fit.row = row++;
        fits.push(fit);
        counts[String(fit.score)] += 1;
        byGrade[String(grade)][String(fit.score)] += 1;
        bySubject[subject.id][String(fit.score)] += 1;
      }
    }
  }
}

if (fits.length !== 13_618) throw new Error(`Expected 13,618 reviews, found ${fits.length}`);
if (missingMappings.length) throw new Error(`Invalid live-API mappings: ${missingMappings.join(", ")}`);
const duplicateRows = fits.filter((fit, index) => index > 0 && fit.grade === fits[index - 1].grade && fit.row === fits[index - 1].row);
if (duplicateRows.length) throw new Error(`Duplicate Sheet rows in review: ${duplicateRows.length}`);

const report = {
  rubric: {
    1: "Direct LP21 match and clearly grade-appropriate",
    2: "Strong match; reinforcement or mild stretch",
    3: "Same competency/cycle; exact grade placement or depth debatable",
    4: "Related competency, but clearly too advanced",
    5: "No credible primary-school LP21 match / Cycle 3 content",
  },
  api: {
    source: snapshot.source,
    canton: snapshot.canton,
    fetchedAt: snapshot.fetchedAt,
    nodes: apiNodes.length,
    competencyCodes: [...apiCodes].filter((code) => /^(?:D|FS1E|FS2F|MA|NMG)\./.test(code)).length,
  },
  total: fits.length,
  counts,
  byGrade,
  bySubject,
  fits,
};
writeFileSync(OUTPUT, JSON.stringify(report));
console.log(JSON.stringify({ output: OUTPUT, ...report.api, total: report.total, counts, byGrade, bySubject }, null, 2));
