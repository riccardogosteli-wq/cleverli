import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import assert from "node:assert/strict";
import * as xp from "../src/lib/xp";
import * as shop from "../src/lib/shop";
let checks=0;
const same=(a:unknown,b:unknown)=>{assert.deepEqual(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b)));checks++;};
let states:unknown[]=[],effects:(()=>void)[]=[];
const active="qa-a";
const db=new Map<string,string>(),pending:(()=>void)[]=[];
const react={useState:(v:unknown)=>{const arr=states,i=arr.length;arr.push(v);return [v,(n:unknown)=>{arr[i]=typeof n==="function"?n(arr[i]):n;}];},useRef:(v:unknown)=>({current:v}),useCallback:(f:unknown)=>f,useEffect:(f:()=>void)=>effects.push(f)};
const out={} as {useProfile:()=>{recordAnswer:(o:Record<string,unknown>)=>void}};
const js=ts.transpileModule(fs.readFileSync("src/hooks/useProfile.ts","utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
vm.runInNewContext(js,{exports:out,console,Date,CustomEvent:class {},navigator:{onLine:true,locks:{request:(_k:string,f:()=>void)=>{pending.push(f);return Promise.resolve();}}},localStorage:{getItem:(k:string)=>db.get(k)??null,setItem:(k:string,v:string)=>db.set(k,v)},window:{addEventListener:()=>{},removeEventListener:()=>{},dispatchEvent:()=>{}},require:(name:string)=>name==="react"?react:name.endsWith("/xp")?xp:name.endsWith("/shop")?shop:name.endsWith("/achievements")?{ACHIEVEMENTS:[]}:name.endsWith("/accountScopedStorage")?{getProfileStorageKey:()=>active,hasAuthenticatedStorageScope:()=>false,getActiveProfileStorageKey:()=>"active"}:name.endsWith("/family")?{getActiveProfileId:()=>null}:name.endsWith("/topicCatalog")?{CORE_SUBJECTS:[],getCatalogSubjects:()=>[],getTopicSummaries:()=>[]}:name.endsWith("/supabase")?{getSupabase:()=>null}:name.endsWith("/shopSync")?{enqueueShopCredit:()=>{},pendingShopCoins:()=>0}: {}});
const base={xp:0,coins:37,ownedItems:["hat-wizard"],equippedItems:{hat:"hat-wizard"},totalExercises:123,totalTopicsComplete:0,dailyStreak:0,lastPlayedDate:new Date().toISOString().slice(0,10),achievements:["level_2","level_3","level_4","level_5"],usedLanguages:["de"],costume:3,weeklyXp:0,weeklyXpDate:"",streakGraceUsed:false,weekendDays:[],playDates:[]};
function mount(value:number){states=[];effects=[];db.set(active,JSON.stringify({...base,xp:value}));const hook=out.useProfile(),own=states;for(const f of effects)f();while(pending.length)pending.shift()!();return {hook,own};}
for(const boundary of [2500,4500,7500,11500,16500,19000,21500,99000]){
 const a=mount(boundary-10);same(a.own[4],false);
 a.hook.recordAnswer({correct:true,streak:0,hintsUsed:0,isTopicComplete:false,score:1,total:10,grade:1,subject:"math",lang:"de"});while(pending.length)pending.shift()!();const saved=JSON.parse(db.get(active)!);
 same(saved.xp,boundary);same(saved.coins,38);same(saved.ownedItems,base.ownedItems);same(saved.equippedItems,base.equippedItems);same(saved.achievements.filter((x:string)=>x.startsWith("level_")),base.achievements);same(a.own[4],true);same(xp.getLevelProgress(saved.xp),0);
 const reload=mount(saved.xp);same(reload.own[4],false);
}
const a=mount(5780);same((a.own[0] as {xp:number}).xp,5780);same(a.own[4],false);a.hook.recordAnswer({correct:false,streak:0,hintsUsed:0,isTopicComplete:false,score:0,total:10,grade:1,subject:"math"});while(pending.length)pending.shift()!();same(JSON.parse(db.get(active)!).xp,5780);same(JSON.parse(db.get(active)!).coins,37);same(a.own[4],false);
console.log(JSON.stringify({checks,result:"passed",scope:"actual useProfile with real XP module in isolated fake storage, no auth or remote mutations",coverage:["eight new/recurring rank crossings","level-up occurs on earned answer not mount/reload","XP and single coin earned once","wallet/equipment/legacy rank achievements preserved","incorrect answer no XP/rank reward"]}));
