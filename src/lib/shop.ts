export interface ShopItem {
  id: string;
  name: { de: string; fr: string; it: string; en: string };
  emoji: string;
  cost: number;
  category: "hat" | "accessory" | "background";
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: "hat-wizard",  name: { de: "Zauberhut",   fr: "Chapeau magique",  it: "Cappello mago",    en: "Wizard Hat"   }, emoji: "🧙", cost: 20, category: "hat" },
  { id: "hat-crown",   name: { de: "Krone",        fr: "Couronne",         it: "Corona",           en: "Crown"        }, emoji: "👑", cost: 50, category: "hat" },
  { id: "hat-star",    name: { de: "Sternenhut",   fr: "Chapeau étoile",   it: "Cappello stella",  en: "Star Hat"     }, emoji: "⭐", cost: 30, category: "hat" },
  { id: "acc-glasses", name: { de: "Brille",       fr: "Lunettes",         it: "Occhiali",         en: "Glasses"      }, emoji: "🤓", cost: 15, category: "accessory" },
  { id: "acc-bow",     name: { de: "Schleife",     fr: "Nœud",             it: "Fiocco",           en: "Bow"          }, emoji: "🎀", cost: 15, category: "accessory" },
  { id: "acc-medal",   name: { de: "Medaille",     fr: "Médaille",         it: "Medaglia",         en: "Medal"        }, emoji: "🏅", cost: 25, category: "accessory" },
  { id: "bg-space",    name: { de: "Weltall",      fr: "Espace",           it: "Spazio",           en: "Space"        }, emoji: "🚀", cost: 40, category: "background" },
  { id: "bg-rainbow",  name: { de: "Regenbogen",   fr: "Arc-en-ciel",      it: "Arcobaleno",       en: "Rainbow"      }, emoji: "🌈", cost: 40, category: "background" },
];

export const BG_COLORS: Record<string, string> = {
  "bg-space":   "from-indigo-100 to-purple-100",
  "bg-rainbow": "from-pink-100 to-yellow-100",
};

export const BASE_AVATAR_IMAGE = "/images/shop/base.webp";
export const shopItemImage = (id: string) => "/images/shop/" + id + ".webp";
export type ShopAppearance = { ownedItems?: string[]; equippedItems?: { hat?: string; accessory?: string; background?: string } };

/** Keep valid and future purchase IDs; never interpret a string/object as ownership. */
export function getOwnedShopItems(profile: ShopAppearance): string[] {
  return Array.isArray(profile.ownedItems) ? profile.ownedItems.filter((id): id is string => typeof id === "string") : [];
}

/** Legacy combinations resolve consistently, without changing any purchases or coins. */
export function getEquippedShopItem(profile: ShopAppearance): ShopItem | undefined {
  for (const category of ["hat", "accessory", "background"] as const) {
    const id = profile.equippedItems?.[category];
    const item = SHOP_ITEMS.find(item => item.id === id && item.category === category);
    if (item && getOwnedShopItems(profile).includes(item.id)) return item;
  }
}

export function singleShopAppearance(profile: ShopAppearance): NonNullable<ShopAppearance["equippedItems"]> {
  const item = getEquippedShopItem(profile);
  return item ? { [item.category]: item.id } : {};
}

export function buyShopItem<T extends ShopAppearance & { coins: number }>(profile: T, id: string): T {
  const item = SHOP_ITEMS.find(item => item.id === id);
  if (!item || !Number.isFinite(profile.coins) || profile.coins < item.cost || getOwnedShopItems(profile).includes(id)) return profile;
  return { ...profile, coins: profile.coins - item.cost, ownedItems: [...getOwnedShopItems(profile), id] };
}

export function wearShopItem<T extends ShopAppearance>(profile: T, id?: string): T {
  if (!id) return { ...profile, equippedItems: {} };
  const item = SHOP_ITEMS.find(item => item.id === id);
  if (!item || !getOwnedShopItems(profile).includes(id)) return profile;
  return { ...profile, equippedItems: { [item.category]: id } };
}
