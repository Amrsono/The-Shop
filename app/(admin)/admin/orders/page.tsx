'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Search, Filter, RefreshCw, X, ArrowUpDown, Package } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    products: {
        name: string;
        image_url?: string;
    } | null;
}

interface Order {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
    payment_method: string;
    user_id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    shipping_address: string | null;
    city: string | null;
    order_items?: OrderItem[];
    profiles: {
        full_name: string | null;
        email: string | null;
    } | null;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'value_high' | 'value_low'>('newest');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    profiles (
                        full_name,
                        email
                    ),
                    order_items (
                        *,
                        products (
                            name,
                            image_url
                        )
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
            case 'Processing': return 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]';
            case 'Order Received': return 'text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]';
            case 'Cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
            default: return 'text-white/40 bg-white/5 border-white/10';
        }
    };

    const filteredAndSortedOrders = useMemo(() => {
        let result = orders.filter(order => {
            const matchesSearch =
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (order.full_name || order.profiles?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (order.email || order.profiles?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (order.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (order.city || '').toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        switch (sortOrder) {
            case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
            case 'oldest': result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break;
            case 'value_high': result.sort((a, b) => b.total_amount - a.total_amount); break;
            case 'value_low': result.sort((a, b) => a.total_amount - b.total_amount); break;
        }

        return result;
    }, [orders, searchQuery, statusFilter, sortOrder]);

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none mb-3">
                        <span className="text-gradient">Orders</span>
                    </h1>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-[0.3em] ml-1">Live Transaction Hub</p>
                </div>
                <Button
                    onClick={fetchOrders}
                    variant="outline"
                    className="h-14 w-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all group"
                >
                    <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
                </Button>
            </div>

            {/* Filtering Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-all" />
                    <Input
                        placeholder="Search ID, Customer, Email, or City..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-16 bg-white/5 border-white/10 rounded-2xl pl-14 text-white font-bold placeholder:text-white/10 focus:ring-primary transition-all"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="lg:col-span-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-16 w-full bg-white/5 border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 focus:ring-primary focus:border-primary cursor-pointer hover:bg-white/10 transition-all shadow-none outline-none">
                            <div className="flex items-center gap-3">
                                <Filter className="w-4 h-4 text-primary" />
                                <SelectValue placeholder="Status Protocol" />
                            </div>
                        </SelectTrigger>
                        <SelectContent position="popper" className="glass-dark border-white/10 rounded-2xl p-2 z-[100] min-w-[200px] shadow-2xl">
                            <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest py-3 hover:bg-white/5 rounded-xl cursor-pointer">All Protocols</SelectItem>
                            <SelectItem value="Order Received" className="text-[10px] font-black uppercase tracking-widest py-3 hover:bg-white/5 rounded-xl cursor-pointer">Order Received</SelectItem>
                            <SelectItem value="Processing" className="text-[10px] font-black uppercase tracking-widest py-3 hover:bg-white/5 rounded-xl cursor-pointer">Processing</SelectItem>
                            <SelectItem value="Delivered" className="text-[10px] font-black uppercase tracking-widest py-3 hover:bg-white/5 rounded-xl cursor-pointer">Delivered</SelectItem>
                            <SelectItem value="Cancelled" className="text-[10px] font-black uppercase tracking-widest py-3 hover:bg-white/5 rounded-xl cursor-pointer">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="lg:col-span-4">
                    <Select value={sortOrder} onValueChange={(v: any) => setSortOrder(v)}>
                        <SelectTrigger className="h-16 w-full bg-white/5 border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 focus:ring-primary focus:border-primary cursor-pointer hover:bg-white/10 transition-all shadow-none outline-none">
                            <div className="flex items-center gap-3">
                                <ArrowUpDown className="w-4 h-4 text-primary" />
                                <SelectValue placeholder="Sort Sequence" />
                            </div>
                        </SelectTrigger>
                        <SelectContent position="popper" className="glass-dark border-white/10 rounded-2xl p-2 z-[100] min-w-[200px] shadow-2xl">
                            <SelectItem value="newest" className="text-[10px] font-black uppercase tracking-widest py-3 hover:bg-white/5 rounded-xl cursor-pointer">Newest First</SelectItem>
                            <SelectItem value="oldest" className="text-[10px] font-black uppercase tracking-widest py-3 hover:bg-white/5 rounded-xl cursor-pointer">Oldest First</SelectItem>
                            <SelectItem value="value_high" className="text-[10px] font-black uppercase tracking-widest py-3 hover:bg-white/5 rounded-xl cursor-pointer">Highest Value</SelectItem>
                            <SelectItem value="value_low" className="text-[10px] font-black uppercase tracking-widest py-3 hover:bg-white/5 rounded-xl cursor-pointer">Lowest Value</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden border-white/5 shadow-2xl relative">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm gap-4">
                        <RefreshCw className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest animate-pulse">Retrieving Protocols</p>
                    </div>
                )}

                <Table>
                    <TableHeader className="bg-white/10">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="py-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-8">Order ID</TableHead>
                            <TableHead className="py-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Customer Entity</TableHead>
                            <TableHead className="py-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Timestamp</TableHead>
                            <TableHead className="py-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Method</TableHead>
                            <TableHead className="py-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Net Value</TableHead>
                            <TableHead className="text-right py-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pr-8">Status Protocol</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {filteredAndSortedOrders.map((order) => (
                                <TableRow key={order.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                    <TableCell className="py-8 pl-8">
                                        <div className="flex flex-col">
                                            <span className="font-mono font-black text-[10px] text-primary mb-1 uppercase tracking-tighter">
                                                ID: {typeof order.id === 'string' ? order.id.substring(0, 8) : order.id}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0 text-white/40 hover:text-white flex items-center gap-1 justify-start border-none bg-transparent"
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setIsDetailsOpen(true);
                                                }}
                                            >
                                                <Eye className="w-3 h-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Details</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-8">
                                        <div className="flex flex-col gap-0.5">
                                            <p className="font-black text-white text-sm uppercase tracking-tight">{order.full_name || order.profiles?.full_name || 'Anonymous'}</p>
                                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none">{(order.email || order.profiles?.email) || 'No email'}</p>
                                            <p className="text-[9px] text-primary/60 font-black uppercase tracking-widest mt-1">{order.phone || 'No Phone'}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-8 text-white/60 font-bold text-xs uppercase tracking-widest">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="py-8">
                                        <span className="px-3 py-1 glass rounded-full text-[10px] font-black uppercase tracking-widest text-white border-white/10">
                                            {order.payment_method}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-8 font-black text-white text-lg tracking-tighter italic">{order.total_amount?.toLocaleString()} LE</TableCell>
                                    <TableCell className="text-right py-8 pr-8">
                                        <div className="flex justify-end">
                                            <Select
                                                value={order.status}
                                                onValueChange={(value) => handleStatusChange(order.id, value)}
                                            >
                                                <SelectTrigger className={cn(
                                                    "w-[180px] h-12 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all focus:outline-none",
                                                    getStatusColor(order.status)
                                                )}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="glass-dark border-white/10 overflow-hidden rounded-2xl p-2">
                                                    <SelectItem value="Order Received" className="text-[10px] font-black uppercase tracking-widest py-3 mb-1 hover:bg-white/5 rounded-xl cursor-pointer">Order Received</SelectItem>
                                                    <SelectItem value="Processing" className="text-[10px] font-black uppercase tracking-widest py-3 mb-1 hover:bg-white/5 rounded-xl cursor-pointer">Processing</SelectItem>
                                                    <SelectItem value="Delivered" className="text-[10px] font-black uppercase tracking-widest py-3 mb-1 hover:bg-white/5 rounded-xl cursor-pointer">Delivered</SelectItem>
                                                    <SelectItem value="Cancelled" className="text-[10px] font-black uppercase tracking-widest py-3 hover:bg-white/5 rounded-xl cursor-pointer">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>

                {filteredAndSortedOrders.length === 0 && !isLoading && (
                    <div className="p-20 text-center">
                        <p className="text-xl font-black text-white/20 uppercase italic tracking-widest">No order protocols matching search</p>
                    </div>
                )}
            </div>

            {/* Order Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[700px] bg-[#0A0A0B] border-white/5 p-0 overflow-hidden rounded-[2.5rem]">
                    <div className="relative p-8 md:p-12">
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />

                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Badge className={cn("rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border-none shadow-lg outline-none", getStatusColor(selectedOrder?.status || ''))}>
                                        {selectedOrder?.status || 'Protocol Unknown'}
                                    </Badge>
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">#{selectedOrder?.id.substring(0, 8)}</span>
                                </div>
                                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Order Details</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Transaction Total</p>
                                <p className="text-3xl font-black text-primary italic tracking-tighter">{selectedOrder?.total_amount.toLocaleString()} LE</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3">Customer Intelligence</p>
                                    <div className="glass p-5 rounded-2xl border-white/5 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-white/30 uppercase">Full Name</span>
                                            <span className="text-xs font-black text-white uppercase">{selectedOrder?.full_name || selectedOrder?.profiles?.full_name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-white/30 uppercase">Email</span>
                                            <span className="text-xs font-black text-white">{(selectedOrder?.email || selectedOrder?.profiles?.email) || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-white/30 uppercase">Phone</span>
                                            <span className="text-xs font-black text-primary">{selectedOrder?.phone || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3">Logistics & Deployment</p>
                                    <div className="glass p-5 rounded-2xl border-white/5 space-y-3">
                                        <div className="flex justify-start gap-4 flex-col">
                                            <span className="text-[10px] font-bold text-white/30 uppercase">Address</span>
                                            <span className="text-xs font-black text-white uppercase tracking-tight leading-relaxed">{selectedOrder?.shipping_address || 'Collection Only'}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                            <span className="text-[10px] font-bold text-white/30 uppercase">City Hub</span>
                                            <span className="text-xs font-black text-white uppercase">{selectedOrder?.city || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-white/30 uppercase">Method</span>
                                            <Badge variant="outline" className="text-[9px] font-black border-white/10 uppercase tracking-widest bg-transparent outline-none">{selectedOrder?.payment_method}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3">Inventory Manifest</p>
                                <ScrollArea className="h-[300px] glass rounded-2xl border-white/5 overflow-hidden">
                                    <div className="p-5 space-y-6">
                                        {selectedOrder?.order_items?.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 items-center">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                    {item.products?.image_url ? (
                                                        <img src={item.products.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-white/20" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-black text-white uppercase truncate">{item.products?.name || 'Unknown Asset'}</p>
                                                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-white italic tracking-tighter">{(item.price * item.quantity).toLocaleString()} LE</p>
                                                </div>
                                            </div>
                                        ))}
                                        {(!selectedOrder?.order_items || selectedOrder.order_items.length === 0) && (
                                            <p className="text-[10px] font-black text-white/20 uppercase text-center py-10 tracking-widest">No Manifest Data</p>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                onClick={() => setIsDetailsOpen(false)}
                                className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 font-black uppercase tracking-[0.2em] text-[10px] text-white/60 hover:text-white transition-all shadow-none"
                            >
                                Close Protocol View
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
