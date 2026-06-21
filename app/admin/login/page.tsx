"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("admin_auth");
      if (auth === "1") router.replace("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password === "admin123") {
      sessionStorage.setItem("admin_auth", "1");
      router.replace("/admin/dashboard");
    } else {
      setError("密码错误，请重试");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <Lock size={28} className="text-indigo-500" />
          </div>
          <h1 className="text-2xl font-bold">管理员登录</h1>
          <p className="text-sm text-slate-500 mt-2">请输入管理密码进入后台</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">管理密码</label>
            <div className="relative">
              <input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="输入密码" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-600/30 focus:border-indigo-400 outline-none" required />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>
          {error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors">登 录</button>
          <p className="text-xs text-slate-400 text-center mt-4">默认密码：admin123</p>
        </form>
      </div>
    </div>
  );
}
