import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import rehypeHighlight from "rehype-highlight";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Footer from "../../../components/Footer";
import CommentBar from "../../../components/CommentBar";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fullPath = path.join(process.cwd(), "posts", `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><h1 className="text-3xl font-bold">404</h1><p className="mt-4">文章不存在</p></div>;
  }

  const { data, content } = matter(fs.readFileSync(fullPath, "utf8"));

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  const html = processed.toString();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      {/* Header image */}
      <div className="glass-card overflow-hidden mb-6 -mt-2">
        <img src={data.cover || "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop"} alt="" className="w-full h-48 sm:h-64 object-cover" />
        <div className="p-6">
          <Link href="/posts" className="text-sm text-indigo-500 hover:text-indigo-600 flex items-center gap-1 mb-4">
            <ArrowLeft size={14} /> 返回列表
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">{data.title}</h1>
          {data.description && <p className="text-slate-500 dark:text-slate-400 mb-4">{data.description}</p>}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1"><Calendar size={14} /> {data.date}</span>
            {data.category && <span className="flex items-center gap-1"><Tag size={14} /> {data.category}</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <article
        className="glass-card p-6 sm:p-8 prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-indigo-500 prose-pre:rounded-xl prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* 评论区 */}
      <CommentBar slug={slug} />

      <Footer />
    </div>
  );
}
