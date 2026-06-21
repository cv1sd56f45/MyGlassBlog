"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageCircle,
  Settings,
  Image as ImageIcon,
  Users,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

const menuItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "仪表盘" },
  { href: "/admin/posts", icon: FileText, label: "文章管理" },
  { href: "/admin/chatters", icon: MessageCircle, label: "说说管理" },
  { href: "/admin/photowall", icon: ImageIcon, label: "照片墙管理" },
  { href: "/admin/friends", icon: Users, label: "友链管理" },
  { href: "/admin/settings", icon: Settings, label: "站点设置" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "ok") {
      setLoggedIn(true);
      setShowLogin(false);
    }
  }, []);

  const handleLogin = () => {
    // 默认密码: admin123，可在 settings 中修改
    if (password === "admin123") {
      sessionStorage.setItem("admin_auth", "ok");
      setLoggedIn(true);
      setShowLogin(false);
    } else {
      alert("密码错误");
    }
  };

  if (!loggedIn || showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="glass-card p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <ShieldCheck className="w-8 h-8 text-indigo-500" />
            <h1 className="text-2xl font-bold">管理员登录</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="请输入管理员密码"
            className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-700/60 border border-white/40 dark:border-slate-600/40 outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
          />
          <button
            onClick={handleLogin}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold hover:opacity-90 transition-opacity"
          >
            登录
          </button>
          <p className="text-xs text-slate-400 mt-3 text-center">默认密码：admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md z-30">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-indigo-500">
            <ShieldCheck size={24} />
            管理后台
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors duration-200 ${
                  isActive
                    ? "bg-indigo-500 text-white font-medium"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => { sessionStorage.removeItem("admin_auth"); setShowLogin(true); setLoggedIn(false); }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
          >
            <LogOut size={18} /> 退出登录
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-indigo-500">🛡️ 管理后台</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setSidebarOpen(false)}>
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 pt-16 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm ${
                    isActive ? "bg-indigo-500 text-white font-medium" : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
