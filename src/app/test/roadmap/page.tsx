"use client";

import { useState } from "react";
import ProgressMapClient from "@/components/ProgressMapClient";

export default function RoadmapTestPage() {
  const [progressLevel, setProgressLevel] = useState(0);

  // Simulate different completion levels
  const scenarios = [
    {
      label: "🕳️ No Progress",
      completed: { 1: 0, 2: 0, 3: 0 },
      total: { 1: 15, 2: 20, 3: 15 },
    },
    {
      label: "🥉 Level 1 Complete (5%)",
      completed: { 1: 15, 2: 0, 3: 0 },
      total: { 1: 15, 2: 20, 3: 15 },
    },
    {
      label: "🥈 Level 2 Complete (37%)",
      completed: { 1: 15, 2: 20, 3: 0 },
      total: { 1: 15, 2: 20, 3: 15 },
    },
    {
      label: "🥇 Level 3 Complete (100%)",
      completed: { 1: 15, 2: 20, 3: 15 },
      total: { 1: 15, 2: 20, 3: 15 },
    },
  ];

  const scenario = scenarios[progressLevel];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🎓 Roadmap Test Page</h1>
        <p className="text-gray-600 mb-8">Test Cleverli emergence animations by selecting a progress level</p>

        {/* Progress Level Buttons */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-md border border-green-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Select Progress Level:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {scenarios.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setProgressLevel(idx)}
                className={`p-4 rounded-xl font-bold transition-all ${
                  progressLevel === idx
                    ? "bg-green-700 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Current: <span className="font-bold">{scenario.label}</span>
          </p>
        </div>

        {/* Roadmap Component */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
          <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
            <h2 className="text-2xl font-bold text-gray-800">Zahlen 1–10</h2>
            <p className="text-sm text-gray-600 mt-1">Klasse 1 · Mathematik</p>
          </div>

          {/* Roadmap Progress Map */}
          <div className="p-6">
            <ProgressMapClient
              topicId="zahlen-1-10"
              topicTitle="Zahlen 1–10"
              grade={1}
              subject="math"
              completedExercisesByDifficulty={scenario.completed}
              totalExercisesByDifficulty={scenario.total}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-green-100">
          <h3 className="font-bold text-gray-800 mb-4">🎬 What You Should See:</h3>
          <ul className="space-y-3 text-gray-700">
            <li>
              <strong>No Progress:</strong> Three empty holes (erdloch-transparent) on the landscape
            </li>
            <li>
              <strong>Level 1 (5%):</strong> Cleverli pops up from LEFT hole with 🥉 bronze coin (animation 0.8s)
            </li>
            <li>
              <strong>Level 2 (37%):</strong> Cleverli appears in CENTER hole with 🥈 silver coin
            </li>
            <li>
              <strong>Level 3 (100%):</strong> Cleverli appears in RIGHT hole with 🥇 gold coin
            </li>
          </ul>
        </div>

        {/* Debug Info */}
        <div className="mt-6 bg-gray-900 text-gray-100 rounded-xl p-4 font-mono text-xs overflow-auto">
          <p className="font-bold mb-2">📊 Progress State:</p>
          <p>Level 1: {scenario.completed[1]}/{scenario.total[1]} completed</p>
          <p>Level 2: {scenario.completed[2]}/{scenario.total[2]} completed</p>
          <p>Level 3: {scenario.completed[3]}/{scenario.total[3]} completed</p>
          <p className="mt-2">
            Total: {scenario.completed[1] + scenario.completed[2] + scenario.completed[3]}/
            {scenario.total[1] + scenario.total[2] + scenario.total[3]}
          </p>
        </div>
      </div>
    </div>
  );
}
