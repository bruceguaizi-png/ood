"use client";

import { useEffect, useState } from "react";

export function ReportStatusPoller(props: {
  reportId?: string;
  orderId?: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(props.initialStatus);

  useEffect(() => {
    if (status === "ready" || status === "failed") return;
    if (!props.reportId && !props.orderId) return;

    const interval = window.setInterval(async () => {
      const url = props.reportId
        ? `/api/report/${props.reportId}`
        : `/api/generate-report?orderId=${props.orderId}`;

      const response = await fetch(url);
      if (!response.ok) return;
      const data = await response.json();
      const nextStatus = data.report?.status ?? data.status;
      if (nextStatus) setStatus(nextStatus);
      if (nextStatus === "ready" || nextStatus === "failed") {
        window.clearInterval(interval);
        if (props.reportId && nextStatus === "ready") {
          window.location.reload();
        }
      }
    }, 2500);

    return () => window.clearInterval(interval);
  }, [props.orderId, props.reportId, status]);

  if (status === "ready") return null;

  return (
    <p
      aria-live="polite"
      className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs text-cyan-100"
    >
      Ritual generation status: {status}. This page refreshes automatically.
    </p>
  );
}
