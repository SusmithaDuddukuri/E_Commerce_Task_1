/**
 * Formatting helpers for prices, dates, stock, ratings
 */

export function formatPrice(amount, currency = 'USD') {
  if (amount == null || Number.isNaN(Number(amount))) return '$0.00';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(amount));
  } catch {
    return `$${Number(amount).toFixed(2)}`;
  }
}

export function formatPercent(value, digits = 0) {
  if (value == null || !Number.isFinite(Number(value))) return '0%';
  return `${Number(value).toFixed(digits)}%`;
}

export function formatDate(isoOrDate, opts = {}) {
  try {
    const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...opts
    }).format(d);
  } catch {
    return String(isoOrDate);
  }
}

export function formatRelativeTime(iso) {
  try {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(iso);
  } catch {
    return '';
  }
}

export function formatStockLabel(count, inStock) {
  if (!inStock || count <= 0) return { label: 'Out of stock', tone: 'danger' };
  if (count <= 5) return { label: `Only ${count} left`, tone: 'warn' };
  if (count <= 20) return { label: 'Low stock', tone: 'warn' };
  return { label: 'In stock', tone: 'ok' };
}

export function formatRating(rating) {
  const n = Number(rating) || 0;
  return n.toFixed(1);
}

export function calcDiscount(price, original) {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

export function orderId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AURA-${ts}-${rand}`;
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
