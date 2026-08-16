"use client";

import { useLang } from "@/lib/LangContext";

export default function SkipToContentLink() {
  const { tr } = useLang();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-green-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:shadow-lg"
    >
      {tr("skipToContent")}
    </a>
  );
}
