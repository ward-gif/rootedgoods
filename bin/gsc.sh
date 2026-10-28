#!/usr/bin/env bash
set -euo pipefail
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export CLOUDSDK_CONFIG="${CLOUDSDK_CONFIG:-$HOME/.config/gcloud-rootedgoods}"
export GOOGLE_APPLICATION_CREDENTIALS="${GOOGLE_APPLICATION_CREDENTIALS:-$CLOUDSDK_CONFIG/application_default_credentials.json}"
exec "$HIER/.venv/bin/python" "$HIER/bin/gsc.py" "$@"
