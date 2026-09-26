import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, ProductCategory, Order, BlogPost, VideoItem, SiteSettings, CartItem, HeroSlide } from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_BLOG_POSTS, 
  INITIAL_VIDEOS, 
  INITIAL_SETTINGS 
} from './initialData';

// Supabase configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://geikolbqvlrcucobzwlt.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'your-supabase-anon-key');

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Helper: clean and format WhatsApp phone number (e.g. 08107123342 -> 2348107123342)
export function formatWhatsAppNumberForLink(phone: string): string {
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0') && clean.length === 11) {
    clean = '234' + clean.slice(1);
  }
  return clean;
}

// Local persistent storage keys for fallback/seamless offline testing
const STORAGE_KEYS = {
  PRODUCTS: 'dy_luxury_real_products_v2',
  CATEGORIES: 'dy_luxury_real_categories_v2',
  ORDERS: 'dy_luxury_orders_v2',
  BLOG_POSTS: 'dy_luxury_blog_posts_v2',
  VIDEOS: 'dy_luxury_videos_v2',
  SETTINGS: 'dy_luxury_settings_v2'
};

// Helper: safe local storage retrieval with demo data purging
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    const parsed = JSON.parse(item);
    // If it's the old demo products array, ignore and replace with INITIAL_PRODUCTS
    if (key === STORAGE_KEYS.PRODUCTS && Array.isArray(parsed)) {
      const hasOldDemo = parsed.some((p: any) => p.id === 'prod-1' && p.name.includes('SDD Vietnamese Bone Straight Bundles') && p.minPrice === 195000);
      if (hasOldDemo) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
    }
    return parsed;
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to store key ${key}:`, err);
  }
}

// ==========================================
// DATA API (SUPABASE WITH SEAMLESS LOCAL CACHE)
// ==========================================

export const db = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, variants:product_variants(*)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            categoryId: p.category_id,
            categoryName: p.category_name,
            productType: p.product_type,
            shortDescription: p.short_description,
            description: p.description,
            mainImage: p.main_image,
            additionalImages: p.additional_images || [],
            variants: p.variants ? p.variants.map((v: any) => ({
              id: v.id,
              length: v.length,
              color: v.color,
              price: Number(v.price),
              sku: v.sku,
              stockQuantity: v.stock_quantity ?? 10
            })) : [],
            minPrice: Number(p.min_price || 0),
            maxPrice: Number(p.max_price || 0),
            texture: p.texture,
            density: p.density,
            capSize: p.cap_size,
            origin: p.origin,
            availability: p.availability || 'in_stock',
            isFeatured: Boolean(p.is_featured),
            isNewArrival: Boolean(p.is_new_arrival),
            isPublished: Boolean(p.is_published ?? true),
            createdAt: p.created_at,
            updatedAt: p.updated_at
          }));
        }
      } catch (err) {
        console.warn('Supabase products fetch failed, using local cache:', err);
      }
    }
    return getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find(p => p.slug === slug) || null;
  },

  async saveProduct(product: Product): Promise<Product> {
    if (supabase) {
      try {
        const { error } = await supabase.from('products').upsert({
          id: product.id,
          name: product.name,
          slug: product.slug,
          category_id: product.categoryId,
          category_name: product.categoryName,
          product_type: product.productType,
          short_description: product.shortDescription,
          description: product.description,
          main_image: product.mainImage,
          additional_images: product.additionalImages,
          min_price: product.minPrice,
          max_price: product.maxPrice,
          texture: product.texture,
          density: product.density,
          cap_size: product.capSize,
          origin: product.origin,
          availability: product.availability,
          is_featured: product.isFeatured,
          is_new_arrival: product.isNewArrival,
          is_published: product.isPublished,
          updated_at: new Date().toISOString()
        });

        if (!error && product.variants && product.variants.length > 0) {
          // Upsert variants
          const variantRows = product.variants.map(v => ({
            id: v.id,
            product_id: product.id,
            length: v.length,
            color: v.color,
            price: v.price,
            sku: v.sku,
            stock_quantity: v.stockQuantity
          }));
          await supabase.from('product_variants').upsert(variantRows);
        }
      } catch (err) {
        console.warn('Supabase product save failed, falling back to local storage:', err);
      }
    }

    const current = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const existingIndex = current.findIndex(p => p.id === product.id);
    let updated: Product[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      updated = [product, ...current];
    }
    setLocalItem(STORAGE_KEYS.PRODUCTS, updated);
    return product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (supabase) {
      try {
        await supabase.from('product_variants').delete().eq('product_id', id);
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase product delete error:', err);
      }
    }
    const current = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setLocalItem(STORAGE_KEYS.PRODUCTS, current.filter(p => p.id !== id));
    return true;
  },

  // CATEGORIES
  async getCategories(): Promise<ProductCategory[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('product_categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            image: c.image,
            displayOrder: c.display_order
          }));
        }
      } catch (err) {
        console.warn('Supabase categories fetch error:', err);
      }
    }
    return getLocalItem<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  async saveCategory(cat: ProductCategory): Promise<ProductCategory> {
    if (supabase) {
      try {
        await supabase.from('product_categories').upsert({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          display_order: cat.displayOrder
        });
      } catch (err) {
        console.warn('Supabase category save error:', err);
      }
    }
    const current = getLocalItem<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const idx = current.findIndex(c => c.id === cat.id);
    let updated: ProductCategory[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = cat;
    } else {
      updated = [...current, cat];
    }
    setLocalItem(STORAGE_KEYS.CATEGORIES, updated);
    return cat;
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (supabase) {
      try {
        await supabase.from('product_categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase category delete error:', err);
      }
    }
    const current = getLocalItem<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setLocalItem(STORAGE_KEYS.CATEGORIES, current.filter(c => c.id !== id));
    return true;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((o: any) => ({
            id: o.id,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            customerWhatsApp: o.customer_whatsapp,
            deliveryLocation: o.delivery_location,
            customerNote: o.customer_note,
            totalAmount: Number(o.total_amount),
            status: o.status,
            createdAt: o.created_at,
            updatedAt: o.updated_at,
            items: o.order_items ? o.order_items.map((i: any) => ({
              productId: i.product_id,
              productName: i.product_name,
              length: i.length,
              color: i.color,
              price: Number(i.price),
              quantity: Number(i.quantity),
              subtotal: Number(i.subtotal)
            })) : []
          }));
        }
      } catch (err) {
        console.warn('Supabase orders fetch error:', err);
      }
    }
    return getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: 'ord-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { error } = await supabase.from('orders').insert({
          id: newOrder.id,
          customer_name: newOrder.customerName,
          customer_phone: newOrder.customerPhone,
          customer_whatsapp: newOrder.customerWhatsApp,
          delivery_location: newOrder.deliveryLocation,
          customer_note: newOrder.customerNote,
          total_amount: newOrder.totalAmount,
          status: newOrder.status,
          created_at: newOrder.createdAt,
          updated_at: newOrder.updatedAt
        });

        if (!error && newOrder.items.length > 0) {
          const itemRows = newOrder.items.map(item => ({
            order_id: newOrder.id,
            product_id: item.productId,
            product_name: item.productName,
            length: item.length,
            color: item.color,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal
          }));
          await supabase.from('order_items').insert(itemRows);
        }
      } catch (err) {
        console.warn('Supabase order creation error:', err);
      }
    }

    const current = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    setLocalItem(STORAGE_KEYS.ORDERS, [newOrder, ...current]);
    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    if (supabase) {
      try {
        await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }
    }
    const current = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    const updated = current.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o);
    setLocalItem(STORAGE_KEYS.ORDERS, updated);
    return true;
  },

  // BLOG POSTS
  async getBlogPosts(): Promise<BlogPost[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((b: any) => ({
            id: b.id,
            title: b.title,
            slug: b.slug,
            categoryId: b.category_id,
            categoryName: b.category_name,
            excerpt: b.excerpt,
            content: b.content,
            featuredImage: b.featured_image,
            author: b.author,
            readTime: b.read_time,
            recommendedProductId: b.recommended_product_id,
            isPublished: Boolean(b.is_published),
            publishedAt: b.published_at,
            seoTitle: b.seo_title,
            seoDescription: b.seo_description
          }));
        }
      } catch (err) {
        console.warn('Supabase blog fetch error:', err);
      }
    }
    return getLocalItem<BlogPost[]>(STORAGE_KEYS.BLOG_POSTS, INITIAL_BLOG_POSTS);
  },

  async saveBlogPost(post: BlogPost): Promise<BlogPost> {
    if (supabase) {
      try {
        await supabase.from('blog_posts').upsert({
          id: post.id,
          title: post.title,
          slug: post.slug,
          category_id: post.categoryId,
          category_name: post.categoryName,
          excerpt: post.excerpt,
          content: post.content,
          featured_image: post.featuredImage,
          author: post.author,
          read_time: post.readTime,
          recommended_product_id: post.recommendedProductId,
          is_published: post.isPublished,
          published_at: post.publishedAt,
          seo_title: post.seoTitle,
          seo_description: post.seoDescription
        });
      } catch (err) {
        console.warn('Supabase blog post save error:', err);
      }
    }
    const current = getLocalItem<BlogPost[]>(STORAGE_KEYS.BLOG_POSTS, INITIAL_BLOG_POSTS);
    const idx = current.findIndex(b => b.id === post.id);
    let updated: BlogPost[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = post;
    } else {
      updated = [post, ...current];
    }
    setLocalItem(STORAGE_KEYS.BLOG_POSTS, updated);
    return post;
  },

  async deleteBlogPost(id: string): Promise<boolean> {
    if (supabase) {
      try {
        await supabase.from('blog_posts').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase blog delete error:', err);
      }
    }
    const current = getLocalItem<BlogPost[]>(STORAGE_KEYS.BLOG_POSTS, INITIAL_BLOG_POSTS);
    setLocalItem(STORAGE_KEYS.BLOG_POSTS, current.filter(b => b.id !== id));
    return true;
  },

  // VIDEOS
  async getVideos(): Promise<VideoItem[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((v: any) => ({
            id: v.id,
            title: v.title,
            description: v.description,
            videoUrl: v.video_url,
            thumbnailUrl: v.thumbnail_url,
            category: v.category,
            duration: v.duration,
            isPublished: Boolean(v.is_published),
            createdAt: v.created_at
          }));
        }
      } catch (err) {
        console.warn('Supabase videos fetch error:', err);
      }
    }
    return getLocalItem<VideoItem[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
  },

  async saveVideo(video: VideoItem): Promise<VideoItem> {
    if (supabase) {
      try {
        await supabase.from('videos').upsert({
          id: video.id,
          title: video.title,
          description: video.description,
          video_url: video.videoUrl,
          thumbnail_url: video.thumbnailUrl,
          category: video.category,
          duration: video.duration,
          is_published: video.isPublished,
          created_at: video.createdAt
        });
      } catch (err) {
        console.warn('Supabase video save error:', err);
      }
    }
    const current = getLocalItem<VideoItem[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
    const idx = current.findIndex(v => v.id === video.id);
    let updated: VideoItem[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = video;
    } else {
      updated = [video, ...current];
    }
    setLocalItem(STORAGE_KEYS.VIDEOS, updated);
    return video;
  },

  async deleteVideo(id: string): Promise<boolean> {
    if (supabase) {
      try {
        await supabase.from('videos').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase video delete error:', err);
      }
    }
    const current = getLocalItem<VideoItem[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
    setLocalItem(STORAGE_KEYS.VIDEOS, current.filter(v => v.id !== id));
    return true;
  },

  // SETTINGS
  async getSettings(): Promise<SiteSettings> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'default_settings')
          .single();

        if (!error && data) {
          return {
            brandName: data.brand_name || INITIAL_SETTINGS.brandName,
            tagline: data.tagline || INITIAL_SETTINGS.tagline,
            slogan: data.slogan || INITIAL_SETTINGS.slogan,
            whatsAppNumber: data.whatsapp_number || INITIAL_SETTINGS.whatsAppNumber,
            phoneNumber: data.phone_number || INITIAL_SETTINGS.phoneNumber,
            email: data.email || INITIAL_SETTINGS.email,
            showroomAddress: data.showroom_address || INITIAL_SETTINGS.showroomAddress,
            headOffice: data.head_office || INITIAL_SETTINGS.headOffice,
            branch1: data.branch1 || INITIAL_SETTINGS.branch1,
            branch2: data.branch2 || INITIAL_SETTINGS.branch2,
            city: data.city || INITIAL_SETTINGS.city,
            businessHours: data.business_hours || INITIAL_SETTINGS.businessHours,
            deliveryInfo: data.delivery_info || INITIAL_SETTINGS.deliveryInfo,
            instagramUrl: data.instagram_url || INITIAL_SETTINGS.instagramUrl,
            facebookUrl: data.facebook_url || '',
            tiktokUrl: data.tiktok_url || INITIAL_SETTINGS.tiktokUrl,
            currencySymbol: data.currency_symbol || '₦',
            announcementText: data.announcement_text || INITIAL_SETTINGS.announcementText,
            isAnnouncementActive: Boolean(data.is_announcement_active ?? true),
            freeDeliveryThreshold: Number(data.free_delivery_threshold || 400000)
          };
        }
      } catch (err) {
        console.warn('Supabase settings fetch error:', err);
      }
    }
    return getLocalItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async saveSettings(settings: SiteSettings): Promise<SiteSettings> {
    if (supabase) {
      try {
        await supabase.from('site_settings').upsert({
          id: 'default_settings',
          brand_name: settings.brandName,
          tagline: settings.tagline,
          slogan: settings.slogan,
          whatsapp_number: settings.whatsAppNumber,
          phone_number: settings.phoneNumber,
          email: settings.email,
          showroom_address: settings.showroomAddress,
          head_office: settings.headOffice,
          branch1: settings.branch1,
          branch2: settings.branch2,
          city: settings.city,
          business_hours: settings.businessHours,
          delivery_info: settings.deliveryInfo,
          instagram_url: settings.instagramUrl,
          facebook_url: settings.facebookUrl,
          tiktok_url: settings.tiktokUrl,
          currency_symbol: settings.currencySymbol,
          announcement_text: settings.announcementText,
          is_announcement_active: settings.isAnnouncementActive,
          free_delivery_threshold: settings.freeDeliveryThreshold,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase settings save error:', err);
      }
    }
    setLocalItem(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  }
};

// ==========================================
// WHATSAPP ORDER BUILDER (STRICT SECTION 12 SPEC)
// ==========================================
export function generateWhatsAppOrderUrl(
  whatsAppNumber: string,
  customerName: string,
  customerPhone: string,
  deliveryLocation: string,
  items: CartItem[],
  totalAmount: number,
  customerNote?: string
): string {
  const formattedNumber = formatWhatsAppNumberForLink(whatsAppNumber);

  const itemsList = items
    .map(i => `• ${i.productName} — ${i.length}${i.color ? ' / ' + i.color : ''} — Qty ${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()}`)
    .join('\n');

  const noteBlock = customerNote && customerNote.trim() ? `\nCustomer Note: ${customerNote.trim()}\n` : '';

  const messageText = 
`NEW ORDER — D YOUNG LUXURY HAIRS
Slogan: Premium Hair or Nothing

