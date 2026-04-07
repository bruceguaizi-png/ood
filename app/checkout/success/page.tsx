import Link from "next/link";

import { ReportStatusPoller } from "@/components/report-status-poller";
import { RitualCard } from "@/components/ritual-card";
import { SectionLabel } from "@/components/section-label";
import { Shell } from "@/components/shell";
import { generateReportFromOrder } from "@/lib/server/generate-report";
import { getOrder, getReport } from "@/lib/server/store";

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
    order_id?: string;
    mock?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { order_id: orderId, mock } = await searchParams;
  const order = orderId ? await getOrder(orderId) : null;
  let report = order?.reportId ? await getReport(order.reportId) : null;

  if (order && mock === "1" && !report) {
    report = await generateReportFromOrder(order.id);
  }

  return (
    <Shell className="mx-auto max-w-3xl">
      <RitualCard className="space-y-6">
        <SectionLabel>Checkout success</SectionLabel>
        <h1 className="font-serif text-4xl text-stone-50 sm:text-5xl">
          Payment captured. Your receipt is being assembled.
        </h1>
        <p className="text-lg leading-8 text-stone-300">
          We&apos;re composing your best move, caution, mantra, share card, and downloadable
          receipt pack now.
        </p>

        <ReportStatusPoller
          reportId={report?.id}
          orderId={order?.id}
          initialStatus={report?.status ?? order?.reportStatus ?? "queued"}
        />

        {report?.status === "ready" ? (
          <Link
            href={`/report/${report.id}?email=${encodeURIComponent(report.email)}`}
            className="inline-flex rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
          >
            Open my receipt
          </Link>
        ) : null}

        <div className="space-y-2 text-sm leading-7 text-stone-400">
          <p>Order ID: {order?.id ?? "pending"}</p>
          <p>Delivery email: {order?.email ?? "pending"}</p>
          <p>Status: {report?.status ?? order?.reportStatus ?? "queued"}</p>
        </div>
      </RitualCard>
    </Shell>
  );
}
