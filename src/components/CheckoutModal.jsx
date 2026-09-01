import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, CreditCard, ShieldCheck, ArrowRight, Truck, Lock } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { validateShipping, validatePayment, hasErrors } from '../utils/validators';

const DEFAULT_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  zip: '',
  cardNumber: '',
  expDate: '',
  cvv: ''
};

export default function CheckoutModal({ isOpen, onClose, cartItems, onCompleteOrder }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ ...DEFAULT_FORM });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrors({});
      setSubmitting(false);
      setFormData({
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex.morgan@aura-luxe.io',
        address: '742 Evergreen Terrace',
        city: 'San Francisco',
        zip: '94107',
        cardNumber: '4242 4242 4242 4242',
        expDate: '12/28',
        cvv: '123'
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 200 ? 0 : 12;
  const grandTotal = subtotal + tax + shipping;

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const goToPayment = (e) => {
    e.preventDefault();
    const errs = validateShipping(formData);
    if (hasErrors(errs)) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    const errs = validatePayment(formData);
    if (hasErrors(errs)) {
      setErrors(errs);
      return;
    }
    if (!cartItems.length) return;
    setSubmitting(true);
    setStep(3);
    setTimeout(() => {
      onCompleteOrder({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zip: formData.zip
      });
      setSubmitting(false);
    }, 2800);
  };

  const fieldClass = (key) =>
    `w-full rounded-xl bg-slate-950/60 border px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
      errors[key] ? 'border-rose-500/70' : 'border-slate-700'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" />
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 z-10 my-8">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Express Checkout</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 text-center text-[10px] font-mono border-b border-slate-200 dark:border-slate-800 bg-slate-950/40">
          <div className={`py-2 border-r border-slate-200 dark:border-slate-800 ${step >= 1 ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-600'}`}>1. Shipping</div>
          <div className={`py-2 border-r border-slate-200 dark:border-slate-800 ${step >= 2 ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-600'}`}>2. Payment</div>
          <div className={`py-2 ${step === 3 ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-600'}`}>3. Confirmed</div>
        </div>

        <div className="p-6 sm:p-8">
          {step === 1 && (
            <form onSubmit={goToPayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 block">First name</label>
                  <input className={fieldClass('firstName')} value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} />
                  {errors.firstName && <p className="text-[11px] text-rose-400 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 block">Last name</label>
                  <input className={fieldClass('lastName')} value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} />
                  {errors.lastName && <p className="text-[11px] text-rose-400 mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 block">Email</label>
                <input type="email" className={fieldClass('email')} value={formData.email} onChange={e => updateField('email', e.target.value)} />
                {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 block">Address</label>
                <input className={fieldClass('address')} value={formData.address} onChange={e => updateField('address', e.target.value)} />
                {errors.address && <p className="text-[11px] text-rose-400 mt-1">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 block">City</label>
                  <input className={fieldClass('city')} value={formData.city} onChange={e => updateField('city', e.target.value)} />
                  {errors.city && <p className="text-[11px] text-rose-400 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 block">ZIP</label>
                  <input className={fieldClass('zip')} value={formData.zip} onChange={e => updateField('zip', e.target.value)} />
                  {errors.zip && <p className="text-[11px] text-rose-400 mt-1">{errors.zip}</p>}
                </div>
              </div>
              <button type="submit" className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white font-semibold flex items-center justify-center gap-2">
                Continue to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                <Truck className="w-4 h-4 text-indigo-400" />
                Shipping to {formData.city}, {formData.zip}
                <button type="button" onClick={() => setStep(1)} className="text-indigo-400 hover:underline ml-auto">Edit</button>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 block">Card number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input className={`${fieldClass('cardNumber')} pl-10`} value={formData.cardNumber} onChange={e => updateField('cardNumber', e.target.value)} placeholder="4242 4242 4242 4242" />
                </div>
                {errors.cardNumber && <p className="text-[11px] text-rose-400 mt-1">{errors.cardNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 block">Expiry</label>
                  <input className={fieldClass('expDate')} value={formData.expDate} onChange={e => updateField('expDate', e.target.value)} placeholder="MM/YY" />
                  {errors.expDate && <p className="text-[11px] text-rose-400 mt-1">{errors.expDate}</p>}
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 block">CVV</label>
                  <input className={fieldClass('cvv')} value={formData.cvv} onChange={e => updateField('cvv', e.target.value)} placeholder="123" />
                  {errors.cvv && <p className="text-[11px] text-rose-400 mt-1">{errors.cvv}</p>}
                </div>
              </div>
              <div className="rounded-xl bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Tax (8%)</span><span>{formatPrice(tax)}</span></div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between text-slate-900 dark:text-white font-bold pt-2 border-t border-slate-200 dark:border-slate-800"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
              </div>
              <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-slate-900 dark:text-white font-semibold flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Pay {formatPrice(grandTotal)}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-10 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Order confirmed</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Your simulated payment succeeded. A receipt would be emailed to {formData.email}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
