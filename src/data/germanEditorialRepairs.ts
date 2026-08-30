import type { Exercise, Topic } from "@/types/exercise";
import { isApprovedSafeHint } from "@/lib/exerciseHints";

type Lang = "de" | "en" | "fr" | "it";

const ORDERED_INSTRUCTION: Record<Lang, string> = {
  de: "Schreibe alle fehlenden Teile in der richtigen Reihenfolge in das Eingabefeld",
  en: "Enter all missing parts in the correct order in the answer field",
  fr: "Écris toutes les parties manquantes dans le bon ordre dans le champ de réponse",
  it: "Scrivi tutte le parti mancanti nell’ordine corretto nel campo della risposta",
};

function blankCount(value: string | undefined): number {
  return value?.match(/___/g)?.length ?? 0;
}

function makeOrderedQuestion(value: string, lang: Lang): string {
  let index = 0;
  const labelled = value.replace(/___/g, () => `[${++index}]`);
  return `${labelled} ${ORDERED_INSTRUCTION[lang]}: ___`;
}

function repairMultiBlankInteraction(exercise: Exercise): Exercise {
  if (exercise.type !== "fill-in-blank" || blankCount(exercise.question) <= 1) return exercise;

  return {
    ...exercise,
    question: makeOrderedQuestion(exercise.question, "de"),
    questionEN: exercise.questionEN && blankCount(exercise.questionEN) > 1
      ? makeOrderedQuestion(exercise.questionEN, "en")
      : exercise.questionEN,
    questionFR: exercise.questionFR && blankCount(exercise.questionFR) > 1
      ? makeOrderedQuestion(exercise.questionFR, "fr")
      : exercise.questionFR,
    questionIT: exercise.questionIT && blankCount(exercise.questionIT) > 1
      ? makeOrderedQuestion(exercise.questionIT, "it")
      : exercise.questionIT,
    sequentialAnswer: true,
  };
}

function repairKnownAnswer(exercise: Exercise, key: string): Exercise {
  if (key === "3/german/saetze/g3-german-saetze-sb32") {
    return { ...exercise, answer: ",", answerEN: ",", answerFR: ",", answerIT: "," };
  }
  if (key === "5/english/modal-verbs-5/mv5-8") {
    return { ...exercise, answer: "pass", answerEN: "pass", answerFR: "pass", answerIT: "pass" };
  }
  if (key === "2/german/satzzeichen/sz32") {
    const answer = "ein Komma; danach geht es klein weiter";
    const options = ["einen Punkt; danach geht es gross weiter", answer, "ein Ausrufezeichen; danach geht es gross weiter", "kein Satzzeichen; danach geht es gross weiter"];
    return { ...exercise, answer, answerEN: answer, answerFR: answer, answerIT: answer, options, optionsEN: options, optionsFR: options, optionsIT: options };
  }
  if (key === "2/science/gesunde-ernaehrung/ge30") {
    return {
      ...exercise,
      type: "multiple-choice",
      question: "Welches Getränk löscht Durst am besten?",
      answer: "Wasser",
      options: ["Wasser", "Sirup", "Energydrink", "Limonade"],
      hints: ["Denke an ein Getränk ohne Zucker.", "Es versorgt den Körper direkt mit Flüssigkeit."],
      questionEN: "Which drink quenches thirst best?",
      answerEN: "Water",
      optionsEN: ["Water", "Syrup", "Energy drink", "Lemonade"],
      hintsEN: ["Think of a drink without sugar.", "It gives the body fluid directly."],
      questionFR: "Quelle boisson étanche le mieux la soif ?",
      answerFR: "L’eau",
      optionsFR: ["L’eau", "Le sirop", "Une boisson énergisante", "La limonade"],
      hintsFR: ["Pense à une boisson sans sucre.", "Elle apporte directement de l’eau au corps."],
      questionIT: "Quale bevanda disseta meglio?",
      answerIT: "L’acqua",
      optionsIT: ["L’acqua", "Lo sciroppo", "Una bevanda energetica", "La limonata"],
      hintsIT: ["Pensa a una bevanda senza zucchero.", "Fornisce direttamente liquidi al corpo."],
    };
  }
  if (key === "6/science/schweiz-geografie/g6sg3c") {
    return {
      ...exercise,
      type: "multiple-choice",
      question: "Welche staatliche Ebene organisiert vor Ort Aufgaben wie Schule und Abfallentsorgung?",
      answer: "die Gemeinde",
      options: ["die Gemeinde", "ein Nachbarland", "ein Sportverein", "eine private Familie"],
      hints: ["Denke an deinen Wohnort und seine öffentlichen Aufgaben.", "Gesucht ist die kleinste politische Ebene in der Schweiz."],
      questionEN: "Which level of government organises local tasks such as schools and waste collection?",
      answerEN: "the municipality",
      optionsEN: ["the municipality", "a neighbouring country", "a sports club", "a private family"],
      questionFR: "Quel niveau de l’État organise sur place des tâches comme l’école et la collecte des déchets ?",
      answerFR: "la commune",
      optionsFR: ["la commune", "un pays voisin", "un club sportif", "une famille privée"],
      questionIT: "Quale livello dello Stato organizza sul posto compiti come la scuola e la raccolta dei rifiuti?",
      answerIT: "il comune",
      optionsIT: ["il comune", "un Paese vicino", "un club sportivo", "una famiglia privata"],
    };
  }
  return exercise;
}

