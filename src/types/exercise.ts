export type ExerciseType = "multiple-choice" | "fill-in-blank" | "counting" | "matching" | "memory" | "drag-drop" | "number-line" | "word-search";

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  answer: string;
  hints: string[];
  explanation?: string;
  difficulty: 1 | 2 | 3;
  emoji?: string;
  image?: string;           // main question illustration (path under /images/)
  optionImages?: string[];  // per-option images for visual multiple-choice
  mascot?: "wave" | "think" | "celebrate" | "run" | "sit-read" | "jump-star";
  pairs?: { id: string; label: string; image?: string; emoji?: string }[];       // memory
  dragItems?: { id: string; label: string; image?: string; emoji?: string }[];  // drag-drop
  dropZones?: { id: string; label: string }[];                                  // drag-drop
  dropAnswers?: Record<string, string>;                                          // drag-drop: zoneId→itemId
  numberMin?: number;   // number-line
  numberMax?: number;   // number-line
  numberStep?: number;  // number-line
  wordList?: string[];  // word-search
  gridSize?: number;    // word-search
  free?: boolean;
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
