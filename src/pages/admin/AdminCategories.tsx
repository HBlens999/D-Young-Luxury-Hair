import React, { useState, useEffect } from 'react';
import { ProductCategory } from '../../types';
import { db } from '../../lib/supabase';
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadCategories = async () => {
    const data = await db.getCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleStartNew = () => {
    setEditingCategory({
      id: 'cat-' + Date.now(),
      name: '',
      slug: '',
      description: '',
      image: '',
      displayOrder: categories.length + 1
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) return;

    let slug = editingCategory.slug;
    if (!slug || !slug.trim()) {
      slug = editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const saved = await db.saveCategory({ ...editingCategory, slug });
    setFeedback(`Category "${saved.name}" successfully updated.`);
    setTimeout(() => setFeedback(null), 3000);
    setEditingCategory(null);
    loadCategories();
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      await db.deleteCategory(id);
      setFeedback(`Category "${name}" deleted.`);
      setTimeout(() => setFeedback(null), 3000);
      loadCategories();
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE2D7] pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
            Hair Product Categories
          </h1>
          <p className="text-xs text-[#8C6A48] mt-1 font-light">
            Initial collections: SDD Vietnamese Bone Straight, Mirror Bone Straight, Raw Donor, Baby Tin. Add more dynamically anytime.
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="px-4 py-2 bg-[#291C16] text-[#FDFCF7] text-xs uppercase tracking-wider font-semibold hover:bg-[#4A3326] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => (
          <div key={cat.id} className="bg-white border border-[#EAE2D7] p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold">
                  Order #{cat.displayOrder || idx + 1}
                </span>
                <span className="text-[11px] text-[#A68F7B] font-mono">
                  slug: /{cat.slug}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#291C16]">
                {cat.name}
              </h3>
              <p className="text-xs text-[#6B5344] font-light leading-relaxed">
                {cat.description || 'No description provided.'}
              </p>
            </div>

            <div className="pt-3 border-t border-[#F4EFEA] flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingCategory(cat)}
                className="p-1.5 border border-[#D6C2A7] hover:bg-[#F4EFEA] text-[#291C16] text-xs flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-1.5 border border-red-200 hover:bg-red-50 text-red-700 text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Editor Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-[#EAE2D7] shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-3">
              <h2 className="font-serif text-lg font-bold text-[#291C16]">
                Configure Category
              </h2>
              <button onClick={() => setEditingCategory(null)} className="p-1 text-[#8C6A48]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. SDD Vietnamese Bone Straight"
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Custom Slug
                </label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="auto-generated-if-empty"
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={editingCategory.image || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                  placeholder="Image URL from storage or assets"
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              <div className="pt-4 border-t border-[#F4EFEA] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 border border-[#D6C2A7] text-[#4A3326]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#291C16] text-white font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
