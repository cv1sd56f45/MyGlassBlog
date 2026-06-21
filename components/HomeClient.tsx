"use client";
import ProfileCard from "./ProfileCard";
import LatestPosts from "./LatestPosts";
import LatestChatters from "./LatestChatters";
import PhotoWallPreview from "./PhotoWallPreview";
import WeatherWidget from "./WeatherWidget";

export default function HomeClient({ topPosts, topChatters }: { topPosts: any[]; topChatters: any[] }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-fade-in-up mb-8" style={{ animationDelay: "0s" }}>
        <ProfileCard postCount={topPosts.length} chatterCount={topChatters.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div className="animate-fade-in-up" style={{ animationDelay: "0.08s" }}>
            <LatestPosts posts={topPosts} />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="animate-fade-in-up" style={{ animationDelay: "0.12s" }}>
            <WeatherWidget />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "0.16s" }}>
            <LatestChatters chatters={topChatters} />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "0.24s" }}>
            <PhotoWallPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
