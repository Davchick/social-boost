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
