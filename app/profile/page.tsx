import Link from "next/link";

import { ProfileCenterClient } from "@/components/profile-center-client";
import { PageHero } from "@/components/page-hero";
import { RitualCard } from "@/components/ritual-card";
import { Shell } from "@/components/shell";

const profileModules = [
  {
    title: "My Orders",
    body: "Review checkout state and retrieve purchased ritual artifacts.",
    href: "/me/history?email=ritual%40ood.aura",
  },
  {
    title: "My Reports",
    body: "Jump straight into previously generated readings and downloads.",
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
        eyebrow="User center"
        title="Your ritual table, archive, and objects in one place."
        body="This center should feel less like an account backend and more like a living surface: recent readings, staged goods, saved amulets, and quick re-entry into the world."
      />

      <section className="grid gap-5 lg:grid-cols-3">
        {profileModules.map((item) => (
          <RitualCard key={item.title} className="space-y-4">
            <h2 className="font-serif text-3xl text-stone-50">{item.title}</h2>
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
