const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('node:assert/strict');
const code=ts.transpileModule(fs.readFileSync('src/lib/privateOfferServer.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
let payload,options;
class Stripe{constructor(){this.checkout={sessions:{create:async(p,o)=>{payload=p;options=o;return {...p,id:'fake-session',status:'open',url:'https://checkout.stripe.com/fake-test-only',amount_total:19900,currency:'chf',payment_status:'unpaid'};}}};}}
const moduleShim={exports:{}};
vm.runInNewContext(code,{module:moduleShim,exports:moduleShim.exports,process:{env:{}},require:n=>n==='stripe'?{default:Stripe}:n==='@supabase/supabase-js'?{createClient:()=>({})}:n==='./privateOffer'?{}:(()=>{throw Error(n);})()});
(async()=>{const offer={id:'fake-offer',user_id:'fake-user',customer_id:'cus_fake',amount:19900,currency:'chf',generation:3,session_expires:2000000000};
await moduleShim.exports.privateOfferServices().gateway.create(offer);
assert.equal(payload.mode,'payment');assert.equal(payload.customer,offer.customer_id);assert.deepEqual(Array.from(payload.payment_method_types),['card','twint']);
assert.equal(payload.line_items[0].price_data.unit_amount,19900);assert.equal(payload.line_items[0].price_data.currency,'chf');assert.equal(payload.line_items[0].quantity,1);
assert.equal(payload.metadata.userId,offer.user_id);assert.equal(payload.metadata.plan,'schooltime');assert.equal(payload.metadata.private_offer_id,offer.id);assert.equal(payload.expires_at,offer.session_expires);
assert.equal(options.idempotencyKey,'private-offer:fake-offer:3');assert.equal(payload.subscription_data,undefined);
console.log('Actual Stripe adapter: 12 payload checks passed with stubbed Stripe transport. No session created.');
})().catch(e=>{console.error('Adapter test failed:',e.message);process.exitCode=1;});
