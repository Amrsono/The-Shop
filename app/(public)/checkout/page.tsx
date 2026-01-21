'use client';

import { useState } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, CreditCard, ChevronRight, MapPin, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/context/AuthContext';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { t, language } = useLanguage();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        notes: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const { user } = useAuth();

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Insert the main order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user?.id || null, // Allow guest checkout!
                    total_amount: cartTotal,
                    status: 'Order Received',
                    payment_method: 'Cash On Delivery',
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    shipping_address: `${formData.address}, ${formData.city}`,
                    city: formData.city
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Insert order items
            const orderItemsEntries = cartItems.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItemsEntries);

            if (itemsError) throw itemsError;

            setIsSuccess(true);
            clearCart();
        } catch (error: any) {
            console.error('Error placing order:', error);
            alert(error.message || 'Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="container mx-auto px-4 py-32 text-center min-h-[80vh] flex flex-col items-center justify-center">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 10 }}
                    className="flex justify-center mb-10"
                >
                    <div className="p-8 glass rounded-full ring-8 ring-emerald-500/10">
                        <CheckCircle2 className="w-24 h-24 text-emerald-400" />
                    </div>
                </motion.div>
                <h1 className="text-6xl font-black mb-6 tracking-tighter italic">
                    <span className="text-gradient">Order Confirmed!</span>
                </h1>
                <p className="text-white/60 mb-12 max-w-lg mx-auto text-lg font-medium leading-relaxed">
                    Thank you for your purchase. Your order ID is <span className="text-white font-black">#ORD-{Math.floor(1000 + Math.random() * 9000)}</span>.
                    Our team will contact you within <span className="text-primary font-black">24 hours</span> to confirm delivery.
                </p>
                <Button asChild size="lg" className="rounded-full px-16 h-16 text-lg font-black uppercase tracking-widest bg-primary hover:scale-105 transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                    <Link href="/">{t('home')}</Link>
                </Button>
            </div>
        );
    }

    if (cartItems.length === 0 && !isSuccess) {
        return (
            <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="text-4xl font-black mb-8 tracking-tighter text-white/20 uppercase italic">Empty Cart</h1>
                <Button asChild size="lg" className="glass rounded-full px-12 border-white/10 text-white font-bold hover:bg-white/5 transition-all">
                    <Link href="/products">Go Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-20 pb-40 max-w-7xl">
            <h1 className="text-6xl font-black mb-12 tracking-tighter italic">
                <span className="text-gradient uppercase">{t('checkout')}</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left Side: Form */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Stepper */}
                    <div className="flex items-center gap-6 mb-12 glass p-4 rounded-3xl border-white/10 max-w-md">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-sm font-black transition-all ${step >= 1 ? 'bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-white/5 text-white/20'}`}>01</div>
                        <div className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-primary' : 'bg-white/5'}`}></div>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-sm font-black transition-all ${step >= 2 ? 'bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-white/5 text-white/20'}`}>02</div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                className="space-y-10"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Full Name</Label>
                                        <Input
                                            placeholder="Enter your name"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            name="fullName"
                                            className="rounded-2xl h-16 bg-white/5 border-white/10 text-white font-bold px-6 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Email Address</Label>
                                        <Input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            name="email"
                                            className="rounded-2xl h-16 bg-white/5 border-white/10 text-white font-bold px-6 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Phone Number</Label>
                                        <Input
                                            placeholder="+20 XXX XXX XXXX"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            name="phone"
                                            className="rounded-2xl h-16 bg-white/5 border-white/10 text-white font-bold px-6 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">City</Label>
                                        <Input
                                            placeholder="Cairo / Alexandria..."
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            name="city"
                                            className="rounded-2xl h-16 bg-white/5 border-white/10 text-white font-bold px-6 focus:ring-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Delivery Address</Label>
                                    <Input
                                        placeholder="Street, Building, Floor..."
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        name="address"
                                        className="rounded-2xl h-16 bg-white/5 border-white/10 text-white font-bold px-6 focus:ring-primary transition-all"
                                    />
                                </div>
                                <Button size="lg" className="rounded-2xl px-16 h-16 text-lg font-black uppercase tracking-widest bg-primary hover:scale-[1.02] shadow-xl shadow-primary/20 transition-all" onClick={() => setStep(2)}>
                                    Proceed <ChevronRight className="ml-2 w-6 h-6" />
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                className="space-y-12"
                            >
                                <div className="p-8 glass rounded-[2rem] border-white/10 flex items-start gap-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10 group-hover:bg-primary/20 transition-all" />
                                    <div className="p-4 glass rounded-2xl text-primary border-white/20">
                                        <MapPin className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black uppercase italic text-white tracking-tight mb-3">Delivery Info</h3>
                                        <div className="space-y-1">
                                            <p className="text-lg font-bold text-white">{formData.fullName}</p>
                                            <p className="text-white/60 font-medium">{formData.address}, {formData.city}</p>
                                            <p className="text-white/60 font-medium">{formData.phone}</p>
                                        </div>
                                        <Button variant="link" className="p-0 h-auto text-primary font-black uppercase tracking-[0.2em] text-[10px] mt-4 hover:no-underline" onClick={() => setStep(1)}>Modify Details</Button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black uppercase italic text-white tracking-tight">Payment Method</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-8 rounded-[2rem] border-2 border-primary bg-primary/10 relative overflow-hidden group cursor-pointer transition-all shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                                            <div className="p-4 glass rounded-2xl text-primary border-white/20 mb-6 w-fit">
                                                <Truck className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-white uppercase tracking-tight">Cash On Delivery</p>
                                                <p className="text-sm text-white/50 font-bold mt-2 uppercase tracking-widest leading-tight">Pay securely upon<br />receiving your parcel</p>
                                            </div>
                                            <div className="absolute top-6 right-6">
                                                <div className="glass rounded-full p-1.5 border-primary/50 text-primary">
                                                    <CheckCircle2 className="w-6 h-6" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 rounded-[2rem] glass border-white/5 opacity-30 grayscale cursor-not-allowed">
                                            <div className="p-4 glass rounded-2xl text-white/40 border-white/5 mb-6 w-fit">
                                                <CreditCard className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-white uppercase tracking-tight">Credit Card</p>
                                                <p className="text-sm text-white/50 font-bold mt-2 uppercase tracking-widest italic">Digital gateway<br />coming soon</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handlePlaceOrder}>
                                    <Button size="lg" className="rounded-2xl px-20 h-20 text-xl font-black uppercase tracking-[0.2em] bg-primary hover:scale-[1.02] shadow-[0_20px_50px_rgba(139,92,246,0.3)] transition-all w-full md:w-auto" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-4"
                                                />
                                                Processing...
                                            </>
                                        ) : "Confirm Order"}
                                    </Button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Side: Order Summary */}
                <div className="lg:col-span-4">
                    <Card className="sticky top-32 fancy-card border-none overflow-hidden p-0 shadow-2xl">
                        <CardHeader className="bg-white/5 border-b border-white/5 py-8 px-10">
                            <CardTitle className="text-2xl font-black uppercase italic text-white tracking-tight">Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-10">
                            <div className="max-h-[400px] overflow-y-auto space-y-8 pr-4 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden glass border-white/10 flex-shrink-0 group-hover:scale-105 transition-all">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="font-black text-xs leading-snug uppercase tracking-tight text-white/80 line-clamp-2">{item.name}</h4>
                                            <div className="flex items-center justify-between mt-3">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary">QTY: {item.quantity}</p>
                                                <p className="font-black text-white text-sm">{(item.price * item.quantity).toLocaleString()} LE</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/5 pt-8 space-y-6">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                    <span>Subtotal</span>
                                    <span>{cartTotal.toLocaleString()} LE</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                                    <span>Shipping</span>
                                    <span>Complimentary</span>
                                </div>
                                <div className="flex justify-between items-baseline pt-4">
                                    <span className="text-xl font-black uppercase italic text-white/60 tracking-tighter leading-none">Total</span>
                                    <div className="text-right">
                                        <span className="text-4xl font-black text-primary tracking-tighter leading-none">{cartTotal.toLocaleString()}</span>
                                        <span className="text-xs font-black text-primary/60 ml-2 tracking-widest uppercase">EGP</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
