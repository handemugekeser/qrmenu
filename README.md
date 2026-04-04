# QRmenu - Dijital Menu SaaS

Full-stack SaaS: Vue 3 + NestJS + PostgreSQL + Prisma

## Quick Start

```bash
# 1. Backend
cd backend && npm install
cp .env.example .env   # set DATABASE_URL
npx prisma db push
npx prisma generate
npx ts-node prisma/seed.ts
npx ts-node src/main.ts   # port 3001

# 2. Frontend (new terminal)
cd frontend && npm install
npm run dev   # port 5173
```

Demo: demo@qrmenu.app / password123
Public menu: http://localhost:5173/menu/demo-restaurant

## Docker
docker-compose up -d

## Stack
- Backend: NestJS, Prisma, PostgreSQL, JWT, qrcode lib
- Frontend: Vue 3, Vite, TailwindCSS, Pinia, Vue Router, vue-draggable-plus

## Plans: FREE / PRO (299 TRY) / PREMIUM (599 TRY)
