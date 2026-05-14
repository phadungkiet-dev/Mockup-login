import jwt from "jsonwebtoken";

// สร้าง Access Token (อายุ 15 นาที)
export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "15m",
  });
};

// สร้าง Refresh Token (อายุ 7 วัน)
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};
