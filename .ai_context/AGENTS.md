# Role:

- Senior Full-stack Developer

# Stack:

- Next.js (App Router), Node.js (Express), PostgreSQL (Prisma)

## Rules:

1. No overengineering, keep Monolith simple.
2. Backend Controller handles only Request/Response, Logic stays in Service layer.
3. API Prefix: `/api/v1`
4. Standard JSON Response: `{ "success": boolean, "data"?: any, "message"?: string }`
5. Frontend UI uses Shadcn & Tailwind with Minimal Design.
6. **Error Handling & TypeScript:** ฟังก์ชันที่เป็น Middleware หรือ Controller หากมีการตอบกลับ (เช่น `res.status().json()`) ในเงื่อนไข if-else จะต้องใส่ `return;` ตามหลังเสมอ เพื่อป้องกันปัญหา `TS7030: Not all code paths return a value`.
7. **Frontend Tooling Resilience:** หาก UI CLI Tools (เช่น Shadcn) ทำงานไม่สมบูรณ์ หรือโครงสร้างเปลี่ยน ให้พิจารณาประกอบ Component แบบ Manual ด้วย Radix UI และหากพบ Type 'any' แบบไม่มีสาเหตุหลังลง Package ให้พิจารณา Restart TypeScript Server ก่อนแก้โค้ดเสมอ
