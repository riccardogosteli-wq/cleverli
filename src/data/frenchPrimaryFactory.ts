import type { Exercise, Topic } from "@/types/exercise";

export interface FrenchVocabularyItem {
  fr: string;
  de: string;
  emoji?: string;
}

export interface FrenchChoiceItem {
  question: string;
  answer: string;
  options: [string, string, string, string];
  hint: string;
}

export interface FrenchClozeItem {
  question: string;
  answer: string;
  altAnswers?: string[];
  hint: string;
}

export interface FrenchWritingItem {
  question: string;
  example: string;
  criteria: [string, string, string];
}

export interface FrenchPrimaryTopicSpec {
  id: string;
  title: string;
  emoji: string;
  curriculumCodes: readonly string[];
  vocabulary: readonly FrenchVocabularyItem[];
  categoryLabels: readonly [string, string];
  categoryAssignments: readonly (0 | 1)[];
  choices: readonly FrenchChoiceItem[];
  cloze: readonly FrenchClozeItem[];
  writing: readonly FrenchWritingItem[];
}

function rotateOptions<T>(values: readonly T[], correctIndex: number): [T, T, T, T] {
  const result = [
    values[correctIndex],
    values[(correctIndex + 1) % values.length],
    values[(correctIndex + 3) % values.length],
    values[(correctIndex + 6) % values.length],
  ];
  return result as [T, T, T, T];
}

function matchingPairs(items: readonly FrenchVocabularyItem[], offset: number) {
  return items.slice(offset, offset + 4).flatMap((item, index) => [
    { id: `fr-${offset}-${index}`, label: item.fr, emoji: item.emoji },
    { id: `de-${offset}-${index}`, label: item.de, emoji: item.emoji },
  ]);
}

function normaliseSearchWord(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();
}

