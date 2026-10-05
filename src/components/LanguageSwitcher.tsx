"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

function persistLocale(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
}

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = (locale: string) => {
    if (locale === currentLocale) {
      setIsOpen(false);
      return;
    }
    persistLocale(locale);
    router.refresh();
    setIsOpen(false);
  };

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="focus-ring flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs text-[#d5d5d5] hover:bg-white/10 hover:text-white"
        title="Switch Language / 切换语言"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span>{currentLocale === "en" ? "English" : "中文"}</span>
        <span aria-hidden="true">▾</span>
      </button>

      {isOpen && (
        <div className="content-box absolute right-0 z-50 mt-1 w-28 overflow-hidden p-1 shadow-md shadow-black/10">
          <ul role="menu">
            {[
              ["zh", "中文"],
              ["en", "English"],
            ].map(([locale, label]) => (
              <li key={locale}>
                <button
                  onClick={() => toggleLanguage(locale)}
                  role="menuitem"
                  className={`w-full rounded-sm px-2 py-1.5 text-left text-xs hover:bg-[#f3f3f3] ${
                    currentLocale === locale
                      ? "font-semibold text-[#007722]"
                      : "text-[#555]"
                  }`}
                >
                  {label} {currentLocale === locale && "✓"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
