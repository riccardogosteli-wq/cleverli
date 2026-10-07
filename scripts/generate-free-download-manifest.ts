import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { worksheetLandingPages } from '../src/lib/worksheetLandingPages';
const resources = worksheetLandingPages.flatMap(page => (['worksheet','solution'] as const).map(type => {
 const href = type === 'worksheet' ? page.worksheetHref : page.solutionHref;
 const file = href.split('/').at(-1)!.replace(/\.pdf$/, '');
 const bytes = fs.readFileSync('public' + href);
 return { file, topic_id: 'free-' + page.slug, title: page.topic, grade: page.grade, subject: page.subject === 'Deutsch' ? 'german' : 'math', file_type: type, file_sha256: createHash('sha256').update(bytes).digest('hex'), file_bytes: bytes.length };
}));
if (resources.length !== 12) throw Error('Expected twelve approved public PDF resources');
fs.writeFileSync('src/lib/worksheets/free-manifest.json', JSON.stringify(resources, null, 2) + '\n');
console.log('12 approved public PDF resources');
