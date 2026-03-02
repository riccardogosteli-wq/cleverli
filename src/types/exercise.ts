export type ExerciseType = "multiple-choice" | "fill-in-blank" | "counting" | "matching";

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
  mascot?: "wave" | "think" | "celebrate" | "run" | "sit-read" | "jump-star"; // override mascot mood
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
