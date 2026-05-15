import express from "express";
import cors from "cors";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { config } from "./config.js";
import { prisma } from "./prisma.js";
import {
  formatContactRequest,
  formatOrder,
  formatUser,
  isValidEmail,
  isValidRuPhone,
  mapContactRequestStatusToDb,
  mapStatusToDb,
  signToken,
} from "./utils.js";
import { adminRequired, authRequired } from "./middleware.js";

const app = express();

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Заполните обязательные поля" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Некорректный email" });
  }
  if (phone && !isValidRuPhone(phone)) {
    return res.status(400).json({ message: "Некорректный телефон" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: "Пользователь уже существует" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      role: Role.USER,
    },
  });

  const token = signToken(user);
  return res.status(201).json({ token, user: formatUser(user) });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email и пароль обязательны" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Некорректный email" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Неверные данные" });
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    return res.status(401).json({ message: "Неверные данные" });
  }

  const token = signToken(user);
  return res.json({ token, user: formatUser(user) });
});

app.get("/api/auth/me", authRequired, async (req, res) => {
  return res.json({ user: formatUser(req.user) });
});

app.patch("/api/users/me", authRequired, async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const phone =
    req.body.phone === undefined || req.body.phone === null || req.body.phone === ""
      ? null
      : String(req.body.phone).trim();

  if (!name || !email) {
    return res.status(400).json({ message: "Имя и email обязательны" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Некорректный email" });
  }
  if (phone && !isValidRuPhone(phone)) {
    return res.status(400).json({ message: "Некорректный телефон" });
  }

  if (email !== req.user.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Этот email уже занят" });
    }
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, email, phone },
  });

  return res.json({ user: formatUser(user) });
});

app.patch("/api/users/me/password", authRequired, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Текущий и новый пароль обязательны" });
  }
  if (String(newPassword).length < 6) {
    return res
      .status(400)
      .json({ message: "Новый пароль должен быть не короче 6 символов" });
  }
  if (currentPassword === newPassword) {
    return res
      .status(400)
      .json({ message: "Новый пароль должен отличаться от текущего" });
  }

  const valid = await bcrypt.compare(currentPassword, req.user.passwordHash);
  if (!valid) {
    return res.status(400).json({ message: "Текущий пароль неверный" });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: req.user.id },
    data: { passwordHash },
  });

  return res.json({ success: true });
});

app.delete("/api/users/me", authRequired, async (req, res) => {
  await prisma.user.delete({ where: { id: req.user.id } });
  return res.json({ success: true });
});

app.get("/api/orders", authRequired, async (req, res) => {
  const isAdmin = req.user.role === "ADMIN";
  const orders = await prisma.order.findMany({
    where: isAdmin ? {} : { userId: req.user.id },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ orders: orders.map(formatOrder) });
});

app.get("/api/orders/:id", authRequired, async (req, res) => {
  const orderId = Number(req.params.id);
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order) {
    return res.status(404).json({ message: "Заявка не найдена" });
  }

  const isAdmin = req.user.role === "ADMIN";
  if (!isAdmin && order.userId !== req.user.id) {
    return res.status(403).json({ message: "Недостаточно прав" });
  }

  return res.json({ order: formatOrder(order) });
});

app.post("/api/orders", authRequired, async (req, res) => {
  if (req.user.role === "ADMIN") {
    return res
      .status(403)
      .json({ message: "Администратор не может создавать заявки" });
  }

  const { service, region, budget, timeline, description, wishes } = req.body;

  if (!service || !region || !budget || !description) {
    return res.status(400).json({ message: "Заполните обязательные поля" });
  }

  const order = await prisma.order.create({
    data: {
      userId: req.user.id,
      service,
      region,
      budget,
      timeline,
      description,
      wishes,
    },
  });

  return res.status(201).json({ orderId: String(order.id) });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message, consent } = req.body || {};
  if (!name || !email || !consent) {
    return res.status(400).json({ message: "Заполните обязательные поля" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Некорректный email" });
  }
  if (message && typeof message !== "string") {
    return res.status(400).json({ message: "Некорректное сообщение" });
  }

  const trimmedMessage =
    typeof message === "string" && message.trim() ? message.trim() : null;

  await prisma.contactRequest.create({
    data: {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: null,
      message: trimmedMessage,
      consent: Boolean(consent),
    },
  });

  return res.status(201).json({ success: true });
});

app.patch("/api/orders/:id/status", authRequired, adminRequired, async (req, res) => {
  const orderId = Number(req.params.id);
  const status = mapStatusToDb(req.body.status);
  if (!status) {
    return res.status(400).json({ message: "Некорректный статус" });
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { user: true },
  });

  return res.json({ order: formatOrder(order) });
});

app.patch("/api/orders/:id/cancel", authRequired, async (req, res) => {
  const orderId = Number(req.params.id);
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return res.status(404).json({ message: "Заявка не найдена" });
  }
  if (order.userId !== req.user.id) {
    return res.status(403).json({ message: "Недостаточно прав" });
  }
  if (order.status !== "NEW") {
    return res.status(400).json({ message: "Можно отменить только новую заявку" });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
    include: { user: true },
  });

  return res.json({ order: formatOrder(updated) });
});

app.delete("/api/orders/:id", authRequired, adminRequired, async (req, res) => {
  const orderId = Number(req.params.id);
  await prisma.order.delete({ where: { id: orderId } });
  return res.json({ success: true });
});

app.get("/api/admin/users", authRequired, adminRequired, async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return res.json({ users: users.map(formatUser) });
});

app.get(
  "/api/admin/contact-requests",
  authRequired,
  adminRequired,
  async (_req, res) => {
    const rows = await prisma.contactRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json({ contactRequests: rows.map(formatContactRequest) });
  },
);

app.patch(
  "/api/admin/contact-requests/:id",
  authRequired,
  adminRequired,
  async (req, res) => {
    const id = Number(req.params.id);
    const status = mapContactRequestStatusToDb(req.body.status);
    if (!status) {
      return res.status(400).json({ message: "Некорректный статус" });
    }

    const updated = await prisma.contactRequest.update({
      where: { id },
      data: { status },
    });

    return res.json({ contactRequest: formatContactRequest(updated) });
  },
);

app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ message: "Внутренняя ошибка сервера" });
});

app.listen(config.port, () => {
  console.log(`API started on http://localhost:${config.port}`);
});
