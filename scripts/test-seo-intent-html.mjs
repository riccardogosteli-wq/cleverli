import fs from 'node:fs';
import assert from 'node:assert/strict';
const slugs = ['einmaleins-uebungen-2-klasse', 'mathe-uebungen-3-klasse', 'deutsch-uebungen-3-klasse'];
const ctas = ['/learn/2/math/einmaleins', '/learn/3/math/zahlen-bis-1000', '/learn/3/german/wortarten'];
let checks = 0;
for (const [i, slug] of slugs.entries()) {
  const html = fs.readFileSync(`.next/server/app/${slug}.html`, 'utf8');
  const main = html.match(/<main\b[^>]*>(.*?)<\/main>/s)[1];
  assert.equal((main.match(/<h1\b/g) || []).length, 1); checks++;
  assert.ok(html.includes(`<link rel="canonical" href="https://www.cleverli.ch/${slug}"`)); checks++;
  assert.ok(main.includes(`href="${ctas[i]}"`)); checks++;
  const questions = [...main.matchAll(/<p class="mt-2 text-sm leading-6 text-gray-800">(.*?)<\/p>/g)].map(m => m[1]);
  assert.equal(questions.length, 5); assert.equal(new Set(questions).size, 5); checks += 2;
  const faq = [...main.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(m => JSON.parse(m[1])).filter(s => s['@type'] === 'FAQPage');
  assert.equal(faq.length, i === 0 ? 1 : 0); checks++;
  if (i === 0) {
    assert.deepEqual(questions, ['2 × 3 = ?', '5 × 4 = ___', '10 × 7 = ?', '2 × 8 = ___', '5 × 6 = ?']); checks++;
    assert.ok(!main.includes('Was kommt nach 49')); checks++;
    assert.ok(!main.includes('/images/scenes/cleverli-math-ask.jpg')); checks++;
    assert.ok(main.includes('aria-label="2 Reihen mit je 3 Plättchen zeigen die Malaufgabe 2 mal 3."')); checks++;
    assert.equal((main.match(/rounded-full border-2 border-green-800 bg-green-600/g) || []).length, 6); checks++;
    assert.equal((main.match(/<summary\b/g) || []).length, 5); checks++;
    assert.equal((main.match(/<details\b/g) || []).length, 5); checks++;
    assert.equal((main.match(/<details[^>]* open/g) || []).length, 0); checks++;
    for (const q of faq[0].mainEntity) { assert.ok(main.includes(q.name)); assert.ok(main.includes(q.acceptedAnswer.text)); checks += 2; }
    for (const answer of ['2 × 3 = 6', '5 × 4 = 20', '10 × 7 = 70', '2 × 8 = 16', '5 × 6 = 30']) { assert.ok(main.includes(answer)); checks++; }
  } else {
    for (const text of ['Was vorher hilft', 'So geht es weiter', i === 1 ? '500 + 60 + 3 = ___' : 'Welche Wortart ist «Hund»?']) { assert.ok(main.includes(text)); checks++; }
    assert.equal((main.match(/underline underline-offset-4/g) || []).length, 3); checks++;
  }
}
console.log(`${checks} initial HTML intent, disclosure, FAQ and route assertions passed.`);
