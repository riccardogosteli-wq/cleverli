import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as shop from "../src/lib/shop";
import * as jsx from "react/jsx-runtime";
let checks=0;
const check=(v:unknown)=>{assert.ok(v);checks++;};
let lang="de",loaded=true;
let profile:shop.ShopAppearance & {xp:number;coins:number;achievements:string[]}={ownedItems:[],equippedItems:{},xp:5780,coins:37,achievements:["level_5"]};
const image=({src,alt,width,height}:Record<string,unknown>)=>React.createElement("img",{src,alt,width,height});
const link=({children,...props}:Record<string,unknown>)=>React.createElement("a",props,children as React.ReactNode);
function compile(file:string,extra:Record<string,unknown>){
 const exports:{default?:React.ComponentType}= {};
 const output=ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 vm.runInNewContext(output,{exports,require:(n:string)=>n in extra?extra[n]:n==="react/jsx-runtime"?jsx:n==="next/image"?image:n==="next/link"?link:n==="@/lib/shop"?shop:n==="@/lib/LangContext"?{useLang:()=>({lang})}:n==="@/lib/ProfileContext"?{useProfileContext:()=>({profile,loaded})}:(()=>{throw Error("Unexpected import "+n)})()});
 return exports.default!;
}
const Avatar=compile("src/components/Avatar.tsx",{});
const DashboardAvatar=compile("src/components/DashboardAvatar.tsx",{"@/components/Avatar":Avatar});
for(lang of ["de","fr","it","en"]){
 for(const item of [undefined,...shop.SHOP_ITEMS]){
  profile={xp:5780,coins:37,achievements:["level_5"],ownedItems:item?[item.id]:[],equippedItems:item?{[item.category]:item.id}:{}};
  const before=JSON.stringify(profile),html=renderToStaticMarkup(React.createElement(DashboardAvatar));
  check(html.includes('href="/shop"'));check(html.includes('data-dashboard-avatar="true"'));
  check(html.includes('data-avatar-item="'+(item?.id??"base")+'"'));
  check(html.includes(item?shop.shopItemImage(item.id):shop.BASE_AVATAR_IMAGE));
  check(html.includes('width="96"'));check(html.includes('aria-label="'));
  check(!html.includes("thumbsup"));check(JSON.stringify(profile)===before);
 }
}
profile={xp:5780,coins:37,achievements:["level_5"],ownedItems:[],equippedItems:{hat:"hat-crown"}};
check(renderToStaticMarkup(React.createElement(DashboardAvatar)).includes('data-avatar-item="base"'));
loaded=false;const waiting=renderToStaticMarkup(React.createElement(DashboardAvatar));
check(!waiting.includes("<a"));check(!waiting.includes("<img"));check(waiting.includes('aria-hidden="true"'));
const page=fs.readFileSync("src/app/dashboard/PageClient.tsx","utf8");
check(!page.includes("DashboardLook"));check(page.includes("<DashboardAvatar />"));check(!page.includes('width={80} height={80}'));
console.log(JSON.stringify({checks,result:"passed",scope:"actual dashboard/avatar SSR, 4 languages x base/eight outfits, missing ownership, loading placeholder, read-only profile and integration"}));
