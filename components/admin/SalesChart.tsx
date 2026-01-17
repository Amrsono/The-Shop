'use client';

import { useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const dailyData = [
    { name: 'Mon', total: 2400 },
    { name: 'Tue', total: 1398 },
    { name: 'Wed', total: 9800 },
    { name: 'Thu', total: 3908 },
    { name: 'Fri', total: 4800 },
    { name: 'Sat', total: 3800 },
    { name: 'Sun', total: 4300 },
];

const weeklyData = [
    { name: 'Week 1', total: 15400 },
    { name: 'Week 2', total: 12100 },
    { name: 'Week 3', total: 18900 },
    { name: 'Week 4', total: 22400 },
];

const monthlyData = [
    { name: 'Jan', total: 45000 },
    { name: 'Feb', total: 52000 },
    { name: 'Mar', total: 48000 },
    { name: 'Apr', total: 61000 },
];

export function SalesChart() {
    const [period, setPeriod] = useState('daily');

    const data = period === 'daily' ? dailyData : period === 'weekly' ? weeklyData : monthlyData;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>
                        {period === 'daily' ? 'Daily' : period === 'weekly' ? 'Weekly' : 'Monthly'} sales statistics
                    </CardDescription>
                </div>
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `EGP ${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar
                                dataKey="total"
                                fill="currentColor"
                                radius={[4, 4, 0, 0]}
                                className="fill-primary"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