Customer Details:
• Name: ${customerName}
• Phone: ${customerPhone}
• Delivery Location: ${deliveryLocation}

Ordered Products:
${itemsList}

Total Amount: ₦${totalAmount.toLocaleString()}
${noteBlock}
Please confirm availability and delivery to my location.`;

  return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(messageText)}`;
}

// Generate single product WhatsApp inquiry URL
export function generateProductInquiryUrl(
  whatsAppNumber: string,
  productName: string,
  selectedVariant?: string,
  price?: number
): string {
  const formattedNumber = formatWhatsAppNumberForLink(whatsAppNumber);
  const details = selectedVariant ? ` (${selectedVariant}${price ? ' - ₦' + price.toLocaleString() : ''})` : '';
  const message = `Hello D Young Luxury Hairs, I would like to order: ${productName}${details}. Please let me know its availability and delivery options.`;
  return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
}

// Supabase SQL Schema for easy 1-click execution in Supabase SQL editor
export const SUPABASE_SQL_SCHEMA = `-- D YOUNG LUXURY HAIRS: Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/geikolbqvlrcucobzwlt/sql)

-- 1. Product Categories Table
CREATE TABLE IF NOT EXISTS public.product_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT REFERENCES public.product_categories(id) ON DELETE SET NULL,
  category_name TEXT,
  product_type TEXT DEFAULT 'Human Hair',
  short_description TEXT,
  description TEXT,
  main_image TEXT NOT NULL,
  additional_images JSONB DEFAULT '[]'::jsonb,
  min_price NUMERIC NOT NULL DEFAULT 0,
  max_price NUMERIC NOT NULL DEFAULT 0,
  texture TEXT,
  density TEXT,
  cap_size TEXT,
  origin TEXT,
  availability TEXT DEFAULT 'in_stock',
  is_featured BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Product Variants Table
CREATE TABLE IF NOT EXISTS public.product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  length TEXT NOT NULL,
  color TEXT,
  price NUMERIC NOT NULL,
  sku TEXT,
  stock_quantity INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  customer_note TEXT,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT NOT NULL,
  length TEXT,
  color TEXT,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal NUMERIC NOT NULL
);

-- 6. Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT,
  category_name TEXT,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  author TEXT NOT NULL,
  read_time TEXT,
  recommended_product_id TEXT,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT
);

-- 7. Videos Table
CREATE TABLE IF NOT EXISTS public.videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  category TEXT,
  duration TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default_settings',
  brand_name TEXT NOT NULL,
  tagline TEXT,
  whatsapp_number TEXT NOT NULL,
  phone_number TEXT,
  email TEXT,
  showroom_address TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  tiktok_url TEXT,
  currency_symbol TEXT DEFAULT '₦',
  announcement_text TEXT,
  is_announcement_active BOOLEAN DEFAULT true,
  free_delivery_threshold NUMERIC DEFAULT 400000,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can view published categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Public can view published products" ON public.products FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can view variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Public can view published blogs" ON public.blog_posts FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can view published videos" ON public.videos FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);

-- Order submission policy (Public can create orders)
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Admin CRUD Policies
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to categories" ON public.product_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to variants" ON public.product_variants FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to blogs" ON public.blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to videos" ON public.videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
`;
