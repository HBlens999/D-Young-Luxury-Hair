import React, { useState, useEffect } from 'react';
import { BlogPost, Product } from '../../types';
import { db } from '../../lib/supabase';
import { Plus, Trash2, Edit3, Check, X, Eye, EyeOff } from 'lucide-react';

export const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadBlogData = async () => {
    const [p, prods] = await Promise.all([
      db.getBlogPosts(),
      db.getProducts()
    ]);
    setPosts(p);
    setProducts(prods);
  };

  useEffect(() => {
    loadBlogData();
  }, []);

  const handleStartNew = () => {
    const newPost: BlogPost = {
      id: 'post-' + Date.now(),
      title: '',
      slug: '',
      categoryId: 'blog-cat-1',
      categoryName: 'Hair Care',
      excerpt: '',
      content: '',
      featuredImage: products[0]?.mainImage || '',
      author: 'D Young Stylist Team',
      readTime: '4 min read',
      isPublished: true,
      publishedAt: new Date().toISOString(),
      recommendedProductId: products[0]?.id || ''
    };
    setEditingPost(newPost);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title.trim()) return;

    let slug = editingPost.slug;
    if (!slug || !slug.trim()) {
      slug = editingPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    await db.saveBlogPost({ ...editingPost, slug });
    setFeedback(`Article "${editingPost.title}" saved.`);
    setTimeout(() => setFeedback(null), 3000);
    setEditingPost(null);
    loadBlogData();
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete article "${title}"?`)) {
      await db.deleteBlogPost(id);
      setFeedback(`Article "${title}" deleted.`);
      setTimeout(() => setFeedback(null), 3000);
      loadBlogData();
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const updated = { ...post, isPublished: !post.isPublished };
    await db.saveBlogPost(updated);
    setFeedback(`Article "${post.title}" is now ${updated.isPublished ? 'Published' : 'Draft'}`);
    setTimeout(() => setFeedback(null), 3000);
    loadBlogData();
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

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Articles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-[#EAE2D7] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8C6A48]">
                <span>{post.categoryName || 'General'}</span>
                <span>{post.readTime}</span>
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
                onClick={() => handleTogglePublish(post)}
                className={`px-2 py-1 text-[11px] font-medium border flex items-center gap-1 ${
                  post.isPublished
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-stone-100 border-stone-300 text-stone-600'
                }`}
              >
                {post.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{post.isPublished ? 'Published' : 'Draft'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingPost(post)}
                  className="p-1.5 border border-[#D6C2A7] hover:bg-[#F4EFEA] text-[#291C16] text-xs flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="p-1.5 border border-red-200 hover:bg-red-50 text-red-700 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Editor Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white border border-[#EAE2D7] shadow-2xl p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-3">
              <h2 className="font-serif text-xl font-bold text-[#291C16]">
                Article Editor
              </h2>
              <button onClick={() => setEditingPost(null)} className="p-1 text-[#8C6A48]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  placeholder="e.g. Caring for Raw Single Donor Bone Straight Hair"
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                    Category Name
                  </label>
                  <select
                    value={editingPost.categoryName}
                    onChange={(e) => setEditingPost({ ...editingPost, categoryName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                  >
                    <option value="Hair Care">Hair Care</option>
                    <option value="Hair Buying Guides">Hair Buying Guides</option>
                    <option value="Style Inspiration">Style Inspiration</option>
                    <option value="Hair Education">Hair Education</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={editingPost.author}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
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
                    onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Excerpt Summary
                </label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  value={editingPost.featuredImage}
                  onChange={(e) => setEditingPost({ ...editingPost, featuredImage: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Recommended Hair Product (Linked in Article)
                </label>
                <select
                  value={editingPost.recommendedProductId || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, recommendedProductId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                >
                  <option value="">None</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Full Article Content
                </label>
                <textarea
                  rows={8}
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              <div className="pt-4 border-t border-[#F4EFEA] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 border border-[#D6C2A7] text-[#4A3326]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#291C16] text-white font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Save & Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
