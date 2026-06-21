"use client";
import { useState } from "react";

export default function AdminFriends() {
  const [friends, setFriends] = useState([
    { name: "示例友链", bio: "这是一个示例友链", url: "https://example.com", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=friend1" },
  ]);
  const [form, setForm] = useState({ name: "", bio: "", url: "", avatar: "" });
  const [editing, setEditing] = useState<number | null>(null);

  const handleAdd = () => {
    if (!form.name || !form.url) return;
    if (editing !== null) {
      const updated = [...friends];
      updated[editing] = form;
      setFriends(updated);
      setEditing(null);
    } else {
      setFriends([...friends, { ...form }]);
    }
    setForm({ name: "", bio: "", url: "", avatar: "" });
  };

  const handleEdit = (index: number) => {
    setForm({ ...friends[index] });
    setEditing(index);
  };

  const handleRemove = (index: number) => {
    setFriends(friends.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">友链管理</h1>
        <p className="text-slate-500 text-sm mt-1">共 {friends.length} 个友链</p>
      </div>

      {/* Add/Edit form */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-6">
        <h3 className="font-medium text-sm mb-4">{editing !== null ? "编辑友链" : "添加新友链"}</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="站点名称" className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 border text-sm outline-none focus:border-indigo-400" />
          <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="站点 URL" className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 border text-sm outline-none focus:border-indigo-400" />
          <input type="url" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="头像 URL（可选）" className="col-span-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 border text-sm outline-none focus:border-indigo-400" />
          <input type="text" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="简介（可选）" className="col-span-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 border text-sm outline-none focus:border-indigo-400" />
        </div>
        <div className="flex gap-2">
          <button onClick={handleAdd} disabled={!form.name || !form.url} className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors">
            {editing !== null ? "保存修改" : "添加友链"}
          </button>
          {editing !== null && (
            <button onClick={() => { setEditing(null); setForm({ name: "", bio: "", url: "", avatar: "" }); }} className="px-4 py-2 rounded-lg border text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              取消
            </button>
          )}
        </div>
      </div>

      {/* Friends list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map((f, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img src={f.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${f.name}`} alt="" className="w-10 h-10 rounded-full shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{f.name}</p>
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 truncate block">{f.url}</a>
                {f.bio && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{f.bio}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => handleEdit(index)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-600 text-xs text-amber-500">✏️</button>
              <button onClick={() => handleRemove(index)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-xs text-red-500">🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
