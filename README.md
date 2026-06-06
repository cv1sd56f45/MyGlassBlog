#我的玻璃博客 ✨

一个优雅的毛玻璃风格个人博客系统，基于 Next.js 15 构建，支持暗色模式、Markdown 文章、说说、相册、友链、时间线等丰富功能。

> 灵感来源：[XinghuisamaBlogs](https://github.com/Xinghuisama/XinghuisamaBlogs) ，做了大幅简化，适合快速搭建自己的博客。

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?style=flat-square&logo=tailwindcss)
![许可证](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🌟 特性

- **毛玻璃设计**— 玻璃质感背景搭配渐变色光晕，优雅而不刺眼
- **暗色模式** — 支持亮/暗主题自动切换，适配系统偏好
- **Markdown 写作** — 使用 Markdown 写文章，支持 GFM 语法、代码高亮
- **说说功能** — 随时记录碎片化的想法和心情
- **照片墙** — 展示生活中的精彩瞬间
- **友链系统** — 收录志同道合的博客朋友们
- **时间线** — 记录人生的里程碑时刻
- **轻量快速** — 移除重型动画库，首屏 JS 仅 ~110 kB
- **静态生成** — Vercel 部署即享全球 CDN 加速
- **管理员后台** — 浏览器内直接管理文章、说说、相册和站点设置

---

## 📂 项目结构

```
MyGlassBlog/
├── app/                    # Next.js App Router
│   ├── admin/              # 管理员后台
│   │   ├── dashboard/       # 仪表盘
│   │   ├── posts/          # 文章管理（列表/新建/编辑）
│   │   ├── chatters/       # 说说管理
│   │   ├── photowall/      # 照片墙管理
│   │   ├── friends/        # 友链管理
│   │   └── settings/       # 站点设置
│   ├── api/admin/          # 管理后台 API
│   ├── posts/              # 文章列表 & 文章详情
│   ├── chatter/            # 说说页面
│   ├── photowall/          # 照片墙页面
│   ├── friends/            # 友链页面
│   ├── about/              # 关于页面
│   └── timeline/           # 时间线页面
├── components/             # 可复用组件
├── posts/                  # Markdown 文章（敲字即发布）
├── chatters/               # 说说内容
├── siteConfig.ts           # 全站配置文件
└── package.json
```

---

## 🚀 快速开始

### 环境要求

- Node.js 18.17+
- npm / pnpm / yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/MyGlassBlog.git
cd MyGlassBlog

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可预览。

### 构建生产版本

```bash
npm run build
npm start
```

---

## ⚙️ 配置

### 站点信息

编辑 `siteConfig.ts` 即可修改全站配置：

```ts
export const siteConfig = {
  title: "我的博客",           // 网站标题
  authorName: "你的名字",      // 作者名
  bio: "在这里记录生活...",     // 个人简介
  avatarUrl: "头像图片地址",    // 头像

  navTitle: "MyBlog",          // 导航栏名称
  themeColors: [               // 背景渐变色（建议2-4个颜色）
    "#a18cd1",
    "#fbc2eb",
    "#a1c4fd",
    "#c2e9fb",
  ],
  defaultPostCover: "默认封面图 URL",

  social: {
    github: "https://github.com/yourusername",
    twitter: "",
    email: "your@email.com",
    wechat: "",
  },

  buildDate: "2026-06-06T00:00:00",
};
```

### 发布文章

在 `posts/` 目录下创建 `.md` 文件，文件开头添加 Frontmatter：

```markdown
---
title: 我的第一篇文章
date: 2026-06-06
category: 随笔
description: 这是文章摘要
cover: https://example.com/cover.jpg
---

这里是正文内容，支持 Markdown 语法...
```

### 发布说说

在 `chatters/` 目录下创建 `.md` 文件：

```markdown
---
date: 2026-06-06
---

今天天气真好，适合写代码 🚀
```

### 管理员后台

访问 `/admin`，默认登录密码：**`admin123`**

后台支持：
- 📝 新建 / 编辑 / 删除文章
- 💬 发布 / 删除说说
- 🖼️ 管理照片墙图片
- 🔗 添加 / 编辑 / 删除友链
- ⚙️ 修改站点基本信息、社交链接、主题颜色、管理密码

---

## 🌐 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/MyGlassBlog)

1. Fork 本仓库
2. 在 Vercel 中导入项目（Vercel 会自动检测 Next.js）
3. 点击 Deploy，片刻后即可获得你的博客地址

> ⚠️ **注意**：管理员后台（`/admin`）依赖服务端 API 路由，**必须使用 Vercel 的 Serverless Function**（保持默认部署设置即可，无需手动配置）。

---

## 🎨 定制主题颜色

在 `siteConfig.ts` 中修改 `themeColors`，支持任意数量的颜色，背景会生成对应颜色的动态渐变。例如：

```ts
// 紫色系
主题颜色：["#a18cd1", "#fbc2eb"]

// 蓝色系
主题颜色：["#2193b0", "#6dd5ed"]

// 绿色系
主题颜色：["#11998e", "#38ef7d"]
```

---

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| [Next.js 15](https://nextjs.org/) | React 全栈框架，App Router + 静态生成 |
| [React 18](https://react.dev/) | UI 库 |
| [TypeScript 5](https://www.typescriptlang.org/) | 类型安全 |
| [Tailwind CSS 4](https://tailwindcss.com/) | 原子化 CSS |
| [Lucide React](https://lucide.dev/) | 图标库 |
| [gray-matter](https://github.com/jonschlinkert/gray-matter) | Frontmatter 解析 |
| [remark](https://remark.js.org/) | Markdown → HTML |
| [Vercel](https://vercel.com/) | 部署平台 |

---

##许可证

MIT © 2026 你的名字

---

*如果这个项目对你有帮助，欢迎 Star ⭐ 和 Fork！有问题可以提 Issue。*
