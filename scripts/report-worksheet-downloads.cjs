// Owner-only CLI. Never expose this service-role report through a public route.
const fs = require('node:fs');
const { parseEnv } = require('node:util');
const { createClient } = require('@supabase/supabase-js');
(async () => {
 const file = process.env.CLEVERLI_ENV_FILE || '.env.local';
 const env = { ...parseEnv(fs.readFileSync(file, 'utf8')), ...process.env };
 const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
 const since = process.argv[2] || '2026-10-07T00:00:00Z';
 if (!Number.isFinite(Date.parse(since))) throw Error('Invalid start date');
 const until = new Date().toISOString();
 const rows = [];
 for (let offset = 0; ; offset += 1000) {
  const { data, error } = await db.from('worksheet_download_events').select('*').gte('created_at', since).lte('created_at', until).order('created_at').order('id').range(offset, offset + 999);
  if (error) throw Error('Download report read failed');
  rows.push(...data); if (data.length < 1000) break;
 }
 const real = rows.filter(r => !r.is_qa && !r.is_automated);
 const ids = [...new Set(real.map(r => r.user_id).filter(Boolean))];
 const accounts = new Map();
 for (const id of ids) {
  const { data, error } = await db.auth.admin.getUserById(id);
  if (error) throw Error('Account attribution read failed');
  accounts.set(id, data.user?.email || '(deleted account)');
 }
 const counts = list => ({ worksheet: list.filter(r => r.file_type === 'worksheet').length, solution: list.filter(r => r.file_type === 'solution').length, total: list.length });
 console.log(JSON.stringify({ since, until, measure: 'successful PDF server responses, not confirmed saves or unique people', free: counts(real.filter(r => r.access_type === 'free')), premium: counts(real.filter(r => r.access_type === 'premium')), teacher: counts(real.filter(r => r.access_type === 'teacher')), qaExcluded: rows.filter(r => r.is_qa).length, automatedExcluded: rows.filter(r => !r.is_qa && r.is_automated).length, byAccount: ids.map(id => ({ userId: id, email: accounts.get(id), ...counts(real.filter(r => r.user_id === id)), topics: [...new Set(real.filter(r => r.user_id === id).map(r => r.title))], lastDownload: real.filter(r => r.user_id === id).at(-1).created_at })), byTopic: [...new Set(real.map(r => r.topic_id))].map(id => ({ topicId: id, title: real.find(r => r.topic_id === id).title, ...counts(real.filter(r => r.topic_id === id)) })) }, null, 2));
})().catch(() => { console.error('Worksheet report failed; check protected credentials/schema.'); process.exitCode = 1; });
