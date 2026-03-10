"use client";
/**
 * AuthGuard — wraps protected pages.
 * Redirects unauthenticated users to /login after session check completes.
 * Shows a spinner while loading to avoid content flash.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: Props) {
  const { session, loaded } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loaded && !session) {
      router.replace("/login");
    }
  }, [loaded, session, router]);

  // While checking session — show neutral spinner (no content flash)
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in — render nothing while redirect fires
  if (!session) return null;

  return <>{children}</>;
}
