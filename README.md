# Aura Commerce

Interactive React + Vite + Tailwind storefront (demo / sandbox).

## Quick start

```bash
npm install
npm run dev
```

## Demo account

- Email: `demo@aura.com`
- Password: `demo`

Or create an account via **Sign in → Create account**.

## What's included

### Storefront
- Product catalog, search, filters, sort, compare
- Product modal, cart, wishlist (localStorage)
- Multi-step checkout (address → shipping → payment → review)
- Coupons: `AURA15`, `SAVE20`, `FLAT10`
- Light / dark theme
- Merchant suite toggle

### Customer account
- Sign up / login / logout / forgot password (demo)
- Profile overview & loyalty tier/points
- Order history with tracking steps, cancel, buy again
- Address book (add / edit / delete / defaults)
- Saved payment methods (last 4 digits only — never full PAN/CVV)
- Returns requests
- Support tickets
- Communication preferences

### Persistence
Cart, wishlist, orders, user session, addresses, payments, returns, tickets, and prefs are stored in the browser.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm test` | Vitest unit tests |

## Notes

- No real payments, email, or maps APIs
- Not for production clinical/financial use
- Git history includes feature-branch merges (PR-style)
