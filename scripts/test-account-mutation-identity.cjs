/* eslint-disable @typescript-eslint/no-require-imports -- Deterministic actual-component hook harness. */
const { test } = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm'), ts = require('typescript');
function harness() {
  const slots = [], effects = []; let cursor = 0, tree, userId = 'account-A', pendingPost, dirty = false;
  const state = init => { const i = cursor++; if (!(i in slots)) slots[i] = typeof init === 'function' ? init() : init; return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; dirty = true; }]; };
  const effect = (fn, deps) => { const i = cursor++; const old = slots[i]; if (!old || deps.some((v,j) => v !== old.deps[j])) { slots[i] = { deps, cleanup: old?.cleanup }; effects.push(() => { slots[i].cleanup?.(); slots[i].cleanup = fn(); }); } };
  const react = { useState: state, useRef: value => { const i = cursor++; if (!(i in slots)) slots[i] = { current: value }; return slots[i]; }, useEffect: effect, useLayoutEffect: effect };
  const active = { state:'active', endAt:'2099-01-01T00:00:00.000Z', accessActive:true, canCancel:true };
  const mockSession = () => ({ userId, email: userId+'@example.invalid', name: userId, premium:true, premiumPlan:'monthly' });
  const mocks = {
    react, 'next/navigation': { useRouter: () => ({ push() {} }) }, 'next/link': { default:'a', __esModule:true },
    '@/hooks/useSession': { useSession: () => ({ session:mockSession(), loaded:true, isTeacher:false, isPremium:true }) },
    '@/lib/LangContext': { useLang: () => ({ lang:'de' }) }, '@/lib/accountScopedStorage': { clearLocalFamilyStateOnLogout() {} },
    '@/components/ParentPinGate': { default:'section', __esModule:true }, '@/components/AccountBillingStatus': { default:'billing-status', __esModule:true },
    '@/lib/supabase': { getSupabase: () => ({ auth: { getSession:async()=>({data:{session:{user:{id:userId},access_token:'offline-fixture'}}}) } }) },
  };
  const mod = {exports:{}};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/account/AccountClient.tsx','utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}}).outputText,
    {module:mod,exports:mod.exports,require:name=>name in mocks?mocks[name]:require(name),window:{addEventListener(){},removeEventListener(){}},fetch:async(_url,options)=>{
      if(options?.method==='POST')return new Promise((resolve,reject)=>{pendingPost={resolve,reject,body:JSON.parse(options.body)};});
      return{ok:true,json:async()=>({billing:active})};
    },setTimeout,console});
  function render() { for(let n=0;n<8;n++){ dirty=false;cursor=0;tree=mod.exports.default();while(effects.length)effects.shift()();if(!dirty)break; } return tree; }
  async function settle() { for(let n=0;n<8;n++){ await new Promise(setImmediate); render(); } }
  function nodes(node=tree,out=[]) { if(Array.isArray(node)){node.forEach(n=>nodes(n,out));return out;} if(!node||typeof node!=='object')return out;out.push(node);nodes(node.props?.children ?? null,out);return out; }
  function text(node) { if(Array.isArray(node))return node.map(text).join('');if(node==null||typeof node==='boolean')return'';if(typeof node==='object')return text(node.props?.children);return String(node); }
  function button(label) { const b=nodes().find(n=>n.type==='button'&&text(n)===label);assert.ok(b,`Missing ${label}; current: ${text(tree)}`);return b; }
  return { render,settle,button,textarea:()=>nodes().find(n=>n.type==='textarea'),text:()=>text(tree),switch:async id=>{userId=id;render();await settle();},post:()=>pendingPost,
    start:async retention=>{render();await settle();button('Abonnement kündigen').props.onClick();render();if(retention){button('Zu teuer').props.onClick();render();}const promise=button(retention?'CHF 66/Jahr sichern':'Kündigung abschliessen').props.onClick();await settle();assert.ok(pendingPost);return{promise};} };
}
for(const retention of [false,true]) for(const outcome of ['success','error','network']) test(`${retention?'retention':'cancellation'} ignores stale ${outcome} from account A after switching to B`,async()=>{
 const h=harness(),{promise}=await h.start(retention);assert.equal(h.post().body.userId,'account-A');await h.switch('account-B');
 if(outcome==='network')h.post().reject(Error('old request failed'));else h.post().resolve({ok:outcome==='success',json:async()=>outcome==='success'?{ok:true,billing:{state:'cancelled',canCancel:false,accessActive:true,endAt:'2099-01-01T00:00:00.000Z'}}:{error:'old failure'}});
 await promise;await h.settle();h.button('Abonnement kündigen');assert.ok(!h.text().includes('CHF 66/Jahr gesichert'));assert.ok(!h.text().includes('Änderung konnte nicht bestätigt'));
});
test('A to B to A does not revive the original cancellation completion',async()=>{const h=harness(),{promise}=await h.start(false);await h.switch('account-B');await h.switch('account-A');h.post().resolve({ok:true,json:async()=>({ok:true,billing:{state:'cancelled',canCancel:false}})});await promise;await h.settle();h.button('Abonnement kündigen');});
test('identity change resets reason, comment and confirmation flow',async()=>{const h=harness();h.render();await h.settle();h.button('Abonnement kündigen').props.onClick();h.render();h.button('Zu teuer').props.onClick();h.render();assert.ok(h.text().includes('Bleib für CHF 66/Jahr'));h.textarea().props.onChange({target:{value:'Account A private comment'}});h.render();await h.switch('account-B');h.button('Abonnement kündigen').props.onClick();h.render();assert.ok(!h.text().includes('Bleib für CHF 66/Jahr'));h.button('Zu teuer').props.onClick();h.render();assert.equal(h.textarea().props.value,'');});
