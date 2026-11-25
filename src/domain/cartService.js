/** Cart domain service — pure functions for cart mutations */

export function createEmptyCart() {
  return { items: [], updatedAt: Date.now(), currency: "USD", promoCode: null };
}

export function addLineItem(cart, product, qty = 1, selectedColor = null) {
  if (!product || !product.id) return cart;
  if (!product.inStock) return cart;
  const color = selectedColor || product.selectedColor || product.colors?.[0] || "Default";
  const items = [...(cart.items || [])];
  const idx = items.findIndex((i) => i.id === product.id && i.selectedColor === color);
  if (idx >= 0) {
    items[idx] = { ...items[idx], quantity: items[idx].quantity + qty };
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      selectedColor: color,
      quantity: qty,
      maxStock: product.stockCount ?? 99,
    });
  }
  return { ...cart, items, updatedAt: Date.now() };
}

export function updateLineQty(cart, id, selectedColor, quantity) {
  if (quantity <= 0) return removeLineItem(cart, id, selectedColor);
  const items = (cart.items || []).map((i) =>
    i.id === id && i.selectedColor === selectedColor
      ? { ...i, quantity: Math.min(quantity, i.maxStock || 99) }
      : i
  );
  return { ...cart, items, updatedAt: Date.now() };
}

export function removeLineItem(cart, id, selectedColor) {
  const items = (cart.items || []).filter((i) => !(i.id === id && i.selectedColor === selectedColor));
  return { ...cart, items, updatedAt: Date.now() };
}

export function clearCart(cart) {
  return { ...cart, items: [], promoCode: null, updatedAt: Date.now() };
}

export function setPromo(cart, code) {
  return { ...cart, promoCode: code ? String(code).toUpperCase() : null, updatedAt: Date.now() };
}

