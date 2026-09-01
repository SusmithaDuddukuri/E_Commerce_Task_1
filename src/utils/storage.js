/**
 * LocalStorage persistence for Aura Commerce
 */

const KEYS = {
  CART: 'aura_cart_v2',
  WISHLIST: 'aura_wishlist_v2',
  ORDERS: 'aura_orders_v2',
  PREFS: 'aura_prefs_v2',
  RECENT_SEARCHES: 'aura_recent_searches_v2',
  COMPARE: 'aura_compare_v2',
  USER: 'aura_user_v2',
  USERS: 'aura_users_db_v1',
  ADDRESSES: 'aura_addresses_v1',
  PAYMENTS: 'aura_payments_v1',
  RECENT_VIEWED: 'aura_recent_viewed_v1',
  REVIEWS: 'aura_reviews_v1',
  RETURNS: 'aura_returns_v1',
  TICKETS: 'aura_tickets_v1',
  COUPONS: 'aura_coupons_v1',
  ALERTS: 'aura_alerts_v1'
};

function safeParse(raw, fallback) {
  try {
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function load(key, fallback) {
  return safeParse(localStorage.getItem(key), fallback);
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage failed', key, e);
  }
}

export function loadCart() { return load(KEYS.CART, []); }
export function saveCart(items) { save(KEYS.CART, items); }

export function loadWishlist() { return load(KEYS.WISHLIST, []); }
export function saveWishlist(items) { save(KEYS.WISHLIST, items); }

export function loadOrders() { return load(KEYS.ORDERS, []); }
export function saveOrders(orders) { save(KEYS.ORDERS, orders); }

export function loadPrefs() {
  return load(KEYS.PREFS, {
    darkMode: true,
    currency: 'USD',
    notifications: true,
    reducedMotion: false,
    emailMarketing: true,
    smsAlerts: false
  });
}
export function savePrefs(prefs) { save(KEYS.PREFS, prefs); }

export function loadRecentSearches() { return load(KEYS.RECENT_SEARCHES, []); }
export function saveRecentSearch(query) {
  if (!query || query.trim().length < 2) return;
  try {
    const prev = loadRecentSearches().filter((q) => q.toLowerCase() !== query.toLowerCase());
    save(KEYS.RECENT_SEARCHES, [query.trim(), ...prev].slice(0, 8));
  } catch {}
}

export function loadCompare() { return load(KEYS.COMPARE, []); }
export function saveCompare(ids) { save(KEYS.COMPARE, (ids || []).slice(0, 4)); }

export function loadUser() { return load(KEYS.USER, null); }
export function saveUser(user) {
  if (user) save(KEYS.USER, user);
  else localStorage.removeItem(KEYS.USER);
}

export function loadUsersDb() { return load(KEYS.USERS, []); }
export function saveUsersDb(users) { save(KEYS.USERS, users); }

export function loadAddresses() { return load(KEYS.ADDRESSES, []); }
export function saveAddresses(list) { save(KEYS.ADDRESSES, list); }

export function loadPaymentMethods() { return load(KEYS.PAYMENTS, []); }
export function savePaymentMethods(list) { save(KEYS.PAYMENTS, list); }

export function loadRecentViewed() { return load(KEYS.RECENT_VIEWED, []); }
export function saveRecentViewed(ids) { save(KEYS.RECENT_VIEWED, (ids || []).slice(0, 12)); }

export function loadReviews() { return load(KEYS.REVIEWS, []); }
export function saveReviews(list) { save(KEYS.REVIEWS, list); }

export function loadReturns() { return load(KEYS.RETURNS, []); }
export function saveReturns(list) { save(KEYS.RETURNS, list); }

export function loadTickets() { return load(KEYS.TICKETS, []); }
export function saveTickets(list) { save(KEYS.TICKETS, list); }

export function loadCoupons() {
  return load(KEYS.COUPONS, [
    { code: 'AURA15', type: 'percent', value: 15, minOrder: 50, maxDiscount: 100, active: true, expires: '2026-12-31' },
    { code: 'SAVE20', type: 'percent', value: 20, minOrder: 100, maxDiscount: 150, active: true, expires: '2026-12-31' },
    { code: 'FLAT10', type: 'fixed', value: 10, minOrder: 40, maxDiscount: 10, active: true, expires: '2026-12-31' }
  ]);
}
export function saveCoupons(list) { save(KEYS.COUPONS, list); }

export function loadAlerts() { return load(KEYS.ALERTS, []); }
export function saveAlerts(list) { save(KEYS.ALERTS, list); }

export function clearAllCommerceData() {
  Object.values(KEYS).forEach((k) => {
    try { localStorage.removeItem(k); } catch {}
  });
}
