import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import assert from "node:assert/strict";
import * as shop from "../src/lib/shop";
let checks = 0;
const same = (a: unknown, b: unknown) => { assert.deepEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b))); checks++; };
const source = fs.readFileSync("src/hooks/useProfile.ts", "utf8") + ";export {loadProfile as load};";
const js = ts.transpileModule(source, { compilerOptions: {module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020} }).outputText;
const db = new Map<string,string>();
let authenticated=false,cloudCalls=0;let imported:Fixture|undefined;
let active = "profile_A", states: unknown[], effects: (()=>void)[];
const pending: (()=>void)[] = [];
const handlers: Record<string, ((e: {key:string})=>void)[]> = {};
const initial = {xp:1234,totalExercises:100,totalTopicsComplete:0,achievements:[],coins:100,ownedItems:[],equippedItems:{},lastPlayedDate:"2026-11-11"};
const react = {
  useState: (value: unknown) => { const arr=states, i=arr.length; arr.push(value); return [value,(v: unknown)=>{arr[i]=typeof v === "function" ? v(arr[i]) : v;}]; },
  useEffect: (fn: ()=>void) => effects.push(fn), useCallback: (fn: unknown) => fn, useRef: (v:unknown) => ({current:v}),
};
type Fixture = typeof initial;
type Hook = {retryShopSync:()=>Promise<void>;updateProfile: (fn: (p: Fixture)=>Fixture)=>void};
const exports = {} as {useProfile:()=>Hook;load:()=>Fixture};
vm.runInNewContext(js, {exports, console, Date, navigator:{onLine:true,locks:{request:(_key:string,fn:()=>void)=>{pending.push(fn);return Promise.resolve();}}},localStorage:{getItem:(k:string)=>db.get(k)??null,setItem:(k:string,v:string)=>db.set(k,v)},window:{addEventListener:(e:string,fn:(e:{key:string})=>void)=>(handlers[e]??=[]).push(fn),removeEventListener:()=>{}},require:(p:string)=> p === "react" ? react : p.endsWith("/shop") ? shop : p.endsWith("/xp") ? {getLevelForXp:()=>({id:1}),getNextLevel:()=>null}:p.endsWith("/achievements")?{ACHIEVEMENTS:[]}:p.endsWith("/shopSync")?{synchronizeCloudShop:async(_id:string,_scope:string,p:Fixture)=>{cloudCalls++;imported=p;return {coins:0,ownedItems:[],equippedItem:null,revision:0,result:"synced"}},pendingShopCoins:()=>0,latestCloudShop:(_scope:string,_profile:Fixture,remote:unknown)=>remote}:p.endsWith("/family")?{getActiveProfileId:()=>authenticated?active:null}:p.endsWith("/accountScopedStorage")?{getProfileStorageKey:()=>active,getActiveProfileStorageKey:()=>"active",hasAuthenticatedStorageScope:()=>authenticated}:p.endsWith("/topicCatalog")?{CORE_SUBJECTS:[],getCatalogSubjects:()=>[],getTopicSummaries:()=>[]}: {} });
function flush(){while(pending.length)pending.shift()!();}
function mount(){states=[];effects=[];const hook=exports.useProfile(); const own=states;for(const e of effects)e();return {hook,states:own};}
async function main(){
for (const ownedItems of [{bad:true},"hat-wizard",5,null, ["hat-star",null,3,"future-purchase"]]) {
 db.set(active,JSON.stringify({...initial,ownedItems,equippedItems:{hat:"hat-star"}}));
 const loaded=exports.load(); same(loaded.xp,1234);same(loaded.coins,100);
 same(loaded.ownedItems, Array.isArray(ownedItems)?["hat-star","future-purchase"]:[]);
 const a=mount(); a.hook.updateProfile((p:Fixture)=>shop.buyShopItem(p,"acc-glasses"));flush();const saved=JSON.parse(db.get(active)!);same(saved.xp,1234);same(saved.coins,85);
}
db.set(active,JSON.stringify(initial));const a=mount(),b=mount();
a.hook.updateProfile((p:Fixture)=>shop.buyShopItem(p,"hat-wizard"));b.hook.updateProfile((p:Fixture)=>shop.buyShopItem(p,"hat-crown"));flush();
same(JSON.parse(db.get(active)!).coins,30);same(JSON.parse(db.get(active)!).ownedItems,["hat-wizard","hat-crown"]);
a.hook.updateProfile((p:Fixture)=>shop.buyShopItem(p,"hat-star"));b.hook.updateProfile((p:Fixture)=>shop.buyShopItem(p,"hat-star"));flush();same(JSON.parse(db.get(active)!).coins,0);same(JSON.parse(db.get(active)!).ownedItems,["hat-wizard","hat-crown","hat-star"]);
a.hook.updateProfile((p:Fixture)=>shop.wearShopItem(p,"hat-star"));active="profile_B";db.set(active,JSON.stringify({...initial,coins:77}));flush();same(JSON.parse(db.get("profile_A")!).equippedItems,{});same(JSON.parse(db.get(active)!).coins,77);
for(const fn of handlers.storage)fn({key:active});same((a.states[0] as Fixture).coins,77);
active="profile_B";db.set(active,JSON.stringify(initial));const scoped=mount();
active="profile_missing";scoped.hook.updateProfile(p=>shop.wearShopItem(p,"hat-crown"));flush();same(JSON.parse(db.get(active)!).xp,0);same(JSON.parse(db.get(active)!).coins,0);
active="profile_B";const authHook=mount();active="profile_new_account_child";authenticated=true;
await authHook.hook.retryShopSync();same(cloudCalls,0);
await authHook.hook.retryShopSync();flush();same(cloudCalls,1);same(imported!.xp,0);same(imported!.coins,0);same(imported!.ownedItems,[]);same(JSON.parse(db.get(active)!).xp,0);
console.log(JSON.stringify({checks,result:"passed",cases:["malformed wardrobe preserves XP/wallet","two queued tabs preserve purchases","duplicate concurrent purchase charged once","queued write cannot cross child/account scope","storage event reloads active profile","missing-scope fallback cannot copy another profile","cloud import waits for matching in-memory origin and imports empty new child, not old account"],scope:"isolated hook runtime, no authenticated account writes"}));

}
main().catch(e=>{console.error(e);process.exitCode=1});
