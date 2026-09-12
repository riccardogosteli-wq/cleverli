// Exercise the actual visibility effect, including listener cleanup, without
// network calls, account writes or a DOM/React test dependency.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const source = fs.readFileSync('src/app/learn/[grade]/[subject]/[topic]/TopicSeoSections.tsx', 'utf8');
const start = source.indexOf('  useEffect(() => {');
const end = source.indexOf('\n  }, [grade, loaded, profile.totalExercises, subject, topic]);', start);
assert(start >= 0 && end > start, 'Locate the actual effect, not a copied implementation');
const body = source.slice(start + '  useEffect(() => {'.length, end);
const compiled = ts.transpileModule(`function setup(loaded, profile) { ${body}\n}`, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText;
let cases = 0;
function fixture() {
  const store = new Map(), listeners = new Map();
  const state = { visible: false, child: null, topic: 0, writes: 0, unreadable: false };
  const context = { topic: {}, grade: 1, subject: 'math',
    getActiveProfileId: () => state.child,
    getProfileStorageKey: child => `profile_${child ?? 'none'}`,
    getStoredTopicCompleted: () => state.topic,
    setShowSeoSections: value => { state.visible = value; },
    localStorage: { getItem: key => { if (state.unreadable) throw Error('Unavailable'); return store.get(key) ?? null; }, setItem: () => { state.writes++; throw Error('Read-only consumer'); } },
    window: { addEventListener: (name, fn) => { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); }, removeEventListener: (name, fn) => listeners.get(name)?.delete(fn) },
  };
  vm.createContext(context); vm.runInContext(compiled, context);
  return { state, store, listeners, setup: context.setup, fire: (name, detail = {}) => { for (const fn of listeners.get(name) ?? []) fn(detail); } };
}
for (const profile of [0, 2, 3, 8]) for (const anon of [0, 2, 3, 8]) for (const topic of [0, 2, 3, 8]) {
  const f = fixture(); f.state.topic = topic; f.store.set('cleverli_anon_exercises', String(anon)); f.store.set('profile_none', JSON.stringify({ totalExercises: profile }));
  const clean = f.setup(true, { totalExercises: profile });
  assert.equal(f.state.visible, Math.max(profile, anon, topic) < 3); clean();
  assert([...f.listeners.values()].every(set => set.size === 0)); assert.equal(f.state.writes, 0); cases++;
}
for (const event of ['cleverli-exercise-usage-update', 'cleverli-progress-update', 'cleverli-active-profile-change', 'cleverli-family-restored', 'pageshow', 'focus', 'storage']) {
  const f = fixture(); f.store.set('profile_none', JSON.stringify({ totalExercises: 2 })); f.store.set('cleverli_anon_exercises', '2'); const clean = f.setup(true, { totalExercises: 2 });
  f.store.set('cleverli_anon_exercises', '3'); f.fire(event, { key: 'cleverli_anon_exercises' }); assert.equal(f.state.visible, false);
  f.store.set('cleverli_anon_exercises', '0'); f.store.set('profile_none', JSON.stringify({ totalExercises: 0 })); f.fire(event, { key: 'cleverli_profile__anon' }); assert.equal(f.state.visible, true);
  // The old context may still say 2; the current child has 8, then a new child has 0.
  f.state.child = 'returning'; f.store.set('profile_returning', JSON.stringify({ totalExercises: 8 })); f.fire(event, { key: 'cleverli_active_profile__anon' }); assert.equal(f.state.visible, false);
  f.state.child = 'new'; f.fire(event, { key: 'cleverli_active_profile__anon' }); assert.equal(f.state.visible, true);
  clean(); assert([...f.listeners.values()].every(set => set.size === 0)); assert.equal(f.state.writes, 0); cases += 4;
}
{
  const f = fixture(); f.setup(false, { totalExercises: 0 }); assert.equal(f.state.visible, false); assert.equal(f.listeners.size, 0); cases++;
  f.store.set('profile_none', JSON.stringify({ totalExercises: 3 }));
  f.setup(true, { totalExercises: 3 }); assert.equal(f.state.visible, false); cases++;
  f.store.set('profile_none', JSON.stringify({ totalExercises: 0 }));
  f.setup(true, { totalExercises: 3 }); assert.equal(f.state.visible, true); cases++;
  f.state.unreadable = true; f.fire('focus'); assert.equal(f.state.visible, false); cases++;
  f.state.unreadable = false; f.store.set('profile_none', '{broken'); f.fire('focus'); assert.equal(f.state.visible, false); cases++;
}
assert.equal((source.match(/hidden=\{!showSeoSections\}/g) ?? []).length, 2);
assert(!source.includes('if (!showSeoSections) return null'));
assert(!source.includes('localStorage.setItem'));
const player = fs.readFileSync('src/components/ExercisePlayer.tsx', 'utf8');
assert(player.includes('window.dispatchEvent(new CustomEvent("cleverli-exercise-usage-update"))'));
console.log(`${cases} topic example visibility contracts passed, plus SSR/read-only/producer guards`);
