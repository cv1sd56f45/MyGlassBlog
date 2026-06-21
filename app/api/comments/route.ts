import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const COMMENTS_DIR = path.join(process.cwd(), "comments");

function readComments(slug: string): any[] {
  const file = path.join(COMMENTS_DIR, `${slug}.json`);
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return []; }
}

function writeComments(slug: string, comments: any[]) {
  const file = path.join(COMMENTS_DIR, `${slug}.json`);
  fs.writeFileSync(file, JSON.stringify(comments, null, 2), "utf8");
}

// GET ?slug=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "缺少 slug" }, { status: 400 });
  return NextResponse.json({ comments: readComments(slug) });
}

// POST { slug, author, content }
export async function POST(request: NextRequest) {
  try {
    const { slug, author, content } = await request.json();
    if (!slug || !content?.trim()) {
      return NextResponse.json({ error: "slug 和 content 不能为空" }, { status: 400 });
    }
    if (!fs.existsSync(COMMENTS_DIR)) fs.mkdirSync(COMMENTS_DIR, { recursive: true });

    const comments = readComments(slug);
    const comment = {
      id: Date.now().toString(),
      author: (author || "匿名").trim().slice(0, 30),
      content: content.trim().slice(0, 2000),
      date: new Date().toISOString(),
      likes: 0,
    };
    comments.unshift(comment);
    writeComments(slug, comments);
    return NextResponse.json({ comment });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE ?slug=xxx&id=xxx
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const id = searchParams.get("id");
  if (!slug || !id) return NextResponse.json({ error: "缺少参数" }, { status: 400 });

  const comments = readComments(slug).filter(c => c.id !== id);
  writeComments(slug, comments);
  return NextResponse.json({ ok: true });
}
