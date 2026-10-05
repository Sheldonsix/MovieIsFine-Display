import type { Metadata } from "next";
import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { cookies } from "next/headers";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { MovieSearch } from "@/components/MovieSearch";
import "./globals.css";

export const metadata: Metadata = {
  title: "MovieIsFine — 电影资料库",
  description: "发现电影，查看评分、剧情时间轴与家长指南。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "zh";

  return (
    <html lang={locale === "en" ? "en" : "zh-CN"}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <div className="bg-[#545652] text-xs text-[#d5d5d5]">
              <div className="mx-auto flex h-7 w-full max-w-5xl items-center justify-between px-4">
                <span>MovieIsFine 电影资料库</span>
                <LanguageSwitcher currentLocale={locale} />
              </div>
            </div>

            <header className="border-b border-[#d9e5df] bg-[#f2f7f5]">
              <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:gap-10">
                <Link
                  href="/"
                  className="focus-ring shrink-0 rounded-sm text-3xl font-bold tracking-tight text-[#00a65a] no-underline hover:bg-transparent hover:text-[#008f4d]"
                >
                  MovieIsFine
                </Link>
                <div className="w-full max-w-xl flex-1">
                  <MovieSearch />
                </div>
              </div>
            </header>

            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
              {children}
            </main>

            <footer className="mt-8 border-t border-[#e5e5e5]">
              <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-6 text-xs text-[#999] sm:flex-row sm:justify-between">
                <p>© {new Date().getFullYear()} MovieIsFine</p>
                <p>只读电影资料展示</p>
              </div>
            </footer>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
