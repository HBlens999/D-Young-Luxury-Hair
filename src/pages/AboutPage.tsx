import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Sparkles, Award, Shield, HeartHandshake, ArrowRight, MessageCircle, Quote, Star } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  const cleanWhatsApp = settings.whatsAppNumber.replace(/[^0-9]/g, '');
  const founderWhatsAppUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Eze Stephen Chidubem, I am reaching out to D Young Luxury Hairs regarding your luxury hair collections.')}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block">
          Our Heritage & Ethos
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#291C16] leading-tight">
          Crafting the Crown of Modern African Luxury
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5344] font-light leading-relaxed">
          At D YOUNG LUXURY HAIRS, hair is never treated as a mere accessory. It is an enduring investment in poise, beauty, and quiet authority.
        </p>
      </div>

      {/* Founder Spotlight Section */}
      <div className="bg-[#FAF7F2] border border-[#E2D5C3] p-8 sm:p-14 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Portrait Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#8C6A48] to-[#C9AB7E] opacity-30 blur-sm rounded-none"></div>
              <div className="relative w-64 sm:w-72 md:w-80 aspect-[3/4] overflow-hidden border-2 border-[#8C6A48] shadow-2xl bg-[#1C130E] flex flex-col items-center justify-center p-6 text-center">
                {settings.ceoImageUrl ? (
                  <img
                    src={settings.ceoImageUrl}
                    alt="Eze Stephen Chidubem - Owner & Founder of D Young Luxury Hairs"
                    className="w-full h-full object-cover object-top filter contrast-[1.02] hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="w-20 h-20 rounded-full border-2 border-[#D8B46E] bg-[#120B07] mx-auto flex items-center justify-center text-[#E5C687] font-serif font-bold text-2xl shadow-inner">
                      ESC
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs uppercase tracking-widest text-[#E8D7C3] font-semibold block">
                        Eze Stephen Chidubem
                      </span>
                      <span className="text-[11px] text-[#C9AB7E] font-serif italic block">
                        Owner &amp; Founder
                      </span>
                    </div>
                    <p className="text-[10px] text-[#A8885B] uppercase tracking-wider font-light">
                      Official Photograph Awaiting Upload
                    </p>
                  </div>
                )}
                {settings.ceoImageUrl && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#291C16] via-[#291C16]/80 to-transparent p-4 text-center">
                    <span className="text-xs uppercase tracking-widest text-[#E8D7C3] font-semibold block">
                      Eze Stephen Chidubem
                    </span>
                    <span className="text-[11px] text-[#C9AB7E] font-serif italic block">
                      Owner &amp; Founder
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Story & Motto Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0E6D8] border border-[#D6C2A7] text-[#8C6A48] text-[11px] uppercase tracking-widest font-semibold">
              <Star className="w-3 h-3 fill-[#8C6A48]" />
              <span>Meet the Founder & Visionary</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-3xl sm:text-4xl text-[#291C16] leading-tight">
                Eze Stephen Chidubem
              </h2>
              <p className="text-xs uppercase tracking-widest text-[#8C6A48] font-semibold">
                Owner & Founder · D Young Luxury Hairs
              </p>
            </div>

            {/* Founder Quote Callout */}
            <div className="border-l-4 border-[#8C6A48] pl-5 py-2 bg-white/70 shadow-sm border border-[#EAE2D7]">
              <div className="flex items-start gap-3">
                <Quote className="w-6 h-6 text-[#8C6A48] shrink-0 mt-0.5" />
                <div>
                  <p className="font-serif text-xl sm:text-2xl text-[#291C16] italic leading-snug">
                    “Luxury hair or nothing.”
                  </p>
                  <span className="text-xs text-[#8C6A48] font-medium block mt-1">
                    — Eze Stephen Chidubem's Personal Creed
                  </span>
                </div>
              </div>
            </div>

            {/* Founder Narrative */}
            <div className="space-y-4 text-xs sm:text-sm text-[#4A3326] font-light leading-relaxed">
              <p>
                <strong>Eze Stephen Chidubem</strong> is the visionary owner and founder behind <strong>D Young Luxury Hairs</strong>. Driven by an innate passion for seeing those around him look effortlessly elevated, sophisticated, and radiant, Stephen established the brand on an unwavering foundation of peerless quality.
              </p>
              <p>
                To Stephen, luxury is not a vague label—it is an uncompromising commitment. He personally oversees our direct ethical sourcing channels across Northern Vietnam and single-donor harvests, ensuring every bundle and hand-tied wig provides full cuticle alignment, natural movement, and commanding longevity.
              </p>
              <p>
                Whether assisting clients with customized wig construction or guiding connoisseurs through our Super Double Drawn and Raw Donor collections, Stephen's hallmark ethos remains resolute: true luxury cannot be faked.
              </p>
            </div>

            {/* Direct Connect Action */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <a
                href={founderWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#291C16] text-[#FDFCF7] text-xs uppercase tracking-wider font-semibold hover:bg-[#4A3326] transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#291C16]" />
                <span>Connect Directly with the Founder</span>
              </a>
              <button
                onClick={() => onNavigate('/contact')}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#8C6A48] hover:text-[#291C16] font-semibold underline underline-offset-4"
              >
                <span>View Brand Contacts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white border border-[#EAE2D7] p-8 sm:p-14">
        <div className="space-y-5">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8C6A48] font-semibold block">
            The Philosophy
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
            Uncompromising Standards in Vietnamese Single Donor Hair
          </h2>
          <p className="text-xs sm:text-sm text-[#4A3326] font-light leading-relaxed">
            In an industry crowded with chemical silicones and diluted fiber blends, D YOUNG LUXURY HAIRS was established to stand firmly apart. We believe luxury lies in authenticity.
          </p>
          <p className="text-xs sm:text-sm text-[#4A3326] font-light leading-relaxed">
            Every bundle of our SDD Vietnamese Bone Straight hair is sourced from healthy donors in Northern Vietnam whose hair has been nourished through traditional herbal care. Each strand retains its natural cuticular integrity, delivering a liquid mirror finish that effortlessly withstands heat and humidity.
          </p>
          <div className="pt-2">
            <a
              href={founderWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#291C16] text-[#FDFCF7] text-xs uppercase tracking-wider font-semibold hover:bg-[#4A3326] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#291C16]" />
              <span>Connect with Founder Concierge</span>
            </a>
          </div>
        </div>

        <div className="space-y-6 bg-[#F4EFEA] p-8 border border-[#D6C2A7]">
          <h3 className="font-serif text-xl text-[#291C16]">Our Quadruple Guarantee</h3>
          <ul className="space-y-4 text-xs text-[#4A3326] font-light">
            <li className="flex items-start gap-3">
              <Award className="w-4 h-4 text-[#8C6A48] shrink-0 mt-0.5" />
              <span><strong>Pure Raw Cuticles:</strong> Zero chemical acid bathing. Intact unidirectional cuticles that do not tangle.</span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#8C6A48] shrink-0 mt-0.5" />
              <span><strong>Super Double Drawn:</strong> 85% to 95% full-length strands for commanding weft-to-tip thickness.</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-[#8C6A48] shrink-0 mt-0.5" />
              <span><strong>3 to 5 Year Lifespan:</strong> Long-term endurance when maintained with our recommended regimen.</span>
            </li>
            <li className="flex items-start gap-3">
              <HeartHandshake className="w-4 h-4 text-[#8C6A48] shrink-0 mt-0.5" />
              <span><strong>Video Verification:</strong> Clear pre-dispatch video verification on WhatsApp before order leaves our atelier.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Official Locations & Consultations */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h3 className="font-serif text-2xl text-[#291C16]">Visit Our Awka Locations</h3>
        <p className="text-xs text-[#6B5344] font-light leading-relaxed">
          Head Office: No. 14 Bida Road, Linco Plaza, First Floor, Along Mosque, Awka, Anambra State. Branches on Kano Street. Open every day with fast delivery all over Nigeria.
        </p>
        <button
          onClick={() => onNavigate('/contact')}
          className="text-xs uppercase tracking-widest text-[#8C6A48] hover:text-[#291C16] font-semibold underline underline-offset-4 cursor-pointer"
        >
          View Store Locations & Connect on WhatsApp
        </button>
      </div>

    </div>
  );
};
