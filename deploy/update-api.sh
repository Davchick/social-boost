#!/usr/bin/env bash
# Обновление API после git pull
#   cd ~/server/social-boost && bash deploy/update-api.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${REPO_ROOT:-$(cd "$SCRIPT_DIR/.." && pwd)}"
SERVER_DIR="$REPO_ROOT/server"

cd "$SERVER_DIR"
npm install
npx prisma generate
npx prisma migrate deploy

cd "$REPO_ROOT"
pm2 restart social-boost-api
echo "API обновлён. pm2 logs social-boost-api — для проверки."
