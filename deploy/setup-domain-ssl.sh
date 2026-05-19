#!/usr/bin/env bash
# HTTPS для API на api.smart-word.ru (nginx + Let's Encrypt)
# Запуск на VPS из корня репозитория:
#   cd ~/server/social-boost && bash deploy/setup-domain-ssl.sh
#
# Перед запуском в DNS Beget добавьте:
#   Тип A, имя api, значение IP_ВАШЕГО_VPS (не 159.194.198.249, если API на другом сервере)
#
# Переменные:
#   API_DOMAIN=api.smart-word.ru
#   API_PORT=4000
#   CERTBOT_EMAIL=your@email.com
#   CLIENT_URL=https://social-boost-o64n.onrender.com

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}==>${NC} $*"; }
warn()  { echo -e "${YELLOW}!!>${NC} $*"; }
die()   { echo -e "${RED}ERROR:${NC} $*" >&2; exit 1; }

wait_for_apt() {
  local max_wait="${APT_LOCK_WAIT_SEC:-600}"
  local waited=0
  while sudo fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 \
     || sudo fuser /var/lib/apt/lists/lock >/dev/null 2>&1 \
     || sudo fuser /var/cache/apt/archives/lock >/dev/null 2>&1; do
    if (( waited == 0 )); then warn "Жду освобождения apt lock..."; fi
    if (( waited >= max_wait )); then die "apt lock не освободился"; fi
    sleep 5
    waited=$((waited + 5))
  done
}

apt_install() {
  wait_for_apt
  sudo DEBIAN_FRONTEND=noninteractive apt-get "$@"
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${REPO_ROOT:-$(cd "$SCRIPT_DIR/.." && pwd)}"
SERVER_DIR="$REPO_ROOT/server"

API_DOMAIN="${API_DOMAIN:-api.smart-word.ru}"
API_PORT="${API_PORT:-4000}"
CLIENT_URL="${CLIENT_URL:-https://social-boost-o64n.onrender.com,http://localhost:5173}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"

[[ -f "$SERVER_DIR/package.json" ]] || die "Запустите из репозитория social-boost (папки client/ и server/)."

if ! pm2 describe social-boost-api >/dev/null 2>&1; then
  warn "PM2-процесс social-boost-api не найден. Сначала: bash deploy/setup-vps.sh"
fi

if [[ -z "$CERTBOT_EMAIL" ]]; then
  read -r -p "Email для Let's Encrypt (уведомления об истечении сертификата): " CERTBOT_EMAIL
  [[ -n "$CERTBOT_EMAIL" ]] || die "Нужен CERTBOT_EMAIL"
fi

info "Проверка DNS: $API_DOMAIN должен указывать на IP этого VPS"
RESOLVED="$(getent ahosts "$API_DOMAIN" 2>/dev/null | awk '/STREAM/ {print $1; exit}')"
VPS_IP="$(curl -fsSL -4 --max-time 5 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')"
if [[ -n "$RESOLVED" && -n "$VPS_IP" && "$RESOLVED" != "$VPS_IP" ]]; then
  warn "DNS $API_DOMAIN → $RESOLVED, IP VPS → $VPS_IP"
  warn "Если они разные, certbot может не пройти. В Beget: A-запись api → $VPS_IP"
  read -r -p "Продолжить? [y/N] " ans
  [[ "${ans,,}" == "y" ]] || exit 1
fi

info "Установка nginx и certbot..."
apt_install update -qq
apt_install install -y nginx certbot python3-certbot-nginx

info "Конфиг nginx для $API_DOMAIN → 127.0.0.1:$API_PORT"
sudo cp "$SCRIPT_DIR/nginx-smart-word-api.conf" "/etc/nginx/sites-available/smart-word-api"
sudo sed -i "s/127.0.0.1:4000/127.0.0.1:${API_PORT}/" "/etc/nginx/sites-available/smart-word-api"
sudo ln -sf "/etc/nginx/sites-available/smart-word-api" "/etc/nginx/sites-enabled/smart-word-api"
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl reload nginx

if command -v ufw >/dev/null 2>&1; then
  sudo ufw allow 80/tcp 2>/dev/null || true
  sudo ufw allow 443/tcp 2>/dev/null || true
fi

info "Получение SSL-сертификата..."
sudo certbot --nginx -d "$API_DOMAIN" \
  --non-interactive --agree-tos -m "$CERTBOT_EMAIL" \
  --redirect

# --- обновить server/.env ---
ENV_FILE="$SERVER_DIR/.env"
if [[ -f "$ENV_FILE" ]]; then
  if grep -q '^CLIENT_URL=' "$ENV_FILE"; then
    sed -i "s|^CLIENT_URL=.*|CLIENT_URL=\"${CLIENT_URL}\"|" "$ENV_FILE"
  elif grep -q '^CLIENT_URLS=' "$ENV_FILE"; then
    sed -i "s|^CLIENT_URLS=.*|CLIENT_URL=\"${CLIENT_URL}\"|" "$ENV_FILE"
  else
    echo "CLIENT_URL=\"${CLIENT_URL}\"" >> "$ENV_FILE"
  fi
  if grep -q '^PORT=' "$ENV_FILE"; then
    sed -i "s|^PORT=.*|PORT=${API_PORT}|" "$ENV_FILE"
  fi
  info "Обновлён $ENV_FILE (CLIENT_URL, PORT)"
else
  warn "Нет $ENV_FILE — создайте вручную с PORT=${API_PORT} и CLIENT_URL=${CLIENT_URL}"
fi

pm2 restart social-boost-api 2>/dev/null || true

API_URL="https://${API_DOMAIN}/api"
echo ""
info "Готово."
echo "  API:     ${API_URL}"
echo "  Health:  https://${API_DOMAIN}/api/health"
echo ""
echo "На Render (Static Site → Environment):"
echo "  VITE_API_URL=${API_URL}"
echo "  → Manual Deploy / Clear build cache & deploy"
echo ""
echo "Проверка с ПК:"
echo "  curl https://${API_DOMAIN}/api/health"
