"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, MessageCircle } from "lucide-react";

export default function AdminChatters() {
  const [chatters, setChatters] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/chatters")
      .then((r) => r.json())
      .then((data) => { setChatters(data.chatters || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handlePublish = async () => {
    if (!content.trim()) return;
    await fetch("/api/admin/chatters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", date, content }),
    });
    setContent("");
    // Refresh
    const res = await fetch("/api/admin/chatters");
    const data = await res.json();
    setChatters(data.chatters || []);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("确定删除这条说说吗？")) return;
    await fetch("/api/admin/chatters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", slug }),
    });
    setChatters(chatters.filter((c) => c.slug !== slug));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">说说管理</h1>
        <p className="text-slate-500 text-sm mt-1">发布和管理你的说说</p>
      </div>

      {/* Quick publish */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-6">
        <h2 className="font-medium mb-3 flex items-center gap-2"><Plus size={16} /> 发布新说说</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="在想什么..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-400 text-sm resize-y"
        />
        <div className="flex items-center justify-between mt-3">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-1.5 rounded-lg text-sm border border-slate-200 dark:border-slate-600 outline-none" />
          <button onClick={handlePublish} disabled={!content.trim()} className="px-4 py-1.5 rounded-lg bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 disabled:opacity-50 transition-colors">
            发布
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10 text-slate-400">加载中...</div>
        ) : chatters.length === 0 ? (
          <div className="text-center py-10 text-slate-400"><MessageCircle size={32} className="mx-auto mb-3 opacity-50" />暂无说说</div>
        ) : (
          chatters.map((c: any) => (
            <div key={c.slug} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm whitespace-pre-wrap">{c.content || c.title}</p>
                <span className="text-xs text-slate-400 mt-1 block">{c.date}</span>
              </div>
              <button onClick={() => handleDelete(c.slug)} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
