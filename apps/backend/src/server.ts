import app from "./app";
import dotenv from "dotenv";
import prisma from "./config/prisma";

// โหลดตัวแปรจากไฟล์ .env
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // ทดสอบการเชื่อมต่อ Database
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error("Failed to start server or connect to database:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
