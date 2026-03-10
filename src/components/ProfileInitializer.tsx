"use client";
import { useEffect, useState, ReactNode } from "react";
import { ProfileProvider } from "@/lib/ProfileContext";

/**
 * Defers ProfileProvider initialization until after First Paint
 * This prevents blocking the render of public pages (landing, login, etc.)
 * and allows the profile data to load without delaying LCP
 */
export function ProfileInitializer({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Defer ProfileProvider initialization until after paint
    // Using a microtask ensures it runs after the current render but before paint
    Promise.resolve().then(() => setReady(true));
  }, []);

  // While loading, render without ProfileProvider
  // Public pages don't need it; protected pages have AuthGuard
  if (!ready) {
    return <>{children}</>;
  }

  return <ProfileProvider>{children}</ProfileProvider>;
}
