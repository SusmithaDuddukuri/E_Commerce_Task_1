import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Shield } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount);
  const tax = (subtotal - discountAmount) * 0.08;
  const shipping = subtotal > 300 || subtotal === 0 ? 0 : 25;
  const total = subtotal - discountAmount + tax + shipping;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'AURA20') {
      setDiscount(0.20);
      setPromoApplied(true);
    } else if (promoCode.trim().toUpperCase() === 'VIP') {
      setDiscount(0.15);
      setPromoApplied(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Shopping Bag</h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
                {cartItems.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-slate-500">
                <ShoppingBag className="w-12 h-12 stroke-[1]" />
                <p className="text-sm font-medium">Your shopping bag is currently empty.</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                >
                  Browse Collection
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={`${item.id}-${item.selectedColor}`}
                  className="flex items-center space-x-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                    {item.selectedColor && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.selectedColor}</p>
                    )}
                    <span className="text-xs font-semibold text-indigo-300 mt-1 block">${item.price}</span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 bg-slate-950 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.selectedColor, item.quantity - 1)}
                      className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white px-1">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.selectedColor, item.quantity + 1)}
                      className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id, item.selectedColor)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 space-y-4 bg-slate-50 dark:bg-slate-900/50 dark:bg-slate-950/80">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. AURA20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white uppercase placeholder:normal-case placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  Apply
                </button>
              </form>

              {promoApplied && (
                <div className="text-[11px] text-emerald-400 flex items-center justify-between">
                  <span>Promo Code Applied ({(discount * 100)}% OFF)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              {/* Price Table */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Express Shipping</span>
                  <span className="text-slate-900 dark:text-white">{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total</span>
                  <span className="text-indigo-400">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-slate-900 dark:text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-500">
                <Shield className="w-3 h-3 text-emerald-500" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
