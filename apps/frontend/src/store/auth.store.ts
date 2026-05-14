import { create } from "zustand";
import { persist } from "zustand/middleware"; // 1. นำเข้า persist

// กำหนด Type ของข้อมูล User
export interface User {
  id: string;
  email: string;
  name: string | null;
}

// กำหนดโครงสร้างของ Store
interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
}

// สร้าง Zustand Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  clearAuth: () => set({ user: null, accessToken: null }),
}));
