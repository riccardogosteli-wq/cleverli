import { readFileSync, writeFileSync } from 'node:fs';
import { getLehrplanOverview } from '../src/lib/lehrplanOverview';
import { LEHRPLAN_LANGS } from '../src/lib/lehrplanCopy';
const path = 'src/data/lehrplanOverview.generated.json';
const source = JSON.stringify(Object.fromEntries(LEHRPLAN_LANGS.map(lang => [lang, getLehrplanOverview(lang)])))+'\n';
if(process.argv.includes('--check')) {
 if(readFileSync(path,'utf8')!==source) throw new Error('Lehrplan overview stale. Run npx tsx scripts/generate-lehrplan-overview.ts');
 console.log('Four-language Lehrplan catalogue matches current exercise data.');
} else { writeFileSync(path,source); console.log('Generated lightweight four-language Lehrplan catalogue.'); }
