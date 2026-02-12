# Product Requirements (MVP)

## 1) Product Vision
Build a fast, no-nonsense food ordering web app for affordable daily meals, subscriptions, and small event catering.

## 2) Target Personas

### A. Rohan (Student)
- Budget-conscious and orders often.
- Wants honest pricing and fast checkout.
- Expects free water on first order/login promotion.

### B. Priya (Hostel Owner)
- Places recurring high-volume orders (e.g., 50 thalis/day).
- Needs reliability, repeatability, and easy subscription controls.

### C. Vikram (Party Planner)
- Books bulk food in advance for office/social events.
- Needs predictable pricing, date lock rules, and prepayment controls.

## 3) MVP Feature Scope

### A. Customer-Facing Experience

#### Home & Menu
- “Under ₹100” filter shown prominently at top.
- Visual menu with realistic, high-quality food images.
- “+1 Combos” section for value bundles.

#### Ordering Flow
- Three-step checkout: `Cart -> Address -> Payment`.
- Auto-add free 500 ml water bottle if:
  - `user_order_count == 0`, OR
  - `is_new_login == true`.
- Transparent pricing shown in cart and checkout:
  - taxes included in final amount,
  - explicit delivery line: `Delivery Fee: ₹0` or minimal fixed fee.

#### Subscription (“Daily Habit”) Engine
- Plan builder:
  - Meal type: Lunch / Dinner,
  - Duration: 7 / 15 / 30 days.
- Skip rule: user can skip with at least 4-hour notice.
- Skip creates wallet credit for future use.

#### Bulk Catering Module
- Simplified bulk menu (ready-to-serve packs).
- Quantity capped at 200 units/order.
- Date picker blocks dates < 7 days from current date.
- Upfront payment mandatory (50–100%) before confirmation.

### B. Kitchen Operations (Back Office)

#### Kitchen Display System (KDS)
- Real-time order feed with two lanes:
  - Immediate Delivery,
  - Future Bulk Orders.
- Clicking order item reveals SOP recipe/assembly steps.

#### Inventory Management
- Track ingredient usage against each placed order.
- Low-stock alerts, prioritizing “Under ₹100” core menu items.
- “Sold out” state reflected on customer-facing menu instantly.

### C. Admin Dashboard

#### Core Analytics
- Repeat Order Rate (top KPI).
- AOV (average order value).
- Subscription retention and skip behavior.

#### Segmentation
- Segment users as Student / Corporate / Hostel Manager.
- Enable promo targeting based on segment and repeat behavior.

## 4) UX/UI Principles
- Visual direction: Minimalist, industrial, “No BS”.
- Theme: Dark-mode dominant with red/orange accents.
- Typography: Bold, high-contrast headings.
- Performance goal: smooth behavior on budget smartphones over 4G.

## 5) Non-Functional Requirements
- P95 initial page load target under 2.5 seconds on 4G.
- UPI-first payment UX with strong webhook reconciliation.
- Phone OTP login for India-first onboarding.
- Production observability for order flow and payment events.

