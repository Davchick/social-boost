# Гайд: 404 при обновлении страницы на Render (React / Vue / SPA)

Если при переходе по меню всё работает, а при **F5** или прямой ссылке (`/register`, `/dashboard/orders`) видите **404 Not Found** — это нормальная ситуация для SPA без настройки сервера. Ниже — что происходит и как исправить за 5–10 минут.

---

## 1. В чём проблема

### Как устроен React Router (и аналоги)

- Маршруты (`/`, `/register`, `/login`) живут **в JavaScript в браузере**.
- Сервер отдаёт один файл — **`index.html`** + JS-бандл.
- При клике по ссылке внутри сайта браузер **не запрашивает** новую HTML-страницу с сервера — меняется только URL и React рисует нужный компонент.

### Что происходит при обновлении (F5)

1. Вы на `https://your-app.onrender.com/register`.
2. Нажимаете **F5**.
3. Браузер отправляет на Render запрос: **«Дай файл `/register`»**.
4. На диске в `dist/` есть только `index.html`, `assets/...`, нет папки `register/`.
5. Render отвечает: **404 Not Found**.

Это **не баг React** и **не баг Render** — так работает статический хостинг без правила «все пути → index.html».

### Схема

```
Клик по ссылке внутри сайта:
  Браузер → не идёт на сервер за HTML → React Router → OK

F5 или вставили URL в адресную строку:
  Браузер → GET /register → Render ищет файл register → 404
```

---

## 2. Решение (суть)

Нужно сказать Render:

> Для **любого** пути (`/*`) отдавай **`/index.html`** с кодом **200** (rewrite), а не 404.

Тогда браузер получит `index.html`, загрузится React, и Router покажет `/register`.

---

## 3. Что сделано в проекте social-boost

### Файл `client/public/_redirects`

При сборке Vite всё из `public/` копируется в `dist/`. В корне `dist/` появляется `_redirects`, который Render читает для Static Site.

Содержимое:

```text
/*    /index.html   200
```

| Часть | Значение |
|--------|----------|
| `/*` | любой путь |
| `/index.html` | отдать главную страницу SPA |
| `200` | успешный ответ (rewrite, а не редирект 301) |

**Важно:** для Vite/React файл должен лежать в **`public/_redirects`**, не в `src/`.

### Опционально: `render.yaml` в корне репозитория

Дублирует то же правило для Blueprint / Infrastructure as Code:

```yaml
staticSites:
  - name: social-boost
    rootDir: client
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

Если сайт на Render уже создан вручную через UI, **достаточно `_redirects`** + новый деплой. `render.yaml` нужен, если подключаете репозиторий как Blueprint с нуля.

---

## 4. Пошаговая настройка на Render

### Шаг 0. Проверьте тип сервиса

Нужен **Static Site**, не Web Service с `npm start` для фронта.

В Dashboard → ваш сервис → вверху должно быть что-то вроде **Static Site**.

### Шаг 1. Добавьте `_redirects` в репозиторий

Структура (пример):

```text
project/
  client/
    public/
      _redirects    ← этот файл
    src/
    index.html
    vite.config.js
    package.json
```

Создайте `public/_redirects` с одной строкой (см. выше), закоммитьте, запушьте в Git.

### Шаг 2. Настройки Build на Render

**Settings** → **Build & Deploy**:

| Поле | Значение (для нашего проекта) |
|------|-------------------------------|
| **Root Directory** | `client` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

Если Root Directory пустой, а проект в подпапке `client/` — `_redirects` не попадёт в деплой.

### Шаг 3. Переменные окружения (если есть API)

**Environment** → для Vite только переменные с префиксом `VITE_`:

```env
VITE_API_URL=https://api.example.com/api
```

После изменения env нужен **новый build** (Manual Deploy).

### Шаг 4. Новый деплой

1. **Manual Deploy** → **Deploy latest commit**.
2. Если 404 не пропал: **Clear build cache & deploy**.

Дождитесь статуса **Live**.

### Шаг 5. Проверка

1. Откройте `https://your-app.onrender.com/register`.
2. Нажмите **F5** — страница регистрации, **не** 404.
3. Вставьте URL в новую вкладку — то же самое.
4. В DevTools → Network при F5 на `/register` документ должен быть **`index.html`** (статус 200).

---

## 5. Запасной вариант: Rewrite в панели Render

Если `_redirects` по какой-то причине не сработал:

1. Static Site → **Redirects/Rewrites** (или **Settings** → раздел маршрутов).
2. Добавьте правило:

| Поле | Значение |
|------|----------|
| Source / From | `/*` |
| Destination / To | `/index.html` |
| Action / Type | **Rewrite** (не Redirect) |

Сохраните и сделайте Manual Deploy.

---

## 6. Частые ошибки

| Симптом | Причина | Что сделать |
|---------|---------|-------------|
| 404 после F5 | Нет rewrite | `_redirects` в `public/`, redeploy |
| 404 только на вложенных путях | Неполное правило | Используйте `/*`, не `/register` |
| `_redirects` не в деплое | Неверный Root Directory | Root = `client`, publish = `dist` |
| Изменили env, API старый | Vite вшивает env при build | Manual Deploy после смены `VITE_*` |
| 301 на главную при F5 | Redirect вместо Rewrite | В `_redirects` последнее число **200** |
| Файл в `src/_redirects` | Vite не копирует `src` | Только **`public/_redirects`** |

---

## 7. Другие фреймворки (для коллег)

| Стек | Куда положить `_redirects` |
|------|----------------------------|
| **Vite + React** | `public/_redirects` |
| **Create React App** | `public/_redirects` |
| **Next.js static export** | обычно не нужен (свой роутинг); на Render чаще Web Service |
| **Vue CLI / Vite** | `public/_redirects` |
| **Angular** | `src/_redirects` или `angular.json` assets → часто `public/` при Vite |

Содержимое везде одно и то же:

```text
/*    /index.html   200
```

---

## 8. Альтернатива (не рекомендуем для продакшена)

**Hash Router** (`#/register`) — сервер всегда видит только `/`, 404 нет. Минусы: некрасивые URL, хуже для SEO. Для диплома/внутренних проектов лучше rewrite, как выше.

---

## 9. Чеклист для коллег (копипаст)

```text
[ ] Static Site на Render (не Web Service для фронта)
[ ] Файл client/public/_redirects с содержимым: /*    /index.html   200
[ ] Root Directory = client (или ваша папка с package.json фронта)
[ ] Publish Directory = dist (или build)
[ ] git push + Manual Deploy (при необходимости Clear build cache)
[ ] Проверка: /register → F5 → не 404
```

---

## 10. Связанные проблемы (не путать с 404 SPA)

| Проблема | Это другое |
|----------|------------|
| **Mixed Content** — API `http://`, сайт `https://` | API тоже нужен по HTTPS (домен + nginx / хостинг API) |
| **CORS** — запрос blocked by CORS | На бэкенде `CLIENT_URL` = точный URL фронта |
| **404 на API** `/api/register` | Бэкенд не запущен или неверный `VITE_API_URL` |

---

## Ссылки

- [Render: Deploy a Create React App Static Site](https://render.com/docs/deploy-create-react-app) — раздел про client-side routing
- [Render: Redirects and rewrites](https://render.com/docs/redirects-rewrites)

---

*Гайд подготовлен для проекта social-boost (React + Vite + React Router на Render).*
