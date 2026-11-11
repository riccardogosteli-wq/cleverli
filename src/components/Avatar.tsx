"use client";
import Image from "next/image";
import type { Profile } from "@/hooks/useProfile";
import { BASE_AVATAR_IMAGE, getEquippedShopItem, shopItemImage } from "@/lib/shop";
import { useLang } from "@/lib/LangContext";

interface AvatarProps {
  profile: Pick<Profile, "ownedItems" | "equippedItems">;
  size?: "sm" | "md" | "lg";
}
const SIZES = { sm: 56, md: 96, lg: 192 } as const;
export default function Avatar({ profile, size = "md" }: AvatarProps) {
  const { lang } = useLang();
  const item = getEquippedShopItem(profile);
  const base = { de: "Grundfigur", fr: "Personnage de base", it: "Personaggio base", en: "Base character" };
  const name = item?.name[lang] ?? base[lang];
  const px = SIZES[size];
  return <div className="inline-flex shrink-0 items-center justify-center" style={{ width: px, height: px }} data-avatar-item={item?.id ?? "base"}>
    <Image src={item ? shopItemImage(item.id) : BASE_AVATAR_IMAGE} alt={name} width={px} height={px} sizes={px + "px"} className="h-full w-full object-contain" />
  </div>;
}
