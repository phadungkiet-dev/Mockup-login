'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { refreshAuthToken } from '@/lib/api/auth.api';

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, accessToken, setAuth } = useAuthStore();

    // สร้าง State เพื่อป้องกันหน้าจอกระตุก (Flicker) ตอนโหลด
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            // 1. ถ้าใน RAM มีข้อมูลอยู่แล้ว (Login แล้วแน่นอน) -> เตะไป Dashboard
            if (user && accessToken) {
                router.push('/dashboard');
                return;
            }

            // 2. ถ้าใน RAM ไม่มีข้อมูล ลองยิง API เช็ค Cookie ดูเงียบๆ
            try {
                const response = await refreshAuthToken();
                // ถ้า Backend คืน Token มาให้ แสดงว่าแอบมี Cookie อยู่ -> เตะไป Dashboard
                setAuth(response.data.user, response.data.accessToken);
                router.push('/dashboard');
            } catch (error) {
                // ถ้าเช็คแล้วไม่มี Token และไม่มี Cookie จริงๆ -> อนุญาตให้แสดงหน้า Login ได้
                setIsChecking(false);
            }
        };

        checkAuthentication();
    }, [user, accessToken, setAuth, router]);

    // ระหว่างที่กำลังเช็ค ให้แสดงหน้า Loading หรือปล่อยจอขาวไว้ก่อนเพื่อไม่ให้ฟอร์ม Login โผล่มาแวบหนึ่ง
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-slate-500 animate-pulse">Loading...</div>
            </div>
        );
    }

    return <>{children}</>;
}