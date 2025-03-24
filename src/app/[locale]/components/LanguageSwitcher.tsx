"use client";

import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const pathname = usePathname(); // Obtiene la URL actual
  const router = useRouter();

  //  Languages list
  const languages = [
    { code: "en", label: "EN" },
    { code: "it", label: "ITAL" },
  ];

  // Detects the current locale from the URL
  const currentLocale = pathname.split("/")[1]; // Gets the locale from the URL

  // Changes the language
  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex space-x-2">
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLanguage(code)}
          disabled={code === currentLocale} // Disables the current locale
          className={`px-3 py-1 rounded border ${
            code === currentLocale
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-white hover:bg-gray-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
