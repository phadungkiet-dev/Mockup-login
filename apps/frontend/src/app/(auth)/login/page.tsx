'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { loginUser, LoginInput, loginWithGoogle } from '@/lib/api/auth.api';
import { useAuthStore } from '@/store/auth.store';

// 1. กำหนด Schema สำหรับ Validation ด้วย Zod
const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    // 2. Setup React Hook Form
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // 3. Setup TanStack Query Mutation สำหรับเรียก API
    const loginMutation = useMutation({
        mutationFn: (data: LoginInput) => loginUser(data),
        onSuccess: (response) => {
            // เมื่อ Login สำเร็จ ให้บันทึกข้อมูลลง Zustand
            setAuth(response.data.user, response.data.accessToken);
            // Redirect ไปหน้า Dashboard
            router.push('/dashboard');
        },
        onError: (error: any) => {
            // แสดง Error จาก Backend (สามารถเปลี่ยนไปใช้ Toast Notification ได้ในอนาคต)
            alert(error.response?.data?.message || 'Login failed');
        },
    });

    // สร้าง Mutation สำหรับจัดการ Google Login โดยเฉพาะ
    const googleLoginMutation = useMutation({
        mutationFn: (credential: string) => loginWithGoogle(credential),
        onSuccess: (response) => {
            // เมื่อ Backend ตรวจสอบผ่านและส่งข้อมูลกลับมา ให้บันทึกลง Zustand
            setAuth(response.data.user, response.data.accessToken);
            router.push('/dashboard');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Google Login failed');
        },
    });

    // 4. ฟังก์ชันเมื่อกด Submit Form
    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        loginMutation.mutate(values);
    };

    return (
        <Card>
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Sign in</CardTitle>
                <CardDescription>Enter your email and password to access your account</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="m@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </Form>

                {/* เพิ่มเส้นแบ่ง Divider */}
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                {/* ปุ่ม Google Login สำเร็จรูป */}
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            if (credentialResponse.credential) {
                                // ส่ง Google Token ไปให้ Backend ตรวจสอบ
                                googleLoginMutation.mutate(credentialResponse.credential);
                            }
                        }}
                        onError={() => {
                            console.error('Google Login Failed');
                            alert('Google Login Failed');
                        }}
                    // useOneTap // เพิ่มลูกเล่น One Tap Login (ถ้า User เคยล็อคอินบนเบราว์เซอร์นี้แล้วจะขึ้นเด้งให้กดง่ายๆ)
                    />
                </div>

                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}