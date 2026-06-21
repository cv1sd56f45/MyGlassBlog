import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";

export default function LatestChatters({ chatters }: { chatters: any[] }) {
  if (chatters.length === 0) {
    return (
      <div className="glass-card p-6 text-center text-slate-500 dark:text-slate-400">
        <p>暂无说说~</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <MessageCircle size={20} className="text-pink-500" /> 最新说说
        </h2>
        <Link href="/chatter" className="text-xs text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
          更多 <ArrowRight size={12} />
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {chatters.map((c: any, i: number) => (
          <Link key={c.slug} href={`/chatter/${c.slug}`} className="glass-card p-4 group">
            <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 group-hover:text-indigo-500 transition-colors">
              {c.title || c.content?.substring(0, 100) || ""}
            </p>
            <div className="text-xs text-slate-400 mt-2">{c.date}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
