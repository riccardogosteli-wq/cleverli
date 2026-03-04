/**
 * Answer map extracted from all exercise data files.
 * Provides helpers to pick correct/wrong answers for each exercise type.
 */
import { Exercise, Topic } from "../../src/types/exercise";
import {
  grade1Math, grade1German, grade1Science,
  grade2Math, grade2German, grade2Science,
  grade3Math, grade3German, grade3Science,
  grade4Math, grade4German, grade4Science,
  grade5Math, grade5German, grade5Science,
  grade6Math, grade6German, grade6Science,
} from "../../src/data/index";

export interface ExerciseAnswer {
  grade: number;
  subject: string;
  topicId: string;
  exerciseId: string;
  type: string;
  correctAnswer: string;
  wrongAnswer?: string;
  dropAnswers?: Record<string, string>;  // drag-drop: itemId → zoneId
  pairs?: string[];                       // memory: pair ids
  wordList?: string[];                    // word-search
  options?: string[];
}

const ALL_DATA: { grade: number; subject: string; topics: Topic[] }[] = [
  { grade: 1, subject: "math",    topics: grade1Math },
  { grade: 1, subject: "german",  topics: grade1German },
  { grade: 1, subject: "science", topics: grade1Science },
  { grade: 2, subject: "math",    topics: grade2Math },
  { grade: 2, subject: "german",  topics: grade2German },
  { grade: 2, subject: "science", topics: grade2Science },
  { grade: 3, subject: "math",    topics: grade3Math },
  { grade: 3, subject: "german",  topics: grade3German },
  { grade: 3, subject: "science", topics: grade3Science },
  { grade: 4, subject: "math",    topics: grade4Math },
  { grade: 4, subject: "german",  topics: grade4German },
  { grade: 4, subject: "science", topics: grade4Science },
  { grade: 5, subject: "math",    topics: grade5Math },
  { grade: 5, subject: "german",  topics: grade5German },
  { grade: 5, subject: "science", topics: grade5Science },
  { grade: 6, subject: "math",    topics: grade6Math },
  { grade: 6, subject: "german",  topics: grade6German },
  { grade: 6, subject: "science", topics: grade6Science },
];

/** Pick a wrong answer from options (any option that isn't the correct one) */
function pickWrong(ex: Exercise): string | undefined {
  if (!ex.options || ex.options.length < 2) return undefined;
  return ex.options.find(o => o !== ex.answer);
}

/** Build the full answer map for all exercises */
export function buildAnswerMap(): ExerciseAnswer[] {
  const answers: ExerciseAnswer[] = [];

  for (const { grade, subject, topics } of ALL_DATA) {
    for (const topic of topics) {
      for (const ex of topic.exercises) {
        answers.push({
          grade,
          subject,
          topicId: topic.id,
          exerciseId: ex.id,
          type: ex.type,
          correctAnswer: ex.answer,
          wrongAnswer: pickWrong(ex),
          dropAnswers: ex.dropAnswers,
          pairs: ex.pairs?.map(p => p.id),
          wordList: ex.wordList,
          options: ex.options,
        });
      }
    }
  }

  return answers;
}

/** Get topics for a grade+subject */
export function getTopics(grade: number, subject: string): Topic[] {
  return ALL_DATA.find(d => d.grade === grade && d.subject === subject)?.topics ?? [];
}

/** Get all unique grade+subject+topic combos */
export function getAllTopicPaths(): { grade: number; subject: string; topicId: string; topicTitle: string }[] {
  const paths: { grade: number; subject: string; topicId: string; topicTitle: string }[] = [];
  for (const { grade, subject, topics } of ALL_DATA) {
    for (const topic of topics) {
      paths.push({ grade, subject, topicId: topic.id, topicTitle: topic.title });
    }
  }
  return paths;
}

/** Get first N free exercises for a topic (for paywall testing) */
export function getFreeExercises(grade: number, subject: string, topicId: string, limit = 5): Exercise[] {
  const topics = getTopics(grade, subject);
  const topic = topics.find(t => t.id === topicId);
  return topic?.exercises.filter(e => e.free).slice(0, limit) ?? [];
}

/** Summary stats */
export function getStats() {
  const all = buildAnswerMap();
  const byType: Record<string, number> = {};
  for (const a of all) byType[a.type] = (byType[a.type] ?? 0) + 1;
  return {
    total: all.length,
    topics: getAllTopicPaths().length,
    byType,
  };
}
