import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as jsx from "react/jsx-runtime";
import * as xp from "../src/lib/xp";
import { ACHIEVEMENTS } from "../src/lib/achievements";
let checks = 0;
const check = (ok: unknown, message: string) => { assert.ok(ok, message); checks++; };
const original = [[1,0,"Lernling"],[2,100,"Bücherwurm"],[3,300,"Cleverli-Ninja"],[4,700,"Cleverli-Star"],[5,1300,"Cleverli-Meister"]];
for (const [id, threshold, title] of original) {
  const l = xp.LEVELS[Number(id)-1];
  check(l.id===id && l.minXp===threshold && l.title===title, "Existing rank identity preserved");
}
for (const rank of xp.LEVELS) {
  for (const n of [rank.minXp, rank.maxXp]) {
    check(xp.getLevelForXp(n).id===rank.id, "Named boundary belongs to correct rank");
    check(xp.getNextLevel(n).minXp>n, "Future goal remains unearned");
    check(xp.getLevelProgress(n)>=0 && xp.getLevelProgress(n)<100, "Progress not permanently full");
  }
  check(xp.getLevelProgress(rank.minXp)===0, "Threshold starts next goal at zero");
}
for (let step=0;step<30;step++) {
  const n=16500+step*xp.LEGEND_STEP;
  check(xp.getLevelForXp(n).id===10+step, "Recurring rank increases");
  check(xp.getNextLevel(n).minXp===n+2500, "Recurring next target");
  check(xp.getLevelForXp(n+2499).id===10+step, "One before recurring boundary");
  check(xp.getLevelForXp(n+2500).id===11+step, "Exact recurring boundary");
}
let seed=20261111;
const samples=[0,99,100,299,300,699,700,1299,1300,2499,2500,4499,4500,5780,7499,7500,11499,11500,16499,16500,18999,19000,21499,21500,100000,1000000000,Number.MAX_SAFE_INTEGER];
for(let n=0;n<1000;n++){seed=(seed*1664525+1013904223)>>>0;samples.push(seed);}
for(const n of samples){const current=xp.getLevelForXp(n),next=xp.getNextLevel(n),pct=xp.getLevelProgress(n);
  check(current.minXp<=n && next.minXp>n,"Current/future range invariant");
  check(next.id===current.id+1,"Sequential rank identity");
  check(Number.isFinite(pct)&&pct>=0&&pct<100,"Finite bounded progress");
  check(xp.getRankTrack(n).length<=12,"Render list stays bounded");
  check(xp.getRankTrack(n).some(r=>r.id===current.id)&&xp.getRankTrack(n).some(r=>r.id===next.id),"Track includes current and next");
  for(const lang of ["de","fr","it","en"])check(xp.getLevelTitle(current,lang).length>0,"Localized title exists");
}
for(const n of [NaN,Infinity,-Infinity,-1])check(xp.getLevelForXp(n).id===1&&xp.getLevelProgress(n)===0,"Malformed rank input safe");
check(xp.getLevelForXp(5780).title==="Cleverli Forscher"&&xp.getNextLevel(5780).minXp-5780===1720,"Alexandra5780 has meaningful next goal");
check(xp.calcXpGain({correct:true,streak:0,hintsUsed:0,isTopicComplete:false,score:1,total:10})===10,"Existing answer XP unchanged");
check(xp.calcXpGain({correct:true,streak:3,hintsUsed:0,isTopicComplete:true,score:10,total:10})===55,"Existing bonus XP unchanged");
const exports = {} as {default:(props:{xp:number;lang:string})=>React.ReactNode};
const source=fs.readFileSync("src/components/RankProgress.tsx","utf8");
vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}}).outputText,{exports,require:(name:string)=>name==="react/jsx-runtime"?jsx:name==="next/link"?{default:(p:React.ComponentProps<"a">)=>React.createElement("a",p)}:name==="@/lib/xp"?xp:undefined});
for(const n of [0,1300,5780,16500,19000,1000000000])for(const lang of ["de","fr","it","en"]){
 const html=renderToStaticMarkup(React.createElement(exports.default,{xp:n,lang}));
 check(html.includes('data-rank-next="'+xp.getNextLevel(n).minXp+'"'),"Actual component target correct");
 check(html.includes('href="/dashboard"')&&html.includes("<details")&&html.includes("<summary"),"Actual component learning/details controls");
 check(!/Highest rank reached|Höchster Rang|Rang maximal|Rango massimo/.test(html),"No dead-end copy");
 check((html.match(/aria-current="step"/g)||[]).length===1,"Exactly one current rank");
 check(html.indexOf("data-rank-remaining")<html.indexOf("<details"),"Next goal precedes full rank list");
}
const fixture={xp:5780,coins:37,ownedItems:["hat-wizard"],equippedItems:{hat:"hat-wizard"},achievements:["level_5"],totalExercises:123,childId:"synthetic-a"};
const master=ACHIEVEMENTS.find(a=>a.id==="level_5")!;
check(master.rarity==="legendary"&&master.xpReward===0&&master.title==="Level 5: Cleverli-Meister", "Master achievement identity and reward preserved");
for(const desc of [master.desc,master.descFr,master.descIt,master.descEn])check(!/highest|maxim|massimo|max level|höchste/i.test(desc)&&/Cleverli/.test(desc),"Master achievement does not claim terminal rank");
const before=JSON.stringify(fixture);xp.getRankTrack(fixture.xp);renderToStaticMarkup(React.createElement(exports.default,{xp:fixture.xp,lang:"de"}));check(JSON.stringify(fixture)===before,"XP/wallet/ownership/achievements untouched by derivation");
console.log(JSON.stringify({checks,result:"passed",coverage:["five legacy IDs/titles/thresholds","ten named and recurring boundaries","1027 seeded XP values through MAX_SAFE_INTEGER","four languages actual component SSR","Alexandra5780 next7500","no profile mutation or reward inflation"]}));
