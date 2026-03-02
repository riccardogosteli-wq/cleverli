import grade1Math from "./grade1/math";
import grade1German from "./grade1/german";
import grade2Math from "./grade2/math";
import grade2German from "./grade2/german";
import grade3Math from "./grade3/math";
import grade3German from "./grade3/german";
import { Topic } from "@/types/exercise";

export { grade1Math, grade1German, grade2Math, grade2German, grade3Math, grade3German };

export function getTopics(grade: number, subject: string): Topic[] {
  const map: Record<string, Topic[]> = {
    "1-math": grade1Math, "1-german": grade1German,
    "2-math": grade2Math, "2-german": grade2German,
    "3-math": grade3Math, "3-german": grade3German,
  };
  return map[`${grade}-${subject}`] ?? [];
}


export const SUBJECTS = [
  { id: "math", name: "Mathematik", emoji: "🔢", color: "bg-blue-50 border-blue-300 text-blue-700" },
  { id: "german", name: "Deutsch", emoji: "📖", color: "bg-yellow-50 border-yellow-300 text-yellow-700" },
];

export const GRADES = [1, 2, 3];

export function getTopicsForSubject(grade: number, subject: string): Topic[] {
  return getTopics(grade, subject);
}
