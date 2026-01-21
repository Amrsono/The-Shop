'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('Admin@thestore.com');
    const [password, setPassword] = useState('Admin@2026');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Simple role-based redirection logic
            if (email.toLowerCase().includes('admin')) {
                router.push('/admin');
            } else {
                router.push('/profile');
            }
        } catch (err: any) {
            setError(err.message || 'Invalid credentials. Please verify your identity protocol.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-950/80 rounded-[2.4rem] p-10 backdrop-blur-3xl border border-white/5">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-3">
                    <span className="text-gradient">Login</span> Access
                </h1>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.4em]">To your account</p>
            </div>

            {message && (
                <div className="mb-6 p-4 glass rounded-2xl border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest text-center">
                    {message}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Username</Label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                            <Input
                                type="email"
                                placeholder="identity@thestore.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 rounded-2xl h-14 pl-12 text-white placeholder:text-white/10 focus:ring-primary focus:border-primary transition-all font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Password</Label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 rounded-2xl h-14 pl-12 text-white placeholder:text-white/10 focus:ring-primary focus:border-primary transition-all font-bold"
                            />
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[10px] text-red-400 font-bold uppercase tracking-widest text-center glass-dark py-2 rounded-xl border-red-400/20"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)] border-none mt-8"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <span className="flex items-center gap-2">Login <ArrowRight className="w-4 h-4" /></span>
                    )}
                </Button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    Not registered yet? <Link href="/register" className="text-primary hover:underline">click here to register</Link>
                </p>
            </div>

        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#020617]">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-[450px]"
            >
                <div className="glass p-1 rounded-[2.5rem] border-white/10 shadow-2xl relative">
                    <Suspense fallback={<div className="h-[400px] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                        <LoginForm />
                    </Suspense>
                </div>
            </motion.div>
        </div>
    );
}
