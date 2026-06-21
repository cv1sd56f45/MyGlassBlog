import { siteConfig } from "../siteConfig";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass-card mt-12 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
      <p>© {new Date().getFullYear()} {siteConfig.authorName} · Built with <Heart size={14} className="inline text-pink-500" /> Next.js</p>
    </footer>
  );
}