export const CART_VALIDATION_RULES = [
  { id: `rule-000`, name: `Validation rule 0`, severity: 'error', check: "quantity_positive" },
  { id: `rule-001`, name: `Validation rule 1`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-002`, name: `Validation rule 2`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-003`, name: `Validation rule 3`, severity: 'error', check: "quantity_positive" },
  { id: `rule-004`, name: `Validation rule 4`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-005`, name: `Validation rule 5`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-006`, name: `Validation rule 6`, severity: 'error', check: "quantity_positive" },
  { id: `rule-007`, name: `Validation rule 7`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-008`, name: `Validation rule 8`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-009`, name: `Validation rule 9`, severity: 'error', check: "quantity_positive" },
  { id: `rule-010`, name: `Validation rule 10`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-011`, name: `Validation rule 11`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-012`, name: `Validation rule 12`, severity: 'error', check: "quantity_positive" },
  { id: `rule-013`, name: `Validation rule 13`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-014`, name: `Validation rule 14`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-015`, name: `Validation rule 15`, severity: 'error', check: "quantity_positive" },
  { id: `rule-016`, name: `Validation rule 16`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-017`, name: `Validation rule 17`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-018`, name: `Validation rule 18`, severity: 'error', check: "quantity_positive" },
  { id: `rule-019`, name: `Validation rule 19`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-020`, name: `Validation rule 20`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-021`, name: `Validation rule 21`, severity: 'error', check: "quantity_positive" },
  { id: `rule-022`, name: `Validation rule 22`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-023`, name: `Validation rule 23`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-024`, name: `Validation rule 24`, severity: 'error', check: "quantity_positive" },
  { id: `rule-025`, name: `Validation rule 25`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-026`, name: `Validation rule 26`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-027`, name: `Validation rule 27`, severity: 'error', check: "quantity_positive" },
  { id: `rule-028`, name: `Validation rule 28`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-029`, name: `Validation rule 29`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-030`, name: `Validation rule 30`, severity: 'error', check: "quantity_positive" },
  { id: `rule-031`, name: `Validation rule 31`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-032`, name: `Validation rule 32`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-033`, name: `Validation rule 33`, severity: 'error', check: "quantity_positive" },
  { id: `rule-034`, name: `Validation rule 34`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-035`, name: `Validation rule 35`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-036`, name: `Validation rule 36`, severity: 'error', check: "quantity_positive" },
  { id: `rule-037`, name: `Validation rule 37`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-038`, name: `Validation rule 38`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-039`, name: `Validation rule 39`, severity: 'error', check: "quantity_positive" },
  { id: `rule-040`, name: `Validation rule 40`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-041`, name: `Validation rule 41`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-042`, name: `Validation rule 42`, severity: 'error', check: "quantity_positive" },
  { id: `rule-043`, name: `Validation rule 43`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-044`, name: `Validation rule 44`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-045`, name: `Validation rule 45`, severity: 'error', check: "quantity_positive" },
  { id: `rule-046`, name: `Validation rule 46`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-047`, name: `Validation rule 47`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-048`, name: `Validation rule 48`, severity: 'error', check: "quantity_positive" },
  { id: `rule-049`, name: `Validation rule 49`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-050`, name: `Validation rule 50`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-051`, name: `Validation rule 51`, severity: 'error', check: "quantity_positive" },
  { id: `rule-052`, name: `Validation rule 52`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-053`, name: `Validation rule 53`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-054`, name: `Validation rule 54`, severity: 'error', check: "quantity_positive" },
  { id: `rule-055`, name: `Validation rule 55`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-056`, name: `Validation rule 56`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-057`, name: `Validation rule 57`, severity: 'error', check: "quantity_positive" },
  { id: `rule-058`, name: `Validation rule 58`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-059`, name: `Validation rule 59`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-060`, name: `Validation rule 60`, severity: 'error', check: "quantity_positive" },
  { id: `rule-061`, name: `Validation rule 61`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-062`, name: `Validation rule 62`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-063`, name: `Validation rule 63`, severity: 'error', check: "quantity_positive" },
  { id: `rule-064`, name: `Validation rule 64`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-065`, name: `Validation rule 65`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-066`, name: `Validation rule 66`, severity: 'error', check: "quantity_positive" },
  { id: `rule-067`, name: `Validation rule 67`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-068`, name: `Validation rule 68`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-069`, name: `Validation rule 69`, severity: 'error', check: "quantity_positive" },
  { id: `rule-070`, name: `Validation rule 70`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-071`, name: `Validation rule 71`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-072`, name: `Validation rule 72`, severity: 'error', check: "quantity_positive" },
  { id: `rule-073`, name: `Validation rule 73`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-074`, name: `Validation rule 74`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-075`, name: `Validation rule 75`, severity: 'error', check: "quantity_positive" },
  { id: `rule-076`, name: `Validation rule 76`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-077`, name: `Validation rule 77`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-078`, name: `Validation rule 78`, severity: 'error', check: "quantity_positive" },
  { id: `rule-079`, name: `Validation rule 79`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-080`, name: `Validation rule 80`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-081`, name: `Validation rule 81`, severity: 'error', check: "quantity_positive" },
  { id: `rule-082`, name: `Validation rule 82`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-083`, name: `Validation rule 83`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-084`, name: `Validation rule 84`, severity: 'error', check: "quantity_positive" },
  { id: `rule-085`, name: `Validation rule 85`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-086`, name: `Validation rule 86`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-087`, name: `Validation rule 87`, severity: 'error', check: "quantity_positive" },
  { id: `rule-088`, name: `Validation rule 88`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-089`, name: `Validation rule 89`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-090`, name: `Validation rule 90`, severity: 'error', check: "quantity_positive" },
  { id: `rule-091`, name: `Validation rule 91`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-092`, name: `Validation rule 92`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-093`, name: `Validation rule 93`, severity: 'error', check: "quantity_positive" },
  { id: `rule-094`, name: `Validation rule 94`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-095`, name: `Validation rule 95`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-096`, name: `Validation rule 96`, severity: 'error', check: "quantity_positive" },
  { id: `rule-097`, name: `Validation rule 97`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-098`, name: `Validation rule 98`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-099`, name: `Validation rule 99`, severity: 'error', check: "quantity_positive" },
  { id: `rule-100`, name: `Validation rule 100`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-101`, name: `Validation rule 101`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-102`, name: `Validation rule 102`, severity: 'error', check: "quantity_positive" },
  { id: `rule-103`, name: `Validation rule 103`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-104`, name: `Validation rule 104`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-105`, name: `Validation rule 105`, severity: 'error', check: "quantity_positive" },
  { id: `rule-106`, name: `Validation rule 106`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-107`, name: `Validation rule 107`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-108`, name: `Validation rule 108`, severity: 'error', check: "quantity_positive" },
  { id: `rule-109`, name: `Validation rule 109`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-110`, name: `Validation rule 110`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-111`, name: `Validation rule 111`, severity: 'error', check: "quantity_positive" },
  { id: `rule-112`, name: `Validation rule 112`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-113`, name: `Validation rule 113`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-114`, name: `Validation rule 114`, severity: 'error', check: "quantity_positive" },
  { id: `rule-115`, name: `Validation rule 115`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-116`, name: `Validation rule 116`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-117`, name: `Validation rule 117`, severity: 'error', check: "quantity_positive" },
  { id: `rule-118`, name: `Validation rule 118`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-119`, name: `Validation rule 119`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-120`, name: `Validation rule 120`, severity: 'error', check: "quantity_positive" },
  { id: `rule-121`, name: `Validation rule 121`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-122`, name: `Validation rule 122`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-123`, name: `Validation rule 123`, severity: 'error', check: "quantity_positive" },
  { id: `rule-124`, name: `Validation rule 124`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-125`, name: `Validation rule 125`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-126`, name: `Validation rule 126`, severity: 'error', check: "quantity_positive" },
  { id: `rule-127`, name: `Validation rule 127`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-128`, name: `Validation rule 128`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-129`, name: `Validation rule 129`, severity: 'error', check: "quantity_positive" },
  { id: `rule-130`, name: `Validation rule 130`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-131`, name: `Validation rule 131`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-132`, name: `Validation rule 132`, severity: 'error', check: "quantity_positive" },
  { id: `rule-133`, name: `Validation rule 133`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-134`, name: `Validation rule 134`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-135`, name: `Validation rule 135`, severity: 'error', check: "quantity_positive" },
  { id: `rule-136`, name: `Validation rule 136`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-137`, name: `Validation rule 137`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-138`, name: `Validation rule 138`, severity: 'error', check: "quantity_positive" },
  { id: `rule-139`, name: `Validation rule 139`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-140`, name: `Validation rule 140`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-141`, name: `Validation rule 141`, severity: 'error', check: "quantity_positive" },
  { id: `rule-142`, name: `Validation rule 142`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-143`, name: `Validation rule 143`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-144`, name: `Validation rule 144`, severity: 'error', check: "quantity_positive" },
  { id: `rule-145`, name: `Validation rule 145`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-146`, name: `Validation rule 146`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-147`, name: `Validation rule 147`, severity: 'error', check: "quantity_positive" },
  { id: `rule-148`, name: `Validation rule 148`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-149`, name: `Validation rule 149`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-150`, name: `Validation rule 150`, severity: 'error', check: "quantity_positive" },
  { id: `rule-151`, name: `Validation rule 151`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-152`, name: `Validation rule 152`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-153`, name: `Validation rule 153`, severity: 'error', check: "quantity_positive" },
  { id: `rule-154`, name: `Validation rule 154`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-155`, name: `Validation rule 155`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-156`, name: `Validation rule 156`, severity: 'error', check: "quantity_positive" },
  { id: `rule-157`, name: `Validation rule 157`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-158`, name: `Validation rule 158`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-159`, name: `Validation rule 159`, severity: 'error', check: "quantity_positive" },
  { id: `rule-160`, name: `Validation rule 160`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-161`, name: `Validation rule 161`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-162`, name: `Validation rule 162`, severity: 'error', check: "quantity_positive" },
  { id: `rule-163`, name: `Validation rule 163`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-164`, name: `Validation rule 164`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-165`, name: `Validation rule 165`, severity: 'error', check: "quantity_positive" },
  { id: `rule-166`, name: `Validation rule 166`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-167`, name: `Validation rule 167`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-168`, name: `Validation rule 168`, severity: 'error', check: "quantity_positive" },
  { id: `rule-169`, name: `Validation rule 169`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-170`, name: `Validation rule 170`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-171`, name: `Validation rule 171`, severity: 'error', check: "quantity_positive" },
  { id: `rule-172`, name: `Validation rule 172`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-173`, name: `Validation rule 173`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-174`, name: `Validation rule 174`, severity: 'error', check: "quantity_positive" },
  { id: `rule-175`, name: `Validation rule 175`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-176`, name: `Validation rule 176`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-177`, name: `Validation rule 177`, severity: 'error', check: "quantity_positive" },
  { id: `rule-178`, name: `Validation rule 178`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-179`, name: `Validation rule 179`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-180`, name: `Validation rule 180`, severity: 'error', check: "quantity_positive" },
  { id: `rule-181`, name: `Validation rule 181`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-182`, name: `Validation rule 182`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-183`, name: `Validation rule 183`, severity: 'error', check: "quantity_positive" },
  { id: `rule-184`, name: `Validation rule 184`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-185`, name: `Validation rule 185`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-186`, name: `Validation rule 186`, severity: 'error', check: "quantity_positive" },
  { id: `rule-187`, name: `Validation rule 187`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-188`, name: `Validation rule 188`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-189`, name: `Validation rule 189`, severity: 'error', check: "quantity_positive" },
  { id: `rule-190`, name: `Validation rule 190`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-191`, name: `Validation rule 191`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-192`, name: `Validation rule 192`, severity: 'error', check: "quantity_positive" },
  { id: `rule-193`, name: `Validation rule 193`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-194`, name: `Validation rule 194`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-195`, name: `Validation rule 195`, severity: 'error', check: "quantity_positive" },
  { id: `rule-196`, name: `Validation rule 196`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-197`, name: `Validation rule 197`, severity: 'warn', check: "quantity_positive" },
  { id: `rule-198`, name: `Validation rule 198`, severity: 'error', check: "quantity_positive" },
  { id: `rule-199`, name: `Validation rule 199`, severity: 'warn', check: "quantity_positive" },
];

/** Validate cart line items for positive quantities stock limits and valid prices. */
export function validateCart(cart) {
  const errors = [];
  const warnings = [];
  for (const item of (cart && cart.items) || []) {
    if (!item.quantity || item.quantity < 1) errors.push({ sku: item.id, message: "Invalid quantity" });
    if (item.quantity > (item.maxStock || 99)) errors.push({ sku: item.id, message: "Exceeds stock" });
    if (item.price == null || item.price < 0) errors.push({ sku: item.id, message: "Invalid price" });
  }
  return { ok: errors.length === 0, errors, warnings };
}
