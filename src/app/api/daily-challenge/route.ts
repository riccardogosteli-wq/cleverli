import { NextRequest, NextResponse } from "next/server";

import { getDailyChallenge } from "@/lib/daily";
import { localizeExercise } from "@/lib/exerciseLocalization";
import type { Lang } from "@/lib/i18n";

const languages = new Set<Lang>(["de", "en", "fr", "it"]);

export async function GET(request: NextRequest) {
  const grade = Number(request.nextUrl.searchParams.get("grade"));
  const requestedLanguage = request.nextUrl.searchParams.get("lang") as Lang | null;
  const language = requestedLanguage && languages.has(requestedLanguage) ? requestedLanguage : "de";
  const requestedDate = request.nextUrl.searchParams.get("date") ?? "";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) ? requestedDate : undefined;
  if (!Number.isInteger(grade) || grade < 1 || grade > 6) {
    return NextResponse.json({ error: "invalid grade" }, { status: 400 });
  }

  const challenge = getDailyChallenge(grade, date);
  if (!challenge) return NextResponse.json(null);
  return NextResponse.json({
    ...challenge,
    exercise: localizeExercise(challenge.exercise, challenge.subject === "german" ? "de" : language),
    topic: {
      id: challenge.topic.id,
      title: challenge.topic.title,
      emoji: challenge.topic.emoji,
    },
  }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
