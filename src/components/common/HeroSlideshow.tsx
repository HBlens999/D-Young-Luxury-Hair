import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { HERO_SLIDES } from '../../lib/initialData';
import { useSettings } from '../../context/SettingsContext';

interface HeroSlideshowProps {
  onNavigate: (path: string) => void;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { settings } = useSettings();

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Auto transition timer (every 6 seconds for a cinematic feel)
  useEffect(() => {
    if (isPlaying && !prefersReducedMotion) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 6000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, nextSlide, prefersReducedMotion]);

  // Touch Swipe handlers
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const cleanWhatsAppNumber = settings.whatsAppNumber.replace(/[^0-9]/g, '');
  const activeSlide = HERO_SLIDES[currentSlide];
  const whatsAppUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(`Hello D Young Luxury Hairs, I would like to order from the ${activeSlide.title} collection.`)}`;

  return (
    <section
      className="relative w-full h-[82vh] min-h-[580px] max-h-[820px] bg-[#1A1310] overflow-hidden select-none"
      aria-label="Luxury Hair Hero Gallery"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides Container */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image or Luxury Atelier Backdrop */}
            <div
              className={`w-full h-full transform will-change-transform ${
                isActive && !prefersReducedMotion ? 'animate-kenburns scale-105' : 'scale-100'
              } transition-transform duration-1000`}
            >
              {slide.image ? (
                <img
                  src={slide.image}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.05]"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#160E0A] via-[#221610] to-[#120B07] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-radial from-transparent via-[#160E0A]/40 to-[#160E0A]" />
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D8B46E_1px,transparent_1px)] [background-size:24px_24px]" />
                </div>
              )}
            </div>

            {/* Measured luxury scrim overlay according to frontend design principles */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1310]/95 via-[#1A1310]/40 to-transparent" />
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#1A1310]/40" />
          </div>
        );
      })}

      {/* Official Exact Brand Logo Watermark in Hero (Top-Right, only if uploaded) */}
      {settings.logoUrl && (
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-20 pointer-events-none select-none flex items-center gap-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border border-[#D8B46E]/50 p-0.5 shadow-2xl bg-[#160E0A]/85 backdrop-blur-md opacity-80 sm:opacity-90">
            <img
              src={settings.logoUrl}
              alt="D Young Luxury Hairs Official Brand Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      )}

      {/* Hero Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20">
        <div className="max-w-2xl text-[#FDFCF7] space-y-4">
          
          {/* Subtle Tagline with Official Brand Emblem */}
          <div className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-[#D6C2A7] font-medium bg-[#1A1310]/70 backdrop-blur-sm px-3.5 py-1.5 border border-[#B89865]/40 w-fit">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="D Young Luxury Hairs"
                referrerPolicy="no-referrer"
                className="w-4 h-4 rounded-full object-cover border border-[#B89865]/60"
              />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-[#D8B46E]" />
            )}
            <span className="w-4 h-[1px] bg-[#B89865]" />
            <span>{activeSlide.tagline}</span>
          </div>

          {/* Main Display Headline (Cormorant Garamond) */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FDFCF7] leading-[1.08] text-balance">
            {activeSlide.title}
          </h1>

          <p className="text-sm sm:text-base text-[#EBE3D8]/90 font-light max-w-xl leading-relaxed tracking-wide">
            {activeSlide.subtitle}. Handcrafted with genuine Vietnamese temple hair, double-drawn density, and liquid mirror sheen.
          </p>

          {/* Primary and Secondary Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={() => onNavigate('/shop')}
              className="px-8 py-3.5 bg-[#FDFCF7] text-[#1A1310] hover:bg-[#EBE3D8] text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#25D366]/90 hover:bg-[#25D366] text-[#FFFFFF] text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-200 flex items-center justify-center gap-2.5 backdrop-blur-sm cursor-pointer shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>ORDER VIA WHATSAPP</span>
            </a>
          </div>

        </div>
      </div>

      {/* Manual Slideshow Controls */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-30 flex items-center gap-3 bg-[#1A1310]/60 backdrop-blur-md px-3 py-2 border border-[#3E2D24]">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-[#D6C2A7] hover:text-[#FDFCF7] p-1 transition-colors focus:outline-none"
          title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <span className="w-[1px] h-3 bg-[#3E2D24]" />

        {/* Indicators */}
        <div className="flex items-center gap-1.5 px-1">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-300 rounded-none focus:outline-none ${
                i === currentSlide ? 'w-6 bg-[#B89865]' : 'w-2 bg-[#EBE3D8]/30 hover:bg-[#EBE3D8]/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <span className="w-[1px] h-3 bg-[#3E2D24]" />

        {/* Prev / Next Buttons */}
        <button
          onClick={prevSlide}
          className="text-[#D6C2A7] hover:text-[#FDFCF7] p-1 transition-colors focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={nextSlide}
          className="text-[#D6C2A7] hover:text-[#FDFCF7] p-1 transition-colors focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};
