#!/usr/bin/env bash
# Одноразовая настройка Node.js API на Ubuntu VPS (Beget и др.)
# Запуск из корня репозитория (где лежат папки client/ и server/):
#   cd ~/server/social-boost && bash deploy/setup-vps.sh
#
# Переменные (необязательно, иначе спросит или подставит значения по умолчанию):
#   DB_NAME DB_USER DB_PASS JWT_SECRET PORT CLIENT_URL REPO_ROOT

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}==>${NC} $*"; }
warn()  { echo -e "${YELLOW}!!>${NC} $*"; }
die()   { echo -e "${RED}ERROR:${NC} $*" >&2; exit 1; }

# Корень репозитория: deploy/.. или REPO_ROOT
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${REPO_ROOT:-$(cd "$SCRIPT_DIR/.." && pwd)}"
SERVER_DIR="$REPO_ROOT/server"

[[ -f "$SERVER_DIR/package.json" ]] || die "Не найден $SERVER_DIR/package.json. Запустите скрипт из репозитория social-boost."

# --- значения по умолчанию ---
DB_NAME="${DB_NAME:-ad_demo}"
DB_USER="${DB_USER:-ad_user}"
DB_PASS="${DB_PASS:-}"
JWT_SECRET="${JWT_SECRET:-}"
PORT="${PORT:-4000}"
CLIENT_URL="${CLIENT_URL:-}"

if [[ -z "$DB_PASS" ]]; then
  DB_PASS="$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)"
  warn "Сгенерирован пароль PostgreSQL для $DB_USER: $DB_PASS"
  warn "Сохраните его — понадобится для бэкапов и .env"
fi

if [[ -z "$JWT_SECRET" ]]; then
  JWT_SECRET="$(openssl rand -base64 32)"
  warn "Сгенерирован JWT_SECRET (уже записан в server/.env)"
fi

if [[ -z "$CLIENT_URL" ]]; then
  read -r -p "URL фронтенда для CORS (например https://yourdomain.ru или http://IP:5173): " CLIENT_URL
  CLIENT_URL="${CLIENT_URL:-http://localhost:5173}"
fi

# --- установка системных пакетов ---
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | sed 's/v//' | cut -d. -f1)" -lt 20 ]]; then
  info "Установка Node.js 20..."
  sudo apt-get update -qq
  sudo apt-get install -y ca-certificates curl gnupg
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

if ! command -v psql >/dev/null 2>&1; then
  info "Установка PostgreSQL..."
  sudo apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y postgresql postgresql-contrib
  sudo systemctl enable postgresql
  sudo systemctl start postgresql
fi

if ! command -v pm2 >/dev/null 2>&1; then
  info "Установка PM2..."
  sudo npm install -g pm2
fi

# --- база данных ---
info "Создание пользователя и БД PostgreSQL (если ещё нет)..."
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
    CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASS';
  ELSE
    ALTER ROLE $DB_USER WITH PASSWORD '$DB_PASS';
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
SQL

sudo -u postgres psql -v ON_ERROR_STOP=1 -d "$DB_NAME" <<SQL
GRANT ALL ON SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
SQL

# --- server/.env ---
ENV_FILE="$SERVER_DIR/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  info "Создание $ENV_FILE"
  cat > "$ENV_FILE" <<EOF
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}?schema=public"
JWT_SECRET="${JWT_SECRET}"
PORT=${PORT}
CLIENT_URL="${CLIENT_URL}"
EOF
else
  warn "$ENV_FILE уже есть — не перезаписываю. Проверьте DATABASE_URL, PORT, CLIENT_URL вручную."
fi

# --- зависимости и миграции ---
info "npm install в server/"
cd "$SERVER_DIR"
npm install

info "Prisma generate + migrate deploy"
npx prisma generate
npx prisma migrate deploy

if [[ "${RUN_SEED:-}" == "1" ]]; then
  info "Сид демо-данных (RUN_SEED=1)"
  npm run prisma:seed || true
fi

# --- PM2 ---
cd "$REPO_ROOT"
info "Запуск API через PM2..."
pm2 delete social-boost-api 2>/dev/null || true
pm2 start deploy/ecosystem.config.cjs
pm2 save

# автозапуск после перезагрузки VPS
STARTUP_CMD="$(pm2 startup systemd -u "$USER" --hp "$HOME" 2>&1 | grep -E '^sudo' || true)"
if [[ -n "$STARTUP_CMD" ]]; then
  warn "Выполните команду для автозапуска PM2 после reboot (один раз):"
  echo "  $STARTUP_CMD"
fi

# --- firewall (опционально) ---
if command -v ufw >/dev/null 2>&1 && sudo ufw status 2>/dev/null | grep -q "Status: active"; then
  sudo ufw allow "${PORT}/tcp" || true
  info "Открыт порт $PORT в ufw"
fi

SERVER_IP="$(curl -fsSL -4 --max-time 3 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')"

echo ""
info "Готово. API слушает порт ${PORT}."
echo "  Health:  http://${SERVER_IP}:${PORT}/api/health"
echo "  Логи:    pm2 logs social-boost-api"
echo "  Статус:  pm2 status"
echo "  Рестарт: pm2 restart social-boost-api"
echo ""
echo "Для фронтенда в client/.env укажите:"
echo "  VITE_API_URL=http://${SERVER_IP}:${PORT}/api"
echo ""
warn "Если снаружи не открывается — в панели Beget откройте порт ${PORT} и проверьте firewall."
