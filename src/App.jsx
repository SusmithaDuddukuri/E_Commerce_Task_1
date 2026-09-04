import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import MerchantDashboard from './components/MerchantDashboard';
import Toast from './components/Toast';
import CompareBar from './components/CompareBar';
import OrderHistory from './components/OrderHistory';
import SearchSuggestions from './components/SearchSuggestions';
import AuthModal from './components/AuthModal';
import AccountPortal from './components/AccountPortal';
import RoleDashboard from './components/RoleDashboard';
import { INITIAL_PRODUCTS, CATEGORIES, searchProducts, filterProducts, sortProducts } from './data/productsData';
import { loadCart, saveCart, loadWishlist, saveWishlist, loadPrefs, savePrefs, loadOrders, saveOrders, saveRecentSearch, loadRecentSearches, loadUser, saveUser, loadRecentViewed, saveRecentViewed } from './utils/storage';
import { orderId } from './utils/formatters';
import { ArrowRight, BarChart3, ChevronRight, CircleDollarSign, Crown, Flame, Heart, Layers3, Leaf, PackageCheck, Percent, Sparkles, Star, TrendingUp, Zap } from 'lucide-react';

const CATEGORY_META = {
  All: { icon: Sparkles, text: 'Browse everything', accent: 'indigo' },
  Audio: { icon: Zap, text: 'Headphones, speakers & more', accent: 'cyan' },
  Wearables: { icon: Crown, text: 'Watches and smart devices', accent: 'amber' },
  'Home & Living': { icon: Leaf, text: 'Everyday essentials', accent: 'emerald' },
  Furniture: { icon: Layers3, text: 'Seating and storage', accent: 'rose' },
  Compute: { icon: BarChart3, text: 'Laptops and accessories', accent: 'violet' },
  Optics: { icon: Sparkles, text: 'Cameras, lenses & optical gear', accent: 'sky' },
  Accessories: { icon: PackageCheck, text: 'Useful add-ons and essentials', accent: 'slate' }
};

