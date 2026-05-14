'use client';

import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CreditCard, Users } from 'lucide-react';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-2">Welcome back, here is what is happening today.</p>
            </div>

            {/* จำลองการแสดงผลข้อมูลแบบ Card แนว Modern */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Card 1: User Info */}
                <Card className="border-none shadow-md bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-sm font-medium text-slate-500">Session Status</CardTitle>
                        </div>
                        <div className="p-2 bg-green-100 text-green-600 rounded-full">
                            <Activity size={16} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">Active</div>
                        <p className="text-xs text-slate-500 mt-1">Logged in as {user?.email}</p>
                    </CardContent>
                </Card>

                {/* Card 2: Mock Users (ตัวอย่างการวาง UI) */}
                <Card className="border-none shadow-md bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
                        </div>
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                            <Users size={16} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">+2350</div>
                        <p className="text-xs text-slate-500 mt-1">+180 from last month</p>
                    </CardContent>
                </Card>

                {/* Card 3: Mock Sales (ตัวอย่างการวาง UI) */}
                <Card className="border-none shadow-md bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-sm font-medium text-slate-500">Sales</CardTitle>
                        </div>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                            <CreditCard size={16} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">+12,234 ฿</div>
                        <p className="text-xs text-slate-500 mt-1">+19% from last month</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}