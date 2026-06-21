"use client";
import { useState, useEffect, useRef } from "react";

export default function AdminPhotowall() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/photowall")
      .then((r) => r.json())
      .then((data) => setPhotos(data))
      .catch(() => setPhotos([]));
  }, []);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/photowall", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setPhotos((p) => [data.url, ...p]);
      }
    } finally {
      setUploading(false);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
      const input = fileInputRef.current;
      if (input) {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
      }
    }
  };

  const handleAddUrl = async () => {
    if (!newUrl.trim()) return;
    const res = await fetch("/api/photowall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: newUrl.trim() }),
    });
    const data = await res.json();
    if (data.url) {
      setPhotos((p) => [data.url, ...p]);
      setNewUrl("");
    }
  };

  const handleRemove = async (url: string) => {
    await fetch(`/api/photowall?url=${encodeURIComponent(url)}`, { method: "DELETE" });
    setPhotos((p) => p.filter((x) => x !== url));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">照片墙管理</h1>
        <p className="text-slate-500 text-sm mt-1">支持本地上传（推荐）和 URL 两种方式，共 {photos.length} 张</p>
      </div>

      {/* 上传区域 */}
      <div
        className={`bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed p-8 mb-6 text-center transition-colors ${
          dragOver ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-200 dark:border-slate-700"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="flex flex-col items-center gap-3">
            <img src={preview} alt="preview" className="h-32 object-contain rounded-lg" />
            <p className="text-sm text-slate-500">点击确认上传</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl">📷</div>
            <div>
              <p className="font-medium">拖拽图片到此处上传</p>
              <p className="text-sm text-slate-400 mt-1">或点击下方按钮选择文件</p>
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:opacity-50 transition-colors"
          >
            {uploading ? "上传中..." : "选择图片文件"}
          </button>
          {preview && (
            <button
              onClick={() => {
                const file = fileInputRef.current?.files?.[0];
                if (file) handleUpload(file);
              }}
              disabled={uploading}
              className="px-5 py-2.5 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              确认上传
            </button>
          )}
          {preview && (
            <button
              onClick={() => { setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              取消
            </button>
          )}
        </div>
      </div>

      {/* URL 添加 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-6">
        <h3 className="font-medium text-sm mb-3 text-slate-600 dark:text-slate-300">或者输入图片 URL</h3>
        <div className="flex gap-3">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-400 text-sm"
          />
          <button
            onClick={handleAddUrl}
            disabled={!newUrl.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:opacity-50 transition-colors"
          >
            添加
          </button>
        </div>
      </div>

      {/* 图片网格 */}
      {photos.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">🖼️</div>
          <p>还没有图片，上传或添加 URL 开始吧</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((url, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-square">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => handleRemove(url)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                title="删除"
              >
                ✕
              </button>
              <span className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full bg-black/50 text-white">#{index + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
