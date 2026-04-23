import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import {
  requireSupabaseAnonKey,
  requireSupabaseServiceRoleKey,
  requireSupabaseUrl,
} from "@/lib/supabase/config";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(requireSupabaseUrl(), requireSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookieValues) {
        try {
          for (const cookie of cookieValues) {
            cookieStore.set(cookie);
          }
        } catch {}
      },
    },
  });
}

export function createSupabaseAdminClient() {
  return createClient(requireSupabaseUrl(), requireSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
