import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { prisma } from "./prisma.js";

export async function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Требуется авторизация" });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Неверный токен" });
  }
}

export function adminRequired(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Недостаточно прав" });
  }
  next();
}
