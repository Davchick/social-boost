import dotenv from "dotenv";

dotenv.config();

/** Убирает слэш в конце — иначе CORS не совпадёт с origin браузера */
export function normalizeOrigin(url) {
  return String(url || "")
    .trim()
    .replace(/\/$/, "");
}

/** CLIENT_URL или CLIENT_URLS (через запятую) */
export function parseClientUrls() {
  const raw =
    process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173";
  return raw
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);
}

const clientUrls = parseClientUrls();

export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  /** @deprecated используйте clientUrls */
  clientUrl: clientUrls[0],
  clientUrls,
};
