'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UsersTable } from '@/components/admin/UsersTable';
import { Users, Search, RefreshCw, Shield, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Profile {
    id: string;
    full_name: string | null;
    email: string | null;
    role: 'user' | 'admin';
    loyalty_points: number;
    created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            user.full_name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 backdrop-blur-xl">
                            <Users className="w-8 h-8" />
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
                            <span className="text-gradient">Users</span>
                        </h1>
                    </div>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-[0.4em] ml-1">Universal Identity Intelligence</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        onClick={fetchUsers}
                        disabled={isLoading}
                        className="h-14 w-14 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all group"
                    >
                        <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
                    </Button>
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search identities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-14 w-full md:w-[350px] bg-white/5 border-white/10 rounded-2xl pl-14 focus:ring-primary focus:border-primary text-white font-bold placeholder:text-white/10 shadow-2xl transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center justify-between shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/20 rounded-2xl text-red-500">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-1">Retrieval Failed</p>
                            <p className="text-white/60 text-sm font-medium">{error}</p>
                        </div>
                    </div>
                    <Button onClick={fetchUsers} variant="outline" className="rounded-xl border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-6">
                        Retry Access
                    </Button>
                </div>
            )}

            {/* Main content */}
            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-20 glass-dark rounded-[2.5rem] border-white/5 gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
                            <RefreshCw className="w-12 h-12 text-primary animate-spin relative" />
                        </div>
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.5em] animate-pulse">Syncing Protocols</p>
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <UsersTable users={filteredUsers} />
                </motion.div>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
                <div className="glass-dark p-8 rounded-[2rem] border-white/5 space-y-4">
                    <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Entities</p>
                        <Users className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-4xl font-black text-white">{users.length}</p>
                </div>
                <div className="glass-dark p-8 rounded-[2rem] border-white/5 space-y-4">
                    <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Administrators</p>
                        <Shield className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-4xl font-black text-white">{users.filter(u => u.role === 'admin').length}</p>
                </div>
                <div className="glass-dark p-8 rounded-[2rem] border-white/5 space-y-4">
                    <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Loyalty</p>
                        <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-4xl font-black text-white">{users.reduce((acc, u) => acc + (u.loyalty_points || 0), 0).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
