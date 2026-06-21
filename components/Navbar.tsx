"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { siteConfig } from "../siteConfig";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/posts", label: "文章" },
  { href: "/chatter", label: "说说" },
  { href: "/timeline", label: "时间线" },
  { href: "/photowall", label: "照片墙" },
  { href: "/friends", label: "友链" },
  { href: "/about", label: "关于" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="glass-card px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src={siteConfig.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
              {siteConfig.navTitle}
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-full text-sm text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-700/40 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-white/40 dark:hover:bg-slate-700/40 transition-colors duration-200"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu — 纯 CSS 切换，不用 AnimatePresence */}
        {menuOpen && (
          <div className="glass-card mt-2 p-4 flex flex-col gap-2 md:hidden animate-fade-in-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 rounded-xl text-sm hover:bg-white/40 dark:hover:bg-slate-700/40 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
