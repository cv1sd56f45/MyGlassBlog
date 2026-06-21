import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET() {
  const postsDir = path.join(process.cwd(), "posts");
  const chattersDir = path.join(process.cwd(), "chatters");

  let posts = 0;
  let chatters = 0;
  let recentPosts: any[] = [];

  try {
    if (fs.existsSync(postsDir)) {
      const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
      posts = files.length;
      recentPosts = files
        .map((f) => {
          const { data } = matter(fs.readFileSync(path.join(postsDir, f), "utf8"));
          return { slug: f.replace(/\.md$/, ""), ...(data as any) };
        })
        .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
        .slice(0, 5);
    }
    if (fs.existsSync(chattersDir)) {
      chatters = fs.readdirSync(chattersDir).filter((f) => f.endsWith(".md")).length;
    }
  } catch {}

  return NextResponse.json({
    stats: { posts, chatters, photos: 9, friends: 1 },
    recentPosts,
  });
}
