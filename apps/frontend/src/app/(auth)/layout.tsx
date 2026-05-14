import GuestGuard from '@/components/guards/GuestGuard';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // 2. นำ GuestGuard มาครอบโครงสร้างเดิมเอาไว้
        <GuestGuard>
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </GuestGuard>
    );
}