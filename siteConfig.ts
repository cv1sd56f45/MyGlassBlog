// siteConfig.ts — 全站配置中心
export const siteConfig = {
  title: "My Glass Blog",
  authorName: "Your Name",
  bio: "在代码与生活的交汇处，记录每一次灵感的闪现。",
  avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=glassblog",
  faviconUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=glassblog",

  navTitle: "MyBlog",

  // 背景设置
  useGradient: true,
  themeColors: ["#a18cd1", "#fbc2eb", "#a1c4fd", "#c2e9fb"],

  // 默认文章封面
  defaultPostCover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop",

  // 社交链接
  social: {
    github: "https://github.com/yourusername",
    twitter: "",
    email: "your@email.com",
    wechat: "",
  },

  // 建站日期
  buildDate: "2026-06-06T00:00:00",

  // 天气配置（留空则不显示天气组件）
  // 城市名参考：https://xxapi.cn/doc/weatherDetails
  weather: {
    city: "",
  },
};
