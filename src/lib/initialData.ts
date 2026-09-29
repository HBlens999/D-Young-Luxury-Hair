import { Product, ProductCategory, BlogPost, VideoItem, SiteSettings } from '../types';

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    image: '',
    title: 'SDD Vietnamese Bone Straight',
    subtitle: 'The Pinnacle of Silky Perfection',
    tagline: 'Premium Hair or Nothing · 100% Single Donor Cuticles',
    ctaPrimary: 'Shop Collection',
    ctaSecondary: 'Order via WhatsApp',
    link: '/shop?category=sdd-vietnamese-bone-straight'
  },
  {
    id: 'slide-2',
    image: '',
    title: 'Super Double Drawn Curls & Waves',
    subtitle: 'Lavish Fullness, HD Frontals & Closures',
    tagline: 'Swiss HD Lace · Bounce & Pixel Curls · Pure Volume',
    ctaPrimary: 'Explore Curls',
    ctaSecondary: 'Chat on WhatsApp',
    link: '/shop?category=sdd-curls-and-waves'
  },
  {
    id: 'slide-3',
    image: '',
    title: 'Raw Donor & Deep Wave Luxury',
    subtitle: 'Pure Authenticity & Intact Natural Movement',
    tagline: 'Delivery All Over Nigeria · Open Every Day',
    ctaPrimary: 'View New Arrivals',
    ctaSecondary: 'WhatsApp Inquiries',
    link: '/shop?category=raw-hair-and-deep-wave'
  }
];

