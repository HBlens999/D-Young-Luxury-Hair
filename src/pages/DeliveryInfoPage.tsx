import React from 'react';
import { Truck, ShieldCheck, Clock, MapPin, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatWhatsAppNumberForLink } from '../lib/supabase';

interface DeliveryInfoPageProps {
  onNavigate: (path: string) => void;
}

export const DeliveryInfoPage: React.FC<DeliveryInfoPageProps> = () => {
  const { settings } = useSettings();
  const cleanWhatsApp = formatWhatsAppNumberForLink(settings.whatsAppNumber || '08107123342');
  const whatsAppUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello D Young Luxury Hairs, I would like to inquire about delivery to my location.')}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-14">
      
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block">
          Dispatch & Logistics
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#291C16]">
          Delivery All Over Nigeria
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5344] font-light leading-relaxed">
          D Young Luxury Hairs dispatches authentic Vietnamese bone straight, bouncy curls, and raw donor hair to all 36 states across Nigeria.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Local Delivery / Pickup */}
        <div className="bg-white border border-[#EAE2D7] p-8 space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#8C6A48]" />
            <h2 className="font-serif text-xl font-semibold text-[#291C16]">Local Pickup & Delivery</h2>
          </div>
          <p className="text-xs text-[#6B5344] font-light leading-relaxed">
            Same-day pickup and rapid local delivery are available from our store locations in {settings.city || 'the configured store area'}.
          </p>
          <ul className="text-xs text-[#4A3326] space-y-1.5 pt-2 list-disc list-inside">
            <li>Head Office: {settings.headOffice || 'Address available in Admin Settings'}</li>
            <li>Branch: {settings.branch1 || 'Address available in Admin Settings'}</li>
            <li>Branch Office: {settings.branch2 || 'Address available in Admin Settings'}</li>
            <li>Business hours: Open every day</li>
          </ul>
        </div>

        {/* Nationwide Nigerian States */}
        <div className="bg-white border border-[#EAE2D7] p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#8C6A48]" />
            <h2 className="font-serif text-xl font-semibold text-[#291C16]">Delivery All Over Nigeria</h2>
          </div>
          <p className="text-xs text-[#6B5344] font-light leading-relaxed">
            We partner with verified express interstate logistics and park waybills to deliver securely to Lagos, Abuja, Port Harcourt, Enugu, Onitsha, Owerri, Asaba, Benin, Kano, and every state in Nigeria.
          </p>
          <ul className="text-xs text-[#4A3326] space-y-1.5 pt-2 list-disc list-inside">
            <li>Southeast & South-South: 24 hours</li>
            <li>Lagos & Abuja: 24 to 48 hours</li>
            <li>Other States: 48 to 72 hours</li>
            <li>Real-time waybill tracking provided via WhatsApp</li>
          </ul>
        </div>

        {/* Business Hours: Open Every Day */}
        <div className="bg-white border border-[#EAE2D7] p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#8C6A48]" />
            <h2 className="font-serif text-xl font-semibold text-[#291C16]">Open Every Day</h2>
          </div>
          <p className="text-xs text-[#6B5344] font-light leading-relaxed">
            Our atelier, storefronts, and WhatsApp order channels operate 7 days a week, Monday through Sunday.
          </p>
          <ul className="text-xs text-[#4A3326] space-y-1.5 pt-2 list-disc list-inside">
            <li>Monday – Sunday: Open Every Day</li>
            <li>Direct WhatsApp inquiries attended to promptly</li>
            <li>Dedicated hotline: {settings.phoneNumber || settings.whatsAppNumber || 'Available in Admin Settings'}</li>
          </ul>
        </div>

        {/* Pre-Dispatch Inspection Protocol */}
        <div className="bg-white border border-[#EAE2D7] p-8 space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="font-serif text-xl font-semibold text-[#291C16]">Pre-Dispatch Video Check</h2>
          </div>
          <p className="text-xs text-[#6B5344] font-light leading-relaxed">
            Before your package is sealed, our quality team records an HD video of your exact hair bundles and unit being combed through. We share this video directly on WhatsApp for your approval.
          </p>
          <div className="pt-2">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#25D366] hover:underline"
            >
              <MessageCircle className="w-4 h-4 fill-[#25D366]" />
              <span>Contact Delivery Concierge on WhatsApp (08107123342)</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
