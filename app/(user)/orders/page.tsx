'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ChevronRight, MapPin, Clock, CheckCircle2, Truck, Box, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '@/lib/context/CartContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function MyOrdersPage() {
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [reorderingId, setReorderingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*, items:order_items(*)')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleReorder = async (order: any) => {
        setReorderingId(order.id);

        // Add all items in the order to the cart
        order.items.forEach((item: any) => {
            addToCart({
                id: item.product_id, // Map database product_id which is the actual ID
                name: item.name || 'Unknown Product', // Fallback if snapshot missing
                price: item.price,
                image: item.image || '/placeholder.jpg',
                quantity: 1, // Default to 1 on reorder, or use item.quantity
                category: 'Re-ordered',
            });
        });

        // Simulate a small delay for premium feel
        await new Promise(resolve => setTimeout(resolve, 800));
        setReorderingId(null);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Delivered': return <CheckCircle2 className="w-4 h-4" />;
            case 'Processing': return <Truck className="w-4 h-4" />;
            case 'Order Received': return <Clock className="w-4 h-4" />;
            default: return <Box className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
            case 'Processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
            case 'Order Received': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400';
        }
    };

    return (
        <div className="container mx-auto px-4 py-24 pb-24 max-w-5xl relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-40 left-0 w-[200px] h-[200px] bg-blue-500/10 blur-[100px] rounded-full -z-10" />

            <div className="flex items-center gap-4 mb-12">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary border border-primary/20 backdrop-blur-xl">
                    <Package className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                        <span className="text-gradient">My</span> Orders
                    </h1>
                </div>
            </div>

            <div className="space-y-10">
                {loading ? (
                    <div className="text-center text-white/50 py-20">Loading your orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center text-white/50 py-20">No orders found.</div>
                ) : (
                    orders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden border-none shadow-2xl glass-dark hover:border-white/10 transition-all duration-500 group rounded-[2.5rem]">
                                <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between py-6 px-8">
                                    <div className="flex flex-wrap items-center gap-8">
                                        <div>
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-black mb-1">Order Identifier</p>
                                            <p className="font-mono font-bold text-sm text-primary tracking-wider">{order.id.slice(0, 8)}...</p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-black mb-1">Timestamp</p>
                                            <p className="font-bold text-sm text-white/80">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-black mb-1">Total Valuation</p>
                                            <p className="font-black text-sm text-white">EGP {Number(order.total_amount).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <Badge className={`${getStatusColor(order.status)} border-none rounded-full px-4 py-1`}>
                                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </Badge>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-10">
                                        {/* Items List */}
                                        <div className="md:col-span-12 lg:col-span-8 space-y-6">
                                            {order.items && order.items.map((item: any, i: number) => (
                                                <div key={i} className="flex gap-6 group/item">
                                                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/5 bg-white/5 flex-shrink-0">
                                                        <Image
                                                            src={item.image || '/placeholder.jpg'}
                                                            alt={item.name || 'Product'}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <h4 className="font-bold text-base text-white group-hover/item:text-primary transition-colors">{item.name || 'Unknown Item'}</h4>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">Quantity: {item.quantity}</p>
                                                        <p className="text-sm font-black mt-2 text-primary">EGP {Number(item.price).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Shipping Address */}
                                        <div className="md:col-span-12 lg:col-span-4 bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 self-start">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-primary/20 rounded-xl text-primary mt-1">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <h5 className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Destination Protocol</h5>
                                                    <p className="text-sm font-bold text-white/90 leading-relaxed">{order.shipping_address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <div className="bg-white/5 px-8 py-5 border-t border-white/5 flex justify-end gap-4 items-center">
                                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors h-10 rounded-xl">
                                        Support Portal
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="text-[10px] font-black uppercase tracking-[0.2em] h-12 rounded-xl px-8 min-w-[160px] bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:scale-[1.02] transition-all"
                                        onClick={() => handleReorder(order)}
                                        disabled={reorderingId === order.id}
                                    >
                                        {reorderingId === order.id ? (
                                            <motion.div
                                                initial={{ rotate: 0 }}
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </motion.div>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Re-Order <ChevronRight className="w-4 h-4" />
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
