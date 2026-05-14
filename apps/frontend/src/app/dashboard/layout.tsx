'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react'; // นำเข้าไอคอน

import AuthGuard from '@/components/guards/AuthGuard';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { logoutUserFn } from '@/lib/api/auth.api';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, clearAuth } = useAuthStore();

    const handleLogout = async () => {
        try {
            // ยิง API ไปบอก Backend ให้ลบ Cookie ออก
            await logoutUserFn();
        } catch (error) {
            console.error('Logout API failed', error);
        } finally {
            // ไม่ว่า API จะสำเร็จหรือพัง ก็ต้องล้าง State ฝั่ง Client ให้สะอาด
            clearAuth();
            router.push('/login');
        }
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-slate-50 text-slate-900">
                {/* Navigation Bar แบบ Clean & Modern */}
                <nav className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div className="font-bold text-xl text-primary">MockupLogin</div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                            <div className="p-1.5 bg-slate-100 rounded-full">
                                <UserIcon size={16} />
                            </div>
                            {/* แสดงชื่อ หรือ อีเมล ของ User */}
                            <span>{user?.name || user?.email}</span>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={16} className="mr-2" />
                            Logout
                        </Button>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="p-6 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}