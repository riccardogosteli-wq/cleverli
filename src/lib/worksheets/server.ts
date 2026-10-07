import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import catalogue from "./catalogue.json";
import { PRIVATE_HEADERS, worksheetAccess } from "./access";
import { teacherAccountActive } from "@/lib/teacherAccount";
import { recordWorksheetDownload } from "./downloadLedger";
export const WORKSHEET_BUCKET = "cleverli-worksheets-20260927";
export function worksheetError(status: number) {
  return Response.json({ error: status === 401 ? "Anmeldung erforderlich" : status === 403 ? "Premium erforderlich" : "Arbeitsblätter momentan nicht verfügbar" }, { status, headers: PRIVATE_HEADERS });
}
async function authorize(request: Request) {
  const match = /^Bearer ([^\s]+)$/i.exec(request.headers.get("authorization") ?? "");
  if (!match) return { response: worksheetError(401) };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { response: worksheetError(503) };
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await db.auth.getUser(match[1]);
  if (error || !data.user) return { response: worksheetError(401) };
  const [profile, teacher] = await Promise.all([
    db.from("parent_profiles").select("premium,premium_until").eq("id", data.user.id).maybeSingle(),
    db.from("teacher_accounts").select("user_id,school_name,active,valid_until").eq("user_id", data.user.id).maybeSingle(),
  ]);
  if (profile.error || teacher.error) return { response: worksheetError(503) };
  if (!worksheetAccess(profile.data, teacher.data)) return { response: worksheetError(403) };
  return { db, user: data.user, access: teacherAccountActive(teacher.data) ? "teacher" as const : "premium" as const };
}
export async function serveWorksheets(request: Request) {
  try {
    const auth = await authorize(request);
    if (auth.response) return auth.response;
    const params = new URL(request.url).searchParams;
    if (!params.size) return Response.json({ topics: catalogue.map(({ id, grade, subject, topicId, title, curriculum }) => ({ id, grade, subject, topicId, title, curriculum })) }, { headers: PRIVATE_HEADERS });
    if ([...params.keys()].some(k => !["id", "type"].includes(k)) || params.getAll("id").length !== 1 || params.getAll("type").length !== 1) return worksheetError(400);
    const type = params.get("type");
    const topic = catalogue.find(t => t.id === params.get("id"));
    if (!topic || (type !== "worksheet" && type !== "solution")) return worksheetError(404);
    // Object paths come exclusively from the reviewed manifest, never the request.
    const file = topic.files[type];
    const { data, error } = await auth.db!.storage.from(WORKSHEET_BUCKET).download(file.path);
    if (error || !data) return worksheetError(503);
    const bytes = Buffer.from(await data.arrayBuffer());
    if (bytes.length !== file.bytes || createHash("sha256").update(bytes).digest("hex") !== file.sha256) return worksheetError(503);
    await recordWorksheetDownload(request, { topic_id: topic.id, title: topic.title, grade: topic.grade, subject: topic.subject, file_type: type, file_sha256: file.sha256, file_bytes: bytes.length }, auth.access!, auth.user);
    return new Response(bytes, { headers: { ...PRIVATE_HEADERS, "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${topic.id}-${type === "worksheet" ? "Arbeitsblatt" : "Loesung"}.pdf"`, "Content-Length": String(bytes.length) } });
  } catch { return worksheetError(503); }
}
