import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "src/hooks/useVoice.ts",
  "src/components/ExercisePlayer.tsx",
  "src/components/StreakMilestone.tsx",
  "src/components/RewardUnlockedModal.tsx",
  "src/components/ProgressMapClient.tsx",
];

const source = files
  .map((file) => fs.readFileSync(path.join(root, file), "utf8"))
  .join("\n");

const bannedGermanPhrases = [
  "Du bist auf Feuer",
  "Du bist ein Mathegenie",
  "Du bist ein Superstar",
  "Du bist eine Legende",
  "Du bist ein echter Champion",
  "Ich bin stolz auf dich",
  "Du lernst so schnell",
  "Leicht-Level",
  "Mittel-Level",
  "sie werden so stolz sein",
];

const requiredPhrases = [
  "Richtig! Das hast du gut gelöst!",
  "Wunderbar! Du bleibst richtig gut dran!",
  "Du hast einen tollen Lauf! Fantastisch!",
  "Mehrere Aufgaben hintereinander richtig – klasse!",
  "Alle Aufgaben geschafft! Richtig starke Arbeit!",
  "Drei Tage am Stück – toll drangeblieben!",
  "Einen ganzen Monat drangeblieben – grossartig!",
  "Leichte Aufgaben geschafft! +20 XP",
  "Mittlere Aufgaben geschafft! +30 XP",
  "Die Cleverli-Goldmünze gehört dir! Stark gemacht!",
];

const failures: string[] = [];

for (const phrase of bannedGermanPhrases) {
  if (source.includes(phrase)) failures.push(`Veraltete Meldung gefunden: ${phrase}`);
}

const progressMapSource = fs.readFileSync(path.join(root, "src/components/ProgressMapClient.tsx"), "utf8");
for (const phrase of ["Cleverli Bronze-Münze", "Cleverli Silber-Münze", "Cleverli Gold-Münze"]) {
  if (progressMapSource.includes(phrase)) failures.push(`Veraltete Münzmeldung gefunden: ${phrase}`);
}

for (const phrase of requiredPhrases) {
  if (!source.includes(phrase)) failures.push(`Erwartete Meldung fehlt: ${phrase}`);
}

const voiceSource = fs.readFileSync(path.join(root, "src/hooks/useVoice.ts"), "utf8");
const phraseBlock = voiceSource.match(/const PHRASES:[\s\S]*?\n};/)?.[0] ?? "";
const correctCount = phraseBlock.match(/correct: \[([\s\S]*?)\n  ],\n  wrong:/)?.[1].match(/^\s+"/gm)?.length ?? 0;
const streakCount = phraseBlock.match(/streak: \[([\s\S]*?)\n  ],\n  complete:/)?.[1].match(/^\s+"/gm)?.length ?? 0;
const completeCount = phraseBlock.match(/complete: \[([\s\S]*?)\n  ],\n  hint:/)?.[1].match(/^\s+"/gm)?.length ?? 0;

if (correctCount < 10) failures.push(`Zu wenig direkte Erfolgsvarianten: ${correctCount}`);
if (streakCount < 6) failures.push(`Zu wenig Serienvarianten: ${streakCount}`);
if (completeCount < 8) failures.push(`Zu wenig Abschlussvarianten: ${completeCount}`);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Erfolgsmeldungen QA bestanden: ${correctCount} direkt, ${streakCount} Serie, ${completeCount} Abschluss.`);