export const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 'cat-1',
    name: 'SDD Vietnamese Bone Straight',
    slug: 'sdd-vietnamese-bone-straight',
    description: 'Authentic Vietnamese Super Double Drawn bone straight hair with uniform thickness from weft to tip and glass-like lustre.',
    image: '',
    displayOrder: 1
  },
  {
    id: 'cat-2',
    name: 'SDD Curls & Waves',
    slug: 'sdd-curls-and-waves',
    description: 'Super Double Drawn bounce curls, pixel curls, sassy curls, and deep waves with Swiss HD closures and frontals.',
    image: '',
    displayOrder: 2
  },
  {
    id: 'cat-3',
    name: 'Raw Hair & Deep Wave',
    slug: 'raw-hair-and-deep-wave',
    description: 'Unprocessed pure raw single donor hair and long-length ombre deep waves with intact, healthy cuticles.',
    image: '',
    displayOrder: 3
  },
  {
    id: 'cat-4',
    name: 'Vietnamese Donor Hair',
    slug: 'vietnamese-donor-hair',
    description: 'Authentic single donor human hair, piano blonde highlights, and custom luxury tones with enduring longevity.',
    image: '',
    displayOrder: 4
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. SDD Luxury Vietnamese Bone Straight Bundles with 2by6 Closure
  {
    id: 'prod-sdd-bone-straight-10-2x6',
    name: 'SDD Luxury Vietnamese Bone Straight with 2by6 Closure',
    slug: 'sdd-luxury-vietnamese-bone-straight-10-with-2by6-closure',
    categoryId: 'cat-1',
    categoryName: 'SDD Vietnamese Bone Straight',
    productType: 'Human Hair',
    shortDescription: '10" Super Double Drawn luxury Vietnamese bone straight bundles with matching 2by6 closure.',
    description: 'SDD luxury Vietnamese bone straight 10" with 2by6 closure. Crafted from 100% authentic Vietnamese human hair with uniform density from weft to tip and silky, tangle-free luster.',
    mainImage: '',
    additionalImages: [],
    texture: 'Super Double Drawn Bone Straight',
    density: 'Full Density Wefts + 2by6 Closure',
    capSize: 'Bundles + 2by6 Closure Set',
    origin: 'Vietnamese Donor Hair',
    availability: 'in_stock',
    isFeatured: true,
    isNewArrival: false,
    isPublished: true,
    minPrice: 100000,
    maxPrice: 100000,
    createdAt: '2026-09-25T08:12:31Z',
    updatedAt: '2026-09-25T08:12:31Z',
    variants: [
      { id: 'v-bs10-1', length: '10"', color: 'Golden Caramel / Auburn', price: 100000, stockQuantity: 10, sku: 'DY-VBS-10-2X6' }
    ]
  },

  // 2. SDD Vietnamese Bone Straight Bob with 5by5 Closure
  {
    id: 'prod-sdd-bone-straight-bob-5x5',
    name: 'SDD Vietnamese Bone Straight Bob with 5by5 Closure',
    slug: 'sdd-vietnamese-bone-straight-bob-with-5by5-closure',
    categoryId: 'cat-1',
    categoryName: 'SDD Vietnamese Bone Straight',
    productType: 'Human Hair',
    shortDescription: '10" SDD Vietnamese bone straight bob unit with 5by5 closure. Complete wigged unit or bundles set.',
    description: 'SDD Vietnamese bone straight 10 with 5by5 closure 125,000 wigin 3k 128k. Available as a finished wigged unit ready-to-wear or as bundle and closure set.',
    mainImage: '',
    additionalImages: [],
    texture: 'Vietnamese Bone Straight Bob',
    density: 'Super Double Drawn Full Ends',
    capSize: '5by5 Closure Unit',
    origin: 'Vietnamese Human Hair',
    availability: 'in_stock',
    isFeatured: true,
    isNewArrival: true,
    isPublished: true,
    minPrice: 125000,
    maxPrice: 128000,
    createdAt: '2026-09-25T08:08:22Z',
    updatedAt: '2026-09-25T08:08:22Z',
    variants: [
      { id: 'v-bob-1', length: '10"', color: 'Natural / Ombre Tone (Complete Unit with Wigging)', price: 128000, stockQuantity: 8, sku: 'DY-BOB-10-WIG' },
      { id: 'v-bob-2', length: '10"', color: 'Natural / Ombre Tone (Hair & Closure Set)', price: 125000, stockQuantity: 8, sku: 'DY-BOB-10-RAW' }
    ]
  },

  // 3. Super Luxury Vietnamese Bone Straight 20" with 2by6 Closure
  {
    id: 'prod-super-luxury-vietnamese-20-2x6',
    name: 'Super Luxury Vietnamese Bone Straight with 2by6 Closure',
    slug: 'super-luxury-vietnamese-bone-straight-20-with-2by6-closure',
    categoryId: 'cat-1',
    categoryName: 'SDD Vietnamese Bone Straight',
    productType: 'Human Hair',
    shortDescription: '20" Super luxury Vietnamese bone straight 200g unit with 2by6 closure.',
    description: 'Super luxury Vietnamese bone straight 20" with 2by6 closure 200g 200,000. Features 200g heavy volume, glass-smooth texture, and natural luster that lasts for years.',
    mainImage: '',
    additionalImages: [],
    texture: 'Super Double Drawn Bone Straight',
    density: '200g Full Density',
    capSize: '2by6 Closure Unit',
    origin: 'Direct Vietnamese Harvest',
    availability: 'in_stock',
    isFeatured: true,
    isNewArrival: true,
    isPublished: true,
    minPrice: 200000,
    maxPrice: 200000,
    createdAt: '2026-09-25T08:17:19Z',
    updatedAt: '2026-09-25T08:17:19Z',
    variants: [
      { id: 'v-slv-20', length: '20"', color: 'Natural Black', price: 200000, stockQuantity: 6, sku: 'DY-SLV-20-200G' }
    ]
  },

  // 4. SDD Luxury Vietnamese Bone Straight Orange
  {
    id: 'prod-sdd-bone-straight-orange',
    name: 'SDD Luxury Vietnamese Bone Straight Orange',
    slug: 'sdd-luxury-vietnamese-bone-straight-orange',
    categoryId: 'cat-1',
    categoryName: 'SDD Vietnamese Bone Straight',
    productType: 'Human Hair',
    shortDescription: 'Vibrant orange tone SDD Vietnamese bone straight with 2by6 (20") or 5by5 closure (18").',
    description: 'SDD luxury Vietnamese bone straight 20" with 2by6 18" with 5by5 closure orange colour, 190k - 210k. Bold, luminous orange color on silky double-drawn hair.',
    mainImage: '',
    additionalImages: [],
    texture: 'Vietnamese Bone Straight',
    density: 'Super Double Drawn',
    capSize: 'Selectable 2by6 or 5by5 Closure',
    origin: 'Vietnamese Donor Hair',
    availability: 'in_stock',
    isFeatured: true,
    isNewArrival: true,
    isPublished: true,
    minPrice: 190000,
    maxPrice: 210000,
    createdAt: '2026-09-25T08:02:56Z',
    updatedAt: '2026-09-25T08:02:56Z',
    variants: [
      { id: 'v-orange-1', length: '20"', color: 'Luminous Orange (with 2by6 Closure)', price: 190000, stockQuantity: 5, sku: 'DY-ORG-20-2X6' },
      { id: 'v-orange-2', length: '18"', color: 'Luminous Orange (with 5by5 Closure)', price: 210000, stockQuantity: 4, sku: 'DY-ORG-18-5X5' }
    ]
  },

  // 5. SDD Luxury Bone Straight Burgundy
  {
    id: 'prod-sdd-bone-straight-burgundy',
    name: 'SDD Luxury Bone Straight Burgundy',
    slug: 'sdd-luxury-bone-straight-burgundy',
    categoryId: 'cat-1',
    categoryName: 'SDD Vietnamese Bone Straight',
    productType: 'Human Hair',
    shortDescription: 'Super Double Drawn luxury bone straight in rich burgundy shade with 2by6 closure.',
    description: 'SDD luxury bone straight 28" 200g and 24" with 2by6 closure bungurdy colour. Available in 24-inch or 28-inch 200g luxury lengths.',
    mainImage: '',
    additionalImages: [],
    texture: 'Super Double Drawn Bone Straight',
    density: '200g Luxury Density',
    capSize: '2by6 HD Closure',
    origin: 'Vietnamese Donor Hair',
    availability: 'in_stock',
    isFeatured: true,
    isNewArrival: false,
    isPublished: true,
    minPrice: 190000,
    maxPrice: 230000,
    createdAt: '2026-09-25T07:59:35Z',
    updatedAt: '2026-09-25T07:59:35Z',
    variants: [
      { id: 'v-burg-24', length: '24"', color: 'Rich Burgundy', price: 190000, stockQuantity: 5, sku: 'DY-BSB-24-2X6' },
      { id: 'v-burg-28', length: '28" (200g)', color: 'Rich Burgundy', price: 230000, stockQuantity: 4, sku: 'DY-BSB-28-200G' }
    ]
  },

  // 6. Vietnamese Donor Bone Straight Piano Blonde (14")
  {
    id: 'prod-vietnamese-donor-piano-14',
    name: 'Vietnamese Donor Bone Straight 14" Piano Blonde',
    slug: 'vietnamese-donor-bone-straight-14-piano-blonde',
    categoryId: 'cat-4',
    categoryName: 'Vietnamese Donor Hair',
    productType: 'Human Hair',
    shortDescription: '14" Single donor authentic Vietnamese bone straight in piano blonde highlights with 2by6 closure.',
    description: 'Vietnamese donor bone straight 14" with 2by6 closure piano blonde 140,000. Natural donor cuticle alignment with precision piano blonde tone.',
    mainImage: '',
    additionalImages: [],
    texture: 'Single Donor Bone Straight',
    density: 'Full Density Donor Wefts',
    capSize: '2by6 Closure',
    origin: '100% Single Donor Vietnamese Hair',
    availability: 'in_stock',
    isFeatured: true,
    isNewArrival: true,
    isPublished: true,
    minPrice: 140000,
    maxPrice: 140000,
    createdAt: '2026-09-25T08:18:25Z',
    updatedAt: '2026-09-25T08:18:25Z',
    variants: [
      { id: 'v-piano-14', length: '14"', color: 'Piano Blonde Highlight', price: 140000, stockQuantity: 7, sku: 'DY-VDP-14-2X6' }
    ]
  },

  // 7. SDD Bounce Curls 22" with 13by4 Full Frontal Swiss Lace
  {
    id: 'prod-sdd-bounce-curls-22-frontal',
    name: 'SDD Bounce Curls with 13by4 Full Frontal Swiss Lace (22")',
    slug: 'sdd-bounce-curls-with-13by4-full-frontal-swiss-lace-22',
    categoryId: 'cat-2',
    categoryName: 'SDD Curls & Waves',
    productType: 'Human Hair',
    shortDescription: '22" Super Double Drawn voluminous bounce curls with ear-to-ear 13by4 Swiss HD lace frontal.',
    description: 'SDD bounce curls with 13by4 full frontal swiss lace 22" 170,000. Super Double Drawn luscious bounce curls, ear-to-ear melting Swiss lace frontal.',
    mainImage: '',
    additionalImages: [],
    texture: 'Super Double Drawn Bounce Curls',
    density: 'Full Voluminous Curls',
    capSize: '13by4 Full Frontal Swiss Lace',
    origin: 'Human Hair Donor',
    availability: 'in_stock',
    isFeatured: true,
    isNewArrival: false,
    isPublished: true,
    minPrice: 170000,
    maxPrice: 170000,
    createdAt: '2026-09-25T08:20:27Z',
    updatedAt: '2026-09-25T08:20:27Z',
    variants: [
      { id: 'v-bc-22', length: '22"', color: 'Natural Dark Brown / Black', price: 170000, stockQuantity: 6, sku: 'DY-SBC-22-13X4' }
    ]
  },

  // 8. SDD Body Bounce Curls 16" with 5by5 Closure
  {
    id: 'prod-sdd-body-bounce-16-5x5',
    name: 'SDD Body Bounce Curls with 5by5 Closure (16")',
    slug: 'sdd-body-bounce-curls-with-5by5-closure-16',
    categoryId: 'cat-2',
    categoryName: 'SDD Curls & Waves',
    productType: 'Human Hair',
    shortDescription: '16" SDD body bounce curls with seamless 5by5 Swiss lace closure.',
    description: 'SDD body bounce curls with 5by5 closure 16" 140,000. Voluminous body bounce curls with natural movement and full ends from weft to tip.',
    mainImage: '',
    additionalImages: [],
    texture: 'Super Double Drawn Body Bounce Curls',
    density: 'Super Double Drawn Full Ends',
    capSize: '5by5 Lace Closure',
    origin: 'Human Hair Donor',
    availability: 'in_stock',
    isFeatured: true,
    isNewArrival: false,
    isPublished: true,
    minPrice: 140000,
    maxPrice: 140000,
    createdAt: '2026-09-25T08:21:38Z',
    updatedAt: '2026-09-25T08:21:38Z',
    variants: [
      { id: 'v-bbc-16', length: '16"', color: 'Natural Black', price: 140000, stockQuantity: 8, sku: 'DY-BBC-16-5X5' }
    ]
  },

  // 9. SDD Pixel Curls 18" Burgundy with 5by5 Closure
  {
    id: 'prod-sdd-pixel-curls-18-burgundy',
    name: 'SDD Pixel Curls with 5by5 Closure (18" Burgundy)',
    slug: 'sdd-pixel-curls-with-5by5-18-burgundy',
    categoryId: 'cat-2',
    categoryName: 'SDD Curls & Waves',
    productType: 'Human Hair',
    shortDescription: '18" Defined Super Double Drawn pixel curls in deep burgundy with 5by5 closure.',
    description: 'SDD pixel curls with 5by5 18" bungurdy colour 160,000. Intricate defined pixel curl pattern in opulent burgundy tone with 5by5 Swiss closure.',
    mainImage: '',
    additionalImages: [],
    texture: 'Super Double Drawn Pixel Curls',
    density: 'Full Volume Curls',
    capSize: '5by5 Closure',
    origin: 'Human Hair Donor',
    availability: 'in_stock',
    isFeatured: true,
    isNewArrival: false,
    isPublished: true,
    minPrice: 160000,
    maxPrice: 160000,
    createdAt: '2026-09-25T08:28:34Z',
    updatedAt: '2026-09-25T08:28:34Z',
    variants: [
      { id: 'v-pc-18-burg', length: '18"', color: 'Opulent Burgundy', price: 160000, stockQuantity: 6, sku: 'DY-PC-18-BURG' }
    ]
  },

  // 10. SDD Pixel Curls Piano Colour with 13by4 Full Frontal
  {
    id: 'prod-sdd-pixel-curls-piano-frontal',
    name: 'SDD Pixel Curls Piano Colour with 13by4 Full Frontal',
    slug: 'sdd-pixel-curls-piano-colour-with-13by4-full-frontal-swiss-lace',
    categoryId: 'cat-2',
    categoryName: 'SDD Curls & Waves',
    productType: 'Human Hair',
    shortDescription: 'Super Double Drawn pixel curls unit in piano highlight tones with ear-to-ear 13by4 Swiss lace frontal.',
    description: 'SDD pixel curls with 13by4 full frontal swiss lace piano colour 160,000. Super Double Drawn pixel curls unit in piano highlight tones, crafted with a 13by4 Swiss lace ear-to-ear frontal.',
    mainImage: '',
    additionalImages: [],
    texture: 'Super Double Drawn Pixel Curls',
    density: 'Full 13by4 Frontal Unit',
    capSize: '13by4 Full Frontal Swiss Lace',
    origin: 'Human Hair Donor',
    availability: 'in_stock',
    isFeatured: true,
    isNewArrival: false,
    isPublished: true,
    minPrice: 160000,
    maxPrice: 160000,
    createdAt: '2026-09-25T08:32:03Z',
    updatedAt: '2026-09-25T08:32:03Z',
    variants: [
      { id: 'v-pc-piano-front', length: '18"', color: 'Piano Blonde & Brown Highlight Mix', price: 160000, stockQuantity: 5, sku: 'DY-PCP-18-13X4' }
    ]
  },

  // 11. SDD Sassy Curls 20" 300g with 6by6 Closure
  {
    id: 'prod-sdd-sassy-curls-20-300g',
    name: 'SDD Sassy Curls with 6by6 Closure (20" 300g)',
    slug: 'sdd-sassy-curls-with-6by6-closure-20-185000-300g',
    categoryId: 'cat-2',
    categoryName: 'SDD Curls & Waves',
    productType: 'Human Hair',
    shortDescription: '20" Super Double Drawn sassy curls, full 300g heavyweight density with 6by6 HD closure.',
    description: 'SDD sassy curls with 6by6 closure 20" 185,000 300g. Thick 300g volume, deeply defined bounce, and expansive 6by6 lace parting space.',
    mainImage: '',
    additionalImages: [],
    texture: 'Super Double Drawn Sassy Curls',
    density: '300g Heavyweight Density',
    capSize: '6by6 Deep Parting Closure',
    origin: 'Human Hair Donor',
    availability: 'in_stock',
    isFeatured: true,
    isNewArrival: false,
    isPublished: true,
    minPrice: 185000,
    maxPrice: 185000,
    createdAt: '2026-09-25T08:19:36Z',
    updatedAt: '2026-09-25T08:19:36Z',
    variants: [
      { id: 'v-sassy-20-300g', length: '20"', color: 'Natural Black', price: 185000, stockQuantity: 5, sku: 'DY-SSC-20-300G' }
    ]
  },

  // 12. SDD Pixel Curls 14" with 5by5 Closure
  {
    id: 'prod-sdd-pixel-curls-14-5x5',
    name: 'SDD Pixel Curls with 5by5 Closure (14")',
    slug: 'sdd-pixel-curls-with-5by5-closure-14',
    categoryId: 'cat-2',
    categoryName: 'SDD Curls & Waves',
    productType: 'Human Hair',
    shortDescription: '14" SDD pixel curls available per bundle (100g 50k), closure (35k), or complete 200g unit with wigging (140k).',
    description: 'SDD pixel curls with 5by5 closure 14" per bundle 100g 50,000 closure 35,000 200g With wigin 140,000. Flexible options for custom styling or complete ready-to-wear unit.',
    mainImage: '',
    additionalImages: [],
    texture: 'Super Double Drawn Pixel Curls',
    density: 'Custom Selectable Density (100g to 200g)',
    capSize: '5by5 Swiss Closure',
    origin: 'Human Hair Donor',
    availability: 'in_stock',
    isFeatured: false,
    isNewArrival: false,
    isPublished: true,
    minPrice: 35000,
    maxPrice: 140000,
    createdAt: '2026-09-25T08:04:17Z',
    updatedAt: '2026-09-25T08:04:17Z',
    variants: [
      { id: 'v-pc14-wig', length: '14" (200g Unit with Wigging)', color: 'Natural Black', price: 140000, stockQuantity: 8, sku: 'DY-PC14-WIG200' },
      { id: 'v-pc14-bndl', length: '14" Single Bundle (100g)', color: 'Natural Black', price: 50000, stockQuantity: 20, sku: 'DY-PC14-BNDL' },
      { id: 'v-pc14-clsr', length: '14" 5by5 Closure Only', color: 'Natural Black', price: 35000, stockQuantity: 10, sku: 'DY-PC14-CLOSURE' }
    ]
  },

  // 13. SDD Deep Wave 24" 300g with 5by5 Closure
  {
    id: 'prod-sdd-deep-wave-24-300g',
    name: 'SDD Deep Wave with 5by5 Closure (24" 300g)',
    slug: 'sdd-deep-wave-with-5by5-closure-24-300g-245000',
    categoryId: 'cat-3',
    categoryName: 'Raw Hair & Deep Wave',
    productType: 'Human Hair',
    shortDescription: '24" Super Double Drawn deep wave unit, 300g full density with 5by5 lace closure.',
    description: 'SDD deep wave with 5by5 closure 24" 300g 245,000. Luxurious 24 inches long deep ocean waves with intact cuticles and rich 300g full ends.',
    mainImage: '',
    additionalImages: [],
    texture: 'Super Double Drawn Deep Wave',
    density: '300g Full Density',
    capSize: '5by5 Lace Closure',
    origin: 'Direct Single Donor Hair',
    availability: 'in_stock',
    isFeatured: true,
    isNewArrival: false,
    isPublished: true,
    minPrice: 245000,
    maxPrice: 245000,
    createdAt: '2026-09-25T08:15:40Z',
    updatedAt: '2026-09-25T08:15:40Z',
    variants: [
      { id: 'v-dw-24-300g', length: '24"', color: 'Natural Black / Dark Brown', price: 245000, stockQuantity: 5, sku: 'DY-SDW-24-300G' }
    ]
  },

  // 14. Raw Deep Wave Ombre Brown 30"
  {
    id: 'prod-raw-deep-wave-ombre-30',
    name: 'Raw Deep Wave Ombre Brown (30")',
    slug: 'raw-deep-wave-ombre-brown-30',
    categoryId: 'cat-3',
    categoryName: 'Raw Hair & Deep Wave',
    productType: 'Human Hair',
    shortDescription: '30" Ultra-long raw deep wave in ombre brown. Per 100g bundle (150k), closure (75k), or 300g wig unit (525k).',
    description: 'Raw deep wave ombre brawn 100g 30" 150,000 closure 75,000 \n Wig with 300g with 5by5 closure 525,000. Unprocessed raw human hair with authentic cuticle direction and hand-painted ombre brown tone.',
    mainImage: '',
    additionalImages: [],
    texture: 'Pure Raw Deep Wave',
    density: 'Selectable: 100g Bundle / 300g Complete Wig',
    capSize: '5by5 Raw Swiss Closure',
    origin: '100% Unprocessed Raw Human Hair',
    availability: 'in_stock',
    isFeatured: true,
    isNewArrival: true,
    isPublished: true,
    minPrice: 75000,
    maxPrice: 525000,
    createdAt: '2026-09-25T08:13:30Z',
    updatedAt: '2026-09-25T08:13:30Z',
    variants: [
      { id: 'v-rdw-wig300', length: '30" Full Wig (300g with 5by5 Closure)', color: 'Ombre Brown ("Brawn")', price: 525000, stockQuantity: 3, sku: 'DY-RDW-30-WIG' },
      { id: 'v-rdw-bndl100', length: '30" Single Bundle (100g)', color: 'Ombre Brown ("Brawn")', price: 150000, stockQuantity: 12, sku: 'DY-RDW-30-100G' },
      { id: 'v-rdw-clsr', length: '30" 5by5 Closure Only', color: 'Ombre Brown ("Brawn")', price: 75000, stockQuantity: 5, sku: 'DY-RDW-30-5X5' }
    ]
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Definitive Guide to Maintaining Vietnamese Bone Straight Hair',
    slug: 'definitive-guide-vietnamese-bone-straight-hair-maintenance',
    categoryId: 'blog-cat-1',
    categoryName: 'Hair Care',
    excerpt: 'Preserve the liquid glass sheen and prevent heat damage with our master stylist regimen for Super Double Drawn hair.',
    content: `Vietnamese bone straight hair is celebrated globally for its unmatched natural sheen, thick cuticles, and resilience. To protect your investment and ensure it retains its liquid mirror finish for years, follow this curated regimen:

### 1. The Heat Protection Rule
Never apply high heat to dry, unprotected strands. Always mist with an alcohol-free silicone serum or thermal heat shield before flat ironing. For Vietnamese bone straight hair, optimal heat sits between 180°C and 210°C (never exceed 230°C).

### 2. Serum Selection
Avoid heavy mineral oils that weigh down the hair or attract dust. A few drops of pure argan oil or lightweight biosilk serum applied from mid-shaft to ends is all that is required for maximum swing.

### 3. Nighttime Silk Protection
Friction is the primary cause of split ends and tangling. Always wrap your hair with a 100% mulberry silk scarf or sleep on a satin pillowcase. If wearing a wig, place it on a mannequin stand when resting.

### 4. Washing & Hydration
Wash every 2-3 weeks using sulfate-free, keratin-infused shampoo in lukewarm water. Gently comb from ends upward with a wide-tooth detangling comb while conditioner is applied.`,
    featuredImage: '',
    author: 'D Young Stylist Team',
    readTime: '4 min read',
    recommendedProductId: 'prod-sdd-bone-straight-10-2x6',
    isPublished: true,
    publishedAt: '2026-09-20T10:00:00Z',
    seoTitle: 'How to Care for Vietnamese Bone Straight Hair | D YOUNG LUXURY HAIRS',
    seoDescription: 'Expert maintenance guide for authentic Vietnamese bone straight hair. Learn how to wash, heat-style, and preserve mirror shine.'
  },
  {
    id: 'post-2',
    title: 'Understanding Super Double Drawn (SDD): The Hallmark of Luxury',
    slug: 'understanding-super-double-drawn-sdd-hair',
    categoryId: 'blog-cat-2',
    categoryName: 'Hair Buying Guides',
    excerpt: 'Demystifying grading terms: why Super Double Drawn guarantees full ends and uniform density from weft to tip.',
    content: `In standard hair bundles, up to 50% of strands are shorter than the declared length, leading to thin ends. In **Super Double Drawn (SDD)** hair, short strands are laboriously extracted by hand so that over 85% to 90% of all hairs match the declared length.

This yields the iconic, thick, lavish curtain of hair that makes D Young Luxury Hairs famous across Nigeria.

### Why Vietnamese Single Donor?
Vietnamese women traditionally nurture their hair with natural rice water and herbal blends without harsh chemical perms. The cuticles remain intact, smooth, and aligned in one natural direction.`,
    featuredImage: '',
    author: 'Eze Stephen Chidubem',
    readTime: '5 min read',
    recommendedProductId: 'prod-sdd-bounce-curls-22-frontal',
    isPublished: true,
    publishedAt: '2026-09-22T08:30:00Z',
    seoTitle: 'Understanding Super Double Drawn (SDD) Hair | D Young Luxury Hairs',
    seoDescription: 'Why Super Double Drawn Vietnamese hair provides thick, full ends and superior longevity.'
  }
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'SDD Vietnamese Bone Straight Mirror Comb-Through',
    description: 'Watch the liquid glide and zero-resistance comb-through of our Super Double Drawn Vietnamese bone straight unit.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: '',
    category: 'Product Showcase',
    duration: '0:45',
    isPublished: true,
    createdAt: '2026-09-22T14:00:00Z'
  },
  {
    id: 'vid-2',
    title: 'Bounce & Pixel Curls Volume & Density Check',
    description: 'Examination of our Super Double Drawn curls, Swiss HD lace frontals, and full healthy ends.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: '',
    category: 'Hair Review',
    duration: '1:12',
    isPublished: true,
    createdAt: '2026-09-23T11:20:00Z'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  brandName: 'D Young Luxury Hairs',
  tagline: 'Premium Hair or Nothing',
  slogan: 'Premium Hair or Nothing',
  logoUrl: '',
  ceoImageUrl: '',
  whatsAppNumber: '08107123342',
  phoneNumber: '08107123342',
  email: 'Pending',
  headOffice: '',
  branch1: '',
  branch2: '',
  showroomAddress: '',
  city: 'Onitsha, Anambra State, Nigeria',
  deliveryInfo: 'All over Nigeria',
  businessHours: 'Open every day',
  instagramUrl: 'https://instagram.com/dyoungluxury',
  facebookUrl: '',
  tiktokUrl: 'https://tiktok.com/@d.young.hairs',
  currencySymbol: '₦',
  announcementText: 'Premium Hair or Nothing · Delivery All Over Nigeria · Open Every Day · WhatsApp: 08107123342',
  isAnnouncementActive: true,
  freeDeliveryThreshold: 400000
};
