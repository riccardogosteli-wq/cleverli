import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-5">
      <Image src="/cleverli-think.png" alt="Cleverli denkt" width={130} height={130} className="drop-shadow-lg" />
      <h1 className="text-4xl font-extrabold text-gray-800">404</h1>
      <p className="text-gray-500 max-w-sm">
        Hm, diese Seite konnten wir nicht finden. Vielleicht ist sie versteckt wie ein Schatz? 🗺️
      </p>
      <Link href="/"
        className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md">
        Zurück zur Startseite →
      </Link>
      <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 underline">
        Oder direkt zum Lernen
      </Link>
    </div>
  );
}
