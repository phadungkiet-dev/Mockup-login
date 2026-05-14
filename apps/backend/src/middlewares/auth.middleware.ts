import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request interface เพื่อให้เก็บ userId ได้
export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ success: false, message: "Access token is required" });
    return; // สำคัญ: ต้อง return เพื่อหยุดการทำงานของฟังก์ชันทันที และไม่ให้ TS ฟ้อง error
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string,
    ) as { userId: string };
    req.userId = decoded.userId; // แนบ userId ไปกับ Request
    next(); // ปล่อยให้ทำงานต่อไปยัง Controller
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
    return;
  }
};
