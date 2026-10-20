// Usage: node scripts/email-campaign-admin.cjs inspect|create|report manifest.json
// Uses existing service-role env. Never accepts recipient emails or capability tokens.
const fs=require('fs'),assert=require('assert/strict'),{createClient}=require('@supabase/supabase-js');
const [action,file]=process.argv.slice(2);if(!['inspect','create','report'].includes(action)||!file)throw Error('Usage: inspect|create|report manifest.json');
const m=JSON.parse(fs.readFileSync(file,'utf8'));assert.deepEqual(Object.keys(m).sort(),['campaign','id','links','mode','source']);
assert.match(m.id,/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);assert.match(m.campaign,/^[a-z][a-z0-9_]{0,79}$/);assert.match(m.source,/^[a-z][a-z0-9_]{0,47}$/);assert.ok(['draft','test','live'].includes(m.mode));
const targets=['home','teachers','worksheets','sample','personal','privacy','terms','signup','pricing'];assert.ok(m.links&&Object.keys(m.links).length>0&&Object.keys(m.links).length<=30);for(const [label,target] of Object.entries(m.links)){assert.match(label,/^[a-z][a-z0-9_]{0,47}$/);assert.ok(targets.includes(target));}
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
async function checked(q){const {data,error}=await q;if(error)throw Error('Database request failed: '+error.code);return data;}
(async()=>{let campaign=await checked(db.from('email_campaigns').select('*').eq('id',m.id).maybeSingle());
if(!campaign&&action==='create')campaign=(await checked(db.from('email_campaigns').insert({id:m.id,campaign:m.campaign,source:m.source,mode:'draft'}).select('*')))[0];
if(!campaign){console.log(JSON.stringify({exists:false}));return;}
assert.equal(campaign.campaign,m.campaign);assert.equal(campaign.source,m.source);
let links=await checked(db.from('email_campaign_links').select('label,target').eq('campaign_id',m.id));
for(const l of links)assert.equal(m.links[l.label],l.target,'Existing link mismatch; never overwrite sent definitions');
const missing=Object.entries(m.links).filter(([label])=>!links.some(l=>l.label===label));
if(action==='create'&&missing.length){assert.equal(campaign.mode,'draft');await checked(db.from('email_campaign_links').insert(missing.map(([label,target])=>({campaign_id:m.id,label,target}))));links=await checked(db.from('email_campaign_links').select('label,target').eq('campaign_id',m.id));}
if(action==='create'){assert.equal(links.length,Object.keys(m.links).length);if(campaign.mode==='draft'&&m.mode!=='draft')await checked(db.from('email_campaigns').update({mode:m.mode}).eq('id',m.id).eq('mode','draft'));else assert.equal(campaign.mode,m.mode);}
campaign=await checked(db.from('email_campaigns').select('id,campaign,source,mode').eq('id',m.id).single());
const out={at:new Date().toISOString(),campaign,links,complete:links.length===Object.keys(m.links).length};
if(action==='report'){let from=0,all=[];for(;;){const page=await checked(db.from('email_campaign_clicks').select('label,bucket,requests').eq('campaign_id',m.id).order('label').order('bucket').range(from,from+999));all.push(...page);if(page.length<1000)break;from+=1000;}out.requestsByLabel={};for(const r of all)out.requestsByLabel[r.label]=(out.requestsByLabel[r.label]||0)+Number(r.requests);out.limitation='GET requests including repeats/scanners; not unique people. Test campaign separate.';}
console.log(JSON.stringify(out,null,2));})().catch(e=>{console.error(e.message);process.exitCode=1});
