import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // สำคัญมาก: อนุญาตให้รับ/ส่ง HttpOnly Cookie ได้
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
