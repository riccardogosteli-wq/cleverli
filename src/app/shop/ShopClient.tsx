"use client";
import Image from "next/image";
import { useProfileContext } from "@/lib/ProfileContext";
import { useLang } from "@/lib/LangContext";
import { SHOP_ITEMS, buyShopItem, getEquippedShopItem, getOwnedShopItems, shopItemImage, wearShopItem } from "@/lib/shop";
import Avatar from "@/components/Avatar";

const COPY = {
  de: { title: "Cleverli einkleiden", intro: "Mit deinen Münzen kannst du neue Sachen für Cleverli kaufen. Was du kaufst, gehört dir und du kannst jederzeit wechseln.", rule: "Du kannst immer nur eine Sache gleichzeitig auswählen: einen Hut, ein Accessoire oder einen Hintergrund.", current: "So sieht dein Cleverli aus", base: "Grundfigur", reset: "Zur Grundfigur wechseln", selected: "Ausgewählt", owned: "Schon deins", wear: "Anziehen", choose: "Auswählen", remove: "Ausziehen", buy: "Kaufen", coins: "Münzen", coin: "Münze", missing: "Dir fehlen noch", earn: "+1 Münze pro richtiger Antwort · +5 Münzen pro abgeschlossenem Thema", hat: "Hüte", accessory: "Accessoires", background: "Hintergründe", loading: "Laden…" },
  fr: { title: "Habille Cleverli", intro: "Avec tes pièces, achète de nouvelles choses pour Cleverli. Tes achats restent à toi et tu peux changer quand tu veux.", rule: "Tu peux porter un seul objet ou choisir un seul arrière-plan à la fois.", current: "Voici ton Cleverli", base: "Personnage de base", reset: "Revenir au personnage de base", selected: "Sélectionné", owned: "Déjà à toi", wear: "Équiper", choose: "Choisir", remove: "Retirer", buy: "Acheter", coins: "pièces", coin: "pièce", missing: "Il te manque encore", earn: "+1 pièce par bonne réponse · +5 pièces par thème terminé", hat: "Chapeaux", accessory: "Accessoires", background: "Arrière-plans", loading: "Chargement…" },
  it: { title: "Vesti Cleverli", intro: "Con le tue monete puoi comprare nuove cose per Cleverli. I tuoi acquisti restano tuoi e puoi cambiare quando vuoi.", rule: "Puoi indossare un solo oggetto o scegliere un solo sfondo alla volta.", current: "Ecco il tuo Cleverli", base: "Personaggio base", reset: "Torna al personaggio base", selected: "Selezionato", owned: "Già tuo", wear: "Indossa", choose: "Scegli", remove: "Togli", buy: "Compra", coins: "monete", coin: "moneta", missing: "Ti mancano ancora", earn: "+1 moneta per risposta corretta · +5 monete per tema completato", hat: "Cappelli", accessory: "Accessori", background: "Sfondi", loading: "Caricamento…" },
  en: { title: "Dress up Cleverli", intro: "Use your coins to buy new things for Cleverli. Everything you buy stays yours, and you can switch whenever you like.", rule: "You can wear just one item or choose one background at a time.", current: "Your Cleverli’s current look", base: "Base character", reset: "Use the base character", selected: "Selected", owned: "Already yours", wear: "Wear", choose: "Choose", remove: "Take off", buy: "Buy", coins: "coins", coin: "coin", missing: "You still need", earn: "+1 coin per correct answer · +5 coins per completed topic", hat: "Hats", accessory: "Accessories", background: "Backgrounds", loading: "Loading…" },
};

