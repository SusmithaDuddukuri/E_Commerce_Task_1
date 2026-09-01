/**
 * LocalStorage persistence helpers for Aura Commerce
 * Handles cart, wishlist, orders, preferences with safe fallbacks
 */

const KEYS = {
  CART: 'aura_cart_v2',
  WISHLIST: 'aura_wishlist_v2',
  ORDERS: 'aura_orders_v2',
  PREFS: 'aura_prefs_v2',
  RECENT_SEARCHES: 'aura_recent_searches_v2',
  COMPARE: 'aura_compare_v2',
  USER: 'aura_user_v2'
};

function safeParse(raw, fallback) {
  try {
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function loadCart() {
  return safeParse(localStorage.getItem(KEYS.CART), []);
}

export function saveCart(items) {
  try {
    localStorage.setItem(KEYS.CART, JSON.stringify(items));
  } catch (e) {
    console.warn('Cart persistence failed', e);
  }
}

export function loadWishlist() {
  return safeParse(localStorage.getItem(KEYS.WISHLIST), []);
}

export function saveWishlist(items) {
  try {
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify(items));
  } catch (e) {
    console.warn('Wishlist persistence failed', e);
  }
}

export function loadOrders() {
  return safeParse(localStorage.getItem(KEYS.ORDERS), []);
}

export function saveOrders(orders) {
  try {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.warn('Orders persistence failed', e);
  }
}

export function loadPrefs() {
  return safeParse(localStorage.getItem(KEYS.PREFS), {
    darkMode: true,
    currency: 'USD',
    notifications: true,
    reducedMotion: false
  });
}

export function savePrefs(prefs) {
  try {
    localStorage.setItem(KEYS.PREFS, JSON.stringify(prefs));
  } catch (e) {
    console.warn('Prefs persistence failed', e);
  }
}

export function loadRecentSearches() {
  return safeParse(localStorage.getItem(KEYS.RECENT_SEARCHES), []);
}

export function saveRecentSearch(query) {
  if (!query || query.trim().length < 2) return;
  try {
    const prev = loadRecentSearches().filter(q => q.toLowerCase() !== query.toLowerCase());
    const next = [query.trim(), ...prev].slice(0, 8);
    localStorage.setItem(KEYS.RECENT_SEARCHES, JSON.stringify(next));
  } catch {}
}

export function loadCompare() {
  return safeParse(localStorage.getItem(KEYS.COMPARE), []);
}

export function saveCompare(ids) {
  try {
    localStorage.setItem(KEYS.COMPARE, JSON.stringify(ids.slice(0, 4)));
  } catch {}
}

export function loadUser() {
  return safeParse(localStorage.getItem(KEYS.USER), null);
}

export function saveUser(user) {
  try {
    if (user) localStorage.setItem(KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.USER);
  } catch {}
}

export function clearAllCommerceData() {
  Object.values(KEYS).forEach(k => {
    try { localStorage.removeItem(k); } catch {}
  });
}
