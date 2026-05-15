import jwt from "jsonwebtoken";
import { config } from "./config.js";

export function signToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, {
    expiresIn: "7d",
  });
}

export function mapStatusToClient(status) {
  const map = {
    NEW: "new",
    IN_PROGRESS: "in-progress",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  };
  return map[status] || "new";
}

export function mapStatusToDb(status) {
  const map = {
    new: "NEW",
    "in-progress": "IN_PROGRESS",
    completed: "COMPLETED",
    cancelled: "CANCELLED",
  };
  return map[status];
}

export function formatOrder(order) {
  return {
    id: String(order.id),
    service: order.service,
    status: mapStatusToClient(order.status),
    region: order.region,
    budget: order.budget,
    timeline: order.timeline,
    description: order.description,
    wishes: order.wishes,
    createdAt: new Date(order.createdAt).toLocaleDateString("ru-RU"),
    createdAtRaw: order.createdAt,
    userId: String(order.userId),
    user: order.user
      ? {
          id: String(order.user.id),
          name: order.user.name,
          email: order.user.email,
          role: order.user.role.toLowerCase(),
        }
      : undefined,
  };
}

export function formatUser(user) {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role.toLowerCase(),
    createdAt: user.createdAt,
  };
}

export function mapContactRequestStatusToClient(status) {
  const map = {
    NEW: "new",
    PROCESSED: "processed",
  };
  return map[status] || "new";
}

export function mapContactRequestStatusToDb(status) {
  const map = {
    new: "NEW",
    processed: "PROCESSED",
  };
  return map[status];
}

export function formatContactRequest(row) {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    consent: row.consent,
    status: mapContactRequestStatusToClient(row.status),
    createdAt: new Date(row.createdAt).toLocaleString("ru-RU"),
    createdAtRaw: row.createdAt,
  };
}

export function normalizePhoneDigits(value) {
  if (typeof value !== "string") return "";
  return value.replace(/\D/g, "");
}

export function isValidRuPhone(value) {
  const digits = normalizePhoneDigits(value);
  if (!digits) return false;
  if (digits.length !== 11) return false;
  if (digits[0] !== "7" && digits[0] !== "8") return false;
  return true;
}

export function isValidEmail(value) {
  if (typeof value !== "string") return false;
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
}