export default function ShopClient() {
  const { profile, updateProfile, loaded } = useProfileContext();
  const { lang } = useLang();
  const t = COPY[lang];
  if (!loaded) return <div className="py-20 text-center text-gray-600">{t.loading}</div>;
  const coins = profile.coins ?? 0;
  const owned = getOwnedShopItems(profile);
  const selected = getEquippedShopItem(profile);
  const coinLabel = (n: number) => n === 1 ? t.coin : t.coins;
  const wear = (id?: string) => updateProfile(prev => wearShopItem(prev, id));
  const buy = (id: string) => updateProfile(prev => buyShopItem(prev, id));
  const focus = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-500 focus-visible:ring-offset-2";
  return <main className="mx-auto max-w-3xl space-y-7 px-4 py-6 pb-28">
    <header className="space-y-3 text-center">
      <p className="text-sm font-bold text-green-800">Shop</p>
      <h1 className="text-3xl font-black text-gray-900">{t.title}</h1>
      <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-700">{t.intro}</p>
      <div aria-live="polite" aria-atomic="true" className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-400 bg-yellow-50 px-5 py-2 text-lg font-bold text-yellow-900"><span aria-hidden="true">🪙</span> {coins} {coinLabel(coins)}</div>
      <p className="text-xs leading-relaxed text-gray-600">{t.earn}</p>
    </header>
    <section aria-label={t.current} className="rounded-3xl border border-green-200 bg-white p-5 text-center shadow-sm">
      <p className="mb-2 text-sm font-bold text-gray-700">{t.current}</p>
      <Avatar profile={profile} size="lg" />
      <p aria-live="polite" className="mt-2 font-bold text-green-900">{selected?.name[lang] ?? t.base}</p>
      {selected && <button onClick={() => wear()} className={"mt-3 min-h-11 rounded-full border-2 border-green-700 px-5 py-2 text-sm font-bold text-green-800 hover:bg-green-50 " + focus}>{t.reset}</button>}
      <p className="mx-auto mt-4 max-w-lg rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold leading-relaxed text-green-900">{t.rule}</p>
    </section>
    {(["hat", "accessory", "background"] as const).map(category => <section key={category} aria-labelledby={"shop-" + category} className="space-y-3">
      <h2 id={"shop-" + category} className="text-xl font-extrabold text-gray-900">{t[category]}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {SHOP_ITEMS.filter(item => item.category === category).map(item => {
          const isOwned = owned.includes(item.id), active = selected?.id === item.id, missing = Math.max(0, item.cost - coins);
          const name = item.name[lang];
          const action = active ? (category === "background" ? t.reset : t.remove) : isOwned ? (category === "background" ? t.choose : t.wear) : t.buy;
          return <article key={item.id} data-shop-item={item.id} className={"flex min-w-0 flex-col items-center gap-2 rounded-2xl border-2 bg-white p-3 shadow-sm " + (active ? "border-green-600" : "border-gray-200")}>
            <Image src={shopItemImage(item.id)} alt={name} width={192} height={208} sizes="(max-width: 640px) 42vw, 220px" className="h-40 w-full object-contain sm:h-48" />
            <h3 className="text-center text-base font-bold text-gray-900">{name}</h3>
            <p className={"text-center text-sm font-bold " + (isOwned ? "text-green-800" : "text-yellow-900")}>{active ? "✓ " + t.selected : isOwned ? t.owned : item.cost + " " + coinLabel(item.cost)}</p>
            <button aria-label={name + ": " + action} aria-pressed={isOwned ? active : undefined} disabled={!isOwned && missing > 0} onClick={() => isOwned ? wear(active ? undefined : item.id) : buy(item.id)} className={"mt-auto min-h-11 w-full rounded-full border-2 px-2 py-2 text-sm font-bold transition-colors " + focus + " " + (!isOwned && missing > 0 ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-600" : active ? "border-green-800 bg-green-800 text-white hover:bg-green-900" : isOwned ? "border-green-700 text-green-800 hover:bg-green-50" : "border-yellow-400 bg-yellow-300 text-yellow-950 hover:bg-yellow-400")}>
              {!isOwned && missing > 0 ? "🔒 " + item.cost + " " + coinLabel(item.cost) : action}
            </button>
            {!isOwned && missing > 0 && <p className="text-center text-xs leading-relaxed text-gray-600">{missing === 1 && lang === "de" ? "Dir fehlt noch" : missing === 1 && lang === "it" ? "Ti manca ancora" : t.missing} {missing} {coinLabel(missing)}.</p>}
          </article>;
        })}
      </div>
    </section>)}
  </main>;
}
