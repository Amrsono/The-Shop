'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] gap-4">
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

    if (!user || profile?.role !== 'admin') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] p-8 text-center">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                    <Shield className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Access Denied</h2>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-10 max-w-xs">
                    Your account does not have the required administrative clearance to access this sector.
                </p>
                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button
                        onClick={() => router.push('/')}
                        className="h-14 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                    >
                        Return to Store
                    </button>
                    <button
                        onClick={() => {
                            supabase.auth.signOut();
                            router.push('/login');
                        }}
                        className="h-14 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-all"
                    >
                        Login with Different Account
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
