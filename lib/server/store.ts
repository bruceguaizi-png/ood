import {
  createOrderFile,
  createOrUpdateReportFile,
  createSessionFile,
  getOrderByStripeSessionIdFile,
  getOrderFile,
  getReportByOrderIdFile,
  getReportBySessionAndKindFile,
  getReportFile,
  getSessionFile,
  listOrdersByEmailFile,
  listOrdersByUserIdFile,
  syncOwnedRecordsForUserFile,
  updateOrderFile,
  updateSessionFile,
} from "@/lib/server/store-file";
import { type IntakePayload, type IntakeSession, type Order, type ReportRecord } from "@/lib/types";

export async function createSession(
  payload: IntakePayload,
  baseProfile: IntakeSession["baseProfile"],
  branchPreview: IntakeSession["branchPreview"],
  userId?: string | null,
) {
  return createSessionFile(payload, baseProfile, branchPreview, userId);
}

export async function updateSession(sessionId: string, updates: Partial<IntakeSession>) {
  return updateSessionFile(sessionId, updates);
}

export async function getSession(sessionId: string) {
  return getSessionFile(sessionId);
}

export async function createOrder(input: {
  intakeSessionId: string;
  email: string;
  stripeSessionId: string;
  paymentStatus?: Order["paymentStatus"];
  reportStatus?: Order["reportStatus"];
  sku: Order["sku"];
  reportKind: Order["reportKind"];
  userId?: string | null;
}) {
  return createOrderFile(input);
}

export async function updateOrder(orderId: string, updates: Partial<Order>) {
  return updateOrderFile(orderId, updates);
}

export async function getOrder(orderId: string) {
  return getOrderFile(orderId);
}

export async function getOrderByStripeSessionId(stripeSessionId: string) {
  return getOrderByStripeSessionIdFile(stripeSessionId);
}

export async function listOrdersByEmail(email: string) {
  return listOrdersByEmailFile(email);
}

export async function listOrdersByUserId(userId: string) {
  return listOrdersByUserIdFile(userId);
}

export async function syncOwnedRecordsForUser(input: {
  userId: string;
  email: string;
}) {
  return syncOwnedRecordsForUserFile(input);
}

export async function createOrUpdateReport(report: ReportRecord) {
  return createOrUpdateReportFile(report);
}

export async function getReport(reportId: string) {
  return getReportFile(reportId);
}

export async function getReportByOrderId(orderId: string) {
  return getReportByOrderIdFile(orderId);
}

export async function getReportBySessionAndKind(
  sessionId: string,
  kind: ReportRecord["kind"],
) {
  return getReportBySessionAndKindFile(sessionId, kind);
}

export async function upsertUserProfile() {
  return null;
}
