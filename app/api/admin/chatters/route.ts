import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { detectText } from "../../../../lib/apis";

const CHATTERS_DIR = path.join(process.cwd(), "chatters");

function getChatters() {
  if (!fs.existsSync(CHATTERS_DIR)) return [];
  return fs.readdirSync(CHATTERS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(CHATTERS_DIR, f), "utf8"));
      return { slug: f.replace(/\.md$/, ""), ...(data as Record<string, unknown>), content };
    })
    .sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
}

export async function GET() {
  try {
    return NextResponse.json({ chatters: getChatters() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, slug, date, content } = body;

    if (!fs.existsSync(CHATTERS_DIR)) fs.mkdirSync(CHATTERS_DIR, { recursive: true });

    if (action === "create") {
      // AI违禁词检测
      let violationWarning: string | null = null;
      if (content?.trim()) {
        detectText(content.slice(0, 1000)).then((result) => {
          if (result && result.is_violation) {
            console.warn(`[AI Detect] 说说检测到风险: ${result.keywords?.join(", ")}`);
          }
        }).catch(() => {});
      }

      const safeSlug = slug || `chatter-${Date.now()}`;
      const filePath = path.join(CHATTERS_DIR, `${safeSlug}.md`);
      const frontmatter = { date: date || new Date().toISOString().split("T")[0] };
      const md = matter.stringify(content || "", frontmatter);
      fs.writeFileSync(filePath, md, "utf8");
      return NextResponse.json({ success: true, slug: safeSlug, violationWarning });
    }

    if (action === "delete") {
      if (!slug) return NextResponse.json({ error: "缺少slug" }, { status: 400 });
      const filePath = path.join(CHATTERS_DIR, `${slug}.md`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "未知操作" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
