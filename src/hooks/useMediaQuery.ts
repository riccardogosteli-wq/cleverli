"use client";
import { useState, useEffect } from "react";

/**
 * Hook to detect if a media query matches
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @returns boolean - true if query matches, false otherwise
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(query);

    // Set initial state
    setMatches(mediaQueryList.matches);

    // Create listener function
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Add listener (supports both old and new API)
    if (mediaQueryList.addListener) {
      mediaQueryList.addListener(handleChange);
    } else {
      mediaQueryList.addEventListener("change", handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQueryList.removeListener) {
        mediaQueryList.removeListener(handleChange);
      } else {
        mediaQueryList.removeEventListener("change", handleChange);
      }
    };
  }, [query]);

  return matches;
}
