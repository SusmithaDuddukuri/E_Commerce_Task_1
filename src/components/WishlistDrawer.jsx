import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onMoveToCart
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Saved Wishlist</h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
                {wishlistItems.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-slate-500">
                <Heart className="w-12 h-12 stroke-[1]" />
                <p className="text-sm font-medium">Your wishlist is currently empty.</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center space-x-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <span className="text-xs font-semibold text-indigo-300 mt-1 block">${item.price}</span>
                  </div>

                  <button
                    onClick={() => onMoveToCart(item)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white text-xs font-semibold flex items-center space-x-1"
                    title="Move to Shopping Bag"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(item.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            Items saved in your wishlist remain available during session.
          </div>

        </div>
      </div>
    </div>
  );
}
