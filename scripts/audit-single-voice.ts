import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const voice = fs.readFileSync(path.join(root, "src/hooks/useVoice.ts"), "utf8");
const route = fs.readFileSync(path.join(root, "src/app/api/tts/route.ts"), "utf8");
const failures: string[] = [];

for (const forbidden of ["speechSynthesis", "SpeechSynthesisUtterance", "speakWebSpeech", "preferWebSpeechUntil"]) {
  if (voice.includes(forbidden)) failures.push(`useVoice still contains robotic fallback token: ${forbidden}`);
}

for (const required of ["pendingAudio", "activeSource", "playbackGeneration", "cancelActiveVoice", "audio/mpeg"]) {
  if (!voice.includes(required)) failures.push(`useVoice is missing single-player guard: ${required}`);
}

if (!route.includes('status: 503')) failures.push("TTS provider failures must return 503");
if (route.includes('fallback: "web-speech"')) failures.push("TTS route still advertises Web Speech fallback");
if (!route.includes('const VOICE_ID = "vmVmHDKBkkCgbLVIOJRb"')) failures.push("Charlie Chatlin voice ID changed");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Single-voice audit passed: Charlie Chatlin only, shared playback, no robotic fallback.");
