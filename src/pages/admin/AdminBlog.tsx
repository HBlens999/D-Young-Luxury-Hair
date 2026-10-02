import React, { useState, useEffect } from 'react';
import { BlogPost, Product } from '../../types';
import { db, supabase } from '../../lib/supabase';
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

export const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadBlogData = async () => {
    try {
      const [p, prods] = await Promise.allSettled([
        db.getBlogPosts(),
        db.getProducts()
      ]);

      if (p.status === 'fulfilled') setPosts(p.value);
      else console.error('Admin blog posts failed:', p.reason);

      if (prods.status === 'fulfilled') setProducts(prods.value);
      else console.error('Admin blog products failed:', prods.reason);
    } catch (error) {
      console.error('Failed to load blog data:', error);
      showFeedback('Could not load blog posts.');
    }
  };

  useEffect(() => {
    loadBlogData();
  }, []);

  const showFeedback = (message: string) => {
    setFeedback(message);

    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const handleStartNew = () => {
    const newPost: BlogPost = {
      id: 'post-' + Date.now(),
      title: '',
      slug: '',
      categoryId: 'blog-cat-1',
      categoryName: 'Hair Care',
      excerpt: '',
      content: '',
      featuredImage: '',
      author: 'D Young Stylist Team',
      readTime: '4 min read',
      isPublished: true,
      publishedAt: new Date().toISOString(),
      recommendedProductId: products[0]?.id || ''
    };

    setImageFile(null);
    setEditingPost(newPost);
  };

  const handleImageSelect = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('Please select an image file.');
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      showFeedback('Image is too large. Please keep it below 10MB.');
      return;
    }

    setImageFile(file);
  };

  const uploadFeaturedImage = async (file: File): Promise<string> => {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const extension =
      file.name.split('.').pop()?.toLowerCase() || 'jpg';

    const safeName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .toLowerCase();

    const filePath =
      `blog/featured/${safeName}-${Date.now()}.${extension}`;

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingPost) return;

    if (!editingPost.title.trim()) {
      showFeedback('Please enter an article title.');
      return;
    }

    if (!editingPost.content.trim()) {
      showFeedback('Please enter the article content.');
      return;
    }

    try {
      setSaving(true);

      let featuredImage = editingPost.featuredImage;

      if (imageFile) {
        setUploadingImage(true);
        showFeedback('Uploading featured image...');

        featuredImage = await uploadFeaturedImage(imageFile);

        setUploadingImage(false);
      }

      let slug = editingPost.slug;

      if (!slug || !slug.trim()) {
        slug = editingPost.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      const finalPost: BlogPost = {
        ...editingPost,
        slug,
        featuredImage
      };

      await db.saveBlogPost(finalPost);

      showFeedback(
        `Article "${finalPost.title}" saved successfully.`
      );

      setEditingPost(null);
      setImageFile(null);

      await loadBlogData();

    } catch (error: any) {
      console.error('Blog post save failed:', error);

      setUploadingImage(false);

      showFeedback(
        error?.message ||
        'Article could not be saved. Please try again.'
      );

    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    id: string,
    title: string
  ) => {
    if (!window.confirm(`Delete article "${title}"?`)) {
      return;
    }

    try {
      await db.deleteBlogPost(id);

      showFeedback(`Article "${title}" deleted.`);

      await loadBlogData();

    } catch (error: any) {
      console.error('Blog delete failed:', error);

      showFeedback(
        error?.message ||
        'Article could not be deleted.'
      );
    }
  };

  const handleTogglePublish = async (
    post: BlogPost
  ) => {
    try {
      const updated = {
        ...post,
        isPublished: !post.isPublished
      };

      await db.saveBlogPost(updated);

      showFeedback(
        `Article "${post.title}" is now ${
          updated.isPublished
            ? 'Published'
            : 'Draft'
        }`
      );

      await loadBlogData();

    } catch (error: any) {
      console.error('Publish toggle failed:', error);

      showFeedback(
        error?.message ||
        'Could not update article status.'
      );
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE2D7] pb-4">

        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
            Hair Journal CMS & Editorial
          </h1>

          <p className="text-xs text-[#8C6A48] mt-1 font-light">
            Create educational articles, hair care guides, and link recommended luxury products.
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="px-4 py-2.5 bg-[#291C16] text-[#FDFCF7] text-xs uppercase tracking-wider font-semibold hover:bg-[#4A3326] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>

      </div>

      {/* Feedback */}
      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Articles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-[#EAE2D7] overflow-hidden flex flex-col justify-between"
          >

            {post.featuredImage && (
              <div className="aspect-[16/8] bg-[#F4EFEA]">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="p-6 space-y-4">

              <div className="space-y-3">

                <div className="flex items-center justify-between text-xs text-[#8C6A48]">
                  <span>
                    {post.categoryName || 'General'}
                  </span>

                  <span>
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#291C16]">
                  {post.title}
                </h3>

                <p className="text-xs text-[#6B5344] font-light line-clamp-2">
                  {post.excerpt}
                </p>

              </div>

              <div className="pt-3 border-t border-[#F4EFEA] flex items-center justify-between">

                <button
                  onClick={() =>
                    handleTogglePublish(post)
                  }
                  className={`px-2 py-1 text-[11px] font-medium border flex items-center gap-1 ${
                    post.isPublished
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-stone-100 border-stone-300 text-stone-600'
                  }`}
                >
                  {post.isPublished ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}

                  <span>
                    {post.isPublished
                      ? 'Published'
                      : 'Draft'}
                  </span>
                </button>

                <div className="flex items-center gap-2">

                  <button
                    onClick={() => {
                      setImageFile(null);
                      setEditingPost(post);
                    }}
                    className="p-1.5 border border-[#D6C2A7] hover:bg-[#F4EFEA] text-[#291C16] text-xs flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        post.id,
                        post.title
                      )
                    }
                    className="p-1.5 border border-red-200 hover:bg-red-50 text-red-700 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                </div>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="border border-dashed border-[#D6C2A7] p-12 text-center">

          <ImageIcon className="w-10 h-10 mx-auto text-[#8C6A48] mb-3" />

          <p className="font-serif text-lg text-[#291C16]">
            No articles yet
          </p>

          <p className="text-xs text-[#8C6A48] mt-1">
            Click "Write New Article" to create your first article.
          </p>

        </div>
      )}

      {/* Article Editor */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-3xl bg-white border border-[#EAE2D7] shadow-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-3">

              <div>
                <h2 className="font-serif text-xl font-bold text-[#291C16]">
                  Article Editor
                </h2>

                <p className="text-[11px] text-[#8C6A48] mt-1">
                  Create and publish a new Hair Journal article.
                </p>
              </div>

              <button
                onClick={() => {
                  if (!saving) {
                    setEditingPost(null);
                    setImageFile(null);
                  }
                }}
                className="p-1 text-[#8C6A48]"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <form
              onSubmit={handleSave}
              className="space-y-4 text-xs"
            >

              {/* Title */}
              <div>

                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Article Title *
                </label>

                <input
                  type="text"
                  required
                  value={editingPost.title}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      title: e.target.value
                    })
                  }
                  placeholder="e.g. Caring for Raw Single Donor Bone Straight Hair"
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />

              </div>

              {/* Category / Author / Reading Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div>

                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                    Category
                  </label>

                  <select
                    value={editingPost.categoryName}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        categoryName: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                  >
                    <option value="Hair Care">
                      Hair Care
                    </option>

                    <option value="Hair Buying Guides">
                      Hair Buying Guides
                    </option>

                    <option value="Style Inspiration">
                      Style Inspiration
                    </option>

                    <option value="Hair Education">
                      Hair Education
                    </option>

                  </select>

                </div>

                <div>

                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                    Author
                  </label>

                  <input
                    type="text"
                    value={editingPost.author}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        author: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                  />

                </div>

                <div>

                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                    Reading Time
                  </label>

                  <input
                    type="text"
                    value={editingPost.readTime}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        readTime: e.target.value
                      })
                    }
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                  />

                </div>

              </div>

              {/* Excerpt */}
              <div>

                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Excerpt Summary
                </label>

                <textarea
                  rows={3}
                  value={editingPost.excerpt}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      excerpt: e.target.value
                    })
                  }
                  placeholder="Short summary shown on the blog listing..."
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />

              </div>

              {/* Featured Image Upload */}
              <div>

                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Featured Image
                </label>

                <label className="border-2 border-dashed border-[#D6C2A7] bg-[#FBF9F5] p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F4EFEA] transition-colors">

                  <Upload className="w-7 h-7 text-[#8C6A48] mb-2" />

                  <span className="font-semibold text-[#291C16]">
                    {imageFile
                      ? imageFile.name
                      : editingPost.featuredImage
                        ? 'Replace featured image'
                        : 'Choose featured image'}
                  </span>

                  <span className="text-[10px] text-[#8C6A48] mt-1">
                    JPG, PNG or WEBP · Maximum 10MB
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={saving}
                    onChange={(e) =>
                      handleImageSelect(
                        e.target.files?.[0] || null
                      )
                    }
                  />

                </label>

                {imageFile && (
                  <div className="mt-2 bg-[#F4EFEA] p-2 text-[10px] text-[#6B5344]">
                    Selected: {imageFile.name}
                  </div>
                )}

                {!imageFile &&
                  editingPost.featuredImage && (
                    <img
                      src={editingPost.featuredImage}
                      alt="Current featured image"
                      className="w-full aspect-[16/8] object-cover mt-3"
                    />
                  )}

                {imageFile && (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="New featured image preview"
                    className="w-full aspect-[16/8] object-cover mt-3"
                  />
                )}

              </div>

              {/* Recommended Product */}
              <div>

                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Recommended Hair Product
                </label>

                <select
                  value={
                    editingPost.recommendedProductId || ''
                  }
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      recommendedProductId:
                        e.target.value
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                >

                  <option value="">
                    None
                  </option>

                  {products.map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                    >
                      {p.name}
                    </option>
                  ))}

                </select>

              </div>

              {/* Article Content */}
              <div>

                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Full Article Content *
                </label>

                <textarea
                  rows={12}
                  required
                  value={editingPost.content}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      content: e.target.value
                    })
                  }
                  placeholder="Write your full article here..."
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16] resize-y"
                />

              </div>

              {/* Publish */}
              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="checkbox"
                  checked={editingPost.isPublished}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      isPublished:
                        e.target.checked
                    })
                  }
                />

                <span className="text-[#291C16]">
                  Publish this article on the website
                </span>

              </label>

              {/* Buttons */}
              <div className="pt-4 border-t border-[#F4EFEA] flex justify-end gap-2">

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setEditingPost(null);
                    setImageFile(null);
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
                        {uploadingImage
                          ? 'Uploading Image...'
                          : 'Saving Article...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>
                        Save Article
                      </span>
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
