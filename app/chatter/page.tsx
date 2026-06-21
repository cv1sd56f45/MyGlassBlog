import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Footer from "../../components/Footer";

export const dynamic = 'force-dynamic';

export default function ChatterPage() {
  const chattersDir = path.join(process.cwd(), "chatters");
  let allChatters: any[] = [];
  try {
    if (fs.existsSync(chattersDir)) {
      allChatters = fs.readdirSync(chattersDir)
        .filter((f: string) => f.endsWith(".md"))
        .map((fileName: string) => {
          const { data, content } = matter(fs.readFileSync(path.join(chattersDir, fileName), "utf8"));
          return { slug: fileName.replace(/\.md$/, ""), ...data, content, date: data.date || "2026-01-01" };
        })
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  } catch {}

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2"><MessageCircle className="text-pink-500" /> 说说</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">记录生活中的碎片思绪</p>
      </div>

      {allChatters.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500">暂无说说，在 chatters/ 目录下创建 .md 文件即可~</div>
      ) : (
        <div className="flex flex-col gap-4">
          {allChatters.map((c: any) => (
            <div key={c.slug} className="glass-card p-6">
              <p className="text-slate-700 dark:text-slate-300 mb-3 whitespace-pre-wrap">{c.content || c.title}</p>
              <div className="text-xs text-slate-400">{c.date}</div>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}
