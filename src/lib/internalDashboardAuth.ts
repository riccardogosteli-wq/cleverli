import crypto from "crypto";

export const INTERNAL_LOG_COOKIE = "cleverli_internal_logs";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 12;

function secret() {
  return process.env.INTERNAL_DASHBOARD_SECRET || process.env.INTERNAL_DASHBOARD_PASSWORD || "";
}

export function internalCookieMaxAge() {
  return COOKIE_MAX_AGE_SECONDS;
}

export function signInternalSession(now = Date.now()) {
  const key = secret();
  if (!key) return "";

  const payload = String(now);
  const signature = crypto.createHmac("sha256", key).update(payload).digest("hex");
  return `v1.${payload}.${signature}`;
}

export function verifyInternalSession(value?: string) {
  const key = secret();
  if (!key || !value) return false;

  const [version, timestamp, signature] = value.split(".");
  if (version !== "v1" || !timestamp || !signature) return false;

  const createdAt = Number(timestamp);
  if (!Number.isFinite(createdAt)) return false;
  if (Date.now() - createdAt > COOKIE_MAX_AGE_SECONDS * 1000) return false;

  const expected = crypto.createHmac("sha256", key).update(timestamp).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
