import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, Package, User, ShoppingBag, Sun, Moon, Store, ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar({
  activeCategory, setActiveCategory, categories, cartCount, setIsCartOpen,
  wishlistCount, setIsWishlistOpen, currentView, setCurrentView,
  searchQuery, setSearchQuery, onSearchSubmit, isDarkMode, setIsDarkMode,
  onOpenOrders, ordersCount = 0, user = null, onOpenAccount, onOpenAuth, onNewArrivals, onLogout
}) {
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setShopOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const go = (view) => { setCurrentView(view); setShopOpen(false); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const shop = categories.filter(c => c !== 'All');
  const iconBtn = 'relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition';
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <button type="button" onClick={() => go('storefront')} className="shrink-0 flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">AURA</span>
          <span className="hidden sm:inline text-[9px] uppercase tracking-widest text-indigo-600 dark:text-indigo-300">Commerce</span>
        </button>

        <nav className="hidden lg:flex items-center gap-1 ml-3">
          <button onClick={() => go('storefront')} className={`nav-link ${currentView === 'storefront' ? 'nav-link-active' : ''}`}>Home</button>
          <div className="relative" ref={ref}>
            <button type="button" onClick={() => setShopOpen(v => !v)} className="nav-link inline-flex items-center gap-1">
              Products <ChevronDown className={`w-3.5 h-3.5 transition-transform ${shopOpen ? 'rotate-180' : ''}`} />
            </button>
            {shopOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-2 z-[100]">
                <button className="dropdown-item" onClick={() => { setActiveCategory('All'); go('storefront'); }}>All products</button>
                {shop.map(cat => <button key={cat} className="dropdown-item" onClick={() => { setActiveCategory(cat); go('storefront'); }}>{cat}</button>)}
              </div>
            )}
          </div>
          <button onClick={() => { onNewArrivals?.(); go('storefront'); }} className="nav-link">New Arrivals</button>
          <button onClick={() => go('about')} className={`nav-link ${currentView === 'about' ? 'nav-link-active' : ''}`}>About</button>
        </nav>

        <div className="flex-1" />
        {currentView === 'storefront' && <form onSubmit={(e) => { e.preventDefault(); onSearchSubmit?.(searchQuery); }} className="hidden xl:block w-56">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30" />
        </form>}
        <div className="flex items-center gap-0.5">
          {currentView === 'storefront' && <>
            <button className={iconBtn} title="Search" onClick={() => document.getElementById('catalog-search')?.focus()}><Search className="w-[18px]" /></button>
            <button className={iconBtn} title="Wishlist" onClick={() => setIsWishlistOpen(true)}><Heart className="w-[18px]" />{wishlistCount > 0 && <Badge n={wishlistCount} />}</button>
            <button className={iconBtn} title="Orders" onClick={onOpenOrders}><Package className="w-[18px]" />{ordersCount > 0 && <Badge n={ordersCount} />}</button>
            <button className={iconBtn} title={isDarkMode ? 'Light theme' : 'Dark theme'} onClick={() => setIsDarkMode(!isDarkMode)}>{isDarkMode ? <Sun className="w-[18px]" /> : <Moon className="w-[18px]" />}</button>
          </>}
          <button className={iconBtn} title={user ? 'Account' : 'Sign in'} onClick={() => user ? onOpenAccount?.() : onOpenAuth?.()}><User className="w-[18px]" /></button>
          {user && <button className="hidden lg:inline-flex h-9 px-3 items-center gap-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200" onClick={() => go('dashboard')}><Store className="w-3.5" />Dashboard</button>}
          {currentView === 'storefront' && <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900" title="Cart" onClick={() => setIsCartOpen(true)}><ShoppingBag className="w-[18px]" />{cartCount > 0 && <Badge n={cartCount} invert />}</button>}
          <button className="lg:hidden h-10 w-10 inline-flex items-center justify-center" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">{mobileOpen ? <X /> : <Menu />}</button>
        </div>
      </div>
      {mobileOpen && <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-1">
        <MobileLink label="Home" onClick={() => go('storefront')} />
        <MobileLink label="All Products" onClick={() => { setActiveCategory('All'); go('storefront'); }} />
        {shop.map(cat => <MobileLink key={cat} label={cat} onClick={() => { setActiveCategory(cat); go('storefront'); }} />)}
        <MobileLink label="New Arrivals" onClick={() => { onNewArrivals?.(); go('storefront'); }} />
        <MobileLink label="About" onClick={() => go('about')} />
        {user && <MobileLink label="Dashboard" onClick={() => go('dashboard')} />}
        {user && <MobileLink label="Sign out" onClick={onLogout} />}
      </div>}
    </header>
  );
}
function Badge({ n, invert }) { return <span className={`absolute -right-0.5 -top-0.5 min-w-4 h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center ${invert ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white'}`}>{n > 99 ? '99+' : n}</span>; }
function MobileLink({ label, onClick }) { return <button onClick={onClick} className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900">{label}</button>; }
