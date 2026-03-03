import grade1Math from "./grade1/math";
import grade1German from "./grade1/german";
import grade1Science from "./grade1/science";
import grade2Math from "./grade2/math";
import grade2German from "./grade2/german";
import grade2Science from "./grade2/science";
import grade3Math from "./grade3/math";
import grade3German from "./grade3/german";
import grade3Science from "./grade3/science";
import grade4Math from "./grade4/math";
import grade4German from "./grade4/german";
import grade4Science from "./grade4/science";
import grade5Math from "./grade5/math";
import grade5German from "./grade5/german";
import grade5Science from "./grade5/science";
import grade6Math from "./grade6/math";
import grade6German from "./grade6/german";
import grade6Science from "./grade6/science";
import { Topic } from "@/types/exercise";

export {
  grade1Math, grade1German, grade1Science,
  grade2Math, grade2German, grade2Science,
  grade3Math, grade3German, grade3Science,
  grade4Math, grade4German, grade4Science,
  grade5Math, grade5German, grade5Science,
  grade6Math, grade6German, grade6Science,
};

export function getTopics(grade: number, subject: string): Topic[] {
  const map: Record<string, Topic[]> = {
    "1-math": grade1Math, "1-german": grade1German, "1-science": grade1Science,
    "2-math": grade2Math, "2-german": grade2German, "2-science": grade2Science,
    "3-math": grade3Math, "3-german": grade3German, "3-science": grade3Science,
    "4-math": grade4Math, "4-german": grade4German, "4-science": grade4Science,
    "5-math": grade5Math, "5-german": grade5German, "5-science": grade5Science,
    "6-math": grade6Math, "6-german": grade6German, "6-science": grade6Science,
  };
  return map[`${grade}-${subject}`] ?? [];
}

/** SUBJECTS — use tr(s.id) for display name ("math" / "german" keys exist in i18n) */
export const SUBJECTS = [
  { id: "math", emoji: "🔢", color: "bg-blue-50 border-blue-300 text-blue-700" },
  { id: "german", emoji: "📖", color: "bg-yellow-50 border-yellow-300 text-yellow-700" },
  { id: "science", emoji: "🌍", color: "bg-green-50 border-green-300 text-green-800" },
];

export const GRADES = [1, 2, 3, 4, 5, 6];

export function getTopicsForSubject(grade: number, subject: string): Topic[] {
  return getTopics(grade, subject);
}
