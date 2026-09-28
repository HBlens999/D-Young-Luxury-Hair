import React, { useState, useEffect } from 'react';
import { VideoItem } from '../../types';
import { db, supabase } from '../../lib/supabase';
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Video,
  Upload,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

export const AdminVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadVideos = async () => {
    try {
      const data = await db.getVideos();
      setVideos(data);
    } catch (error) {
      console.error('Failed to load videos:', error);
      setFeedback('Could not load videos.');
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleStartNew = () => {
    setVideoFile(null);
    setThumbnailFile(null);

    setEditingVideo({
      id: 'vid-' + Date.now(),
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      category: 'Product Showcase',
      duration: '',
      isPublished: true,
      createdAt: new Date().toISOString()
    });
  };

  const uploadFile = async (
    file: File,
    folder: string
  ): Promise<string> => {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const extension =
      file.name.split('.').pop()?.toLowerCase() ||
      (file.type === 'video/mp4' ? 'mp4' : 'jpg');

    const safeName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .toLowerCase();

    const filePath = `videos/${folder}/${safeName}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from('website-images')
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: false
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage
      .from('website-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleVideoSelect = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showFeedback('Please select a video file.');
      return;
    }

    const maxSize = 150 * 1024 * 1024;

    if (file.size > maxSize) {
      showFeedback('Video is too large. Please keep it below 150MB.');
      return;
    }

    setVideoFile(file);

    // Try to automatically read the video's duration.
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      const seconds = Math.round(video.duration);

      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      const duration =
        `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

      setEditingVideo((current) =>
        current
          ? {
              ...current,
              duration
            }
          : current
      );

      URL.revokeObjectURL(video.src);
    };

    video.src = URL.createObjectURL(file);
  };

  const handleThumbnailSelect = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('Please select an image for the thumbnail.');
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      showFeedback('Thumbnail is too large. Please keep it below 10MB.');
      return;
    }

    setThumbnailFile(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingVideo) return;

    if (!editingVideo.title.trim()) {
      showFeedback('Please enter a video title.');
      return;
    }

    if (!editingVideo.videoUrl && !videoFile) {
      showFeedback('Please choose a video file.');
      return;
    }

    try {
      setSaving(true);

      let videoUrl = editingVideo.videoUrl;
      let thumbnailUrl = editingVideo.thumbnailUrl;

      // Upload video
      if (videoFile) {
        setUploadingVideo(true);
        showFeedback('Uploading video...');

        videoUrl = await uploadFile(videoFile, 'files');

        setUploadingVideo(false);
      }

      // Upload thumbnail
      if (thumbnailFile) {
        setUploadingThumbnail(true);
        showFeedback('Uploading thumbnail...');

        thumbnailUrl = await uploadFile(thumbnailFile, 'thumbnails');

        setUploadingThumbnail(false);
      }

      const finalVideo: VideoItem = {
        ...editingVideo,
        videoUrl,
        thumbnailUrl
      };

      await db.saveVideo(finalVideo);

      showFeedback(`Video "${finalVideo.title}" saved successfully.`);

      setEditingVideo(null);
      setVideoFile(null);
      setThumbnailFile(null);

      await loadVideos();
    } catch (error: any) {
      console.error('Video save failed:', error);

      setUploadingVideo(false);
      setUploadingThumbnail(false);

      showFeedback(
        error?.message ||
        'Video could not be saved. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete video "${title}"?`)) return;

    try {
      await db.deleteVideo(id);

      showFeedback(`Video "${title}" deleted.`);
      await loadVideos();
    } catch (error: any) {
      console.error('Video delete failed:', error);
      showFeedback(
        error?.message || 'Video could not be deleted.'
      );
    }
  };

  const videoPreview =
    videoFile && URL.createObjectURL(videoFile);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE2D7] pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
            Video Showcase CMS
          </h1>

          <p className="text-xs text-[#8C6A48] mt-1 font-light">
            Upload and manage your product videos directly from the dashboard.
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

      {/* Feedback */}
      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {videos.map((vid) => (
          <div
            key={vid.id}
            className="bg-white border border-[#EAE2D7] overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] bg-black">

              {vid.thumbnailUrl ? (
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/60">
                  <Video className="w-10 h-10" />
                </div>
              )}

              {vid.duration && (
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5">
                  {vid.duration}
                </span>
              )}
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
                onClick={() => {
                  setVideoFile(null);
                  setThumbnailFile(null);
                  setEditingVideo(vid);
                }}
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

      {/* Empty State */}
      {videos.length === 0 && (
        <div className="border border-dashed border-[#D6C2A7] p-12 text-center">
          <Video className="w-10 h-10 mx-auto text-[#8C6A48] mb-3" />

          <p className="font-serif text-lg text-[#291C16]">
            No videos yet
          </p>

          <p className="text-xs text-[#8C6A48] mt-1">
            Click "Add New Video" to upload your first video.
          </p>
        </div>
      )}

      {/* Video Editor Modal */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">

          <div className="w-full max-w-lg bg-white border border-[#EAE2D7] shadow-2xl p-6 space-y-4 my-8">

            <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-3">

              <div>
                <h2 className="font-serif text-lg font-bold text-[#291C16]">
                  Upload Video
                </h2>

                <p className="text-[11px] text-[#8C6A48] mt-1">
                  Upload the video directly from your device.
                </p>
              </div>

              <button
                onClick={() => {
                  if (!saving) {
                    setEditingVideo(null);
                    setVideoFile(null);
                    setThumbnailFile(null);
                  }
                }}
                className="p-1 text-[#8C6A48]"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">

              {/* Video Upload */}
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Video File *
                </label>

                <label className="border-2 border-dashed border-[#D6C2A7] bg-[#FBF9F5] p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F4EFEA] transition-colors">

                  <Upload className="w-7 h-7 text-[#8C6A48] mb-2" />

                  <span className="font-semibold text-[#291C16]">
                    {videoFile
                      ? videoFile.name
                      : editingVideo.videoUrl
                        ? 'Existing video uploaded'
                        : 'Choose video from device'}
                  </span>

                  <span className="text-[10px] text-[#8C6A48] mt-1">
                    MP4 recommended · Maximum 150MB
                  </span>

                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    disabled={saving}
                    onChange={(e) =>
                      handleVideoSelect(
                        e.target.files?.[0] || null
                      )
                    }
                  />
                </label>

                {videoFile && (
                  <div className="mt-2 bg-[#F4EFEA] p-2 text-[10px] text-[#6B5344]">
                    Selected: {videoFile.name}
                  </div>
                )}

                {videoPreview && (
                  <video
                    src={videoPreview}
                    controls
                    className="w-full mt-3 max-h-52 bg-black"
                  />
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Video Title *
                </label>

                <input
                  type="text"
                  required
                  value={editingVideo.title}
                  onChange={(e) =>
                    setEditingVideo({
                      ...editingVideo,
                      title: e.target.value
                    })
                  }
                  placeholder="e.g. SDD Vietnamese Bone Straight Comb Through"
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Thumbnail Image
                </label>

                <label className="border border-[#D6C2A7] bg-[#FBF9F5] p-4 flex items-center gap-3 cursor-pointer hover:bg-[#F4EFEA]">

                  <ImageIcon className="w-5 h-5 text-[#8C6A48]" />

                  <div>
                    <span className="block font-semibold text-[#291C16]">
                      {thumbnailFile
                        ? thumbnailFile.name
                        : 'Choose thumbnail image'}
                    </span>

                    <span className="text-[10px] text-[#8C6A48]">
                      JPG, PNG or WEBP
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={saving}
                    onChange={(e) =>
                      handleThumbnailSelect(
                        e.target.files?.[0] || null
                      )
                    }
                  />

                </label>

                {editingVideo.thumbnailUrl && !thumbnailFile && (
                  <img
                    src={editingVideo.thumbnailUrl}
                    alt="Current thumbnail"
                    className="w-full aspect-video object-cover mt-2"
                  />
                )}
              </div>

              {/* Category + Duration */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                    Category
                  </label>

                  <input
                    type="text"
                    value={editingVideo.category}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        category: e.target.value
                      })
                    }
                    placeholder="Product Showcase"
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                    Duration
                  </label>

                  <input
                    type="text"
                    value={editingVideo.duration}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        duration: e.target.value
                      })
                    }
                    placeholder="0:45"
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                  />
                </div>

              </div>

              {/* Description */}
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Brief Description
                </label>

                <textarea
                  rows={3}
                  value={editingVideo.description}
                  onChange={(e) =>
                    setEditingVideo({
                      ...editingVideo,
                      description: e.target.value
                    })
                  }
                  placeholder="Briefly describe this video..."
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              {/* Published */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingVideo.isPublished}
                  onChange={(e) =>
                    setEditingVideo({
                      ...editingVideo,
                      isPublished: e.target.checked
                    })
                  }
                />

                <span className="text-[#291C16]">
                  Publish this video on the website
                </span>
              </label>

              {/* Buttons */}
              <div className="pt-4 border-t border-[#F4EFEA] flex justify-end gap-2">

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setEditingVideo(null);
                    setVideoFile(null);
                    setThumbnailFile(null);
                  }}
                  className="px-4 py-2 border border-[#D6C2A7] text-[#4A3326]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#291C16] text-white font-semibold uppercase tracking-wider cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        {uploadingVideo
                          ? 'Uploading Video...'
                          : uploadingThumbnail
                            ? 'Uploading Thumbnail...'
                            : 'Saving...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Video</span>
                    </>
                  )}

                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
