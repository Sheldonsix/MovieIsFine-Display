"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = (newLocale: string) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }
    // 设置 Cookie，过期时间 1 年
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    // 刷新当前页面和所有的 Server Components
    router.refresh();
    setIsOpen(false);
  };

  // 点击组件外部时关闭下拉框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#c0c0c0] p-1.5 flex items-center justify-center text-sm font-bold text-black border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#808080] border-r-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-[#ffffff] active:border-r-[#ffffff]"
        title="Switch Language / 切换语言"
      >
        {/* 通用的地球 Icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span className="ml-1 text-[10px]">▼</span>
      </button>

      {/* 下拉菜单 (Windows 95 Menu 风格) */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-24 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#808080] border-r-[#808080] z-50 shadow-md">
          <ul className="py-1">
            <li>
              <button
                onClick={() => toggleLanguage("zh")}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[#000080] hover:text-white ${
                  currentLocale === 'zh' ? 'font-bold' : ''
                }`}
              >
                中文 {currentLocale === 'zh' && '✓'}
              </button>
            </li>
            <li>
              <button
                onClick={() => toggleLanguage("en")}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[#000080] hover:text-white ${
                  currentLocale === 'en' ? 'font-bold' : ''
                }`}
              >
                English {currentLocale === 'en' && '✓'}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
