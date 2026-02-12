# Lunatics Kitchen MVP Runbook

## 1) Local Startup

### Standard
```bash
npm run dev
```

### Alternative launchers
- macOS/Linux: `./scripts/run-mvp.sh`
- Windows: `scripts\\run-mvp.bat`

Server binds to `0.0.0.0` and defaults to port `3000`.

## 2) Custom Port

### macOS/Linux
```bash
PORT=3001 npm run dev
```

### Windows (cmd)
```bat
set PORT=3001 && npm run dev
```

## 3) Health Verification

1. Visit `http://localhost:<PORT>`.
2. Confirm menu cards load.
3. Add an item and confirm free water appears for first/new user.
4. Go to payment step and verify subtotal/tax/delivery/payable breakdown.

## 4) Test Suite
```bash
npm test
```

Expected: all business-rule tests pass.

## 5) Common Issues

### Port already in use
Use a different `PORT` value.

### Node not found
Install Node.js 18+ and retry.

### Browser shows stale content
Hard refresh (`Ctrl/Cmd + Shift + R`).
