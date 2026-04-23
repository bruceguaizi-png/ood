import { type AppAuthUser } from "@/lib/server/auth";
import { type Order, type ReportRecord } from "@/lib/types";

export function canAccessReport(report: ReportRecord, user: AppAuthUser | null) {
  if (report.id === "demo-report") return true;
  if (!user) return false;

  const normalizedUserEmail = user.email.toLowerCase();
  return report.userId === user.id || report.email.toLowerCase() === normalizedUserEmail;
}

export function canAccessOrder(order: Order, user: AppAuthUser | null) {
  if (order.id === "demo-order") return true;
  if (!user) return false;

  const normalizedUserEmail = user.email.toLowerCase();
  return order.userId === user.id || order.email.toLowerCase() === normalizedUserEmail;
}
