import React, { useState, useEffect } from 'react';
import { BlogPost, Product } from '../types';
import { db } from '../lib/supabase';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowLeft, Clock, User, Tag, Share2, Check } from 'lucide-react';

interface BlogPostPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({
  slug,
  onNavigate,
}) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [recommendedProduct, setRecommendedProduct] =
    useState<Product | null>(null);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        setIsLoading(true);

        const posts = await db.getBlogPosts();
        const found = posts.find((p) => p.slug === slug);

        if (found) {
          setPost(found);

          if (found.recommendedProductId) {
            const products = await db.getProducts();

            const product = products.find(
              (p) => p.id === found.recommendedProductId
            );

            if (product) {
              setRecommendedProduct(product);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load blog post:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopiedNotice(true);

      setTimeout(() => {
        setCopiedNotice(false);
      }, 2500);
    } catch (error) {
      console.error('Failed to copy article link:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#8C6A48] border-t-transparent rounded-full animate-spin mx-auto mb-3" />

        <p className="font-serif text-lg text-[#291C16]">
          Opening article...
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-5">
        <h1 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
          Article Not Found
        </h1>

        <p className="text-sm text-[#6B5344]">
          The article you are looking for may have been removed or is no
          longer available.
        </p>

        <button
          onClick={() => onNavigate('/blog')}
          className="px-6 py-3 bg-[#291C16] text-[#FDFCF7] text-xs uppercase tracking-widest font-semibold hover:bg-[#4A3326] transition-colors"
        >
          Return to Blog
        </button>
      </div>
    );
  }

  return (
    <article className="bg-[#FDFCF7] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-20">

        {/* Back Button */}
        <button
          onClick={() => onNavigate('/blog')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#8C6A48] hover:text-[#291C16] transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Blog Journal</span>
        </button>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto text-center mb-10 sm:mb-14">

          {/* Category */}
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C6A48] font-semibold mb-5">
            <Tag className="w-3.5 h-3.5" />

            <span>
              {post.categoryName || 'Hair Education'}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#291C16] font-normal leading-[1.08]">
            {post.title}
          </h1>

          {/* Author / Read Time / Share */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#8C6A48] font-light mt-6">

            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{post.author}</span>
            </span>

            <span aria-hidden="true">·</span>

            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>

            <span aria-hidden="true">·</span>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-[#291C16] hover:text-[#8C6A48] transition-colors"
            >
              {copiedNotice ? (
                <Check className="w-3.5 h-3.5 text-emerald-700" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}

              <span>
                {copiedNotice ? 'Link Copied!' : 'Share Article'}
              </span>
            </button>

          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="max-w-5xl mx-auto mb-10 sm:mb-14">
            <div className="w-full aspect-[16/9] overflow-hidden bg-[#F4EFEA] border border-[#EAE2D7]">
              <img
                src={post.featuredImage}
                alt={post.title}
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <section className="max-w-3xl mx-auto">

          {/* Excerpt */}
          {post.excerpt && (
            <div className="mb-10">
              <p className="font-serif text-xl sm:text-2xl text-[#4A3326] leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Full Article */}
          <div className="text-[15px] sm:text-base text-[#4A3326] font-light leading-[1.9] whitespace-pre-line">
            {post.content}
          </div>

        </section>

        {/* Recommended Product */}
        {recommendedProduct && (
          <section className="max-w-4xl mx-auto mt-14 sm:mt-20 bg-[#F4EFEA] border border-[#D6C2A7] p-6 sm:p-10">

            <div className="space-y-2 mb-7">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8C6A48] font-semibold block">
                Featured in this Editorial
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
                Recommended Luxury Piece
              </h2>

              <p className="text-sm text-[#6B5344] font-light">
                Explore the luxury hair featured or recommended in this
                article.
              </p>
            </div>

            <div className="max-w-md">
              <ProductCard
                product={recommendedProduct}
                onSelect={(productSlug) =>
                  onNavigate(`/product/${productSlug}`)
                }
              />
            </div>

          </section>
        )}

        {/* Bottom Navigation */}
        <div className="max-w-3xl mx-auto mt-14 sm:mt-20 pt-8 border-t border-[#EAE2D7]">

          <button
            onClick={() => onNavigate('/blog')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C6A48] hover:text-[#291C16] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Read More Articles
          </button>

        </div>

      </div>
    </article>
  );
};
