import React from 'react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';

interface CartPageProps {
  onNavigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const { settings } = useSettings();

  const freeDeliveryThreshold = settings.freeDeliveryThreshold || 400000;
  const remainingForFreeDelivery = freeDeliveryThreshold - subtotal;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#F4EFEA] flex items-center justify-center text-[#8C6A48] mx-auto">
          <ShoppingBag className="w-10 h-10 stroke-[1.2]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-[#291C16]">Your Shopping Bag is Empty</h1>
          <p className="text-xs sm:text-sm text-[#6B5344] font-light max-w-md mx-auto">
            You haven't selected any luxury hair items yet. Explore our Vietnamese bone straight collections and discover your next statement look.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-8 py-3.5 bg-[#291C16] text-[#FDFCF7] text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#4A3326] transition-colors"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Title */}
      <div className="border-b border-[#EAE2D7] pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#291C16]">
            Your Shopping Bag
          </h1>
          <p className="text-xs text-[#8C6A48] mt-1 font-light">
            Review your selected hair bundles, lengths, and custom units.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/shop')}
          className="text-xs uppercase tracking-wider text-[#8C6A48] hover:text-[#291C16] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {/* Free Shipping Alert */}
      {remainingForFreeDelivery > 0 ? (
        <div className="p-4 bg-[#F4EFEA] border border-[#D6C2A7] text-xs text-[#4A3326] flex items-center gap-3">
          <Truck className="w-5 h-5 text-[#8C6A48] shrink-0" />
          <span>
            Add <strong className="tabular-nums font-semibold">₦{remainingForFreeDelivery.toLocaleString()}</strong> more to your order to unlock complimentary VIP same-day dispatch.
          </span>
        </div>
      ) : (
        <div className="p-4 bg-[#EBE3D8] border border-[#8C6A48] text-xs text-[#291C16] flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <span className="font-medium">
            Congratulations! Your luxury order qualifies for complimentary VIP dispatch.
          </span>
        </div>
      )}

      {/* Cart Content: Items (Left 8) + Summary (Right 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-8 bg-white border border-[#EAE2D7] divide-y divide-[#EAE2D7]">
          {cart.map((item) => (
            <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
              
              <div className="flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.productName}
                  referrerPolicy="no-referrer"
                  className="w-20 h-24 sm:w-24 sm:h-28 object-cover bg-[#F4EFEA] border border-[#EAE2D7] shrink-0"
                />

                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-[#8C6A48] font-medium block">
                    {item.categoryName || 'Luxury Hair'}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-[#291C16]">
                    {item.productName}
                  </h3>
                  <div className="text-xs text-[#6B5344] font-light flex items-center gap-2">
                    <span>Length: <strong className="font-medium text-[#291C16]">{item.length}</strong></span>
                    {item.color && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Color: <strong className="font-medium text-[#291C16]">{item.color}</strong></span>
                      </>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#291C16] block pt-1 tabular-nums">
                    ₦{item.price.toLocaleString()} each
                  </span>
                </div>
              </div>

              {/* Quantity and Line Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-[#F4EFEA]">
                
                {/* Stepper */}
                <div className="flex items-center border border-[#D6C2A7] bg-white">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-[#4A3326] hover:bg-[#F4EFEA] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-semibold text-[#291C16] tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 text-[#4A3326] hover:bg-[#F4EFEA] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <span className="font-sans text-sm sm:text-base font-semibold text-[#291C16] tabular-nums min-w-[90px] text-right">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </span>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-[#8C6A48] hover:text-red-700 p-1"
                  title="Remove from bag"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-white border border-[#EAE2D7] p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl text-[#291C16] font-semibold border-b border-[#F4EFEA] pb-4">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-[#6B5344]">
              <span>Items Total ({totalItems})</span>
              <span className="font-medium text-[#291C16] tabular-nums">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[#6B5344]">
              <span>Courier Delivery</span>
              <span className="text-[#8C6A48]">Confirmed on WhatsApp</span>
            </div>
            <div className="flex justify-between text-[#6B5344]">
              <span>Pre-dispatch Video Inspection</span>
              <span className="text-emerald-700 font-medium">Included Complimentary</span>
            </div>

            <div className="pt-4 border-t border-[#F4EFEA] flex justify-between text-sm">
              <span className="font-serif font-bold text-[#291C16]">Estimated Total</span>
              <span className="font-sans font-bold text-lg text-[#291C16] tabular-nums">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onNavigate('/checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-4 bg-[#291C16] hover:bg-[#4A3326] text-[#FDFCF7] text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-[#8C6A48] text-center font-light leading-relaxed">
            Direct WhatsApp ordering & payment verification is standard. No credit card required upfront.
          </p>
        </div>

      </div>

    </div>
  );
};
