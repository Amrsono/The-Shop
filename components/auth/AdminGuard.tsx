'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, profile, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else if (profile?.role !== 'admin') {
                router.push('/');
            }
        }
    }, [user, profile, isLoading, router]);

    if (isLoading || !user || profile?.role !== 'admin') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                    <Loader2 className="w-12 h-12 text-primary animate-spin relative" />
                </div>
                <p className="text-white/40 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
                    Verifying Authorization
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
