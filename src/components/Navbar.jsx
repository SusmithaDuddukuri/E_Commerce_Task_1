import React from 'react';

export default function Navbar({
  activeCategory,
  setActiveCategory,
  categories,
  cartCount,
  setIsCartOpen,
  wishlistCount,
  setIsWishlistOpen,
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  isDarkMode,
  setIsDarkMode,
  onOpenOrders,
  ordersCount = 0,
  user = null,
  onOpenAccount,
  onOpenAuth
}) {
  const goStorefront = () => {
    setCurrentView('storefront');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={goStorefront}
            className="flex items-center gap-2 text-left shrink-0"
          >
            <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              AURA
            </span>
            <span className="hidden sm:inline text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5">
              Shop
            </span>
          </button>

          {currentView === 'storefront' && (
            <nav className="hidden md:flex items-center gap-0.5 pl-3 border-l border-slate-200 dark:border-slate-800 overflow-x-auto max-w-[42vw] lg:max-w-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Search */}
        {currentView === 'storefront' && (
          <div className="flex-1 max-w-sm hidden md:block">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit?.(searchQuery);
              }}
              className="relative"
            >
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/40 dark:focus:ring-slate-500/40 focus:border-slate-300 dark:focus:border-slate-600"
              />
            </form>
          </div>
        )}

        {/* Actions — text only */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? 'Light' : 'Dark'}
          </button>

          {currentView === 'storefront' && (
            <>
              <button
                type="button"
                onClick={onOpenOrders}
                className="relative px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                title="Order history"
              >
                Orders
                {ordersCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-slate-700 text-white text-[9px] font-semibold">
                    {ordersCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                className="relative px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                title="Wishlist"
              >
                Saved
                {wishlistCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => (user ? onOpenAccount?.() : onOpenAuth?.())}
            className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            title={user ? 'My account' : 'Sign in'}
          >
            {user ? (user.name?.split(' ')[0] || 'Account') : 'Sign in'}
          </button>

          <button
            type="button"
            onClick={() => setCurrentView(currentView === 'storefront' ? 'dashboard' : 'storefront')}
            className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {currentView === 'storefront' ? 'Merchant' : 'Store'}
          </button>

          {currentView === 'storefront' && (
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity"
              aria-label="Shopping cart"
            >
              Cart
              {cartCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile category bar */}
      {currentView === 'storefront' && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto">
          <div className="flex items-center gap-1 px-4 py-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
