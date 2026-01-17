'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ChevronRight, MapPin, Clock, CheckCircle2, Truck, Box, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '@/lib/context/CartContext';
import { useState } from 'react';

const MOCK_ORDERS = [
    // ... existing mock data
    {
        id: 'ORD-7721',
        date: '2024-01-15',
        total: 2500,
        status: 'Delivered',
        items: [
            { id: '1', name: 'Classic White Sneakers', price: 2500, quantity: 1, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop' }
        ],
        address: '123 Nile St, Zamalek, Cairo',
    },
    {
        id: 'ORD-8104',
        date: '2024-01-17',
        total: 5000,
        status: 'Processing',
        items: [
            { id: '2', name: 'Leather Crossbody Bag', price: 3200, quantity: 1, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop' },
            { id: '3', name: 'Denim Jacket Vintage', price: 1800, quantity: 1, image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974&auto=format&fit=crop' }
        ],
        address: '45 Lotus St, New Cairo, Cairo',
    }
];

export default function MyOrdersPage() {
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const [reorderingId, setReorderingId] = useState<string | null>(null);

    const handleReorder = async (order: any) => {
        setReorderingId(order.id);

        // Add all items in the order to the cart
        order.items.forEach((item: any) => {
            addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                category: 'Re-ordered', // Placeholder category
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
        <div className="container mx-auto px-4 py-12 pb-24 max-w-5xl">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Package className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">{t('my_orders')}</h1>
                    <p className="text-muted-foreground">Track and manage your recent purchases</p>
                </div>
            </div>

            <div className="space-y-8">
                {MOCK_ORDERS.map((order, index) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="overflow-hidden border-none shadow-xl bg-white dark:bg-slate-950 hover:shadow-2xl transition-shadow duration-300">
                            <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b flex flex-row items-center justify-between py-4 px-6">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Order ID</p>
                                        <p className="font-mono font-bold text-sm">{order.id}</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Date Placed</p>
                                        <p className="font-bold text-sm text-foreground">{new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Total Amount</p>
                                        <p className="font-bold text-sm text-primary">EGP {order.total.toLocaleString()}</p>
                                    </div>
                                </div>
                                <Badge className={getStatusColor(order.status)}>
                                    <span className="flex items-center gap-1.5 px-1 py-0.5">
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
                                    {/* Items List */}
                                    <div className="md:col-span-8 space-y-4">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex gap-4 group">
                                                <div className="relative w-20 h-20 rounded-xl overflow-hidden border bg-muted flex-shrink-0">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{item.name}</h4>
                                                    <p className="text-xs text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                                                    <p className="text-sm font-bold mt-1 text-primary">EGP {item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="md:col-span-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-primary mt-0.5" />
                                            <div>
                                                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Shipping To</h5>
                                                <p className="text-sm font-medium leading-relaxed">{order.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <div className="bg-slate-50/50 dark:bg-slate-900/20 px-6 py-3 border-t flex justify-end gap-3">
                                <Button variant="ghost" size="sm" className="text-xs font-bold h-8 rounded-full">
                                    Need Help?
                                </Button>
                                <Button
                                    size="sm"
                                    className="text-xs font-bold h-8 rounded-full px-5 min-w-[120px]"
                                    onClick={() => handleReorder(order)}
                                    disabled={reorderingId === order.id}
                                >
                                    {reorderingId === order.id ? (
                                        <motion.div
                                            initial={{ rotate: 0 }}
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                        </motion.div>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            Reorder Items <ChevronRight className="ml-1 w-3 h-3" />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
