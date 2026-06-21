import { Camera } from "lucide-react";
import Footer from "../../components/Footer";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

async function getPhotos(): Promise<string[]> {
  const indexFile = path.join(process.cwd(), "content", "photowall.json");
  const publicDir = path.join(process.cwd(), "public", "photowall");

  try {
    const saved: string[] = JSON.parse(fs.readFileSync(indexFile, "utf8"));
    if (saved.length > 0) return saved;
  } catch {}

  // fallback: public/photowall 目录里的文件
  try {
    if (fs.existsSync(publicDir)) {
      const files = fs.readdirSync(publicDir).filter((f) =>
        /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(f)
      );
      return files.map((f) => `/photowall/${f}`);
    }
  } catch {}

  return [];
}

export default async function PhotoWallPage() {
  const photos = await getPhotos();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Camera className="text-amber-500" /> 照片墙</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">定格美好瞬间</p>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-24 text-slate-400">
          <div className="text-6xl mb-4">📷</div>
          <p className="text-lg">还没有照片，去后台管理添加吧</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {photos.map((url, i) => (
            <div key={i} className="break-inside-avoid glass-card p-1.5 overflow-hidden group">
              <img
                src={url}
                alt=""
                className="w-full rounded-xl transition-transform duration-350 group-hover:scale-102"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}
