import { Exercise, Topic } from "@/types/exercise";

type Difficulty = 1 | 2 | 3;

type ExerciseFact = {
  question: string;
  answer: string;
  options: string[];
  fill: string;
  fillAnswer?: string;
  hint: string;
};

type FactSet = Record<Difficulty, ExerciseFact[]>;

// Some multiple-choice facts use a full explanatory answer while their fill-in
// variant asks only for the missing word or phrase. Keep those two answer shapes
// separate so inserting the stored fill-in answer always creates a valid sentence.
export const NORMALIZED_FILL_ANSWERS: Record<string, string> = {
  "8:30 heisst Halb ___.": "9",
  "Eine Viertelstunde hat ___ Minuten.": "15",
  "7:15 heisst Viertel nach ___.": "7",
  "6:45 heisst Viertel vor ___.": "7",
  "Eine halbe Stunde hat ___ Minuten.": "30",
  "Von 10:15 bis 10:45 vergehen ___ Minuten.": "30",
  "Von 8:30 bis 8:45 wartet Tom ___ Minuten.": "15",
  "Wind ist bewegte ___.": "Luft",
  "Wolken bestehen aus winzigen Wasser___.": "tröpfchen",
  "Bei Wärme ___ Schnee.": "schmilzt",
  "Wetter beschreibt, wie es ___ draussen ist.": "heute",
  "Mit einer Wettervorhersage kann man Kleidung und Ausflüge ___.": "planen",
  "Wechselhaft heisst: Das Wetter ändert sich ___.": "oft",
  "Beim Wetter beobachtet man Temperatur, Wind, Wolken und ___.": "Regen",
  "Im Wasserkreislauf verdunstet Wasser, bildet Wolken und fällt als ___.": "Regen",
  "Im Winter zieht man warme Kleidung an, weil es ___ ist.": "kälter",

  "Eis ___ in der Wärme.": "schmilzt",
  "Ein fester Stoff hat eine eigene ___.": "Form",
  "Eine Lampe braucht Energie zum ___.": "Leuchten",
  "Bei Verdunstung wird Wasser zu ___.": "Wasserdampf",
  "Sonne, Wind und Wasser liefern ___ Energie.": "erneuerbare",
  "Ein Gas verteilt sich im ___.": "Raum",
  "Beim Gefrieren wird Wasser ___.": "fest",
  "Energie sparen schont Ressourcen und ___.": "Umwelt",
  "Eine Thermosflasche hält Wärme länger ___.": "zurück",
  "Stoffe sortieren hilft beim ___.": "Recycling",
  "In einem Stoffkreislauf werden Stoffe wieder___.": "verwendet",
  "Bei einer Energieumwandlung wird eine Energieform zu einer ___.": "anderen",

  "Ein Schatten entsteht, wenn Licht ___ wird.": "blockiert",
  "Ein Spiegel ___ Licht.": "reflektiert",
  "Eine Lichtquelle macht selbst ___.": "Licht",
  "Dunkel ist es bei wenig ___.": "Licht",
  "Durch Glas kann Licht ___.": "hindurch",
  "Eine Lupe ___ kleine Dinge.": "vergrössert",
  "Gegenstände werfen bestimmte Lichtfarben ___.": "zurück",
  "Beim Regenbogen wird Licht in ___ aufgeteilt.": "Farben",
  "Durch Holz kommt Licht nicht ___.": "hindurch",
  "Morgens steht die Sonne tief, darum ist der Schatten oft ___.": "lang",
  "Schnee ___ viel Licht.": "reflektiert",
  "Hinter einem Gegenstand wird es dunkler, weil er Licht ___.": "abhält",
  "Bei Brechung ändert Licht seine ___.": "Richtung",
  "In einem Lichtexperiment prüfst du Licht und ___.": "Materialien",

  "Ein Kompass zeigt nach ___.": "Norden",
  "Eine Karte zeigt ein Gebiet ___.": "von oben und verkleinert",
  "Die Legende erklärt die ___ auf der Karte.": "Zeichen",
  "Ein Ortsplan zeigt Strassen und wichtige ___.": "Orte",
  "Der Massstab zeigt: Karte und Wirklichkeit sind unterschiedlich ___.": "gross",
  "Höhenlinien zeigen Höhen im ___.": "Gelände",
  "Eine topografische Karte zeigt Gelände, Gewässer und ___.": "Wege",
  "Karte, Kompass und ___ helfen beim Orientieren.": "Wegzeichen",
  "Eine politische Karte zeigt Länder und ___.": "Grenzen",
  "Mit dem Massstab kann man Entfernungen ___.": "abschätzen",
  "Koordinaten zeigen einen genauen ___.": "Ort",
  "Beim Kartenlesen helfen Richtung, Legende und ___.": "Massstab",
  "Südwesten liegt zwischen Süden und ___.": "Westen",
  "Kartensymbole sparen ___ und zeigen Infos.": "Platz",

  "Ein Planet kreist um einen ___.": "Stern",
  "Tag und Nacht entstehen durch die Drehung der ___.": "Erde",
  "Eine Mondphase zeigt die sichtbare ___ des Mondes.": "Form",
  "Ein Asteroid ist ein kleiner felsiger ___.": "Himmelskörper",
  "Jahreszeiten entstehen, weil die Erdachse ___ ist.": "geneigt",
  "Mit einem ___ beobachtet man Sterne und Planeten.": "Teleskop",
  "Die ___ hält Planeten auf ihren Bahnen.": "Schwerkraft",
  "Ein Lichtjahr ist eine sehr grosse ___.": "Strecke",
  "Zum Sonnensystem gehören Sonne, Planeten und weitere ___.": "Himmelskörper",
  "Bei einer Sonnenfinsternis steht der ___ zwischen Sonne und Erde.": "Mond",
  "Sterne wirken klein, weil sie sehr weit ___ sind.": "entfernt",

  "Eine Batterie liefert elektrische ___.": "Energie",
  "Ein Schalter öffnet oder schliesst den ___.": "Stromkreis",
  "Strom fliesst in einem geschlossenen ___.": "Stromkreis",
  "Gummi ist ein ___, weil es Strom schlecht leitet.": "Isolator",
  "In einer Reihenschaltung liegen Bauteile ___.": "hintereinander",
  "Volt ist die Einheit der elektrischen ___.": "Spannung",
  "Ein Kurzschluss kann gefährlich sein, weil zu viel ___ fliesst.": "Strom",
  "Bei der Parallelschaltung hat Strom mehrere ___.": "Wege",
  "Eine Sicherung unterbricht den Stromkreis bei zu viel ___.": "Strom",
  "Ein Generator wandelt Bewegung in elektrische ___ um.": "Energie",
  "Steckdosen sind kein Spielzeug, weil Strom ___ sein kann.": "gefährlich",
  "Widerstand erschwert den ___.": "Stromfluss",
  "Die Stromstärke beschreibt, wie viel Strom ___.": "fliesst",

  "Vergangenheit bedeutet: Es ist schon ___.": "passiert",
  "Ein Jahr hilft, Ereignisse zeitlich zu ___.": "ordnen",
  "Eine Zeitlinie ordnet Ereignisse nach der ___.": "zeitlichen Reihenfolge",
  "Eine historische Quelle gibt Hinweise aus der ___.": "Vergangenheit",
  "Eine Epoche ist ein Abschnitt der ___.": "Geschichte",
  "Quellen helfen zu verstehen, was früher ___ ist.": "passiert",
  "Eine Sekundärquelle wurde später über die Vergangenheit ___.": "geschrieben",
  "Der Vergleich früher/heute zeigt ___.": "Veränderungen",
  "Eine Primärquelle stammt direkt aus der untersuchten ___.": "Zeit",
  "Chronologisch heisst: in zeitlicher ___.": "Reihenfolge",
  "Quellen können verschieden sein, weil Menschen Dinge verschieden ___.": "erleben",
  "Neben Jahreszahlen braucht man ___.": "Zusammenhänge",
  "Gute historische Fragen fragen nach Gründen, Folgen oder ___.": "Unterschieden",
  "Ursache und Folge erklären warum etwas passiert und was danach ___.": "geschieht",
  "Historischer Wandel ist Veränderung über längere ___.": "Zeit",
};

