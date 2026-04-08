"use client";

import { useState } from "react";

import { TRACKING_EVENTS } from "@/lib/constants";
import { captureClientEvent } from "@/lib/client/posthog";
import { type IntakeSession } from "@/lib/types";
import { currency } from "@/lib/utils";
import { TurnstileField } from "@/components/turnstile-field";

export function CheckoutButton(props: {
  session: IntakeSession;
  price: number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string>();

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      captureClientEvent(TRACKING_EVENTS.checkoutStart, {
        sessionId: props.session.id,
        coreType: props.session.baseProfile.coreType,
      });

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intakeSessionId: props.session.id,
          email: props.session.email,
          turnstileToken: token,
        }),
      });

      if (!response.ok) throw new Error("Checkout could not start yet.");

      const data = (await response.json()) as { checkoutUrl: string };
      window.location.href = data.checkoutUrl;
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <TurnstileField onToken={setToken} />
      {error ? (
        <p aria-live="polite" className="text-sm text-red-300">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        disabled={loading}
        onClick={() => void handleCheckout()}
        className="h-14 rounded-full bg-pink-200 px-6 text-sm font-semibold text-stone-950 transition hover:bg-pink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200/45 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Opening checkout…" : `Unlock full receipt for ${currency(props.price)}`}
      </button>
    </div>
  );
}
