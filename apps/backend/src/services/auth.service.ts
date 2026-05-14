import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/password.util";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.util";
import { verifyGoogleToken } from "../utils/google.util";
import { Provider } from "../generated/prisma/enums";
import jwt from "jsonwebtoken";

// ประกาศ Type ของข้อมูลที่ต้องส่งเข้ามาตอน Register
interface RegisterInput {
  email: string;
  password?: string;
  name?: string;
}

export const registerUser = async (input: RegisterInput) => {
  // 1. ตรวจสอบว่ามี Email นี้ในระบบหรือยัง
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  // 2. เข้ารหัสผ่าน (ถ้ามีส่งมา)
  const hashedPassword = input.password
    ? await hashPassword(input.password)
    : null;

  // 3. บันทึกข้อมูลลง Database
  const newUser = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      name: input.name,
    },
    // ไม่ดึงรหัสผ่านกลับมาเพื่อความปลอดภัย
    select: { id: true, email: true, name: true, createdAt: true },
  });

  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  // 1. หา User ใน Database
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  // 2. ตรวจสอบรหัสผ่าน
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // 3. สร้าง Token
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // 4. บันทึก Refresh Token ลง Database พร้อมกำหนดวันหมดอายุ (7 วัน)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
  };
};

export const loginWithGoogle = async (credential: string) => {
  // 1. ตรวจสอบความถูกต้องของ Token ที่ส่งมาจาก Frontend
  const payload = await verifyGoogleToken(credential);
  if (!payload || !payload.email) {
    throw new Error("Verification failed. Email not found in Google payload.");
  }

  const { email, name, sub } = payload; // sub คือ ID เฉพาะตัวของ Google

  // 2. ตรวจสอบว่ามี User นี้ใน Database แล้วหรือยัง
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // 3. ถ้ายังไม่มี ให้สร้าง User ใหม่ (ไม่มี Password เพราะ Login ผ่าน Google)
    user = await prisma.user.create({
      data: {
        email,
        name: name || "Google User",
        provider: Provider.GOOGLE,
        providerId: sub,
      },
    });
  } else if (!user.providerId && user.provider === Provider.LOCAL) {
    // 4. (Optional) ถ้ามีอีเมลนี้อยู่แล้ว แต่เป็นการสมัครแบบ LOCAL เราสามารถผูกบัญชีให้ได้
    user = await prisma.user.update({
      where: { email },
      data: {
        provider: Provider.GOOGLE,
        providerId: sub,
      },
    });
  }

  // 5. สร้าง Token ของระบบเรา (นำโค้ดเดิมมาใช้ซ้ำได้เลย)
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
  };
};

export const refreshUserToken = async (refreshToken: string) => {
  // 1. ตรวจสอบว่า Token นี้มีใน Database หรือไม่
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  // 2. ตรวจสอบว่า Token หมดอายุตามมาตรฐาน JWT หรือยัง
  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
  } catch (error) {
    // ถ้าหมดอายุ ให้ลบออกจาก DB ด้วย
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    throw new Error("Refresh token expired");
  }

  // 3. ถ้าถูกต้องทั้งหมด ให้สร้าง Access Token ตัวใหม่
  const accessToken = generateAccessToken(storedToken.userId);

  return {
    user: {
      id: storedToken.user.id,
      email: storedToken.user.email,
      name: storedToken.user.name,
    },
    accessToken,
  };
};

export const logoutUser = async (refreshToken: string) => {
  if (refreshToken) {
    // ใช้ deleteMany เผื่อในกรณีฉุกเฉินที่มี Token ซ้ำซ้อนกัน
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }
};
