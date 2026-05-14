# Database:

PostgreSQL mapped with snake_case.

# Tables:

users, refresh_tokens.

# Data Flow (Login):

1. Client sends credentials.
2. Server validates -> Generates AccessToken (JWT) & RefreshToken.
3. Server returns AccessToken in payload, sets RefreshToken in HttpOnly Cookie.
4. Client uses AccessToken in Authorization: Bearer <token> for API requests.

## 1. Database Schema (PostgreSQL via local)

- Database Name: `mockup_login`
- ORM: Prisma Client (Singleton pattern at `src/config/prisma.ts`)

**Tables:**

- `users`: เก็บข้อมูลผู้ใช้ (id, email, password, name, provider, providerId)
- `refresh_tokens`: เก็บ Token ยืนยันตัวตนระยะยาวแบบ One-to-Many กับ User (id, token, userId, expiresAt)

## 2. API Design & Data Flow

- Base URL: `http://localhost:5000/api/v1`
- Server Engine: Express.js
- **Current Flow:** Server Starts -> Check PostgreSQL Connection via Prisma -> Open Port 5000 -> Ready to serve.

## 3. Security & Authentication Flow (Updated)

- **Password Hashing:** `bcryptjs`
- **Authentication Strategy:** JWT (JSON Web Tokens)
  - `AccessToken`: อายุ 15 นาที (ส่งกลับทาง JSON, ฝั่ง Frontend จะเก็บใน Memory/Zustand)
  - `RefreshToken`: อายุ 7 วัน (ส่งผ่าน `HttpOnly`, `Secure`, `SameSite=Strict` Cookie เพื่อป้องกัน XSS)
- **Protected Routes:** ใช้ Middleware (`requireAuth`) ตรวจสอบ `Authorization: Bearer <token>` ใน Header

## 4. Frontend Architecture

- **Framework:** Next.js (App Router)
- **UI Library:** Tailwind CSS, Shadcn UI, Lucide React
- **State Management:**
  - `Zustand` สำหรับ Global Client State
  - `TanStack Query` (React Query) สำหรับ Server State และ Data Fetching
- **API Client:** `axios` (ตั้งค่า `withCredentials: true` เพื่อรองรับการรับ-ส่ง HttpOnly Cookie สำหรับ Refresh Token)
- **Form & Validation:** `react-hook-form` ทำงานคู่กับ `zod` schema
- **Routing Strategy:** ใช้ Next.js Route Groups เช่น `(auth)` เพื่อจัดกลุ่ม Layout ที่มี UI ร่วมกันโดยไม่กระทบ URL Path
