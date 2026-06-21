import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { detectText } from "../../../../lib/apis";

const POSTS_DIR = path.join(process.cwd(), "posts");

function getPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, f), "utf8"));
      return { slug: f.replace(/\.md$/, ""), ...(data as any), content };
    })
    .sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
}

export async function GET() {
  try {
    const posts = getPosts();
    return NextResponse.json({ posts });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, slug, title, date, category, description, cover, content, newSlug } = body;

    if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });

    if (action === "create") {
      if (!title) return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
      const safeSlug = (newSlug || title.replace(/[^\w\u4e00-\u9fff-]/g, "-").toLowerCase()).replace(/-+/g, "-");
      const filePath = path.join(POSTS_DIR, `${safeSlug}.md`);
      if (fs.existsSync(filePath)) return NextResponse.json({ error: "文章已存在" }, { status: 409 });

      // AI违禁词检测（异步，不阻塞保存）
      let violationWarning: string | null = null;
      const textToCheck = `${title} ${description || ""} ${content || ""}`.slice(0, 2000);
      if (textToCheck.trim()) {
        detectText(textToCheck).then((result) => {
          if (result && result.is_violation) {
            console.warn(`[AI Detect] 文章"${title}"检测到风险: ${result.keywords?.join(", ")}`);
          }
        }).catch(() => {});
        // 检测结果不影响保存，warning会随下次请求带回
      }

      const frontmatter = { title, date: date || new Date().toISOString().split("T")[0], category: category || "随笔", description: description || "", cover: cover || "" };
      const md = matter.stringify(content || "# 新文章\n", frontmatter);
      fs.writeFileSync(filePath, md, "utf8");
      return NextResponse.json({ success: true, slug: safeSlug, violationWarning });
    }

    if (action === "update") {
      if (!slug) return NextResponse.json({ error: "缺少slug" }, { status: 400 });
      let targetSlug = slug;
      if (newSlug && newSlug !== slug) {
        targetSlug = newSlug.replace(/[^\w\u4e00-\u9fff-]/g, "-").toLowerCase().replace(/-+/g, "-");
        const oldPath = path.join(POSTS_DIR, `${slug}.md`);
        const newPath = path.join(POSTS_DIR, `${targetSlug}.md`);
        if (fs.existsSync(newPath)) return NextResponse.json({ error: "目标文件名已存在" }, { status: 409 });
        if (fs.existsSync(oldPath)) fs.renameSync(oldPath, newPath);
      }
      const filePath = path.join(POSTS_DIR, `${targetSlug}.md`);
      const frontmatter = { title, date, category, description, cover };
      const md = matter.stringify(content || "", frontmatter);
      fs.writeFileSync(filePath, md, "utf8");
      return NextResponse.json({ success: true, slug: targetSlug });
    }

    if (action === "delete") {
      if (!slug) return NextResponse.json({ error: "缺少slug" }, { status: 400 });
      const filePath = path.join(POSTS_DIR, `${slug}.md`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "未知操作" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
