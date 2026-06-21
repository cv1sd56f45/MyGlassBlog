import Link from "next/link";
import { siteConfig } from "../siteConfig";
import { Calendar, ArrowRight } from "lucide-react";

export default function LatestPosts({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return (
      <div className="glass-card p-8 text-center text-slate-500 dark:text-slate-400">
        <p>暂无文章，快去 posts/ 目录下写第一篇吧 ✨</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">📝</span> 最新文章
        </h2>
        <Link href="/posts" className="text-sm text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
          查看全部 <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((post: any, i: number) => (
          <Link key={post.slug} href={`/posts/${post.slug}`} className="glass-card overflow-hidden group">
            <div className="relative h-40 overflow-hidden">
              <img
                src={post.cover || siteConfig.defaultPostCover}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-350 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 rounded-full text-xs bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  {post.category || "随笔"}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-indigo-500 transition-colors">{post.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{post.description || ""}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar size={12} />
                <time>{post.date}</time>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
