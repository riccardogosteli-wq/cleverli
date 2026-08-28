import type { Exercise } from "../src/types/exercise";

export type SuitabilityScore = 1 | 2 | 3 | 4 | 5;

export interface SuitabilityReview {
  score: SuitabilityScore;
  reason: string;
  evidence: string[];
}

const CYCLE_3 = /\b(?:Hypotenuse|Pythagoras|Gerundivum|Metonymie|Varianz|rechtsschief|photoelektrisch|Eukaryot|Phagozytose|Perowskit|Longtermism|Geoengineering|Syllogismus|Ad-hominem|Strawman|Intertextualität|Prämisse|Konklusion|Diglossie|Pidgin|Soziolekt|Idiolekt|Dysphemismus|Kreolsprache|Epiphora|Antiklimax|Oxymoron|Chiasmus|Litotes|Allegorie|Synekdoche|Paronomasie|Polyptoton|Geminatio|Synästhesie|Hendiadyoin|Aposiopese|Protektionismus|Oligopol|komparativer Vorteil|Bruttowertschöpfung|Grenznutzen|Externalität|Nash-Gleichgewicht|Kaufkraftparität|Bretton-Woods|Gini-Koeffizient|Quasar|Hertzsprung-Russell|Olbers-Paradoxon|Fermi-Paradoxon|Chandrasekhar|kosmische Inflation|Snellius|Wellenoptik|Spektroskopie|Bohr.?sche[sn]? Atommodell|Trophieebenen-Effizienz|carrying capacity|Milankovitch|horizontaler Gentransfer|technologische Singularität|Segregationsindex|Degrowth|Postwachstum|Anthropozän|Tipping Point|Transmigration|Dublin-Verordnung|Westfälischer Frieden|Subsidiaritätsprinzip)\b/i;

const MIN_GRADE_TERMS: Array<{ min: number; pattern: RegExp; label: string }> = [
  { min: 2, pattern: /\b(?:Amphibien|Säugetiere|Wirbeltiere|Aussenskelett|Exoskelett|Sauerstoff|Nährstoffe|Zellatmung|Produzenten|Konsumenten|Photosynthese|Solidarität|Aufenthaltsqualität|Geruchssinn|Schmerzsinn)\b/i, label: "abstrakter Fachbegriff statt beobachtbarer Erstklass-Inhalt" },
  { min: 3, pattern: /\b(?:Genitiv|Dativ|Akkusativ|Partizip|Perfekt|Präteritum|Passiv|Reflexivpronomen|Relativpronomen|Indefinitpronomen|Possessivpronomen|Demonstrativpronomen|Interrogativpronomen|Emphatisch|Konjunktionalsatz|indirekter Fragesatz|Zellatmung|Glucose|Aggregatzustand|Prozent|Dezimal|Ballaststoffe|Verdauung|Karnivore|Bundesverfassung)\b/i, label: "Konzept liegt über dem Aufbau der Klassen 1–2" },
  { min: 4, pattern: /\b(?:Plusquamperfekt|Konnotation|Denotation|Archaismus|Fugenelement|Morphem|flektier|denominal|relationales Adjektiv|absolutes Adjektiv|Adverbialsatz|Kausalangabe|Haiku|Autobiografie|Primzahl|kleinstes gemeinsames Vielfaches|Hektar|Volumen|Kernspaltung|Wirkungsgrad|elektrische Leistung|Kurzschluss|Pariser Klimaabkommen|anthropogen|Nullmeridian|tropisches Jahr|UTC|Legierung|Aluminium|Kohlenstoff|Silizium|Prisma|Sonnenfinsternis|Erdmagnetfeld|Lichtjahr|Feldlinienbild|Klimazone|Fjord|Erosion|Photosynthese|Klimawandel|CO₂-Emission|Wiener Kongress|Helveter)\b/i, label: "Konzept liegt über dem typischen Aufbau der 3. Klasse" },
  { min: 5, pattern: /\b(?:Konzessivangabe|Quantorpronomen|Inferenz|Homophon|Sekundärmetabolit|Insulin|Nahrungsnetz|Schmarotzer|Habitat|ökologische Nische|UV-Strahlung|Kipppunkt|Reinstoff|homogenes Gemisch|Chromatografie|Hebelgesetz|potentielle Energie|kinetische Energie|Archimedes|Lichtgeschwindigkeit|Blockchain|Ozonschicht|Greenwashing|Tragfähigkeit|Trophieebene|Mercator|Fernerkundung|Schengen-Abkommen|Gewaltentrennung|Legislative|Exekutive|Judikative|Milizsystem|Zweibundvertrag|Kappeler Landfrieden|bilateraler Weg|Europäischer Rat|römischer Senat|zyklisches Geschichtsbild|virtuelles Wasser|Hydrologie|Transmigration|UNHCR|Investiturstreit|Dekolonisierung|Suffizienz)\b/i, label: "Fach- oder Abstraktionsniveau liegt über der 4. Klasse" },
  { min: 6, pattern: /\b(?:Thema-Rhema|Relativgeschwindigkeit|Milankovitch|Biodiversitätshotspot|Mikroklima|horizontaler Gentransfer|technologische Singularität|Segregationsindex|Degrowth|Postwachstum|Theologie|Frankophonie|formales Register)\b/i, label: "Fach- oder Sprachkonzept liegt über der 5. Klasse" },
];

