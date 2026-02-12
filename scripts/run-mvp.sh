#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PORT_VALUE="${PORT:-3000}"

echo "Starting Lunatics Kitchen MVP on http://localhost:${PORT_VALUE}"
PORT="$PORT_VALUE" npm run dev
