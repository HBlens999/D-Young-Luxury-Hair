import React, { useState, useEffect } from 'react';
import { Upload, Copy, Check, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { db } from '../../lib/supabase';
import { Product } from '../../types';

export const AdminMedia: React.FC = () => {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const prods = await db.getProducts();
      setProducts(prods);
    }
    load();
  }, []);

  const activeMedia: { title: string; url: string; type: string }[] = [];

  if (settings.logoUrl) {
    activeMedia.push({ title: 'Official D Young Luxury Hairs Brand Logo', url: settings.logoUrl, type: '1:1 Brand Logo' });
  }

  if (settings.ceoImageUrl) {
    activeMedia.push({ title: 'Eze Stephen Chidubem (CEO & Founder)', url: settings.ceoImageUrl, type: '3:4 Executive Portrait' });
  }

  products.filter(p => Boolean(p.mainImage)).forEach(p => {
    activeMedia.push({ title: p.name, url: p.mainImage, type: 'Product Photograph' });
  });

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-[#EAE2D7] pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
          Original Media Assets
        </h1>
        <p className="text-xs text-[#8C6A48] mt-1 font-light">
          Active high-resolution original photography assets attached to D Young Luxury Hairs.
        </p>
      </div>

      {activeMedia.length === 0 ? (
        <div className="bg-white border border-[#EAE2D7] p-12 text-center space-y-4">
          <ImageIcon className="w-12 h-12 text-[#8C6A48] mx-auto opacity-50" />
          <h3 className="font-serif text-xl text-[#291C16]">
            No Original Photos Uploaded Yet
          </h3>
          <p className="text-xs text-[#6B5344] max-w-md mx-auto leading-relaxed">
            All AI-generated images have been removed according to your directive. Go to <strong>Original Photos &amp; Assets</strong> to upload your exact original files.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeMedia.map((item, idx) => (
            <div key={idx} className="bg-white border border-[#EAE2D7] overflow-hidden flex flex-col justify-between">
              <div className="aspect-[4/3] bg-[#160E0A] overflow-hidden flex items-center justify-center">
                <img
                  src={item.url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold block">
                  {item.type}
                </span>
                <h3 className="font-serif text-sm font-semibold text-[#291C16] truncate">
                  {item.title}
                </h3>
              </div>

              <div className="p-4 border-t border-[#F4EFEA]">
                <button
                  onClick={() => handleCopy(item.url)}
                  className="w-full py-2 bg-[#FBF9F5] hover:bg-[#F4EFEA] border border-[#EAE2D7] text-xs text-[#291C16] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedUrl === item.url ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>URL Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#8C6A48]" />
                      <span>Copy Asset Path</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
