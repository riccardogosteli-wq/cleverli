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
