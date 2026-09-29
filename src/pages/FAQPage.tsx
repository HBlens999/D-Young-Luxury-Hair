import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface FAQPageProps {
  onNavigate: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = () => {
  const { settings } = useSettings();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is Vietnamese Super Double Drawn (SDD) Bone Straight Hair?',
      a: 'Super Double Drawn (SDD) hair is manually sorted multiple times by skilled artisans to remove almost all shorter strands. Approximately 85% to 95% of the hair strands in each bundle are the exact declared length. This ensures a remarkably full, thick curtain of hair from the weft right down to the ends, eliminating thin or tapered tips.'
    },
    {
      q: 'How long does D Young Luxury hair last?',
      a: 'Our raw single-donor Vietnamese hair has a lifespan of 3 to 5+ years with proper maintenance. Because our hair is free from chemical acid baths and retains intact cuticles, it does not suffer from synthetic degradation or premature tangling.'
    },
    {
      q: 'Can the hair be bleached, dyed, or heat-styled?',
      a: 'Yes, absolutely. Because our hair is 100% genuine human hair, it can be bleached to 613 blonde, custom dyed to chocolate, burgundy, or copper shades, and flat-ironed up to 230°C. We recommend applying a thermal heat protectant serum prior to flat-ironing.'
    },
    {
      q: 'How does the WhatsApp Ordering System work?',
      a: 'When you select your items and click "Order via WhatsApp", your exact order details (lengths, colors, quantities, and delivery address) are automatically formatted and forwarded to our official WhatsApp business concierge. Our consultant will verify stock, provide our official corporate bank account details, and arrange secure courier dispatch.'
    },
    {
      q: 'How do I care for my bone straight hair to maintain the mirror shine?',
      a: 'Wash every 2 to 3 weeks using a sulfate-free shampoo in lukewarm water. Apply a lightweight keratin or argan oil serum from mid-shaft to ends. Wrap your hair in a 100% silk or satin bonnet each night before sleeping to prevent friction.'
    },
    {
      q: 'Do you offer custom wig construction and bleached knots?',
      a: 'Yes. Our custom units feature pre-plucked Swiss HD frontals and micro-bleached knots that seamlessly blend with any skin tone. You can specify cap sizing (Small, Medium, Large) during WhatsApp confirmation.'
    },
    {
      q: 'What are your delivery timelines and store hours?',
      a: 'We are open every day. Local pickup and delivery are available from our store locations in {settings.city || 'the configured store area'}. Nationwide delivery across Nigeria takes 24 to 48 hours via express courier. Real-time waybill tracking is sent directly to your WhatsApp.'
    }
  ];

  const cleanWhatsApp = settings.whatsAppNumber.replace(/[^0-9]/g, '');
  const whatsAppUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello D Young Luxury Hairs, I have a question regarding hair specifications.')}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-14">
      
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block">
          Client Knowledge Base
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#291C16]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5344] font-light leading-relaxed">
          Everything you need to know about our hair sourcing, grading, ordering process, and aftercare.
        </p>
      </div>

      <div className="bg-white border border-[#EAE2D7] divide-y divide-[#EAE2D7]">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="p-6">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
              >
                <h3 className="font-serif text-lg font-semibold text-[#291C16]">
                  {faq.q}
                </h3>
                <ChevronDown
                  className={`w-4 h-4 text-[#8C6A48] shrink-0 transform transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="pt-4 text-xs sm:text-sm text-[#6B5344] font-light leading-relaxed animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#F4EFEA] border border-[#D6C2A7] p-8 text-center space-y-4">
        <h3 className="font-serif text-xl text-[#291C16]">Have an unlisted question?</h3>
        <p className="text-xs text-[#6B5344] font-light max-w-md mx-auto">
          Our senior hair stylists are available on WhatsApp to answer any questions or guide you through custom measurements.
        </p>
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#291C16] text-[#FDFCF7] text-xs uppercase tracking-wider font-semibold hover:bg-[#4A3326] transition-colors"
        >
          <MessageCircle className="w-4 h-4 fill-white text-[#291C16]" />
          <span>Ask On WhatsApp</span>
        </a>
      </div>

    </div>
  );
};
