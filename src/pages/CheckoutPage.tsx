import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { db, generateWhatsAppOrderUrl } from '../lib/supabase';
import { MessageCircle, ShieldCheck, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, subtotal, clearCart } = useCart();
  const { settings } = useSettings();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<{ id: string; url: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (cart.length === 0 && !orderCompleted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-2xl text-[#291C16]">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-[#6B5344]">Add items to your bag before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-6 py-2.5 bg-[#291C16] text-[#FDFCF7] text-xs uppercase tracking-widest font-semibold"
        >
          Browse Collections
        </button>
      </div>
    );
  }

  // Handle Order via WhatsApp submission
  const handleOrderViaWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please provide your phone number.');
      return;
    }
    if (!deliveryLocation.trim()) {
      setErrorMessage('Please provide your delivery location.');
      return;
    }

    const contactWhatsApp = whatsAppNumber.trim() || phone.trim();

    try {
      setIsSubmitting(true);

      // 1. Generate formatted WhatsApp order link
      const waUrl = generateWhatsAppOrderUrl(
        settings.whatsAppNumber,
        fullName.trim(),
        phone.trim(),
        deliveryLocation.trim(),
        cart,
        subtotal,
        customerNote.trim()
      );

      // 2. Record order in Supabase / database
      const orderItems = cart.map(item => ({
        productId: item.productId,
        productName: item.productName,
        length: item.length,
        color: item.color,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }));

      const createdOrder = await db.createOrder({
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        customerWhatsApp: contactWhatsApp,
        deliveryLocation: deliveryLocation.trim(),
        customerNote: customerNote.trim() || undefined,
        totalAmount: subtotal,
        status: 'New',
        items: orderItems
      });

      // 3. Set completion state and clear cart
      setOrderCompleted({
        id: createdOrder.id,
        url: waUrl
      });
      clearCart();

      // 4. Automatically open WhatsApp chat in a new tab/window
      window.open(waUrl, '_blank');

    } catch (err: any) {
      console.error('Failed to submit order:', err);
      setErrorMessage('Could not record your order. Please retry or contact concierge directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Order Confirmation screen
  if (orderCompleted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8">
        <div className="w-16 h-16 rounded-full bg-[#EBE3D8] text-[#291C16] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-emerald-700" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block">
            Order Submitted
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#291C16]">
            Thank You for Choosing D Young Luxury Hairs
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5344] font-light max-w-md mx-auto leading-relaxed">
            Your order reference <strong className="font-mono text-[#291C16]">{orderCompleted.id}</strong> has been logged in our system.
          </p>
        </div>

        <div className="bg-white border border-[#EAE2D7] p-6 space-y-4 text-left max-w-md mx-auto">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#8C6A48]">
            Next Step: Confirm on WhatsApp
          </h3>
          <p className="text-xs text-[#4A3326] leading-relaxed font-light">
            If your WhatsApp did not open automatically, click the button below to connect with our hair concierge. We will confirm item availability, dispatch timeframe, and delivery logistics with you immediately.
          </p>
          <a
            href={orderCompleted.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Open WhatsApp Chat Now</span>
          </a>
        </div>

        <button
          onClick={() => onNavigate('/')}
          className="text-xs uppercase tracking-wider text-[#8C6A48] hover:text-[#291C16] underline underline-offset-4"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('/cart')}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#8C6A48] hover:text-[#291C16] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Shopping Bag</span>
      </button>

      {/* Main Title */}
      <div className="border-b border-[#EAE2D7] pb-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block mb-1">
          Direct Concierge Order
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#291C16]">
          Luxury Hair Checkout
        </h1>
        <p className="text-xs text-[#6B5344] font-light mt-1">
          Provide your delivery details. Your order will be confirmed directly on WhatsApp with our team.
        </p>
      </div>

      <form onSubmit={handleOrderViaWhatsApp} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Form: Delivery Information (Span 7) */}
        <div className="lg:col-span-7 bg-white border border-[#EAE2D7] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-3">
            <h2 className="font-serif text-xl text-[#291C16] font-semibold">
              Recipient & Delivery Information
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-[#8C6A48]">
              <Lock className="w-3 h-3" />
              <span>Direct Concierge</span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Lady Chidinma Okonkwo"
                className="w-full px-4 py-2.5 bg-[#FBF9F5] border border-[#EAE2D7] text-xs text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
              />
            </div>

            {/* Phone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 08012345678"
                  className="w-full px-4 py-2.5 bg-[#FBF9F5] border border-[#EAE2D7] text-xs text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                  WhatsApp Number (if different)
                </label>
                <input
                  type="tel"
                  value={whatsAppNumber}
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                  placeholder="e.g. 08012345678"
                  className="w-full px-4 py-2.5 bg-[#FBF9F5] border border-[#EAE2D7] text-xs text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
                />
              </div>
            </div>

            {/* Delivery Location */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Delivery Location (Street Address, City, State) *
              </label>
              <textarea
                required
                rows={3}
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="e.g. House 14, Admiralty Way, Lekki Phase 1, Lagos State"
                className="w-full px-4 py-2.5 bg-[#FBF9F5] border border-[#EAE2D7] text-xs text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
              />
            </div>

            {/* Optional Customer Note */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Special Requests or Custom Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="e.g. Please pre-pluck hairline more or include extra silk wrapping paper..."
                className="w-full px-4 py-2.5 bg-[#FBF9F5] border border-[#EAE2D7] text-xs text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
              />
            </div>

          </div>

          <div className="pt-2 text-[11px] text-[#8C6A48] font-light leading-relaxed">
            * By clicking <strong>Order via WhatsApp</strong>, your order will be registered in our database and you will be connected to our verified official WhatsApp line for payment instructions and dispatch tracking.
          </div>
        </div>

        {/* Right Summary: Items & WhatsApp Submit (Span 5) */}
        <div className="lg:col-span-5 bg-white border border-[#EAE2D7] p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl text-[#291C16] font-semibold border-b border-[#F4EFEA] pb-3">
            Review Order ({cart.length} items)
          </h2>

          {/* Items breakdown */}
          <div className="divide-y divide-[#F4EFEA] max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="py-3 flex gap-3 items-center justify-between">
                <div className="flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-14 object-cover bg-[#F4EFEA] border border-[#EAE2D7] shrink-0"
                  />
                  <div>
                    <h4 className="font-serif text-xs font-semibold text-[#291C16] line-clamp-1">
                      {item.productName}
                    </h4>
                    <p className="text-[11px] text-[#8C6A48]">
                      {item.length} {item.color ? `· ${item.color}` : ''} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#291C16] tabular-nums">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-3 border-t border-[#F4EFEA] space-y-2 text-xs">
            <div className="flex justify-between text-[#6B5344]">
              <span>Subtotal</span>
              <span className="font-medium text-[#291C16] tabular-nums">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[#6B5344]">
              <span>Delivery Fee</span>
              <span className="text-[#8C6A48]">Calculated on WhatsApp</span>
            </div>
            <div className="pt-3 border-t border-[#F4EFEA] flex justify-between items-baseline">
              <span className="font-serif font-bold text-base text-[#291C16]">Total Order Value</span>
              <span className="font-sans font-bold text-xl text-[#291C16] tabular-nums">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Main Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-lg disabled:opacity-50"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>{isSubmitting ? 'Processing Order...' : 'ORDER VIA WHATSAPP'}</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#8C6A48] font-light">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Secure Direct Transaction Guarantee</span>
          </div>

        </div>

      </form>

    </div>
  );
};
