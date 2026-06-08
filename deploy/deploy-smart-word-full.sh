#!/usr/bin/env bash
# One-command VPS deploy for this project:
# - frontend: https://smart-word.ru served by nginx from client/dist
# - backend: https://api.smart-word.ru proxied to Node on 127.0.0.1:${API_PORT}
# - process manager: PM2
# - database: PostgreSQL + Prisma migrations
#
# Run from the repository root on the VPS:
#   CERTBOT_EMAIL=you@example.com bash deploy/deploy-smart-word-full.sh
#
# Useful overrides:
#   FRONT_DOMAIN=smart-word.ru
#   API_DOMAIN=api.smart-word.ru
#   API_PORT=4000
#   APP_NAME=smart-word
#   DB_NAME=smart_word_db
#   DB_USER=smart_word_user
#   DB_PASS=...
#   JWT_SECRET=...
#   FRONT_ALIASES=www.smart-word.ru
#   RUN_SEED=1
#   SKIP_SSL=1
#   SKIP_DNS_CHECK=1
#   ALLOW_NGINX_DOMAIN_TAKEOVER=1

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info() { echo -e "${GREEN}==>${NC} $*"; }
warn() { echo -e "${YELLOW}!!>${NC} $*" >&2; }
die() { echo -e "${RED}ERROR:${NC} $*" >&2; exit 1; }

if command -v sudo >/dev/null 2>&1; then
  SUDO="sudo"
elif [[ "${EUID}" -eq 0 ]]; then
  SUDO=""
else
  die "sudo is required when the script is not run as root."
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${REPO_ROOT:-$(cd "$SCRIPT_DIR/.." && pwd)}"
SERVER_DIR="$REPO_ROOT/server"
CLIENT_DIR="$REPO_ROOT/client"

[[ -f "$SERVER_DIR/package.json" ]] || die "server/package.json not found. Run from the project repository."
[[ -f "$CLIENT_DIR/package.json" ]] || die "client/package.json not found. Run from the project repository."

APP_NAME="${APP_NAME:-smart-word}"
FRONT_DOMAIN="${FRONT_DOMAIN:-smart-word.ru}"
API_DOMAIN="${API_DOMAIN:-api.${FRONT_DOMAIN}}"
API_PORT="${API_PORT:-4000}"
AUTO_PICK_PORT="${AUTO_PICK_PORT:-1}"
DB_NAME="${DB_NAME:-smart_word_db}"
DB_USER="${DB_USER:-smart_word_user}"
DB_PASS="${DB_PASS:-}"
JWT_SECRET="${JWT_SECRET:-}"
FRONT_ALIASES="${FRONT_ALIASES:-}"
PM2_APP_NAME="${PM2_APP_NAME:-${APP_NAME}-api}"
WEB_ROOT="${WEB_ROOT:-/var/www/${APP_NAME}/dist}"
NGINX_SITE_NAME="${NGINX_SITE_NAME:-${APP_NAME}}"
NGINX_AVAILABLE="/etc/nginx/sites-available/${NGINX_SITE_NAME}.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/${NGINX_SITE_NAME}.conf"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"
CLIENT_URLS="${CLIENT_URLS:-https://${FRONT_DOMAIN},http://localhost:5173}"

if [[ -n "$FRONT_ALIASES" ]]; then
  CLIENT_URLS="${CLIENT_URLS},$(echo "$FRONT_ALIASES" | tr ' ' ',' | sed "s|[^,][^,]*|https://&|g")"
fi

wait_for_apt() {
  local max_wait="${APT_LOCK_WAIT_SEC:-600}"
  local waited=0
  while $SUDO fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 \
    || $SUDO fuser /var/lib/apt/lists/lock >/dev/null 2>&1 \
    || $SUDO fuser /var/cache/apt/archives/lock >/dev/null 2>&1; do
    if (( waited == 0 )); then
      warn "Another apt/dpkg process is running. Waiting up to ${max_wait}s..."
    fi
    if (( waited >= max_wait )); then
      die "apt lock was not released. Wait a bit and run this script again."
    fi
    sleep 5
    waited=$((waited + 5))
  done
}

