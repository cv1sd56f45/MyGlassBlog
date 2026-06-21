"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, FileText, Search } from "lucide-react";

interface Post {
  slug: string;
  title: string;
  date: string;
  category?: string;
  description?: string;
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/posts")
      .then((r) => r.json())
      .then((data) => { setPosts(data.posts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm("确定删除这篇文章吗？")) return;
    await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", slug }),
    });
    setPosts(posts.filter((p) => p.slug !== slug));
  };

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">文章管理</h1>
          <p className="text-slate-500 text-sm mt-1">共 {posts.length} 篇文章</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
        >
          <Plus size={16} /> 新建文章
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索文章标题或分类..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-400 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">加载中...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <FileText size={32} className="mx-auto mb-3 opacity-50" />
            {search ? "没有匹配的文章" : "暂无文章，点击右上角创建第一篇吧"}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-slate-600 dark:text-slate-300">标题</th>
                <th className="px-5 py-3 text-left font-medium text-slate-600 dark:text-slate-300 hidden sm:table-cell">分类</th>
                <th className="px-5 py-3 text-left font-medium text-slate-600 dark:text-slate-300 hidden md:table-cell">日期</th>
                <th className="px-5 py-3 text-right font-medium text-slate-600 dark:text-slate-300">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((post) => (
                <tr key={post.slug} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3">
                    <span className="font-medium">{post.title}</span>
                    <span className="text-xs text-slate-400 ml-2 sm:hidden">{post.date}</span>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500">
                      {post.category || "随笔"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400 hidden md:table-cell">{post.date}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/posts/${post.slug}`} target="_blank" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-400 hover:text-indigo-500" title="预览">
                        <Pencil size={14} />
                      </Link>
                      <Link href={`/admin/posts/edit/${post.slug}`} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-400 hover:text-amber-500" title="编辑">
                        <Pencil size={14} />
                      </Link>
                      <button onClick={() => handleDelete(post.slug)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500" title="删除">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
