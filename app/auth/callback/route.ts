import { NextResponse, type NextRequest } from "next/server";

import { syncOwnedRecordsForUser } from "@/lib/server/store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeNextPath(input: string | null) {
  if (!input || !input.startsWith("/")) return "/profile";
  return input;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const nextPath = safeNextPath(url.searchParams.get("next"));
  const redirectUrl = new URL(nextPath, url.origin);
  const supabase = await createSupabaseServerClient();

  const code = url.searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const loginUrl = new URL("/auth/login", url.origin);
      loginUrl.searchParams.set("next", nextPath);
      loginUrl.searchParams.set("error", "link_expired");
      return NextResponse.redirect(loginUrl);
    }
  } else {
    const tokenHash = url.searchParams.get("token_hash");
    const type = url.searchParams.get("type");

    if (tokenHash && (type === "email" || type === "magiclink")) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });
      if (error) {
        const loginUrl = new URL("/auth/login", url.origin);
        loginUrl.searchParams.set("next", nextPath);
        loginUrl.searchParams.set("error", "link_expired");
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id && user.email) {
    await syncOwnedRecordsForUser({
      userId: user.id,
      email: user.email,
    });
  }

  return NextResponse.redirect(redirectUrl);
}
