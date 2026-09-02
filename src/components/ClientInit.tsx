"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";
import { restoreFamilyFromSupabase } from "@/lib/progressSync";
import { trackMetaPageView } from "@/lib/metaPixel";
import { getActiveProfileStorageKey, getFamilyStorageKey } from "@/lib/accountScopedStorage";

export default function ClientInit() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
    trackMetaPageView();
  }, [pathname]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const hasSession = !!localStorage.getItem("cleverli_session") || !!localStorage.getItem("cleverli_supabase_session");
    const needsFamilyRestore = !localStorage.getItem(getFamilyStorageKey()) || !localStorage.getItem(getActiveProfileStorageKey());
    if (hasSession && needsFamilyRestore) {
      restoreFamilyFromSupabase();
    }
  }, []);
  return null;
}
