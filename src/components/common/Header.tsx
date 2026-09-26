import React, { useState } from 'react';
import { ShoppingBag, Menu, X, MessageCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { BrandLogo } from './BrandLogo';
import { formatWhatsAppNumberForLink } from '../../lib/supabase';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Collections', path: '/categories' },
    { label: 'Blog', path: '/blog' },
    { label: 'Videos', path: '/videos' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWhatsAppNumber = formatWhatsAppNumberForLink(settings.whatsAppNumber || '08107123342');
  const whatsAppUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello D Young Luxury Hairs, I would like to inquire about your premium hair collections.')}`;

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#EAE2D7]">
      {/* Subtle Luxury Announcement Bar */}
      {settings.isAnnouncementActive && settings.announcementText && (
        <div className="bg-[#291C16] text-[#EBE3D8] text-[11px] sm:text-xs py-1.5 px-4 text-center tracking-wider font-light flex items-center justify-center gap-2">
          <span>{settings.announcementText}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Official Brand Logo with Monogram & Slogan */}
        <div className="flex items-center">
          <button
            onClick={() => handleLinkClick('/')}
            className="text-left group cursor-pointer focus:outline-none"
            aria-label="D Young Luxury Hairs Home"
          >
            <BrandLogo size="md" variant="dark" showSlogan={true} />
          </button>
        </div>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-[0.12em] font-medium text-[#4A3326]/80 uppercase">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`transition-colors hover:text-[#291C16] relative py-1 focus:outline-none cursor-pointer whitespace-nowrap ${
                  isActive ? 'text-[#291C16] font-semibold' : ''
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#8C6A48]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 Primary actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Direct WhatsApp Concierge CTA */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs tracking-wider font-medium text-[#291C16] border border-[#D6C2A7] hover:bg-[#F4EFEA] transition-colors rounded-none whitespace-nowrap"
            title="Chat with Luxury Hair Consultant"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp Order</span>
          </a>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative p-2.5 text-[#291C16] hover:text-[#8C6A48] transition-colors focus:outline-none cursor-pointer"
            aria-label={`Shopping bag with ${totalItems} items`}
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-[#291C16] text-[#FBF9F5] text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#291C16] hover:text-[#8C6A48] focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EAE2D7] bg-[#FBF9F5] px-6 py-6 space-y-4 animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className="text-left text-sm uppercase tracking-widest py-2 text-[#4A3326] hover:text-[#291C16] border-b border-[#F4EFEA] flex items-center justify-between"
              >
                <span>{link.label}</span>
                {currentPath === link.path && <span className="text-[#8C6A48] font-bold">·</span>}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#EAE2D7] space-y-3">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#291C16] text-[#FBF9F5] text-xs uppercase tracking-wider font-medium"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Direct WhatsApp Concierge</span>
            </a>

            <button
              onClick={() => handleLinkClick('/admin')}
              className="w-full text-center text-xs tracking-wider text-[#8C6A48] py-2 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
