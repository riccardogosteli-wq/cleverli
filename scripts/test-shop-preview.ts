import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as jsx from "react/jsx-runtime";
import * as shop from "../src/lib/shop";
let checks = 0;
const check = (v: unknown) => { assert.ok(v); checks++; };
let lang: "de" | "fr" | "it" | "en" = "de", loaded = true, sync = "saved";
let profile: shop.ShopAppearance & { xp: number; coins: number } = { xp: 5780, coins: 100, ownedItems: [], equippedItems: {} };
const image = (props: Record<string, unknown>) => React.createElement("img", props);
function compile(file: string, extra: Record<string, unknown>) {
  const exports: { default?: React.ComponentType } = {};
  const output = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  vm.runInNewContext(output, { exports, require: (n: string) => n in extra ? extra[n] : n === "react/jsx-runtime" ? jsx : n === "next/image" ? image : n === "@/lib/shop" ? shop : n === "@/lib/LangContext" ? { useLang: () => ({ lang }) } : n === "@/lib/ProfileContext" ? { useProfileContext: () => ({ profile, loaded, shopSync: { state: sync }, purchaseShopItem: () => { throw Error("unexpected purchase during render"); }, selectShopItem: () => { throw Error("unexpected selection during render"); }, retryShopSync: () => { throw Error("unexpected sync during render"); } }) } : (() => { throw Error("Unexpected import " + n); })() });
  return exports.default!;
}
const Avatar = compile("src/components/Avatar.tsx", {});
const Shop = compile("src/app/shop/ShopClient.tsx", { "@/components/Avatar": Avatar });
const esc = (text: string) => renderToStaticMarkup(React.createElement("span", null, text)).slice(6, -7);
function verify() {
  const before = JSON.stringify(profile), html = renderToStaticMarkup(React.createElement(Shop));
  const cards = [...html.matchAll(/<article[^>]*data-shop-item="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)];
  check(cards.length === shop.SHOP_ITEMS.length);
  check(!html.slice(0, html.indexOf("<article")).includes("blur-["));
  for (const [, id, card] of cards) {
    const item = shop.SHOP_ITEMS.find(i => i.id === id)!;
    const owned = shop.getOwnedShopItems(profile).includes(id);
    check(card.includes('data-shop-preview="' + (owned ? "revealed" : "blurred") + '"'));
    check(card.includes("blur-[6px]") === !owned);
    check(card.includes("overflow-hidden"));
    check(card.includes(shop.shopItemImage(id)));
    check(card.includes('alt="' + esc(item.name[lang]) + '"'));
    check(card.includes('<h3 class="text-center text-base font-bold text-gray-900">' + esc(item.name[lang]) + '</h3>'));
    check(card.includes('aria-label="' + esc(item.name[lang]) + ': '));
    const button = card.match(/<button([^>]*)>/)![1];
    check(button.includes('disabled=""') === (["syncing", "pending", "offline"].includes(sync) || (!owned && profile.coins < item.cost)));
    check(!card.match(/<(?:h3|button)[^>]*class="[^"]*blur-/));
  }
  check(JSON.stringify(profile) === before);
}
for (lang of ["de", "fr", "it", "en"] as const) {
  for (let mask = 0; mask < 1 << shop.SHOP_ITEMS.length; mask++) {
    const owned = shop.SHOP_ITEMS.filter((_, i) => !!(mask & 1 << i));
    const equipped = owned[0];
    profile = { xp: 5780, coins: mask % 2 ? 100 : 0, ownedItems: owned.map(i => i.id), equippedItems: equipped ? { [equipped.category]: equipped.id } : {} };
    verify();
  }
  for (sync of ["saved", "local", "syncing", "pending", "offline", "error"]) {
    profile = { xp: 5780, coins: 0, ownedItems: ["hat-crown"], equippedItems: { hat: "hat-crown" } };
    verify();
  }
}
loaded = false;
const waiting = renderToStaticMarkup(React.createElement(Shop));
check(!waiting.includes("data-shop-preview")); check(!waiting.includes("<img"));
console.log(JSON.stringify({ checks, result: "passed", scope: "actual shop/avatar SSR: four languages x all 256 ownership combinations, affordable/locked previews, selected avatar, six sync states, loading and immutable profile" }));
