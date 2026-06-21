import { Clock } from "lucide-react";
import Footer from "../../components/Footer";

const timeline = [
  { date: "2026-06-06", event: "博客正式上线 🎉", color: "bg-indigo-500" },
  { date: "2026-05-20", event: "开始搭建个人博客", color: "bg-pink-500" },
  { date: "2026-01-01", event: "新年快乐！开启新的旅程", color: "bg-green-500" },
];

export const dynamic = 'force-dynamic';

export default function TimelinePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Clock className="text-blue-500" /> 时间线</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">记录成长的每一个节点</p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-pink-500 to-amber-500" />

        <div className="flex flex-col gap-6">
          {timeline.map((item, i) => (
            <div key={i} className="flex items-start gap-4 relative">
              {/* Dot */}
              <div className={`w-3 h-3 rounded-full ${item.color} mt-1.5 z-10 shrink-0 ring-4 ring-white dark:ring-slate-900`} />
              <div className="glass-card p-5 flex-1">
                <div className="text-xs text-slate-400 mb-1">{item.date}</div>
                <div className="font-medium">{item.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
