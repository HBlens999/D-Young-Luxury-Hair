import React from 'react';
import { Product } from '../../types';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (slug: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const formatPrice = (amount: number) => `₦${amount.toLocaleString()}`;

  const hasPriceRange = product.minPrice > 0 && product.maxPrice > product.minPrice;
  const priceDisplay = hasPriceRange
    ? `${formatPrice(product.minPrice)} – ${formatPrice(product.maxPrice)}`
    : product.minPrice > 0
    ? formatPrice(product.minPrice)
    : 'Price on Consultation';

  return (
    <article
      onClick={() => onSelect(product.slug)}
      className="group cursor-pointer flex flex-col bg-white border border-[#EAE2D7] hover:border-[#D6C2A7] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Visual Slot */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4EFEA]">
        {product.mainImage ? (
          <img
            src={product.mainImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-[#1C130E] text-[#FDFCF7] flex flex-col justify-between p-5 text-left border-b border-[#3D291F] relative overflow-hidden group-hover:bg-[#251A14] transition-colors">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block">
                {product.categoryName || 'D Young Luxury'}
              </span>
              <h4 className="font-serif text-base sm:text-lg text-[#FDFCF7] font-medium leading-snug line-clamp-2">
                {product.name}
              </h4>
            </div>

            <div className="pt-3 border-t border-[#3D291F] flex items-center justify-between text-[#D8B46E]">
              <span className="text-[10px] uppercase tracking-wider font-mono truncate mr-2">
                {product.texture?.split(' ')[0] || 'SDD'} · {product.density || product.capSize || 'Virgin Hair'}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#A8885B] bg-[#2E2018] px-2 py-0.5 border border-[#4D3627] shrink-0">
                Authentic Unit
              </span>
            </div>
          </div>
        )}

        {/* Subtle Text Indicators (Strict Zero-Pill Discipline) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isNewArrival && (
            <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#1A1310] bg-[#FDFCF7]/95 px-2.5 py-1 border border-[#D6C2A7]">
              New Arrival
            </span>
          )}
          {product.isFeatured && !product.isNewArrival && (
            <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#1A1310] bg-[#FDFCF7]/95 px-2.5 py-1 border border-[#D6C2A7]">
              Featured Collection
            </span>
          )}
        </div>

        {/* Availability Marker */}
        {product.availability === 'out_of_stock' && (
          <div className="absolute inset-0 bg-[#1A1310]/50 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-white font-medium px-3 py-1 border border-white/50">
              Temporarily Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category kicker */}
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#8C6A48] font-medium mb-1">
            <span>{product.categoryName || 'Luxury Hair'}</span>
            <span aria-hidden="true">·</span>
            <span>{product.productType}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-lg font-semibold text-[#291C16] group-hover:text-[#8C6A48] transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#6B5344] line-clamp-2 mt-1.5 font-light leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Bottom Price & Action */}
        <div className="pt-3 border-t border-[#F4EFEA] flex items-baseline justify-between">
          <div>
            <span className="text-[10px] text-[#8C6A48] uppercase tracking-wider block font-light">
              Starting from
            </span>
            <span className="font-sans text-sm font-semibold text-[#291C16] tabular-nums tracking-tight">
              {priceDisplay}
            </span>
          </div>

          <span className="text-xs uppercase tracking-wider text-[#8C6A48] font-medium group-hover:text-[#291C16] flex items-center gap-1 transition-colors">
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

      </div>
    </article>
  );
};
