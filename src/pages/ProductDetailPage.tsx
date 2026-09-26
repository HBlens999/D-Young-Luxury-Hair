import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types';
import { db, generateProductInquiryUrl } from '../lib/supabase';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductVariantSelector } from '../components/product/ProductVariantSelector';
import { ProductCard } from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { ShoppingBag, MessageCircle, Truck, ShieldCheck, Check, Plus, Minus, ArrowLeft, Sparkles } from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { addToCart } = useCart();
  const { settings } = useSettings();

  useEffect(() => {
    async function loadProductData() {
      try {
        setIsLoading(true);
        const prod = await db.getProductBySlug(slug);
        if (prod) {
          setProduct(prod);
          // Set initial default variant
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariant(prod.variants[0]);
          }

          // Load related products
          const all = await db.getProducts();
          const related = all
            .filter(p => p.id !== prod.id && (p.categoryId === prod.categoryId || p.productType === prod.productType))
            .slice(0, 3);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProductData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#8C6A48] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-lg text-[#291C16]">Loading product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-serif text-2xl text-[#291C16]">Product Not Found</h1>
        <p className="text-xs text-[#6B5344]">The requested hair piece is currently not available or has been relocated.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-6 py-2.5 bg-[#291C16] text-[#FDFCF7] text-xs uppercase tracking-widest font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.minPrice;
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const handleWhatsAppOrder = () => {
    const variantDesc = selectedVariant ? `${selectedVariant.length}${selectedVariant.color ? ' / ' + selectedVariant.color : ''}` : '';
    const url = generateProductInquiryUrl(
      settings.whatsAppNumber,
      product.name,
      variantDesc,
      currentPrice
    );
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('/shop')}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#8C6A48] hover:text-[#291C16] transition-colors focus:outline-none"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Hair Catalog</span>
      </button>

      {/* Main Contiguous Purchase Module (Desktop Split 2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Gallery (Span 7) */}
        <div className="lg:col-span-7">
          <ProductGallery
            mainImage={product.mainImage}
            additionalImages={product.additionalImages}
            productName={product.name}
          />
        </div>

        {/* Right Column: Contiguous Purchase Module (Span 5) */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 border border-[#EAE2D7]">
          
          {/* Header Metadata */}
          <div className="space-y-2 border-b border-[#F4EFEA] pb-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C6A48] font-medium">
              <span>{product.categoryName || 'Luxury Hair'}</span>
              <span aria-hidden="true">·</span>
              <span>{product.productType}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-[#291C16] font-semibold leading-tight">
              {product.name}
            </h1>

            {/* Dynamic Calculated Price Display */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="font-sans text-2xl sm:text-3xl font-bold text-[#291C16] tabular-nums">
                ₦{currentPrice.toLocaleString()}
              </span>
              {selectedVariant && (
                <span className="text-xs text-[#8C6A48] font-light">
                  for {selectedVariant.length}
                </span>
              )}
            </div>
          </div>

          {/* Short Summary */}
          <p className="text-xs sm:text-sm text-[#6B5344] font-light leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Interactive Variant Selection */}
          <ProductVariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelectVariant={(v) => setSelectedVariant(v)}
          />

          {/* Quantity & Actions Bar */}
          <div className="space-y-4 pt-4 border-t border-[#F4EFEA]">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-[#8C6A48] font-semibold">
                Quantity:
              </span>
              <div className="flex items-center border border-[#D6C2A7] bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#4A3326] hover:bg-[#F4EFEA] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-semibold text-[#291C16] tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[#4A3326] hover:bg-[#F4EFEA] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {quantity > 1 && (
                <span className="text-xs text-[#8C6A48] tabular-nums">
                  Total: ₦{totalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || product.availability === 'out_of_stock'}
                className="w-full py-4 bg-[#291C16] hover:bg-[#4A3326] disabled:bg-gray-400 text-[#FDFCF7] text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Instant Order via WhatsApp</span>
              </button>
            </div>

            {/* Added Feedback toast */}
            {addedNotice && (
              <div className="p-3 bg-[#EBE3D8] text-[#291C16] text-xs flex items-center justify-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Added to your bag! Open bag to checkout.</span>
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-[#F4EFEA] space-y-2 text-xs text-[#6B5344] font-light">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#8C6A48] shrink-0" />
              <span>Delivery All Over Nigeria · Open Every Day</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#8C6A48] shrink-0" />
              <span>100% Genuine Human Hair · Pre-dispatch WhatsApp Video Verification</span>
            </div>
          </div>

        </div>

      </div>

      {/* Specifications & Description Tabs */}
      <div className="bg-white border border-[#EAE2D7] p-8 sm:p-12 space-y-8">
        <div className="border-b border-[#EAE2D7] pb-4">
          <h2 className="font-serif text-2xl text-[#291C16]">
            Atelier Specifications & Craftsmanship
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Detailed Narrative */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.18em] text-[#8C6A48] font-semibold">
              The Product Profile
            </h3>
            <div className="prose prose-sm text-[#4A3326] text-xs sm:text-sm font-light leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Specifications Table */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.18em] text-[#8C6A48] font-semibold">
              Technical Details
            </h3>
            <dl className="divide-y divide-[#F4EFEA] text-xs">
              <div className="py-2.5 flex justify-between">
                <dt className="text-[#8C6A48] font-light">Origin</dt>
                <dd className="font-medium text-[#291C16]">{product.origin || 'Vietnamese Temple Donor'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-[#8C6A48] font-light">Texture Grade</dt>
                <dd className="font-medium text-[#291C16]">{product.texture || 'Super Double Drawn Bone Straight'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-[#8C6A48] font-light">Hair Type</dt>
                <dd className="font-medium text-[#291C16]">{product.productType}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-[#8C6A48] font-light">Density</dt>
                <dd className="font-medium text-[#291C16]">{product.density || 'Full Weft Standard'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-[#8C6A48] font-light">Cap Construction</dt>
                <dd className="font-medium text-[#291C16]">{product.capSize || 'Standard'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-[#8C6A48] font-light">Heat Tolerance</dt>
                <dd className="font-medium text-[#291C16]">Up to 230°C / 450°F</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-[#8C6A48] font-light">Expected Lifespan</dt>
                <dd className="font-medium text-[#291C16]">3 – 5+ Years with proper care</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-[#EAE2D7] pb-3">
            <h2 className="font-serif text-2xl text-[#291C16]">
              Complete the Crown: Complementary Pieces
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={(s) => onNavigate(`/product/${s}`)}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
