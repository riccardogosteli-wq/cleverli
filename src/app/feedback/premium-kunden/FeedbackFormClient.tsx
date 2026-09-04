"use client";

import { FormEvent, useMemo, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error" | "rate_limited";

const RATING_LABELS = [
  { value: 1, label: "1", text: "Schwierig" },
  { value: 2, label: "2", text: "Geht so" },
  { value: 3, label: "3", text: "Okay" },
  { value: 4, label: "4", text: "Gut" },
  { value: 5, label: "5", text: "Sehr gut" },
];

function sourceFromUrl() {
  if (typeof window === "undefined") return "premium_customer_feedback";
  return new URLSearchParams(window.location.search).get("source") || "premium_customer_feedback";
}

export default function FeedbackFormClient() {
  const [rating, setRating] = useState(0);
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const source = useMemo(sourceFromUrl, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setState("submitting");
    setMessage("");

    const payload = {
      email: formData.get("email"),
      rating,
      liked: formData.get("liked"),
      disliked: formData.get("disliked"),
      missing: formData.get("missing"),
      issues: formData.get("issues"),
      childReaction: formData.get("childReaction"),
      improvementIdea: formData.get("improvementIdea"),
      allowFollowup: formData.get("allowFollowup") === "on",
      website: formData.get("website"),
      source,
    };

    try {
      const res = await fetch("/api/feedback/premium-kunden", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 429) {
        setState("rate_limited");
        setMessage("Danke, deine Rückmeldung wurde bereits gerade gesendet.");
        return;
      }
      if (!res.ok) throw new Error("feedback_failed");

      setState("success");
      form.reset();
      setRating(0);
    } catch {
      setState("error");
      setMessage("Das hat leider nicht geklappt. Bitte probier es später nochmals.");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">✓</div>
        <h2 className="mt-4 text-2xl font-black text-gray-950">Danke für deine Rückmeldung.</h2>
        <p className="mt-3 text-gray-600">
          Das hilft uns sehr, Cleverli für Familien noch passender zu machen. Den Gratis-Monat ordnen wir anhand deines Cleverli-Kontos zu.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-green-100 bg-white p-5 shadow-sm sm:p-8">
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-gray-800">Deine E-Mail-Adresse</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="min-h-11 rounded-md border border-gray-300 px-4 py-3 text-base outline-none focus:border-green-600"
            placeholder="name@example.ch"
          />
        </label>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-bold text-gray-800">Wie zufrieden bist du aktuell mit Cleverli?</legend>
          <div className="grid grid-cols-5 gap-2">
            {RATING_LABELS.map(item => (
              <label
                key={item.value}
                className={`cursor-pointer rounded-lg border px-2 py-3 text-center transition ${
                  rating === item.value
                    ? "border-green-600 bg-green-50 text-green-800"
                    : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
                }`}
              >
                <input
                  type="radio"
                  name="rating"
                  value={item.value}
                  required
                  className="sr-only"
                  checked={rating === item.value}
                  onChange={() => setRating(item.value)}
                />
                <span className="block text-lg font-black">{item.label}</span>
                <span className="mt-1 block text-[11px] font-semibold leading-tight sm:text-xs">{item.text}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-gray-800">Was gefällt euch an Cleverli besonders?</span>
          <textarea name="liked" rows={3} className="rounded-md border border-gray-300 px-4 py-3 text-base outline-none focus:border-green-600" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-gray-800">Was gefällt euch weniger gut?</span>
          <textarea name="disliked" rows={3} className="rounded-md border border-gray-300 px-4 py-3 text-base outline-none focus:border-green-600" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-gray-800">Was fehlt euch noch?</span>
          <textarea
            name="missing"
            rows={3}
            className="rounded-md border border-gray-300 px-4 py-3 text-base outline-none focus:border-green-600"
            placeholder="Fächer, Themen, Funktionen, Auswertungen..."
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-gray-800">Gab es Probleme für dich oder dein Kind?</span>
          <textarea
            name="issues"
            rows={3}
            className="rounded-md border border-gray-300 px-4 py-3 text-base outline-none focus:border-green-600"
            placeholder="Zum Beispiel zu schwer, unklar, technisch holprig..."
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-gray-800">Wie reagiert dein Kind auf Cleverli?</span>
          <textarea name="childReaction" rows={3} className="rounded-md border border-gray-300 px-4 py-3 text-base outline-none focus:border-green-600" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-gray-800">Wenn du dir eine Sache wünschen könntest: was wäre es?</span>
          <textarea name="improvementIdea" rows={3} className="rounded-md border border-gray-300 px-4 py-3 text-base outline-none focus:border-green-600" />
        </label>

        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <div className="grid gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
          <p className="font-bold text-amber-950">Danke fürs Mitmachen</p>
          <p className="text-xs leading-relaxed text-amber-800">
            Alle teilnehmenden Premium-Familien erhalten 1 Monat Cleverli Premium gratis. Zusätzlich verlosen wir unter allen Antworten 3x je 3 Monate Premium gratis.
          </p>
        </div>

        <label className="flex gap-3 text-sm text-gray-700">
          <input name="allowFollowup" type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300 text-green-700" />
          <span>Cleverli darf mich bei Rückfragen zu meiner Rückmeldung per E-Mail kontaktieren.</span>
        </label>

        {message && (
          <p className={`rounded-md px-4 py-3 text-sm font-semibold ${state === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="min-h-12 rounded-md bg-green-700 px-5 py-3 text-base font-black text-white transition hover:bg-green-800 disabled:cursor-wait disabled:bg-gray-400"
        >
          {state === "submitting" ? "Wird gesendet..." : "Feedback senden"}
        </button>
      </div>
    </form>
  );
}
