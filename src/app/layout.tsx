import type { Metadata } from "next";
import "./globals.css";
import Marquee from "react-fast-marquee";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export const metadata: Metadata = {
  title: "MovieIsFine - Your 90s Movie Database",
  description: "Movie is all you need. Welcome to 1997!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'zh';

  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen flex flex-col">
          {/* Marquee announcement bar */}
          <div className="bg-[#000080] py-1 bevel-inset">
            <Marquee speed={40} gradient={false} pauseOnHover>
              <span className="text-[#FFFF00] font-bold mx-4">★ Welcome to MovieIsFine! ★</span>
              <span className="text-[#00FF00] font-bold mx-4">🎬 Your Ultimate Movie Database 🎬</span>
              <span className="text-[#FF0000] font-bold mx-4">♦ Best viewed in Netscape Navigator 4.0 ♦</span>
              <span className="text-[#00FFFF] font-bold mx-4">✦ Last Updated: 1997 ✦</span>
              <span className="text-white font-bold mx-4">📼 Over 250 Movies! 📼</span>
            </Marquee>
          </div>

          {/* Header - Windows 95 style */}
          <header className="panel-90s p-2">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4">
                {/* Decorative colored squares */}
                <div className="hidden sm:flex gap-1">
                  <div className="color-square bg-[#FF0000]"></div>
                  <div className="color-square bg-[#00FF00]"></div>
                  <div className="color-square bg-[#0000FF]"></div>
                  <div className="color-square bg-[#FFFF00]"></div>
                </div>
                <h1 className="heading-90s text-xl sm:text-2xl md:text-3xl text-rainbow">
                  MovieIsFine
                </h1>
              </div>

              {/* Hit counter style stats */}
              <div className="flex items-center gap-4">
                <LanguageSwitcher currentLocale={locale} />
                <div className="hit-counter text-xs sm:text-sm">
                  <span>Visitors: </span>
                  <span className="font-bold">0001997</span>
                </div>
              </div>
            </div>
          </header>

          {/* Groove divider */}
          <div className="hr-groove"></div>

          {/* Main content */}
          <main className="flex-1 w-full max-w-5xl mx-auto p-4">
            {children}
          </main>

          {/* Groove divider */}
          <div className="hr-groove"></div>

          {/* Footer - Construction zone style */}
          <footer className="panel-90s">
            <div className="bg-construction h-4"></div>
            <div className="p-4 text-center">
              <p className="font-bold text-sm">
                © 1997-{new Date().getFullYear()} MovieIsFine
              </p>
              <p className="text-xs mt-2 text-[#808080]">
                Best viewed at 800x600 resolution | Powered by Windows 95
              </p>
              <div className="flex justify-center gap-2 mt-3">
                <div className="color-square bg-[#FF00FF]"></div>
                <div className="color-square bg-[#00FFFF]"></div>
                <div className="color-square bg-[#FF8000]"></div>
                <div className="color-square bg-[#8000FF]"></div>
              </div>
            </div>
            <div className="bg-construction h-4"></div>
          </footer>
        </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
