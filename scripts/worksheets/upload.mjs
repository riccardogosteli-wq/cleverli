// Dry run by default. Production provisioning remains with the release owner.
// node scripts/worksheets/upload.mjs --root /approved/root [--apply --env /path/.env.vercel.production]
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
const arg = name => process.argv[process.argv.indexOf(name)+1];
const root = process.argv.includes('--root') ? path.resolve(arg('--root')) : null;
if (!root) throw Error('--root is required');
const catalogue = JSON.parse(fs.readFileSync(new URL('../../src/lib/worksheets/catalogue.json', import.meta.url)));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const files = catalogue.flatMap(t => Object.values(t.files));
if (catalogue.length !== 303 || files.length !== 606 || new Set(files.map(f=>f.path)).size!==606) throw Error('Invalid manifest');
for (const f of files) {
  const resolved=path.resolve(root,f.path);
  if(!resolved.startsWith(root+path.sep)) throw Error('Invalid manifest path');
  const bytes=fs.readFileSync(resolved);
  if(bytes.length!==f.bytes || hash(bytes)!==f.sha256 || bytes.length>=4800000) throw Error('Approved PDF integrity failed');
}
console.log(JSON.stringify({ mode: process.argv.includes('--apply')?'apply':'dry-run', topics:303, pdfs:606, bytes:files.reduce((n,f)=>n+f.bytes,0), bucket:'cleverli-worksheets-20260927', integrity:'verified' }));
if (process.argv.includes('--apply')) {
  if(!process.argv.includes('--env')) throw Error('--env protected runtime file required');
  process.loadEnvFile(path.resolve(arg('--env')));
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw Error('Protected runtime configuration unavailable');
  const pacedFetch=async (input,init) => {
    const response=await fetch(input,init);
    if(response.status===429) {
      const raw=response.headers.get('retry-after');
      const wait=raw ? (/^\d+(?:\.\d+)?$/.test(raw) ? Number(raw)*1000 : Date.parse(raw)-Date.now()) : 0;
      if(Number.isFinite(wait)&&wait>0)await new Promise(resolve=>setTimeout(resolve,wait));
    }
    return response;
  };
  const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:pacedFetch}}),bucket='cleverli-worksheets-20260927';
  const info=await db.storage.getBucket(bucket);
  if(info.error||!info.data||info.data.public!==false)throw Error('Apply and verify private storage migration first');
  let uploaded=0,existing=0;
  async function retry(operation) {
    for(let i=0;i<5;i++) {
      const result=await operation();
      if(!result.error)return result;
      if(![429,500,502,503,504].includes(Number(result.error.statusCode??result.error.status)))return result;
      await new Promise(r=>setTimeout(r,Math.min(30000,2000*2**i)));
    }
    throw Error('Storage temporarily unavailable; resume safely later');
  }
  for(const file of files) {
    const before=await retry(()=>db.storage.from(bucket).download(file.path));
    if(before.data) {
      if(hash(Buffer.from(await before.data.arrayBuffer()))!==file.sha256)throw Error('Existing object differs; refusing overwrite');
      existing++;
    } else {
      if(![400,404].includes(Number(before.error?.statusCode??before.error?.status)))throw Error('Storage read failed; refusing write');
      const result=await retry(()=>db.storage.from(bucket).upload(file.path,fs.readFileSync(path.join(root,file.path)),{contentType:'application/pdf',cacheControl:'0',upsert:false}));
      if(result.error)throw Error('Storage upload failed; no overwrite attempted');
      const readback=await retry(()=>db.storage.from(bucket).download(file.path));
      if(readback.error||!readback.data||hash(Buffer.from(await readback.data.arrayBuffer()))!==file.sha256)throw Error('Storage readback mismatch');
      uploaded++;
    }
    if((uploaded+existing)%25===0)console.log(JSON.stringify({verified:uploaded+existing,total:606}));
    await new Promise(r=>setTimeout(r,150));
  }
  console.log(JSON.stringify({verified:606,uploaded,existing,readback:'all SHA-256 match',public:false}));
}
