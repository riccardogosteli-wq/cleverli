import assert from "node:assert/strict";
import fs from "node:fs";
import { SHOP_ITEMS, BASE_AVATAR_IMAGE, shopItemImage, getEquippedShopItem, singleShopAppearance, buyShopItem, wearShopItem } from "../src/lib/shop";
let checks = 0;
const same = (actual: unknown, expected: unknown) => { assert.deepEqual(actual, expected); checks++; };
same(SHOP_ITEMS.map(i => [i.id, i.cost]), [["hat-wizard",20],["hat-crown",50],["hat-star",30],["acc-glasses",15],["acc-bow",15],["acc-medal",25],["bg-space",40],["bg-rainbow",40]]);
for (const file of [BASE_AVATAR_IMAGE, ...SHOP_ITEMS.map(i => shopItemImage(i.id))]) same(fs.existsSync("public" + file), true);
for (let mask = 0; mask < 256; mask++) {
  const ownedItems = SHOP_ITEMS.filter((_, i) => mask & (1 << i)).map(i => i.id);
  const profile = { coins: 200, ownedItems: [...ownedItems, "future-purchase"], equippedItems: { hat: "hat-star", accessory: "acc-glasses", background: "bg-space" }, xp: 1234, costume: 3 };
  const before = JSON.stringify(profile);
  const one = singleShopAppearance(profile);
  same(Object.keys(one).length <= 1, true);
  const selected = getEquippedShopItem(profile);
  same(!selected || ownedItems.includes(selected.id), true);
  for (const item of SHOP_ITEMS) {
    const worn = wearShopItem(profile, item.id);
    same(worn.ownedItems, profile.ownedItems); same(worn.coins, profile.coins); same(worn.xp, profile.xp);
    if (ownedItems.includes(item.id)) same(worn.equippedItems, { [item.category]: item.id });
    else same(worn, profile);
    const bought = buyShopItem(profile, item.id);
    same(bought.coins, ownedItems.includes(item.id) ? 200 : 200 - item.cost);
    same(bought.ownedItems, ownedItems.includes(item.id) ? profile.ownedItems : [...profile.ownedItems, item.id]);
    same(bought.xp, profile.xp); same(buyShopItem(bought, item.id), bought);
  }
  const base = wearShopItem(profile); same(base.equippedItems, {}); same(base.ownedItems, profile.ownedItems); same(base.coins, 200);
  same(JSON.stringify(profile), before);
}
for (const item of SHOP_ITEMS) for (const coins of [0, item.cost - 1, item.cost, item.cost + 1]) {
  const p = { coins, ownedItems: [] as string[], equippedItems: {} };
  const result = buyShopItem(p, item.id);
  same(result.coins, coins < item.cost ? coins : coins - item.cost);
  same(result.coins >= 0, true);
}
const p = { coins: 20, ownedItems: [] as string[], equippedItems: {} };
same(buyShopItem(buyShopItem(p, "hat-wizard"), "hat-wizard").coins, 0);
same(buyShopItem(buyShopItem(p, "hat-wizard"), "acc-glasses").ownedItems, ["hat-wizard"]);
same(getEquippedShopItem({ ownedItems: ["hat-star"], equippedItems: { accessory: "hat-star" } }), undefined);
same(getEquippedShopItem({ ownedItems: [], equippedItems: { hat: "hat-star" } }), undefined);
same(buyShopItem(p, "unknown"), p); same(wearShopItem(p, "unknown"), p);
console.log(JSON.stringify({ checks, ownershipCombinations: 256, catalogItems: 8, suppliedAssets: 9, result: "passed" }));
