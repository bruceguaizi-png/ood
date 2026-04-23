import { env } from "@/lib/server/env";

export function requireSupabaseUrl() {
  if (!env.supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
  }

  return env.supabaseUrl;
}

export function requireSupabaseAnonKey() {
  if (!env.supabasePublishableKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is required",
    );
  }

  return env.supabasePublishableKey;
}

export function requireSupabaseServiceRoleKey() {
  if (!env.supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  }

  return env.supabaseServiceRoleKey;
}
