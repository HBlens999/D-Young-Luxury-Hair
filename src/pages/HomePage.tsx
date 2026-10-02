import React, { useState, useEffect } from 'react';
import { HeroSlideshow } from '../components/common/HeroSlideshow';
import { ProductCard } from '../components/product/ProductCard';
import { Product, ProductCategory, BlogPost, VideoItem } from '../types';
import { db, formatWhatsAppNumberForLink } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Clock, 
  MessageCircle, 
  Play, 
  MapPin, 
  Quote, 
  Instagram, 
  Star 
} from 'lucide-react';

// TikTok Icon helper
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.95-4.52V8.9a8.28 8.28 0 0 0 4.82 1.55v-3.5a4.84 4.84 0 0 1-1-.26z" />
  </svg>
);

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadHomeData() {
      // Paint the last successful catalog/content snapshot immediately.
      // This prevents the whole homepage from waiting on Supabase after refresh.
      const [cachedProducts, cachedCategories, cachedPosts, cachedVideos] =
        await Promise.all([
          Promise.resolve(db.getCachedProducts()),
          Promise.resolve(db.getCachedCategories()),
          Promise.resolve(db.getCachedBlogPosts()),
          Promise.resolve(db.getCachedVideos())
        ]);

      if (!active) return;

      if (cachedProducts.length) setProducts(cachedProducts);
      if (cachedCategories.length) setCategories(cachedCategories);
      if (cachedPosts.length) setBlogPosts(cachedPosts);
      if (cachedVideos.length) setVideos(cachedVideos);

      // If we have a last-known-good snapshot, render it immediately.
      // Otherwise keep the initial loading state until the first refresh completes.
      const hasCachedContent =
        cachedProducts.length > 0 ||
        cachedCategories.length > 0 ||
        cachedPosts.length > 0 ||
        cachedVideos.length > 0;

      setIsLoading(!hasCachedContent);

      // Revalidate independently so one slow table cannot block the others.
      const refreshes = [
        db.getProducts().then(data => active && setProducts(data)),
        db.getCategories().then(data => active && setCategories(data)),
        db.getBlogPosts().then(data => active && setBlogPosts(data)),
        db.getVideos().then(data => active && setVideos(data))
      ];

      await Promise.allSettled(refreshes);

      if (active) setIsLoading(false);
    }

    loadHomeData().catch(err => {
      console.error('Failed to load homepage data:', err);
      if (active) setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured && p.isPublished).slice(0, 8);
  const newArrivals = products.filter(p => p.isNewArrival && p.isPublished).slice(0, 4);

  const cleanWhatsApp = formatWhatsAppNumberForLink(settings.whatsAppNumber || '08107123342');
  const conciergeWhatsApp = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello D Young Luxury Hairs, I would like to inquire about ordering your luxury hair.')}`;
  const founderWhatsApp = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Eze Stephen Chidubem, I am contacting D Young Luxury Hairs regarding your luxury hair collections.')}`;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. Cinematic Luxury Hero Slideshow */}
      <HeroSlideshow onNavigate={onNavigate} />

      {/* 1b. Official Brand Identity & Delivery Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-30">
        <div className="bg-[#241711] text-[#FDFCF7] border border-[#443024] p-5 sm:p-7 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 border-b sm:border-b-0 sm:border-r border-[#3E2D24] pb-4 sm:pb-0 pr-2">
            <Truck className="w-6 h-6 text-[#C5A059] shrink-0" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-semibold block">
                Nationwide Dispatch
              </span>
              <p className="text-xs text-[#EBE3D8] font-light">
                Delivery all over Nigeria
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 border-b sm:border-b-0 lg:border-r border-[#3E2D24] pb-4 sm:pb-0 pr-2">
            <Clock className="w-6 h-6 text-[#C5A059] shrink-0" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-semibold block">
                Always Available
              </span>
              <p className="text-xs text-[#EBE3D8] font-light">
                Open every day for orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 border-b sm:border-b-0 sm:border-r border-[#3E2D24] pb-4 sm:pb-0 pr-2">
            <MapPin className="w-6 h-6 text-[#C5A059] shrink-0" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-semibold block">
                Store Location
              </span>
              <p className="text-xs text-[#EBE3D8] font-light truncate">
                {settings.city || 'See store locations in Admin Settings'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-semibold block">
                Official Socials
              </span>
              <div className="flex items-center gap-3 mt-1">
                <a
                  href="https://instagram.com/dyoungluxury"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#EBE3D8] hover:text-[#C5A059] transition-colors flex items-center gap-1"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@dyoungluxury</span>
                </a>
                <a
                  href="https://tiktok.com/@d.young.hairs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#EBE3D8] hover:text-[#C5A059] transition-colors flex items-center gap-1"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                  <span>@d.young.hairs</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#EAE2D7]">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block mb-2">
              Curated Collections
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#291C16]">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/categories')}
            className="mt-4 md:mt-0 text-xs uppercase tracking-[0.16em] text-[#8C6A48] hover:text-[#291C16] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/shop?category=${cat.slug}`)}
              className="group cursor-pointer bg-white border border-[#EAE2D7] overflow-hidden hover:border-[#D6C2A7] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F4EFEA]">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1310]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#FDFCF7] group-hover:text-[#D6C2A7] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-[#6B5344] font-light line-clamp-2 leading-relaxed">
                  {cat.description || 'Explore our premier selection of handcrafted luxury hair.'}
                </p>
                <div className="mt-3 flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#8C6A48] font-medium group-hover:text-[#291C16]">
                  <span>Explore Line</span>
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Real Products Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#EAE2D7]">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block mb-2">
              Signature Excellence
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#291C16]">
              Featured Luxury Hairs
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <a
              href={conciergeWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.14em] text-[#25D366] font-semibold flex items-center gap-1.5 hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
              <span>WhatsApp: {settings.whatsAppNumber || 'Available in Admin Settings'}</span>
            </a>
            <button
              onClick={() => onNavigate('/shop')}
              className="text-xs uppercase tracking-[0.16em] text-[#8C6A48] hover:text-[#291C16] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {featuredProducts.length === 0 && isLoading ? (
          <div className="py-12 text-center text-[#8C6A48] bg-white border border-[#EAE2D7]">
            <p className="font-serif text-lg">Loading real hair collection...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(slug) => onNavigate(`/product/${slug}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. OFFICIAL CEO & BRAND FOUNDER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] border border-[#E2D5C3] p-6 sm:p-12 relative overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* CEO Portrait Column */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group max-w-sm">
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#8C6A48] to-[#C9AB7E] opacity-25 blur-sm"></div>
                <div className="relative w-64 sm:w-72 md:w-80 aspect-[3/4] overflow-hidden border-2 border-[#8C6A48] shadow-2xl bg-[#1C130E] flex flex-col items-center justify-center p-6 text-center">
                  {settings.ceoImageUrl ? (
                    <img
                      src={settings.ceoImageUrl}
                      alt="Eze Stephen Chidubem - Owner & Founder of D Young Luxury Hairs"
                      className="w-full h-full object-cover object-top filter contrast-[1.02] hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="w-20 h-20 rounded-full border-2 border-[#D8B46E] bg-[#120B07] mx-auto flex items-center justify-center text-[#E5C687] font-serif font-bold text-2xl shadow-inner">
                        ESC
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs uppercase tracking-widest text-[#E8D7C3] font-semibold block">
                          Eze Stephen Chidubem
                        </span>
                        <span className="text-[11px] text-[#C9AB7E] font-serif italic block">
                          Owner &amp; Founder
                        </span>
                      </div>
                      <p className="text-[10px] text-[#A8885B] uppercase tracking-wider font-light">
                        Official Photograph Awaiting Upload
                      </p>
                    </div>
                  )}
                  {settings.ceoImageUrl && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#291C16] via-[#291C16]/85 to-transparent p-4 text-center">
                      <span className="text-xs uppercase tracking-widest text-[#E8D7C3] font-semibold block">
                        Eze Stephen Chidubem
                      </span>
                      <span className="text-[11px] text-[#C9AB7E] font-serif italic block">
                        Owner &amp; Founder
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CEO Narrative & Slogan */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0E6D8] border border-[#D6C2A7] text-[#8C6A48] text-[11px] uppercase tracking-widest font-semibold">
                <Star className="w-3 h-3 fill-[#8C6A48]" />
                <span>Leadership & Vision</span>
              </div>

              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-4xl text-[#291C16] leading-tight">
                  Eze Stephen Chidubem
                </h2>
                <p className="text-xs uppercase tracking-widest text-[#8C6A48] font-semibold">
                  Owner & Founder · D Young Luxury Hairs
                </p>
              </div>

              {/* Founder Creed Callout */}
              <div className="border-l-4 border-[#8C6A48] pl-5 py-3 bg-white/80 shadow-sm border border-[#EAE2D7]">
                <div className="flex items-start gap-3">
                  <Quote className="w-6 h-6 text-[#8C6A48] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-serif text-xl sm:text-2xl text-[#291C16] italic leading-snug">
                      “Luxury hair or nothing.”
                    </p>
                    <span className="text-xs text-[#8C6A48] font-medium block mt-1">
                      — Eze Stephen Chidubem, Owner & Founder
                    </span>
                  </div>
                </div>
              </div>

              {/* Official Description */}
              <div className="space-y-3 text-xs sm:text-sm text-[#4A3326] font-light leading-relaxed">
                <p>
                  <strong>Eze Stephen Chidubem</strong> is the owner and founder of <strong>D Young Luxury Hairs</strong>, who is passionate about making those around him look good as he would always say, <em>“Luxury hair or nothing.”</em>
                </p>
                <p>
                  Under Stephen's direct guidance, D Young Luxury Hairs has grown from a boutique hair specialist into a destination for pure Vietnamese bone straight, Super Double Drawn bundles, bouncy curls, and custom hand-finished closures.
                </p>
              </div>

              {/* Contact buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={founderWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat with Founder on WhatsApp</span>
                </a>

                <button
                  onClick={() => onNavigate('/about')}
                  className="px-6 py-3 bg-[#291C16] hover:bg-[#3D291F] text-[#FDFCF7] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
                >
                  <span>Read Full Brand Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. Why Choose D Young Luxury Hairs */}
      <section className="bg-[#F4EFEA] border-y border-[#EAE2D7] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block">
              The Standard of Perfection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#291C16]">
              Why Choose D Young Luxury Hairs
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5344] font-light leading-relaxed">
              Slogan: <strong>Premium Hair or Nothing</strong>. Every bundle, closure, and custom unit meets our founder's exacting standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 border border-[#EAE2D7] space-y-3 shadow-sm">
              <span className="text-xs uppercase tracking-[0.18em] text-[#8C6A48] font-semibold block">
                01. 100% Single Donor Cuticles
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#291C16]">
                Pure Unidirectional Alignment
              </h3>
              <p className="text-xs text-[#6B5344] font-light leading-relaxed">
                Direct ethical sourcing of raw human hair strands with intact cuticles facing the same direction. No synthetic mixing, no silicone dipping, and zero matting.
              </p>
            </div>

            <div className="bg-white p-7 border border-[#EAE2D7] space-y-3 shadow-sm">
              <span className="text-xs uppercase tracking-[0.18em] text-[#8C6A48] font-semibold block">
                02. Super Double Drawn Fullness
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#291C16]">
                Thick Ends from Weft to Tip
              </h3>
              <p className="text-xs text-[#6B5344] font-light leading-relaxed">
                Short hairs are extracted so the unit maintains thick, luscious, uniform fullness down to the tips. Bold, royal, and commanding density that turns heads.
              </p>
            </div>

            <div className="bg-white p-7 border border-[#EAE2D7] space-y-3 shadow-sm">
              <span className="text-xs uppercase tracking-[0.18em] text-[#8C6A48] font-semibold block">
                03. Nationwide Delivery & Daily Hours
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#291C16]">
                Open Every Day Across Nigeria
              </h3>
              <p className="text-xs text-[#6B5344] font-light leading-relaxed">
                Fast, secure delivery to customers across Nigeria. Local pickup information is available from our store locations in {settings.city || 'your area'}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. New Arrivals Showcase */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#EAE2D7]">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block mb-2">
                Fresh Arrivals
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#291C16]">
                New In Store
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/shop')}
              className="mt-4 md:mt-0 text-xs uppercase tracking-[0.16em] text-[#8C6A48] hover:text-[#291C16] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Browse Full Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(slug) => onNavigate(`/product/${slug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. Latest Hair Care Blog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#EAE2D7]">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block mb-2">
              Hair Care & Education
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#291C16]">
              The Luxury Hair Journal
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/blog')}
            className="mt-4 md:mt-0 text-xs uppercase tracking-[0.16em] text-[#8C6A48] hover:text-[#291C16] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.slice(0, 2).map((post) => (
            <article
              key={post.id}
              onClick={() => onNavigate(`/blog/${post.slug}`)}
              className="group cursor-pointer bg-white border border-[#EAE2D7] overflow-hidden hover:border-[#D6C2A7] transition-all duration-300 shadow-sm"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#F4EFEA]">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#8C6A48]">
                  <span>{post.categoryName || 'Hair Education'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#291C16] group-hover:text-[#8C6A48] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-[#6B5344] font-light line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs uppercase tracking-wider text-[#291C16] font-semibold">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 8. Latest Video Showcase Reel */}
      {videos.length > 0 && (
        <section className="bg-[#1A1310] text-[#EBE3D8] py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#2E221C]">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#B89865] font-semibold block mb-2">
                  Motion & Texture
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl text-[#FDFCF7]">
                  Latest Hair Videos & Reviews
                </h2>
              </div>
              <button
                onClick={() => onNavigate('/videos')}
                className="mt-4 md:mt-0 text-xs uppercase tracking-[0.16em] text-[#B89865] hover:text-[#FDFCF7] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View All Videos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => onNavigate('/videos')}
                  className="group cursor-pointer bg-[#241A15] border border-[#3E2D24] overflow-hidden"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#B89865]/90 text-[#1A1310] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                    {vid.duration && (
                      <span className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 text-[10px] text-white tabular-nums">
                        {vid.duration}
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#B89865]">
                      {vid.category}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-[#FDFCF7] group-hover:text-[#B89865] transition-colors">
                      {vid.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Store Locations & Delivery Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] border border-[#EAE2D7] p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block">
              Official Store Locations
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
              Visit Our Head Office & Branches
            </h3>
            <p className="text-xs text-[#6B5344]">
              Open every day. Delivery all over Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border border-[#EAE2D7] space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#8C6A48] font-bold block">
                Head Office
              </span>
              <p className="text-xs text-[#291C16] leading-relaxed">
                {settings.headOffice || 'Head office address available in Admin Settings'}
              </p>
            </div>

            <div className="bg-white p-6 border border-[#EAE2D7] space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#8C6A48] font-bold block">
                Branch
              </span>
              <p className="text-xs text-[#291C16] leading-relaxed">
                {settings.branch1 || 'Branch address available in Admin Settings'}
              </p>
            </div>

            <div className="bg-white p-6 border border-[#EAE2D7] space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#8C6A48] font-bold block">
                Branch Office
              </span>
              <p className="text-xs text-[#291C16] leading-relaxed">
                {settings.branch2 || 'Branch office address available in Admin Settings'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Direct WhatsApp Ordering Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#291C16] text-[#FDFCF7] p-10 sm:p-14 border border-[#3E2D24] text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#B89865] font-semibold block">
              D Young Luxury Hairs
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
              Premium Hair or Nothing
            </h2>
            <p className="text-xs sm:text-sm text-[#D6C2A7] font-light leading-relaxed">
              Order directly through our verified WhatsApp concierge or browse our full catalogue of Super Double Drawn bone straight and bouncy curls.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('/shop')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#FDFCF7] text-[#1A1310] hover:bg-[#EBE3D8] text-xs uppercase tracking-[0.18em] font-semibold transition-colors cursor-pointer"
            >
              Shop All Products
            </button>
            <a
              href={conciergeWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase tracking-[0.18em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Order on WhatsApp (08107123342)</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
