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

        setPosts(data.filter((post) => post.isPublished));
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  const categories = [
    'all',
    'Hair Care',
    'Hair Buying Guides',
    'Style Inspiration',
    'Hair Education',
  ];

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory === 'all') {
      return true;
    }

    return (
      post.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
    );
  });

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="bg-[#FDFCF7] min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">

        {/* Editorial Header */}
        <header className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">

          <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block mb-4">
            Editorial & Education
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#291C16] font-normal leading-tight">
            The Hair Masterclass Journal
          </h1>

          <p className="text-sm sm:text-base text-[#6B5344] font-light leading-relaxed max-w-2xl mx-auto mt-5">
            Expert guides, hair education, buying advice, care tips and
            styling inspiration for choosing and maintaining beautiful hair.
          </p>

        </header>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-8 border-b border-[#EAE2D7] mb-12 sm:mb-16">

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2.5 text-[11px] sm:text-xs tracking-wider uppercase border transition-all ${
                selectedCategory.toLowerCase() === category.toLowerCase()
                  ? 'bg-[#291C16] text-[#FDFCF7] border-[#291C16]'
                  : 'bg-white text-[#4A3326] border-[#EAE2D7] hover:border-[#8C6A48]'
              }`}
            >
              {category === 'all' ? 'All Articles' : category}
            </button>
          ))}

        </div>

        {/* Loading */}
        {isLoading && (
          <div className="py-24 text-center">

            <div className="w-8 h-8 border-2 border-[#8C6A48] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

            <p className="font-serif text-lg text-[#291C16]">
              Loading articles...
            </p>

          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-white border border-[#EAE2D7] px-6">

            <BookOpen className="w-10 h-10 text-[#8C6A48] mx-auto mb-4 stroke-[1.2]" />

            <h2 className="font-serif text-xl sm:text-2xl text-[#291C16]">
              No articles in this category yet
            </h2>

            <p className="text-sm text-[#6B5344] mt-2 font-light">
              Check back soon for new expert editorials.
            </p>

          </div>
        )}

        {/* Articles */}
        {!isLoading && filteredPosts.length > 0 && (
          <div className="space-y-14 sm:space-y-20">

            {/* Featured Article */}
            {featuredPost && (
              <article
                onClick={() =>
                  onNavigate(`/blog/${featuredPost.slug}`)
                }
                className="group cursor-pointer bg-white border border-[#EAE2D7] hover:border-[#D6C2A7] transition-all overflow-hidden grid grid-cols-1 lg:grid-cols-12"
              >

                {/* Featured Image */}
                <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto min-h-[280px] lg:min-h-[500px] overflow-hidden bg-[#F4EFEA]">

                  {featuredPost.featuredImage ? (
                    <img
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      referrerPolicy="no-referrer"
                      loading="eager"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8C6A48]">
                      <BookOpen className="w-12 h-12 stroke-[1]" />
                    </div>
                  )}

                </div>

                {/* Featured Content */}
                <div className="lg:col-span-5 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">

                  <div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8C6A48] font-medium uppercase tracking-wider mb-4">
                      <span>
                        {featuredPost.categoryName || 'Featured Guide'}
                      </span>

                      <span aria-hidden="true">·</span>

                      <span>{featuredPost.readTime}</span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#291C16] group-hover:text-[#8C6A48] transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>

                    {featuredPost.excerpt && (
                      <p className="text-sm text-[#6B5344] font-light leading-relaxed mt-5">
                        {featuredPost.excerpt}
                      </p>
                    )}

                  </div>

                  <div className="pt-6 mt-8 border-t border-[#F4EFEA] flex items-center justify-between">

                    <span className="text-xs text-[#8C6A48] font-light">
                      By {featuredPost.author}
                    </span>

                    <span className="text-xs uppercase tracking-wider font-semibold text-[#291C16] group-hover:text-[#8C6A48] flex items-center gap-2">
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>

                  </div>

                </div>

              </article>
            )}

            {/* Regular Articles */}
            {regularPosts.length > 0 && (
              <section>

                <div className="flex items-center justify-between mb-8">

                  <div>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C6A48] font-semibold">
                      Latest Articles
                    </span>

                    <h2 className="font-serif text-2xl sm:text-3xl text-[#291C16] mt-1">
                      From Our Journal
                    </h2>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

                  {regularPosts.map((post) => (
                    <article
                      key={post.id}
                      onClick={() =>
                        onNavigate(`/blog/${post.slug}`)
                      }
                      className="group cursor-pointer bg-white border border-[#EAE2D7] hover:border-[#D6C2A7] transition-all flex flex-col overflow-hidden"
                    >

                      {/* Article Image */}
                      <div className="aspect-[16/10] overflow-hidden bg-[#F4EFEA]">

                        {post.featuredImage ? (
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#8C6A48]">
                            <BookOpen className="w-10 h-10 stroke-[1]" />
                          </div>
                        )}

                      </div>

                      {/* Article Details */}
                      <div className="p-6 flex-1 flex flex-col">

                        <div>

                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#8C6A48] uppercase tracking-wider mb-3">
                            <span>
                              {post.categoryName || 'Hair Care'}
                            </span>

                            <span aria-hidden="true">·</span>

                            <span>{post.readTime}</span>
                          </div>

                          <h3 className="font-serif text-xl text-[#291C16] group-hover:text-[#8C6A48] transition-colors leading-snug">
                            {post.title}
                          </h3>

                          {post.excerpt && (
                            <p className="text-xs text-[#6B5344] font-light line-clamp-3 leading-relaxed mt-3">
                              {post.excerpt}
                            </p>
                          )}

                        </div>

                        <div className="pt-4 mt-6 border-t border-[#F4EFEA] flex items-center justify-between">

                          <span className="text-xs text-[#8C6A48] font-light">
                            {post.author}
                          </span>

                          <span className="text-xs text-[#291C16] font-semibold flex items-center gap-1.5 group-hover:text-[#8C6A48]">
                            Read
                            <ArrowRight className="w-3 h-3" />
                          </span>

                        </div>

                      </div>

                    </article>
                  ))}

                </div>

              </section>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