const HINT_CONFLICT_KEYS = new Set([
  "2/german/silben/g2-german-silben-s34",
  "2/german/silben/g2-german-silben-s38",
  "2/german/silben/g2-german-silben-s42",
]);

function normalise(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("de-CH").replace(/\s+/g, " ").trim();
}

function hintContainsAnswer(hint: string, answer: string): boolean {
  const candidate = normalise(answer);
  if (!candidate || ["all", "done"].includes(candidate)) return false;
  const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`, "u").test(normalise(hint));
}

function editorialHints(subject: string, lang: Lang): [string, string] {
  const hints: Record<Lang, Record<string, [string, string]>> = {
    de: {
      math: ["Markiere die Zahlen, Grössen oder Formen, die du miteinander vergleichen oder verknüpfen musst.", "Rechne oder ordne Schritt für Schritt und kontrolliere das Ergebnis mit der umgekehrten Richtung."],
      german: ["Achte auf Wortart, Endung und Satzstelle, nach der in der Aufgabe gefragt wird.", "Setze deine Lösung probeweise in den ganzen Satz ein und lies ihn nochmals."],
      science: ["Suche im Auftrag nach der beschriebenen Ursache, Wirkung oder beobachtbaren Eigenschaft.", "Prüfe, ob deine Wahl genau zum Vorgang in Natur, Alltag oder Gesellschaft passt."],
      english: ["Use the words around the gap or the question as grammar and meaning clues.", "Read the completed English sentence once more and check word order and form."],
      french: ["Utilise les mots autour du blanc comme indices de sens et de grammaire.", "Relis la phrase française complète et vérifie l’ordre et la forme des mots."],
    },
    en: {
      math: ["Identify the numbers, measures or shapes that must be compared or connected.", "Work step by step and check the result in the reverse direction."],
      german: ["Look at the requested word class, ending and position in the German sentence.", "Insert your solution into the whole German sentence and read it again."],
      science: ["Find the cause, effect or observable feature described in the task.", "Check that your choice matches the process in nature, everyday life or society."],
      english: ["Use the words around the gap or question as clues for meaning and grammar.", "Read the completed English sentence again and check word order and form."],
      french: ["Use the words around the gap as clues for meaning and French grammar.", "Read the completed French sentence again and check word order and form."],
    },
    fr: {
      math: ["Repère les nombres, les grandeurs ou les formes à comparer ou à relier.", "Procède étape par étape et contrôle le résultat dans le sens inverse."],
      german: ["Observe la classe du mot, la terminaison et la place demandées dans la phrase allemande.", "Insère ta solution dans toute la phrase allemande et relis-la."],
      science: ["Repère la cause, l’effet ou la propriété observable décrite dans la consigne.", "Vérifie que ton choix correspond au phénomène naturel, quotidien ou social."],
      english: ["Utilise les mots autour du blanc comme indices de sens et de grammaire anglaise.", "Relis la phrase anglaise complète et vérifie l’ordre et la forme des mots."],
      french: ["Utilise les mots autour du blanc comme indices de sens et de grammaire.", "Relis la phrase française complète et vérifie l’ordre et la forme des mots."],
    },
    it: {
      math: ["Individua i numeri, le misure o le forme da confrontare o collegare.", "Procedi passo dopo passo e controlla il risultato nel verso opposto."],
      german: ["Osserva la classe della parola, la desinenza e la posizione richieste nella frase tedesca.", "Inserisci la soluzione nell’intera frase tedesca e rileggila."],
      science: ["Individua la causa, l’effetto o la proprietà osservabile descritta nel compito.", "Controlla che la scelta corrisponda al fenomeno naturale, quotidiano o sociale."],
      english: ["Usa le parole attorno allo spazio come indizi di significato e grammatica inglese.", "Rileggi la frase inglese completa e controlla ordine e forma delle parole."],
      french: ["Usa le parole attorno allo spazio come indizi di significato e grammatica francese.", "Rileggi la frase francese completa e controlla ordine e forma delle parole."],
    },
  };
  return hints[lang][subject] ?? hints[lang].science;
}

function repairHints(exercise: Exercise, key: string, subject: string): Exercise {
  const numberHintKeys = new Set([
    "3/english/numbers-3/nu3-17",
    "3/english/numbers-3/nu3-29",
    "5/french/chiffres-5/g5-french-chiffres-5-ch5-40",
    "5/french/chiffres-5/g5-french-chiffres-5-ch5-45",
  ]);
  if (numberHintKeys.has(key)) {
    const isFrench = subject === "french";
    return {
      ...exercise,
      hints: isFrench
        ? ["Lies die französische Zahl und achte auf Zehner und Einer.", "Rechne den genannten Wert aus und kontrolliere jede Ziffer."]
        : ["Lies die englische Zahl und achte auf Zehner und Einer.", "Rechne den genannten Wert aus und kontrolliere jede Ziffer."],
      hintsEN: ["Read the number carefully and identify its tens and ones.", "Calculate the stated value and check every digit."],
      hintsFR: ["Lis attentivement le nombre et repère les dizaines et les unités.", "Calcule la valeur indiquée et vérifie chaque chiffre."],
      hintsIT: ["Leggi attentamente il numero e individua decine e unità.", "Calcola il valore indicato e controlla ogni cifra."],
    };
  }
  const irrelevantWordLengthHint = ["math", "science"].includes(subject)
    && exercise.hints.some((hint) => /(?:Das|das) (?:gesuchte )?Wort hat \d+ Buchstaben|Es ist ein einzelner Buchstabe/i.test(hint));
  if (irrelevantWordLengthHint) {
    return {
      ...exercise,
      hints: [exercise.hints[0], editorialHints(subject, "de")[1]],
      hintsEN: [exercise.hintsEN?.[0] ?? editorialHints(subject, "en")[0], editorialHints(subject, "en")[1]],
      hintsFR: [exercise.hintsFR?.[0] ?? editorialHints(subject, "fr")[0], editorialHints(subject, "fr")[1]],
      hintsIT: [exercise.hintsIT?.[0] ?? editorialHints(subject, "it")[0], editorialHints(subject, "it")[1]],
    };
  }
  const unsafe = exercise.hints.some((hint) => hintContainsAnswer(hint, exercise.answer));
  const generic = exercise.hints.length === 2 && exercise.hints.every(isApprovedSafeHint);
  if (!unsafe && !generic && !HINT_CONFLICT_KEYS.has(key)) return exercise;
  return {
    ...exercise,
    hints: editorialHints(subject, "de"),
    hintsEN: ["Work through the task step by step.", "Check your choice once more."],
    hintsFR: ["Avance étape par étape.", "Vérifie encore une fois ton choix."],
    hintsIT: ["Procedi passo dopo passo.", "Controlla ancora una volta la tua scelta."],
  };
}

function ensureHintsDoNotRevealAnswer(exercise: Exercise, subject: string): Exercise {
  if (!exercise.hints.some((hint) => hintContainsAnswer(hint, exercise.answer))) return exercise;
  const candidates: [string, string] = ["Gehe Schritt für Schritt vor.", "Prüfe deine Wahl nochmals."];
  const safe = candidates.map((hint, index) => hintContainsAnswer(hint, exercise.answer) ? `Nutze Hinweis ${index + 1} sorgfältig.` : hint) as [string, string];
  return {
    ...exercise,
    hints: safe,
    hintsEN: editorialHints(subject, "en"),
    hintsFR: editorialHints(subject, "fr"),
    hintsIT: editorialHints(subject, "it"),
  };
}

const PLACEHOLDER_OPTION = /^(?:Das Gegenteil des beschriebenen Konzepts|Eine unvollständige Version des Begriffs|Ein verwandter Begriff aus einem anderen Fachgebiet|Eine mathematische Formel für Sprachregeln|Ein Lautzeichen ohne grammatische Funktion|Eine sprachliche Ausnahme ohne Regelbezug|Eine geometrische Figur ohne Zahlenwert|Ein algebraisches Symbol ohne Bedeutung|Eine logische Aussage ohne numerische Basis)$/i;
const MALFORMED_OPTION = /^(?:all|done|Listenenede)$/i;
const OBVIOUSLY_ABSURD_OPTION = /^(?:Rot Noah Velo\.|Schwarz unter sitzt\.|Etwas ist etwas\.|Im klein Noah\.|Dann Turm\. Zuerst Mia\.|Mia baut, weil aber\.|Der Turm ist\. Ende zuerst\.|Damit niemand planen muss|Damit alle dasselbe tun|Damit Arbeit länger dauert|Alles sofort ausgeben|Nur Werbung beachten|Mehr kaufen als geplant|Damit niemand sie findet|Damit Preise verschwinden|Damit Wege länger werden)$/i;

function answerFor(exercise: Exercise, lang: Lang): string {
  if (lang === "de") return exercise.answer;
  return (lang === "en" ? exercise.answerEN : lang === "fr" ? exercise.answerFR : exercise.answerIT) ?? exercise.answer;
}

function optionsFor(exercise: Exercise, lang: Lang): string[] | undefined {
  return lang === "de" ? exercise.options : lang === "en" ? exercise.optionsEN : lang === "fr" ? exercise.optionsFR : exercise.optionsIT;
}

function numericDistractors(answer: string): string[] | null {
  const match = answer.trim().match(/^(-?\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return null;
  const number = Number(match[1].replace(",", "."));
  if (!Number.isFinite(number)) return null;
  const unit = match[2];
  const step = Number.isInteger(number) ? 1 : 0.1;
  return [number - step, number + step, number + 2 * step].map((value) => `${String(Number(value.toFixed(2))).replace(".", ",")}${unit}`);
}

function wordCount(value: string): number {
  return value.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
}

function isNumeric(value: string): boolean {
  return /^-?\d+(?:[.,]\d+)?(?:\s|$)/.test(value.trim());
}

function isWeakDistractor(option: string, answer: string): boolean {
  const candidate = option.trim();
  if (!candidate || PLACEHOLDER_OPTION.test(candidate) || MALFORMED_OPTION.test(candidate) || OBVIOUSLY_ABSURD_OPTION.test(candidate)) return true;
  const answerWords = wordCount(answer);
  const optionWords = wordCount(candidate);
  return (answerWords >= 4 && optionWords === 1) || (answerWords >= 7 && optionWords <= 2);
}

function normalisedOption(value: string): string {
  return normalise(value).replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function optionScore(candidate: string, answer: string, existing: Set<string>): number {
  const answerWords = wordCount(answer);
  const candidateWords = wordCount(candidate);
  const formatPenalty = isNumeric(candidate) === isNumeric(answer) ? 0 : 100;
  const lengthPenalty = Math.abs(candidateWords - answerWords) / Math.max(answerWords, 1) * 20;
  const existingBonus = existing.has(candidate) ? -3 : 0;
  return formatPenalty + lengthPenalty + existingBonus;
}

function repairedOptions(exercise: Exercise, lang: Lang, pool: string[]): string[] {
  const answer = answerFor(exercise, lang);
  const existing = optionsFor(exercise, lang) ?? [];
  const numeric = numericDistractors(answer) ?? [];
  const existingSet = new Set(existing);
  const candidates = [...numeric, ...existing, ...pool]
    .map((value) => value.trim())
    .filter((value) => value && normalisedOption(value) !== normalisedOption(answer) && !isWeakDistractor(value, answer));
  const unique = [...new Map(candidates.map((value) => [normalisedOption(value), value])).values()]
    .sort((a, b) => optionScore(a, answer, existingSet) - optionScore(b, answer, existingSet))
    .slice(0, 3);
  const fallbacks: Record<Lang, string[]> = {
    de: ["Keine der Aussagen passt", "Nur ein Teil davon stimmt", "Das gehört zu einem anderen Vorgang"],
    en: ["None of these statements fits", "Only part of it is true", "That belongs to a different process"],
    fr: ["Aucune de ces affirmations ne convient", "Seule une partie est correcte", "Cela appartient à un autre phénomène"],
    it: ["Nessuna di queste affermazioni è adatta", "Solo una parte è corretta", "Questo appartiene a un altro fenomeno"],
  };
  for (const fallback of fallbacks[lang]) if (unique.length < 3 && fallback !== answer && !unique.includes(fallback)) unique.push(fallback);
  const answerIndex = Math.max(0, existing.findIndex((option) => normalisedOption(option) === normalisedOption(answer)));
  const repaired = unique.slice(0, 3);
  repaired.splice(Math.min(answerIndex, repaired.length), 0, answer);
  return repaired;
}

function repairAnswerOptions(exercise: Exercise, topicExercises: Exercise[]): Exercise {
  if (exercise.type !== "multiple-choice") return exercise;
  if (exercise.optionImages?.length || exercise.optionEmojis?.length) return exercise;
  const options = exercise.options ?? [];
  const broken = new Set(options.map((option) => normalisedOption(option))).size !== options.length
    || options.some((option) => normalisedOption(option) !== normalisedOption(exercise.answer) && isWeakDistractor(option, exercise.answer));
  if (!broken) return exercise;
  const pool = (lang: Lang) => topicExercises.map((item) => answerFor(item, lang));
  return {
    ...exercise,
    options: repairedOptions(exercise, "de", pool("de")),
    optionsEN: repairedOptions(exercise, "en", pool("en")),
    optionsFR: repairedOptions(exercise, "fr", pool("fr")),
    optionsIT: repairedOptions(exercise, "it", pool("it")),
  };
}

const TEXT_REPAIRS: Array<[RegExp, string]> = [
  [/mit einem Brille/g, "mit einer Brille"], [/\bEin Schnecke\b/g, "Eine Schnecke"], [/\bKein Ecken\b/g, "Keine Ecken"],
  [/einem feminines Nomen/g, "einem femininen Nomen"], [/einem neutrales Nomen/g, "einem neutralen Nomen"], [/einem maskulines Nomen/g, "einem maskulinen Nomen"],
  [/zu das Kind/g, "zu dem Kind"], [/ein Analogiebildung/g, "eine Analogiebildung"], [/eine unechte Bruch/g, "ein unechter Bruch"],
  [/ein Interjektion/g, "eine Interjektion"], [/ein invasive Art/g, "eine invasive Art"], [/eines Dampfturbine/g, "einer Dampfturbine"],
  [/Was ist pflanzliche Sekundärmetaboliten\?/g, "Was sind pflanzliche Sekundärmetaboliten?"], [/ein Erzählperspektive/g, "eine Erzählperspektive"],
  [/ein Inhaltsangabe/g, "eine Inhaltsangabe"], [/die milde Klimata/g, "die milden Klimata"], [/ein Megacity/g, "eine Megacity"],
  [/Was ist Island Biogeography-Theorie\?/g, "Was besagt die Theorie der Inselbiogeografie?"], [/die Föderalismus/g, "der Föderalismus"],
  [/Fu-ssweg/g, "Fussweg"], [/Homonim/g, "Homonym"], [/Konret/g, "Konkret"], [/Kompas-Nadel/g, "Kompassnadel"],
  [/Wärmesstrahlung/g, "Wärmestrahlung"], [/wiedervwertet/g, "wiederverwertet"], [/Röschtigraben/g, "Röstigraben"],
  [/Galleproduktion/g, "Gallenproduktion"], [/Schneehas\b/g, "Schneehase"], [/Busturentüren/g, "Bustüren"], [/Rundläufig/g, "Rundherum zugänglich"],
  [/franzöischer/g, "französischer"], [/Himmelrichtungen/g, "Himmelsrichtungen"], [/kein systematische Verfolgung/g, "keine systematische Verfolgung"],
  [/Stammstrategegie/g, "Stammstrategie"], [/Subsidiariätsprinzip/g, "Subsidiaritätsprinzip"], [/Gefrierpunktsern\./g, "Gefrierpunkt."],
  [/direktе Demokratie/g, "direkte Demokratie"], [/\.\.\?/g, "?"], [/\?\!/g, "?"], [/!!/g, "!"], [/\?\?/g, "?"], [/,,/g, ","],
  [/HUND hat 4 Buchstaben\. Ohne D bleibt\.\?/g, "HUND hat 4 Buchstaben. Was bleibt ohne D?"],
  [/Zwei Gruppen haben zusammen 9 Elemente\. Die erste hat 4\. Die zweite hat\.\?/g, "Zwei Gruppen haben zusammen 9 Elemente. Wie viele hat die zweite Gruppe?"],
  [/Der dritte Buchstabe im Alphabet ist\.\?/g, "Welcher Buchstabe steht im Alphabet an dritter Stelle?"],
  [/Heute ist der 20\. April\. In 2 Wochen ist der\.\?/g, "Heute ist der 20. April. Welches Datum ist in zwei Wochen?"],
  [/\bdie Hund\b/g, "der Hund"], [/\bDer hase Rennt\b/g, "Der Hase rennt"], [/\bEin Klingel\b/g, "Eine Klingel"],
  [/Laufen wenn Kinder rufen/g, "Laufen, wenn Kinder rufen"], [/\bdas Stühle\b/g, "die Stühle"], [/\bden Stühle\b/g, "den Stühlen"],
  [/Imperativ du-Form/g, "Imperativ in der du-Form"], [/\bKeine Unterschied\b/g, "Kein Unterschied"],
  [/\bdie Haus\b/g, "das Haus"], [/\bEin Parlamentsdebatte\b/g, "Eine Parlamentsdebatte"],
  [/Ein Recht, das jeder Mensch einfach weil er Mensch ist hat/g, "Ein Recht, das jeder Mensch hat, einfach weil er Mensch ist"],
  [/Das rote Licht des Fernsehers wenn er 'aus' ist/g, "Das rote Licht des Fernsehers, wenn er «aus» ist"],
  [/\bDas Körperteil\b/g, "Der Körperteil"], [/Wie schreibt man das Körperteil richtig\?/g, "Wie schreibt man den Namen des Körperteils richtig?"],
  [/W… — ein Wort das Bedingungen einleitet/g, "W… — ein Wort, das Bedingungen einleitet"],
  [/kein Unterschriften nötig/g, "keine Unterschriften nötig"],
  [/Indirekte Auswirkungen wenn eine Schlüsselart/g, "Indirekte Auswirkungen, wenn eine Schlüsselart"],
  [/\bEin Meeresströmung\b/g, "Eine Meeresströmung"], [/Passiv Bildung/g, "Passivbildung"],
  [/\bEin Silbe\b/g, "Eine Silbe"], [/Passiv Präteritum/g, "Passiv im Präteritum"],
  [/Englisches Grundrechtsdokument, das Königsmacht einschränkte/g, "Englisches Grundrechtsdokument, das die Königsmacht einschränkte"],
  [/Kondensator: zwei Platten, dazwischen E-Feld\. Kurzzeitig Energie!/g, "Kondensator: zwei Platten mit einem elektrischen Feld dazwischen. Er speichert kurzzeitig Energie."],
  [/Passiv Perfekt/g, "Passiv im Perfekt"], [/\bDas gefundene Schlüssel\b/g, "Der gefundene Schlüssel"],
  [/y sinkt wenn x steigt/g, "y sinkt, wenn x steigt"], [/gegeben dass B eingetreten ist/g, "gegeben, dass B eingetreten ist"],
  [/\bDirekt Aufnahme\b/g, "Direkte Aufnahme"], [/Schutz zu beantragen wenn man verfolgt wird/g, "Schutz zu beantragen, wenn man verfolgt wird"],
  [/10 Mio\/Jahr falls nichts passiert/g, "10 Mio. pro Jahr, falls nichts passiert"],
  [/\bAnglokanismus\b/g, "Anglikanismus"], [/\bAuftragun\b/g, "Auftrag"], [/\bBerufsoldaten\b/g, "Berufssoldaten"],
  [/\bColonisation\b/g, "Kolonisation"], [/\bCoevolution\b/g, "Koevolution"], [/\bCryosphere\b/g, "Kryosphäre"],
  [/Was ist das Europäische Stabilitätsmechanismus/g, "Was ist der Europäische Stabilitätsmechanismus"],
  [/Was ist Kultureller Imperialismus\?/g, "Was ist kultureller Imperialismus?"],
  [/Was ist Planetare Grenzen\?/g, "Was sind planetare Grenzen?"],
  [/Was ist Politische Partizipation\?/g, "Was ist politische Partizipation?"],
  [/Was ist Faradaysches Gesetz\?/g, "Was ist das Faradaysche Gesetz?"],
  [/Was ist Synthetische Biologie\?/g, "Was ist synthetische Biologie?"],
  [/Was ist Pazifisches Jahrhundert\?/g, "Was bedeutet «pazifisches Jahrhundert»?"],
  [/Was ist Kontrafaktische Geschichte\?/g, "Was ist kontrafaktische Geschichte?"],
  [/Was ist Agile Softwareentwicklung\?/g, "Was ist agile Softwareentwicklung?"],
  [/Was ist Digitale Transformation des Staates/g, "Was ist die digitale Transformation des Staates"],
  [/Was ist Soziale Ungleichheit als Zukunftsproblem\?/g, "Was bedeutet soziale Ungleichheit als Zukunftsproblem?"],
  [/Was ist Nachhaltiger Konsum\?/g, "Was ist nachhaltiger Konsum?"],
];

function repairGermanText(exercise: Exercise): Exercise {
  const fix = (value: string) => TEXT_REPAIRS.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), value);
  return { ...exercise, question: fix(exercise.question), answer: fix(exercise.answer), hints: exercise.hints.map(fix), options: exercise.options?.map(fix) };
}

/** Repairs confirmed German-source editorial defects after all content layers. */
export function applyGermanEditorialRepairs(grade: number, subject: string, topics: Topic[]): Topic[] {
  return topics.map((topic) => ({
    ...topic,
    exercises: topic.exercises.map((exercise) => {
      const key = `${grade}/${subject}/${topic.id}/${exercise.id}`;
      const answerRepaired = repairKnownAnswer(exercise, key);
      const optionRepaired = repairAnswerOptions(answerRepaired, topic.exercises);
      const hintRepaired = repairHints(optionRepaired, key, subject);
      const textRepaired = repairGermanText(repairMultiBlankInteraction(hintRepaired));
      const deduplicated = repairAnswerOptions(textRepaired, topic.exercises);
      return ensureHintsDoNotRevealAnswer(deduplicated, subject);
    }),
  }));
}
