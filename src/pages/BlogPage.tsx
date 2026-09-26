import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { db } from '../lib/supabase';
import { ArrowRight, BookOpen } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (path: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const data = await db.getBlogPosts();
        setPosts(data.filter(p => p.isPublished));
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['all', 'Hair Care', 'Hair Buying Guides', 'Style Inspiration', 'Hair Education'];

  const filteredPosts = posts.filter(post => {
    if (selectedCategory === 'all') return true;
    return post.categoryName?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-14">
      
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block">
          Editorial & Education
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#291C16]">
          The Hair Masterclass Journal
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5344] font-light leading-relaxed">
          Insider guides on hair longevity, raw donor hair identification, heat protection regimens, and styling secrets from our master artisans.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-4 border-b border-[#EAE2D7]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs tracking-wider uppercase border transition-colors cursor-pointer ${
              selectedCategory.toLowerCase() === cat.toLowerCase()
                ? 'bg-[#291C16] text-[#FDFCF7] border-[#291C16]'
                : 'bg-white text-[#4A3326] border-[#EAE2D7] hover:border-[#8C6A48]'
            }`}
          >
            {cat === 'all' ? 'All Articles' : cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#8C6A48] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#EAE2D7] p-8">
          <BookOpen className="w-10 h-10 text-[#8C6A48] mx-auto mb-3 stroke-[1.2]" />
          <p className="font-serif text-xl text-[#291C16]">No articles in this category yet</p>
          <p className="text-xs text-[#6B5344] mt-1 font-light">Check back soon for new expert editorials.</p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Featured Article Card */}
          {featuredPost && (
            <article
              onClick={() => onNavigate(`/blog/${featuredPost.slug}`)}
              className="group cursor-pointer bg-white border border-[#EAE2D7] hover:border-[#D6C2A7] transition-all grid grid-cols-1 lg:grid-cols-12 overflow-hidden"
            >
              <div className="lg:col-span-7 aspect-[16/10] overflow-hidden bg-[#F4EFEA]">
                <img
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#8C6A48] font-medium uppercase tracking-wider">
                    <span>{featuredPost.categoryName || 'Featured Guide'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{featuredPost.readTime}</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#291C16] group-hover:text-[#8C6A48] transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#6B5344] font-light leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4EFEA] flex items-center justify-between">
                  <span className="text-xs text-[#8C6A48] font-light">
                    By {featuredPost.author}
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#291C16] group-hover:text-[#8C6A48] flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          )}

          {/* Regular Articles Grid */}
          {regularPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => onNavigate(`/blog/${post.slug}`)}
                  className="group cursor-pointer bg-white border border-[#EAE2D7] hover:border-[#D6C2A7] transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#F4EFEA]">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-[#8C6A48] uppercase tracking-wider">
                        <span>{post.categoryName || 'Hair Care'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-[#291C16] group-hover:text-[#8C6A48] transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-[#6B5344] font-light line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F4EFEA] flex items-center justify-between text-xs">
                      <span className="text-[#8C6A48] font-light">{post.author}</span>
                      <span className="text-[#291C16] font-semibold flex items-center gap-1 group-hover:text-[#8C6A48]">
                        <span>Read</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
