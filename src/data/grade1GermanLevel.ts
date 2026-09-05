import type { Exercise, Topic } from "@/types/exercise";

type LetterPair = "ie" | "ei";

interface SoundWord {
  word: string;
  emoji: string;
  pair: LetterPair;
  sentence: string;
}

const SOUND_WORDS: SoundWord[] = [
  { word: "Tier", emoji: "🐶", pair: "ie", sentence: "Ein Hund ist ein Tier." },
  { word: "Ei", emoji: "🥚", pair: "ei", sentence: "Das Ei liegt im Nest." },
  { word: "Biene", emoji: "🐝", pair: "ie", sentence: "Die Biene fliegt." },
  { word: "Eis", emoji: "🍦", pair: "ei", sentence: "Das Eis ist kalt." },
  { word: "sieben", emoji: "7️⃣", pair: "ie", sentence: "Ich sehe sieben Sterne." },
  { word: "Bein", emoji: "🦵", pair: "ei", sentence: "Mein Bein ist stark." },
  { word: "Brief", emoji: "✉️", pair: "ie", sentence: "Der Brief kommt an." },
  { word: "Stein", emoji: "🪨", pair: "ei", sentence: "Der Stein ist rund." },
  { word: "Spiel", emoji: "🎲", pair: "ie", sentence: "Das Spiel macht Spass." },
  { word: "Seil", emoji: "🪢", pair: "ei", sentence: "Das Seil ist lang." },
  { word: "Wiese", emoji: "🌱", pair: "ie", sentence: "Die Wiese ist grün." },
  { word: "klein", emoji: "🐭", pair: "ei", sentence: "Die Maus ist klein." },
  { word: "Ziege", emoji: "🐐", pair: "ie", sentence: "Die Ziege frisst Gras." },
  { word: "Kleid", emoji: "👗", pair: "ei", sentence: "Das Kleid ist blau." },
  { word: "Knie", emoji: "🦵", pair: "ie", sentence: "Mein Knie ist gebeugt." },
  { word: "Seife", emoji: "🧼", pair: "ei", sentence: "Die Seife macht sauber." },
  { word: "Lied", emoji: "🎵", pair: "ie", sentence: "Wir singen ein Lied." },
  { word: "Reifen", emoji: "🛞", pair: "ei", sentence: "Der Reifen ist rund." },
  { word: "Stiefel", emoji: "🥾", pair: "ie", sentence: "Der Stiefel ist braun." },
  { word: "Leiter", emoji: "🪜", pair: "ei", sentence: "Die Leiter ist hoch." },
  { word: "Fliege", emoji: "🪰", pair: "ie", sentence: "Die Fliege summt." },
  { word: "Meise", emoji: "🐦", pair: "ei", sentence: "Die Meise sitzt im Baum." },
  { word: "vier", emoji: "4️⃣", pair: "ie", sentence: "Vier Äpfel liegen da." },
  { word: "drei", emoji: "3️⃣", pair: "ei", sentence: "Drei Bälle rollen." },
  { word: "hier", emoji: "📍", pair: "ie", sentence: "Ich bin hier." },
  { word: "zwei", emoji: "2️⃣", pair: "ei", sentence: "Zwei Katzen schlafen." },
  { word: "Ziel", emoji: "🎯", pair: "ie", sentence: "Ich treffe das Ziel." },
  { word: "Pfeil", emoji: "🏹", pair: "ei", sentence: "Der Pfeil fliegt." },
  { word: "Spiegel", emoji: "🪞", pair: "ie", sentence: "Ich sehe mich im Spiegel." },
  { word: "Eimer", emoji: "🪣", pair: "ei", sentence: "Der Eimer ist voll." },
  { word: "Papier", emoji: "📄", pair: "ie", sentence: "Ich male auf Papier." },
  { word: "Reise", emoji: "🧳", pair: "ei", sentence: "Die Reise beginnt." },
  { word: "Liebe", emoji: "❤️", pair: "ie", sentence: "Liebe tut gut." },
  { word: "Kreis", emoji: "⭕", pair: "ei", sentence: "Ich male einen Kreis." },
  { word: "wiegen", emoji: "⚖️", pair: "ie", sentence: "Wir wiegen den Apfel." },
  { word: "heiss", emoji: "♨️", pair: "ei", sentence: "Der Tee ist heiss." },
  { word: "fliegen", emoji: "🕊️", pair: "ie", sentence: "Vögel können fliegen." },
  { word: "weiss", emoji: "⚪", pair: "ei", sentence: "Der Schnee ist weiss." },
  { word: "Riese", emoji: "🗿", pair: "ie", sentence: "Der Riese ist gross." },
  { word: "nein", emoji: "🙅", pair: "ei", sentence: "Ich sage nein." },
  { word: "schieben", emoji: "🛒", pair: "ie", sentence: "Wir schieben den Wagen." },
  { word: "Teig", emoji: "🥣", pair: "ei", sentence: "Der Teig ist weich." },
  { word: "liegen", emoji: "🛏️", pair: "ie", sentence: "Das Buch bleibt liegen." },
  { word: "Geige", emoji: "🎻", pair: "ei", sentence: "Die Geige klingt schön." },
  { word: "spielen", emoji: "🧸", pair: "ie", sentence: "Die Kinder spielen." },
  { word: "Seite", emoji: "📖", pair: "ei", sentence: "Ich lese eine Seite." },
  { word: "tief", emoji: "⬇️", pair: "ie", sentence: "Das Loch ist tief." },
  { word: "weich", emoji: "🧸", pair: "ei", sentence: "Das Kissen ist weich." },
];

