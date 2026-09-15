const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function load(file, mocks = {}) {
  const m = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  new Function('require', 'module', 'exports', code)(name => name in mocks ? mocks[name] : require(name), m, m.exports);
  return m.exports;
}
const faq = load('src/lib/homepageFaq.ts');
const { t } = load('src/lib/i18n.ts');
let checks = 0;
const check = (name, fn) => { fn(); checks++; console.log('PASS', name); };
function render(lang) {
  const tr = key => t[lang][key] ?? t.de[key] ?? key;
  const Home = load('src/app/HomeClient.tsx', {
    'next/image': { __esModule: true, default: () => null }, 'next/link': { __esModule: true, default: ({ children, href }) => React.createElement('a', { href }, children) },
    '@/lib/LangContext': { useLang: () => ({ lang, tr }) },
    '@/hooks/useSession': { useSession: () => ({ session: null, loaded: true, isPremium: false }) },
    '@/lib/checkoutClient': { startCheckout: () => { throw Error('No checkout in FAQ QA'); } },
    '@/components/LifetimeFounderOffer': { __esModule: true, default: () => null },
    '@/data/topicCatalog': { getCatalogSubjects: () => [], getTopicSummaries: () => [] },
    '@/lib/seoContent': { getLocalizedSubjectName: x => x },
    '@/lib/homepageFaq': faq,
  }).default;
  return renderToStaticMarkup(React.createElement(Home));
}
for (const lang of ['de', 'fr', 'it', 'en']) {
  const items = faq.getHomepageFaq(k => t[lang][k] ?? t.de[k] ?? k);
  check(lang + ' exact five source Q/A, order and uniqueness', () => {
    assert.equal(items.length, 5); assert.equal(new Set(items.map(x => x.question)).size, 5);
    items.forEach((item, i) => assert.deepEqual(item, { question: t[lang]['faqQ' + (i + 1)], answer: t[lang]['faqA' + (i + 1)] }));
  });
  const schema = JSON.parse(faq.serializeHomepageFaq(items));
  check(lang + ' valid schema and exact strings', () => {
    assert.equal(schema['@context'], 'https://schema.org'); assert.equal(schema['@type'], 'FAQPage');
    assert.equal(schema['@id'], 'https://www.cleverli.ch/#faq');
    assert.deepEqual(schema.mainEntity, items.map(x => ({ '@type': 'Question', name: x.question, acceptedAnswer: { '@type': 'Answer', text: x.answer } })));
  });
  check(lang + ' SSR contains single schema and preserves closed accordion semantics', () => {
    const html = render(lang);
    assert.equal((html.match(/id="homepage-faq-schema"/g) || []).length, 1);
    const block = html.match(/<script id="homepage-faq-schema" type="application\/ld\+json">(.*?)<\/script>/s);
    assert.deepEqual(JSON.parse(block[1]), schema);
    assert.equal((html.match(/aria-expanded="false"/g) || []).length, 5);
    assert.equal((html.match(/aria-controls="faq-answer-\d"/g) || []).length, 5);
    assert.equal((html.match(/id="faq-answer-\d"/g) || []).length, 0);
    for (const item of items) assert.ok(html.includes(renderToStaticMarkup(React.createElement('span', null, item.question))));
  });
}
check('fallback uses same translation contract', () => assert.deepEqual(faq.getHomepageFaq(k => t.missing?.[k] ?? t.de[k] ?? k), faq.getHomepageFaq(k => t.de[k])));
for (const text of ['</script><script>alert("x")</script>', '<!-- & > " \\ \n\r\t', 'Grösse, français, italiano 🐿️', '\u2028\u2029']) {
  check('safe JSON roundtrip ' + JSON.stringify(text), () => {
    const items = [{ question: text, answer: text }];
    const json = faq.serializeHomepageFaq(items);
    assert.ok(!/[<>&\u2028\u2029]/.test(json));
    assert.deepEqual(JSON.parse(json), faq.homepageFaqSchema(items));
  });
}
check('homepage is sole schema consumer, layout graph untouched', () => {
  const files = [];
  function walk(dir) { for (const d of fs.readdirSync(dir, { withFileTypes: true })) { const f = path.join(dir, d.name); if (d.isDirectory()) walk(f); else if (/\.tsx?$/.test(f)) files.push(f); } }
  walk('src');
  assert.deepEqual(files.filter(f => f !== 'src/lib/homepageFaq.ts' && fs.readFileSync(f, 'utf8').includes('serializeHomepageFaq')), ['src/app/HomeClient.tsx']);
  assert.ok(!fs.readFileSync('src/components/StructuredData.tsx', 'utf8').includes('FAQPage'));
  assert.ok(!fs.readFileSync('src/app/layout.tsx', 'utf8').includes('homepageFaq'));
});
console.log(`${checks} deterministic homepage FAQ checks passed; no network, audio or submissions.`);
