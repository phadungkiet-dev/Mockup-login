import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";

const app: Application = express();

// Middlewares พื้นฐาน
// ป้องกันความปลอดภัยเบื้องต้นผ่าน HTTP Headers
app.use(helmet());

// อนุญาตให้ Frontend ยิง API ข้ามโดเมน/พอร์ตได้
app.use(
  cors({
    origin: "http://localhost:3000", // เดี๋ยวเราค่อยเปลี่ยนเป็น env ตอนขึ้น Production
    credentials: true, // สำคัญมาก! ทำให้แนบ HttpOnly Cookie มากับ Request ได้
  }),
);

// แปลง Request Body ที่เป็น JSON ให้เป็น JavaScript Object
app.use(express.json());

// อ่านข้อมูลจาก URL-encoded
app.use(express.urlencoded({ extended: true }));

// ทำให้อ่าน Cookie จาก Request ได้ (สำหรับ Refresh Token)
app.use(cookieParser());

// Route พื้นฐานสำหรับทดสอบว่า Server ทำงานปกติ (Health Check)
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Mockup-Login API is running efficiently.",
  });
});

app.use("/api/v1/auth", authRoutes);

// เราจะเพิ่ม Routes อื่นๆ ที่นี่ในภายหลัง

export default app;
