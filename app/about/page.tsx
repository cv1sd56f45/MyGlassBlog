import Footer from "../../components/Footer";
import { siteConfig } from "../../siteConfig";
import { User, Heart, Code, Coffee } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2"><User size={28} className="text-indigo-500" /> 关于</h1>
      </div>

      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img src={siteConfig.avatarUrl} alt="" className="w-32 h-32 rounded-full border-4 border-white/50 dark:border-slate-700/50" />
          <div>
            <h2 className="text-2xl font-bold">{siteConfig.authorName}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">{siteConfig.bio}</p>
          </div>
        </div>

        <hr className="border-white/30 dark:border-slate-700/30" />

        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Code className="text-green-500" /> 技术栈</h3>
          <div className="flex flex-wrap gap-2">
            {["Next.js", "React", "TypeScript", "Tailwind CSS", "Markdown"].map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-sm bg-white/40 dark:bg-slate-700/40">{t}</span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Heart className="text-pink-500" /> 兴趣</h3>
          <p className="text-slate-600 dark:text-slate-400">编程、摄影、阅读、探索新技术...</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
