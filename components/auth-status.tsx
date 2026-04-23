import Link from "next/link";

import { getCurrentUser } from "@/lib/server/auth";

export async function AuthStatus() {
  const user = await getCurrentUser();

  if (!user?.email) {
    return (
      <Link
        href="/auth/login"
        className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
          >
            {user.email}
      </Link>
      <form action="/auth/sign-out" method="post">
        <button
          type="submit"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
