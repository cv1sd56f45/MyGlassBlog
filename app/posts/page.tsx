import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import LatestPosts from "../../components/LatestPosts";
import Footer from "../../components/Footer";

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">📝 所有文章</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">共 {allPosts.length} 篇</p>
      </div>
      <LatestPosts posts={allPosts} />
      <Footer />
    </div>
  );
}
