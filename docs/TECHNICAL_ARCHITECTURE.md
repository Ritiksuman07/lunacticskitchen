# Technical Architecture

## 1) Stack Decisions

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS + PWA manifest/service worker.
- **Backend Platform:** Supabase
  - Postgres for transactional data,
  - Auth (Phone OTP),
  - Realtime channels for KDS,
  - Edge Functions for secure business logic.
- **Payments:** Razorpay (UPI, cards, netbanking) with verified webhooks.
- **Hosting:** Vercel (frontend + edge) + Supabase managed services.

## 2) High-Level Module Map

1. **Storefront App** (mobile-first web app)
2. **Checkout & Payment Service**
3. **Subscription Scheduler**
4. **Bulk Orders Service**
5. **KDS Realtime Console**
6. **Inventory & Cost Guardrails**
7. **Admin Analytics Console**

## 3) Key Data Flows

### A. Standard Order Flow
1. User signs in with phone OTP.
2. Menu fetched with availability and pricing.
3. Cart pricing engine computes final amount including tax and delivery label.
4. Free-water rule evaluated and applied when eligible.
5. Razorpay order created and paid.
6. Payment webhook marks order paid.
7. Order pushed to KDS realtime lane.
8. Inventory decremented by recipe ingredient mapping.

### B. Subscription Flow
1. User selects meal type + duration (7/15/30).
2. Subscription instance is created with delivery schedule.
3. Daily jobs materialize next delivery orders.
4. Skip request validates 4-hour cutoff.
5. Valid skip creates wallet credit and reschedules/marks skipped.

### C. Bulk Order Flow
1. User picks date (>= 7 days in future).
2. Quantity validator enforces max 200 units.
3. Advance payment rule enforces 50–100% upfront.
4. Confirmed order appears in “Future Bulk Orders” KDS lane.

## 4) Suggested Next.js Route Structure

- `/` — Home + featured menu blocks
- `/menu` — full menu with “Under ₹100” and combos filters
- `/checkout` — cart/address/payment
- `/subscriptions` — create and manage plans
- `/bulk-order` — date-locked bulk booking flow
- `/kitchen` — KDS console (protected role)
- `/admin` — metrics and segmentation dashboards (protected role)

## 5) Security & Governance

- Use Supabase Row Level Security for every table.
- Roles:
  - `customer`,
  - `kitchen_staff`,
  - `admin`.
- Payment webhook endpoint must validate signatures.
- Store payment IDs and reconciliation status for audit.

## 6) Performance Strategy

- Static pre-render menu shells where possible.
- Use image optimization with modern formats (WebP/AVIF).
- Cache menu and public metadata via CDN.
- Stream realtime-only components for KDS/admin screens.
- Track Web Vitals (LCP, INP, CLS) and set budgets.

## 7) Deployment Topology

- Vercel project for Next.js frontend.
- Supabase project per environment (`dev`, `staging`, `prod`).
- CI pipeline:
  - lint + typecheck + tests,
  - DB migration checks,
  - preview deploys on PR,
  - production deploy on main.

