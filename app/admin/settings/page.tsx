"use client";
import { useState } from "react";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    siteTitle: "My Glass Blog",
    authorName: "Your Name",
    bio: "在代码与生活的交汇处，记录每一次灵感的闪现。",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=glassblog",
    navTitle: "MyBlog",
    defaultPostCover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop",
    github: "https://github.com/yourusername",
    twitter: "",
    email: "your@email.com",
    wechat: "",
    adminPassword: "admin123",
    themeColors: "#a18cd1, #fbc2eb, #a1c4fd, #c2e9fb",
  });

  const handleSave = () => {
    // In a real app this would save to a config file or database
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">站点设置</h1>
        <p className="text-slate-500 text-sm mt-1">修改博客的基本信息和配置</p>
      </div>

      <div className="space-y-5">
        {/* Basic info */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">📌 基本信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">站点标题</label>
              <input type="text" value={form.siteTitle} onChange={(e) => setForm({ ...form, siteTitle: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-400 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">作者名称</label>
              <input type="text" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-400 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">个人简介</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-400 text-sm resize-y" />
            </div>
          </div>
        </div>

        {/* Avatar & Cover */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">🖼️ 图片设置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">头像 URL</label>
              <input type="url" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-400 text-sm" />
              {form.avatarUrl && <img src={form.avatarUrl} alt="" className="mt-2 w-16 h-16 rounded-full object-cover" />}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">默认文章封面</label>
              <input type="url" value={form.defaultPostCover} onChange={(e) => setForm({ ...form, defaultPostCover: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-400 text-sm" />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">🔗 社交链接</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "github", label: "GitHub", icon: "🐙" },
              { key: "twitter", label: "Twitter", icon: "🐦" },
              { key: "email", label: "Email", icon: "📧" },
              { key: "wechat", label: "微信", icon: "💬" },
            ].map(({ key, label, icon }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{icon} {label}</label>
                <input type="text" value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={key === "email" ? "your@email.com" : `https://${key}.com/...`} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-400 text-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">🎨 主题颜色</h2>
          <input type="text" value={form.themeColors} onChange={(e) => setForm({ ...form, themeColors: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-400 text-sm font-mono" />
          <p className="text-xs text-slate-400 mt-1">用逗号分隔的颜色值，如 #a18cd1, #fbc2eb</p>
          <div className="flex gap-2 mt-3">
            {form.themeColors.split(",").map((c, i) => (
              <span key={i} className="w-8 h-8 rounded-lg border border-slate-200" style={{ backgroundColor: c.trim() }} />
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900/30 p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2 text-red-500">🔒 安全设置</h2>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">管理密码</label>
            <input type="password" value={form.adminPassword} onChange={(e) => setForm({ ...form, adminPassword: e.target.value })} className="w-full max-w-xs px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-400 text-sm" />
            <p className="text-xs text-slate-400 mt-1">修改后需要重新登录</p>
          </div>
        </div>

        {/* Save button */}
        <button onClick={handleSave} className={`px-6 py-3 rounded-xl text-white font-medium transition-all ${saved ? "bg-green-500" : "bg-indigo-500 hover:bg-indigo-600"}`}>
          {saved ? "✅ 已保存" : "保存设置"}
        </button>
      </div>
    </div>
  );
}
