/**
 * Демо-наполнение БД для презентации в колледже.
 *
 * Запуск из папки server:
 *   npm run prisma:seed:demo
 *
 * По умолчанию удаляет все заявки (Order) и обращения с сайта (ContactRequest),
 * затем создаёт ~50 записей каждого типа + демо-клиентов.
 */
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient, Role, OrderStatus, ContactRequestStatus } from "@prisma/client";
import {
  DEMO,
  SERVICES,
  REGIONS,
  BUDGETS,
  TIMELINES,
  COMPANY_HINTS,
  ORDER_DESCRIPTIONS,
  ORDER_WISHES,
  CONTACT_MESSAGES,
  pick,
  daysAgo,
  demoClientEmail,
  formatPhone,
  personName,
} from "./demo-data.js";

dotenv.config();

const prisma = new PrismaClient();

const ORDER_STATUS_SEQUENCE = [
  OrderStatus.NEW,
  OrderStatus.NEW,
  OrderStatus.IN_PROGRESS,
  OrderStatus.IN_PROGRESS,
  OrderStatus.IN_PROGRESS,
  OrderStatus.COMPLETED,
  OrderStatus.COMPLETED,
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
];

function parseArgs() {
  const reset = !process.argv.includes("--no-reset");
  return { reset };
}

async function ensureCoreUsers(passwordHash) {
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const userPasswordHash = await bcrypt.hash("user12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: DEMO.ADMIN_EMAIL },
    update: {},
    create: {
      email: DEMO.ADMIN_EMAIL,
      passwordHash: adminPasswordHash,
      name: "Администратор",
      phone: "+7 (900) 000-00-01",
      role: Role.ADMIN,
    },
  });

  const mainClient = await prisma.user.upsert({
    where: { email: DEMO.MAIN_CLIENT_EMAIL },
    update: {},
    create: {
      email: DEMO.MAIN_CLIENT_EMAIL,
      passwordHash: userPasswordHash,
      name: "Демо Клиент",
      phone: "+7 (900) 000-00-02",
      role: Role.USER,
    },
  });

  const demoClients = [];
  for (let i = 1; i <= DEMO.CLIENT_COUNT; i += 1) {
    const email = demoClientEmail(i);
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: personName(i),
        phone: formatPhone(i),
      },
      create: {
        email,
        passwordHash,
        name: personName(i),
        phone: formatPhone(i),
        role: Role.USER,
        createdAt: daysAgo(60 + (i % 30), i),
      },
    });
    demoClients.push(user);
  }

  return { admin, mainClient, demoClients };
}

function buildOrderPayload(index, userId) {
  const service = pick(SERVICES, index);
  const region = pick(REGIONS, index + 2);
  const company = pick(COMPANY_HINTS, index);
  const dayOffset = index % 28;

  return {
    userId,
    service,
    status: pick(ORDER_STATUS_SEQUENCE, index),
    region,
    budget: pick(BUDGETS, index + 1),
    timeline: pick(TIMELINES, index),
    description: `${pick(ORDER_DESCRIPTIONS, index)} Ниша: ${company}.`,
    wishes: pick(ORDER_WISHES, index),
    createdAt: daysAgo(dayOffset, index),
    updatedAt: daysAgo(Math.max(0, dayOffset - 1), index + 5),
  };
}

function buildContactPayload(index) {
  const name = personName(index + 10);
  const email = `lead${String(index + 1).padStart(2, "0")}@example.ru`;
  const dayOffset = (index * 2) % 25;

  return {
    name,
    email,
    phone: formatPhone(100 + index),
    message: pick(CONTACT_MESSAGES, index),
    consent: true,
    status: index % 3 === 0 ? ContactRequestStatus.PROCESSED : ContactRequestStatus.NEW,
    createdAt: daysAgo(dayOffset, index + 3),
    updatedAt: daysAgo(Math.max(0, dayOffset - 1), index),
  };
}

async function main() {
  const { reset } = parseArgs();
  const demoPasswordHash = await bcrypt.hash(DEMO.DEMO_PASSWORD, 10);

  console.log("=== Демо-наполнение БД ===\n");

  const { admin, mainClient, demoClients } = await ensureCoreUsers(demoPasswordHash);
  const allClients = [mainClient, ...demoClients];

  if (reset) {
    const deletedOrders = await prisma.order.deleteMany();
    const deletedLeads = await prisma.contactRequest.deleteMany();
    console.log(`Очищено: заявок — ${deletedOrders.count}, обращений с сайта — ${deletedLeads.count}`);
  } else {
    const [orders, leads] = await Promise.all([
      prisma.order.count(),
      prisma.contactRequest.count(),
    ]);
    if (orders >= DEMO.ORDER_COUNT && leads >= DEMO.CONTACT_COUNT) {
      console.log("Данные уже есть. Для пересоздания запустите без флага --no-reset.");
      console.log(`Сейчас: заявок ${orders}, обращений ${leads}`);
      return;
    }
  }

  const ordersData = Array.from({ length: DEMO.ORDER_COUNT }, (_, index) => {
    const user = allClients[index % allClients.length];
    return buildOrderPayload(index, user.id);
  });

  await prisma.order.createMany({ data: ordersData });

  const contactsData = Array.from({ length: DEMO.CONTACT_COUNT }, (_, index) =>
    buildContactPayload(index),
  );

  await prisma.contactRequest.createMany({ data: contactsData });

  const [orderCount, contactCount, userCount] = await Promise.all([
    prisma.order.count(),
    prisma.contactRequest.count(),
    prisma.user.count({ where: { role: Role.USER } }),
  ]);

  const statusGroups = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  console.log("\nГотово.\n");
  console.log("Аккаунты для входа:");
  console.log(`  Админ:   ${DEMO.ADMIN_EMAIL} / admin123`);
  console.log(`  Клиент:  ${DEMO.MAIN_CLIENT_EMAIL} / user12345`);
  console.log(`  Клиенты: client01@demo.local … client${String(DEMO.CLIENT_COUNT).padStart(2, "0")}@demo.local / ${DEMO.DEMO_PASSWORD}`);
  console.log(`\nВ базе: пользователей (клиентов) — ${userCount}, заявок — ${orderCount}, обращений — ${contactCount}`);
  console.log("Статусы заявок:");
  for (const row of statusGroups) {
    console.log(`  ${row.status}: ${row._count._all}`);
  }
  console.log(`\nАдмин id: ${admin.id}, основной клиент id: ${mainClient.id}`);
}

main()
  .catch((error) => {
    console.error("Ошибка демо-seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
