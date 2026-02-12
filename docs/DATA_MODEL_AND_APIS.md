# Data Model and API Design

## 1) Core Entities

## Users & Segments
- `users`
  - `id`, `phone`, `name`, `created_at`, `segment`, `is_new_login`
- `user_profiles`
  - addresses, preferences, wallet balance

## Catalog & Menu
- `menu_items`
  - `id`, `name`, `price`, `is_under_100`, `is_combo`, `is_active`
- `menu_item_images`
- `recipes`
- `recipe_ingredients`

## Orders
- `orders`
  - `id`, `user_id`, `type` (`instant`, `subscription`, `bulk`),
  - `status`, `subtotal`, `tax_amount`, `delivery_fee`, `total_amount`
- `order_items`
- `order_events` (status timeline)

## Subscription
- `subscriptions`
  - `id`, `user_id`, `meal_type`, `duration_days`, `start_date`, `status`
- `subscription_deliveries`
- `subscription_skips`

## Bulk Orders
- `bulk_orders`
  - `id`, `user_id`, `event_date`, `units`, `advance_percent`, `status`

## Inventory
- `ingredients`
- `inventory_ledger`
- `low_stock_alerts`

## Payments
- `payments`
  - `provider`, `provider_order_id`, `provider_payment_id`, `status`, `amount`
- `payment_webhook_logs`

## 2) Business Rules (Server-Enforced)

1. **Free water:** on order creation, append free water SKU when first-order or new-login criteria pass.
2. **No hidden charges:** final payable = subtotal + tax + delivery fee; expose full breakup before payment.
3. **Bulk date lock:** reject event dates within 7 days.
4. **Bulk units cap:** reject quantities > 200.
5. **Advance payment:** require 50–100% payment for bulk confirmation.
6. **Skip cutoff:** reject skip requests if < 4 hours before meal slot.
7. **Inventory floor:** if low-stock threshold crossed, auto-flag menu availability.

## 3) API Surface (Example)

## Auth
- `POST /api/auth/otp/request`
- `POST /api/auth/otp/verify`

## Menu & Cart
- `GET /api/menu?under100=true&combos=true`
- `POST /api/cart/price-preview`
  - Applies taxes, delivery fee, free-water rule in preview response.

## Orders
- `POST /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders/:id/cancel`

## Subscriptions
- `POST /api/subscriptions`
- `GET /api/subscriptions/:id`
- `POST /api/subscriptions/:id/skip`

## Bulk Orders
- `POST /api/bulk-orders`
- `GET /api/bulk-orders/:id`

## Payments
- `POST /api/payments/razorpay/create-order`
- `POST /api/payments/razorpay/webhook`

## Kitchen/Admin
- `GET /api/kds/feed`
- `GET /api/admin/analytics/repeat-order-rate`
- `GET /api/admin/segments`

## 4) Eventing & Realtime

- Publish order events to `kds_orders` channel.
- Publish inventory changes to `inventory_updates` channel.
- Admin dashboard consumes aggregated metrics from scheduled materialized views.

