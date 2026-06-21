"use client";
import { useState, useEffect } from "react";

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
}

interface Props { slug: string }

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m}分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}小时前`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}天前`;
  return new Date(date).toLocaleDateString("zh-CN");
}

export default function CommentBar({ slug }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(d => { if (d.comments) setComments(d.comments); })
      .catch(() => {});
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true); setMsg("");
    try {
      const r = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, author, content }),
      });
      const d = await r.json();
      if (d.comment) {
        setComments(prev => [d.comment, ...prev]);
        setContent(""); setAuthor("");
        setMsg("✅ 留言成功");
      } else {
        setMsg(`❌ ${d.error || "提交失败"}`);
      }
    } catch { setMsg("❌ 网络错误"); }
    finally { setSubmitting(false); }
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="glass-card p-6 mt-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        💬 聊天栏 <span className="text-sm font-normal text-slate-400">({comments.length})</span>
      </h2>

      {/* 留言列表 */}
      {comments.length === 0 && (
        <p className="text-slate-400 text-sm text-center py-6">还没有人留言，来抢沙发吧~</p>
      )}
      <div className="space-y-4 mb-6">
        {comments.map(c => (
          <div key={c.id} className="flex gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {c.author.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-medium text-sm">{c.author}</span>
                <span className="text-xs text-slate-500">{timeAgo(c.date)}</span>
              </div>
              <p className="text-sm text-slate-300 whitespace-pre-wrap break-words leading-relaxed">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 留言表单 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="你的昵称（选填）"
          maxLength={30}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-400 transition-colors"
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="说点什么吧…"
          rows={3}
          maxLength={2000}
          required
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-400 transition-colors resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">{content.length}/2000</span>
          <div className="flex items-center gap-3">
            {msg && <span className="text-xs">{msg}</span>}
            <button type="submit" disabled={submitting || !content.trim()}
              className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white text-sm rounded-lg transition-colors">
              {submitting ? "发送中…" : "发布留言"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
