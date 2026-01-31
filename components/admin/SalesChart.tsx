'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { format, startOfDay, subDays, subWeeks, subMonths, isSameDay, isSameWeek, isSameMonth, parseISO } from 'date-fns';
import { Loader2, RefreshCw } from 'lucide-react';

export function SalesChart() {
    const [period, setPeriod] = useState('daily');
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrderData = async () => {
        setIsLoading(true);
        try {
            const { data: orders, error } = await supabase
                .from('orders')
                .select('total_amount, created_at')
                .order('created_at', { ascending: true });

            if (error) throw error;

            const now = new Date();
            let chartData: any[] = [];

            if (period === 'daily') {
                // Last 7 days
                for (let i = 6; i >= 0; i--) {
                    const date = subDays(now, i);
                    const dayOrders = orders?.filter(o => isSameDay(parseISO(o.created_at), date)) || [];
                    const total = dayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
                    chartData.push({
                        name: format(date, 'EEE'),
                        total,
                        fullDate: format(date, 'MMM dd'),
                    });
                }
            } else if (period === 'weekly') {
                // Last 4 weeks
                for (let i = 3; i >= 0; i--) {
                    const date = subWeeks(now, i);
                    const weekOrders = orders?.filter(o => isSameWeek(parseISO(o.created_at), date)) || [];
                    const total = weekOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
                    chartData.push({
                        name: `Week ${4 - i}`,
                        total,
                        fullDate: `Week of ${format(date, 'MMM dd')}`,
                    });
                }
            } else if (period === 'monthly') {
                // Last 6 months
                for (let i = 5; i >= 0; i--) {
                    const date = subMonths(now, i);
                    const monthOrders = orders?.filter(o => isSameMonth(parseISO(o.created_at), date)) || [];
                    const total = monthOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
                    chartData.push({
                        name: format(date, 'MMM'),
                        total,
                        fullDate: format(date, 'MMMM yyyy'),
                    });
                }
            }

            setData(chartData);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderData();
    }, [period]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
                <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tight text-white mb-1">Sales Overview</h3>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">
                        {period === 'daily' ? 'Last 7 Days' : period === 'weekly' ? 'Last 4 Weeks' : 'Last 6 Months'} Analytics
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchOrderData}
                        className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white/40 hover:text-white"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[140px] bg-white/5 border-white/10 rounded-xl font-black uppercase tracking-widest text-[10px] h-10">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent className="glass-dark border-white/10 rounded-xl">
                            <SelectItem value="daily" className="font-bold text-[10px] uppercase tracking-widest">Daily</SelectItem>
                            <SelectItem value="weekly" className="font-bold text-[10px] uppercase tracking-widest">Weekly</SelectItem>
                            <SelectItem value="monthly" className="font-bold text-[10px] uppercase tracking-widest">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="h-[350px] w-full mt-4">
                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin opacity-20" />
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Compiling Assets</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontWeight: '900', letterSpacing: '0.1em', fill: 'rgba(255,255,255,0.4)' }}
                                dy={10}
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontWeight: '900', letterSpacing: '0.1em', fill: 'rgba(255,255,255,0.4)' }}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 10 }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="glass-dark p-4 rounded-2xl border-white/10 shadow-2xl backdrop-blur-3xl">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{payload[0].payload.fullDate}</p>
                                                <p className="text-xl font-black text-primary italic tracking-tighter">
                                                    {payload[0].value?.toLocaleString()} LE
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar
                                dataKey="total"
                                fill="url(#barGradient)"
                                radius={[8, 8, 0, 0]}
                                barSize={40}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fillOpacity={1}
                                        className="hover:opacity-80 transition-opacity"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
