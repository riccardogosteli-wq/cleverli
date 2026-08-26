"use client";

import { useState } from "react";

import { useLang } from "@/lib/LangContext";

interface Props {
  question: string;
  exampleAnswer: string;
  criteria: string[];
  onAnswer: (correct: boolean) => void;
}

export default function SelfReview({ question, exampleAnswer, criteria, onAnswer }: Props) {
  const { tr } = useLang();
  const [value, setValue] = useState("");
  const [reviewing, setReviewing] = useState(false);

  if (reviewing) {
    return (
      <div className="space-y-4">
        <p className="text-lg sm:text-xl font-semibold text-gray-800 text-center leading-snug px-1">{question}</p>
        <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-700">{tr("yourAnswer")}</p>
          <p className="whitespace-pre-wrap text-sm font-semibold text-gray-800">{value}</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-green-700">{tr("exampleAnswer")}</p>
          <p className="text-sm text-gray-700">{exampleAnswer}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="mb-3 text-sm font-bold text-gray-800">{tr("selfReviewChecklist")}</p>
          <ul className="space-y-2">
            {criteria.map((criterion) => (
              <li key={criterion} className="flex gap-2 text-sm text-gray-700">
                <span aria-hidden="true">✓</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setReviewing(false)}
            className="rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 font-bold text-gray-700 hover:bg-gray-50"
          >
            {tr("improveAnswer")}
          </button>
          <button
            type="button"
            onClick={() => onAnswer(true)}
            className="rounded-2xl bg-green-700 px-4 py-3 font-bold text-white hover:bg-green-800"
          >
            {tr("answerFits")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-lg sm:text-xl font-semibold text-gray-800 text-center leading-snug px-1">{question}</p>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={tr("writeYourAnswer")}
        rows={5}
        className="w-full resize-y rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-base font-medium text-gray-900 outline-none transition focus:border-green-400"
      />
      <p className="text-center text-xs text-gray-500">{tr("selfReviewNote")}</p>
      <button
        type="button"
        onClick={() => setReviewing(true)}
        disabled={!value.trim()}
        className="w-full rounded-2xl bg-green-700 py-4 text-lg font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {tr("reviewAnswer")}
      </button>
    </div>
  );
}