apt_install() {
  wait_for_apt
  if [[ -n "$SUDO" ]]; then
    $SUDO env DEBIAN_FRONTEND=noninteractive apt-get "$@"
  else
    DEBIAN_FRONTEND=noninteractive apt-get "$@"
  fi
}

random_alnum() {
  openssl rand -hex 16
}

psql_as_postgres() {
  if [[ -n "$SUDO" ]]; then
    $SUDO -u postgres psql "$@"
  else
    runuser -u postgres -- psql "$@"
  fi
}

set_env_key() {
  local file="$1"
  local key="$2"
  local value="$3"
  touch "$file"
  if grep -qE "^${key}=" "$file"; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$file"
  else
    printf '%s=%s\n' "$key" "$value" >> "$file"
  fi
}

npm_install_for_dir() {
  local dir="$1"
  cd "$dir"
  if [[ -f package-lock.json ]]; then
    npm ci
  else
    npm install
  fi
}

port_is_busy() {
  ss -ltn "( sport = :$1 )" | grep -q ":$1"
}

pick_api_port() {
  local port="$API_PORT"
  if ! port_is_busy "$port"; then
    echo "$port"
    return
  fi

  if command -v pm2 >/dev/null 2>&1 && pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
    warn "Port ${port} is busy, but PM2 app ${PM2_APP_NAME} already exists. Keeping the same port for restart."
    echo "$port"
    return
  fi

  if [[ "$AUTO_PICK_PORT" != "1" ]]; then
    die "Port ${port} is already busy. Set API_PORT to a free port or AUTO_PICK_PORT=1."
  fi

  warn "Port ${port} is busy, looking for a free local API port..."
  for candidate in $(seq 4000 4099); do
    if ! port_is_busy "$candidate"; then
      echo "$candidate"
      return
    fi
  done
  die "No free ports found in 4000-4099."
}

domain_points_to_this_vps() {
  local domain="$1"
  local resolved="$2"
  local vps_ip="$3"
  [[ -z "$resolved" || -z "$vps_ip" ]] && return 1
  [[ "$resolved" == "$vps_ip" ]]
}

check_dns() {
  [[ "${SKIP_DNS_CHECK:-0}" == "1" ]] && return

  local vps_ip
  vps_ip="$(curl -fsSL -4 --max-time 5 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')"
  [[ -n "$vps_ip" ]] || die "Could not detect VPS public IPv4. Use SKIP_DNS_CHECK=1 if you know DNS is correct."

  local domains=("$FRONT_DOMAIN" "$API_DOMAIN")
  if [[ -n "$FRONT_ALIASES" ]]; then
    # shellcheck disable=SC2206
    domains+=($FRONT_ALIASES)
  fi

  for domain in "${domains[@]}"; do
    local resolved
    resolved="$(getent ahosts "$domain" 2>/dev/null | awk '/STREAM/ {print $1; exit}')"
    if ! domain_points_to_this_vps "$domain" "$resolved" "$vps_ip"; then
      die "DNS mismatch: ${domain} -> ${resolved:-not found}, this VPS -> ${vps_ip}. Fix A-records or run with SKIP_DNS_CHECK=1."
    fi
  done
}

