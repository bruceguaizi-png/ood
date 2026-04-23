import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AppAuthUser = {
  id: string;
  email: string;
};

export const getCurrentUser = cache(async (): Promise<AppAuthUser | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id || !user.email) {
    return null;
  }

  return {
    id: user.id,
    email: user.email.toLowerCase(),
  };
});
