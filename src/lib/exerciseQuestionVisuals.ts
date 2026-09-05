import type { ExerciseType } from "@/types/exercise";

const emojiPattern = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator})(?:\uFE0F|\uFE0E)?(?:\u200D(?:\p{Extended_Pictographic}|\p{Regional_Indicator})(?:\uFE0F|\uFE0E)?)*?/gu;
const singleEmojiPattern = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator})/u;

function emojiCount(text: string) {
  emojiPattern.lastIndex = 0;
  return [...text.matchAll(emojiPattern)].length;
}

function hasTallyEmoji(question: string) {
  emojiPattern.lastIndex = 0;
  for (const match of question.matchAll(emojiPattern)) {
    if (/^\s*\|/.test(question.slice((match.index ?? 0) + match[0].length))) return true;
  }
  return false;
}

function keepOnlyTallyEmojis(question: string) {
  emojiPattern.lastIndex = 0;
  return question.replace(emojiPattern, (emoji, offset: number, source: string) => (
    /^\s*\|/.test(source.slice(offset + emoji.length)) ? emoji : ""
  ));
}

/**
 * Question emojis are only kept when they are the learning material itself.
 * Interactive visuals (counting objects, answer images, cards) are stored in
 * their own exercise fields and must not be repeated as decorative prompt text.
 */
export function questionNeedsVisualEmoji(question: string, type: ExerciseType) {
  emojiPattern.lastIndex = 0;
  if (!emojiPattern.test(question) || type === "counting") return false;

  const normalized = question.toLowerCase();

  // Picture-recognition tasks have no separate image: the emoji is the prompt.
  if (/^(?:lernrunde \d+:\s*)?(?:was ist das|what is this|qu'est-ce que c'est|che cos'e)\?\s*[\p{Extended_Pictographic}\p{Regional_Indicator}]/iu.test(question)) {
    return true;
  }
  if (/(welches wort passt zu|which word matches|quel mot correspond|quale parola)/i.test(normalized)) return true;

  // Symbols in a sequence or a tally are data, not decoration.
  if (singleEmojiPattern.test(question) && hasTallyEmoji(question)) return true;
  if (emojiCount(question) >= 2 && /(?:muster|reihe|zähle|count|pattern|sequence)/i.test(normalized)) return true;
  if (emojiCount(question) >= 2 && /(?:wie viele|combien|quanti)/i.test(normalized) && /…/.test(question)) return true;
  if (emojiCount(question) >= 2 && /\p{Extended_Pictographic}[\s\p{Extended_Pictographic}]+___/u.test(question)) return true;

  return false;
}

export function getQuestionForDisplay(question: string, type: ExerciseType) {
  if (questionNeedsVisualEmoji(question, type)) {
    return hasTallyEmoji(question) ? keepOnlyTallyEmojis(question).replace(/\s{2,}/g, " ").trim() : question;
  }

  emojiPattern.lastIndex = 0;
  return question
    .replace(emojiPattern, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}
