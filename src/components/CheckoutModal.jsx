import React, { useMemo, useState, useEffect } from 'react';
import { loadAddresses, loadCoupons, loadPaymentMethods } from '../utils/storage';

const STEPS = ['Address', 'Shipping', 'Payment', 'Review'];

export default function CheckoutModal({ isOpen, onClose, cartItems, onCompleteOrder, user }) {
  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentId, setPaymentId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [guest, setGuest] = useState({
    fullName: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    postal: '',
    country: 'United States'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    const addrs = loadAddresses();
    setAddresses(addrs);
    const def = addrs.find((a) => a.isDefaultShipping) || addrs[0];
    setSelectedAddressId(def?.id || '');
    const pays = loadPaymentMethods();
    setPayments(pays);
    setPaymentId(pays.find((p) => p.isDefault)?.id || pays[0]?.id || 'cod');
  }, [isOpen]);

  const subtotal = useMemo(
    () => cartItems.reduce((a, i) => a + i.price * i.quantity, 0),
    [cartItems]
  );

  const shippingCost = shippingMethod === 'express' ? 18 : shippingMethod === 'pickup' ? 0 : subtotal >= 300 ? 0 : 12;

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (subtotal < (appliedCoupon.minOrder || 0)) return 0;
    if (appliedCoupon.type === 'percent') {
      return Math.min((subtotal * appliedCoupon.value) / 100, appliedCoupon.maxDiscount ?? Infinity);
    }
    return Math.min(appliedCoupon.value, appliedCoupon.maxDiscount ?? appliedCoupon.value);
  }, [appliedCoupon, subtotal]);

  const taxable = Math.max(0, subtotal - discount);
  const tax = taxable * 0.08;
  const total = taxable + tax + shippingCost;

  const applyCoupon = () => {
    const list = loadCoupons();
    const found = list.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);
    if (!found) {
      setCouponError('Invalid or inactive code.');
      setAppliedCoupon(null);
      return;
    }
    if (subtotal < (found.minOrder || 0)) {
      setCouponError(`Minimum order $${found.minOrder} required.`);
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(found);
    setCouponError('');
  };

  const validateAddress = () => {
    if (selectedAddressId) return true;
    const e = {};
    if (!guest.fullName.trim()) e.fullName = 'Required';
    if (!guest.line1.trim()) e.line1 = 'Required';
    if (!guest.city.trim()) e.city = 'Required';
    if (!guest.postal.trim()) e.postal = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0 && !validateAddress()) return;
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const placeOrder = () => {
    const shipping =
      selectedAddressId
        ? addresses.find((a) => a.id === selectedAddressId)
        : { ...guest };
    onCompleteOrder?.({
      shipping,
      shippingMethod,
      paymentId,
      coupon: appliedCoupon?.code || null,
      discount,
      tax,
      shippingCost,
      subtotal,
      total
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Checkout</h2>
            <p className="text-xs text-slate-500">
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
              {user ? ` · ${user.name}` : ' · Guest'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-slate-500">
            Close
          </button>
        </div>

        <div className="flex gap-1 px-5 pt-3">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded ${i <= step ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-slate-700'}`}
            />
          ))}
        </div>

        <div className="p-5 space-y-4">
          {step === 0 && (
            <div className="space-y-3">
              {addresses.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Saved addresses</p>
                  {addresses.map((a) => (
                    <label key={a.id} className="flex gap-2 items-start rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="addr"
                        checked={selectedAddressId === a.id}
                        onChange={() => setSelectedAddressId(a.id)}
                      />
                      <span>
                        <span className="font-medium text-slate-900 dark:text-white">{a.fullName}</span>
                        <span className="block text-xs text-slate-500">
                          {a.line1}, {a.city}
                        </span>
                      </span>
                    </label>
                  ))}
                  <button type="button" className="text-xs underline text-slate-500" onClick={() => setSelectedAddressId('')}>
                    Use a different address
                  </button>
                </div>
              )}
              {!selectedAddressId && (
                <div className="space-y-2">
                  {['fullName', 'phone', 'line1', 'city', 'state', 'postal', 'country'].map((f) => (
                    <label key={f} className="block text-xs text-slate-600 dark:text-slate-300 capitalize">
                      {f}
                      <input
                        className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 text-sm"
                        value={guest[f] || ''}
                        onChange={(e) => setGuest((g) => ({ ...g, [f]: e.target.value }))}
                      />
                      {errors[f] && <span className="text-rose-600">{errors[f]}</span>}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-2">
              {[
                { id: 'standard', label: 'Standard (3–5 days)', price: subtotal >= 300 ? 'Free' : '$12' },
                { id: 'express', label: 'Express (1–2 days)', price: '$18' },
                { id: 'pickup', label: 'Store pickup', price: 'Free' }
              ].map((m) => (
                <label key={m.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ship"
                      checked={shippingMethod === m.id}
                      onChange={() => setShippingMethod(m.id)}
                    />
                    {m.label}
                  </span>
                  <span className="text-slate-500">{m.price}</span>
                </label>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <label className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm">
                <input type="radio" checked={paymentId === 'cod'} onChange={() => setPaymentId('cod')} />
                Pay on delivery / demo pay
              </label>
              {payments.map((p) => (
                <label key={p.id} className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm">
                  <input type="radio" checked={paymentId === p.id} onChange={() => setPaymentId(p.id)} />
                  {p.brand} •••• {p.last4}
                </label>
              ))}
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 text-sm"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button type="button" onClick={applyCoupon} className="text-xs px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600">
                  Apply
                </button>
              </div>
              {couponError && <p className="text-xs text-rose-600">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-xs text-teal-700">Applied {appliedCoupon.code} (−${discount.toFixed(2)})</p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Discount</span><span>−${discount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span>${shippingCost.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-semibold text-base border-t border-slate-200 dark:border-slate-700 pt-2">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500 pt-2">
                {cartItems.length} item(s) · {shippingMethod} · {paymentId === 'cod' ? 'Demo pay' : 'Card on file'}
              </p>
            </div>
          )}

          <div className="flex justify-between gap-2 pt-2">
            <button
              type="button"
              className="text-xs px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600"
              onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
            >
              {step === 0 ? 'Cancel' : 'Back'}
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="text-xs px-4 py-2 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold">
                Continue
              </button>
            ) : (
              <button type="button" onClick={placeOrder} className="text-xs px-4 py-2 rounded-md bg-teal-700 text-white font-semibold">
                Place order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
