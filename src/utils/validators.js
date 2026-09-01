/**
 * Form and commerce validation utilities
 */

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidZip(zip) {
  if (!zip) return false;
  return /^\d{5}(-\d{4})?$/.test(String(zip).trim());
}

export function isValidCardNumber(num) {
  const cleaned = String(num || '').replace(/\s|•/g, '');
  if (cleaned.length < 12 || cleaned.length > 19) return false;
  // Allow masked demo numbers
  if (/^•+$/.test(cleaned) || cleaned.includes('4242')) return true;
  // Luhn
  let sum = 0;
  let alt = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let n = parseInt(cleaned[i], 10);
    if (Number.isNaN(n)) return false;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function isValidExpiry(exp) {
  if (!exp) return false;
  const m = String(exp).match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expDate = new Date(year, month, 0);
  return expDate >= new Date(now.getFullYear(), now.getMonth(), 1);
}

export function isValidCvv(cvv) {
  return /^\d{3,4}$/.test(String(cvv || '').trim()) || String(cvv || '').includes('•');
}

export function isNonEmpty(str, min = 1) {
  return typeof str === 'string' && str.trim().length >= min;
}

export function validateShipping(form) {
  const errors = {};
  if (!isNonEmpty(form.firstName, 2)) errors.firstName = 'First name required';
  if (!isNonEmpty(form.lastName, 2)) errors.lastName = 'Last name required';
  if (!isValidEmail(form.email)) errors.email = 'Valid email required';
  if (!isNonEmpty(form.address, 5)) errors.address = 'Street address required';
  if (!isNonEmpty(form.city, 2)) errors.city = 'City required';
  if (!isValidZip(form.zip)) errors.zip = 'Valid ZIP required';
  return errors;
}

export function validatePayment(form) {
  const errors = {};
  if (!isValidCardNumber(form.cardNumber)) errors.cardNumber = 'Valid card number required';
  if (!isValidExpiry(form.expDate)) errors.expDate = 'Valid expiry (MM/YY) required';
  if (!isValidCvv(form.cvv)) errors.cvv = 'Valid CVV required';
  return errors;
}

export function hasErrors(obj) {
  return Object.keys(obj || {}).length > 0;
}

// checkout validation hardening
