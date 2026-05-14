# 🚀 Mockup-Login (Demo Project)

นี่คือโปรเจค Demo ระบบ Authentication แบบ Full-stack ที่เขียนขึ้นมาเพื่อใช้เป็น Portfolio และเป็นต้นแบบสำหรับนำไปเขียน Testcase ครับ เน้นโครงสร้างโค้ดที่อ่านง่าย (Clean Code) และมีความปลอดภัยพื้นฐาน (Security Basics)

## 💻 Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Shadcn UI
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Features:**
  - Login / Register ด้วย Email & Password
  - Google OAuth Login
  - JWT Access Token + HttpOnly Cookie (Refresh Token)
  - Protected Routes & Silent Refresh

## 📂 โครงสร้างโปรเจค (Monorepo)

- `apps/frontend/` - ฝั่งหน้าบ้าน (UI) รันบนพอร์ต `3000`
- `apps/backend/` - ฝั่งหลังบ้าน (API) รันบนพอร์ต `5000`

## 🛠️ วิธีการรันโปรเจค (Quick Start)

**1. Run Backend**
cd apps/backend
npm install

# อย่าลืมก๊อปปี้ .env.example เป็น .env และตั้งค่า DATABASE_URL / JWT_SECRET

npx prisma migrate dev
npm run dev

**2. Run Frontend**
cd apps/frontend
npm install

# อย่าลืมก๊อปปี้ .env.local.example เป็น .env.local และตั้งค่า NEXT_PUBLIC_GOOGLE_CLIENT_ID

npm run dev
