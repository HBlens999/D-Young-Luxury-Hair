import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { generateWhatsAppOrderUrl } from '../../lib/supabase';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems, isCartDrawerOpen, setIsCartDrawerOpen } = useCart();
  const { settings } = useSettings();

  if (!isCartDrawerOpen) return null;

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    onNavigate('/checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueShopping = () => {
    setIsCartDrawerOpen(false);
  };

  const handleQuickWhatsAppOrder = () => {
    const url = generateWhatsAppOrderUrl(
      settings.whatsAppNumber,
      'Direct Buyer',
      '[Pending Contact]',
      '[To be confirmed via WhatsApp]',
      cart,
      subtotal
    );
    window.open(url, '_blank');
  };

  const freeDeliveryDelta = (settings.freeDeliveryThreshold || 400000) - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1310]/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBF9F5] shadow-2xl flex flex-col border-l border-[#EAE2D7]">
          
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#EAE2D7] flex items-center justify-between bg-[#F4EFEA]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#291C16]" />
              <h2 className="font-serif text-lg font-bold tracking-wider text-[#291C16] uppercase">
                Shopping Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-[#4A3326] hover:text-[#291C16] focus:outline-none"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Incentive Banner */}
          {subtotal > 0 && (
            <div className="px-6 py-2.5 bg-[#EBE3D8] text-[11px] tracking-wider text-[#4A3326] text-center border-b border-[#D6C2A7]">
              {freeDeliveryDelta <= 0 ? (
                <span className="font-medium text-[#291C16]">
                  ✨ Qualified for Complimentary VIP Delivery across Nigeria!
                </span>
              ) : (
                <span>
                  Add <strong className="tabular-nums">₦{freeDeliveryDelta.toLocaleString()}</strong> more for Complimentary VIP Delivery.
                </span>
              )}
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 divide-y divide-[#EAE2D7]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#F4EFEA] flex items-center justify-center text-[#8C6A48]">
                  <ShoppingBag className="w-7 h-7 stroke-[1.2]" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-lg text-[#291C16]">Your luxury bag is empty</p>
                  <p className="text-xs text-[#8C6A48] max-w-xs font-light">
                    Explore our Vietnamese bone straight collections and custom wigs.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('/shop');
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#291C16] text-[#FBF9F5] text-xs uppercase tracking-widest font-medium hover:bg-[#4A3326] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover bg-[#F4EFEA] shrink-0 border border-[#EAE2D7]"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-sm font-semibold text-[#291C16] leading-snug">
                          {item.productName}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8C6A48] hover:text-red-700 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Metadata (Clean, Unboxed) */}
                      <p className="text-xs text-[#6B5344] mt-1 font-light">
                        Length: <span className="font-medium text-[#291C16]">{item.length}</span>
                        {item.color && (
                          <>
                            <span className="mx-1.5 text-[#D6C2A7]">·</span>
                            <span>{item.color}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#D6C2A7] bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-[#4A3326] hover:bg-[#F4EFEA] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-medium text-[#291C16] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-[#4A3326] hover:bg-[#F4EFEA] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-xs font-semibold text-[#291C16] tabular-nums">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="px-6 py-5 border-t border-[#EAE2D7] bg-[#F4EFEA] space-y-4">
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6B5344]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#291C16] text-sm tabular-nums">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-[#8C6A48] font-light">
                  Taxes and verified courier shipping calculated at WhatsApp confirmation.
                </p>
              </div>

              {/* Checkout CTAs */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-[#291C16] hover:bg-[#4A3326] text-[#FBF9F5] text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleQuickWhatsAppOrder}
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Instant WhatsApp Order</span>
                </button>

                <button
                  onClick={handleContinueShopping}
                  className="w-full py-2 text-center text-xs tracking-wider text-[#6B5344] hover:text-[#291C16] font-medium"
                >
                  Continue Browsing
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