const CAPITAL_TARGETS = [
  ..."abcdefghijklmnopqrstuvwxyz".split("").map((lower) => ({ label: lower, lower, kind: "letter" as const })),
  ...[
    "Anna", "Ben", "Carla", "Dino", "Emma", "Finn", "Greta", "Hugo", "Ida", "Jonas", "Kim", "Lina",
    "Mia", "Noah", "Olga", "Paul", "Rita", "Sara", "Tim", "Ueli", "Vera", "Willi", "Xenia",
  ].map((label) => ({ label, lower: label[0].toLowerCase(), kind: "name" as const })),
];

const VOWEL_WORDS = [
  "Apfel", "Ente", "Igel", "Ofen", "Uhu", "Ball", "Bett", "Fisch", "Mond", "Hund",
  "Katze", "Regen", "Tinte", "Sonne", "Blume", "Hase", "Keks", "Kind", "Topf", "Bus",
  "Tafel", "Feder", "Insel", "Vogel", "Pudel", "Banane", "Elefant", "Gitarre", "Tomate", "Muschel",
  "Rakete", "Besen", "Kino", "Rose", "Kugel",
];

function cleanExercise(original: Exercise, fields: Partial<Exercise>): Exercise {
  return {
    id: original.id,
    type: original.type,
    difficulty: original.difficulty,
    ...(original.free ? { free: true } : {}),
    preserveGermanContent: true,
    ...fields,
  } as Exercise;
}

function choiceOptions(answer: string, pool: string[], count = 4): string[] {
  return [answer, ...pool.filter((item) => item !== answer)].slice(0, count);
}

