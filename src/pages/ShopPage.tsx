import React, { useState, useEffect, useMemo } from 'react';
import { Product, ProductCategory, HairType } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { db } from '../lib/supabase';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface ShopPageProps {
  onNavigate: (path: string) => void;
  initialCategorySlug?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate, initialCategorySlug }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(initialCategorySlug || 'all');
  const [selectedHairType, setSelectedHairType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');
  const [filterSpecial, setFilterSpecial] = useState<'all' | 'featured' | 'new-arrivals'>('all');

  useEffect(() => {
    if (initialCategorySlug) {
      setSelectedCategorySlug(initialCategorySlug);
    }
  }, [initialCategorySlug]);

  useEffect(() => {
    async function loadShopData() {
      try {
        setIsLoading(true);
        const [prods, cats] = await Promise.all([
          db.getProducts(),
          db.getCategories()
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadShopData();
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Must be published
      if (!prod.isPublished) return false;

      // Category filter
      if (selectedCategorySlug !== 'all') {
        const cat = categories.find(c => c.slug === selectedCategorySlug);
        if (cat && prod.categoryId !== cat.id) return false;
      }

      // Hair type filter (Human Hair / Artificial Hair)
      if (selectedHairType !== 'all') {
        if (prod.productType !== selectedHairType) return false;
      }

      // Special tags (Featured / New Arrival)
      if (filterSpecial === 'featured' && !prod.isFeatured) return false;
      if (filterSpecial === 'new-arrivals' && !prod.isNewArrival) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesDesc = prod.description.toLowerCase().includes(query);
        const matchesCategory = prod.categoryName?.toLowerCase().includes(query);
        const matchesVariant = prod.variants.some(v => v.length.toLowerCase().includes(query) || (v.color && v.color.toLowerCase().includes(query)));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesVariant) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.minPrice - b.minPrice;
      }
      if (sortBy === 'price-desc') {
        return b.minPrice - a.minPrice;
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // Default: featured first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [products, categories, selectedCategorySlug, selectedHairType, filterSpecial, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategorySlug('all');
    setSelectedHairType('all');
    setFilterSpecial('all');
    setSortBy('featured');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategorySlug !== 'all' || selectedHairType !== 'all' || filterSpecial !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block">
          Exclusive Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#291C16]">
          Luxury Hair Collections
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5344] font-light leading-relaxed">
          Super Double Drawn Vietnamese bone straight bundles, mirror gloss frontal wigs, and single donor selections.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#EAE2D7] p-5 space-y-4">
        
        {/* Top Search & Sort Row */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#8C6A48] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by length, style, or type..."
              className="w-full pl-9 pr-4 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-xs text-[#291C16] placeholder-[#A68F7B] focus:outline-none focus:border-[#8C6A48]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C6A48] hover:text-[#291C16]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Segmented Controls (Interactive Filter Buttons) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F4EFEA] border border-[#EAE2D7] text-xs">
            <button
              onClick={() => setFilterSpecial('all')}
              className={`px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                filterSpecial === 'all'
                  ? 'bg-white text-[#291C16] shadow-sm'
                  : 'text-[#6B5344] hover:text-[#291C16]'
              }`}
            >
              All Hair
            </button>
            <button
              onClick={() => setFilterSpecial('featured')}
              className={`px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                filterSpecial === 'featured'
                  ? 'bg-white text-[#291C16] shadow-sm'
                  : 'text-[#6B5344] hover:text-[#291C16]'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setFilterSpecial('new-arrivals')}
              className={`px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                filterSpecial === 'new-arrivals'
                  ? 'bg-white text-[#291C16] shadow-sm'
                  : 'text-[#6B5344] hover:text-[#291C16]'
              }`}
            >
              New Arrivals
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs uppercase tracking-wider text-[#8C6A48] shrink-0 font-medium">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-xs text-[#291C16] focus:outline-none focus:border-[#8C6A48] cursor-pointer"
            >
              <option value="featured">Editorial Curated</option>
              <option value="newest">Latest Additions</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Categories Bar */}
        <div className="pt-3 border-t border-[#F4EFEA] flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-[#8C6A48] mr-2 font-medium">
            Category:
          </span>
          <button
            onClick={() => setSelectedCategorySlug('all')}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase border transition-colors cursor-pointer ${
              selectedCategorySlug === 'all'
                ? 'border-[#291C16] bg-[#291C16] text-[#FDFCF7]'
                : 'border-[#EAE2D7] bg-white text-[#4A3326] hover:border-[#8C6A48]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`px-3 py-1.5 text-xs tracking-wider border transition-colors cursor-pointer ${
                selectedCategorySlug === cat.slug
                  ? 'border-[#291C16] bg-[#291C16] text-[#FDFCF7]'
                  : 'border-[#EAE2D7] bg-white text-[#4A3326] hover:border-[#8C6A48]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Hair Type Bar (Human Hair / Artificial Hair) */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#8C6A48] mr-2 font-medium">
              Hair Material:
            </span>
            <button
              onClick={() => setSelectedHairType('all')}
              className={`px-3 py-1 text-xs border cursor-pointer ${
                selectedHairType === 'all'
                  ? 'bg-[#EAE2D7] border-[#8C6A48] text-[#291C16] font-medium'
                  : 'bg-white border-[#EAE2D7] text-[#6B5344]'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedHairType('Human Hair')}
              className={`px-3 py-1 text-xs border cursor-pointer ${
                selectedHairType === 'Human Hair'
                  ? 'bg-[#EAE2D7] border-[#8C6A48] text-[#291C16] font-medium'
                  : 'bg-white border-[#EAE2D7] text-[#6B5344]'
              }`}
            >
              100% Human Hair
            </button>
            <button
              onClick={() => setSelectedHairType('Artificial Hair')}
              className={`px-3 py-1 text-xs border cursor-pointer ${
                selectedHairType === 'Artificial Hair'
                  ? 'bg-[#EAE2D7] border-[#8C6A48] text-[#291C16] font-medium'
                  : 'bg-white border-[#EAE2D7] text-[#6B5344]'
              }`}
            >
              Artificial Hair
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#8C6A48] hover:text-[#291C16] underline underline-offset-4"
            >
              Clear all filters
            </button>
          )}
        </div>

      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#8C6A48] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-base text-[#291C16]">Retrieving D Young hair collection...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-[#EAE2D7] p-12 text-center space-y-4">
          <p className="font-serif text-xl text-[#291C16]">No matching hair found</p>
          <p className="text-xs text-[#6B5344] font-light max-w-md mx-auto">
            Try adjusting your search criteria or resetting filters to see our full inventory.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2.5 bg-[#291C16] text-[#FDFCF7] text-xs uppercase tracking-widest font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs text-[#8C6A48]">
            <span className="tabular-nums">Showing {filteredProducts.length} items</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(slug) => onNavigate(`/product/${slug}`)}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
