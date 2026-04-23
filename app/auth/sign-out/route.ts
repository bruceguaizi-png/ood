import { NextResponse } from "next/server";

import { env } from "@/lib/server/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/", env.appUrl));
}
