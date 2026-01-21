'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SalesChart } from '@/components/admin/SalesChart';
import { BadgeDollarSign, CreditCard, Package, Users, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardStats {
    totalRevenue: number;
    dailyOrders: number;
    activeSKUs: number;
    eliteCustomer: {
        name: string;
        email: string;
        amount: string;
    };
    elitePerformers: Array<{
        name: string;
        email: string;
        amount: string;
    }>;
    revenueGrowth: string;
    salesGrowth: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Total Revenue and Daily Sales
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('total_amount, created_at, user_id');

            if (ordersError) throw ordersError;

            // 2. Fetch Active Assets (Products count)
            const { count: productCount, error: productsError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            if (productsError) throw productsError;

            // 3. Fetch Users/Profiles for Elite Customer
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, full_name, email');

            if (profilesError) throw profilesError;

            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
            const dailyOrders = orders.filter(order => new Date(order.created_at) >= startOfToday).length;

            // Calculate Elite Customer and Performers
            const userSpending: Record<string, { amount: number, email: string, name: string }> = {};

            // Map profiles first for easier lookup
            const profileMap: Record<string, { name: string, email: string }> = {};
            profiles.forEach(p => {
                profileMap[p.id] = {
                    name: p.full_name || 'Anonymous User',
                    email: p.email || 'N/A'
                };
            });

            orders.forEach(order => {
                if (!order.user_id) return;
                const userData = profileMap[order.user_id] || { name: 'Legacy User', email: 'N/A' };
                if (!userSpending[order.user_id]) {
                    userSpending[order.user_id] = { amount: 0, email: userData.email, name: userData.name };
                }
                userSpending[order.user_id].amount += order.total_amount || 0;
            });

            const sortedPerformers = Object.values(userSpending)
                .sort((a, b) => b.amount - a.amount)
                .map(p => ({
                    name: p.name,
                    email: p.email,
                    amount: p.amount.toLocaleString()
                }));

            const eliteCustomer = sortedPerformers[0] || { name: 'No Data', email: 'N/A', amount: '0' };

            setStats({
                totalRevenue,
                dailyOrders,
                activeSKUs: productCount || 0,
                eliteCustomer,
                elitePerformers: sortedPerformers.slice(0, 3),
                revenueGrowth: "+0.0%", // Placeholder as historical data would need more complex queries
                salesGrowth: "0 Today"
            });

        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
                    <RefreshCw className="w-16 h-16 text-primary animate-spin relative" />
                </div>
                <p className="text-xs text-white/40 font-black uppercase tracking-[0.5em] animate-pulse italic">
                    Initializing Command Center
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="relative">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none mb-3">
                            <span className="text-gradient">Dashboard</span>
                        </h1>
                        <p className="text-xs text-white/40 font-bold uppercase tracking-[0.3em] ml-1">Live Intelligence Overview</p>
                    </div>
                    <button
                        onClick={fetchStats}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BadgeDollarSign className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Total Revenue</p>
                    <div className="text-3xl font-black text-white italic tracking-tighter mb-2">{stats?.totalRevenue.toLocaleString()} LE</div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">+0%</span>
                        <span className="text-[10px] font-bold text-white/20 uppercase">Lifetime Volume</span>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Daily Sales</p>
                    <div className="text-3xl font-black text-white italic tracking-tighter mb-2">+{stats?.dailyOrders} Orders</div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary uppercase">Today's Transactions</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">LIVE</span>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Package className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Active Assets</p>
                    <div className="text-3xl font-black text-white italic tracking-tighter mb-2">{stats?.activeSKUs} SKU</div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">Inventory Total</span>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-auto">Verified</span>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Elite Customer</p>
                    <div className="text-3xl font-black text-white italic tracking-tighter mb-2 truncate max-w-[180px]">{stats?.eliteCustomer.name}</div>
                    <div className="text-[10px] font-black bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full w-fit mt-1 uppercase tracking-widest">{stats?.eliteCustomer.amount} LE Volume</div>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <div className="lg:col-span-4 glass p-8 rounded-[2.5rem] border-white/5 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400 opacity-50" />
                    <SalesChart />
                </div>

                <div className="lg:col-span-3 glass rounded-[2.5rem] border-white/5 shadow-2xl overflow-hidden">
                    <div className="p-8 border-b border-white/5 bg-white/5">
                        <h3 className="text-xl font-black uppercase italic tracking-tight text-white">Elite Performers</h3>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mt-1">High Transaction Volume</p>
                    </div>
                    <div className="p-8 space-y-8">
                        {stats?.elitePerformers.map((customer, i) => (
                            <div key={i} className="flex items-center group">
                                <div className="w-12 h-12 rounded-2xl glass border-white/10 flex items-center justify-center font-black text-primary transition-all group-hover:bg-primary group-hover:text-white">
                                    {customer.name[0]}
                                </div>
                                <div className="ml-6 flex-1">
                                    <p className="font-black text-white text-sm uppercase tracking-tight">{customer.name}</p>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">{customer.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-primary tracking-tighter italic">{customer.amount} LE</p>
                                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Verified</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
