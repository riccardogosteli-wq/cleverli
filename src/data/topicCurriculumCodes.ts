import type { Topic } from "@/types/exercise";

const LANGUAGE_CORE_CODES = [
  ".1.A.1",
  ".1.B.1",
  ".2.A.1",
  ".2.B.1",
  ".3.A.1",
  ".3.B.1",
  ".3.C.1",
  ".4.A.1",
  ".4.B.1",
  ".5.B.1",
  ".5.C.1",
  ".5.D.1",
  ".5.E.1",
] as const;

const LANGUAGE_CULTURE_CODES = [".6.A.1", ".6.C.1"] as const;

function unique(codes: string[]): string[] {
  return [...new Set(codes)];
}

function languageCodes(prefix: "FS1E" | "FS2E" | "FS1F" | "FS2F", includeCulture = false): string[] {
  return [
    ...LANGUAGE_CORE_CODES.map((suffix) => `${prefix}${suffix}`),
    ...(includeCulture ? LANGUAGE_CULTURE_CODES.map((suffix) => `${prefix}${suffix}`) : []),
  ];
}

function inferMathCodes(topicId: string): string[] {
  if (/(form|geometr|symmetrie|flaeche|umfang|volumen|koordinaten|koerper)/.test(topicId)) return ["MA.2"];
  if (/(daten|diagramm|zufall|wahrscheinlichkeit|statistik)/.test(topicId)) return ["MA.3"];
  if (/(uhr|zeit|geld|muenzen|chf|laengen|messen|groessen|schaetzen)/.test(topicId)) return ["MA.3"];
  if (/(sachaufgaben|textaufgaben)/.test(topicId)) return ["MA.1", "MA.3"];
  return ["MA.1"];
}

function inferGermanCodes(topicId: string): string[] {
  if (/(hoer|hören|zuhören)/.test(topicId)) return ["D.1"];
  if (/(lesen|leseverstaendnis|texte-lesen)/.test(topicId)) return ["D.2"];
  if (/(schreiben|aufsatz|textsorten|brief|bericht|argumentation)/.test(topicId)) return ["D.4"];
  if (/(literatur)/.test(topicId)) return ["D.6"];
  if (/(reime|abc|silben|laut|buchstaben|woerter|wort|nomen|verben|adjektive|pronomen|satz|kasus|grammatik|rechtschreibung|interpunktion|praepositionen|zeitformen|singular|plural|gross|klein|synonyme|antonyme|sprache)/.test(topicId)) return ["D.5"];
  return ["D.2", "D.4", "D.5"];
}

function inferScienceCodes(topicId: string): string[] {
  if (/(koerper|sinne|gesund|ernaehrung|beduerfnisse|wuensche)/.test(topicId)) return ["NMG.1"];
  if (/(tiere|pflanzen|lebewesen|lebensraeume|oekosysteme|oekologie|biologie)/.test(topicId)) return ["NMG.2"];
  if (/(stoffe|materialien|wasser|chemie|aggregat|materie)/.test(topicId)) return ["NMG.3"];
  if (/(licht|schatten|kraft|kraefte|bewegung|magnet|energie|strom|elektr|physik|optik)/.test(topicId)) return ["NMG.4"];
  if (/(technik|informatik|erfindungen)/.test(topicId)) return ["NMG.5", "MI.2"];
  if (/(arbeit|berufe|produktion|konsum|handel|transport|wirtschaft|berufswelt)/.test(topicId)) return ["NMG.6"];
  if (/(familie|gemeinschaft|gesellschaft|zusammenleben|werte|regeln|konflikte|demokratie|menschenrechte|migration|kulturen|flucht)/.test(topicId)) return ["NMG.10", "NMG.11"];
  if (/(verkehr|sicherheit|quartier|gemeinde|kanton|kantone|schweiz|europa|kontinente|raeume|karte|orientierung|geografie|siedlung|erde|klima|wetter|jahreszeiten|umwelt|nachhaltigkeit|ressourcen|zukunft|sonnensystem|astronomie|weltall|mond|sonne)/.test(topicId)) return ["NMG.7", "NMG.8"];
  if (/(geschichte|mittelalter|roemisch|neuzeit|industrialisierung|reformation|entdeckungen|lebensweisen|weltkriege)/.test(topicId)) return ["NMG.9"];
  if (/(religion|feste|weltanschauungen)/.test(topicId)) return ["NMG.12"];
  if (/(medien|information)/.test(topicId)) return ["MI.1"];
  if (/(uhr|kalender|wochentage|monate|zeit)/.test(topicId)) return ["NMG.9"];
  return ["NMG.1"];
}

function inferEnglishCodes(grade: number, topicId: string): string[] {
  const includeCulture = /(countries|cultures|culture|media|environment)/.test(topicId);
  return languageCodes(grade >= 5 ? "FS2E" : "FS1E", includeCulture);
}

function inferFrenchCodes(grade: number, topicId: string): string[] {
  const includeCulture = /(suisse|culture|francophone|france|pays)/.test(topicId);
  return languageCodes(grade >= 5 ? "FS2F" : "FS1F", includeCulture);
}

function inferMiCodes(topicId: string): string[] {
  if (/(spuren|informationen|quellen|feed|medien|werbung)/.test(topicId)) return ["MI.1"];
  if (/(daten|algorithmen|programme|befehle|netzwerke|sicherheit|online)/.test(topicId)) return ["MI.2"];
  return ["MI.1", "MI.2"];
}

export function inferTopicCurriculumCodes(grade: number, subject: string, topicId: string): string[] {
  if (subject === "math") return inferMathCodes(topicId);
  if (subject === "german") return inferGermanCodes(topicId);
  if (subject === "science" || subject === "nt" || subject === "rzg") return inferScienceCodes(topicId);
  if (subject === "english") return inferEnglishCodes(grade, topicId);
  if (subject === "french") return inferFrenchCodes(grade, topicId);
  if (subject === "mi") return inferMiCodes(topicId);
  return [];
}

export function applyTopicCurriculumCodes(grade: number, subject: string, topics: Topic[]): Topic[] {
  return topics.map((topic) => ({
    ...topic,
    curriculumCodes: topic.curriculumCodes?.length
      ? unique([...topic.curriculumCodes])
      : inferTopicCurriculumCodes(grade, subject, topic.id),
  }));
}
