"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/LangContext";

const TAB_LABELS: Record<string, [string, string, string, string]> = {
  learn:    ["Lernen",    "Apprendre", "Imparare", "Learn"],
  daily:    ["Täglich",   "Quotidien", "Quotidiano","Daily"],
  trophies: ["Trophäen",  "Trophées",  "Trofei",   "Trophies"],
  rewards:  ["Prämien",   "Primes",    "Premi",    "Rewards"],
  family:   ["Familie",   "Famille",   "Famiglia", "Family"],
};

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { lang } = useLang();
  const li = lang === "fr" ? 1 : lang === "it" ? 2 : lang === "en" ? 3 : 0;

  const tabs = [
    { href: "/dashboard", icon: "learn", label: TAB_LABELS.learn[li] },
    { href: "/daily",     icon: "daily", label: TAB_LABELS.daily[li] },
    { href: "/trophies",  icon: "trophies", label: TAB_LABELS.trophies[li] },
    { href: "/rewards",   icon: "rewards", label: TAB_LABELS.rewards[li] },
    { href: "/parents",   icon: "family", label: TAB_LABELS.family[li] },
  ];

  const getIcon = (iconKey: string) => {
    const iconMap: Record<string, { src: string; alt: string }> = {
      learn: { src: "/images/ui/Lernen-Dashboard.svg", alt: "Lernen" },
      daily: { src: "/images/ui/Tagesaufgabe.svg", alt: "Täglich" },
      trophies: { src: "/images/ui/Trophaeen.svg", alt: "Trophäen" },
      rewards: { src: "/images/ui/Belohnungen.svg", alt: "Belohnungen" },
      family: { src: "/images/ui/Familie.svg", alt: "Familie" },
    };
    return iconMap[iconKey] || { src: "", alt: "" };
  };

  // Don't show during active exercise or on auth/onboarding pages
  const isExercise = pathname.startsWith("/learn/");
  const isAuthPage = ["/signup", "/login", "/reset-password"].includes(pathname);

  if (isExercise || isAuthPage) return null;

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile Navigation"
    >
      {tabs.map(tab => {
        const isActive = pathname === tab.href
          || (tab.href === "/dashboard" && pathname.startsWith("/dashboard"))
          || (tab.href === "/parents" && (pathname === "/parents" || pathname === "/family"));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors active:bg-gray-50 relative ${
              isActive ? "text-green-700" : "text-gray-400"
            }`}
          >
            {isActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-green-600 rounded-full" />}
            <Image
              src={getIcon(tab.icon).src}
              alt={getIcon(tab.icon).alt}
              width={24}
              height={24}
              className={`leading-none transition-opacity ${isActive ? "" : "opacity-60"}`}
            />
            <span className={`text-[10px] font-semibold leading-tight ${isActive ? "text-green-700" : "text-gray-400"}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
