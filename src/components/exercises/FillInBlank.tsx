"use client";
import { useState } from "react";

interface Props {
  question: string;
  answer: string;
  onAnswer: (correct: boolean) => void;
}

export default function FillInBlank({ question, answer, onAnswer }: Props) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleSubmit = () => {
    if (!value.trim() || submitted) return;
    const isCorrect = value.trim().toLowerCase() === answer.toLowerCase();
    setCorrect(isCorrect);
    setSubmitted(true);
    setTimeout(() => onAnswer(isCorrect), 1000);
  };

  return (
    <div className="space-y-4">
      <p className="text-xl font-semibold text-gray-800 text-center">{question}</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          disabled={submitted}
          placeholder="Deine Antwort..."
          className={`flex-1 border-2 rounded-2xl px-4 py-3 text-lg outline-none transition-colors ${
            submitted
              ? correct ? "border-green-400 bg-green-50 text-green-800" : "border-red-400 bg-red-50 text-red-800"
              : "border-gray-200 focus:border-green-400"
          }`}
        />
        <button
          onClick={handleSubmit}
          disabled={submitted || !value.trim()}
          className="bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-green-700 disabled:opacity-40 transition-colors"
        >
          ✓
        </button>
      </div>
      {submitted && !correct && (
        <p className="text-center text-green-700 font-medium">Richtige Antwort: <span className="font-bold">{answer}</span></p>
      )}
    </div>
  );
}
