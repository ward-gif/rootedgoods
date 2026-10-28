#!/usr/bin/env bash
set -euo pipefail
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec "$HIER/.venv/bin/python" "$HIER/bin/clarity.py" "$@"
