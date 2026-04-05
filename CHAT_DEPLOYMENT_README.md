# OPD Management System Deployment README (Chat Summary)

This document summarizes the full deployment guidance from our chat, including:

- where application data is stored
- a fully free production deployment plan
- environment variable setup
- backend and frontend deployment steps
- Nginx reverse proxy and SSL
- PM2 process management
- post-deploy verification checklist

## 1. Where Your Data Is Stored

Primary application data is stored in a MySQL or MariaDB database.

This project uses Prisma with a MySQL datasource.

Backend data access uses:

- DATABASE_URL for Prisma schema and Prisma CLI
- DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME for Prisma MariaDB adapter runtime

Session and auth tokens are stored in cookies, but business data (patients, visits, invoices, etc.) belongs in MySQL or MariaDB.

## 2. Best Fully Free Deployment Option

Use a single Always Free VM and host everything yourself:

1. Oracle Cloud Always Free Ubuntu VM
2. MariaDB installed on the same VM
3. Backend app running on port 3000
4. Frontend app running on port 3001
5. Nginx reverse proxy on ports 80 and 443
6. Free domain from DuckDNS
7. Free SSL certificates via Let's Encrypt (certbot)

This gives a fully free production setup if you stay within Always Free limits.

## 3. Required Environment Variables

### Backend (.env in opd_backend)

DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DBNAME
DATABASE_HOST=HOST
DATABASE_USER=USER
DATABASE_PASSWORD=PASSWORD
DATABASE_NAME=DBNAME
JWT_SECRET=your_long_random_secret

### Frontend (.env in opd_frontend)

API_URL=https://your-domain.example
SESSION_SECRET=your_long_random_secret

Notes:

- API_URL should point to your backend base URL exposed publicly.
- Use different strong secrets for JWT_SECRET and SESSION_SECRET.
- Never commit .env files.

## 4. Free Deployment Steps

## 4.1 Server preparation

On Ubuntu VM:

- install Node.js 20 LTS
- install nginx
- install mariadb-server
- install git
- install pm2 globally
- install certbot + nginx plugin

## 4.2 Clone repository and install dependencies

- clone repo
- run npm ci in opd_backend
- run npm ci in opd_frontend

## 4.3 Setup MariaDB

Create DB and user:

- database: opdms
- user: opduser
- password: strong password
- grant privileges on opdms

## 4.4 Configure environment files

Create backend and frontend .env files with values above.

## 4.5 Prisma and builds

In backend:

- npx prisma generate
- npx prisma db push (or npx prisma migrate deploy if migrations are maintained)
- npm run build

In frontend:

- npm run build

## 4.6 Run with PM2

Backend:

- PORT=3000 NODE_ENV=production pm2 start npm --name opd-backend -- start

Frontend:

- PORT=3001 NODE_ENV=production pm2 start npm --name opd-frontend -- start

Persist:

- pm2 save
- pm2 startup

## 4.7 Nginx reverse proxy

Single domain strategy:

- /api and /auth routes forwarded to backend (127.0.0.1:3000)
- all other routes forwarded to frontend (127.0.0.1:3001)

Then:

- nginx -t
- systemctl reload nginx

## 4.8 SSL with certbot

- certbot --nginx -d your-domain
- enable forced HTTPS redirect

## 5. Example Nginx Config (Single Domain)

server {
    listen 80;
    server_name your-domain.example;

    client_max_body_size 20M;

    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /auth/ {
        proxy_pass http://127.0.0.1:3000/auth/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

## 6. Example Deploy Script

Create deploy.sh in project root:

#!/usr/bin/env bash
set -e

APP_ROOT="/var/www/OPD-Management-System"
BACKEND_DIR="$APP_ROOT/opd_backend"
FRONTEND_DIR="$APP_ROOT/opd_frontend"

cd "$APP_ROOT"
git pull origin fir-parent

cd "$BACKEND_DIR"
npm ci
npx prisma generate
npx prisma db push
npm run build

cd "$FRONTEND_DIR"
npm ci
npm run build

pm2 delete opd-backend || true
pm2 delete opd-frontend || true

cd "$BACKEND_DIR"
PORT=3000 NODE_ENV=production pm2 start npm --name opd-backend -- start

cd "$FRONTEND_DIR"
PORT=3001 NODE_ENV=production pm2 start npm --name opd-frontend -- start

pm2 save
pm2 status

## 7. 10-Minute Post-Deploy Checklist

1. DNS resolves to VM IP.
2. Nginx is active.
3. PM2 shows both apps online.
4. Backend API reachable from public URL.
5. Frontend login page loads.
6. Login works and session cookie is set.
7. Create one test entity and verify DB row exists.
8. SSL certificate is valid.
9. certbot renew dry-run succeeds.
10. Reboot VM and verify auto-start works.

## 8. Important Security Notes

- Rotate any secrets that were ever exposed.
- Keep .env files out of source control.
- Use strong passwords and secrets.
- Set HTTPS and secure cookies in production.
- Add regular database backups.
- Enable PM2 log rotation.

## 9. Optional Improvements

- Add health endpoints for uptime monitoring.
- Add CI pipeline for build checks.
- Move DB to managed free tier if you outgrow one VM.
- Add firewall hardening and fail2ban.

---

This README is a practical chat-based deployment blueprint for this OPD Management System repository.