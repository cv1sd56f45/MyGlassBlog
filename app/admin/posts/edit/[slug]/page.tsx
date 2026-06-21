"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react";

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    date: "",
    category: "",
    description: "",
    cover: "",
    content: "",
  });

  useEffect(() => {
    fetch("/api/admin/posts")
      .then((r) => r.json())
      .then((data) => {
        const post = (data.posts || []).find((p: any) => p.slug === slug);
        if (post) setForm({ title: post.title || "", date: post.date || "", category: post.category || "", description: post.description || "", cover: post.cover || "", content: post.content || "" });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleSave = async () => {
    if (!form.title.trim()) { alert("请输入标题"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", slug, ...form }),
      });
      const data = await res.json();
      alert(data.success ? "保存成功！" : data.error || "保存失败");
    } catch { alert("网络错误"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("确定删除这篇文章吗？此操作不可恢复！")) return;
    await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", slug }),
    });
    router.push("/admin/posts");
  };

  if (loading) return <div className="text-center py-20 text-slate-400">加载中...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">编辑文章</h1>
          <span className="text-sm text-slate-400">/{slug}</span>
        </div>
        <div className="flex gap-2">
          <a href={`/posts/${slug}`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Eye size={14} /> 预览
          </a>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:opacity-50">
            <Save size={14} /> {saving ? "保存中..." : "保存"}
          </button>
          <button onClick={handleDelete} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600">
            <Trash2 size={14} /> 删除
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="文章标题" className="w-full px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-400 text-lg font-medium" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-400 text-sm" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-400 text-sm">
            <option>随笔</option><option>技术</option><option>生活</option><option>笔记</option><option>教程</option>
          </select>
          <input type="text" value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} placeholder="封面图 URL" className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-400 text-sm" />
        </div>
        <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="文章摘要" className="w-full px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-400 text-sm" />
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">正文内容（Markdown）</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={18} className="w-full px-5 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-400 font-mono text-sm leading-relaxed resize-y" />
        </div>
      </div>
    </div>
  );
}
