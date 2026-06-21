"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, MessageCircle, Image as ImageIcon, Users, TrendingUp, Plus } from "lucide-react";

interface Stats {
  posts: number;
  chatters: number;
  photos: number;
  friends: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ posts: 0, chatters: 0, photos: 0, friends: 0 });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats || { posts: 0, chatters: 0, photos: 0, friends: 0 });
        setRecentPosts(data.recentPosts || []);
      })
      .catch(() => {});
  }, []);

  const statCards = [
    { icon: FileText, label: "文章总数", value: stats.posts, color: "bg-indigo-500", href: "/admin/posts" },
    { icon: MessageCircle, label: "说说总数", value: stats.chatters, color: "bg-pink-500", href: "/admin/chatters" },
    { icon: ImageIcon, label: "照片数量", value: stats.photos, color: "bg-amber-500", href: "/admin/photowall" },
    { icon: Users, label: "友链数量", value: stats.friends, color: "bg-emerald-500", href: "/admin/friends" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">仪表盘</h1>
          <p className="text-slate-500 text-sm mt-1">欢迎回来，管理员</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
        >
          <Plus size={16} /> 写文章
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 transition-colors">
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <card.icon size={20} className="text-white" />
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-sm text-slate-500">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent posts */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2"><TrendingUp size={18} /> 最近文章</h2>
          <Link href="/admin/posts" className="text-sm text-indigo-500 hover:text-indigo-600">查看全部 →</Link>
        </div>
        {recentPosts.length === 0 ? (
          <div className="p-8 text-center text-slate-400">暂无文章</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentPosts.map((post: any) => (
              <Link key={post.slug} href={`/admin/posts/edit/${post.slug}`} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div>
                  <span className="font-medium text-sm">{post.title}</span>
                  <span className="text-xs text-slate-400 ml-3">{post.date}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700">{post.category || "随笔"}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
