#!/usr/bin/env python3
"""Events van de laatste 30 minuten uit GA4 Realtime, per eventName. Voor het testen van formulieren.
  CLOUDSDK_CONFIG=~/.config/gcloud-rootedgoods GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud-rootedgoods/application_default_credentials.json \
  ./.venv/bin/python docs/metingen/2026-11-11-lead-check/ga4-realtime.py"""
import os
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import Dimension, Metric, RunRealtimeReportRequest
cl = BetaAnalyticsDataClient(); PROP = os.environ.get("GA4_PROPERTY_ID", "551909322")
r = cl.run_realtime_report(RunRealtimeReportRequest(property=f"properties/{PROP}",
    dimensions=[Dimension(name="eventName")], metrics=[Metric(name="eventCount")], limit=100))
print("eventName | aantal (laatste 30 minuten, GA4 Realtime)")
for x in sorted(r.rows, key=lambda x: -int(x.metric_values[0].value)):
    print(" | ".join(v.value for v in x.dimension_values) + " | " + x.metric_values[0].value)
print(f"{len(r.rows)} rijen")
