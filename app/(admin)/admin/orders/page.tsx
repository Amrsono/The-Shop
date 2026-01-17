'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const INITIAL_ORDERS = [
    {
        id: 'ORD-001',
        customer: 'John Doe',
        total: 2500,
        status: 'Delivered',
        date: '2024-01-15',
        paymentMethod: 'Cash',
    },
    {
        id: 'ORD-002',
        customer: 'Jane Smith',
        total: 3200,
        status: 'Processing',
        date: '2024-01-16',
        paymentMethod: 'Cash',
    },
    {
        id: 'ORD-003',
        customer: 'Robert Brown',
        total: 1800,
        status: 'Order Received',
        date: '2024-01-17',
        paymentMethod: 'Cash',
    },
];

export default function OrdersPage() {
    const [orders, setOrders] = useState(INITIAL_ORDERS);

    const handleStatusChange = (orderId: string, newStatus: string) => {
        setOrders(prev =>
            prev.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
            case 'Processing': return 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]';
            case 'Order Received': return 'text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]';
            default: return 'text-white/40 bg-white/5 border-white/10';
        }
    };

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none mb-3">
                    <span className="text-gradient">Orders</span>
                </h1>
                <p className="text-xs text-white/40 font-bold uppercase tracking-[0.3em] ml-1">Live Transaction Hub</p>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden border-white/5 shadow-2xl">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-8">Order ID</TableHead>
                            <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Customer Entity</TableHead>
                            <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Timestamp</TableHead>
                            <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Method</TableHead>
                            <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Net Value</TableHead>
                            <TableHead className="text-right py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pr-8">Status Protocol</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                <TableCell className="py-6 pl-8 font-mono font-black text-xs text-primary">{order.id}</TableCell>
                                <TableCell className="py-6">
                                    <p className="font-black text-white text-sm uppercase tracking-tight">{order.customer}</p>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">Verified User</p>
                                </TableCell>
                                <TableCell className="py-6 text-white/60 font-bold text-xs uppercase tracking-widest">{order.date}</TableCell>
                                <TableCell className="py-6">
                                    <span className="px-3 py-1 glass rounded-full text-[10px] font-black uppercase tracking-widest text-white border-white/10">
                                        {order.paymentMethod}
                                    </span>
                                </TableCell>
                                <TableCell className="py-6 font-black text-white text-lg tracking-tighter italic">{order.total.toLocaleString()} LE</TableCell>
                                <TableCell className="text-right py-6 pr-8">
                                    <div className="flex justify-end">
                                        <Select
                                            value={order.status}
                                            onValueChange={(value) => handleStatusChange(order.id, value)}
                                        >
                                            <SelectTrigger className={cn(
                                                "w-[180px] h-10 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all",
                                                getStatusColor(order.status)
                                            )}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="glass-dark border-white/10 overflow-hidden rounded-2xl p-2">
                                                <SelectItem value="Order Received" className="text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 rounded-xl cursor-pointer py-3 mb-1">Order Received</SelectItem>
                                                <SelectItem value="Processing" className="text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 rounded-xl cursor-pointer py-3 mb-1">Processing</SelectItem>
                                                <SelectItem value="Delivered" className="text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 rounded-xl cursor-pointer py-3">Delivered</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
