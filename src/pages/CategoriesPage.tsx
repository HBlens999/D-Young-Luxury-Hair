import React, { useState, useEffect } from 'react';
import { ProductCategory } from '../types';
import { db } from '../lib/supabase';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoriesPageProps {
  onNavigate: (path: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const cached = db.getCachedCategories();

      if (cached.length && active) {
        setCategories(cached);
        setIsLoading(false);
      }

      try {
        const cats = await db.getCategories();
        if (active) setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block">
          Editorial Curation
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#291C16]">
          Hair Categories & Collections
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5344] font-light leading-relaxed">
          From genuine Vietnamese Super Double Drawn bundles to mirror shine lace wigs, each collection is dedicated to specific texture, origin, and finish.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#8C6A48] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/shop?category=${cat.slug}`)}
              className="group cursor-pointer bg-white border border-[#EAE2D7] overflow-hidden hover:border-[#D6C2A7] transition-all duration-300 flex flex-col sm:flex-row"
            >
              <div className="relative sm:w-1/2 aspect-[4/3] sm:aspect-auto overflow-hidden bg-[#F4EFEA]">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-[#EBE3D8] flex items-center justify-center text-[#8C6A48]">
                    <Sparkles className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>

              <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C6A48] font-semibold">
                    Collection {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#291C16] group-hover:text-[#8C6A48] transition-colors leading-snug">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-[#6B5344] font-light leading-relaxed">
                    {cat.description || 'Hand-selected luxury hair strands with intact cuticles and uniform weft density.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4EFEA] flex items-center gap-2 text-xs uppercase tracking-wider text-[#291C16] font-semibold group-hover:text-[#8C6A48]">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