function accentlessAnswer(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function ensureSpec(spec: FrenchPrimaryTopicSpec): void {
  if (spec.vocabulary.length !== 10) throw new Error(`${spec.id}: expected 10 vocabulary items`);
  if (spec.categoryAssignments.length !== 10) throw new Error(`${spec.id}: expected 10 category assignments`);
  if (spec.choices.length !== 5) throw new Error(`${spec.id}: expected 5 context choices`);
  if (spec.cloze.length !== 5) throw new Error(`${spec.id}: expected 5 cloze tasks`);
  if (spec.writing.length !== 3) throw new Error(`${spec.id}: expected 3 writing tasks`);
  for (const item of spec.choices) {
    if (!item.options.includes(item.answer)) throw new Error(`${spec.id}: context answer missing from options`);
    if (new Set(item.options).size !== item.options.length) throw new Error(`${spec.id}: duplicate context option`);
  }
}

export function createFrenchPrimaryTopic(spec: FrenchPrimaryTopicSpec): Topic {
  ensureSpec(spec);
  const exercises: Exercise[] = [];
  const frenchValues = spec.vocabulary.map((item) => item.fr);
  const germanValues = spec.vocabulary.map((item) => item.de);

  // 1–10: recognition from German to French (A1.1 foundations).
  spec.vocabulary.forEach((item, index) => {
    exercises.push({
      id: `${spec.id}-vfr-${index + 1}`,
      type: "multiple-choice",
      difficulty: 1,
      free: index < 3,
      question: `Comment dit-on «${item.de}» en français ?`,
      answer: item.fr,
      options: rotateOptions(frenchValues, index),
      hints: [`Le mot recherché signifie «${item.de}».`, `Écoute les sons du mot «${item.fr}».`],
      emoji: item.emoji,
    });
  });

  // 11–20: active recall from French to German.
  spec.vocabulary.forEach((item, index) => {
    exercises.push({
      id: `${spec.id}-vde-${index + 1}`,
      type: "multiple-choice",
      difficulty: 2,
      question: `Que veut dire «${item.fr}» en allemand ?`,
      answer: item.de,
      options: rotateOptions(germanValues, index),
      hints: [`Cherche le mot appris dans le thème «${spec.title}».`, `«${item.fr}» signifie «${item.de}».`],
      emoji: item.emoji,
    });
  });

  // 21–28: genuine French listening; the stimulus stays hidden.
  spec.vocabulary.slice(0, 8).forEach((item, index) => {
    exercises.push({
      id: `${spec.id}-listen-${index + 1}`,
      type: "multiple-choice",
      difficulty: index < 4 ? 1 : 2,
      question: "Écoute le mot. Que veut-il dire en allemand ?",
      listeningText: item.fr,
      listeningLanguage: "fr",
      answer: item.de,
      options: rotateOptions(germanValues, index),
      hints: ["Écoute une deuxième fois et fais attention au début du mot.", `Le mot entendu est «${item.fr}».`],
      emoji: "🎧",
    });
  });

  // 29–34: richer interaction formats.
  exercises.push({
    id: `${spec.id}-match-1`, type: "matching", difficulty: 2,
    question: "Relie chaque mot français à sa traduction allemande.", answer: "all",
    pairs: matchingPairs(spec.vocabulary, 0),
    hints: ["Commence par le mot que tu reconnais immédiatement.", "Chaque mot n'a qu'une traduction dans cette activité."],
  });
  exercises.push({
    id: `${spec.id}-match-2`, type: "matching", difficulty: 2,
    question: "Relie les quatre autres mots français à leur traduction.", answer: "all",
    pairs: matchingPairs(spec.vocabulary, 4),
    hints: ["Lis tous les mots avant de choisir.", "Utilise les images et les mots déjà rencontrés."],
  });
  exercises.push({
    id: `${spec.id}-memory`, type: "memory", difficulty: 2,
    question: "Trouve les paires français–allemand.", answer: "all",
    pairs: matchingPairs(spec.vocabulary, 2),
    hints: ["Mémorise la position des cartes.", "Une paire contient toujours un mot français et sa traduction."],
  });

  const categoryItems = spec.vocabulary.map((item, index) => ({
    id: `cat-${index + 1}`,
    label: item.fr,
    emoji: item.emoji,
  }));
  exercises.push({
    id: `${spec.id}-sort-theme`, type: "drag-drop", difficulty: 2,
    question: "Classe les mots dans la bonne catégorie.", answer: "all",
    dragItems: categoryItems,
    dropZones: [
      { id: "category-0", label: spec.categoryLabels[0] },
      { id: "category-1", label: spec.categoryLabels[1] },
    ],
    dropAnswers: Object.fromEntries(categoryItems.map((item, index) => [item.id, `category-${spec.categoryAssignments[index]}`])),
    hints: ["Dis chaque mot à voix basse et cherche son sens.", "Toutes les cartes doivent être placées."],
  });

  const languageItems = spec.vocabulary.slice(0, 4).flatMap((item, index) => [
    { id: `lang-fr-${index}`, label: item.fr, emoji: item.emoji },
    { id: `lang-de-${index}`, label: item.de, emoji: item.emoji },
  ]);
  exercises.push({
    id: `${spec.id}-sort-language`, type: "drag-drop", difficulty: 2,
    question: "Trie les mots : français ou allemand ?", answer: "all",
    dragItems: languageItems,
    dropZones: [{ id: "fr", label: "🇫🇷 Français" }, { id: "de", label: "🇨🇭 Allemand" }],
    dropAnswers: Object.fromEntries(languageItems.map((item) => [item.id, item.id.startsWith("lang-fr") ? "fr" : "de"])),
    hints: ["Cherche les accents et les formes françaises.", "Compare les deux langues."],
  });

  const searchWords = spec.vocabulary
    .map((item) => normaliseSearchWord(item.fr))
    .filter((word, index, all) => word.length >= 2 && word.length <= 8 && all.indexOf(word) === index)
    .slice(0, 6);
  exercises.push({
    id: `${spec.id}-words`, type: "word-search", difficulty: 1,
    question: `Trouve six mots du thème «${spec.title}».`, answer: "all",
    wordList: searchWords, gridSize: 9,
    hints: ["Les mots sont écrits de gauche à droite.", "Cherche d'abord la première lettre."],
  });

  // 35–44: comprehension and supported language production.
  spec.choices.forEach((item, index) => {
    exercises.push({
      id: `${spec.id}-context-${index + 1}`,
      type: "multiple-choice", difficulty: 3,
      question: item.question, answer: item.answer, options: item.options,
      hints: [item.hint, "Relis toute la phrase avant de répondre."],
    });
  });
  spec.cloze.forEach((item, index) => {
    const forgivingAlternatives = new Set(item.altAnswers ?? []);
    const withoutAccents = accentlessAnswer(item.answer);
    if (withoutAccents !== item.answer) forgivingAlternatives.add(withoutAccents);
    exercises.push({
      id: `${spec.id}-cloze-${index + 1}`,
      type: "fill-in-blank", difficulty: 3,
      question: item.question,
      answer: item.answer,
      ...(forgivingAlternatives.size ? { altAnswers: [...forgivingAlternatives] } : {}),
      hints: [item.hint, "Lis la phrase complète avec ta réponse."],
    });
  });

  // 45–47: LP21 learning, listening and reading strategies.
  exercises.push({
    id: `${spec.id}-strategy-1`, type: "multiple-choice", difficulty: 2,
    question: `Tu découvres un texte sur «${spec.title}». Quelle stratégie aide d'abord ?`,
    answer: "Regarder le titre et les images, puis chercher les mots connus.",
    options: [
      "Regarder le titre et les images, puis chercher les mots connus.",
      "Traduire immédiatement chaque lettre.",
      "Ignorer tous les mots connus.",
      "Lire uniquement la dernière ligne.",
    ],
    hints: ["Lehrplan 21: Nutze Bilder, Titel und bekannte Wörter.", "Commence par ce que tu comprends déjà."],
  });
  exercises.push({
    id: `${spec.id}-strategy-2`, type: "multiple-choice", difficulty: 3,
    question: `Tu ne comprends pas un court audio sur «${spec.title}». Que fais-tu ?`,
    answer: "Je réécoute et je cherche les mots, les nombres et l'intonation connus.",
    options: [
      "Je réécoute et je cherche les mots, les nombres et l'intonation connus.",
      "Je choisis au hasard sans réécouter.",
      "Je regarde seulement l'orthographe.",
      "J'abandonne après le premier mot.",
    ],
    hints: ["Réécouter est une stratégie importante.", "Les mots connus donnent le thème général."],
  });
  exercises.push({
    id: `${spec.id}-strategy-3`, type: "multiple-choice", difficulty: 3,
    question: `Comment mémoriser durablement les mots de «${spec.title}» ?`,
    answer: "Les revoir plusieurs fois dans des phrases, avec une image et à voix haute.",
    options: [
      "Les revoir plusieurs fois dans des phrases, avec une image et à voix haute.",
      "Les lire une seule fois très vite.",
      "Apprendre uniquement leur première lettre.",
      "Éviter de les utiliser dans une phrase.",
    ],
    hints: ["Mehrere Lernwege helfen: sehen, hören, sprechen und anwenden.", "Une phrase donne du contexte au mot."],
  });

  // 48–50: supported open writing, reviewed by the child against a model.
  spec.writing.forEach((item, index) => {
    exercises.push({
      id: `${spec.id}-write-${index + 1}`,
      type: "self-review", difficulty: 3,
      question: item.question, answer: item.example,
      hints: ["Utilise les modèles et les mots du thème.", "Relis ton texte lentement."],
      reviewCriteria: item.criteria,
    });
  });

  if (exercises.length !== 50) throw new Error(`${spec.id}: generated ${exercises.length} exercises instead of 50`);
  return { id: spec.id, title: spec.title, emoji: spec.emoji, exercises, curriculumCodes: [...spec.curriculumCodes] };
}

export function createFrenchPrimaryTopics(specs: readonly FrenchPrimaryTopicSpec[]): Topic[] {
  const ids = new Set<string>();
  return specs.map((spec) => {
    if (ids.has(spec.id)) throw new Error(`Duplicate French topic id: ${spec.id}`);
    ids.add(spec.id);
    return createFrenchPrimaryTopic(spec);
  });
}
