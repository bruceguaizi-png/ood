"use client";

import Link from "next/link";
import { useState } from "react";

import { RitualCard } from "@/components/ritual-card";
import {
  readActiveSession,
  type ActiveSessionSnapshot,
} from "@/lib/client/active-session";
import {
  readAmuletDraft,
  readBag,
  readRecentReports,
  readTestResultDetail,
  readTestSummary,
  type AmuletDraft,
  type BagItem,
  type RecentReportSummary,
  type TestSummary,
} from "@/lib/client/ritual-bag";

export function ProfileCenterClient() {
  const [bag] = useState<BagItem[]>(() => readBag());
  const [recentReports] = useState<RecentReportSummary[]>(() => readRecentReports());
  const [testSummary] = useState<TestSummary | null>(() => readTestSummary());
  const [testDetail] = useState(() => readTestResultDetail());
  const [amulet] = useState<AmuletDraft | null>(() => readAmuletDraft());
  const [activeSession] = useState<ActiveSessionSnapshot | null>(() => readActiveSession());

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <RitualCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Latest signal</p>
          <h2 className="text-balance font-serif text-4xl text-stone-50">
            {testSummary
              ? testSummary.title
              : activeSession
                ? activeSession.coreType
                : "No base reading yet"}
          </h2>
          <p className="text-sm leading-7 text-stone-300">
            {testSummary
              ? testSummary.summary
              : activeSession
                ? "Your base reading is active. Run a side ritual to generate a fresh secondary signal."
                : "Start your base reading first. Side rituals unlock after the first intake."}
          </p>
          {activeSession ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-stone-300">
              Base reading: <span className="font-medium text-stone-100">{activeSession.coreType}</span>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
            >
              Return to Oracle Entry
            </Link>
            <Link
              href="/quiz"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
            >
              Open Full Ritual
            </Link>
            {testDetail ? (
              <Link
                href={testDetail.nextHref}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
              >
                Re-open Latest Side Ritual
              </Link>
            ) : null}
          </div>
        </RitualCard>

        <RitualCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-pink-200/75">My ritual bag</p>
          <h2 className="text-balance font-serif text-4xl text-stone-50">
            {bag.length === 0 ? "Empty altar" : `${bag.length} staged items`}
          </h2>
          <div className="flex flex-wrap gap-2">
            {bag.length === 0 ? (
              <p className="text-sm text-stone-300">
                Add prototype goods from the shop to make this feel like a real account center.
              </p>
            ) : (
              bag.map((item, index) => (
                <div
                  key={`${item.slug}-${index}`}
                  className="tabular-nums rounded-full border border-white/10 px-3 py-1 text-xs text-stone-100"
                >
                  {item.title} · {item.priceLabel}
                </div>
              ))
            )}
          </div>
          <Link
            href="/shop"
            className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
          >
            Open Artifact Vault
          </Link>
        </RitualCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <RitualCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Recent reports</p>
          <div className="space-y-3">
            <Link
              href="/report/demo-report?email=ritual%40ood.aura"
              className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
            >
              <div className="font-serif text-2xl text-stone-50">Demo confidence ritual</div>
              <div className="mt-2 text-sm text-stone-300">
                Live artifact with downloads and history support.
              </div>
            </Link>
            {recentReports.map((report) => (
              <Link
                key={report.reportId}
                href={`/report/${report.reportId}`}
                className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
              >
                <div className="text-balance font-serif text-2xl text-stone-50">{report.title}</div>
                <div className="tabular-nums mt-2 text-sm text-stone-300">
                  {report.theme} · {report.date}
                </div>
              </Link>
            ))}
          </div>
        </RitualCard>

        <RitualCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-stone-400">My artifacts</p>
          {amulet ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-balance font-serif text-3xl text-stone-50">{amulet.name}</div>
              <div className="mt-2 text-sm uppercase tracking-[0.18em] text-cyan-200/75">
                {amulet.element} channel · {amulet.sigil}
              </div>
              <p className="mt-3 text-sm leading-7 text-stone-300">{amulet.wish}</p>
            </div>
          ) : (
            <p className="text-sm text-stone-300">
              No saved amulet yet. Generate one in the collection lab to make this center feel alive.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/collection"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
            >
              Open Collection Lab
            </Link>
            <Link
              href="/me/history?email=ritual%40ood.aura"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
            >
              Full History
            </Link>
          </div>
        </RitualCard>
      </div>
    </div>
  );
}
