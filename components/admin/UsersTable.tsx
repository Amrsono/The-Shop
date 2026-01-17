'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Profile {
    id: string;
    full_name: string | null;
    email: string | null;
    role: 'user' | 'admin';
    loyalty_points: number;
    created_at: string;
    // Analytics fields
    orders_count?: number;
    total_spent?: number;
    most_purchased_product?: string;
}

interface UsersTableProps {
    users: Profile[];
}

export function UsersTable({ users }: UsersTableProps) {
    return (
        <div className="glass-dark rounded-[2.5rem] overflow-hidden border-white/5 shadow-2xl">
            <Table>
                <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5 hover:bg-transparent text-center">
                        <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-8 text-left">Protocol Identity</TableHead>
                        <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Authority</TableHead>
                        <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Orders</TableHead>
                        <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Total Valuation</TableHead>
                        <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Primary Asset</TableHead>
                        <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Loyalty</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={6} className="h-60 text-center">
                                <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                                    <User className="w-12 h-12" />
                                    <p className="font-black uppercase tracking-[0.4em] text-xs">No user protocols detected.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => {
                            const firstName = user.full_name?.split(' ')[0] || 'Unknown';
                            const username = user.email?.split('@')[0] || 'anon';

                            return (
                                <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-all duration-300 group">
                                    <TableCell className="py-8 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-14 w-14 rounded-2xl overflow-hidden glass border-white/10 flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform duration-500">
                                                <User className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-black text-white text-base tracking-tight">{firstName}</p>
                                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">@{username}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-8 text-center">
                                        <Badge className={cn(
                                            "border-none rounded-full px-3 py-1 flex items-center gap-2 mx-auto w-fit",
                                            user.role === 'admin'
                                                ? "bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                                                : "bg-white/5 text-white/60"
                                        )}>
                                            {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                            <span className="text-[8px] font-black uppercase tracking-widest">{user.role}</span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-8 text-center">
                                        <div className="flex flex-col items-center">
                                            <p className="font-black text-white text-base">{user.orders_count || 0}</p>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Units</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-8 text-center text-primary font-black">
                                        EGP {(user.total_spent || 0).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="py-8 text-center">
                                        <p className="text-[10px] font-bold text-white/80 max-w-[120px] mx-auto truncate" title={user.most_purchased_product}>
                                            {user.most_purchased_product || 'N/A'}
                                        </p>
                                    </TableCell>
                                    <TableCell className="py-8 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                            </div>
                                            <p className="font-black text-white text-sm">{user.loyalty_points.toLocaleString()}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
