import { useState, useEffect, useCallback } from 'react';
import { loadCart, saveCart, loadWishlist, saveWishlist, loadPrefs, savePrefs, loadOrders, saveOrders, loadCompare, saveCompare } from '../utils/storage';

export function useCart(initial = []) {
  const [cartItems, setCartItems] = useState(() => {
    const stored = loadCart();
    return stored.length ? stored : initial;
  });

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const addItem = useCallback((product, qty = 1, color) => {
    setCartItems(prev => {
      const selectedColor = color || product.selectedColor || product.colors?.[0] || 'Default';
      const idx = prev.findIndex(i => i.id === product.id && i.selectedColor === selectedColor);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { ...product, quantity: qty, selectedColor }];
    });
  }, []);

  const updateQuantity = useCallback((id, selectedColor, newQty) => {
    setCartItems(prev => {
      if (newQty <= 0) {
        return prev.filter(i => !(i.id === id && i.selectedColor === selectedColor));
      }
      return prev.map(i =>
        i.id === id && i.selectedColor === selectedColor ? { ...i, quantity: newQty } : i
      );
    });
  }, []);

  const removeItem = useCallback((id, selectedColor) => {
    setCartItems(prev => prev.filter(i => !(i.id === id && i.selectedColor === selectedColor)));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = cartItems.reduce((a, i) => a + (i.quantity || 0), 0);
  const cartSubtotal = cartItems.reduce((a, i) => a + (i.price || 0) * (i.quantity || 0), 0);

  return {
    cartItems,
    setCartItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    cartCount,
    cartSubtotal
  };
}

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState(() => loadWishlist());

  useEffect(() => {
    saveWishlist(wishlistItems);
  }, [wishlistItems]);

  const toggle = useCallback((product) => {
    setWishlistItems(prev => {
      const exists = prev.some(i => i.id === product.id);
      if (exists) return prev.filter(i => i.id !== product.id);
      return [...prev, product];
    });
  }, []);

  const remove = useCallback((id) => {
    setWishlistItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const isInWishlist = useCallback((id) => wishlistItems.some(i => i.id === id), [wishlistItems]);

  return { wishlistItems, setWishlistItems, toggle, remove, isInWishlist, count: wishlistItems.length };
}

export function usePrefs() {
  const [prefs, setPrefs] = useState(() => loadPrefs());

  useEffect(() => {
    savePrefs(prefs);
  }, [prefs]);

  const setDarkMode = useCallback((v) => setPrefs(p => ({ ...p, darkMode: !!v })), []);
  const toggleDarkMode = useCallback(() => setPrefs(p => ({ ...p, darkMode: !p.darkMode })), []);

  return { prefs, setPrefs, setDarkMode, toggleDarkMode };
}

export function useOrders() {
  const [orders, setOrders] = useState(() => loadOrders());

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const addOrder = useCallback((order) => {
    setOrders(prev => [order, ...prev].slice(0, 50));
  }, []);

  return { orders, setOrders, addOrder };
}

export function useCompare() {
  const [compareIds, setCompareIds] = useState(() => loadCompare());

  useEffect(() => {
    saveCompare(compareIds);
  }, [compareIds]);

  const toggleCompare = useCallback((id) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  return { compareIds, toggleCompare, clearCompare, setCompareIds };
}
