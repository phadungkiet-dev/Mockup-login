import { Router } from "express";
import {
  register,
  login,
  googleLogin,
  refresh,
  logout,
} from "../controllers/auth.controller";
import { requireAuth, AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/refresh", refresh); // เพิ่ม Route ใหม่
router.post("/logout", logout);

// ตัวอย่าง Route ที่ถูกป้องกันไว้ (ต้องมี Access Token ถึงเข้าได้)
router.get("/me", requireAuth, (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      userId: req.userId,
      message: "You have access to this protected route!",
    },
  });
});

export default router;
