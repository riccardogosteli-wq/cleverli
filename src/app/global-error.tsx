"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="de">
      <body>
        <main className="min-h-screen bg-green-50 flex items-center justify-center px-4">
          <div className="max-w-sm rounded-2xl border border-green-100 bg-white p-6 text-center shadow-sm">
            <h1 className="text-xl font-black text-gray-900">Da ist etwas schiefgelaufen.</h1>
            <p className="mt-2 text-sm text-gray-600">
              Wir haben den Fehler gespeichert und schauen ihn uns an.
            </p>
            <button
              onClick={reset}
              className="mt-5 rounded-full bg-green-700 px-5 py-3 text-sm font-bold text-white active:scale-95"
            >
              Nochmal versuchen
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
