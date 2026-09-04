import React from 'react';
import { Star, Plus, Eye, Check, Heart, SlidersHorizontal, ArrowUpDown, GitCompare, Zap } from 'lucide-react';

export default function ProductGrid({ 
  products, 
  onSelectProduct, 
  onAddToCart,
  addedItems,
  wishlistMap,
  onToggleWishlist,
  sortBy,
  setSortBy,
  inStockOnly,
  setInStockOnly,
  minRating = 0,
  setMinRating,
  priceRange = [0, 2000],
  setPriceRange,
  compareIds = [],
  onToggleCompare,
  totalCatalog = 0,
  searchQuery = '',
  onSearchChange
}) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center glass-panel max-w-xl mx-auto rounded-2xl my-12">
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">No products match your filters.</p>
        <p className="text-slate-500 dark:text-slate-600 text-xs mt-1">Try clearing search or changing filters.</p>
      </div>
    );
  }

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Sorting & Filter Controls Header */}
      <div className="mb-4"><input id="catalog-search" type="search" placeholder="Search products..." aria-label="Search products" className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none" onChange={(e)=>onSearchChange?.(e.target.value)}/></div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">All products</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Showing {products.length} of {totalCatalog || products.length}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* In Stock Only Checkbox */}
          <label className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer glass-pill px-3 py-1.5 rounded-lg">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <span>In stock only</span>
          </label>

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center glass-pill px-3 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-2"
            >
              <option value="featured" className="bg-white dark:bg-slate-900">Featured</option>
              <option value="price-asc" className="bg-white dark:bg-slate-900">Price: Low to High</option>
              <option value="price-desc" className="bg-white dark:bg-slate-900">Price: High to Low</option>
              <option value="rating" className="bg-white dark:bg-slate-900">Highest Rated</option>
              <option value="newest" className="bg-white dark:bg-slate-900">Newest</option>
              <option value="discount" className="bg-white dark:bg-slate-900">Biggest Discount</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-mono pl-1">{products.length}</span>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {products.map((product) => {
          const isAdded = addedItems[product.id];
          const isWishlisted = wishlistMap[product.id];

          return (
            <div
              key={product.id}
              className="group glass-card rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-indigo-500/40 transition-all duration-200 flex flex-col justify-between product-card-glow"
            >
              {/* Top Image Container */}
              <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />

                {/* Top Badge & Wishlist Heart */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold tracking-wide uppercase text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 pointer-events-auto">
                    {product.badge}
                  </span>

                  <div className="flex items-center gap-2 pointer-events-auto">
                    <button type="button"
                      onClick={() => onToggleCompare?.(product.id)}
                      className={`p-2 rounded-full backdrop-blur-md border transition-all shadow-md ${compareIds.includes(product.id) ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'}`}
                      title={compareIds.includes(product.id) ? 'Remove from compare' : 'Compare product'}
                    >
                      <GitCompare className="w-4 h-4" />
                    </button>
                    <button type="button"
                    onClick={() => onToggleWishlist(product)}
                    className={`p-2 rounded-full backdrop-blur-md border transition-all pointer-events-auto shadow-md ${
                      isWishlisted 
                        ? 'bg-rose-500/20 border-rose-500 text-rose-500' 
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-rose-400'
                    }`}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                  </div>
                </div>

                {/* Hover Quick View Overlay */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center space-x-3">
                  <button type="button"
                    onClick={() => onSelectProduct(product)}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all flex items-center space-x-1.5 shadow-lg"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-mono text-[10px] tracking-wider uppercase text-indigo-600 dark:text-indigo-400">{product.category}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-700 dark:text-slate-200 text-[11px]">{product.rating}</span>
                      <span className="text-slate-500">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 
                    onClick={() => onSelectProduct(product)}
                    className="text-base font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {product.tagline}
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span>{product.inStock ? `${product.stockCount ?? 0} units available` : 'Currently unavailable'}</span>
                      {product.inStock && product.stockCount <= 8 && <span className="text-amber-600 dark:text-amber-300 font-semibold flex items-center gap-1"><Zap className="w-3 h-3" /> Selling fast</span>}
                    </div>
                    <div className="h-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"><div className={`h-full rounded-full ${product.stockCount <= 8 ? 'bg-amber-400' : 'bg-indigo-500'}`} style={{ width: `${Math.min(100, Math.max(10, ((product.stockCount ?? 0) / 35) * 100))}%` }} /></div>
                  </div>
                </div>

                {/* Footer Action & Price */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <button type="button"
                    onClick={() => onAddToCart(product)}
                    className={`p-2.5 rounded-full transition-all duration-200 shadow-md ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                    }`}
                    title={isAdded ? 'Added to Bag' : 'Add to Bag'}
                  >
                    {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
