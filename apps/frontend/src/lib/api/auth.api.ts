import axiosInstance from "../axios";

// กำหนด Type สำหรับส่งข้อมูล
export interface LoginInput {
  email: string;
  password?: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

// ฟังก์ชันยิง API Login
export const loginUser = async (data: LoginInput) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

// ฟังก์ชันยิง API Register
export const registerUser = async (data: RegisterInput) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

export const loginWithGoogle = async (credential: string) => {
  const response = await axiosInstance.post("/auth/google", { credential });
  return response.data;
};

export const refreshAuthToken = async () => {
  const response = await axiosInstance.post("/auth/refresh");
  return response.data;
};

export const logoutUserFn = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
