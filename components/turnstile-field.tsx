"use client";

import { Turnstile } from "@marsidev/react-turnstile";

type TurnstileFieldProps = {
  onToken: (token?: string) => void;
};

export function TurnstileField({ onToken }: TurnstileFieldProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return (
      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/55">
        Bot protection is running in mock mode for local beta.
      </div>
    );
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={(token) => onToken(token)}
      onExpire={() => onToken(undefined)}
      options={{ theme: "dark", size: "flexible" }}
    />
  );
}
