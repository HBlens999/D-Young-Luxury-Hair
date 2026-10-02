import React, { useState, useEffect } from 'react';
import { VideoItem } from '../types';
import { db } from '../lib/supabase';
import { Play, X } from 'lucide-react';

interface VideosPageProps {
  onNavigate: (path: string) => void;
}

export const VideosPage: React.FC<VideosPageProps> = ({ onNavigate }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const cached = db.getCachedVideos();

      if (cached.length && active) {
        setVideos(cached.filter(v => v.isPublished));
        setIsLoading(false);
      }

      try {
        const data = await db.getVideos();
        if (active) setVideos(data.filter(v => v.isPublished));
      } catch (err) {
        console.error('Failed to load videos:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block">
          Visual Showcase
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#291C16]">
          Motion & Texture Videos
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5344] font-light leading-relaxed">
          Witness the fluid movement, full double drawn ends, and liquid glass shine of our Vietnamese hair under authentic lighting.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#8C6A48] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#EAE2D7] p-8">
          <p className="font-serif text-xl text-[#291C16]">No video showcases currently available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => setActiveVideo(vid)}
              className="group cursor-pointer bg-white border border-[#EAE2D7] hover:border-[#D6C2A7] overflow-hidden transition-all duration-300"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#B89865] text-[#1A1310] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                {vid.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5 tabular-nums">
                    {vid.duration}
                  </span>
                )}
              </div>

              <div className="p-5 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#8C6A48] font-medium block">
                  {vid.category}
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#291C16] group-hover:text-[#8C6A48] transition-colors leading-snug line-clamp-1">
                  {vid.title}
                </h3>
                <p className="text-xs text-[#6B5344] font-light line-clamp-2 leading-relaxed">
                  {vid.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-black border border-[#3E2D24] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-[#1A1310] border-b border-[#2E221C]">
              <h3 className="font-serif text-base text-[#FDFCF7] line-clamp-1">
                {activeVideo.title}
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-[#D6C2A7] hover:text-white p-1"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/9] w-full bg-black">
              {activeVideo.videoUrl.includes('youtube.com') || activeVideo.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={getEmbedUrl(activeVideo.videoUrl)}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="p-4 bg-[#1A1310] text-xs text-[#D6C2A7] font-light">
              {activeVideo.description}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