function rewriteSoundExercise(original: Exercise, index: number): Exercise {
  if (original.type === "drag-drop") {
    const suffix = original.id;
    const hard = original.difficulty === 3;
    const words = hard
      ? [
          { key: "ziege", label: "Ziege", emoji: "🐐", initial: "Z" },
          { key: "kreis", label: "Kreis", emoji: "⭕", initial: "K" },
          { key: "ziel", label: "Ziel", emoji: "🎯", initial: "Z" },
          { key: "kleid", label: "Kleid", emoji: "👗", initial: "K" },
        ]
      : [
          { key: "biene", label: "Biene", emoji: "🐝", initial: "B" },
          { key: "stein", label: "Stein", emoji: "🪨", initial: "S" },
          { key: "brief", label: "Brief", emoji: "✉️", initial: "B" },
          { key: "seil", label: "Seil", emoji: "🪢", initial: "S" },
        ];
    const initials = hard ? ["Z", "K"] : ["B", "S"];
    return cleanExercise(original, {
      question: `Ziehe jedes Wort zu seinem Anfangsbuchstaben ${initials[0]} oder ${initials[1]}.`,
      answer: "all",
      dragItems: words.map((word) => ({ id: `${suffix}-${word.key}`, label: word.label, emoji: word.emoji })),
      dropZones: initials.map((initial) => ({ id: `${suffix}-${initial}`, label: initial })),
      dropAnswers: Object.fromEntries(words.map((word) => [`${suffix}-${word.key}`, `${suffix}-${word.initial}`])),
      hints: ["Sprich jedes Wort langsam aus.", "Achte auf den ersten Laut."],
    });
  }

  const item = SOUND_WORDS[index % SOUND_WORDS.length];
  const initial = item.word[0].toUpperCase();
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const question = original.difficulty === 1
    ? `Hör genau: ${item.emoji} «${item.word}». Welchen Laut hörst du am Anfang?`
    : original.difficulty === 2
      ? `Sprich ${item.emoji} «${item.word}» langsam. Schreibe den ersten Buchstaben.`
      : `${item.sentence} Mit welchem Buchstaben beginnt «${item.word}»?`;

  return cleanExercise(original, {
    question,
    listeningText: `${item.word}. ${item.sentence}`,
    answer: initial,
    ...(original.type === "multiple-choice" ? { options: choiceOptions(initial, alphabet) } : {}),
    hints: ["Sprich das Wort langsam aus.", "Achte auf den ersten Laut."],
    mascot: original.difficulty === 3 ? "think" : undefined,
  });
}

function rewriteCapitalExercise(original: Exercise, index: number): Exercise {
  if (original.type === "drag-drop") {
    const suffix = original.id;
    return cleanExercise(original, {
      question: "Ziehe jeden Kleinbuchstaben zum passenden Grossbuchstaben.",
      answer: "all",
      dragItems: ["a", "b", "m", "s"].map((letter) => ({ id: `${suffix}-${letter}`, label: letter })),
      dropZones: ["A", "B", "M", "S"].map((letter) => ({ id: `${suffix}-${letter}`, label: letter })),
      dropAnswers: { [`${suffix}-a`]: `${suffix}-A`, [`${suffix}-b`]: `${suffix}-B`, [`${suffix}-m`]: `${suffix}-M`, [`${suffix}-s`]: `${suffix}-S` },
      hints: ["Gross- und Kleinbuchstabe sehen ähnlich aus.", "Sprich den Buchstaben laut aus."],
    });
  }

  const item = CAPITAL_TARGETS[index % CAPITAL_TARGETS.length];
  const answer = item.lower.toUpperCase();
  const question = item.kind === "letter"
    ? `Welcher Grossbuchstabe gehört zu «${item.lower}»?`
    : `Der Name «${item.label}» beginnt mit welchem Grossbuchstaben?`;
  const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return cleanExercise(original, {
    question,
    listeningText: item.kind === "name" ? `${item.label}.` : undefined,
    answer,
    ...(original.type === "multiple-choice" ? { options: choiceOptions(answer, pool) } : {}),
    hints: ["Namen und Satzanfänge beginnen gross.", "Suche die grosse Form des ersten Buchstabens."],
  });
}

