import React, { useState, useEffect } from 'react';
import { BlogPost, Product } from '../types';
import { db } from '../lib/supabase';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowLeft, Clock, User, Tag, Share2, Check } from 'lucide-react';

interface BlogPostPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigate }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        setIsLoading(true);
        const posts = await db.getBlogPosts();
        const found = posts.find(p => p.slug === slug);
        if (found) {
          setPost(found);
          if (found.recommendedProductId) {
            const products = await db.getProducts();
            const prod = products.find(p => p.id === found.recommendedProductId);
            if (prod) setRecommendedProduct(prod);
          }
        }
      } catch (err) {
        console.error('Failed to load blog post:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#8C6A48] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-serif text-lg text-[#291C16]">Opening article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-serif text-2xl text-[#291C16]">Article Not Found</h1>
        <button
          onClick={() => onNavigate('/blog')}
          className="px-6 py-2.5 bg-[#291C16] text-[#FDFCF7] text-xs uppercase tracking-widest font-semibold"
        >
          Return to Blog
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('/blog')}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#8C6A48] hover:text-[#291C16] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Blog Journal</span>
      </button>

      {/* Article Header */}
      <header className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C6A48] font-semibold">
          <Tag className="w-3.5 h-3.5" />
          <span>{post.categoryName || 'Hair Education'}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#291C16] font-normal leading-tight text-balance">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#8C6A48] font-light pt-2">
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
            className="flex items-center gap-1 text-[#291C16] hover:text-[#8C6A48] transition-colors cursor-pointer"
          >
            {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedNotice ? 'Link Copied!' : 'Share Article'}</span>
          </button>
        </div>
      </header>

      {/* Featured Banner Image */}
      <div className="aspect-[16/9] w-full overflow-hidden bg-[#F4EFEA] border border-[#EAE2D7]">
        <img
          src={post.featuredImage}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="bg-white border border-[#EAE2D7] p-8 sm:p-14">
        <div className="text-sm sm:text-base text-[#4A3326] font-light leading-relaxed space-y-6 whitespace-pre-line">
          {post.content}
        </div>
      </div>

      {/* Recommended Product Module: BLOG ARTICLE → RECOMMENDED PRODUCT → PRODUCT PAGE → CART → WHATSAPP */}
      {recommendedProduct && (
        <section className="bg-[#F4EFEA] border border-[#D6C2A7] p-8 sm:p-10 space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8C6A48] font-semibold block">
              Featured in this Editorial
            </span>
            <h3 className="font-serif text-2xl text-[#291C16]">
              Recommended Luxury Piece
            </h3>
            <p className="text-xs text-[#6B5344] font-light">
              Experience the exact hair grade and density highlighted in this masterclass.
            </p>
          </div>

          <div className="max-w-md">
            <ProductCard
              product={recommendedProduct}
              onSelect={(slug) => onNavigate(`/product/${slug}`)}
            />
          </div>
        </section>
      )}

    </article>
  );
};
