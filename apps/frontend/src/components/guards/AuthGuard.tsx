'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { refreshAuthToken } from '@/lib/api/auth.api';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, accessToken, setAuth } = useAuthStore();

    // สถานะเพื่อดักหน้าจอ Loading
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            // 1. ถ้าใน RAM มีข้อมูลอยู่แล้ว (เปิดใช้งานปกติ ไม่ได้กด F5)
            if (user && accessToken) {
                setIsChecking(false);
                return;
            }

            // 2. ถ้าใน RAM ไม่มีข้อมูล (เกิดจากการกด F5 หรือพึ่งเข้าเว็บใหม่) ให้ลอง Silent Refresh
            try {
                const response = await refreshAuthToken();
                // ถ้าสำเร็จ Backend ส่งข้อมูลใหม่มาให้ -> บันทึกลง RAM ทันที
                setAuth(response.data.user, response.data.accessToken);
                setIsChecking(false);
            } catch (error) {
                // ถ้า Refresh Token ไม่มี หรือหมดอายุ -> เตะกลับไปหน้า Login อย่างปลอดภัย
                router.push('/login');
            }
        };

        checkAuthentication();
    }, [user, accessToken, setAuth, router]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-slate-500 animate-pulse">Authenticating securely...</div>
            </div>
        );
    }

    return <>{children}</>;
}