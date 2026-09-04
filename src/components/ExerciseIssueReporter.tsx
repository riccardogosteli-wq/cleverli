"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { canReportExerciseIssue } from "@/lib/exerciseIssueReports";
import type { Session } from "@/hooks/useSession";

type Props = {
  session: Session | null;
  grade: number;
  subject: string;
  topicId: string;
  topicTitle: string;
  exerciseId?: string | null;
  exerciseType?: string | null;
  question?: string | null;
  childId?: string | null;
  context?: "exercise" | "topic_complete" | "review";
};

type Status = "idle" | "sending" | "sent" | "error";

function trim(value: string, max = 1200) {
  return value.trim().slice(0, max);
}

export default function ExerciseIssueReporter({
  session,
  grade,
  subject,
  topicId,
  topicTitle,
  exerciseId,
  exerciseType,
  question,
  childId,
  context = "exercise",
}: Props) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  if (!canReportExerciseIssue(session)) return null;

  const submit = async () => {
    if (status === "sending") return;
    setStatus("sending");
    try {
      const supabase = getSupabase();
      const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
      const accessToken = data.session?.access_token;
      if (!accessToken) throw new Error("missing_session");

      const res = await fetch("/api/exercise-issue-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          grade,
          subject,
          topicId,
          topicTitle,
          exerciseId,
          exerciseType,
          question,
          childId,
          context,
          note: trim(note),
          path: window.location.pathname,
        }),
      });
      if (!res.ok) throw new Error("report_failed");
      setStatus("sent");
      setNote("");
      window.setTimeout(() => {
        setOpen(false);
        setStatus("idle");
      }, 900);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="border-t border-gray-100 pt-3">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-4 text-sm font-bold text-amber-800 hover:bg-amber-100 active:scale-95"
        >
          Problem melden
        </button>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <label className="text-sm font-bold text-amber-900" htmlFor={`exercise-issue-note-${exerciseId ?? topicId}`}>
            Kurze Notiz, falls nötig
          </label>
          <textarea
            id={`exercise-issue-note-${exerciseId ?? topicId}`}
            value={note}
            onChange={(event) => setNote(event.target.value.slice(0, 1200))}
            rows={3}
            placeholder="Optional: Was ist dir aufgefallen?"
            className="mt-2 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-amber-500"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={status === "sending" || status === "sent"}
              className="min-h-10 rounded-full bg-amber-600 px-4 text-sm font-bold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300"
            >
              {status === "sending" ? "Sende..." : status === "sent" ? "Gesendet" : "Report senden"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setStatus("idle");
              }}
              className="min-h-10 rounded-full border border-gray-200 bg-white px-4 text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              Abbrechen
            </button>
          </div>
          {status === "error" && (
            <p className="mt-2 text-sm font-semibold text-red-700">Konnte nicht gespeichert werden. Bitte nochmals versuchen.</p>
          )}
        </div>
      )}
    </div>
  );
}
