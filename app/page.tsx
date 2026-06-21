import fs from "fs";
import path from "path";
import matter from "gray-matter";
import HomeClient from "../components/HomeClient";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const postsDir = path.join(process.cwd(), "posts");
  let allPosts: any[] = [];
  try {
    if (fs.existsSync(postsDir)) {
      allPosts = fs.readdirSync(postsDir)
        .filter((f: string) => f.endsWith(".md"))
        .map((fileName: string) => {
          const { data, content } = matter(fs.readFileSync(path.join(postsDir, fileName), "utf8"));
          return { slug: fileName.replace(/\.md$/, ""), ...data, content, date: data.date || "2026-01-01" };
        })
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  } catch {}

  const chattersDir = path.join(process.cwd(), "chatters");
  let allChatters: any[] = [];
  try {
    if (fs.existsSync(chattersDir)) {
      allChatters = fs.readdirSync(chattersDir)
        .filter((f: string) => f.endsWith(".md"))
        .map((fileName: string) => {
          const { data, content } = matter(fs.readFileSync(path.join(chattersDir, fileName), "utf8"));
          return { slug: fileName.replace(/\.md$/, ""), ...data, content, date: data.date || "2026-01-01" };
        })
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  } catch {}

  return (
    <HomeClient
      topPosts={allPosts.slice(0, 6)}
      topChatters={allChatters.slice(0, 5)}
    />
  );
}
