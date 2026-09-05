import { mkdirSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

type FeedbackRow = {
  id: string;
  liked: string | null;
  missing: string | null;
  issues: string | null;
  improvement_idea: string | null;
  created_at: string;
};

type Annotation = {
  reportStatus: string;
  reportedAt: string;
  reportReason: string;
  correctionMade: string;
  fixedAt: string;
  retestUrl: string;
};

const SITE_BASE = process.env.EXERCISE_QA_SITE_BASE ?? "https://www.cleverli.ch";
const OUTPUT = process.env.EXERCISE_QA_ANNOTATIONS_PATH ?? "/tmp/cleverli-exercise-issue-report-annotations.json";
const FIXED_AT = "2026-09-05";

const corrections: Record<string, string> = {
  z6: "Fixed German TTS so prose colons like «7: 7, ___» are not read as division.",
  t16: "Removed answer-revealing bear emoji/image cue; question now asks neutrally for the animal that hibernates.",
  g6sg1e: "Changed exact-definition fill-in to multiple choice with clear lake-focused distractors.",
  g6sg1f: "Disambiguated question to ask for the Jura as Swiss landscape region, not Kanton Jura.",
  g6sg1k: "Changed exact-definition fill-in to multiple choice about the Swiss Federal Supreme Court.",
  en6_2: "Changed exact-definition fill-in to multiple choice about fossil energy.",
  en6_4: "Changed exact-definition fill-in to multiple choice about climate change.",
  en6_6: "Changed exact-definition fill-in to multiple choice about solar cells turning light into electricity.",
  g6ka1c: "Added valid alternative answers including «Was wen» and reversed word order variants.",
  g6ka1e: "Changed exact Genitiv definition/example fill-in to multiple choice.",
  g6ka1k: "Changed exact Genitiv Plural free-text answer to multiple choice.",
  g6nz1g: "Fixed fill-in matching so comma-separated negative-number answers are accepted with or without spaces.",
  v23: "Fixed German TTS so doubling prompts with colon blanks are not read as division.",
  v24: "Fixed German TTS so doubling prompts with colon blanks are not read as division.",
  v26: "Fixed German TTS so doubling prompts with colon blanks are not read as division.",
  v27: "Fixed German TTS so doubling prompts with colon blanks are not read as division.",
  v29: "Fixed German TTS so doubling prompts with colon blanks are not read as division.",
  v31: "Fixed German TTS so doubling prompts with colon blanks are not read as division.",
  v33: "Fixed German TTS count-noun blanks so «___ Sticker» is read as «wie viele Sticker».",
  ew16: "Replaced verb/sound memory cards with animal noun/image cards only.",
  ew50: "Added «Obst» as accepted alternative answer for «Früchte».",
};

function parseExerciseId(value: string | null) {
  return value?.match(/Übung:\s*([^·]+)/)?.[1]?.trim() ?? "";
}

function parsePath(value: string | null) {
  return value?.match(/Pfad:\s*([^·]+)/)?.[1]?.trim() ?? "";
}

function parsePathParts(path: string) {
  const match = path.match(/^\/learn\/(\d+)\/([^/]+)\/([^/?#]+)/);
  if (!match) return null;
  return { grade: Number(match[1]), subject: match[2], topicId: match[3] };
}

function parseMissing(value: string | null) {
  const parts = (value ?? "").split("·").map(part => part.trim());
  const grade = Number(parts[0]?.match(/\d+/)?.[0] ?? "0");
  return { grade, subject: parts[1] ?? "", topicId: parts[2] ?? "" };
}

function cleanReason(row: FeedbackRow) {
  const issue = row.issues?.trim();
  const question = row.liked?.trim();
  if (issue && issue !== "Report ohne Notiz") {
    return question ? `${issue} | Frage: ${question}` : issue;
  }
  return question ? `Report ohne Notiz | Frage: ${question}` : "Report ohne Notiz";
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from("customer_feedback")
    .select("id,liked,missing,issues,improvement_idea,created_at")
    .eq("source", "exercise_issue_report")
    .order("created_at", { ascending: true });

  if (error) throw error;

  const annotations: Record<string, Annotation> = {};
  const rows = (data ?? []) as FeedbackRow[];

  for (const row of rows) {
    const exerciseId = parseExerciseId(row.improvement_idea);
    const path = parsePath(row.improvement_idea);
    const pathParts = parsePathParts(path);
    const fallback = parseMissing(row.missing);
    const grade = pathParts?.grade ?? fallback.grade;
    const subject = pathParts?.subject ?? fallback.subject;
    const topicId = pathParts?.topicId ?? fallback.topicId;
    if (!exerciseId || !grade || !subject || !topicId) continue;
    const retestPath = path || `/learn/${grade}/${subject}/${topicId}`;
    const key = `${grade}/${subject}/${topicId}/${exerciseId}`;
    const existing = annotations[key];
    const reason = cleanReason(row);
    const reportReason = existing?.reportReason
      ? Array.from(new Set([...existing.reportReason.split("\n"), reason])).join("\n")
      : reason;

    annotations[key] = {
      reportStatus: corrections[exerciseId] ? "fixed" : "reviewed",
      reportedAt: existing?.reportedAt ?? row.created_at,
      reportReason,
      correctionMade: corrections[exerciseId] ?? "Reviewed from Alexandra report; no catalogue correction mapped yet.",
      fixedAt: corrections[exerciseId] ? FIXED_AT : "",
      retestUrl: `${SITE_BASE}${retestPath}?exercise=${encodeURIComponent(exerciseId)}#exercise`,
    };
  }

  mkdirSync(OUTPUT.replace(/\/[^/]+$/, ""), { recursive: true });
  writeFileSync(OUTPUT, `${JSON.stringify(annotations, null, 2)}\n`);
  console.log(JSON.stringify({ reports: rows.length, annotatedExercises: Object.keys(annotations).length, output: OUTPUT }));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
