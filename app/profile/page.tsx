import Link from "next/link";

import { ProfileCenterClient } from "@/components/profile-center-client";
import { PageHero } from "@/components/page-hero";
import { RitualCard } from "@/components/ritual-card";
import { Shell } from "@/components/shell";

const profileModules = [
  {
    title: "My Paid Deep Dives",
    body: "Review paid report state and retrieve purchased cross-over extensions.",
    href: "/me/history?email=ritual%40ood.aura",
  },
  {
    title: "My Free Cross-Over Reports",
    body: "Jump back into previously unlocked combined reports and exported assets.",
    href: "/report/demo-report?email=ritual%40ood.aura",
  },
  {
    title: "My Collection",
    body: "A future home for wallpapers, amulets, and saved visual artifacts.",
    href: "/collection",
  },
] as const;

export default function ProfilePage() {
  return (
    <Shell className="space-y-12" activeHref="/profile">
      <PageHero
        eyebrow="Personal Altar"
        title="Return to your archive, objects, and open signals."
        body="This should feel like a living console, not an account backend."
      />

      <section className="grid gap-5 lg:grid-cols-3">
        {profileModules.map((item) => (
          <RitualCard key={item.title} className="space-y-4">
            <h2 className="text-balance font-serif text-3xl text-stone-50">{item.title}</h2>
            <p className="text-sm leading-7 text-stone-300">{item.body}</p>
            <Link
              href={item.href}
              className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
            >
              Open
            </Link>
          </RitualCard>
        ))}
      </section>

      <ProfileCenterClient />
    </Shell>
  );
}