check_nginx_domain_conflicts() {
  [[ "${ALLOW_NGINX_DOMAIN_TAKEOVER:-0}" == "1" ]] && return
  [[ -d /etc/nginx ]] || return

  local domains=("$FRONT_DOMAIN" "$API_DOMAIN")
  if [[ -n "$FRONT_ALIASES" ]]; then
    # shellcheck disable=SC2206
    domains+=($FRONT_ALIASES)
  fi

  for domain in "${domains[@]}"; do
    local matches
    matches="$($SUDO grep -RslE "server_name[[:space:]].*\\b${domain//./\\.}\\b" /etc/nginx/sites-available /etc/nginx/sites-enabled 2>/dev/null || true)"
    if [[ -n "$matches" ]]; then
      local foreign
      foreign="$(printf '%s\n' "$matches" | grep -vx "$NGINX_AVAILABLE" | grep -vx "$NGINX_ENABLED" || true)"
      if [[ -n "$foreign" ]]; then
        die "Nginx domain conflict for ${domain}. Found in:
${foreign}
Move the other site to another domain, or rerun with ALLOW_NGINX_DOMAIN_TAKEOVER=1 if this is intentional."
      fi
    fi
  done
}

install_system_packages() {
  info "Installing system packages..."
  apt_install update -qq
  apt_install install -y ca-certificates curl gnupg openssl lsb-release rsync nginx certbot python3-certbot-nginx postgresql postgresql-contrib

  if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | sed 's/v//' | cut -d. -f1)" -lt 20 ]]; then
    info "Installing Node.js 20..."
    if [[ -n "$SUDO" ]]; then
      curl -fsSL https://deb.nodesource.com/setup_20.x | $SUDO -E bash -
    else
      curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    fi
    apt_install install -y nodejs
  fi

  if ! command -v pm2 >/dev/null 2>&1; then
    info "Installing PM2..."
    $SUDO npm install -g pm2
  fi

  $SUDO systemctl enable postgresql nginx
  $SUDO systemctl start postgresql nginx
}

setup_database() {
  if [[ -z "$DB_PASS" ]]; then
    DB_PASS="$(random_alnum 32 28)"
    warn "Generated PostgreSQL password for ${DB_USER}: ${DB_PASS}"
  fi
  if [[ -z "$JWT_SECRET" ]]; then
    JWT_SECRET="$(openssl rand -base64 48)"
  fi

  info "Creating/updating PostgreSQL database and user..."
  psql_as_postgres -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';
  ELSE
    ALTER ROLE ${DB_USER} WITH PASSWORD '${DB_PASS}';
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\\gexec

GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
SQL

  psql_as_postgres -v ON_ERROR_STOP=1 -d "$DB_NAME" <<SQL
GRANT ALL ON SCHEMA public TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
SQL
}

write_env_files() {
  info "Writing server and client environment files..."
  local server_env="$SERVER_DIR/.env"
  local client_env="$CLIENT_DIR/.env.production"
  local database_url="postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}?schema=public"

  set_env_key "$server_env" "DATABASE_URL" "\"${database_url}\""
  set_env_key "$server_env" "JWT_SECRET" "\"${JWT_SECRET}\""
  set_env_key "$server_env" "PORT" "${API_PORT}"
  set_env_key "$server_env" "CLIENT_URL" "\"https://${FRONT_DOMAIN}\""
  set_env_key "$server_env" "CLIENT_URLS" "\"${CLIENT_URLS}\""

  set_env_key "$client_env" "VITE_API_URL" "\"https://${API_DOMAIN}/api\""
}

install_and_build_app() {
  info "Installing server dependencies and applying Prisma migrations..."
  npm_install_for_dir "$SERVER_DIR"
  cd "$SERVER_DIR"
  npx prisma generate
  npx prisma migrate deploy

  if [[ "${RUN_SEED:-0}" == "1" ]]; then
    npm run prisma:seed
  fi

  info "Building frontend..."
  npm_install_for_dir "$CLIENT_DIR"
  cd "$CLIENT_DIR"
  npm run build

  info "Publishing frontend to ${WEB_ROOT}..."
  $SUDO mkdir -p "$WEB_ROOT"
  $SUDO rsync -a --delete "$CLIENT_DIR/dist/" "$WEB_ROOT/"
  $SUDO chown -R www-data:www-data "$(dirname "$WEB_ROOT")"
}

