# Diploma Demo Project

Учебный fullstack-проект для демонстрации на защите диплома:

- `client`: React + Tailwind + TanStack Query
- `server`: Node.js (Express) + PostgreSQL + Prisma
- роли: `user` и `admin`
- админка: простые таблицы + кнопки действий

## 1) Подготовка

Требуется локально:

- Node.js 20+
- PostgreSQL 14+

Создайте базу:

```sql
CREATE DATABASE ad_demo;
```

## 2) Настройка переменных

Скопируйте шаблоны:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Проверьте `server/.env`:

- `DATABASE_URL` (ваш логин/пароль postgres)
- `JWT_SECRET` (любая строка)

## 3) Установка и миграции

```bash
cd server
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run prisma:seed
```

### Демо-данные для презентации (графики, ~50 заявок)

После миграций можно один раз (или перед показом) наполнить БД реалистичными моками:

```bash
cd server
npm run prisma:seed:demo
```

Скрипт создаёт ~50 заявок и ~50 обращений с сайта, 20 дополнительных клиентов, даты за последние 28 дней (графики в админке). При каждом запуске **удаляет** все заявки и обращения и создаёт заново. Чтобы только дописать данные, если их мало: `node prisma/seed-demo.js --no-reset`.

## 4) Запуск

Терминал 1:

```bash
cd server
npm run dev
```

Терминал 2:

```bash
cd client
npm install
npm run dev
```

## Демо-аккаунты

- Админ: `admin@demo.local` / `admin123`
- Клиент: `user@demo.local` / `user12345`

## Что реализовано

- регистрация/логин
- личный кабинет клиента
- создание заказа
- список и карточка заказа
- отмена нового заказа клиентом
- админ-панель (пользователи + заказы)
- смена статуса заказа админом
- удаление заказа админом
- обновление UI через `invalidateQueries` TanStack Query после мутаций
