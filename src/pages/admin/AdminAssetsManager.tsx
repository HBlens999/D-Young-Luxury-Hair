import React, { useState, useEffect } from 'react';
import { db, uploadImageToStorage } from '../../lib/supabase';
import { Product, SiteSettings } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { 
  Upload, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Image as ImageIcon, 
  User, 
  Crown, 
  Sparkles,
  Save,
  Trash2
} from 'lucide-react';

interface AssetSlot {
  id: string;
  type: 'logo' | 'ceo' | 'product';
  title: string;
  subtitle: string;
  price?: string;
  specs: string;
  productId?: string;
  currentImage: string;
}

export const AdminAssetsManager: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadData() {
      const prods = await db.getProducts();
      setProducts(prods);
    }
    loadData();
  }, []);

  const handleLogoUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      const imageUrl = await uploadImageToStorage(file, 'brand');
      await updateSettings({ ...settings, logoUrl: imageUrl });
      setSaveStatus('Official brand logo uploaded and saved successfully.');
    } catch (error) {
      setSaveStatus(error instanceof Error ? error.message : 'Logo upload failed.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  const handleCeoUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      const imageUrl = await uploadImageToStorage(file, 'ceo');
      await updateSettings({ ...settings, ceoImageUrl: imageUrl });
      setSaveStatus('CEO photograph uploaded and saved successfully.');
    } catch (error) {
      setSaveStatus(error instanceof Error ? error.message : 'CEO photo upload failed.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  const handleProductUpload = async (productId: string, file: File) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    try {
      setIsProcessing(true);
      const imageUrl = await uploadImageToStorage(file, 'products');
      const updated = { ...product, mainImage: imageUrl };
      await db.saveProduct(updated);
      setProducts(prev => prev.map(p => p.id === productId ? updated : p));
      setSaveStatus(`Image uploaded and saved for ${product.name}.`);
    } catch (error) {
      setSaveStatus(error instanceof Error ? error.message : 'Product image upload failed.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  const handleBatchUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    let matchedCount = 0;
    let failedCount = 0;
    let settingsDraft = { ...settings };
    let settingsChanged = false;

    try {
      for (const file of Array.from(files)) {
        const nameLower = file.name.toLowerCase();

        try {
          const isLogo = nameLower.includes('logo') || nameLower.includes('chatgpt');
          const isCeo = nameLower.includes('ceo') || nameLower.includes('founder') || nameLower.includes('stephen') || nameLower.includes('eze');
          const folder = isLogo ? 'brand' : isCeo ? 'ceo' : 'products';
          const imageUrl = await uploadImageToStorage(file, folder);

          if (isLogo) {
            settingsDraft = { ...settingsDraft, logoUrl: imageUrl };
            settingsChanged = true;
            matchedCount++;
            continue;
          }

          if (isCeo) {
            settingsDraft = { ...settingsDraft, ceoImageUrl: imageUrl };
            settingsChanged = true;
            matchedCount++;
            continue;
          }

          const target = products.find(product => {
            const productName = product.name.toLowerCase();
            return ['orange', 'burgundy', 'bounce', 'pixel', 'sassy', 'piano', 'deep wave']
              .some(keyword => nameLower.includes(keyword) && productName.includes(keyword)) ||
              (nameLower.includes('10') && (productName.includes('10"') || productName.includes('10 with'))) ||
              (nameLower.includes('20') && productName.includes('20"'));
          });

          if (target) {
            const updated = { ...target, mainImage: imageUrl };
            await db.saveProduct(updated);
            setProducts(prev => prev.map(product => product.id === target.id ? updated : product));
            matchedCount++;
          }
        } catch (error) {
          failedCount++;
          console.error('Batch image upload failed:', file.name, error);
        }
      }

      if (settingsChanged) await updateSettings(settingsDraft);
      setSaveStatus(`Batch upload finished: ${matchedCount} matched and saved, ${failedCount} failed. Images are stored in Supabase Storage.`);
    } catch (error) {
      setSaveStatus(error instanceof Error ? error.message : 'Batch upload failed.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setSaveStatus(null), 7000);
    }
  };
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title & Guarantee */}
      <div className="border-b border-[#EAE2D7] pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
          Original Assets & Photographs Manager
        </h1>
        <p className="text-xs text-[#8C6A48] mt-1 font-light">
          Attach and manage the exact original photo files provided for D Young Luxury Hairs products, CEO, and branding.
        </p>
      </div>

      {/* Zero AI Alteration Guarantee Banner */}
      <div className="bg-[#FAF7F2] border border-[#D8B46E]/60 p-5 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-[#8C6A48] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-[#291C16]">
            Zero AI Alteration Guarantee
          </h2>
          <p className="text-xs text-[#6B5344] font-light leading-relaxed">
            Every image uploaded here is saved directly as your 100% original, uncompressed source asset. The website renders your exact files using clean CSS (<code className="bg-[#EAE2D7] px-1 py-0.5 text-[#291C16]">object-fit: cover</code>) with zero retouching, zero filters, zero facial modification, and zero AI regeneration.
          </p>
        </div>
      </div>

      {/* Batch Upload Option */}
      <div className="bg-white border border-[#EAE2D7] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-base font-semibold text-[#291C16]">
            Batch Upload All Original Photos
          </h2>
          <p className="text-xs text-[#8C6A48] font-light mt-0.5">
            Select multiple original photo files from your phone or computer to automatically attach them at once.
          </p>
        </div>

        <label className="px-5 py-3 bg-[#291C16] hover:bg-[#3E2D24] text-[#FDFCF7] text-xs uppercase tracking-wider font-medium cursor-pointer transition-colors flex items-center gap-2 shrink-0">
          <Upload className="w-4 h-4 text-[#D8B46E]" />
          <span>Select Multiple Photos</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleBatchUpload(e.target.files)}
          />
        </label>
      </div>

      {saveStatus && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Section 1: Official Brand Assets */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-semibold text-[#291C16] border-b border-[#F4EFEA] pb-2">
          1. Brand Identity & CEO Photographs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Card */}
          <div className="bg-white border border-[#EAE2D7] p-5 flex gap-4 items-center">
            <div className="w-20 h-20 rounded-full border border-[#D8B46E]/40 bg-[#160E0A] shrink-0 overflow-hidden flex items-center justify-center p-0.5">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Official Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="font-serif text-sm font-bold text-[#D8B46E] text-center">
                  DY
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold block">
                Official Brand Logo
              </span>
              <h4 className="font-serif text-sm font-semibold text-[#291C16]">
                D Young Luxury Hairs Logo
              </h4>
              <p className="text-[11px] text-[#6B5344] font-light">
                {settings.logoUrl ? '✓ Original file active on storefront' : 'Awaiting original logo file'}
              </p>
              <div className="pt-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FBF9F5] border border-[#EAE2D7] hover:border-[#8C6A48] text-xs text-[#291C16] cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#8C6A48]" />
                  <span>Select Logo File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* CEO Card */}
          <div className="bg-white border border-[#EAE2D7] p-5 flex gap-4 items-center">
            <div className="w-20 h-24 border border-[#8C6A48] bg-[#160E0A] shrink-0 overflow-hidden flex items-center justify-center">
              {settings.ceoImageUrl ? (
                <img
                  src={settings.ceoImageUrl}
                  alt="Eze Stephen Chidubem"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="text-center p-2 text-[#D8B46E]">
                  <User className="w-6 h-6 mx-auto mb-1 opacity-70" />
                  <span className="text-[9px] uppercase tracking-wider block">ESC</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold block">
                CEO & Founder Photograph
              </span>
              <h4 className="font-serif text-sm font-semibold text-[#291C16]">
                Eze Stephen Chidubem
              </h4>
              <p className="text-[11px] text-[#6B5344] font-light">
                {settings.ceoImageUrl ? '✓ Original photo active on website' : 'Awaiting original photograph'}
              </p>
              <div className="pt-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FBF9F5] border border-[#EAE2D7] hover:border-[#8C6A48] text-xs text-[#291C16] cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#8C6A48]" />
                  <span>Select CEO Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCeoUpload(file);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Product Catalogue Original Photos */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-semibold text-[#291C16] border-b border-[#F4EFEA] pb-2">
          2. Product Catalogue Original Photographs ({products.length} Products)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => {
            const hasImage = Boolean(product.mainImage);
            return (
              <div
                key={product.id}
                className="bg-white border border-[#EAE2D7] p-4 flex gap-4 items-center justify-between"
              >
                <div className="w-20 h-20 bg-[#F4EFEA] border border-[#EAE2D7] shrink-0 overflow-hidden flex items-center justify-center">
                  {hasImage ? (
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2 text-[#8C6A48]">
                      <ImageIcon className="w-5 h-5 mx-auto mb-1 opacity-60" />
                      <span className="text-[8px] uppercase tracking-wider block">No Photo</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 pr-2 space-y-0.5">
                  <h4 className="font-serif text-xs font-semibold text-[#291C16] truncate">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-[#8C6A48] font-medium">
                    {product.minPrice > 0 ? `₦${product.minPrice.toLocaleString()}` : 'Price on Consultation'}
                  </p>
                  <p className="text-[10px] text-[#6B5344] font-light truncate">
                    {product.texture || product.categoryName} · {product.density || product.capSize || ''}
                  </p>
                  <span className={`text-[9px] uppercase tracking-wider font-semibold block ${hasImage ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {hasImage ? '✓ Original Photo Attached' : '● Awaiting Original Photo'}
                  </span>
                </div>

                <div className="shrink-0 flex flex-col gap-1">
                  <label className="px-3 py-1.5 bg-[#291C16] hover:bg-[#3E2D24] text-[#FDFCF7] text-[11px] font-medium cursor-pointer transition-colors flex items-center gap-1.5">
                    <Upload className="w-3 h-3 text-[#D8B46E]" />
                    <span>{hasImage ? 'Replace' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleProductUpload(product.id, file);
                      }}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
