import { Exercise, Topic } from "@/types/exercise";

type Difficulty = 1 | 2 | 3;

type ExerciseFact = {
  question: string;
  answer: string;
  options: string[];
  fill: string;
  hint: string;
};

type FactSet = Record<Difficulty, ExerciseFact[]>;

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

    return {
      id: `${prefix}${number}`,
      type: "fill-in-blank",
      difficulty,
      question: fact.fill,
      answer: fact.answer,
      hints: [fact.hint, `Gesucht ist: ${fact.answer}.`],
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

