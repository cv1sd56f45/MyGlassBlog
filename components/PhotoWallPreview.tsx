import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";

export default function PhotoWallPreview() {
  const samplePhotos = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&auto=format&fit=crop",
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Camera size={20} className="text-amber-500" /> 照片墙
        </h2>
        <Link href="/photowall" className="text-xs text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
          更多 <ArrowRight size={12} />
        </Link>
      </div>
      <Link href="/photowall" className="glass-card p-2 group">
        <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
          {samplePhotos.map((url, i) => (
            <div key={i} className="aspect-square overflow-hidden">
              <img src={url} alt="" className="w-full h-full object-cover transition-transform duration-350 group-hover:scale-105" />
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}
