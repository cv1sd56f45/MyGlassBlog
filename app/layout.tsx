import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import Navbar from "../components/Navbar";
import { siteConfig } from "../siteConfig";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.bio,
  icons: { icon: siteConfig.faviconUrl },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen relative text-slate-800 bg-slate-50 dark:text-slate-100 dark:bg-slate-950 transition-colors duration-200">
        <ThemeProvider>
          {/* Background — 性能优化：降低 blur、减少层数 */}
          <div className="fixed inset-0 z-[-1] pointer-events-none">
            {/* 渐变层：放慢动画频率 */}
            <div
              className="absolute inset-0 opacity-40 dark:opacity-25"
              style={{
                background: `linear-gradient(-45deg, ${siteConfig.themeColors.join(", ")})`,
                backgroundSize: "400% 400%",
                animation: "gradientMove 30s ease infinite",
              }}
            />
            {/* 光晕 — 降低 blur 值 */}
            <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] bg-white/30 dark:bg-indigo-900/15 blur-[80px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-indigo-400/20 dark:bg-purple-900/20 blur-[80px] rounded-full" />
            {/* 毛玻璃覆盖层 — 降低 blur */}
            <div className="absolute inset-0 bg-white/30 dark:bg-slate-900/40 backdrop-blur-sm" />
          </div>

          <div className="relative z-10">
            <Navbar />
            <main className="pt-20 pb-10">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
