import { redirect } from "next/navigation";

import { AuthLoginForm } from "@/components/auth-login-form";
import { RitualCard } from "@/components/ritual-card";
import { SectionLabel } from "@/components/section-label";
import { Shell } from "@/components/shell";
import { getCurrentUser } from "@/lib/server/auth";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  const { next, error } = await searchParams;

  if (user) {
    redirect(next || "/profile");
  }

  const nextPath = next || "/profile";

  return (
    <Shell className="mx-auto max-w-2xl">
      <RitualCard className="space-y-6">
        <SectionLabel>Account Access</SectionLabel>
        <h1 className="font-serif text-4xl text-stone-50 sm:text-5xl">
          Enter your Oracle archive
        </h1>
        <p className="text-lg leading-8 text-stone-300">
          Enter your email and we&apos;ll send a secure magic link. One tap brings you back to your
          archive without passwords or extra setup.
        </p>
        {error === "link_expired" ? (
          <p className="text-sm text-amber-200">
            That link has expired or was already used. Request a fresh one below.
          </p>
        ) : null}
        <AuthLoginForm nextPath={nextPath} />
      </RitualCard>
    </Shell>
  );
}
