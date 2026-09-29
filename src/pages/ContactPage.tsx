import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { MapPin, Phone, MessageCircle, Clock, Send, CheckCircle2, Quote, Star, Truck, Instagram, User } from 'lucide-react';
import { formatWhatsAppNumberForLink } from '../lib/supabase';

// Custom TikTok icon
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.95-4.52V8.9a8.28 8.28 0 0 0 4.82 1.55v-3.5a4.84 4.84 0 0 1-1-.26z" />
  </svg>
);

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [topic, setTopic] = useState('Hair Order Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const cleanWhatsApp = formatWhatsAppNumberForLink(settings.whatsAppNumber || '08107123342');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inquiryText = `Hello D Young Luxury Hairs,\nAttn: Eze Stephen Chidubem (Founder) & Team\nName: ${name}\nPhone: ${contact}\nSubject: ${topic}\nMessage: ${message}`;
    const url = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(inquiryText)}`;
    setSubmitted(true);
    window.open(url, '_blank');
  };

  const directWhatsAppUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello D Young Luxury Hairs, I would like to inquire about your luxury hair collections.')}`;
  const founderWhatsAppUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Eze Stephen Chidubem, I am contacting you directly regarding D Young Luxury Hairs.')}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block">
          Client Concierge & Direct Contact
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#291C16]">
          Contact D Young Luxury Hairs
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5344] font-light leading-relaxed">
          Slogan: <strong>Premium Hair or Nothing</strong>. Open every day. Delivery all over Nigeria.
        </p>
      </div>

      {/* Founder Spotlight Card */}
      <div className="bg-[#FAF7F2] border border-[#E2D5C3] p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#8C6A48] shadow-md bg-[#1C130E] flex items-center justify-center">
              {settings.ceoImageUrl ? (
                <img
                  src={settings.ceoImageUrl}
                  alt="Eze Stephen Chidubem - Owner & Founder"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="font-serif font-bold text-[#E5C687] text-xl">
                  ESC
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#8C6A48] text-white p-1 rounded-full shadow">
              <Star className="w-3.5 h-3.5 fill-white" />
            </div>
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase tracking-widest text-[#8C6A48] font-semibold block">
                Owner & Founder
              </span>
              <h3 className="font-serif text-2xl text-[#291C16]">
                Eze Stephen Chidubem
              </h3>
              <p className="text-xs text-[#8C6A48] font-medium">
                Founder · D Young Luxury Hairs (Contact is same as the brand's: {settings.phoneNumber || settings.whatsAppNumber || 'Available in Admin Settings'})
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#EAE2D7] text-xs text-[#291C16] italic font-serif">
              <Quote className="w-3.5 h-3.5 text-[#8C6A48] shrink-0" />
              <span>“Luxury hair or nothing.”</span>
            </div>

            <p className="text-xs text-[#4A3326] font-light leading-relaxed max-w-3xl">
              Eze Stephen Chidubem is the owner and founder of D Young Luxury Hairs, who is passionate about making those around him look good as he would always say, <em>“Luxury hair or nothing.”</em> His direct contact is identical to the brand's verified contact lines.
            </p>

            <div className="pt-1 flex flex-wrap justify-center sm:justify-start gap-3">
              <a
                href={founderWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>Chat with Eze Stephen on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Contact Details & Store Locations */}
        <div className="lg:col-span-5 bg-white border border-[#EAE2D7] p-8 space-y-6 shadow-sm">
          <div className="space-y-1 border-b border-[#F4EFEA] pb-4">
            <h2 className="font-serif text-2xl text-[#291C16]">Store Locations & Details</h2>
            <p className="text-xs text-[#8C6A48]">
              {settings.city || 'Location available in Admin Settings'}
            </p>
          </div>

          <div className="space-y-5 text-xs text-[#4A3326]">
            
            {/* Head Office */}
            <div className="space-y-1 border-l-2 border-[#8C6A48] pl-3">
              <span className="font-semibold text-[#291C16] uppercase tracking-wider block">
                Head Office
              </span>
              <p className="font-light leading-relaxed">
                {settings.headOffice || 'Address available in Admin Settings'}
              </p>
            </div>

            {/* Branch */}
            <div className="space-y-1 border-l-2 border-[#C5A059] pl-3">
              <span className="font-semibold text-[#291C16] uppercase tracking-wider block">
                Branch
              </span>
              <p className="font-light leading-relaxed">
                {settings.branch1 || 'Address available in Admin Settings'}
              </p>
            </div>

            {/* Branch Office */}
            <div className="space-y-1 border-l-2 border-[#C5A059] pl-3">
              <span className="font-semibold text-[#291C16] uppercase tracking-wider block">
                Branch Office
              </span>
              <p className="font-light leading-relaxed">
                {settings.branch2 || 'Address available in Admin Settings'}
              </p>
            </div>

            {/* Phone & WhatsApp */}
            <div className="flex items-start gap-3.5 pt-2">
              <Phone className="w-4 h-4 text-[#8C6A48] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-[#291C16] uppercase tracking-wider block">
                  Phone / WhatsApp
                </span>
                <p className="font-light">{settings.phoneNumber || settings.whatsAppNumber || 'Available in Admin Settings'}</p>
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#25D366] font-medium hover:underline inline-block"
                >
                  Click to chat on WhatsApp →
                </a>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="flex items-start gap-3.5">
              <Truck className="w-4 h-4 text-[#8C6A48] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-[#291C16] uppercase tracking-wider block">
                  Delivery
                </span>
                <p className="font-light">All over Nigeria</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start gap-3.5">
              <Clock className="w-4 h-4 text-[#8C6A48] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-[#291C16] uppercase tracking-wider block">
                  Business Hours
                </span>
                <p className="font-light">Open every day</p>
              </div>
            </div>

            {/* Socials */}
            <div className="pt-2 border-t border-[#F4EFEA] flex flex-wrap gap-4">
              <a
                href="https://instagram.com/dyoungluxury"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#8C6A48] hover:text-[#291C16] flex items-center gap-1.5 font-medium"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram: @dyoungluxury</span>
              </a>
              <a
                href="https://tiktok.com/@d.young.hairs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#8C6A48] hover:text-[#291C16] flex items-center gap-1.5 font-medium"
              >
                <TikTokIcon className="w-4 h-4" />
                <span>TikTok: @d.young.hairs</span>
              </a>
            </div>

          </div>
        </div>

        {/* Right: Interactive Inquiry Form */}
        <div className="lg:col-span-7 bg-white border border-[#EAE2D7] p-8 space-y-6 shadow-sm">
          <div className="space-y-1 border-b border-[#F4EFEA] pb-4">
            <h2 className="font-serif text-2xl text-[#291C16]">Send WhatsApp Inquiry</h2>
            <p className="text-xs text-[#8C6A48]">
              Connect directly with D Young Luxury Hairs concierge at 08107123342.
            </p>
          </div>

          {submitted && (
            <div className="p-4 bg-[#EBE3D8] border border-[#8C6A48] text-xs text-[#291C16] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>Inquiry prepared! Opening WhatsApp chat...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Joy Nwosu"
                className="w-full px-4 py-2.5 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                  Your Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. 08012345678"
                  className="w-full px-4 py-2.5 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                  Subject
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
                >
                  <option value="Hair Order Inquiry">Hair Order Inquiry</option>
                  <option value="Consultation with Eze Stephen Chidubem">Consultation with Eze Stephen Chidubem (Founder)</option>
                  <option value="Bone Straight Hair Inquiry">Bone Straight Hair Inquiry</option>
                  <option value="Bouncy / Pixel Curls Inquiry">Bouncy / Pixel Curls Inquiry</option>
                  <option value="Awka Store Visit">Awka Store Visit</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Your Message / Hair Specifications *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Let us know the hair type, length, or unit you would like to order..."
                className="w-full px-4 py-2.5 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#291C16] hover:bg-[#4A3326] text-[#FDFCF7] uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send via WhatsApp to 08107123342</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
