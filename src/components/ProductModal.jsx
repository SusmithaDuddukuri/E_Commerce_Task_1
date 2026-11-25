import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Check, Heart } from 'lucide-react';

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  onAddReview,
  isWishlisted,
  onToggleWishlist
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [added, setAdded] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || '');
      setActiveTab('overview');
      setAdded(false);
      setNewAuthor('');
      setNewRating(5);
      setNewComment('');
    }
  }, [product?.id]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart?.({ ...product, selectedColor });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleSave = () => {
    onToggleWishlist?.(product);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;
    onAddReview?.(product.id, {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      date: 'Just now',
      comment: newComment
    });
    setNewAuthor('');
    setNewComment('');
  };

  const reviews = product.reviews || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />

      <div role="dialog" aria-modal="true" aria-label={product.name} className="relative w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl z-10">
        {/* Header actions */}
        <div className="sticky top-0 z-20 flex items-center justify-end gap-1 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleSave}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              isWishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300'
                : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={isWishlisted ? 'Remove from saved' : 'Save to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            {isWishlisted ? 'Saved' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-0">
          {/* Image */}
          <div className="bg-slate-100 dark:bg-slate-800/50 aspect-[4/3] sm:aspect-auto sm:min-h-[220px] max-h-[240px] sm:max-h-[280px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-4 space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-indigo-600 dark:text-indigo-300 font-medium">
                {product.category}
              </p>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mt-0.5 leading-snug">
                {product.name}
              </h2>
              {product.tagline && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.tagline}</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-900 dark:text-white">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">${product.originalPrice}</span>
                )}
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {product.rating}
                <span className="text-slate-400">({product.reviewsCount || reviews.length || 0})</span>
              </span>
            </div>

            {product.colors?.length > 0 && (
              <div>
                <p className="text-[11px] text-slate-500 mb-1.5">Color: {selectedColor}</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-2 py-1 rounded text-[11px] border ${
                        selectedColor === c
                          ? 'border-slate-900 dark:border-white bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleAdd}
                disabled={product.inStock === false}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  product.inStock === false
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                }`}
              >
                {product.inStock === false ? (
                  'Out of stock'
                ) : added ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to cart
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className={`px-3 py-2.5 rounded-lg border text-xs font-medium flex items-center gap-1 ${
                  isWishlisted
                    ? 'border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/40 dark:text-rose-300'
                    : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                title={isWishlisted ? 'Remove from saved' : 'Save to wishlist'}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Saved' : 'Save'}
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              {product.inStock === false
                ? 'Currently unavailable'
                : `${product.stockCount ?? 'In'} stock`}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-3 text-xs font-medium">
            {['overview', 'reviews'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className={`py-2.5 border-b-2 capitalize ${
                  activeTab === t
                    ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4 pt-2">
          {activeTab === 'overview' && (
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description || product.tagline || 'No description available for this product.'}
            </p>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <form onSubmit={handleReviewSubmit} className="space-y-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-1.5 text-xs"
                    placeholder="Your name"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                  />
                  <select
                    className="rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-1.5 text-xs"
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} stars
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-1.5 text-xs min-h-[56px]"
                  placeholder="Write a short review"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  type="submit"
                  className="text-xs px-3 py-1.5 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium"
                >
                  Post review
                </button>
              </form>
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500">No reviews yet.</p>
              ) : (
                <ul className="space-y-2 max-h-36 overflow-y-auto">
                  {reviews.map((rev) => (
                    <li key={rev.id} className="text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {rev.author} · {rev.rating}★
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">{rev.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
