"use client";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type Fbq = ((...args: unknown[]) => void) & { loaded?: boolean; queue?: unknown[][] };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

function cookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getMetaBrowserIdentifiers() {
  return { fbp: cookie("_fbp"), fbc: cookie("_fbc") };
}

export function initMetaPixel() {
  if (!META_PIXEL_ID || typeof window === "undefined" || typeof document === "undefined") return false;
  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      fbq.queue = fbq.queue ?? [];
      fbq.queue.push(args);
    } as Fbq;
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
    window.fbq("init", META_PIXEL_ID);
  }
  return true;
}

export function trackMetaPageView() {
  if (initMetaPixel()) window.fbq?.("track", "PageView");
}

export function trackMetaEvent(eventName: string, data: Record<string, unknown> = {}, eventId?: string | null) {
  if (!initMetaPixel()) return;
  if (eventId) window.fbq?.("track", eventName, data, { eventID: eventId });
  else window.fbq?.("track", eventName, data);
}
