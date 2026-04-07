import { PostHog } from "posthog-node";

import { env, hasPosthog } from "@/lib/server/env";

let posthog: PostHog | null = null;

function getPosthog() {
  if (!hasPosthog()) return null;
  if (!posthog) {
    posthog = new PostHog(env.posthogKey ?? "", {
      host: env.posthogHost,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthog;
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
) {
  const client = getPosthog();
  if (!client) {
    return { provider: "mock", event };
  }

  client.capture({
    distinctId,
    event,
    properties,
  });
  await client.shutdown();
  posthog = null;
  return { provider: "posthog", event };
}
