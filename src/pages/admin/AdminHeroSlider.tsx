import React, { useEffect, useState } from 'react';
import {
  Upload,
  Save,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';
import { db, supabase } from '../../lib/supabase';
import { HeroSlide } from '../../types';
import { HERO_SLIDES } from '../../lib/initialData';

const WEBSITE_IMAGE_BUCKET = 'website-images';

const createSlide = (index: number): HeroSlide => ({
  id: `hero-slide-${Date.now()}-${index}`,
  image: '',
  title: 'New Luxury Hair Collection',
  subtitle: 'Premium Quality & Unmatched Beauty',
  tagline: 'Luxury Hair · Authentic Quality · Nationwide Delivery',
  ctaPrimary: 'Shop Collection',
  ctaSecondary: 'Order via WhatsApp',
  link: '/shop',
  displayOrder: index,
  isPublished: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const optimizeImage = (
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.86
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      try {
        let width = image.width;
        let height = image.height;

        const scale = Math.min(
          maxWidth / width,
          maxHeight / height,
          1
        );

        width = Math.round(width * scale);
        height = Math.round(height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');

        if (!context) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Could not prepare image.'));
          return;
        }

        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          blob => {
            URL.revokeObjectURL(objectUrl);

            if (!blob) {
              reject(new Error('Could not optimize image.'));
              return;
            }

            const optimizedFile = new File(
              [blob],
              `hero-${Date.now()}.webp`,
              {
                type: 'image/webp',
                lastModified: Date.now()
              }
            );

            resolve(optimizedFile);
          },
          'image/webp',
          quality
        );
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        reject(error);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not read the selected image.'));
    };

    image.src = objectUrl;
  });
};

