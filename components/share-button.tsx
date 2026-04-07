"use client";

import { useState } from "react";

import { TRACKING_EVENTS } from "@/lib/constants";
import { captureClientEvent } from "@/lib/client/posthog";

export function ShareButton(props: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    captureClientEvent(TRACKING_EVENTS.shareClick, {
      text: props.text,
    });

    if (navigator.share) {
      await navigator.share({ text: props.text });
      return;
    }

    await navigator.clipboard.writeText(props.text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      className="rounded-full border border-pink-300/25 bg-pink-300/12 px-4 py-2 text-sm font-medium text-pink-100 transition hover:bg-pink-300/20"
    >
      {copied ? "Copied ritual caption" : "Share this receipt"}
    </button>
  );
}
