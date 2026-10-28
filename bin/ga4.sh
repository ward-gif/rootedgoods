#!/usr/bin/env bash
# Draait het GA4-rapport met de Rooted Goods-identiteit, los van Bambook.
#
# Eenmalig opzetten: zie bin/ga4-setup.md
# Daarna gewoon:     bin/ga4.sh [extra argumenten voor ga4.py]
set -euo pipefail
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export CLOUDSDK_CONFIG="${CLOUDSDK_CONFIG:-$HOME/.config/gcloud-rootedgoods}"
export GOOGLE_APPLICATION_CREDENTIALS="${GOOGLE_APPLICATION_CREDENTIALS:-$CLOUDSDK_CONFIG/application_default_credentials.json}"
export GA4_PROPERTY_ID="${GA4_PROPERTY_ID:-551909322}"

if [ ! -f "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
  echo "AFGEBROKEN: geen Rooted Goods-credentials op $GOOGLE_APPLICATION_CREDENTIALS" >&2
  echo "" >&2
  echo "Dit is bewust een andere map dan je Bambook-gcloud (~/.config/gcloud)," >&2
  echo "zodat de twee identiteiten elkaar niet overschrijven." >&2
  echo "Eenmalig opzetten: zie bin/ga4-setup.md" >&2
  exit 1
fi

exec "$HIER/.venv/bin/python" "$HIER/bin/ga4.py" "$@"