const difficultyForIndex = (index: number): Difficulty => {
  if (index < 15) return 1;
  if (index < 35) return 2;
  return 3;
};

const variants = [
  "Wähle die passende Antwort:",
  "Was stimmt?",
  "Welche Aussage passt?",
  "Denke an das Thema:",
  "Prüfe dein Wissen:",
];

export function buildNormalizedTopicExercises(prefix: string, facts: FactSet): Exercise[] {
  return Array.from({ length: 50 }, (_, index) => {
    const difficulty = difficultyForIndex(index);
    const pool = facts[difficulty];
    const fact = pool[index % pool.length];
    const number = index + 1;
    const isMultipleChoice = index % 2 === 0;

    if (isMultipleChoice) {
      return {
        id: `${prefix}${number}`,
        type: "multiple-choice",
        difficulty,
        question: `${variants[index % variants.length]} ${fact.question}`,
        answer: fact.answer,
        options: fact.options.includes(fact.answer) ? fact.options : [fact.answer, ...fact.options].slice(0, 4),
        hints: [fact.hint, `Achte auf: ${fact.answer}.`],
        free: index < 3,
      };
    }

    const fillAnswer = fact.fillAnswer ?? NORMALIZED_FILL_ANSWERS[fact.fill] ?? fact.answer;
    return {
      id: `${prefix}${number}`,
      type: "fill-in-blank",
      difficulty,
      question: fact.fill,
      answer: fillAnswer,
      hints: [fact.hint, `Gesucht ist: ${fillAnswer}.`],
      free: index < 3,
    };
  });
}

export function replaceTopicExercises(topics: Topic[], replacements: Record<string, Exercise[]>): Topic[] {
  return topics.map((topic) => {
    const exercises = replacements[topic.id];
    return exercises ? { ...topic, exercises } : topic;
  });
}
