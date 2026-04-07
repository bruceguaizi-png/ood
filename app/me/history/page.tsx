import Link from "next/link";

import { EmailHistoryForm } from "@/components/email-history-form";
import { RitualCard } from "@/components/ritual-card";
import { SectionLabel } from "@/components/section-label";
import { Shell } from "@/components/shell";
import { getReport, listOrdersByEmail } from "@/lib/server/store";

type HistoryPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const { email } = await searchParams;
  const orders = email ? await listOrdersByEmail(email) : [];

  return (
    <Shell className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <RitualCard className="space-y-6">
          <SectionLabel>History access</SectionLabel>
          <h1 className="font-serif text-4xl text-stone-50">Re-enter your receipts</h1>
          <p className="text-base leading-7 text-stone-300">
            Use the delivery email you checked out with. In local beta mode, this reads from the
            mock store so you can inspect the end-to-end flow without live credentials.
          </p>
          <EmailHistoryForm />
        </RitualCard>

        <div className="space-y-5">
          <SectionLabel>Orders</SectionLabel>
          {email && orders.length === 0 ? (
            <RitualCard>
              <p className="text-sm text-stone-300">No receipts found for {email} yet.</p>
            </RitualCard>
          ) : null}

          {!email ? (
            <RitualCard>
              <p className="text-sm text-stone-300">
                Enter an email to retrieve paid beta receipts and generated assets.
              </p>
            </RitualCard>
          ) : null}

          {await Promise.all(
            orders.map(async (order) => {
              const report = order.reportId ? await getReport(order.reportId) : null;
              return (
                <RitualCard key={order.id} className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-serif text-2xl text-stone-50">{order.sku.title}</p>
                      <p className="text-sm text-stone-400">{order.createdAt}</p>
                    </div>
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone-300">
                      {report?.status ?? order.reportStatus}
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-stone-300">
                    {report?.receipt?.summary ??
                      "This order exists, but the report is still generating or needs support."}
                  </p>
                  {report ? (
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/report/${report.id}?email=${encodeURIComponent(order.email)}`}
                        className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
                      >
                        Open receipt
                      </Link>
                      {report.assets.map((asset) => (
                        <Link
                          key={asset.kind}
                          href={asset.url}
                          className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
                        >
                          {asset.kind.toUpperCase()}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </RitualCard>
              );
            }),
          )}
        </div>
      </div>
    </Shell>
  );
}
