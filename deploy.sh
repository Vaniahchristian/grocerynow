#!/bin/bash
# Deploy script - credentials inline for TESTING only. Do not commit.
set -e

VPS_HOST="187.124.35.119"
VPS_USER="root"
VPS_PASS="070012Tytus@"
REPO_URL="https://github.com/Vaniahchristian/century-groceries-store_3.git"
DOMAIN="grocerynowstore.com"
DB_NAME="grocery_now"
DB_USER="grocery_user"
DB_PASSWORD="0754092850@Vc"

DEPLOY_DIR="/var/www/century-groceries"

echo "=== Uploading SQL backup to VPS ==="
if command -v sshpass &>/dev/null; then
  sshpass -p "${VPS_PASS}" scp -o StrictHostKeyChecking=no grocery_now_backup.sql "${VPS_USER}@${VPS_HOST}:/tmp/grocery_now_backup.sql"
  RUN_SSH="sshpass -p ${VPS_PASS} ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST}"
else
  echo "sshpass not found - you will be prompted for the VPS password (${VPS_USER}@${VPS_HOST})."
  scp -o StrictHostKeyChecking=no grocery_now_backup.sql "${VPS_USER}@${VPS_HOST}:/tmp/grocery_now_backup.sql"
  RUN_SSH="ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST}"
fi

$RUN_SSH "bash -s" << 'REMOTE_SCRIPT'
set -e
export DEBIAN_FRONTEND=noninteractive

VPS_DEPLOY_DIR="/var/www/century-groceries"
REPO_URL="https://github.com/Vaniahchristian/century-groceries-store_3.git"
DOMAIN="grocerynowstore.com"
DB_NAME="grocery_now"
DB_USER="grocery_user"
DB_PASSWORD="0754092850@Vc"

echo "=== Installing Node 20, MySQL, Nginx, PM2 ==="
apt-get update -y
apt-get install -y curl git nginx mysql-server

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

echo "=== MySQL: create DB and user, import backup ==="
mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost'; FLUSH PRIVILEGES;"
mysql "${DB_NAME}" < /tmp/grocery_now_backup.sql
rm -f /tmp/grocery_now_backup.sql

echo "=== Clone/Build app ==="
# Avoid git prompting for credentials (public repo clone needs no auth)
export GIT_TERMINAL_PROMPT=0
mkdir -p "$(dirname "${VPS_DEPLOY_DIR}")"
if [ -d "${VPS_DEPLOY_DIR}/.git" ]; then
  cd "${VPS_DEPLOY_DIR}" && git fetch origin && git reset --hard origin/main
else
  # Remove partial/empty dir from failed previous clone so clone can succeed
  [ -d "${VPS_DEPLOY_DIR}" ] && rm -rf "${VPS_DEPLOY_DIR}"
  git clone --depth 1 "${REPO_URL}" "${VPS_DEPLOY_DIR}"
  cd "${VPS_DEPLOY_DIR}"
fi

# Fail fast if required components are missing (e.g. not pushed to GitHub)
for f in components/header.tsx components/footer.tsx components/checkout-form.tsx; do
  if [ ! -f "$f" ]; then
    echo "ERROR: Missing $f on VPS. Push your code first: git push origin main"
    exit 1
  fi
done

cat > backend/.env << ENV
DB_HOST=localhost
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
PORT=4000
NODE_ENV=production
APP_URL=https://${DOMAIN}/
MARZPAY_API_URL=https://wallet.wearemarz.com/api/v1
MARZPAY_API_CREDENTIALS=bWFyel9DWFZxSnJweE8wb2R5MTdwOkpkZmhPclJtODhGV0ZHd1hSemtCbmZGWTRld1ZGaldp
TELEGRAM_BOT_TOKEN=8316072456:AAHvb43asFN-bYHG5mcUXKJoDEfZtWOf8U0
TELEGRAM_CHAT_ID=1799637604,5175475526
ENV

mkdir -p backend/uploads
cd backend && npm ci --omit=dev && cd ..

echo "NEXT_PUBLIC_SITE_URL=https://${DOMAIN}" > .env.local
echo "NEXT_PUBLIC_API_URL=/api" >> .env.local

npm ci --omit=dev && npm run build

echo "=== PM2: backend and frontend ==="
pm2 delete backend 2>/dev/null || true
pm2 delete frontend 2>/dev/null || true
cd "${VPS_DEPLOY_DIR}/backend" && pm2 start index.js --name backend
cd "${VPS_DEPLOY_DIR}" && pm2 start npm --name frontend -- start
pm2 save
pm2 startup | tail -1 | bash || true

echo "=== Nginx ==="
cat > /etc/nginx/sites-available/grocerynow << NGINX
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    location /api {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        client_max_body_size 10M;
    }
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX
ln -sf /etc/nginx/sites-available/grocerynow /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

apt-get install -y certbot python3-certbot-nginx 2>/dev/null || true
certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" --non-interactive --agree-tos --email admin@${DOMAIN} --redirect || true

echo "=== Done. Visit https://${DOMAIN} ==="
REMOTE_SCRIPT
