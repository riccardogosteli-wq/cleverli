"use client";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { useProfileContext } from "@/lib/ProfileContext";
import { useLang } from "@/lib/LangContext";
import { getEquippedShopItem } from "@/lib/shop";

export default function DashboardAvatar() {
  const { profile, loaded } = useProfileContext();
  const { lang } = useLang();
  if (!loaded) return <div aria-hidden="true" className="h-24 w-24 shrink-0" />;
  const item = getEquippedShopItem(profile);
  const base = { de: "Grundfigur", fr: "Personnage de base", it: "Personaggio base", en: "Base character" }[lang];
  const action = { de: "Dein Cleverli im Shop ändern", fr: "Changer ton Cleverli dans la boutique", it: "Cambia il tuo Cleverli nel negozio", en: "Change your Cleverli in the shop" }[lang];
  const label = `${action}: ${item?.name[lang] ?? base}`;
  return (
    <Link href="/shop" aria-label={label} title={label} data-dashboard-avatar
      className="inline-flex shrink-0 rounded-2xl transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-600 focus-visible:ring-offset-2">
      <Avatar profile={profile} size="md" />
    </Link>
  );
}
