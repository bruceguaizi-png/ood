import { promises as fs } from "node:fs";
import path from "node:path";

import { nanoid } from "nanoid";

import { buildBaseProfile } from "@/lib/server/base-profile";
import { makeDemoOrder, makeDemoReport, makeDemoSession } from "@/lib/server/demo-data";
import {
  type IntakePayload,
  type IntakeSession,
  type Order,
  type PaymentStatus,
  type ReportRecord,
  type ReportStatus,
} from "@/lib/types";

type StoreShape = {
  sessions: Record<string, IntakeSession>;
  orders: Record<string, Order>;
  reports: Record<string, ReportRecord>;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "generated", "mock-db.json");

async function ensureStoreFile() {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    const initial: StoreShape = {
      sessions: { [makeDemoSession().id]: makeDemoSession() },
      orders: { [makeDemoOrder().id]: makeDemoOrder() },
      reports: { [makeDemoReport().id]: makeDemoReport() },
    };
    await fs.writeFile(dataFile, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readStore(): Promise<StoreShape> {
  await ensureStoreFile();
  const content = await fs.readFile(dataFile, "utf8");
  const store = JSON.parse(content) as StoreShape & {
    sessions: Record<string, IntakeSession & { preview?: { elementProfile: IntakeSession["baseProfile"]["elementDistribution"]; teaser?: string }; focusTheme?: string }>;
  };

  let changed = false;

  for (const [id, session] of Object.entries(store.sessions)) {
    if (!session.baseProfile) {
      store.sessions[id] = {
        ...session,
        name: session.name ?? "Aster",
        baseProfile: buildBaseProfile({
          name: session.name ?? "Aster",
          birthDate: session.birthDate,
          birthTime: session.birthTime,
          birthCity: session.birthCity,
          consentEntertainmentDisclaimer: session.consentEntertainmentDisclaimer,
          email: session.email,
        }),
      };
      changed = true;
    }
  }

  if (changed) {
    await writeStore(store as StoreShape);
  }

  return store as StoreShape;
}

async function writeStore(store: StoreShape) {
  await fs.writeFile(dataFile, JSON.stringify(store, null, 2), "utf8");
}

export async function createSession(
  payload: IntakePayload,
  baseProfile: IntakeSession["baseProfile"],
) {
  const store = await readStore();
  const session: IntakeSession = {
    id: `sess_${nanoid(12)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: payload.name,
    birthDate: payload.birthDate,
    birthTime: payload.birthTime,
    birthCity: payload.birthCity,
    consentEntertainmentDisclaimer: payload.consentEntertainmentDisclaimer,
    email: payload.email,
    baseProfile,
  };

  store.sessions[session.id] = session;
  await writeStore(store);
  return session;
}

export async function updateSession(sessionId: string, updates: Partial<IntakeSession>) {
  const store = await readStore();
  const session = store.sessions[sessionId];
  if (!session) return null;

  const next = {
    ...session,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  store.sessions[sessionId] = next;
  await writeStore(store);
  return next;
}

export async function getSession(sessionId: string) {
  const store = await readStore();
  return store.sessions[sessionId] ?? null;
}

export async function createOrder(input: {
  intakeSessionId: string;
  email: string;
  stripeSessionId: string;
  paymentStatus?: PaymentStatus;
  reportStatus?: ReportStatus;
  sku: Order["sku"];
}) {
  const store = await readStore();
  const order: Order = {
    id: `ord_${nanoid(12)}`,
    intakeSessionId: input.intakeSessionId,
    email: input.email,
    sku: input.sku,
    stripeSessionId: input.stripeSessionId,
    paymentStatus: input.paymentStatus ?? "requires_payment",
    reportStatus: input.reportStatus ?? "not_started",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.orders[order.id] = order;
  const session = store.sessions[input.intakeSessionId];
  if (session) {
    store.sessions[input.intakeSessionId] = {
      ...session,
      email: input.email,
      latestOrderId: order.id,
      updatedAt: new Date().toISOString(),
    };
  }

  await writeStore(store);
  return order;
}

export async function updateOrder(orderId: string, updates: Partial<Order>) {
  const store = await readStore();
  const order = store.orders[orderId];
  if (!order) return null;

  const next = {
    ...order,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  store.orders[orderId] = next;
  await writeStore(store);
  return next;
}

export async function getOrder(orderId: string) {
  const store = await readStore();
  return store.orders[orderId] ?? null;
}

export async function getOrderByStripeSessionId(stripeSessionId: string) {
  const store = await readStore();
  return (
    Object.values(store.orders).find(
      (order) => order.stripeSessionId === stripeSessionId,
    ) ?? null
  );
}

export async function listOrdersByEmail(email: string) {
  const store = await readStore();
  return Object.values(store.orders)
    .filter((order) => order.email.toLowerCase() === email.toLowerCase())
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function createOrUpdateReport(report: ReportRecord) {
  const store = await readStore();
  store.reports[report.id] = {
    ...report,
    updatedAt: new Date().toISOString(),
  };

  const order = store.orders[report.orderId];
  if (order) {
    store.orders[report.orderId] = {
      ...order,
      reportId: report.id,
      reportStatus: report.status,
      updatedAt: new Date().toISOString(),
    };
  }

  const session = store.sessions[report.intakeSessionId];
  if (session) {
    store.sessions[report.intakeSessionId] = {
      ...session,
      reportId: report.id,
      updatedAt: new Date().toISOString(),
    };
  }

  await writeStore(store);
  return store.reports[report.id];
}

export async function getReport(reportId: string) {
  const store = await readStore();
  return store.reports[reportId] ?? null;
}

export async function getReportByOrderId(orderId: string) {
  const store = await readStore();
  return (
    Object.values(store.reports).find((report) => report.orderId === orderId) ?? null
  );
}
