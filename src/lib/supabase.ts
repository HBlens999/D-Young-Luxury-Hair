import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Product,
  ProductCategory,
  Order,
  BlogPost,
  VideoItem,
  SiteSettings,
  CartItem,
  HeroSlide
} from '../types';

import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BLOG_POSTS,
  INITIAL_VIDEOS,
  INITIAL_SETTINGS
} from './initialData';

// Supabase configuration
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://geikolbqvlrcucobzwlt.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  SUPABASE_ANON_KEY !== 'your-supabase-anon-key'
);

export const supabase: SupabaseClient | null =
  isSupabaseConfigured
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Helper: clean and format WhatsApp phone number
export function formatWhatsAppNumberForLink(phone: string): string {
  let clean = phone.replace(/[^0-9]/g, '');

  if (clean.startsWith('0') && clean.length === 11) {
    clean = '234' + clean.slice(1);
  }

  return clean;
}

// Local persistent storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'dy_luxury_real_products_v2',
  CATEGORIES: 'dy_luxury_real_categories_v2',
  ORDERS: 'dy_luxury_orders_v2',
  BLOG_POSTS: 'dy_luxury_blog_posts_v2',
  VIDEOS: 'dy_luxury_videos_v2',
  SETTINGS: 'dy_luxury_settings_v2'
};

