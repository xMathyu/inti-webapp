"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const languages = [
    { code: "en", label: "EN", flag: "/flags/america.svg" },
    { code: "it", label: "IT", flag: "/flags/italy.svg" },
  ];

  const currentLocale = pathname.split("/")[1];
  const nextLanguage =
    languages.find((lang) => lang.code !== currentLocale) || languages[0];

  const switchLanguage = () => {
    const newPath = pathname.replace(
      `/${currentLocale}`,
      `/${nextLanguage.code}`
    );
    router.push(newPath);
  };

  return (
    <button
      onClick={switchLanguage}
      className="group flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow border border-gray-200"
    >
      <div className="relative h-5 w-5 overflow-hidden rounded-sm">
        <Image
          src={nextLanguage.flag}
          alt={nextLanguage.label}
          className="object-cover"
          fill
          sizes="20px"
        />
      </div>
      <span>{nextLanguage.label}</span>
    </button>
  );
}
