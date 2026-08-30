import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const voiceSource = fs.readFileSync(path.join(root, "src/hooks/useVoice.ts"), "utf8");
const i18nSource = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8");
const source = `${voiceSource}\n${i18nSource}`;

const bannedGermanPhrases = [
  "Fast! Versuch nochmal",
  "Fast! Du schaffst das!",
  "Nicht ganz, aber probier nochmal.",
  "Mmh, schau dir den Tipp an!",
  "Das war knapp! Weiter versuchen.",
  "Kopf hoch! Beim nächsten klappt's.",
  'almostPerfect: "Fast perfekt!"',
  'reviewBtnLabel: "🔄 Nochmal üben ({n})"',
];

const requiredGermanPhrases = [
  'wrong: "Noch nicht richtig 💪"',
  'wrongFeedback: "Noch nicht richtig – schau dir die Lösung an"',
  'understoodContinue: "Verstanden – weiter →"',
  'almostPerfect: "Diese Aufgaben schauen wir nochmals an"',
  'reviewBtnLabel: "🔄 Nochmals üben ({n})"',
  "Kein Problem – aus Fehlern lernst du.",
  "Jetzt kennst du die richtige Lösung. Weiter geht's!",
];

const failures: string[] = [];

for (const phrase of bannedGermanPhrases) {
  if (source.includes(phrase)) failures.push(`Problematische Fehlermeldung gefunden: ${phrase}`);
}

for (const phrase of requiredGermanPhrases) {
  if (!source.includes(phrase)) failures.push(`Erwartete Fehlermeldung fehlt: ${phrase}`);
}

const phraseBlock = voiceSource.match(/const PHRASES:[\s\S]*?\n};/)?.[0] ?? "";
const wrongCount = phraseBlock.match(/wrong: \[([\s\S]*?)\n  ],\n  streak:/)?.[1].match(/^\s+"/gm)?.length ?? 0;

if (wrongCount < 8) failures.push(`Zu wenig Fehlermeldungsvarianten: ${wrongCount}`);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Fehlermeldungen QA bestanden: ${wrongCount} Sprachvarianten und konsistente UI-Texte.`);
