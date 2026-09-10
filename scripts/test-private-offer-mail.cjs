const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');let passed=0;const cache={};function load(name){if(cache[name])return cache[name];const p='src/lib/'+name+'.ts';const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,{module,exports:module.exports,require:n=>n.startsWith('./')?load(n.slice(2)):require(n),process,URL,Date,console});return cache[name]=module.exports;}const mail=load('privateOfferMail'),template=load('privateOfferEmailTemplate').PRIVATE_OFFER_EMAIL_TEMPLATE;
function check(name,fn){fn();passed++;console.log('PASS',name);}
const token='a'.repeat(64),tracking='12345678-1234-1234-1234-123456789abc';const artifact=template.replace('__PRIVATE_OFFER_URL__',mail.LINKS.lifetime+'#'+token);
check('approved artifact capability extraction',()=>assert.equal(mail.extractCapability(artifact),token));
check('changed approved copy rejected',()=>assert.throws(()=>mail.extractCapability(artifact.replace('Liebe Slavica','Liebe andere Person'))));
check('missing capability rejected',()=>assert.throws(()=>mail.extractCapability(template)));
check('invalid capability rejected',()=>assert.throws(()=>mail.renderMail('bad',tracking)));
check('invalid tracking identifier rejected',()=>assert.throws(()=>mail.renderMail(token,'../bad')));
const html=mail.renderMail(token,tracking),links=[...html.matchAll(/href="([^"]+)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&')));
check('all five links tracked',()=>assert.equal(links.filter(u=>u.pathname.startsWith('/offer/click/')).length,5));
check('capability only in fragment',()=>{assert.equal(links.filter(u=>u.hash==='#'+token).length,1);for(const u of links)assert.ok(!(u.origin+u.pathname+u.search).includes(token));});
check('exact clean subject',()=>assert.equal(mail.SUBJECT,'Können wir dir bei Cleverli helfen?'));
check('fixed sender and sole recipient',()=>{assert.equal(mail.FROM,'Cleverli <hello@cleverli.ch>');assert.equal(mail.TO,'slavica.nevistic@hotmail.com');});
check('exact exclusive deadline',()=>assert.equal(mail.DEADLINE,Date.parse('2026-09-13T22:00:00Z')));
check('allowlist rejects arbitrary targets',()=>assert.equal(Object.hasOwn(mail.LINKS,'https://evil.example'),false));
check('template contains no real capability',()=>assert.ok(!/#[a-f0-9]{64}/.test(template)));
(async()=>{const old=process.env.VERCEL_ENV;process.env.VERCEL_ENV='preview';await assert.rejects(()=>mail.sendFixedMail(artifact),/production_send_disabled/);passed++;process.env.VERCEL_ENV='production';delete process.env.PRIVATE_OFFER_MAIL_SEND_ENABLED;await assert.rejects(()=>mail.sendFixedMail(artifact),/production_send_disabled/);passed++;if(old)process.env.VERCEL_ENV=old;else delete process.env.VERCEL_ENV;console.log(passed+' checks passed');})().catch(e=>{console.error(e.message);process.exitCode=1;});
