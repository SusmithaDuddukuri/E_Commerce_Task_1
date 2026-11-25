import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, ShoppingBag, Clock3 } from 'lucide-react';

export default function HeroBanner({ onExplore, featuredProduct, onQuickView, onAddToCart }) {
  const [seconds, setSeconds] = useState(8 * 60 + 42);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 8 * 60 + 42)), 1000);
    return () => clearInterval(timer);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <section className="relative overflow-hidden border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-transparent">
      <div className="hero-grid absolute inset-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:pt-14 lg:pb-16">
        <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-indigo-400/30 text-xs text-slate-600 dark:text-indigo-200">
              <span className="live-dot" />
              <span>New arrivals · limited stock</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-slate-900 dark:text-white">
                Thoughtful products for everyday life
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300/90">
                Audio, wearables, furniture and tools — curated so you can find something that actually fits your routine.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={onExplore} className="primary-cta group">
                <span>Shop the collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                type="button"
                onClick={() => featuredProduct && onQuickView(featuredProduct)}
                className="secondary-cta"
              >
                Preview featured
              </button>
            </div>

            <div className="grid grid-cols-3 max-w-md gap-3 pt-1">
              {[
                ['Free returns', '30 days'],
                ['Warranty', '2 years'],
                ['Shipping', 'From $0']
              ].map(([label, value]) => (
                <div key={label} className="stat-chip">
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {featuredProduct && (
            <div className="relative">
              <div className="spotlight-card">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="spotlight-image"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-indigo-200 mb-1">
                        {featuredProduct.category}
                      </p>
                      <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                        {featuredProduct.name}
                      </h2>
                      {featuredProduct.tagline && (
                        <p className="text-xs text-slate-300 mt-1 line-clamp-1">{featuredProduct.tagline}</p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-lg font-bold text-white">${featuredProduct.price}</span>
                        {featuredProduct.originalPrice && (
                          <span className="text-xs line-through text-slate-400">
                            ${featuredProduct.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddToCart(featuredProduct)}
                      className="w-11 h-11 rounded-xl bg-white text-slate-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shrink-0"
                      title="Add to cart"
                      aria-label="Add featured product to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="floating-offer">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                  <Clock3 className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Offer ends in
                  </p>
                  <p className="font-mono font-semibold text-slate-900 dark:text-white">
                    00:{mm}:{ss}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> 2-year warranty
          </span>
          <span className="inline-flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" /> Fast dispatch
          </span>
        </div>
      </div>
    </section>
  );
}
