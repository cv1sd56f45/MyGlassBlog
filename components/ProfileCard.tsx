import { siteConfig } from "../siteConfig";
import { FileText, MessageCircle, Camera, Calendar } from "lucide-react";

export default function ProfileCard({ postCount, chatterCount }: { postCount: number; chatterCount: number }) {
  const stats = [
    { icon: FileText, label: "文章", value: postCount },
    { icon: MessageCircle, label: "说说", value: chatterCount },
    { icon: Camera, label: "照片", value: 0 },
    { icon: Calendar, label: "运行天数", value: Math.floor((Date.now() - new Date(siteConfig.buildDate).getTime()) / 86400000) },
  ];

  return (
    <div className="glass-card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <img
            src={siteConfig.avatarUrl}
            alt={siteConfig.authorName}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/50 dark:border-slate-700/50 shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 rounded-full border-3 border-white dark:border-slate-900" />
        </div>

        {/* Info */}
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">{siteConfig.authorName}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-4">{siteConfig.bio}</p>
          {/* Social links */}
          <div className="flex gap-3 justify-center sm:justify-start">
            {siteConfig.social.github && (
              <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/50 dark:bg-slate-700/50 flex items-center justify-center hover:bg-white/70 dark:hover:bg-slate-600/50 transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            )}
            {siteConfig.social.email && (
              <a href={`mailto:${siteConfig.social.email}`}
                className="w-9 h-9 rounded-full bg-white/50 dark:bg-slate-700/50 flex items-center justify-center hover:bg-white/70 dark:hover:bg-slate-600/50 transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              </a>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-3 text-center min-w-[80px]">
              <s.icon className="w-5 h-5 mx-auto mb-1 text-indigo-500" />
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
