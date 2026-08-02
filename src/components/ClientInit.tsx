"use client";
import { useEffect } from "react";
import { restoreFamilyFromSupabase } from "@/lib/progressSync";

export default function ClientInit() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const hasSession = !!localStorage.getItem("cleverli_session") || !!localStorage.getItem("cleverli_supabase_session");
    const needsFamilyRestore = !localStorage.getItem("cleverli_family") || !localStorage.getItem("cleverli_active_profile");
    if (hasSession && needsFamilyRestore) {
      restoreFamilyFromSupabase();
    }
  }, []);
  return null;
}
