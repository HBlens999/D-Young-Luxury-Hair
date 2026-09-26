import React from 'react';
import { ProductVariant } from '../../types';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelectVariant: (variant: ProductVariant) => void;
}

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant
}) => {
  if (!variants || variants.length === 0) return null;

  // Extract unique colors if multiple exist
  const uniqueColors = Array.from(new Set(variants.map(v => v.color).filter(Boolean))) as string[];

  return (
    <div className="space-y-6">
      {/* Length Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs tracking-wider uppercase">
          <span className="text-[#8C6A48] font-semibold">Select Length:</span>
          {selectedVariant && (
            <span className="text-[#291C16] font-medium">{selectedVariant.length}</span>
          )}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {variants.map((variant) => {
            const isSelected = selectedVariant?.id === variant.id;
            return (
              <button
                key={variant.id}
                onClick={() => onSelectVariant(variant)}
                className={`py-2.5 px-3 text-xs tracking-wider font-medium text-center border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#291C16] text-[#FDFCF7] border-[#291C16] shadow-sm'
                    : 'bg-white text-[#4A3326] border-[#D6C2A7] hover:border-[#8C6A48] hover:bg-[#FBF9F5]'
                }`}
              >
                <span className="block">{variant.length}</span>
                <span className="text-[10px] block opacity-80 tabular-nums">
                  ₦{(variant.price / 1000).toFixed(0)}k
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Indicator (if specified) */}
      {selectedVariant?.color && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="uppercase tracking-wider text-[#8C6A48] font-semibold">Color Shade:</span>
            <span className="text-[#291C16] font-medium">{selectedVariant.color}</span>
          </div>
          {uniqueColors.length > 1 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {uniqueColors.map((colorName) => {
                const match = variants.find(v => v.color === colorName && v.length === selectedVariant.length);
                const isActive = selectedVariant.color === colorName;
                return (
                  <button
                    key={colorName}
                    onClick={() => {
                      if (match) onSelectVariant(match);
                    }}
                    className={`px-3 py-1.5 text-xs border transition-colors cursor-pointer ${
                      isActive
                        ? 'border-[#291C16] bg-[#291C16] text-white'
                        : 'border-[#EAE2D7] bg-white text-[#4A3326] hover:border-[#8C6A48]'
                    }`}
                  >
                    {colorName}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SKU & Stock Availability */}
      {selectedVariant && (
        <div className="flex items-center gap-3 text-xs text-[#8C6A48] font-light">
          {selectedVariant.sku && (
            <>
              <span>SKU: {selectedVariant.sku}</span>
              <span aria-hidden="true">·</span>
            </>
          )}
          <span className="text-emerald-700 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
            In Stock & Ready for Dispatch
          </span>
        </div>
      )}
    </div>
  );
};
