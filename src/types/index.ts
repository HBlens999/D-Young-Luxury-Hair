export type HairType = 'Human Hair' | 'Artificial Hair';

export interface ProductVariant {
  id: string;
  length: string; // e.g. "16\"", "18\"", "20\"", "22\"", "24\"", "26\"", "28\"", "30\""
  color?: string; // e.g. "Natural Black #1B", "Piano Color", "Burgundy 99J"
  price: number; // in Naira (NGN)
  sku?: string;
  stockQuantity: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  productType: HairType;
  shortDescription: string;
  description: string;
  mainImage: string;
  additionalImages: string[];
  variants: ProductVariant[];
  minPrice: number;
  maxPrice: number;
  texture?: string; // e.g. "Double Drawn Bone Straight", "Mirror Shine Straight"
  density?: string; // e.g. "250%", "300%"
  capSize?: string; // e.g. "Medium (22-22.5 inch)", "Small", "Custom"
  origin?: string; // e.g. "Raw Vietnamese Temple Donor"
  availability: 'in_stock' | 'pre_order' | 'out_of_stock';
  isFeatured: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // generated unique key product.id + variant.id
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  variantId: string;
  length: string;
  color?: string;
  price: number;
  quantity: number;
  categoryName?: string;
}

export type OrderStatus = 'New' | 'Confirmed' | 'Processing' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  length: string;
  color?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerWhatsApp: string;
  deliveryLocation: string;
  customerNote?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  readTime: string;
  recommendedProductId?: string;
  isPublished: boolean;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube or MP4 URL
  thumbnailUrl: string;
  category: string;
  duration?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  slogan: string;
  logoUrl?: string;
  ceoImageUrl?: string;
  whatsAppNumber: string; // e.g. "08107123342"
  phoneNumber: string; // e.g. "08107123342"
  email: string; // e.g. "Pending"
  showroomAddress: string;
  headOffice: string;
  branch1: string;
  branch2: string;
  city: string;
  businessHours: string;
  deliveryInfo: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  currencySymbol: string;
  announcementText: string;
  isAnnouncementActive: boolean;
  freeDeliveryThreshold: number;
}
