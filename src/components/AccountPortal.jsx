import React, { useState, useEffect } from 'react';
import {
  loadAddresses,
  saveAddresses,
  loadPaymentMethods,
  savePaymentMethods,
  loadReturns,
  saveReturns,
  loadTickets,
  saveTickets,
  loadPrefs,
  savePrefs,
  saveUser
} from '../utils/storage';
import { formatDate } from '../utils/formatters';

const TABS = [
  'Overview',
  'Orders',
  'Addresses',
  'Payments',
  'Returns',
  'Support',
  'Preferences'
];

const emptyAddress = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal: '',
  country: 'United States',
  isDefaultShipping: false,
  isDefaultBilling: false
};

export default function AccountPortal({
  open,
  onClose,
  user,
  onUpdateUser,
  onLogout,
  orders = [],
  wishlistCount = 0,
  onReorder,
  onCancelOrder,
  onToast
}) {
  const [tab, setTab] = useState('Overview');
  const [addresses, setAddresses] = useState(() => loadAddresses());
  const [payments, setPayments] = useState(() => loadPaymentMethods());
  const [returns, setReturns] = useState(() => loadReturns());
  const [tickets, setTickets] = useState(() => loadTickets());
  const [prefs, setPrefs] = useState(() => loadPrefs());
  const [addrForm, setAddrForm] = useState(emptyAddress);
  const [editingAddr, setEditingAddr] = useState(null);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [cardForm, setCardForm] = useState({ brand: 'Visa', last4: '', exp: '', name: '' });
  const [ticketForm, setTicketForm] = useState({ category: 'Orders', subject: '', message: '' });
  const [returnForm, setReturnForm] = useState({ orderId: '', reason: 'Damaged', note: '' });
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', email: user.email || '' });
  }, [user]);

  if (!open || !user) return null;

  const persistAddresses = (list) => {
    setAddresses(list);
    saveAddresses(list);
  };
  const persistPayments = (list) => {
    setPayments(list);
    savePaymentMethods(list);
  };

  const saveAddress = (e) => {
    e.preventDefault();
    if (!addrForm.fullName.trim() || !addrForm.line1.trim() || !addrForm.city.trim()) {
      onToast?.('Missing fields', 'Name, address line, and city are required.', 'error');
      return;
    }
    let list = [...addresses];
    if (editingAddr) {
      list = list.map((a) => (a.id === editingAddr ? { ...a, ...addrForm } : a));
    } else {
      list = [{ id: `addr_${Date.now()}`, ...addrForm }, ...list];
    }
    if (addrForm.isDefaultShipping) {
      list = list.map((a) => ({ ...a, isDefaultShipping: a.id === (editingAddr || list[0].id) ? true : false }));
    }
    if (addrForm.isDefaultBilling) {
      list = list.map((a) => ({ ...a, isDefaultBilling: a.id === (editingAddr || list[0].id) ? true : false }));
    }
    persistAddresses(list);
    setShowAddrForm(false);
    setEditingAddr(null);
    setAddrForm(emptyAddress);
    onToast?.('Address saved', 'Your address book was updated.');
  };

  const deleteAddress = (id) => {
    persistAddresses(addresses.filter((a) => a.id !== id));
    onToast?.('Address removed', 'Removed from your account.');
  };

  const addCard = (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(cardForm.last4)) {
      onToast?.('Invalid card', 'Enter the last 4 digits only. Never enter a full card number.', 'error');
      return;
    }
    const row = {
      id: `pay_${Date.now()}`,
      brand: cardForm.brand,
      last4: cardForm.last4,
      exp: cardForm.exp || '12/28',
      name: cardForm.name || user.name,
      isDefault: payments.length === 0
    };
    persistPayments([row, ...payments]);
    setCardForm({ brand: 'Visa', last4: '', exp: '', name: '' });
    onToast?.('Payment method added', `${row.brand} •••• ${row.last4}`);
  };

  const removeCard = (id) => {
    persistPayments(payments.filter((p) => p.id !== id));
    onToast?.('Removed', 'Payment method deleted.');
  };

  const submitReturn = (e) => {
    e.preventDefault();
    if (!returnForm.orderId) {
      onToast?.('Select order', 'Choose an order to return.', 'error');
      return;
    }
    const row = {
      id: `ret_${Date.now()}`,
      ...returnForm,
      status: 'Requested',
      createdAt: new Date().toISOString()
    };
    const next = [row, ...returns];
    setReturns(next);
    saveReturns(next);
    setReturnForm({ orderId: '', reason: 'Damaged', note: '' });
    onToast?.('Return requested', 'We will review your request shortly.');
  };

  const submitTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      onToast?.('Missing fields', 'Subject and message are required.', 'error');
      return;
    }
    const row = {
      id: `tkt_${Date.now()}`,
      ...ticketForm,
      status: 'Open',
      createdAt: new Date().toISOString()
    };
    const next = [row, ...tickets];
    setTickets(next);
    saveTickets(next);
    setTicketForm({ category: 'Orders', subject: '', message: '' });
    onToast?.('Ticket created', row.id);
  };

  const saveProfile = (e) => {
    e.preventDefault();
    const updated = { ...user, name: profile.name.trim() || user.name };
    saveUser(updated);
    onUpdateUser?.(updated);
    onToast?.('Profile updated', 'Your name was saved.');
  };

  const savePreferences = () => {
    savePrefs(prefs);
    onToast?.('Preferences saved', 'Communication settings updated.');
  };

  const TRACK = ['Placed', 'Confirmed', 'Processing', 'Shipped', 'In Transit', 'Delivered'];

  return (
    <div className="fixed inset-0 z-[55] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">My account</h2>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onLogout} className="text-xs px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              Log out
            </button>
            <button type="button" onClick={onClose} className="text-xs px-3 py-1.5 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900">
              Close
            </button>
          </div>
        </div>

        <div className="flex gap-1 px-3 py-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                tab === t
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {tab === 'Overview' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ['Orders', orders.length],
                  ['Wishlist', wishlistCount],
                  ['Points', user.loyaltyPoints ?? 0],
                  ['Tier', user.loyaltyTier || 'Bronze']
                ].map(([label, val]) => (
                  <div key={label} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                    <p className="text-[11px] text-slate-500 uppercase">{label}</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white mt-0.5">{val}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={saveProfile} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Profile</h3>
                <label className="block text-xs text-slate-600 dark:text-slate-300">
                  Name
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 text-sm"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  />
                </label>
                <label className="block text-xs text-slate-600 dark:text-slate-300">
                  Email
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm"
                    value={profile.email}
                    disabled
                  />
                </label>
                <button type="submit" className="text-xs px-3 py-2 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium">
                  Save profile
                </button>
              </form>
            </>
          )}

          {tab === 'Orders' && (
            <div className="space-y-3">
              {orders.length === 0 && <p className="text-sm text-slate-500">No orders yet.</p>}
              {orders.map((order) => {
                const step = Math.min(
                  TRACK.indexOf(order.trackingStatus || 'Confirmed') >= 0
                    ? TRACK.indexOf(order.trackingStatus || 'Confirmed')
                    : 1,
                  TRACK.length - 1
                );
                return (
                  <div key={order.id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-xs font-mono text-indigo-600 dark:text-indigo-300">{order.id}</p>
                        <p className="text-[11px] text-slate-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <span className="text-[10px] font-semibold uppercase text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">
                        {order.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {TRACK.map((s, i) => (
                        <span
                          key={s}
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            i <= step
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    {order.trackingNumber && (
                      <p className="text-xs text-slate-500">
                        Tracking: {order.trackingNumber} · {order.carrier || 'Aura Logistics'}
                      </p>
                    )}
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      {(order.items || []).map((it, idx) => (
                        <li key={idx}>
                          {it.name} ×{it.quantity}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-600"
                        onClick={() => onReorder?.(order)}
                      >
                        Buy again
                      </button>
                      {!['Shipped', 'In Transit', 'Delivered', 'Cancelled'].includes(order.trackingStatus || order.status) && (
                        <button
                          type="button"
                          className="text-xs px-2.5 py-1.5 rounded border border-rose-200 text-rose-700"
                          onClick={() => onCancelOrder?.(order.id)}
                        >
                          Cancel order
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'Addresses' && (
            <div className="space-y-3">
              <button
                type="button"
                className="text-xs px-3 py-2 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium"
                onClick={() => {
                  setEditingAddr(null);
                  setAddrForm(emptyAddress);
                  setShowAddrForm(true);
                }}
              >
                Add address
              </button>
              {showAddrForm && (
                <form onSubmit={saveAddress} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-2">
                  {['fullName', 'phone', 'line1', 'line2', 'city', 'state', 'postal', 'country'].map((field) => (
                    <label key={field} className="block text-xs text-slate-600 dark:text-slate-300 capitalize">
                      {field.replace(/([A-Z])/g, ' $1')}
                      <input
                        className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 text-sm"
                        value={addrForm[field]}
                        onChange={(e) => setAddrForm((f) => ({ ...f, [field]: e.target.value }))}
                      />
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={addrForm.isDefaultShipping}
                      onChange={(e) => setAddrForm((f) => ({ ...f, isDefaultShipping: e.target.checked }))}
                    />
                    Default shipping
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={addrForm.isDefaultBilling}
                      onChange={(e) => setAddrForm((f) => ({ ...f, isDefaultBilling: e.target.checked }))}
                    />
                    Default billing
                  </label>
                  <div className="flex gap-2">
                    <button type="submit" className="text-xs px-3 py-2 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                      Save
                    </button>
                    <button type="button" className="text-xs px-3 py-2 rounded-md border" onClick={() => setShowAddrForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              {addresses.map((a) => (
                <div key={a.id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm">
                  <p className="font-medium text-slate-900 dark:text-white">{a.fullName}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} {a.postal}
                  </p>
                  <p className="text-xs text-slate-500">{a.country} · {a.phone}</p>
                  <div className="flex gap-2 mt-2">
                    {a.isDefaultShipping && <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-800">Ship default</span>}
                    {a.isDefaultBilling && <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-800">Bill default</span>}
                    <button
                      type="button"
                      className="text-xs text-slate-600 underline"
                      onClick={() => {
                        setEditingAddr(a.id);
                        setAddrForm(a);
                        setShowAddrForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="text-xs text-rose-600 underline" onClick={() => deleteAddress(a.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {addresses.length === 0 && !showAddrForm && <p className="text-sm text-slate-500">No saved addresses.</p>}
            </div>
          )}

          {tab === 'Payments' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Only last 4 digits are stored. Never enter a full card number or CVV.</p>
              <form onSubmit={addCard} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 grid grid-cols-2 gap-2">
                <label className="text-xs col-span-1">
                  Brand
                  <select
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-2 text-sm"
                    value={cardForm.brand}
                    onChange={(e) => setCardForm((f) => ({ ...f, brand: e.target.value }))}
                  >
                    <option>Visa</option>
                    <option>Mastercard</option>
                    <option>Amex</option>
                  </select>
                </label>
                <label className="text-xs">
                  Last 4
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-2 text-sm"
                    maxLength={4}
                    value={cardForm.last4}
                    onChange={(e) => setCardForm((f) => ({ ...f, last4: e.target.value.replace(/\D/g, '') }))}
                  />
                </label>
                <label className="text-xs">
                  Expiry
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-2 text-sm"
                    placeholder="MM/YY"
                    value={cardForm.exp}
                    onChange={(e) => setCardForm((f) => ({ ...f, exp: e.target.value }))}
                  />
                </label>
                <label className="text-xs">
                  Name on card
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-2 text-sm"
                    value={cardForm.name}
                    onChange={(e) => setCardForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </label>
                <button type="submit" className="col-span-2 text-xs px-3 py-2 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                  Add payment method
                </button>
              </form>
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {p.brand} •••• {p.last4}
                    </p>
                    <p className="text-xs text-slate-500">Exp {p.exp}</p>
                  </div>
                  <button type="button" className="text-xs text-rose-600" onClick={() => removeCard(p.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'Returns' && (
            <div className="space-y-3">
              <form onSubmit={submitReturn} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-2">
                <label className="block text-xs">
                  Order
                  <select
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-2 text-sm"
                    value={returnForm.orderId}
                    onChange={(e) => setReturnForm((f) => ({ ...f, orderId: e.target.value }))}
                  >
                    <option value="">Select…</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs">
                  Reason
                  <select
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-2 text-sm"
                    value={returnForm.reason}
                    onChange={(e) => setReturnForm((f) => ({ ...f, reason: e.target.value }))}
                  >
                    {['Damaged', 'Wrong product', 'Defective', 'Not as described', 'Size issue', 'Changed mind', 'Other'].map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs">
                  Note
                  <textarea
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-2 text-sm"
                    value={returnForm.note}
                    onChange={(e) => setReturnForm((f) => ({ ...f, note: e.target.value }))}
                  />
                </label>
                <button type="submit" className="text-xs px-3 py-2 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                  Submit return
                </button>
              </form>
              {returns.map((r) => (
                <div key={r.id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm">
                  <p className="font-medium">{r.id} · {r.status}</p>
                  <p className="text-xs text-slate-500">
                    Order {r.orderId} · {r.reason}
                  </p>
                </div>
              ))}
            </div>
          )}

          {tab === 'Support' && (
            <div className="space-y-3">
              <form onSubmit={submitTicket} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-2">
                <label className="block text-xs">
                  Category
                  <select
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-2 text-sm"
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    {['Orders', 'Payments', 'Shipping', 'Returns', 'Products', 'Account'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs">
                  Subject
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-2 text-sm"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm((f) => ({ ...f, subject: e.target.value }))}
                  />
                </label>
                <label className="block text-xs">
                  Message
                  <textarea
                    className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-2 py-2 text-sm min-h-[80px]"
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm((f) => ({ ...f, message: e.target.value }))}
                  />
                </label>
                <button type="submit" className="text-xs px-3 py-2 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                  Create ticket
                </button>
              </form>
              {tickets.map((t) => (
                <div key={t.id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm">
                  <p className="font-medium">
                    {t.subject} · {t.status}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t.category} · {t.id}
                  </p>
                </div>
              ))}
            </div>
          )}

          {tab === 'Preferences' && (
            <div className="space-y-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              {[
                ['emailMarketing', 'Email marketing'],
                ['smsAlerts', 'SMS alerts'],
                ['notifications', 'In-app notifications']
              ].map(([key, label]) => (
                <label key={key} className="flex items-center justify-between text-sm">
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={!!prefs[key]}
                    onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))}
                  />
                </label>
              ))}
              <button type="button" onClick={savePreferences} className="text-xs px-3 py-2 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                Save preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
