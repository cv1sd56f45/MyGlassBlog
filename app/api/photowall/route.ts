import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkNsfw } from "../../../lib/apis";

const PHOTOS_DIR = path.join(process.cwd(), "public", "photowall");
const INDEX_FILE = path.join(process.cwd(), "content", "photowall.json");

function readIndex(): string[] {
  try {
    return JSON.parse(fs.readFileSync(INDEX_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeIndex(urls: string[]) {
  fs.writeFileSync(INDEX_FILE, JSON.stringify(urls, null, 2));
}

// GET /api/photowall
export async function GET() {
  return NextResponse.json(readIndex());
}

// POST /api/photowall — 上传文件或添加URL（自动NSFW检测）
export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "未提供文件" }, { status: 400 });

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    if (!["jpg","jpeg","png","gif","webp","avif","bmp"].includes(ext)) {
      return NextResponse.json({ error: "不支持的图片格式" }, { status: 400 });
    }
    const safeName = `${Date.now()}.${ext}`;
    const filePath = path.join(PHOTOS_DIR, safeName);
    fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));

    const url = `/photowall/${safeName}`;
    const photos = readIndex();
    photos.unshift(url);
    writeIndex(photos);

    return NextResponse.json({ url, warning: null });
  }

  // URL 添加 — 自动NSFW检测
  const body = await request.json();
  const { url } = body;
  if (!url) return NextResponse.json({ error: "缺少 url" }, { status: 400 });

  // 异步检测，不阻塞返回
  checkNsfw(url).then((result) => {
    if (result && result.is_nsfw && result.nsfw_probability > 0.7) {
      // 记录高风险图片到日志（实际可改为自动删除或标记）
      console.warn(`[NSFW Warning] ${url} 概率: ${result.nsfw_probability}`);
    }
  }).catch(() => {});

  const photos = readIndex();
  photos.unshift(url);
  writeIndex(photos);

  return NextResponse.json({ url });
}

// DELETE /api/photowall?url=xxx
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) return NextResponse.json({ error: "缺少 url" }, { status: 400 });

  if (url.startsWith("/photowall/")) {
    const filePath = path.join(process.cwd(), "public", url.replace(/^\//, ""));
    try { fs.unlinkSync(filePath); } catch {}
  }

  writeIndex(readIndex().filter((p: string) => p !== url));
  return NextResponse.json({ ok: true });
}
