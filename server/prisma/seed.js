import bcrypt from "bcryptjs";
import { PrismaClient, Role, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const userPasswordHash = await bcrypt.hash("user12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.local" },
    update: {},
    create: {
      email: "admin@demo.local",
      passwordHash: adminPasswordHash,
      name: "Администратор",
      phone: "+7 (900) 000-00-01",
      role: Role.ADMIN,
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "user@demo.local" },
    update: {},
    create: {
      email: "user@demo.local",
      passwordHash: userPasswordHash,
      name: "Демо Клиент",
      phone: "+7 (900) 000-00-02",
      role: Role.USER,
    },
  });

  const existingOrdersCount = await prisma.order.count({
    where: { userId: client.id },
  });

  if (existingOrdersCount === 0) {
    await prisma.order.createMany({
      data: [
        {
          userId: client.id,
          service: "Контекстная реклама",
          status: OrderStatus.IN_PROGRESS,
          region: "Москва",
          budget: "50 000 ₽",
          timeline: "2 недели",
          description: "Запуск рекламной кампании в Яндекс.Директ",
          wishes: "Еженедельный отчет",
        },
        {
          userId: client.id,
          service: "SEO-продвижение",
          status: OrderStatus.NEW,
          region: "Санкт-Петербург",
          budget: "35 000 ₽",
          timeline: "1 месяц",
          description: "Оптимизация сайта и рост органического трафика",
          wishes: null,
        },
      ],
    });
  }

  console.log("Seed completed");
  console.log("Admin: admin@demo.local / admin123");
  console.log("User: user@demo.local / user12345");
  console.log(`Users in DB: admin=${admin.id}, user=${client.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
