import { NextResponse } from "next/server";

import { absoluteUrl } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { authSignInSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = authSignInSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid sign-in payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const callbackUrl = new URL("/auth/callback", absoluteUrl("/"));
  callbackUrl.searchParams.set("next", parsed.data.nextPath ?? "/profile");

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: callbackUrl.toString(),
      shouldCreateUser: true,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    mode: "magic_link",
  });
}