function allText(exercise: Exercise): string {
  return [
    exercise.question,
    exercise.listeningText,
    exercise.answer,
    ...(exercise.options ?? []),
    ...(exercise.hints ?? []),
    ...(exercise.reviewCriteria ?? []),
    ...(exercise.dragItems ?? []).map((item) => item.label),
    ...(exercise.dropZones ?? []).map((zone) => zone.label),
  ].filter(Boolean).join(" ");
}

function wordCount(text: string): number {
  return (text.match(/[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu) ?? []).length;
}

function numberValues(text: string): number[] {
  return [...text.matchAll(/(?<![\p{L}])−?-?\d+(?:['’]\d{3})*(?:[.,]\d+)?/gu)]
    .map((match) => Number(match[0].replace(/[−]/g, "-").replace(/['’]/g, "").replace(",", ".")))
    .filter(Number.isFinite);
}

function editDistance(left: string, right: string): number {
  const a = left.toLocaleLowerCase("de-CH");
  const b = right.toLocaleLowerCase("de-CH");
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
}

function mathEvidence(grade: number, topic: string, exercise: Exercise): string[] {
  const evidence: string[] = [];
  const core = [exercise.question, exercise.answer].join(" ");
  const optionText = (exercise.options ?? []).join(" ");
  const values = numberValues(core);
  const max = values.length ? Math.max(...values.map(Math.abs)) : 0;
  const optionValues = numberValues(optionText);
  const maxOption = optionValues.length ? Math.max(...optionValues.map(Math.abs)) : 0;
  const operations = (exercise.question.match(/[+−×÷*/]/g) ?? []).length;
  if (grade === 1) {
    if (/[×÷²³%]|\d+\s*\/\s*\d+/.test(core)) evidence.push("Klasse 1 enthält Multiplikation, Division, Potenz, Prozent oder Bruchnotation");
    if (max > 20 && !(/geld/.test(topic) && max <= 100)) evidence.push(`Klasse-1-Zahlenraum im Auftrag überschritten (maximaler Wert ${max})`);
    if (maxOption > 20 && max <= 20) evidence.push(`Antwortauswahl reicht bis ${maxOption} und damit über den Klasse-1-Zahlenraum hinaus`);
    if (operations > 2) evidence.push(`${operations} Rechenoperationen in einer Klasse-1-Aufgabe`);
  } else if (grade === 2) {
    if (/%|\d+\s*\/\s*\d+|[²³]|\([^)]*[+−×÷*/][^)]*\)/.test(core)) evidence.push("Klasse 2 enthält Prozent, Bruch, Potenz oder formale Operationsreihenfolge");
    if (/\d+[,.]\d+[^\n]*[+−×÷*]|[+−×÷*][^\n]*\d+[,.]\d+/.test(core)) evidence.push("Dezimalrechnung in Klasse 2");
    if (/\b(?:Variable|Gleichung|x\s*=|n\s*=|proportional)\b/i.test(core)) evidence.push("formale Algebra in Klasse 2");
  } else if (grade === 3) {
    if (/\d+\s*[²³]|\b(?:zum Quadrat|hoch \d|Volumen|Quadratwurzel|kgV|kleinstes gemeinsames Vielfaches|Variable|Gleichung)\b/i.test(core)) evidence.push("formale Potenz-, Volumen- oder Algebraanforderung in Klasse 3");
    if (/\d+\s*\/\s*\d+\s*[+−]\s*\d+\s*\/\s*\d+/.test(core)) evidence.push("Bruchrechnung mit mehreren Brüchen in Klasse 3");
  } else if (grade === 4) {
    if (/\b(?:Oberfläche|Geschwindigkeit|m³|Volumen|Winkelsumme|Massstab\s*1:)\b/i.test(core)) evidence.push("späte Cycle-2-Mathematik in Klasse 4");
  }
  return evidence;
}

function taskMismatchEvidence(grade: number, subject: string, topic: string, exercise: Exercise, text: string): string[] {
  const evidence: string[] = [];
  const questionWords = wordCount(exercise.question);
  const severeLimit = [0, 30, 42, 55, 68, 80, 90][grade];
  const reviewLimit = [0, 18, 26, 34, 42, 52, 62][grade];
  if (questionWords > severeLimit) evidence.push(`Auftrag hat ${questionWords} Wörter (deutlich zu hohe Leselast für Klasse ${grade})`);
  else if (questionWords > reviewLimit) evidence.push(`Auftrag hat ${questionWords} Wörter (erhöhte Leselast für Klasse ${grade})`);

  if (grade === 1 && /\b(?:Regel|Fachbegriff|klassifizier|begründe|analysier|Definition|Unterschied zwischen|Warum ist|Was bedeutet)\b/i.test(text)) {
    evidence.push("abstrakter Regel-, Definitions- oder Begründungsauftrag in Klasse 1");
  }
  if (grade <= 2 && subject === "german" && !/hoerverstehen/.test(topic) && /\b(?:FALSCH geschrieben|Fehler|korrigier|Ausnahme|grammatisch|Zeitform|Satzglied|Wortart)\b/i.test(text)) {
    evidence.push(`metasprachlicher Korrektur- oder Analyseauftrag in Klasse ${grade}`);
  }
  if (grade === 1 && subject === "german" && exercise.options?.length === 4 && exercise.answer.length >= 3 && exercise.answer.length <= 12 && /schreib|geschrieb|richtiges Wort/i.test(exercise.question)) {
    const nearMisses = exercise.options.filter((option) => option !== exercise.answer && editDistance(option, exercise.answer) <= 2);
    if (nearMisses.length >= 3) evidence.push("drei absichtliche Falschschreibungen als Antwortoptionen in Klasse 1");
  }
  if (subject === "math") evidence.push(...mathEvidence(grade, topic, exercise));
  return evidence;
}

export function reviewGradeSuitability(grade: number, subject: string, topic: string, exercise: Exercise): SuitabilityReview {
  const text = allText(exercise);
  if (CYCLE_3.test(text)) {
    const hit = text.match(CYCLE_3)?.[0] ?? "Cycle-3-Konzept";
    return { score: 5, reason: `Kein glaubwürdiger Primarschul-Match: «${hit}».`, evidence: [hit] };
  }

  const tooAdvanced: string[] = [];
  for (const rule of MIN_GRADE_TERMS) {
    if (grade >= rule.min || !rule.pattern.test(text)) continue;
    const hit = text.match(rule.pattern)?.[0] ?? rule.label;
    tooAdvanced.push(`${rule.label}: «${hit}» (frühestens Klasse ${rule.min})`);
  }
  const taskEvidence = taskMismatchEvidence(grade, subject, topic, exercise, text);
  const severeTaskEvidence = taskEvidence.filter((item) => /überschritten|Multiplikation|Division|Potenz|Prozent|Bruch|Algebra|Volumen|Operationsreihenfolge|Falschschreibungen|deutlich|LP21 erst/.test(item));
  if (tooAdvanced.length || severeTaskEvidence.length) {
    const evidence = [...tooAdvanced, ...taskEvidence];
    return { score: 4, reason: evidence.join("; "), evidence };
  }

  const reviewEvidence = taskEvidence.filter((item) => !severeTaskEvidence.includes(item));
  if (reviewEvidence.length) return { score: 3, reason: reviewEvidence.join("; "), evidence: reviewEvidence };

  const score: SuitabilityScore = exercise.difficulty === 1 ? 1 : 2;
  const typeLabel = exercise.type.replaceAll("-", " ");
  return {
    score,
    reason: score === 1
      ? `Konkreter, kurzer ${typeLabel}-Auftrag; tatsächlicher Inhalt passiert Fachbegriff-, Zahlenraum-, Leselast- und Aufgabenkomplexitätsprüfung für Klasse ${grade}.`
      : `Tatsächlicher Inhalt passiert die Prüfungen für Klasse ${grade}; als Übungsvertiefung oder anspruchsvollere Anwendung eingestuft.`,
    evidence: [`${wordCount(exercise.question)} Wörter`, `Typ ${exercise.type}`, `Schwierigkeit ${exercise.difficulty}`],
  };
}
