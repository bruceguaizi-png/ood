"use client";

import { createBrowserClient } from "@supabase/ssr";

import { requireSupabaseAnonKey, requireSupabaseUrl } from "@/lib/supabase/config";

export function createSupabaseBrowserClient() {
  return createBrowserClient(requireSupabaseUrl(), requireSupabaseAnonKey());
}
