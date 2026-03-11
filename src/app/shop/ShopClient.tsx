"use client";
import { useProfileContext } from "@/lib/ProfileContext";
import { useLang } from "@/lib/LangContext";
import { SHOP_ITEMS, ShopItem } from "@/lib/shop";
import Avatar from "@/components/Avatar";

export default function ShopClient() {
  const { profile, updateProfile, loaded } = useProfileContext();
  const { lang } = useLang();

  if (!loaded) return (
    <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
      {lang === "fr" ? "Chargement…" : lang === "it" ? "Caricamento…" : lang === "en" ? "Loading…" : "Laden…"}
    </div>
  );

  const coins = profile.coins ?? 0;
  const owned = profile.ownedItems ?? [];
  const equipped = profile.equippedItems ?? {};

  const n = (item: ShopItem) => item.name[lang as keyof typeof item.name] ?? item.name.de;

  const buy = (item: ShopItem) => {
    if (coins < item.cost || owned.includes(item.id)) return;
    updateProfile({
      coins: coins - item.cost,
      ownedItems: [...owned, item.id],
    });
  };

  const toggleEquip = (item: ShopItem) => {
    if (!owned.includes(item.id)) return;
    const current = equipped[item.category];
    updateProfile({
      equippedItems: {
        ...equipped,
        [item.category]: current === item.id ? undefined : item.id,
      },
    });
  };

  const coinLabel = lang === "fr" ? "pièces" : lang === "it" ? "monete" : lang === "en" ? "coins" : "Münzen";
  const categories = ["hat", "accessory", "background"] as const;
  const catLabels: Record<string, string> = {
    hat:        lang === "fr" ? "Chapeaux" : lang === "it" ? "Cappelli" : lang === "en" ? "Hats" : "Hüte",
    accessory:  lang === "fr" ? "Accessoires" : lang === "it" ? "Accessori" : lang === "en" ? "Accessories" : "Accessoires",
    background: lang === "fr" ? "Arrière-plans" : lang === "it" ? "Sfondi" : lang === "en" ? "Backgrounds" : "Hintergründe",
  };

  return (
    <main className="max-w-lg mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <Avatar profile={profile} size="lg" />
        <div className="text-2xl font-black text-gray-800">
          🛍️ {lang === "fr" ? "Boutique" : lang === "it" ? "Negozio" : lang === "en" ? "Shop" : "Shop"}
        </div>
        <div className="inline-flex items-center gap-2 bg-yellow-50 border-2 border-yellow-300 rounded-full px-4 py-2 text-lg font-bold text-yellow-700">
          🪙 {coins} {coinLabel}
        </div>
        <p className="text-xs text-gray-400">
          {lang === "fr" ? "+1 pièce par bonne réponse · +5 pièces par thème terminé"
           : lang === "it" ? "+1 moneta per risposta giusta · +5 monete per tema completato"
           : lang === "en" ? "+1 coin per correct answer · +5 coins per topic done"
           : "+1 Münze pro richtiger Antwort · +5 Münzen pro abgeschlossenem Thema"}
        </p>
      </div>

      {/* Items by category */}
      {categories.map(cat => (
        <div key={cat} className="space-y-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{catLabels[cat]}</h2>
          <div className="grid grid-cols-2 gap-3">
            {SHOP_ITEMS.filter(i => i.category === cat).map(item => {
              const isOwned = owned.includes(item.id);
              const isEquipped = equipped[cat] === item.id;
              const canAfford = coins >= item.cost;

              return (
                <div key={item.id}
                  className={`bg-white rounded-2xl border-2 p-4 flex flex-col items-center gap-2 shadow-sm transition-all ${
                    isEquipped ? "border-green-400 bg-green-50" : "border-gray-100"
                  }`}>
                  <div className="text-4xl leading-none">{item.emoji}</div>
                  <div className="text-sm font-semibold text-gray-800 text-center leading-tight">{n(item)}</div>
                  <div className="text-xs text-yellow-700 font-bold">🪙 {item.cost}</div>

                  {isEquipped ? (
                    <button onClick={() => toggleEquip(item)}
                      className="w-full text-xs bg-green-500 text-white rounded-full py-1.5 font-bold hover:bg-green-800 active:scale-95 transition-all">
                      ✓ {lang === "fr" ? "Équipé" : lang === "it" ? "Indossato" : lang === "en" ? "Equipped" : "Ausgewählt"}
                    </button>
                  ) : isOwned ? (
                    <button onClick={() => toggleEquip(item)}
                      className="w-full text-xs border-2 border-green-400 text-green-700 rounded-full py-1.5 font-bold hover:bg-green-50 active:scale-95 transition-all">
                      {lang === "fr" ? "Équiper" : lang === "it" ? "Indossa" : lang === "en" ? "Equip" : "Anziehen"}
                    </button>
                  ) : (
                    <button onClick={() => buy(item)}
                      disabled={!canAfford}
                      className={`w-full text-xs rounded-full py-1.5 font-bold transition-all active:scale-95 ${
                        canAfford
                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}>
                      {canAfford
                        ? `${lang === "fr" ? "Acheter" : lang === "it" ? "Acquista" : lang === "en" ? "Buy" : "Kaufen"} 🪙${item.cost}`
                        : `🔒 🪙${item.cost}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </main>
  );
}
