"use client";
import Image from "next/image";
import { Profile } from "@/hooks/useProfile";
import { SHOP_ITEMS, BG_COLORS } from "@/lib/shop";

interface AvatarProps {
  profile: Pick<Profile, "ownedItems" | "equippedItems">;
  size?: "sm" | "md" | "lg";
}

const SIZES = { sm: 48, md: 80, lg: 120 } as const;

export default function Avatar({ profile, size = "md" }: AvatarProps) {
  const px = SIZES[size];
  const equipped = profile.equippedItems ?? {};
  const owned = profile.ownedItems ?? [];

  const hat = equipped.hat && owned.includes(equipped.hat)
    ? SHOP_ITEMS.find(i => i.id === equipped.hat) : null;
  const accessory = equipped.accessory && owned.includes(equipped.accessory)
    ? SHOP_ITEMS.find(i => i.id === equipped.accessory) : null;
  const bg = equipped.background && owned.includes(equipped.background)
    ? equipped.background : null;

  const hatSize = size === "lg" ? "text-3xl" : "text-2xl";
  const accSize = size === "lg" ? "text-xl" : "text-base";

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl ${bg ? `bg-gradient-to-br ${BG_COLORS[bg] ?? "from-gray-100 to-gray-200"}` : "bg-green-50"}`}
      style={{ width: px + 16, height: px + 16, padding: 8 }}
    >
      <Image
        src="/cleverli-sit-read.png"
        alt="Dein Avatar"
        width={px}
        height={px}
        className="object-contain drop-shadow-sm"
      />
      {hat && (
        <span className={`absolute -top-2 left-1/2 -translate-x-1/2 ${hatSize} leading-none drop-shadow`}>
          {hat.emoji}
        </span>
      )}
      {accessory && (
        <span className={`absolute bottom-0 right-0 ${accSize} leading-none drop-shadow`}>
          {accessory.emoji}
        </span>
      )}
    </div>
  );
}