function rewriteAbcExercise(original: Exercise, index: number): Exercise {
  if (original.type === "drag-drop") {
    const suffix = original.id;
    const secondSet = original.id === "abc24";
    const letters = secondSet ? ["J", "G", "I", "H"] : ["D", "A", "C", "B"];
    const ordered = secondSet ? ["G", "H", "I", "J"] : ["A", "B", "C", "D"];
    return cleanExercise(original, {
      question: secondSet ? "Ordne G, H, I und J in der ABC-Reihenfolge." : "Bringe A, B, C und D in die ABC-Reihenfolge.",
      answer: "all",
      dragItems: letters.map((letter) => ({ id: `${suffix}-${letter}`, label: letter })),
      dropZones: ["1", "2", "3", "4"].map((position) => ({ id: `${suffix}-${position}`, label: `${position}.` })),
      dropAnswers: Object.fromEntries(ordered.map((letter, index) => [`${suffix}-${letter}`, `${suffix}-${index + 1}`])),
      hints: ["Sage das ABC langsam auf.", "Beginne mit A."],
    });
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const start = index % 23;
  const answer = alphabet[start + 1];
  const question = original.difficulty === 1
    ? `Welcher Buchstabe kommt im ABC direkt nach «${alphabet[start]}»?`
    : original.difficulty === 2
      ? `Welcher Buchstabe fehlt? ${alphabet[start]}, __, ${alphabet[start + 2]}`
      : `Welcher Buchstabe fehlt? ${alphabet[start]}, __, ${alphabet[start + 2]}, ${alphabet[start + 3]}`;

  return cleanExercise(original, {
    question,
    answer,
    ...(original.type === "multiple-choice" ? { options: choiceOptions(answer, alphabet.split("")) } : {}),
    hints: ["Sage das ABC ab diesem Buchstaben weiter.", "Gesucht ist genau ein Buchstabe."],
  });
}

function rewriteVowelExercise(original: Exercise, index: number): Exercise {
  if (original.type === "drag-drop") {
    const suffix = original.id;
    return cleanExercise(original, {
      question: "Ziehe die Buchstaben zu Vokal oder Konsonant.",
      answer: "all",
      dragItems: ["A", "M", "E", "S", "I", "T"].map((letter) => ({ id: `${suffix}-${letter}`, label: letter })),
      dropZones: [{ id: `${suffix}-v`, label: "Vokal" }, { id: `${suffix}-k`, label: "Konsonant" }],
      dropAnswers: { [`${suffix}-A`]: `${suffix}-v`, [`${suffix}-E`]: `${suffix}-v`, [`${suffix}-I`]: `${suffix}-v`, [`${suffix}-M`]: `${suffix}-k`, [`${suffix}-S`]: `${suffix}-k`, [`${suffix}-T`]: `${suffix}-k` },
      hints: ["Die Vokale sind A, E, I, O und U.", "Sprich jeden Buchstaben laut aus."],
    });
  }

  if (original.difficulty === 1) {
    const letters = "AEIOUBCDFGHJKLMNPQRSTVWXYZ";
    const letter = letters[index % letters.length];
    const answer = "AEIOU".includes(letter) ? "Vokal" : "Konsonant";
    return cleanExercise(original, {
      question: `Ist «${letter}» ein Vokal oder ein Konsonant?`,
      answer,
      ...(original.type === "multiple-choice" ? { options: ["Vokal", "Konsonant"] } : {}),
      hints: ["Die Vokale sind A, E, I, O und U.", "Vergleiche den Buchstaben mit dieser Reihe."],
    });
  }

  const word = VOWEL_WORDS[(index - 15) % VOWEL_WORDS.length];
  const answer = word.toUpperCase().split("").find((letter) => "AEIOU".includes(letter)) ?? "A";
  return cleanExercise(original, {
    question: `Welchen Vokal hörst du zuerst in «${word}»?`,
    listeningText: `${word}.`,
    answer,
    ...(original.type === "multiple-choice" ? { options: choiceOptions(answer, ["A", "E", "I", "O", "U"], 5) } : {}),
    hints: ["Sprich das Wort langsam aus.", "Achte auf A, E, I, O oder U."],
  });
}

const TARGETED: Record<string, Partial<Exercise>> = {
  b16: { question: "Welcher Buchstabe kommt in «BAUM» direkt nach B?", answer: "A", options: ["A", "M", "U", "B"], hints: ["Lies BAUM von links nach rechts.", "Schau auf den zweiten Buchstaben."] },
  b17: { question: "Mit welchem Buchstaben beginnt «SONNE»?", answer: "S", hints: ["Sprich SONNE langsam.", "Achte auf den ersten Laut."] },
  b24: { question: "Wie viele Buchstaben hat «MAMA»?", answer: "4", options: ["2", "3", "4", "5"], hints: ["Tippe auf jeden Buchstaben.", "Zähle M-A-M-A."] },
  b31: { question: "Mit welchem Buchstaben beginnt «MOND»?", answer: "M", options: ["M", "O", "N", "D"], hints: ["Sprich MOND langsam.", "Achte auf den ersten Laut."] },
  b40: { question: "Welches Wort beginnt mit S?", answer: "Sonne", options: ["Sonne", "Mond", "Ball", "Haus"], hints: ["Sprich alle Wörter laut aus.", "Suche den S-Laut am Anfang."] },
  ew36: { question: "Welches Wort passt zu 🐶?", answer: "Hund", options: ["Hund", "Haus", "Ball", "Buch"], hints: ["Schau auf das Bild.", "Sprich die Wörter laut aus."] },
  ew38: { question: "Welches Wort passt zu 🍎?", answer: "Apfel", options: ["Apfel", "Katze", "Sonne", "Tisch"], hints: ["Schau auf das Bild.", "Gesucht ist etwas zum Essen."] },
  sl21: { question: "Jana kauft Äpfel. Was kauft Jana? ___", answer: "Äpfel", hints: ["Lies den kurzen Satz noch einmal.", "Achte auf das Wort nach «kauft»."] },
  sl31: { question: "Ole gibt Tom ein Bonbon. Wer bekommt das Bonbon?", answer: "Tom", options: ["Tom", "Ole", "Anna", "Niemand"], hints: ["Lies den Satz langsam.", "Achte auf die Person nach «gibt»."] },
  sl37: { question: "Karl liest ein Buch. Was liest Karl? ___", answer: "Buch", hints: ["Die Antwort steht direkt im Satz.", "Achte auf das Wort nach «ein»."] },
  sl41: { question: "Nina hat einen roten Stift. Welche Farbe hat der Stift? ___", answer: "rot", hints: ["Lies den Satz noch einmal.", "Achte auf das Wort vor «Stift»."] },
  sl43: { question: "Eva gibt Tom ein Bonbon. Was bekommt Tom? ___", answer: "Bonbon", hints: ["Die Antwort steht im Satz.", "Achte auf das letzte Wort."] },
  sl44: { question: "Ben trägt eine Jacke, weil ihm kalt ist. Warum trägt Ben eine Jacke?", answer: "Weil ihm kalt ist", options: ["Weil ihm kalt ist", "Weil es dunkel ist", "Weil er schwimmt", "Weil er schläft"], hints: ["Lies den Satz bis zum Ende.", "Die Begründung beginnt mit «weil»."] },
  sl46: { question: "Lisa hat einen Hund und eine Katze. Welches Tier hat Lisa nicht?", answer: "Fisch", options: ["Fisch", "Hund", "Katze"], hints: ["Lies beide Tiernamen im Satz.", "Suche das Tier, das nicht vorkommt."] },
  sl50: { question: "Sara liest in ihrem Zimmer. Wo liest Sara?", answer: "Im Zimmer", options: ["Im Zimmer", "Im Garten", "In der Schule", "Im Bus"], hints: ["Die Antwort steht direkt im Satz.", "Achte auf den Ort nach «in ihrem»."] },
  sk8: { question: "Wie viele Silben hat «AP-FEL»?", answer: "2", options: ["1", "2", "3", "4"], hints: ["Klatsche beim Sprechen mit.", "AP-FEL hat zwei Sprechschritte."] },
  sk14: { question: "Wie viele Silben hat «KIND»?", answer: "1", options: ["1", "2", "3"], hints: ["Sprich KIND in einem Zug.", "Klatsche beim Sprechen mit."] },
  sk24: { question: "Wie viele Silben hat «ERD-BEE-RE»?", answer: "3", options: ["2", "3", "4", "5"], hints: ["Klatsche beim Sprechen mit.", "Sprich ERD-BEE-RE langsam."] },
  sk41: { question: "Wie viele Silben hat «TO-MA-TE»?", answer: "3", options: ["1", "2", "3", "4"], hints: ["Klatsche beim Sprechen mit.", "Sprich TO-MA-TE langsam."] },
  r2: { question: "Was reimt sich auf «Katze»?", answer: "Tatze", options: ["Tatze", "Hund", "Maus", "Fisch"], hints: ["Sprich beide Wörter laut aus.", "Achte auf den Klang am Ende."] },
  r3: { question: "Was reimt sich auf «Sonne»?", answer: "Tonne", options: ["Tonne", "Mond", "Stern", "Wolke"], hints: ["Sprich die Wörter laut aus.", "Achte auf «-onne»."] },
  r7: { question: "Was reimt sich auf «Tag»?", answer: "mag", options: ["mag", "Hut", "rot", "Wind"], hints: ["Sprich TAG und die Antworten laut aus.", "Achte auf «-ag»."] },
  r8: { question: "Was reimt sich auf «Ball»?", answer: "Fall", options: ["Fall", "Haus", "Brot", "Kind"], hints: ["Sprich BALL und die Antworten laut aus.", "Achte auf «-all»."] },
  r14: { type: "multiple-choice", question: "Was reimt sich auf «Hand»?", answer: "Wand", options: ["Wand", "Hund", "Mond", "Wind"], hints: ["Sprich HAND und die Antworten laut aus.", "Achte auf «-and»."] },
};

function applyTargetedExercise(exercise: Exercise): Exercise {
  const replacement = TARGETED[exercise.id];
  return replacement ? cleanExercise(exercise, replacement) : exercise;
}

export function applyGrade1GermanLevel(topics: Topic[]): Topic[] {
  return topics.map((topic) => {
    if (topic.id === "ie-ei") {
      return { ...topic, title: "Laute hören: Anlaute", exercises: topic.exercises.map(rewriteSoundExercise) };
    }
    if (topic.id === "gross-kleinschreibung") {
      return { ...topic, title: "Gross- und Kleinbuchstaben", exercises: topic.exercises.map(rewriteCapitalExercise) };
    }
    if (topic.id === "abc-reihenfolge") {
      return { ...topic, exercises: topic.exercises.map(rewriteAbcExercise) };
    }
    if (topic.id === "vokale-konsonanten") {
      return { ...topic, exercises: topic.exercises.map(rewriteVowelExercise) };
    }
    if (topic.id === "einfache-woerter") {
      return {
        ...topic,
        exercises: topic.exercises.map((exercise) => exercise.id === "ew39"
          ? cleanExercise(exercise, {
              question: "Ziehe jedes Wort zum passenden Bild.", answer: "all",
              dragItems: [
                { id: "ew39-hund", label: "Hund" }, { id: "ew39-ball", label: "Ball" },
                { id: "ew39-haus", label: "Haus" }, { id: "ew39-apfel", label: "Apfel" },
              ],
              dropZones: [
                { id: "ew39-dog", label: "🐶" }, { id: "ew39-ball-zone", label: "⚽" },
                { id: "ew39-house", label: "🏠" }, { id: "ew39-apple", label: "🍎" },
              ],
              dropAnswers: { "ew39-hund": "ew39-dog", "ew39-ball": "ew39-ball-zone", "ew39-haus": "ew39-house", "ew39-apfel": "ew39-apple" },
              hints: ["Lies jedes Wort laut.", "Vergleiche Wort und Bild."],
            })
          : applyTargetedExercise(exercise)),
      };
    }
    return { ...topic, exercises: topic.exercises.map(applyTargetedExercise) };
  });
}
