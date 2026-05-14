'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    // สร้าง QueryClient ไว้ใน state เพื่อให้มันจำค่าไว้ ไม่ถูกรีเซ็ตตอน React re-render
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // ข้อมูลจะถูกมองว่าเก่าเมื่อผ่านไป 1 นาที (ช่วยลดการยิง API ซ้ำซ้อน)
                retry: 1, // ถ้า error ให้ลองใหม่ 1 ครั้ง
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}