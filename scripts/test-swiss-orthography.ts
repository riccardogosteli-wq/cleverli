import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { swissOrthography } from '../src/lib/swissOrthography';
import { getTopicTitle } from '../src/data/topicTitles';
import { TOPIC_CATALOG } from '../src/data/topicCatalog.generated';
const require = createRequire(import.meta.url);
const { inspect } = require('./audit-swiss-orthography.cjs');
const lower = String.fromCodePoint(223), upper = String.fromCodePoint(7838);
assert.equal(swissOrthography('Grü' + lower + 'e STRA' + upper + 'E'), 'Grüsse STRASSE');
assert.equal(swissOrthography('äöü ÄÖÜ français italiano'), 'äöü ÄÖÜ français italiano');
for (const [file, text] of [['a.ts', 'const x="Grü' + lower + 'e"'], ['a.json', '{"de":"Begrü' + lower + 'ung"}'], ['a.tsx', 'const x=<h1>Grü' + lower + 'e</h1>'], ['a.ts', 'const x="' + String.fromCharCode(92) + 'u00df"'], ['a.svg', '<text>&#223;</text>'], ['a.html', '&szlig;'], ['a.ts', 'const x=`A' + upper + '`']])
    assert.equal(inspect(file, text).length, 1, file);
assert.equal(inspect('a.ts', 'const x=/[' + lower + ']/; // ' + lower).length, 0);
assert.equal(inspect('a.ts', 'const x="Grüsse"').length, 0);
let titles = 0;
for (const topics of Object.values(TOPIC_CATALOG)) {
    for (const t of topics) {
        for (const lang of ['de', 'fr', 'it', 'en'] as const) {
            const title = getTopicTitle(t.id, lang, t.title);
            assert(!title.includes(lower) && !title.includes(upper));
            titles++;
        }
    }
}
assert.equal(getTopicTitle('greetings', 'de', 'Greetings & Introductions'), 'Begrüssung und Einführung');
console.log(JSON.stringify({ status: 'PASS', titleVariants: titles, regressionCases: 12 }));
