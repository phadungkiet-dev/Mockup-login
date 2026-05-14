import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // การทำ Validation เบื้องต้น (เดี๋ยวเราค่อยปรับใช้ Zod Middleware เพื่อความเนียน)
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
      return;
    }

    const user = await authService.registerUser({ email, password, name });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
      return;
    }

    const result = await authService.loginUser(email, password);

    // เซ็ต Refresh Token ลงใน HttpOnly Cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ต้องเป็น HTTPS ถ้ารันบน Production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
    });

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export const googleLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { credential } = req.body;

    if (!credential) {
      res
        .status(400)
        .json({ success: false, message: "Google credential is required" });
      return; // อย่าลืมใส่ return เพื่อกัน Error TS7030 ตามกฏของเราครับ
    }

    const result = await authService.loginWithGoogle(credential);

    // เซ็ต Refresh Token ลง Cookie เหมือนการ Login ปกติ
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Google Login failed",
    });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    // อ่าน Cookie ด้วย cookie-parser ที่เราลงไว้ใน Phase 1
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res
        .status(401)
        .json({ success: false, message: "No refresh token found" });
      return;
    }

    const result = await authService.refreshUserToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    // ถ้า Refresh Token มีปัญหา (เช่น หมดอายุ) ให้สั่งลบ Cookie ทิ้งไปเลย
    res.clearCookie("refreshToken");
    res
      .status(401)
      .json({ success: false, message: error.message || "Refresh failed" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    // ถ้ามี Cookie ส่งมา ให้ลบออกจาก Database ก่อน
    if (refreshToken) {
      await authService.logoutUser(refreshToken);
    }

    // สั่ง Browser ให้ทำลาย HttpOnly Cookie ทิ้ง
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};
