#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${SSH_HOST:-}" || -z "${SSH_USER:-}" ]]; then
  echo "Usage: SSH_HOST=host SSH_USER=user REMOTE_DIR=/var/www/portfolio bash deploy/aws/backend-deploy.sh"
  exit 1
fi

REMOTE_DIR="${REMOTE_DIR:-/var/www/portfolio}"
APP_NAME="portfolio"

npm run build

ssh "$SSH_USER@$SSH_HOST" "mkdir -p '$REMOTE_DIR' '$REMOTE_DIR/uploads'"
rsync -av --delete --exclude node_modules --exclude .git --exclude dist --exclude .env . "$SSH_USER@$SSH_HOST:$REMOTE_DIR/"

ssh "$SSH_USER@$SSH_HOST" "bash -s" <<EOF
set -euo pipefail
cd "$REMOTE_DIR"
if [ ! -f package.json ]; then
  echo 'Remote project directory is missing package.json' >&2
  exit 1
fi
npm install --omit=dev
cp deploy/aws/.env.production.example .env
mkdir -p uploads
sudo cp deploy/aws/app.service /etc/systemd/system/$APP_NAME.service
sudo systemctl daemon-reload
sudo systemctl enable --now $APP_NAME
sudo cp deploy/aws/nginx.conf /etc/nginx/sites-available/$APP_NAME
sudo ln -sfn /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/$APP_NAME
sudo nginx -t
sudo systemctl reload nginx
EOF

echo "Backend deployment completed. Edit the remote .env file before restarting the app."
