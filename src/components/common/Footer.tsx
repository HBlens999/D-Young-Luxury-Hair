import React from 'react';
import { MessageCircle, Phone, MapPin, Instagram, Shield, ArrowUpRight, Clock, Truck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { BrandLogo } from './BrandLogo';
import { formatWhatsAppNumberForLink } from '../../lib/supabase';

// Custom TikTok icon
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.95-4.52V8.9a8.28 8.28 0 0 0 4.82 1.55v-3.5a4.84 4.84 0 0 1-1-.26z" />
  </svg>
);

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWhatsAppNumber = formatWhatsAppNumberForLink(settings.whatsAppNumber || '08107123342');
  const whatsAppUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello D Young Luxury Hairs, I would like to inquire about your premium hair collections.')}`;

  return (
    <footer className="bg-[#1A1310] text-[#EBE3D8] border-t border-[#291C16] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-[#2E221C]">
          
          {/* Col 1 & 2: Brand & Positioning */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" variant="light" showSlogan={true} />

            <p className="text-sm text-[#D6C2A7]/85 leading-relaxed max-w-md font-light pt-2">
              Official home of D Young Luxury Hairs. Super Double Drawn Vietnamese bone straight hair, mirror bone straight wigs, and raw donor hair. Slogan: <span className="text-[#C5A059] font-medium">Premium Hair or Nothing</span>.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#B89865] pt-1">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Delivery: All over Nigeria</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Open every day</span>
              </span>
            </div>
            
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B89865] text-[#1A1310] text-xs font-semibold tracking-wider uppercase hover:bg-[#D6C2A7] transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current text-[#1A1310]" />
                <span>WhatsApp: {settings.whatsAppNumber || '08107123342'}</span>
              </a>

              <a
                href="https://instagram.com/dyoungluxury"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 border border-[#2E221C] hover:border-[#B89865] text-[#EBE3D8] hover:text-[#B89865] transition-colors flex items-center gap-1.5 text-xs"
                aria-label="Instagram @dyoungluxury"
                title="Instagram @dyoungluxury"
              >
                <Instagram className="w-4 h-4" />
                <span className="hidden sm:inline">@dyoungluxury</span>
              </a>

              <a
                href="https://tiktok.com/@d.young.hairs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 border border-[#2E221C] hover:border-[#B89865] text-[#EBE3D8] hover:text-[#B89865] transition-colors flex items-center gap-1.5 text-xs"
                aria-label="TikTok @d.young.hairs"
                title="TikTok @d.young.hairs"
              >
                <TikTokIcon className="w-4 h-4" />
                <span className="hidden sm:inline">@d.young.hairs</span>
              </a>
            </div>
          </div>

          {/* Col 3: Collections */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.16em] text-[#FDFCF7] font-semibold">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D6C2A7]/80 font-light">
              <li>
                <button
                  onClick={() => handleLinkClick('/shop?category=sdd-vietnamese-bone-straight')}
                  className="hover:text-[#FDFCF7] transition-colors text-left"
                >
                  SDD Vietnamese Bone Straight
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/shop?category=sdd-curls-and-waves')}
                  className="hover:text-[#FDFCF7] transition-colors text-left"
                >
                  SDD Curls & Waves
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/shop?category=raw-hair-and-deep-wave')}
                  className="hover:text-[#FDFCF7] transition-colors text-left"
                >
                  Raw Hair & Deep Wave
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/shop?category=vietnamese-donor-hair')}
                  className="hover:text-[#FDFCF7] transition-colors text-left"
                >
                  Vietnamese Donor Hair
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/shop')}
                  className="hover:text-[#FDFCF7] transition-colors text-left flex items-center gap-1 text-[#B89865]"
                >
                  <span>View All Hair Catalog</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Client Services */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.16em] text-[#FDFCF7] font-semibold">
              Client Services
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D6C2A7]/80 font-light">
              <li>
                <button onClick={() => handleLinkClick('/delivery')} className="hover:text-[#FDFCF7] transition-colors text-left">
                  Delivery All Over Nigeria
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/about')} className="hover:text-[#FDFCF7] transition-colors text-left">
                  About Eze Stephen Chidubem
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/faq')} className="hover:text-[#FDFCF7] transition-colors text-left">
                  Hair Longevity & FAQ
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/blog')} className="hover:text-[#FDFCF7] transition-colors text-left">
                  Hair Care Guides
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/videos')} className="hover:text-[#FDFCF7] transition-colors text-left">
                  Hair Videos & Reviews
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/contact')} className="hover:text-[#FDFCF7] transition-colors text-left">
                  Store Locations & Hours
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Store Locations */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.16em] text-[#FDFCF7] font-semibold">
              Store Locations
            </h4>
            <div className="space-y-3.5 text-xs text-[#D6C2A7]/80 font-light">
              <div className="space-y-1 border-l-2 border-[#B89865] pl-2.5">
                <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-medium block">
                  Head Office
                </span>
                <p className="leading-snug">
                  {settings.headOffice || 'Head office address available in Admin Settings'}
                </p>
              </div>

              <div className="space-y-1 border-l-2 border-[#8C6A48] pl-2.5">
                <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-medium block">
                  Branch
                </span>
                <p className="leading-snug">
                  {settings.branch1 || 'Branch address available in Admin Settings'}
                </p>
              </div>

              <div className="space-y-1 border-l-2 border-[#8C6A48] pl-2.5">
                <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-medium block">
                  Branch Office
                </span>
                <p className="leading-snug">
                  {settings.branch2 || 'Branch office address available in Admin Settings'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[#FDFCF7]">
                <Phone className="w-3.5 h-3.5 text-[#B89865] shrink-0" />
                <span>Phone / WhatsApp: {settings.phoneNumber || settings.whatsAppNumber || 'Available in Admin Settings'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A68F7B] tracking-wider gap-4">
          <p>© {new Date().getFullYear()} D YOUNG LUXURY HAIRS. All rights reserved. Slogan: Premium Hair or Nothing.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleLinkClick('/admin')}
              className="flex items-center gap-1.5 text-[#B89865] hover:text-[#FDFCF7] transition-colors focus:outline-none"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </button>
            <span className="hidden sm:inline">·</span>
            <span>Delivery All Over Nigeria · Open Every Day</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
