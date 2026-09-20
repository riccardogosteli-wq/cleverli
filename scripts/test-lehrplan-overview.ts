import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getLehrplanOverview, getLehrplanSchema } from '../src/lib/lehrplanOverview';
import { getSubjects, getTopics } from '../src/data/index';
import sitemap from '../src/app/sitemap';
const rows = getLehrplanOverview();
assert.equal(rows.length, 6);
const schema = getLehrplanSchema(rows);
const seen = new Set<string>();
let total = 0;
for (const row of rows) {
  assert.equal(row.cycle, row.grade <= 2 ? 1 : 2);
  assert.deepEqual(row.subjects.map(s => s.id), getSubjects(row.grade).map(s => s.id));
  for (const subject of row.subjects) {
    const source = getTopics(row.grade, subject.id);
    assert.equal(source.length, subject.topics.length);
    for (const topic of subject.topics) {
      assert(!seen.has(topic.url)); seen.add(topic.url);
      const original = source.find(t => t.id === topic.id)!;
      assert.equal(topic.title, original.title);
      assert.equal(topic.count, original.exercises.length);
      assert.deepEqual(topic.codes, original.curriculumCodes);
      assert(topic.codes.length > 0);
      const item = schema.mainEntity.itemListElement.find(e => e.item.url === topic.url)!.item;
      assert.equal(item.name, topic.title);
      assert.deepEqual(item.educationalAlignment.map(a => a.targetName), topic.codes);
      total += topic.count;
    }
  }
}
assert.equal(schema.mainEntity.numberOfItems, seen.size);
assert(total > 15000);
assert(!sitemap().some(r => r.url.includes('/lehrplanbezug')));
for (const path of ['public/llms.txt', 'src/components/Navigation.tsx', 'src/components/MobileBottomNav.tsx']) assert(!readFileSync(path, 'utf8').includes('/lehrplanbezug'));
const page = readFileSync('src/app/lehrplanbezug/page.tsx', 'utf8');
assert(page.includes('index: false, follow: false, googleBot: { index: false, follow: false }'));
assert(!/Prüfstatus|vorläufig|noch nicht geprüft|zertifiziert/.test(page));
assert(page.includes('prefetch={false}'));
console.log(`PASS: ${seen.size} unique topics, ${total} exercises, exact curriculum/schema parity, six grades, noindex and discovery exclusions`);

assert(!page.includes('id="main-content"'), "global layout owns skip-link target");