export const AdminHeroSlider: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const saved = await db.getHeroSlides();

      if (saved.length > 0) {
        setSlides(
          [...saved].sort((a, b) => a.displayOrder - b.displayOrder)
        );
      } else {
        const initialSlides: HeroSlide[] = HERO_SLIDES.map((slide, index) => ({
          id: slide.id,
          image: slide.image,
          title: slide.title,
          subtitle: slide.subtitle,
          tagline: slide.tagline,
          ctaPrimary: slide.ctaPrimary,
          ctaSecondary: slide.ctaSecondary,
          link: slide.link,
          displayOrder: index,
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));

        setSlides(initialSlides);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load hero slides.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSlide = (
    id: string,
    field: keyof HeroSlide,
    value: string | number | boolean
  ) => {
    setSlides(prev =>
      prev.map(slide =>
        slide.id === id
          ? {
              ...slide,
              [field]: value,
              updatedAt: new Date().toISOString()
            }
          : slide
      )
    );
  };

  const handleImageUpload = async (id: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('Image is too large. Please select an image below 50MB.');
      return;
    }

    setError(null);
    setStatus(null);
    setUploadingId(id);

    try {
      setStatus('Preparing hero image for fast upload...');

      const optimizedFile = await optimizeImage(
        file,
        1920,
        1080,
        0.86
      );

      setStatus('Hero image optimized. Uploading...');

      if (!supabase) {
        throw new Error('Supabase is not configured.');
      }

      const filePath = `hero/${id}-${Date.now()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from(WEBSITE_IMAGE_BUCKET)
        .upload(filePath, optimizedFile, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: publicUrlData
      } = supabase.storage
        .from(WEBSITE_IMAGE_BUCKET)
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      if (!publicUrl) {
        throw new Error('Could not create the image URL.');
      }

      updateSlide(id, 'image', publicUrl);

      setStatus(
        'Hero image uploaded successfully. Click Save Slide to apply it.'
      );

      setTimeout(() => setStatus(null), 4000);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to upload hero image.'
      );
    } finally {
      setUploadingId(null);
    }
  };

  const saveSlide = async (slide: HeroSlide) => {
    setSavingId(slide.id);
    setError(null);

    try {
      await db.saveHeroSlide({
        ...slide,
        updatedAt: new Date().toISOString()
      });

      setStatus(`"${slide.title}" saved successfully.`);
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setError('Unable to save this slide.');
    } finally {
      setSavingId(null);
    }
  };

  const deleteSlide = async (id: string) => {
    const slide = slides.find(item => item.id === id);

    if (!slide) return;

    const confirmed = window.confirm(
      `Delete "${slide.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await db.deleteHeroSlide(id);

      setSlides(prev =>
        prev
          .filter(item => item.id !== id)
          .map((item, index) => ({
            ...item,
            displayOrder: index
          }))
      );

      setStatus('Hero slide deleted.');
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setError('Unable to delete this slide.');
    }
  };

  const addSlide = () => {
    const newSlide = createSlide(slides.length);

    setSlides(prev => [...prev, newSlide]);

    setTimeout(() => {
      document
        .getElementById(`hero-slide-${newSlide.id}`)
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
    }, 100);
  };

  const moveSlide = (
    index: number,
    direction: 'up' | 'down'
  ) => {
    const targetIndex =
      direction === 'up' ? index - 1 : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= slides.length
    ) {
      return;
    }

    const updated = [...slides];
    const temp = updated[index];

    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setSlides(
      updated.map((slide, itemIndex) => ({
        ...slide,
        displayOrder: itemIndex
      }))
    );
  };

  const saveAllOrder = async () => {
    setSavingId('all');
    setError(null);

    try {
      for (const slide of slides) {
        await db.saveHeroSlide({
          ...slide,
          updatedAt: new Date().toISOString()
        });
      }

      setStatus('All hero slide changes saved successfully.');
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setError('Unable to save all hero slides.');
    } finally {
      setSavingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-[#8C6A48]">
        Loading hero slider...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="border-b border-[#EAE2D7] pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
            Homepage Hero Slider
          </h1>

          <p className="text-xs text-[#8C6A48] mt-1 font-light">
            Manage the images, text, buttons and order of your homepage hero slides.
          </p>
        </div>

        <button
          onClick={addSlide}
          className="px-4 py-2.5 bg-[#291C16] hover:bg-[#3E2D24] text-white text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#D8B46E]" />
          Add New Slide
        </button>
      </div>

      {status && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          {status}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-300 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {slides.length === 0 ? (
        <div className="bg-white border border-[#EAE2D7] p-12 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-[#8C6A48] opacity-50" />

          <h3 className="font-serif text-xl text-[#291C16] mt-4">
            No Hero Slides
          </h3>

          <p className="text-xs text-[#6B5344] mt-2">
            Add your first homepage hero slide.
          </p>

          <button
            onClick={addSlide}
            className="mt-5 px-5 py-2.5 bg-[#291C16] text-white text-xs uppercase tracking-wider"
          >
            Add First Slide
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              id={`hero-slide-${slide.id}`}
              className="bg-white border border-[#EAE2D7] overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-[#EAE2D7] bg-[#FBF9F5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold">
                    Slide {index + 1}
                  </span>

                  <h2 className="font-serif text-lg text-[#291C16]">
                    {slide.title || 'Untitled Slide'}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveSlide(index, 'up')}
                    disabled={index === 0}
                    className="p-2 border border-[#EAE2D7] disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => moveSlide(index, 'down')}
                    disabled={index === slides.length - 1}
                    className="p-2 border border-[#EAE2D7] disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      updateSlide(
                        slide.id,
                        'isPublished',
                        !slide.isPublished
                      )
                    }
                    className={`px-3 py-2 text-xs flex items-center gap-1.5 border ${
                      slide.isPublished
                        ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                        : 'border-[#EAE2D7] text-[#8C6A48]'
                    }`}
                  >
                    {slide.isPublished ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}

                    {slide.isPublished
                      ? 'Published'
                      : 'Hidden'}
                  </button>
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold mb-2">
                      Hero Image
                    </label>

                    <div className="aspect-[16/8] bg-[#160E0A] border border-[#EAE2D7] overflow-hidden flex items-center justify-center">
                      {slide.image ? (
                        <img
                          src={slide.image}
                          alt={slide.title}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          className="w-full h-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="text-center text-[#D8B46E]">
                          <ImageIcon className="w-10 h-10 mx-auto opacity-60" />

                          <p className="text-[10px] uppercase tracking-wider mt-2">
                            No Image
                          </p>
                        </div>
                      )}
                    </div>

                    <label
                      className={`mt-3 w-full px-4 py-3 border border-[#EAE2D7] hover:border-[#8C6A48] bg-[#FBF9F5] cursor-pointer flex items-center justify-center gap-2 text-xs text-[#291C16] ${
                        uploadingId === slide.id
                          ? 'opacity-60 pointer-events-none'
                          : ''
                      }`}
                    >
                      <Upload className="w-4 h-4 text-[#8C6A48]" />

                      {uploadingId === slide.id
                        ? 'Uploading...'
                        : slide.image
                          ? 'Replace Hero Image'
                          : 'Upload Hero Image'}

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingId === slide.id}
                        onChange={event => {
                          const file =
                            event.target.files?.[0];

                          if (file) {
                            handleImageUpload(
                              slide.id,
                              file
                            );
                          }

                          event.target.value = '';
                        }}
                      />
                    </label>

                    <p className="text-[10px] text-[#8C6A48] mt-2">
                      Images are automatically optimized for fast loading.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold mb-1">
                      Main Title
                    </label>

                    <input
                      value={slide.title}
                      onChange={event =>
                        updateSlide(
                          slide.id,
                          'title',
                          event.target.value
                        )
                      }
                      className="w-full border border-[#EAE2D7] px-3 py-2.5 text-sm text-[#291C16] outline-none focus:border-[#8C6A48]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold mb-1">
                      Subtitle
                    </label>

                    <input
                      value={slide.subtitle}
                      onChange={event =>
                        updateSlide(
                          slide.id,
                          'subtitle',
                          event.target.value
                        )
                      }
                      className="w-full border border-[#EAE2D7] px-3 py-2.5 text-sm text-[#291C16] outline-none focus:border-[#8C6A48]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold mb-1">
                      Tagline
                    </label>

                    <textarea
                      value={slide.tagline}
                      onChange={event =>
                        updateSlide(
                          slide.id,
                          'tagline',
                          event.target.value
                        )
                      }
                      rows={3}
                      className="w-full border border-[#EAE2D7] px-3 py-2.5 text-sm text-[#291C16] outline-none focus:border-[#8C6A48] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold mb-1">
                        Primary Button
                      </label>

                      <input
                        value={slide.ctaPrimary}
                        onChange={event =>
                          updateSlide(
                            slide.id,
                            'ctaPrimary',
                            event.target.value
                          )
                        }
                        className="w-full border border-[#EAE2D7] px-3 py-2.5 text-sm text-[#291C16] outline-none focus:border-[#8C6A48]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold mb-1">
                        Secondary Button
                      </label>

                      <input
                        value={slide.ctaSecondary}
                        onChange={event =>
                          updateSlide(
                            slide.id,
                            'ctaSecondary',
                            event.target.value
                          )
                        }
                        className="w-full border border-[#EAE2D7] px-3 py-2.5 text-sm text-[#291C16] outline-none focus:border-[#8C6A48]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold mb-1">
                      Primary Button Link
                    </label>

                    <input
                      value={slide.link}
                      onChange={event =>
                        updateSlide(
                          slide.id,
                          'link',
                          event.target.value
                        )
                      }
                      placeholder="/shop"
                      className="w-full border border-[#EAE2D7] px-3 py-2.5 text-sm text-[#291C16] outline-none focus:border-[#8C6A48]"
                    />
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-[#EAE2D7] flex flex-col sm:flex-row sm:justify-between gap-3">
                <button
                  onClick={() => deleteSlide(slide.id)}
                  className="px-4 py-2.5 border border-red-200 text-red-700 hover:bg-red-50 text-xs flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Slide
                </button>

                <button
                  onClick={() => saveSlide(slide)}
                  disabled={
                    savingId === slide.id ||
                    uploadingId === slide.id
                  }
                  className="px-5 py-2.5 bg-[#291C16] hover:bg-[#3E2D24] disabled:opacity-50 text-white text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Save className="w-3.5 h-3.5 text-[#D8B46E]" />

                  {savingId === slide.id
                    ? 'Saving...'
                    : 'Save Slide'}
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={saveAllOrder}
              disabled={savingId === 'all'}
              className="px-5 py-3 bg-[#8C6A48] hover:bg-[#6F5037] disabled:opacity-50 text-white text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <Save className="w-4 h-4" />

              {savingId === 'all'
                ? 'Saving All...'
                : 'Save All Slide Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
