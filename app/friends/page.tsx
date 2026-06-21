import Link from "next/link";
import { Users } from "lucide-react";
import Footer from "../../components/Footer";

const friends = [
  {
    name: "示例友链",
    bio: "这是一个示例友链",
    url: "https://example.com",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=friend1",
  },
];

export const dynamic = 'force-dynamic';

export default function FriendsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Users className="text-indigo-500" /> 友情链接</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">互联网上的朋友们</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map((f) => (
          <a key={f.name} href={f.url} target="_blank" rel="noopener noreferrer" className="glass-card p-5 group hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-3">
              <img src={f.avatar} alt="" className="w-12 h-12 rounded-full" />
              <h3 className="font-bold group-hover:text-indigo-500 transition-colors">{f.name}</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{f.bio}</p>
          </a>
        ))}
      </div>
      <Footer />
    </div>
  );
}
