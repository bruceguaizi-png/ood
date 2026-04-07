"use client";

import { useEffect } from "react";

import { captureClientEvent } from "@/lib/client/posthog";

export function TrackView(props: {
  event: string;
  properties?: Record<string, unknown>;
}) {
  useEffect(() => {
    captureClientEvent(props.event, props.properties);
  }, [props.event, props.properties]);

  return null;
}