start_api() {
  info "Starting API with PM2 as ${PM2_APP_NAME}..."
  cd "$SERVER_DIR"
  if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
    pm2 restart "$PM2_APP_NAME" --update-env
  else
    pm2 start npm --name "$PM2_APP_NAME" -- start
  fi
  pm2 save

  local startup_cmd
  startup_cmd="$(pm2 startup systemd -u "$USER" --hp "$HOME" 2>&1 | grep -E '^sudo|^env' || true)"
  if [[ -n "$startup_cmd" ]]; then
    warn "Run once for PM2 autostart after reboot:"
    echo "  $startup_cmd"
  fi
}

write_nginx_config() {
  info "Writing nginx config ${NGINX_AVAILABLE}..."

  local front_server_names="$FRONT_DOMAIN"
  if [[ -n "$FRONT_ALIASES" ]]; then
    front_server_names="$front_server_names $FRONT_ALIASES"
  fi

  $SUDO tee "$NGINX_AVAILABLE" >/dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${front_server_names};

    root ${WEB_ROOT};
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(?:js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name ${API_DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:${API_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

  $SUDO ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"
  $SUDO nginx -t
  $SUDO systemctl reload nginx
}

setup_firewall() {
  if command -v ufw >/dev/null 2>&1 && $SUDO ufw status 2>/dev/null | grep -q "Status: active"; then
    info "Opening HTTP/HTTPS in ufw..."
    $SUDO ufw allow 80/tcp || true
    $SUDO ufw allow 443/tcp || true
  fi
}

issue_ssl() {
  if [[ "${SKIP_SSL:-0}" == "1" ]]; then
    warn "SKIP_SSL=1, leaving nginx on HTTP only."
    return
  fi

  if [[ -z "$CERTBOT_EMAIL" ]]; then
    read -r -p "Email for Let's Encrypt certificates: " CERTBOT_EMAIL
    [[ -n "$CERTBOT_EMAIL" ]] || die "CERTBOT_EMAIL is required unless SKIP_SSL=1."
  fi

  local cert_domains=(-d "$FRONT_DOMAIN" -d "$API_DOMAIN")
  if [[ -n "$FRONT_ALIASES" ]]; then
    for alias in $FRONT_ALIASES; do
      cert_domains+=(-d "$alias")
    done
  fi

  info "Issuing Let's Encrypt certificates..."
  $SUDO certbot --nginx "${cert_domains[@]}" \
    --non-interactive --agree-tos -m "$CERTBOT_EMAIL" \
    --redirect
}

health_check() {
  info "Checking API..."
  sleep 2
  curl -fsS "http://127.0.0.1:${API_PORT}/api/health" >/dev/null

  if [[ "${SKIP_SSL:-0}" == "1" ]]; then
    curl -fsS "http://${API_DOMAIN}/api/health" >/dev/null || true
  else
    curl -fsS "https://${API_DOMAIN}/api/health" >/dev/null
  fi
}

main() {
  info "Deploying ${APP_NAME}"
  echo "  Frontend: https://${FRONT_DOMAIN}"
  echo "  API:      https://${API_DOMAIN}"
  echo "  PM2 app:  ${PM2_APP_NAME}"
  echo "  Web root: ${WEB_ROOT}"

  install_system_packages
  API_PORT="$(pick_api_port)"
  echo "  API port: 127.0.0.1:${API_PORT}"

  check_dns
  check_nginx_domain_conflicts
  setup_database
  write_env_files
  install_and_build_app
  start_api
  write_nginx_config
  setup_firewall
  issue_ssl
  health_check

  echo ""
  info "Done."
  echo "  Frontend: https://${FRONT_DOMAIN}"
  echo "  API:      https://${API_DOMAIN}/api"
  echo "  Health:   https://${API_DOMAIN}/api/health"
  echo "  Logs:     pm2 logs ${PM2_APP_NAME}"
}

main "$@"
