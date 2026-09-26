import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

interface ProductGalleryProps {
  mainImage: string;
  additionalImages?: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  mainImage,
  additionalImages = [],
  productName
}) => {
  const { settings } = useSettings();
  const allImages = [mainImage, ...additionalImages.filter(img => img && img !== mainImage)].filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(mainImage || (allImages.length > 0 ? allImages[0] : ''));

  return (
    <div className="space-y-4">
      {/* Primary Hero Showcase */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#160E0A] border border-[#EAE2D7]">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={productName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-[#FDFCF7] bg-[#1F1510] space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              D Young Luxury Hairs
            </span>
            <h3 className="font-serif text-2xl text-[#E5C687]">
              {productName}
            </h3>
            <p className="text-xs text-[#A8885B] font-light max-w-sm">
              Original photograph can be attached directly in Admin &gt; Original Photos &amp; Assets.
            </p>
          </div>
        )}

        {/* Official Brand Logo Watermark (only if uploaded) */}
        {settings.logoUrl && (
          <div className="absolute bottom-3 right-3 pointer-events-none opacity-50 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/40 shadow-md bg-[#160E0A]/60 backdrop-blur-sm p-0.5">
              <img
                src={settings.logoUrl}
                alt="D Young Luxury Hairs Official Watermark"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails row */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {allImages.map((img, idx) => {
            const isCurrent = img === selectedImage;
            return (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-20 shrink-0 overflow-hidden border transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-[#291C16] ring-1 ring-[#291C16]'
                    : 'border-[#EAE2D7] opacity-70 hover:opacity-100 hover:border-[#8C6A48]'
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
