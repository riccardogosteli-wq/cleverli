import grade1Math from "./grade1/math";
import grade1German from "./grade1/german";
import grade1Science from "./grade1/science";
import grade2Math from "./grade2/math";
import grade2German from "./grade2/german";
import grade2Science from "./grade2/science";
import grade3Math from "./grade3/math";
import grade3German from "./grade3/german";
import grade3Science from "./grade3/science";
import grade3English from "./grade3/english";
import grade4Math from "./grade4/math";
import grade4German from "./grade4/german";
import grade4NT from "./grade4/nt";
import grade4RZG from "./grade4/rzg";
import grade4English from "./grade4/english";
import grade5Math from "./grade5/math";
import grade5German from "./grade5/german";
import grade5NT from "./grade5/nt";
import grade5RZG from "./grade5/rzg";
import grade5French from "./grade5/french";
import grade5English from "./grade5/english";
import grade6Math from "./grade6/math";
import grade6German from "./grade6/german";
import grade6NT from "./grade6/nt";
import grade6RZG from "./grade6/rzg";
import grade6French from "./grade6/french";
import grade6English from "./grade6/english";
import { Topic } from "@/types/exercise";

export {
  grade1Math, grade1German, grade1Science,
  grade2Math, grade2German, grade2Science,
  grade3Math, grade3German, grade3Science, grade3English,
  grade4Math, grade4German, grade4NT, grade4RZG, grade4English,
  grade5Math, grade5German, grade5NT, grade5RZG, grade5French, grade5English,
  grade6Math, grade6German, grade6NT, grade6RZG, grade6French, grade6English,
};

export function getTopics(grade: number, subject: string): Topic[] {
  const map: Record<string, Topic[]> = {
    "1-math": grade1Math, "1-german": grade1German, "1-science": grade1Science,
    "2-math": grade2Math, "2-german": grade2German, "2-science": grade2Science,
    "3-math": grade3Math, "3-german": grade3German, "3-science": grade3Science,
    "3-english": grade3English,
    "4-math": grade4Math, "4-german": grade4German, "4-nt": grade4NT,
    "4-rzg": grade4RZG, "4-english": grade4English,
    "5-math": grade5Math, "5-german": grade5German, "5-nt": grade5NT,
    "5-rzg": grade5RZG, "5-french": grade5French, "5-english": grade5English,
    "6-math": grade6Math, "6-german": grade6German, "6-nt": grade6NT,
    "6-rzg": grade6RZG, "6-french": grade6French, "6-english": grade6English,
  };
  return map[`${grade}-${subject}`] ?? [];
}

/** Grade-aware subject list — LP21 correct structure */
export function getSubjects(grade: number) {
  if (grade <= 2) {
    return [
      { id: "math",    emoji: "🔢", color: "bg-blue-50 border-blue-300 text-blue-700" },
      { id: "german",  emoji: "📖", color: "bg-yellow-50 border-yellow-300 text-yellow-700" },
      { id: "science", emoji: "🌍", color: "bg-green-50 border-green-300 text-green-800" },
    ];
  }
  if (grade === 3) {
    return [
      { id: "math",    emoji: "🔢", color: "bg-blue-50 border-blue-300 text-blue-700" },
      { id: "german",  emoji: "📖", color: "bg-yellow-50 border-yellow-300 text-yellow-700" },
      { id: "science", emoji: "🌍", color: "bg-green-50 border-green-300 text-green-800" },
      { id: "english", emoji: "🇬🇧", color: "bg-red-50 border-red-300 text-red-700" },
    ];
  }
  if (grade === 4) {
    return [
      { id: "math",    emoji: "🔢", color: "bg-blue-50 border-blue-300 text-blue-700" },
      { id: "german",  emoji: "📖", color: "bg-yellow-50 border-yellow-300 text-yellow-700" },
      { id: "nt",      emoji: "🔬", color: "bg-green-50 border-green-300 text-green-800" },
      { id: "rzg",     emoji: "🗺️", color: "bg-orange-50 border-orange-300 text-orange-700" },
      { id: "english", emoji: "🇬🇧", color: "bg-red-50 border-red-300 text-red-700" },
    ];
  }
  // grades 5-6
  return [
    { id: "math",    emoji: "🔢", color: "bg-blue-50 border-blue-300 text-blue-700" },
    { id: "german",  emoji: "📖", color: "bg-yellow-50 border-yellow-300 text-yellow-700" },
    { id: "nt",      emoji: "🔬", color: "bg-green-50 border-green-300 text-green-800" },
    { id: "rzg",     emoji: "🗺️", color: "bg-orange-50 border-orange-300 text-orange-700" },
    { id: "french",  emoji: "🇫🇷", color: "bg-purple-50 border-purple-300 text-purple-700" },
    { id: "english", emoji: "🇬🇧", color: "bg-red-50 border-red-300 text-red-700" },
  ];
}

/** @deprecated use getSubjects(grade) */
export const SUBJECTS = [
  { id: "math",    emoji: "🔢", color: "bg-blue-50 border-blue-300 text-blue-700" },
  { id: "german",  emoji: "📖", color: "bg-yellow-50 border-yellow-300 text-yellow-700" },
  { id: "science", emoji: "🌍", color: "bg-green-50 border-green-300 text-green-800" },
];

export const GRADES = [1, 2, 3, 4, 5, 6];

export function getTopicsForSubject(grade: number, subject: string): Topic[] {
  return getTopics(grade, subject);
}
