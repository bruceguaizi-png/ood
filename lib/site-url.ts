const LOCAL_DEV_URL = "http://localhost:3000";
const DEFAULT_PRODUCTION_URL = "https://oracleood.com";

function normalizeUrl(value?: string | null) {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed.replace(/\/+$/, "");
  }

  return `https://${trimmed}`.replace(/\/+$/, "");
}

export function getSiteUrl() {
  const explicit = normalizeUrl(process.env.NEXT_PUBLIC_APP_URL);
  if (explicit) return explicit;

  const production = normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (production) return production;

  const deployment = normalizeUrl(process.env.VERCEL_URL);
  if (deployment) return deployment;

  if (process.env.NODE_ENV === "production") {
    return DEFAULT_PRODUCTION_URL;
  }

  return LOCAL_DEV_URL;
}

export function getSiteOrigin() {
  return new URL(getSiteUrl()).origin;
}
