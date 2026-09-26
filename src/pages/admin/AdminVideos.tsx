import React, { useState, useEffect } from 'react';
import { VideoItem } from '../../types';
import { db } from '../../lib/supabase';
import { Plus, Trash2, Edit3, Check, X, Video } from 'lucide-react';

export const AdminVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadVideos = async () => {
    const data = await db.getVideos();
    setVideos(data);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleStartNew = () => {
    setEditingVideo({
      id: 'vid-' + Date.now(),
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      category: 'Product Showcase',
      duration: '1:00',
      isPublished: true,
      createdAt: new Date().toISOString()
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo || !editingVideo.title.trim() || !editingVideo.videoUrl.trim()) return;

    await db.saveVideo(editingVideo);
    setFeedback(`Video "${editingVideo.title}" saved.`);
    setTimeout(() => setFeedback(null), 3000);
    setEditingVideo(null);
    loadVideos();
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete video "${title}"?`)) {
      await db.deleteVideo(id);
      setFeedback(`Video "${title}" deleted.`);
      setTimeout(() => setFeedback(null), 3000);
      loadVideos();
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE2D7] pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
            Video Showcase CMS
          </h1>
          <p className="text-xs text-[#8C6A48] mt-1 font-light">
            Manage YouTube and external video links for product showcases, unboxings, and comb-through reviews.
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="px-4 py-2 bg-[#291C16] text-[#FDFCF7] text-xs uppercase tracking-wider font-semibold hover:bg-[#4A3326] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Video</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid) => (
          <div key={vid.id} className="bg-white border border-[#EAE2D7] overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-[16/9] bg-black">
              <img
                src={vid.thumbnailUrl}
                alt={vid.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80"
              />
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5">
                {vid.duration}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold">
                {vid.category}
              </span>
              <h3 className="font-serif text-base font-bold text-[#291C16] line-clamp-1">
                {vid.title}
              </h3>
              <p className="text-xs text-[#6B5344] line-clamp-2 font-light">
                {vid.description}
              </p>
            </div>

            <div className="p-4 border-t border-[#F4EFEA] flex justify-end gap-2">
              <button
                onClick={() => setEditingVideo(vid)}
                className="p-1.5 border border-[#D6C2A7] hover:bg-[#F4EFEA] text-[#291C16] text-xs flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(vid.id, vid.title)}
                className="p-1.5 border border-red-200 hover:bg-red-50 text-red-700 text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Video Editor Modal */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-[#EAE2D7] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-3">
              <h2 className="font-serif text-lg font-bold text-[#291C16]">
                Configure Video Link
              </h2>
              <button onClick={() => setEditingVideo(null)} className="p-1 text-[#8C6A48]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  placeholder="e.g. SDD Vietnamese Bone Straight Comb Through"
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Video URL (YouTube or external MP4) *
                </label>
                <input
                  type="text"
                  required
                  value={editingVideo.videoUrl}
                  onChange={(e) => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Cover Thumbnail Image URL
                </label>
                <input
                  type="text"
                  value={editingVideo.thumbnailUrl}
                  onChange={(e) => setEditingVideo({ ...editingVideo, thumbnailUrl: e.target.value })}
                  placeholder="Image URL from assets or storage"
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingVideo.category}
                    onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                    placeholder="Product Showcase"
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                    Duration Display
                  </label>
                  <input
                    type="text"
                    value={editingVideo.duration}
                    onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                    placeholder="0:45"
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Brief Description
                </label>
                <textarea
                  rows={2}
                  value={editingVideo.description}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              <div className="pt-4 border-t border-[#F4EFEA] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 border border-[#D6C2A7] text-[#4A3326]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#291C16] text-white font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
