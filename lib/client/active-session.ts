"use client";

import { type ElementKey } from "@/lib/types";

const activeSessionKey = "ood_active_session";

export type ActiveSessionSnapshot = {
  sessionId: string;
  name: string;
  email?: string;
  coreType: string;
  dominantElement: ElementKey;
  weakestElement: ElementKey;
  elementDistribution: {
    metal: number;
    wood: number;
    water: number;
    fire: number;
    earth: number;
  };
  createdAt: string;
};

export function readActiveSession(): ActiveSessionSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(activeSessionKey);
    return raw ? (JSON.parse(raw) as ActiveSessionSnapshot) : null;
  } catch {
    return null;
  }
}

export function writeActiveSession(snapshot: ActiveSessionSnapshot) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(activeSessionKey, JSON.stringify(snapshot));
}

export function clearActiveSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(activeSessionKey);
}
