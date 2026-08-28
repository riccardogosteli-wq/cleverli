export type ExerciseType = "multiple-choice" | "fill-in-blank" | "self-review" | "counting" | "matching" | "memory" | "drag-drop" | "number-line" | "word-search";

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  questionEN?: string;
  questionFR?: string;
  questionIT?: string;
  listeningText?: string;  // hidden German audio stimulus for listening-comprehension tasks
  options?: string[];
  optionsEN?: string[];
  optionsFR?: string[];
  optionsIT?: string[];
  answer: string;
  altAnswers?: string[];
  altAnswersEN?: string[];
  altAnswersFR?: string[];
  altAnswersIT?: string[];
  answerEN?: string;
  answerFR?: string;
  answerIT?: string;
  hints: string[];
  hintsEN?: string[];
  hintsFR?: string[];
  hintsIT?: string[];
  reviewCriteria?: string[];
  reviewCriteriaEN?: string[];
  reviewCriteriaFR?: string[];
  reviewCriteriaIT?: string[];
  explanation?: string;
  difficulty: 1 | 2 | 3;
  emoji?: string;
  image?: string;           // main question illustration (path under /images/)
  optionImages?: string[];  // per-option images for visual multiple-choice
  optionEmojis?: string[];  // per-option visual symbols for early-reader multiple-choice
  mascot?: "wave" | "think" | "celebrate" | "run" | "sit-read" | "jump-star";
  pairs?: { id: string; label: string; image?: string; emoji?: string }[];       // memory
  pairsEN?: { id: string; label: string; image?: string; emoji?: string }[];
  pairsFR?: { id: string; label: string; image?: string; emoji?: string }[];
  pairsIT?: { id: string; label: string; image?: string; emoji?: string }[];
  dragItems?: { id: string; label: string; image?: string; emoji?: string }[];  // drag-drop
  dragItemsEN?: { id: string; label: string; image?: string; emoji?: string }[];
  dragItemsFR?: { id: string; label: string; image?: string; emoji?: string }[];
  dragItemsIT?: { id: string; label: string; image?: string; emoji?: string }[];
  dropZones?: { id: string; label: string }[];                                  // drag-drop
  dropZonesEN?: { id: string; label: string }[];
  dropZonesFR?: { id: string; label: string }[];
  dropZonesIT?: { id: string; label: string }[];
  dropAnswers?: Record<string, string>;                                          // drag-drop: zoneId→itemId
  numberMin?: number;   // number-line
  numberMax?: number;   // number-line
  numberStep?: number;  // number-line
  wordList?: string[];  // word-search
  wordListEN?: string[];
  wordListFR?: string[];
  wordListIT?: string[];
  gridSize?: number;    // word-search
  free?: boolean;
  preserveGermanContent?: boolean; // keep German learning text intact when the surrounding UI is localised
  completeLocalization?: boolean; // generated localisation covers every rendered exercise field
}

export interface Topic {
  id: string;
  title: string;
  emoji: string;
  exercises: Exercise[];
}

export interface Subject {
  id: string;
  name: string;
  grade: number;
  topics: Topic[];
}

export interface Progress {
  completed: number;
  score: number;
  stars: number;
  lastPlayed: string;
}
