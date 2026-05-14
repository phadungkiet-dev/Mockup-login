'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { refreshAuthToken } from '@/lib/api/auth.api';
import { useAuthStore } from '@/store/auth.store';

export default function RootPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const response = await refreshAuthToken();
        setAuth(response.data.user, response.data.accessToken);
        router.push('/dashboard');
      } catch (error) {
        router.push('/login');
      }
    };
    checkInitialAuth();
  }, [router, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-slate-500 animate-pulse">Checking credentials...</div>
    </div>
  );
}