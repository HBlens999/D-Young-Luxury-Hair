import React from 'react';
import { useSettings } from '../../context/SettingsContext';

interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'gold' | 'monogram-only';
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  customLogoUrl?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'dark',
  showSlogan = true,
  size = 'md',
  customLogoUrl
}) => {
  const { settings } = useSettings();
  const logoSrc = customLogoUrl || settings?.logoUrl;

  // Color palette
  const textColor = variant === 'light' ? 'text-[#FDFCF7]' : variant === 'gold' ? 'text-[#C5A059]' : 'text-[#241711]';
  const subtextColor = variant === 'light' ? 'text-[#C5A059]' : 'text-[#8C6A48]';

  // Sizing
  const imgSize = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-13 h-13 sm:w-16 sm:h-16',
    hero: 'w-20 h-20 sm:w-24 sm:h-24'
  }[size];

  const brandTextSize = {
    sm: 'text-sm tracking-[0.18em]',
    md: 'text-base sm:text-lg tracking-[0.2em]',
    lg: 'text-xl sm:text-2xl tracking-[0.22em]',
    hero: 'text-2xl sm:text-3xl lg:text-4xl tracking-[0.25em]'
  }[size];

  const sloganTextSize = {
    sm: 'text-[9px] tracking-[0.22em]',
    md: 'text-[10px] sm:text-[11px] tracking-[0.25em]',
    lg: 'text-xs tracking-[0.28em]',
    hero: 'text-xs sm:text-sm tracking-[0.32em]'
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* Official Brand Logo or Monogram Emblem */}
      <div className={`relative flex items-center justify-center shrink-0 ${imgSize} rounded-full overflow-hidden border border-[#D8B46E]/50 bg-[#160E0A] shadow-md ring-1 ring-[#D8B46E]/20 p-0.5`}>
        {logoSrc ? (
          <img
            src={logoSrc}
            alt="D Young Luxury Hairs Official Brand Logo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="font-serif font-bold text-[#E5C687] text-xs sm:text-sm tracking-tight select-none">
            DY
          </span>
        )}
      </div>

      {variant !== 'monogram-only' && (
        <div className="flex flex-col justify-center leading-none text-left">
          <span className={`font-serif font-bold uppercase ${brandTextSize} ${textColor}`}>
            D Young Luxury Hairs
          </span>
          {showSlogan && (
            <span className={`font-sans uppercase font-medium mt-1 ${sloganTextSize} ${subtextColor}`}>
              Premium Hair or Nothing
            </span>
          )}
        </div>
      )}
    </div>
  );
};
