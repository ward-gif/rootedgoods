#!/usr/bin/env bash
# Opnieuw inloggen voor GA4 en Search Console (de ADC-token verloopt). Alleen jij kunt dit: het opent de browser.
# Gebruik, uit de repo-wortel:  bin/ga4-login.sh
set -euo pipefail
export CLOUDSDK_CONFIG="${CLOUDSDK_CONFIG:-$HOME/.config/gcloud-rootedgoods}"
gcloud auth application-default login --impersonate-service-account=ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com
