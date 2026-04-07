function getEnv(name: string) {
  return process.env[name];
}

export const env = {
  nodeEnv: getEnv("NODE_ENV") ?? "development",
  appUrl: getEnv("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000",
  stripeSecretKey: getEnv("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: getEnv("STRIPE_WEBHOOK_SECRET"),
  stripePriceId: getEnv("STRIPE_MANIFEST_PRICE_ID"),
  resendApiKey: getEnv("RESEND_API_KEY"),
  resendFrom: getEnv("RESEND_FROM") ?? "O.O.D <ritual@updates.ood.aura>",
  supabaseUrl: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  posthogKey: getEnv("NEXT_PUBLIC_POSTHOG_KEY"),
  posthogHost: getEnv("NEXT_PUBLIC_POSTHOG_HOST") ?? "https://us.i.posthog.com",
  turnstileSecretKey: getEnv("TURNSTILE_SECRET_KEY"),
  turnstileSiteKey: getEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY"),
};

export function hasStripe() {
  return Boolean(env.stripeSecretKey);
}

export function hasSupabase() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey && env.supabaseServiceRoleKey);
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
