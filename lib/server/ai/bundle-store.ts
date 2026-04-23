import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

import { type GeneratedReportBundle } from "@/lib/server/ai/types";

const dataDir = process.env.VERCEL
  ? path.join(os.tmpdir(), "ood-data")
  : path.join(process.cwd(), "data");
const bundleDir = path.join(dataDir, "generated", "ai-bundles");

async function ensureBundleDir() {
  await fs.mkdir(bundleDir, { recursive: true });
}

function bundlePath(reportId: string) {
  return path.join(bundleDir, `${reportId}.json`);
}

export async function readReportBundle(reportId: string) {
  await ensureBundleDir();
  try {
    const content = await fs.readFile(bundlePath(reportId), "utf8");
    return JSON.parse(content) as GeneratedReportBundle;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function writeReportBundle(bundle: GeneratedReportBundle) {
  await ensureBundleDir();
  await fs.writeFile(bundlePath(bundle.reportId), JSON.stringify(bundle, null, 2), "utf8");
  return bundle;
}
