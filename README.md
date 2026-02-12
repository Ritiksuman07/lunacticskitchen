# Lunatics Kitchen Web Platform (MVP)

A production-oriented MVP for **Lunatics Kitchen** focused on affordable daily ordering, subscription workflows, and bulk catering operations.

## Table of Contents
- [Overview](#overview)
- [Core MVP Features](#core-mvp-features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Business Rules Implemented](#business-rules-implemented)
- [Documentation](#documentation)
- [Testing](#testing)
- [Screenshots](#screenshots)

## Overview
This repository includes:
- A runnable MVP web experience with mobile-first dark UI.
- Embedded product logic for pricing transparency, promos, subscriptions, and bulk constraints.
- Kitchen/admin operational surfaces (KDS lanes, SOP panel, KPI snapshot).
- Product and architecture documentation for future scale-up to Next.js + Supabase + Razorpay.

## Core MVP Features
### Customer Experience
- **Menu browsing** with `Under ₹100` and `+1 Combos` filters.
- **Direct checkout flow**: `Cart -> Address -> Payment`.
- **No hidden charges** with explicit subtotal, tax, delivery fee, and final payable amount.
- **Free water promo** auto-applied for first order/new login users.

### Subscription and Bulk
- **Daily Habit module** with meal type and duration controls.
- **Skip guardrail** requiring at least 4-hour notice.
- **Bulk order module** with:
  - minimum 7-day advance booking,
  - quantity cap of 200,
  - 50-100% upfront payment validation.

### Operations
- **Kitchen Display System (KDS)** split into Immediate vs Future Bulk lanes.
- **SOP viewer** from order line-items.
- **Admin snapshot** with Repeat Order Rate and segment counters.

## Tech Stack
- **Runtime:** Node.js (no external package install required for current MVP runtime).
- **Frontend delivery:** Static HTML/CSS/JS served by a lightweight Node HTTP server.
- **Tests:** Node built-in test runner (`node --test`).

## Quick Start
### Prerequisites
- Node.js 18+ recommended.

### Run locally
```bash
npm run dev
```
Open: `http://localhost:3000`

### One-click launch scripts
- Windows: `scripts\run-mvp.bat`
- macOS/Linux: `./scripts/run-mvp.sh`

Custom port examples:
```bash
PORT=3001 ./scripts/run-mvp.sh
```
```bat
set PORT=3001 && scripts\run-mvp.bat
```

## Project Structure
```text
.
├── public/index.html              # MVP UI and interaction logic
├── server.js                      # Lightweight static server
├── lib/businessRules.js           # Reusable business rules + validators
├── test/businessRules.test.js     # Business rule tests
├── scripts/run-mvp.sh             # macOS/Linux launcher
├── scripts/run-mvp.bat            # Windows launcher
└── docs/                          # Product/architecture/roadmap docs
```

## Business Rules Implemented
- Free-water eligibility on first order/new login.
- Transparent pricing with explicit delivery fee.
- Subscription skip allowed only with >=4 hours notice.
- Bulk booking date lock >=7 days, max units=200, advance=50-100%.

## Documentation
- [Product Requirements](docs/PRODUCT_REQUIREMENTS.md)
- [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md)
- [Data Model and APIs](docs/DATA_MODEL_AND_APIS.md)
- [Roadmap](docs/ROADMAP.md)
- [Runbook](docs/RUNBOOK.md)

## Testing
```bash
npm test
```

## Screenshots
Latest MVP screenshots are captured in PR artifacts (home and checkout states) and referenced in release notes.