export default function App() {
  const [currentView, setCurrentView] = useState('storefront');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const prefs = loadPrefs();
    return prefs.darkMode !== false;
  });
  const [cartItems, setCartItems] = useState(() => {
    const stored = loadCart();
    return Array.isArray(stored) ? stored : [];
  });
  const [wishlistItems, setWishlistItems] = useState(() => loadWishlist() || []);
  const [orders, setOrders] = useState(() => loadOrders() || []);
  const [addedTracker, setAddedTracker] = useState({});
  const [compareIds, setCompareIds] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [user, setUser] = useState(() => loadUser());
  const [recentViewed, setRecentViewed] = useState(() => loadRecentViewed());
  const [toasts, setToasts] = useState([]);
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  const addToast = useCallback((title, message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev.slice(-4), { id, title, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4200);
  }, []);
  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  // Theme toggle — apply class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    savePrefs({ ...loadPrefs(), darkMode: isDarkMode });
  }, [isDarkMode]);

  useEffect(() => saveCart(cartItems), [cartItems]);
  useEffect(() => saveWishlist(wishlistItems), [wishlistItems]);
  useEffect(() => saveOrders(orders), [orders]);
  useEffect(() => {
    if (currentView !== 'storefront') return;
    const timer = setInterval(() => setSpotlightIndex(i => (i + 1) % Math.min(5, products.length)), 6500);
    return () => clearInterval(timer);
  }, [currentView, products.length]);

  const wishlistMap = useMemo(() => wishlistItems.reduce((a, item) => ({ ...a, [item.id]: true }), {}), [wishlistItems]);
  const filteredProducts = useMemo(() => {
    let list = searchProducts(searchQuery, products);
    list = filterProducts(list, {
      category: activeCategory,
      inStockOnly,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating: minRating || undefined
    });
    return sortProducts(list, sortBy);
  }, [products, searchQuery, activeCategory, inStockOnly, minRating, priceRange, sortBy]);

  const handleAddToCart = useCallback((product) => {
    if (!product || !product.inStock) return addToast('Unavailable', 'This item is currently out of stock.', 'error');
    setCartItems(prev => {
      const selectedColor = product.selectedColor || product.colors?.[0] || 'Default';
      const idx = prev.findIndex(i => i.id === product.id && i.selectedColor === selectedColor);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...prev, { ...product, quantity: 1, selectedColor }];
    });
    setAddedTracker(prev => ({ ...prev, [product.id]: true }));
    addToast('Added to cart', `${product.name} is in your bag.`);
    setTimeout(() => setAddedTracker(prev => ({ ...prev, [product.id]: false })), 1800);
  }, [addToast]);

  const handleToggleWishlist = useCallback((product) => {
    setWishlistItems(prev =>
      prev.some(i => i.id === product.id) ? prev.filter(i => i.id !== product.id) : [...prev, product]
    );
    addToast(wishlistMap[product.id] ? 'Removed from saved' : 'Saved for later', product.name);
  }, [addToast, wishlistMap]);

  const handleMoveWishlistToCart = useCallback(
    (product) => {
      handleAddToCart(product);
      setWishlistItems(prev => prev.filter(i => i.id !== product.id));
    },
    [handleAddToCart]
  );

  const handleUpdateQuantity = useCallback((id, selectedColor, newQty) => {
    if (newQty <= 0) return setCartItems(prev => prev.filter(i => !(i.id === id && i.selectedColor === selectedColor)));
    setCartItems(prev =>
      prev.map(i => (i.id === id && i.selectedColor === selectedColor ? { ...i, quantity: newQty } : i))
    );
  }, []);

  const handleRemoveItem = useCallback(
    (id, selectedColor) => setCartItems(prev => prev.filter(i => !(i.id === id && i.selectedColor === selectedColor))),
    []
  );

  const handleAddReview = useCallback(
    (productId, review) => {
      setProducts(prev =>
        prev.map(p =>
          p.id === productId
            ? { ...p, reviews: [review, ...(p.reviews || [])], reviewsCount: (p.reviewsCount || 0) + 1 }
            : p
        )
      );
      setSelectedProduct(prev =>
        prev && prev.id === productId
          ? { ...prev, reviews: [review, ...(prev.reviews || [])], reviewsCount: (prev.reviewsCount || 0) + 1 }
          : prev
      );
      addToast('Review posted', 'Thanks for the feedback.');
    },
    [addToast]
  );

  const handleCompleteOrder = useCallback(
    (payload) => {
      if (!cartItems.length) return;
      const shipping = payload?.shipping || payload || {};
      const subtotal = payload?.subtotal ?? cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
      const tax = payload?.tax ?? subtotal * 0.08;
      const discount = payload?.discount || 0;
      const shippingCost = payload?.shippingCost || 0;
      const total = payload?.total ?? subtotal + tax + shippingCost - discount;
      const order = {
        id: orderId(),
        createdAt: new Date().toISOString(),
        items: cartItems,
        subtotal,
        tax,
        discount,
        shippingCost,
        total,
        status: 'CONFIRMED',
        trackingStatus: 'Confirmed',
        trackingNumber: `TRK${Math.floor(Math.random() * 1e8)}`,
        carrier: 'Aura Logistics',
        shipping,
        shippingMethod: payload?.shippingMethod || 'standard',
        paymentId: payload?.paymentId || 'cod',
        coupon: payload?.coupon || null,
        userId: user?.id || null
      };
      setOrders(prev => [order, ...prev].slice(0, 40));
      setCartItems([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      addToast('Order confirmed', `${order.id} is being prepared.`);
    },
    [cartItems, addToast, user]
  );

  const handleReorder = useCallback((order) => {
    let added = 0;
    (order.items || []).forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product && product.inStock !== false) {
        handleAddToCart({ ...product, selectedColor: item.selectedColor });
        added += 1;
      }
    });
    if (added) {
      setIsCartOpen(true);
      addToast('Reorder', `${added} item(s) added to cart.`);
    } else {
      addToast('Unavailable', 'Those products are currently unavailable.', 'error');
    }
  }, [products, handleAddToCart, addToast]);

  const handleCancelOrder = useCallback((orderIdToCancel) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderIdToCancel
          ? { ...o, status: 'CANCELLED', trackingStatus: 'Cancelled' }
          : o
      )
    );
    addToast('Order cancelled', orderIdToCancel);
  }, [addToast]);

  const openProduct = useCallback((product) => {
    setSelectedProduct(product);
    if (!product?.id) return;
    setRecentViewed((prev) => {
      const next = [product.id, ...prev.filter((id) => id !== product.id)].slice(0, 12);
      saveRecentViewed(next);
      return next;
    });
  }, []);

  const toggleCompare = useCallback(
    (id) =>
      setCompareIds(prev =>
        prev.includes(id)
          ? prev.filter(x => x !== id)
          : prev.length >= 4
            ? (addToast('Compare limit', 'You can compare up to four products.', 'info'), prev)
            : [...prev, id]
      ),
    [addToast]
  );

  const cartCount = cartItems.reduce((a, i) => a + (i.quantity || 0), 0);
  const spotlightProduct = products[spotlightIndex % products.length];
  const trending = products.filter(p => p.inStock).slice(0, 4);
  const categoryCards = CATEGORIES.filter(c => c !== 'All')
    .map(category => ({ category, ...CATEGORY_META[category] }))
    .filter(x => x.icon);

  const scrollToCatalog = () =>
    document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Category navigation is centralized so every category entry (navbar, mobile menu,
  // and storefront tiles) produces the same filtered catalog instead of relying on
  // stale filters/search state or scrolling before React has rendered the new list.
  const navigateToCategory = useCallback((category) => {
    setActiveCategory(category);
    setSearchQuery('');
    setInStockOnly(false);
    setMinRating(0);
    setPriceRange([0, 2000]);
    setSortBy('featured');
    setShowSuggestions(false);
    setCurrentView('storefront');
    setTimeout(() => document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 180);
  }, []);

  return (
    <div className="app-shell min-h-screen text-slate-900 dark:text-slate-100">
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={navigateToCategory}
        categories={CATEGORIES}
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
        wishlistCount={wishlistItems.length}
        setIsWishlistOpen={setIsWishlistOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setShowSuggestions(Boolean(q));
        }}
        onSearchSubmit={(q) => {
          const term = (q || '').trim();
          if (term) saveRecentSearch(term);
          setSearchQuery(term);
          setShowSuggestions(false);
          setCurrentView('storefront');
          setTimeout(() => {
            document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
        }}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenOrders={() => setIsOrdersOpen(true)}
        ordersCount={orders.length}
        user={user}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onNewArrivals={() => { setSortBy('newest'); setCurrentView('storefront'); setTimeout(scrollToCatalog, 50); }}
        onLogout={() => { saveUser(null); setUser(null); setCurrentView('storefront'); setIsAccountOpen(false); addToast('Signed out', 'See you next time.'); }}
      />

      {showSuggestions && (
        <SearchSuggestions
          query={searchQuery}
          products={products}
          recent={loadRecentSearches()}
          onSelect={(term) => {
            setSearchQuery(term);
            setShowSuggestions(false);
          }}
          onClose={() => setShowSuggestions(false)}
        />
      )}

      <main>
        {currentView === 'storefront' ? (
          <>
            <HeroBanner
              onExplore={scrollToCatalog}
              featuredProduct={spotlightProduct}
              onQuickView={openProduct}
              onAddToCart={handleAddToCart}
            />

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20">
              <div className="quick-panel">
                <div className="flex items-center gap-3">
                  <div className="icon-orb">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Status</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {cartCount
                        ? `${cartCount} item${cartCount > 1 ? 's' : ''} in cart`
                        : 'Ready to shop'}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    <b className="text-slate-900 dark:text-white">{products.length}</b> products
                  </span>
                  <span>
                    <b className="text-slate-900 dark:text-white">
                      {products.filter(p => p.inStock).length}
                    </b>{' '}
                    in stock
                  </span>
                  <span>
                    <b className="text-slate-900 dark:text-white">{wishlistItems.length}</b> saved
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:underline flex items-center gap-1"
                >
                  View cart <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Categories</p>
                  <h2>
                    Shop by <span className="gradient-text">category</span>
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={scrollToCatalog}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {categoryCards.map(({ category, icon: Icon, text }) => {
                  const count = products.filter(p => p.category === category).length;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => navigateToCategory(category)}
                      className="category-tile group"
                    >
                      <div className="category-icon">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{category}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{text}</p>
                      </div>
                      <span className="category-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="feature-strip">
                <div>
                  <p className="eyebrow">Offer</p>
                  <h3>
                    Get <span className="text-amber-600 dark:text-amber-300">15% off</span> your first order
                  </h3>
                  <p>
                    Use code <b className="text-slate-900 dark:text-white">AURA15</b> at checkout. Cart is saved in
                    your browser.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="feature-pill">
                    <PackageCheck className="w-3.5 h-3.5" /> Free shipping over $300
                  </span>
                  <span className="feature-pill">
                    <Percent className="w-3.5 h-3.5" /> Member pricing
                  </span>
                </div>
              </div>
            </section>

            <div id="catalog-grid">
              <ProductGrid
                products={filteredProducts}
                onSelectProduct={openProduct}
                onAddToCart={handleAddToCart}
                addedItems={addedTracker}
                wishlistMap={wishlistMap}
                onToggleWishlist={handleToggleWishlist}
                sortBy={sortBy}
                setSortBy={setSortBy}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                minRating={minRating}
                setMinRating={setMinRating}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                compareIds={compareIds}
                onToggleCompare={toggleCompare}
                totalCatalog={products.length}
                searchQuery={searchQuery}
                onSearchChange={(q) => setSearchQuery(q)}
              />
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Popular</p>
                  <h2>
                    Trending <span className="gradient-text">right now</span>
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSortBy('rating')}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                >
                  Top rated <Star className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                {trending.map((p, index) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => openProduct(p)}
                    className="mini-product group text-left"
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <img src={p.image} alt={p.name} />
                      <span className="mini-rank">0{index + 1}</span>
                      <span className="mini-view">Quick view</span>
                    </div>
                    <div className="pt-3">
                      <p className="text-[10px] uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                        {p.category}
                      </p>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-1 truncate">
                        {p.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-slate-900 dark:text-white">${p.price}</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {p.rating}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="trust-grid">
                {[
                  ['Local-first', 'Cart, wishlist and orders stay in your browser.', CircleDollarSign],
                  ['Two-year warranty', 'Coverage across the whole collection.', Crown],
                  ['Fast & responsive', 'Works well on phone, tablet and desktop.', Zap],
                  ['Easy support', 'Questions and returns without the runaround.', Heart]
                ].map(([title, text, Icon]) => (
                  <div key={title} className="trust-card">
                    <Icon className="w-5 h-5 text-indigo-500 dark:text-indigo-300 shrink-0" />
                    <div>
                      <h4>{title}</h4>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : currentView === 'about' ? (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="glass-panel rounded-2xl p-8 md:p-12">
              <p className="eyebrow">About AURA</p>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mt-2">A modern commerce experience built around clarity.</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-5 max-w-3xl leading-7">AURA brings products, orders, customer accounts and merchant operations into one clean commerce platform. Browse the catalog, save products, place orders and manage your account from one place.</p>
              <div className="grid md:grid-cols-3 gap-4 mt-10">
                {[['Customer first','Simple discovery, transparent order status and account tools.'],['Reliable operations','Inventory, fulfillment and support workflows are organized by role.'],['Secure by design','Each workspace exposes only the actions relevant to the signed-in role.']].map(([t,d])=><div className="glass-card rounded-xl p-5" key={t}><h3 className="font-semibold text-slate-900 dark:text-white">{t}</h3><p className="text-sm text-slate-500 mt-2 leading-6">{d}</p></div>)}
              </div>
              <button type="button" className="primary-cta mt-8" onClick={() => { setCurrentView('storefront'); setTimeout(scrollToCatalog,50); }}>Start shopping <ArrowRight className="w-4 h-4"/></button>
            </div>
          </section>
        ) : (
          user?.role === 'merchant' ? <MerchantDashboard onTriggerToast={addToast} /> : <RoleDashboard user={user || {name:'Guest',email:'',role:'customer'}} orders={orders} wishlistCount={wishlistItems.length} onStore={() => setCurrentView('storefront')} onLogout={() => { saveUser(null); setUser(null); setCurrentView('storefront'); addToast('Signed out','See you next time.'); }} onToast={addToast} />
        )}
      </main>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onAddReview={handleAddReview}
        isWishlisted={selectedProduct ? !!wishlistMap[selectedProduct.id] : false}
        onToggleWishlist={handleToggleWishlist}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          if (!cartItems.length) return addToast('Empty cart', 'Add something first.', 'error');
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={(id) => setWishlistItems(prev => prev.filter(i => i.id !== id))}
        onMoveToCart={handleMoveWishlistToCart}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onCompleteOrder={handleCompleteOrder}
        user={user}
      />
      <OrderHistory isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} orders={orders} />
      <CompareBar
        compareIds={compareIds}
        products={products}
        onClear={() => setCompareIds([])}
        onRemove={(id) => setCompareIds(prev => prev.filter(x => x !== id))}
        onSelectProduct={openProduct}
      />
      <AuthModal
        open={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuth={(session) => {
          setUser(session);
          setCurrentView(session.role && session.role !== 'customer' ? 'dashboard' : 'storefront');
          addToast('Welcome', `${session.name || session.email} · ${session.role || 'customer'}`);
        }}
      />
      <AccountPortal
        open={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        onUpdateUser={setUser}
        onLogout={() => {
          saveUser(null);
          setUser(null);
          setIsAccountOpen(false);
          addToast('Signed out', 'See you next time.');
        }}
        orders={orders}
        wishlistCount={wishlistItems.length}
        onReorder={handleReorder}
        onCancelOrder={handleCancelOrder}
        onToast={addToast}
      />
      <Toast toasts={toasts} onDismiss={removeToast} />

      <footer className="footer-aura">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold tracking-wide text-slate-900 dark:text-white">
              AURA <span className="text-indigo-600 dark:text-indigo-300">Shop</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">AURA Commerce · 2026</p>
          </div>
          <p className="text-[11px] text-slate-500">AURA Commerce · Customer and business services</p>
          <div className="flex gap-4 text-[11px] text-slate-500">
            <button
              type="button"
              onClick={() => addToast('Privacy', 'Demo data is stored only in your browser.', 'info')}
              className="hover:text-slate-800 dark:hover:text-slate-300"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('about')}
              className="hover:text-slate-800 dark:hover:text-slate-300"
            >
              About
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
