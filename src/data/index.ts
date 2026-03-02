import grade1Math from "./grade1/math";
import grade1German from "./grade1/german";
import grade1Science from "./grade1/science";
import grade2Math from "./grade2/math";
import grade2German from "./grade2/german";
import grade2Science from "./grade2/science";
import grade3Math from "./grade3/math";
import grade3German from "./grade3/german";
import grade3Science from "./grade3/science";
import { Topic } from "@/types/exercise";

export { grade1Math, grade1German, grade1Science, grade2Math, grade2German, grade2Science, grade3Math, grade3German, grade3Science };

export function getTopics(grade: number, subject: string): Topic[] {
  const map: Record<string, Topic[]> = {
    "1-math": grade1Math, "1-german": grade1German, "1-science": grade1Science,
    "2-math": grade2Math, "2-german": grade2German, "2-science": grade2Science,
    "3-math": grade3Math, "3-german": grade3German, "3-science": grade3Science,
  };
  return map[`${grade}-${subject}`] ?? [];
}


/** SUBJECTS — use tr(s.id) for display name ("math" / "german" keys exist in i18n) */
export const SUBJECTS = [
  { id: "math", emoji: "🔢", color: "bg-blue-50 border-blue-300 text-blue-700" },
  { id: "german", emoji: "📖", color: "bg-yellow-50 border-yellow-300 text-yellow-700" },
  { id: "science", emoji: "🌍", color: "bg-green-50 border-green-300 text-green-800" },
];

export const GRADES = [1, 2, 3];

export function getTopicsForSubject(grade: number, subject: string): Topic[] {
  return getTopics(grade, subject);
}
