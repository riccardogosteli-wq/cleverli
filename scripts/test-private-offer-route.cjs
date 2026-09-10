const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const source=fs.readFileSync('src/app/offer/personal/route.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const {NextRequest,NextResponse}=require('next/server');
let lookups=0,checkout=0;
const modules={exports:{}};
class OfferError extends Error{constructor(code){super(code);this.code=code;}}
vm.runInNewContext(code,{module:modules,exports:modules.exports,TextDecoder,Buffer,URL,Date,JSON,
  require:n=> n==='node:crypto'?require(n):n==='next/server'?{NextResponse}:n==='@/lib/privateOffer'?{
    OfferError,tokenHash:t=>/^[a-f0-9]{64}$/.test(t)?'fake-hash':null,checkoutOffer:async()=>{checkout++;return 'https://checkout.stripe.com/fake-test-only';}
  }:n==='@/lib/privateOfferServer'?{privateOfferServices:()=>({store:{byHash:async()=>{lookups++;return {id:'fake-offer'};}},gateway:{}})}:(()=>{throw Error(n);})()
});
const origin='http://localhost:3315';
function request(body,headers={}){return new NextRequest(origin+'/offer/personal',{method:'POST',headers:{origin,'content-type':'application/json',...headers},body});}
(async()=>{let checks=0;
const page=modules.exports.GET();assert.equal(page.status,200);assert.equal(page.headers.get('referrer-policy'),'no-referrer');assert.match(page.headers.get('content-security-policy'),/default-src 'none'/);checks+=3;
const html=await page.text();assert.ok(!/googletagmanager|posthog|facebook|sentry/i.test(html));assert.ok(html.includes('history.replaceState'));checks+=2;
assert.equal((await modules.exports.POST(request('{}',{origin:'https://evil.example'}))).status,403);checks++;
assert.equal((await modules.exports.POST(request('{}',{'content-type':'text/plain'}))).status,403);checks++;
assert.equal((await modules.exports.POST(request('x'.repeat(257)))).status,413);checks++;
assert.equal((await modules.exports.POST(request('{"token":"wrong"}'))).status,404);checks++;
assert.equal(lookups,0);checks++;
const valid=await modules.exports.POST(request(JSON.stringify({token:'a'.repeat(64)})));assert.equal(valid.status,200);assert.equal(checkout,1);assert.equal(lookups,1);checks+=3;
assert.equal(valid.headers.get('cache-control'),'no-store, private');checks++;
console.log(`Actual private offer route: ${checks} checks passed with mocked offer service; no production requests.`);
})().catch(e=>{console.error('Private offer route test failed:',e.message);process.exitCode=1;});
