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

## Деплой API на VPS (Ubuntu / Beget)

Репозиторий на сервере, например: `~/server/social-boost/` (внутри — `client/` и `server/`).

**Один раз** (под root или пользователя с sudo):

```bash
cd ~/server/social-boost
git pull   # если ещё не клонировали — сначала git clone ...
bash deploy/setup-vps.sh
```

Скрипт сам установит Node 20, PostgreSQL, PM2, создаст БД, `server/.env`, применит миграции и запустит API.

Проверка: `curl http://127.0.0.1:4000/api/health` → `{"ok":true}`.

После `git pull` на сервере:

```bash
bash deploy/update-api.sh
```

Полезные команды: `pm2 status`, `pm2 logs social-boost-api`, `pm2 restart social-boost-api`.

Демо-сиды на проде (по желанию): `cd server && RUN_SEED=1` не нужен — вручную `npm run prisma:seed` в `server/`.

### HTTPS на домене smart-word.ru

Фронт на Render (HTTPS) → API тоже должен быть по HTTPS.

1. **DNS в Beget** (не трогайте MX/TXT для почты):
   - Тип **A**, имя **`api`**, значение **IP вашего VPS** (тот, где крутится PM2; не обязательно 159.194.198.249 с корневой A-записи).
   - Подождите 5–30 мин, проверка: `ping api.smart-word.ru`

2. **На VPS** (API уже через `setup-vps.sh` + PM2):
   ```bash
   cd ~/server/social-boost
   git pull
   bash deploy/setup-domain-ssl.sh
   ```

3. **server/.env** на VPS:
   - `CLIENT_URL=https://social-boost-o64n.onrender.com`
   - `PORT=4000`

4. **Render** → Environment → `VITE_API_URL=https://api.smart-word.ru/api` → пересборка деплоя.

Проверка: `curl https://api.smart-word.ru/api/health`

### 404 при обновлении страницы на Render (`/register` и т.д.)

React Router — клиентские маршруты. Нужен rewrite на `index.html` (файл `client/public/_redirects`). После `git push` — **Manual Deploy** на Render.

Фронтенд локально: `client/.env` с `VITE_API_URL=https://api.smart-word.ru/api`

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
