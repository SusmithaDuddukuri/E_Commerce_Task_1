import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, MessageSquare, Send } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart, onAddReview, isWishlisted, onToggleWishlist }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'reviews'
  const [selectedImage, setSelectedImage] = useState(product?.image || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [added, setAdded] = useState(false);

  // Review Form State
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
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
    onAddToCart({ ...product, selectedColor });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const reviewObj = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      date: 'Just now',
      comment: newComment
    };

    onAddReview(product.id, reviewObj);
    setNewAuthor('');
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Light Dismiss Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-50 dark:bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 z-10 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column - Gallery */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex flex-col justify-between space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Selectors */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-1">
                {product.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === imgUrl ? 'border-indigo-500 scale-95' : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info & Reviews */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            {/* Header Tabs */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                      activeTab === 'overview' ? 'text-indigo-400 border-b-2 border-indigo-500 pb-1' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                      activeTab === 'reviews' ? 'text-indigo-400 border-b-2 border-indigo-500 pb-1' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Reviews ({product.reviews?.length || 0})</span>
                  </button>
                </div>
              </div>

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' ? (
                <>
                  <div className="flex items-center space-x-2 text-xs text-indigo-400 font-mono tracking-wider uppercase mb-2">
                    <span>{product.category}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-sans">{product.inStock ? 'In Stock' : 'Pre-order'}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-snug">{product.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{product.tagline}</p>

                  <div className="flex items-center justify-between mt-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-baseline space-x-3">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-slate-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5 glass-pill px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{product.rating}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-4 leading-relaxed font-light">
                    {product.description}
                  </p>

                  {/* Colors */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mt-5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                        Finish Variant: <span className="text-slate-200">{selectedColor}</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              selectedColor === color
                                ? 'bg-indigo-600/20 border-indigo-500 text-slate-900 dark:text-white'
                                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specs */}
                  {product.specs && (
                    <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 text-xs grid grid-cols-2 gap-2">
                      {Object.entries(product.specs).map(([key, val]) => (
                        <div key={key}>
                          <span className="text-slate-500 uppercase text-[10px] block font-mono">{key}</span>
                          <span className="text-slate-200 font-medium">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* REVIEWS TAB */
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  
                  {/* Write a Review Form */}
                  <form onSubmit={handleReviewSubmit} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-white">Write a Customer Review</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                        required
                      />
                      <div className="flex items-center space-x-1 justify-end">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            onClick={() => setNewRating(star)}
                            className={`w-4 h-4 cursor-pointer ${
                              star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <textarea
                      placeholder="Share your experience..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-white h-16 resize-none"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white font-semibold text-xs flex items-center space-x-1 ml-auto"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Review</span>
                    </button>
                  </form>

                  {/* Existing Reviews */}
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div key={rev.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">{rev.author}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-slate-600 dark:text-slate-300 font-mono">{rev.rating}.0</span>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 font-light">{rev.comment}</p>
                        <span className="text-[10px] text-slate-500 block">{rev.date}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-4">No reviews yet. Be the first to leave one!</p>
                  )}

                </div>
              )}
            </div>

            {/* Bottom Actions & Trust */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleAdd}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-xl ${
                  added 
                    ? 'bg-emerald-600 text-slate-900 dark:text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white shadow-indigo-600/25 hover:scale-[1.01]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Order Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag - ${product.price}</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center justify-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Free Express</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2 Year Warranty</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>30-Day Guarantee</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
