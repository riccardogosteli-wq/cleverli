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
  free?: boolean; // first 3 per topic are free
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
