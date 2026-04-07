import { env, hasTurnstile } from "@/lib/server/env";

export async function verifyTurnstile(token?: string) {
  if (!hasTurnstile()) return { ok: true, provider: "mock" as const };
  if (!token) return { ok: false, provider: "turnstile" as const };

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: env.turnstileSecretKey ?? "",
      response: token,
    }),
  });

  const json = (await response.json()) as { success?: boolean };
  return { ok: Boolean(json.success), provider: "turnstile" as const };
}
