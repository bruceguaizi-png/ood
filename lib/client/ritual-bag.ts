"use client";

export type BagItem = {
  slug: string;
  title: string;
  priceLabel: string;
};

const bagKey = "ood_ritual_bag";
const recentReportsKey = "ood_recent_reports";
const testSummaryKey = "ood_test_summary";
const amuletDraftKey = "ood_amulet_draft";

export function readBag(): BagItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(bagKey);
    return raw ? (JSON.parse(raw) as BagItem[]) : [];
  } catch {
    return [];
  }
}

export function writeBag(items: BagItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(bagKey, JSON.stringify(items));
}

export function addToBag(item: BagItem) {
  const items = readBag();
  writeBag([...items, item]);
}

export function removeFromBag(slug: string) {
  const items = readBag().filter((item, index, array) => {
    const firstIndex = array.findIndex((candidate) => candidate.slug === slug);
    return !(item.slug === slug && index === firstIndex);
  });
  writeBag(items);
}

export function clearBag() {
  writeBag([]);
}

export type RecentReportSummary = {
  reportId: string;
  title: string;
  theme: string;
  date: string;
};

export function readRecentReports(): RecentReportSummary[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(recentReportsKey);
    return raw ? (JSON.parse(raw) as RecentReportSummary[]) : [];
  } catch {
    return [];
  }
}

export function pushRecentReport(summary: RecentReportSummary) {
  const existing = readRecentReports().filter((item) => item.reportId !== summary.reportId);
  const next = [summary, ...existing].slice(0, 6);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(recentReportsKey, JSON.stringify(next));
  }
}

export type TestSummary = {
  kind: "card" | "element";
  title: string;
  summary: string;
  accent: string;
};

export type TestResultDetail = TestSummary & {
  slug: string;
  recommendation: string;
  nextHref: string;
  companionProduct: string;
};

export function readTestSummary(): TestSummary | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(testSummaryKey);
    return raw ? (JSON.parse(raw) as TestSummary) : null;
  } catch {
    return null;
  }
}

export function writeTestSummary(summary: TestSummary) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(testSummaryKey, JSON.stringify(summary));
}

export function readTestResultDetail(): TestResultDetail | null {
  const value = readTestSummary();
  if (!value) return null;
  const raw = typeof window !== "undefined" ? window.localStorage.getItem(`${testSummaryKey}_detail`) : null;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TestResultDetail;
  } catch {
    return null;
  }
}

export function writeTestResultDetail(detail: TestResultDetail) {
  if (typeof window === "undefined") return;
  writeTestSummary(detail);
  window.localStorage.setItem(`${testSummaryKey}_detail`, JSON.stringify(detail));
}

export type AmuletDraft = {
  name: string;
  wish: string;
  element: string;
  sigil: string;
};

export function readAmuletDraft(): AmuletDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(amuletDraftKey);
    return raw ? (JSON.parse(raw) as AmuletDraft) : null;
  } catch {
    return null;
  }
}

export function writeAmuletDraft(draft: AmuletDraft) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(amuletDraftKey, JSON.stringify(draft));
}