// Helper: safe local storage retrieval
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);

    if (!item) return defaultValue;

    const parsed = JSON.parse(item);

    // Remove old demo products
    if (key === STORAGE_KEYS.PRODUCTS && Array.isArray(parsed)) {
      const hasOldDemo = parsed.some(
        (p: any) =>
          p.id === 'prod-1' &&
          p.name?.includes('SDD Vietnamese Bone Straight Bundles') &&
          p.minPrice === 195000
      );

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

function getCachedArray<T>(key: string): T[] {
  return getLocalItem<T[]>(key, []);
}

// ==========================================
// DATA API
// ==========================================

export const db = {

  getCachedProducts(): Product[] {
    return getCachedArray<Product>(STORAGE_KEYS.PRODUCTS);
  },

  getCachedCategories(): ProductCategory[] {
    return getCachedArray<ProductCategory>(STORAGE_KEYS.CATEGORIES);
  },

  getCachedBlogPosts(): BlogPost[] {
    return getCachedArray<BlogPost>(STORAGE_KEYS.BLOG_POSTS);
  },

  getCachedVideos(): VideoItem[] {
    return getCachedArray<VideoItem>(STORAGE_KEYS.VIDEOS);
  },

  // ==========================================
  // PRODUCTS
  // ==========================================

  async getProducts(): Promise<Product[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, variants:product_variants(*)')
          .order('created_at', { ascending: false });

        if (error) {
          console.error(
            'Supabase products fetch failed:',
            error
          );

          throw new Error(
            `Failed to load products: ${error.message}`
          );
        }

        if (data) {
          const products = data.map((p: any) => ({
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
            variants: p.variants
              ? p.variants.map((v: any) => ({
                  id: v.id,
                  length: v.length,
                  color: v.color,
                  price: Number(v.price),
                  sku: v.sku,
                  stockQuantity: v.stock_quantity ?? 10
                }))
              : [],
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

          // Do not persist the full product catalogue in localStorage.
          // Product records contain large image URL arrays and all variants,
          // which can exceed the browser's small localStorage quota and break
          // admin/public data flows. Products are always fetched from Supabase.
          return products;
        }

        return [];
      } catch (err) {
        console.error(
          'Supabase products fetch failed:',
          err
        );

        throw err;
      }
    }

    return getLocalItem<Product[]>(
      STORAGE_KEYS.PRODUCTS,
      INITIAL_PRODUCTS
    );
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            slug,
            category_id,
            category_name,
            product_type,
            short_description,
            description,
            main_image,
            additional_images,
            min_price,
            max_price,
            texture,
            density,
            cap_size,
            origin,
            availability,
            is_featured,
            is_new_arrival,
            is_published,
            created_at,
            updated_at,
            variants:product_variants(
              id,
              length,
              color,
              price,
              sku,
              stock_quantity
            )
          `)
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle();

        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            categoryId: data.category_id,
            categoryName: data.category_name,
            productType: data.product_type,
            shortDescription: data.short_description,
            description: data.description,
            mainImage: data.main_image,
            additionalImages: data.additional_images || [],
            variants: (data.variants || []).map((v: any) => ({
              id: v.id,
              length: v.length,
              color: v.color,
              price: Number(v.price),
              sku: v.sku,
              stockQuantity: v.stock_quantity ?? 10
            })),
            minPrice: Number(data.min_price || 0),
            maxPrice: Number(data.max_price || 0),
            texture: data.texture,
            density: data.density,
            capSize: data.cap_size,
            origin: data.origin,
            availability: data.availability || 'in_stock',
            isFeatured: Boolean(data.is_featured),
            isNewArrival: Boolean(data.is_new_arrival),
            isPublished: Boolean(data.is_published ?? true),
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
        }

        if (error) {
          console.warn('Supabase product detail fetch failed:', error);
        }
      } catch (err) {
        console.warn('Supabase product detail fetch failed:', err);
      }
    }

    const products = getCachedArray<Product>(STORAGE_KEYS.PRODUCTS);
    return products.find(p => p.slug === slug) || null;
  },

  async saveProduct(product: Product): Promise<Product> {
    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Product was not saved.'
      );
    }

    try {
      // ==========================================
      // 1. SAVE MAIN PRODUCT
      // ==========================================

      const { error: productError } = await supabase
        .from('products')
        .upsert({
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

      if (productError) {
        console.error(
          'Product save failed:',
          productError
        );

        throw new Error(
          `Product save failed: ${productError.message}`
        );
      }

      // ==========================================
      // 2. REMOVE OLD VARIANTS
      // ==========================================

      const { error: deleteVariantsError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', product.id);

      if (deleteVariantsError) {
        console.error(
          'Existing product variants could not be removed:',
          deleteVariantsError
        );

        throw new Error(
          `Could not update product variants: ${deleteVariantsError.message}`
        );
      }

      // ==========================================
      // 3. SAVE CURRENT VARIANTS
      // ==========================================

      if (product.variants && product.variants.length > 0) {
        const variantRows = product.variants.map(v => ({
          id: v.id,
          product_id: product.id,
          length: v.length,
          color: v.color,
          price: Number(v.price),
          sku: v.sku,
          stock_quantity: Number(v.stockQuantity ?? 0)
        }));

        const { error: variantsError } = await supabase
          .from('product_variants')
          .insert(variantRows);

        if (variantsError) {
          console.error(
            'Product variants save failed:',
            variantsError
          );

          throw new Error(
            `Product variants save failed: ${variantsError.message}`
          );
        }
      }

      // ==========================================
      // 4. UPDATE LOCAL CACHE ONLY AFTER
      //    SUPABASE SUCCESS
      // ==========================================

      const current = getLocalItem<Product[]>(
        STORAGE_KEYS.PRODUCTS,
        []
      );

      const existingIndex = current.findIndex(
        p => p.id === product.id
      );

      const savedProduct: Product = {
        ...product,
        updatedAt: new Date().toISOString()
      };

      let updated: Product[];

      if (existingIndex >= 0) {
        updated = [...current];
        updated[existingIndex] = savedProduct;
      } else {
        updated = [savedProduct, ...current];
      }

      setLocalItem(
        STORAGE_KEYS.PRODUCTS,
        updated
      );

      return savedProduct;

    } catch (err) {
      console.error(
        'Supabase product save failed:',
        err
      );

      throw err;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Product was not deleted.'
      );
    }

    try {
      const { error: variantsError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', id);

      if (variantsError) {
        throw new Error(
          `Could not delete product variants: ${variantsError.message}`
        );
      }

      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (productError) {
        throw new Error(
          `Could not delete product: ${productError.message}`
        );
      }

      const current = getLocalItem<Product[]>(
        STORAGE_KEYS.PRODUCTS,
        []
      );

      setLocalItem(
        STORAGE_KEYS.PRODUCTS,
        current.filter(p => p.id !== id)
      );

      return true;

    } catch (err) {
      console.error(
        'Supabase product delete error:',
        err
      );

      throw err;
    }
  },

  // ==========================================
  // CATEGORIES
  // ==========================================

  async getCategories(): Promise<ProductCategory[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('product_categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) {
          console.error(
            'Supabase categories fetch failed:',
            error
          );

          throw new Error(
            `Failed to load categories: ${error.message}`
          );
        }

        // IMPORTANT:
        // If Supabase successfully returns an empty table,
        // return an empty array.
        //
        // DO NOT fall back to INITIAL_CATEGORIES because
        // those local IDs may not exist in Supabase and can
        // cause product foreign-key errors.
        const categories = (data || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || '',
          image: c.image || '',
          displayOrder: Number(c.display_order ?? 0)
        }));

        setLocalItem(STORAGE_KEYS.CATEGORIES, categories);
        return categories;

      } catch (err) {
        console.error(
          'Supabase categories fetch failed:',
          err
        );

        throw err;
      }
    }

    return getLocalItem<ProductCategory[]>(
      STORAGE_KEYS.CATEGORIES,
      INITIAL_CATEGORIES
    );
  },

  async saveCategory(
    cat: ProductCategory
  ): Promise<ProductCategory> {

    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Category was not saved.'
      );
    }

    try {
      const categoryToSave = {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        image: cat.image || '',
        display_order: Number(cat.displayOrder ?? 0)
      };

      const { data, error } = await supabase
        .from('product_categories')
        .upsert(categoryToSave)
        .select()
        .single();

      if (error) {
        console.error(
          'Supabase category save failed:',
          error
        );

        throw new Error(
          `Category save failed: ${error.message}`
        );
      }

      if (!data) {
        throw new Error(
          'Category save failed: Supabase returned no category.'
        );
      }

      const savedCategory: ProductCategory = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        image: data.image || '',
        displayOrder: Number(data.display_order ?? 0)
      };

      // Only cache locally AFTER Supabase succeeds.
      const current = getLocalItem<ProductCategory[]>(
        STORAGE_KEYS.CATEGORIES,
        []
      );

      const idx = current.findIndex(
        c => c.id === savedCategory.id
      );

      const updated =
        idx >= 0
          ? current.map((c, i) =>
              i === idx ? savedCategory : c
            )
          : [savedCategory, ...current];

      setLocalItem(
        STORAGE_KEYS.CATEGORIES,
        updated
      );

      return savedCategory;

    } catch (err) {
      console.error(
        'Supabase category save failed:',
        err
      );

      throw err;
    }
  },

  async deleteCategory(id: string): Promise<boolean> {

    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Category was not deleted.'
      );
    }

    try {
      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(
          'Supabase category delete failed:',
          error
        );

        throw new Error(
          `Category delete failed: ${error.message}`
        );
      }

      const current = getLocalItem<ProductCategory[]>(
        STORAGE_KEYS.CATEGORIES,
        []
      );

      setLocalItem(
        STORAGE_KEYS.CATEGORIES,
        current.filter(c => c.id !== id)
      );

      return true;

    } catch (err) {
      console.error(
        'Supabase category delete failed:',
        err
      );

      throw err;
    }
  },

  // ==========================================
  // ORDERS
  // ==========================================

  async getOrders(): Promise<Order[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (!error && data) {
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
            items: o.order_items
              ? o.order_items.map((i: any) => ({
                  productId: i.product_id,
                  productName: i.product_name,
                  length: i.length,
                  color: i.color,
                  price: Number(i.price),
                  quantity: Number(i.quantity),
                  subtotal: Number(i.subtotal)
                }))
              : []
          }));
        }

        if (error) {
          console.warn(
            'Supabase orders fetch error:',
            error
          );
        }
      } catch (err) {
        console.warn(
          'Supabase orders fetch error:',
          err
        );
      }
    }

    return getLocalItem<Order[]>(
      STORAGE_KEYS.ORDERS,
      []
    );
  },

  async createOrder(
    order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Order> {

    const newOrder: Order = {
      ...order,
      id:
        'ord-' +
        Date.now() +
        '-' +
        Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .insert({
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

        if (error) {
          console.warn(
            'Supabase order creation error:',
            error
          );
        }

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

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemRows);

          if (itemsError) {
            console.warn(
              'Supabase order items creation error:',
              itemsError
            );
          }
        }
      } catch (err) {
        console.warn(
          'Supabase order creation error:',
          err
        );
      }
    }

    const current = getLocalItem<Order[]>(
      STORAGE_KEYS.ORDERS,
      []
    );

    setLocalItem(
      STORAGE_KEYS.ORDERS,
      [newOrder, ...current]
    );

    return newOrder;
  },

  async updateOrderStatus(
    orderId: string,
    status: Order['status']
  ): Promise<boolean> {

    if (supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);

        if (error) {
          console.warn(
            'Supabase status update error:',
            error
          );
        }
      } catch (err) {
        console.warn(
          'Supabase status update error:',
          err
        );
      }
    }

    const current = getLocalItem<Order[]>(
      STORAGE_KEYS.ORDERS,
      []
    );

    const updated = current.map(o =>
      o.id === orderId
        ? {
            ...o,
            status,
            updatedAt: new Date().toISOString()
          }
        : o
    );

    setLocalItem(
      STORAGE_KEYS.ORDERS,
      updated
    );

    return true;
  },

  // ==========================================
  // BLOG POSTS
  // ==========================================

  async getBlogPosts(): Promise<BlogPost[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false });

        if (!error && data) {
          const posts = data.map((b: any) => ({
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
            recommendedProductId:
              b.recommended_product_id,
            isPublished: Boolean(b.is_published),
            publishedAt: b.published_at,
            seoTitle: b.seo_title,
            seoDescription: b.seo_description
          }));

          setLocalItem(STORAGE_KEYS.BLOG_POSTS, posts);
          return posts;
        }

        if (error) {
          console.warn(
            'Supabase blog fetch error:',
            error
          );
        }
      } catch (err) {
        console.warn(
          'Supabase blog fetch error:',
          err
        );
      }
    }

    return getLocalItem<BlogPost[]>(
      STORAGE_KEYS.BLOG_POSTS,
      INITIAL_BLOG_POSTS
    );
  },

  async saveBlogPost(
    post: BlogPost
  ): Promise<BlogPost> {

    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Blog post was not saved.'
      );
    }

    const { error } = await supabase
      .from('blog_posts')
      .upsert({
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
        recommended_product_id:
          post.recommendedProductId,
        is_published: post.isPublished,
        published_at: post.publishedAt,
        seo_title: post.seoTitle,
        seo_description: post.seoDescription
      });

    if (error) {
      console.error(
        'Supabase blog post save failed:',
        error
      );

      throw new Error(
        `Blog post save failed: ${error.message}`
      );
    }

    const current = getLocalItem<BlogPost[]>(
      STORAGE_KEYS.BLOG_POSTS,
      []
    );

    const idx = current.findIndex(
      b => b.id === post.id
    );

    const updated =
      idx >= 0
        ? current.map((b, i) =>
            i === idx ? post : b
          )
        : [post, ...current];

    setLocalItem(
      STORAGE_KEYS.BLOG_POSTS,
      updated
    );

    return post;
  },

  async deleteBlogPost(
    id: string
  ): Promise<boolean> {

    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Blog post was not deleted.'
      );
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(
        'Supabase blog post delete failed:',
        error
      );

      throw new Error(
        `Blog post delete failed: ${error.message}`
      );
    }

    const current = getLocalItem<BlogPost[]>(
      STORAGE_KEYS.BLOG_POSTS,
      []
    );

    setLocalItem(
      STORAGE_KEYS.BLOG_POSTS,
      current.filter(b => b.id !== id)
    );

    return true;
  },

  // ==========================================
  // VIDEOS
  // ==========================================

  async getVideos(): Promise<VideoItem[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const videos = data.map((v: any) => ({
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

          setLocalItem(STORAGE_KEYS.VIDEOS, videos);
          return videos;
        }

        if (error) {
          console.warn(
            'Supabase videos fetch error:',
            error
          );
        }
      } catch (err) {
        console.warn(
          'Supabase videos fetch error:',
          err
        );
      }
    }

    return getLocalItem<VideoItem[]>(
      STORAGE_KEYS.VIDEOS,
      INITIAL_VIDEOS
    );
  },

  async saveVideo(
    video: VideoItem
  ): Promise<VideoItem> {

    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Video was not saved.'
      );
    }

    const { error } = await supabase
      .from('videos')
      .upsert({
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

    if (error) {
      console.error(
        'Supabase video save failed:',
        error
      );

      throw new Error(
        `Video save failed: ${error.message}`
      );
    }

    const current = getLocalItem<VideoItem[]>(
      STORAGE_KEYS.VIDEOS,
      []
    );

    const idx = current.findIndex(
      v => v.id === video.id
    );

    const updated =
      idx >= 0
        ? current.map((v, i) =>
            i === idx ? video : v
          )
        : [video, ...current];

    setLocalItem(
      STORAGE_KEYS.VIDEOS,
      updated
    );

    return video;
  },

  async deleteVideo(id: string): Promise<boolean> {

    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Video was not deleted.'
      );
    }

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(
        'Supabase video delete failed:',
        error
      );

      throw new Error(
        `Video delete failed: ${error.message}`
      );
    }

    const current = getLocalItem<VideoItem[]>(
      STORAGE_KEYS.VIDEOS,
      []
    );

    setLocalItem(
      STORAGE_KEYS.VIDEOS,
      current.filter(v => v.id !== id)
    );

    return true;
  },

  // ==========================================
  // HERO SLIDES
  // ==========================================

  async getHeroSlides(): Promise<HeroSlide[]> {

    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order', {
          ascending: true
        });

      if (error) {
        console.error(
          'Supabase hero slides fetch failed:',
          error
        );

        throw new Error(
          `Failed to load hero slides: ${error.message}`
        );
      }

      if (!data) {
        return [];
      }

      return data.map((s: any) => ({
        id: s.id,
        image: s.image || '',
        title: s.title || '',
        subtitle: s.subtitle || '',
        tagline: s.tagline || '',
        ctaPrimary:
          s.cta_primary || 'Shop Collection',
        ctaSecondary:
          s.cta_secondary || 'Order via WhatsApp',
        link: s.link || '/shop',
        displayOrder:
          Number(s.display_order ?? 0),
        isPublished:
          Boolean(s.is_published),
        createdAt:
          s.created_at ||
          new Date().toISOString(),
        updatedAt:
          s.updated_at ||
          new Date().toISOString()
      }));

    } catch (err) {
      console.error(
        'Supabase hero slides fetch error:',
        err
      );

      throw err;
    }
  },

  async saveHeroSlide(
    slide: HeroSlide
  ): Promise<HeroSlide> {

    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Hero slide was not saved.'
      );
    }

    const updatedSlide: HeroSlide = {
      ...slide,
      updatedAt: new Date().toISOString()
    };

    const { error } = await supabase
      .from('hero_slides')
      .upsert({
        id: updatedSlide.id,
        image: updatedSlide.image || '',
        title: updatedSlide.title,
        subtitle: updatedSlide.subtitle,
        tagline: updatedSlide.tagline,
        cta_primary: updatedSlide.ctaPrimary,
        cta_secondary: updatedSlide.ctaSecondary,
        link: updatedSlide.link,
        display_order: updatedSlide.displayOrder,
        is_published: updatedSlide.isPublished,
        updated_at: updatedSlide.updatedAt
      });

    if (error) {
      console.error(
        'Supabase hero slide save failed:',
        error
      );

      throw new Error(
        `Failed to save hero slide: ${error.message}`
      );
    }

    return updatedSlide;
  },

  async deleteHeroSlide(
    id: string
  ): Promise<boolean> {

    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Hero slide was not deleted.'
      );
    }

    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(
        'Supabase hero slide delete failed:',
        error
      );

      throw new Error(
        `Failed to delete hero slide: ${error.message}`
      );
    }

    return true;
  },

  // ==========================================
  // SETTINGS
  // ==========================================

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
            brandName:
              data.brand_name ||
              INITIAL_SETTINGS.brandName,

            tagline:
              data.tagline ||
              INITIAL_SETTINGS.tagline,

            slogan:
              data.slogan ||
              INITIAL_SETTINGS.slogan,

            whatsAppNumber:
              data.whatsapp_number ||
              INITIAL_SETTINGS.whatsAppNumber,

            phoneNumber:
              data.phone_number ||
              INITIAL_SETTINGS.phoneNumber,

            email:
              data.email ||
              INITIAL_SETTINGS.email,

            showroomAddress:
              data.showroom_address ||
              INITIAL_SETTINGS.showroomAddress,

            headOffice:
              data.head_office ||
              INITIAL_SETTINGS.headOffice,

            branch1:
              data.branch1 ||
              INITIAL_SETTINGS.branch1,

            branch2:
              data.branch2 ||
              INITIAL_SETTINGS.branch2,

            city:
              data.city ||
              INITIAL_SETTINGS.city,

            businessHours:
              data.business_hours ||
              INITIAL_SETTINGS.businessHours,

            deliveryInfo:
              data.delivery_info ||
              INITIAL_SETTINGS.deliveryInfo,

            instagramUrl:
              data.instagram_url ||
              INITIAL_SETTINGS.instagramUrl,

            facebookUrl:
              data.facebook_url || '',

            tiktokUrl:
              data.tiktok_url ||
              INITIAL_SETTINGS.tiktokUrl,

            logoUrl:
              data.logo_url ||
              INITIAL_SETTINGS.logoUrl,

            ceoImageUrl:
              data.ceo_image_url ||
              INITIAL_SETTINGS.ceoImageUrl,

            currencySymbol:
              data.currency_symbol || '₦',

            announcementText:
              data.announcement_text ||
              INITIAL_SETTINGS.announcementText,

            isAnnouncementActive:
              Boolean(
                data.is_announcement_active ?? true
              ),

            freeDeliveryThreshold:
              Number(
                data.free_delivery_threshold || 400000
              )
          };
        }

        if (error) {
          console.warn(
            'Supabase settings fetch returned an error:',
            error
          );
        }
      } catch (err) {
        console.warn(
          'Supabase settings fetch error:',
          err
        );
      }
    }

    return getLocalItem<SiteSettings>(
      STORAGE_KEYS.SETTINGS,
      INITIAL_SETTINGS
    );
  },

  async saveSettings(
    settings: SiteSettings
  ): Promise<SiteSettings> {

    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Settings were not saved.'
      );
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 'default_settings',

        brand_name:
          settings.brandName,

        tagline:
          settings.tagline,

        slogan:
          settings.slogan,

        whatsapp_number:
          settings.whatsAppNumber,

        phone_number:
          settings.phoneNumber,

        email:
          settings.email,

        showroom_address:
          settings.showroomAddress,

        head_office:
          settings.headOffice,

        branch1:
          settings.branch1,

        branch2:
          settings.branch2,

        city:
          settings.city,

        business_hours:
          settings.businessHours,

        delivery_info:
          settings.deliveryInfo,

        instagram_url:
          settings.instagramUrl,

        facebook_url:
          settings.facebookUrl,

        tiktok_url:
          settings.tiktokUrl,

        logo_url:
          settings.logoUrl,

        ceo_image_url:
          settings.ceoImageUrl,

        currency_symbol:
          settings.currencySymbol,

        announcement_text:
          settings.announcementText,

        is_announcement_active:
          settings.isAnnouncementActive,

        free_delivery_threshold:
          settings.freeDeliveryThreshold,

        updated_at:
          new Date().toISOString()
      });

    if (error) {
      console.error(
        'Supabase settings save failed:',
        error
      );

      throw new Error(
        `Failed to save store settings: ${error.message}`
      );
    }

    setLocalItem(
      STORAGE_KEYS.SETTINGS,
      settings
    );

    return settings;
  }
};

// ==========================================
// WHATSAPP ORDER BUILDER
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

  const formattedNumber =
    formatWhatsAppNumberForLink(
      whatsAppNumber
    );

  const itemsList = items
    .map(
      i =>
        `• ${i.productName} — ${i.length}${
          i.color ? ' / ' + i.color : ''
        } — Qty ${i.quantity} — ₦${(
          i.price * i.quantity
        ).toLocaleString()}`
    )
    .join('\n');

  const noteBlock =
    customerNote && customerNote.trim()
      ? `\nCustomer Note: ${customerNote.trim()}\n`
      : '';

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

  return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(
    messageText
  )}`;
}

// Generate single product WhatsApp inquiry URL
export function generateProductInquiryUrl(
  whatsAppNumber: string,
  productName: string,
  selectedVariant?: string,
  price?: number
): string {

  const formattedNumber =
    formatWhatsAppNumberForLink(
      whatsAppNumber
    );

  const details = selectedVariant
    ? ` (${selectedVariant}${
        price
          ? ' - ₦' + price.toLocaleString()
          : ''
      })`
    : '';

  const message =
    `Hello D Young Luxury Hairs, I would like to order: ${productName}${details}. Please let me know its availability and delivery options.`;

  return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(
    message
  )}`;
}

// ==========================================
// SUPABASE SQL SCHEMA
// ==========================================

export const SUPABASE_SQL_SCHEMA = `
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id TEXT PRIMARY KEY,
  image TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  tagline TEXT,
  cta_primary TEXT,
  cta_secondary TEXT,
  link TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published hero slides"
ON public.hero_slides;

CREATE POLICY "Public can view published hero slides"
ON public.hero_slides
FOR SELECT
USING (
  is_published = true
  OR auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Admins have full access to hero slides"
ON public.hero_slides;

CREATE POLICY "Admins have full access to hero slides"
ON public.hero_slides
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
`;
