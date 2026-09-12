import assert from "node:assert/strict";
import fs from "node:fs";
import { DEFAULT_SOUND_PREFERENCES, parseSoundPreferences, readSoundPreferences, setSoundPreference, SOUND_COPY, SOUND_PREFERENCES_KEY } from "../src/lib/soundPreferences";
let checks = 0;
function check(actual: unknown, expected: unknown) { assert.deepEqual(actual, expected); checks++; }
check(DEFAULT_SOUND_PREFERENCES, { effects: false, autoRead: false });
for (const value of [null, "", "{", "null", "[]", '"true"', '{"effects":"true","autoRead":1}']) check(parseSoundPreferences(value), DEFAULT_SOUND_PREFERENCES);
check(readSoundPreferences(), DEFAULT_SOUND_PREFERENCES);
for (const effects of [false,true]) for (const autoRead of [false,true]) check(parseSoundPreferences(JSON.stringify({ effects, autoRead })), { effects, autoRead });
const store = new Map<string,string>();let events = 0;
Object.assign(globalThis, { window: { localStorage: { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => store.set(key,value) }, dispatchEvent: () => { events++; } } });
for (const effects of [false,true]) for (const autoRead of [false,true]) {
 setSoundPreference("effects", effects);setSoundPreference("autoRead",autoRead);
 check(readSoundPreferences(),{effects,autoRead});check(JSON.parse(store.get(SOUND_PREFERENCES_KEY)!),{effects,autoRead});
}
check(events,8);
Object.assign(window,{localStorage:{getItem:()=>{throw Error("denied")},setItem:()=>{throw Error("denied")}}});
setSoundPreference("effects",false);setSoundPreference("autoRead",true);check(readSoundPreferences(),{effects:false,autoRead:true});
for (const lang of ["de","fr","it","en"] as const) for (const key of ["title","effects","autoRead","note","on","off"] as const) check(Boolean(SOUND_COPY[lang][key]),true);
const sound=fs.readFileSync('src/hooks/useSound.ts','utf8');
check(sound.indexOf('if (!readSoundPreferences().effects) return;') < sound.indexOf('switch (sound)'),true);
for(const name of ['correct','wrong','streak','complete','hint','levelup','achievement','combo','perfect','chest'])check(sound.includes(`case "${name}"`),true);
const player=fs.readFileSync('src/components/ExercisePlayer.tsx','utf8');
check(player.includes('voiceOn'),false);check(player.includes('<EffectsToggle />'),true);check(player.includes('useAutomaticReading('),true);
check(player.includes('onClick={() => speak('),true);
check(player.includes('sourceCurrent.listeningLanguage ?? "de"'),true);
const voice=fs.readFileSync('src/hooks/useVoice.ts','utf8');check(voice.includes('if (automaticPlayback) cancelActiveVoice()'),true);
check(voice.includes('readSoundPreferences'),false);
const auto=fs.readFileSync('src/hooks/useAutomaticReading.ts','utf8');check(auto.includes('stopAutomaticVoice()'),true);check(auto.includes('clearTimeout(timer)'),true);
check(sound.includes('window.addEventListener("pointerdown", unlock'),true);
check(sound.includes('window.removeEventListener("pointerdown", unlock)'),true);
check(voice.includes('window.addEventListener("pointerdown", unlock'),true);
check(voice.includes('window.removeEventListener("pointerdown", unlock)'),true);
console.log(`${checks} sound preference contracts passed`);
