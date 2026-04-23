import { getSiteOrigin } from "@/lib/site-url";

function getEnv(name: string) {
  return process.env[name];
}

export const env = {
  nodeEnv: getEnv("NODE_ENV") ?? "development",
  appUrl: getSiteOrigin(),
  aiProvider: getEnv("AI_PROVIDER") ?? "responses",
  aiBaseUrl: getEnv("AI_BASE_URL") ?? "https://api.uniapi.io/v1",
  aiApiKey: getEnv("AI_API_KEY"),
  aiModel: getEnv("AI_MODEL") ?? "gemini-3-flash-preview",
  aiTemperature: Number(getEnv("AI_TEMPERATURE") ?? "0.7"),
  stripeSecretKey: getEnv("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: getEnv("STRIPE_WEBHOOK_SECRET"),
  stripePriceId: getEnv("STRIPE_MANIFEST_PRICE_ID"),
  resendApiKey: getEnv("RESEND_API_KEY"),
  resendFrom: getEnv("RESEND_FROM") ?? "O.O.D <ritual@updates.ood.aura>",
  supabaseUrl: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabasePublishableKey:
    getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ?? getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  supabaseProjectRef: getEnv("NEXT_PUBLIC_SUPABASE_PROJECT_REF"),
  posthogKey: getEnv("NEXT_PUBLIC_POSTHOG_KEY"),
  posthogHost: getEnv("NEXT_PUBLIC_POSTHOG_HOST") ?? "https://us.i.posthog.com",
  turnstileSecretKey: getEnv("TURNSTILE_SECRET_KEY"),
  turnstileSiteKey: getEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY"),
};

export function hasStripe() {
  return Boolean(env.stripeSecretKey);
}

export function hasAi() {
  return Boolean(env.aiApiKey);
}

export function hasSupabaseAuth() {
  return Boolean(env.supabaseUrl && env.supabasePublishableKey);
}

export function hasSupabaseAdmin() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

export function hasSupabase() {
  return hasSupabaseAuth();
}

export function hasResend() {
  return Boolean(env.resendApiKey);
}

export function hasPosthog() {
  return Boolean(env.posthogKey);
}

export function hasTurnstile() {
  return Boolean(env.turnstileSecretKey && env.turnstileSiteKey);
}
