'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Package, User, MapPin, CreditCard, Save, CheckCircle2, Loader2, Camera, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { PointsHistory } from '@/components/user/PointsHistory';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function UserProfile() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);

    const [profileData, setProfileData] = useState({
        fullName: 'The User',
        email: 'user@thestore.com',
        phone: '+20 123 456 7890',
        address: '123 Nile St, Zamalek, Cairo',
        city: 'Cairo',
    });

    const [paymentMethods, setPaymentMethods] = useState([
        { id: 1, type: 'Visa', last4: '4242', isDefault: true },
        { id: 2, type: 'Mastercard', last4: '8888', isDefault: false },
    ]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    // Fetch loyalty points
    useEffect(() => {
        if (user?.id) {
            fetchLoyaltyPoints();
        }
    }, [user]);

    const fetchLoyaltyPoints = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('loyalty_points')
                .eq('id', user?.id)
                .single();

            if (error) throw error;
            setLoyaltyPoints(data?.loyalty_points || 0);
        } catch (error) {
            console.error('Error fetching loyalty points:', error);
        }
    };

    const removePaymentMethod = (id: number) => {
        setPaymentMethods(prev => prev.filter(m => m.id !== id));
    };

    const addNewCard = () => {
        const type = Math.random() > 0.5 ? 'Visa' : 'Mastercard';
        const last4 = Math.floor(1000 + Math.random() * 9000).toString();
        const newCard = {
            id: Date.now(),
            type,
            last4,
            isDefault: paymentMethods.length === 0,
        };
        setPaymentMethods(prev => [...prev, newCard]);
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl pb-24">
            {/* Success Notification */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        {t('profile_updated')}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-8 items-center mb-12 glass p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-10" />
                <div className="relative group">
                    <div className="w-40 h-40 rounded-full bg-white/5 flex items-center justify-center border-4 border-white/10 overflow-hidden backdrop-blur-md">
                        <User className="w-20 h-20 text-white/40 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <button className="absolute bottom-2 right-2 p-3 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-all border border-white/20">
                        <Camera className="w-5 h-5" />
                    </button>
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-5xl font-black tracking-tighter mb-4 text-white">
                        <span className="text-gradient">{profileData.fullName}</span>
                    </h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <span className="px-5 py-2 glass text-yellow-400 text-xs font-black uppercase tracking-widest rounded-full border border-yellow-400/20">
                            Gold Member
                        </span>
                        <span className="px-5 py-2 glass text-primary text-xs font-black uppercase tracking-widest rounded-full border border-primary/20">
                            Member since 2023
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <Card className="border-none shadow-2xl bg-gradient-to-br from-primary to-blue-600 text-white rounded-[2rem] overflow-hidden relative group p-8">
                    <Gift className="absolute -bottom-6 -right-6 w-40 h-40 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-2">{t('points')}</p>
                        <div className="text-5xl font-black">{loyaltyPoints.toLocaleString()}</div>
                        <p className="text-sm opacity-80 mt-4 font-bold">~ EGP {(loyaltyPoints * 0.10).toFixed(2)} value</p>
                    </div>
                </Card>

                <Card className="fancy-card border-none p-8">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">{t('orders')}</p>
                        <div className="text-5xl font-black text-white">12</div>
                        <p className="text-sm text-white/60 mt-4 font-bold">Completed this year</p>
                    </div>
                </Card>

                <Card className="fancy-card border-none hidden lg:block p-8">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Level Progress</p>
                    <div className="w-full bg-white/5 h-4 rounded-full mt-6 overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="bg-gradient-to-r from-primary to-blue-400 h-full shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                        />
                    </div>
                    <p className="text-xs text-white/60 mt-6 font-bold flex justify-between uppercase tracking-widest">
                        <span>To Platinum</span>
                        <span className="text-white font-black">750 PTS left</span>
                    </p>
                </Card>
            </div>

            <Tabs defaultValue="settings" className="w-full">
                <TabsList className="glass p-1.5 border-white/10 rounded-2xl mb-12 w-full md:w-auto h-16 shadow-2xl">
                    <TabsTrigger value="settings" className="rounded-xl px-10 h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-black uppercase tracking-widest text-[10px]">
                        {t('account_settings')}
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="rounded-xl px-10 h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-black uppercase tracking-widest text-[10px]">
                        {t('orders')}
                    </TabsTrigger>
                    <TabsTrigger value="points" className="rounded-xl px-10 h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-black uppercase tracking-widest text-[10px]">
                        {t('points_history')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="settings" className="space-y-12 outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Personal Info */}
                        <Card className="fancy-card border-none overflow-hidden">
                            <CardHeader className="bg-white/5 border-b border-white/5 py-8 px-10 flex flex-row items-center gap-4">
                                <div className="p-3 glass text-primary rounded-xl">
                                    <User className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-2xl font-black tracking-tight text-white uppercase italic">Personal Info</CardTitle>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('full_name')}</Label>
                                        <Input value={profileData.fullName} onChange={handleInputChange} className="rounded-2xl h-14 bg-white/5 border-white/10 text-white focus:ring-primary focus:border-primary transition-all font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('email_address')}</Label>
                                        <Input value={profileData.email} onChange={handleInputChange} className="rounded-2xl h-14 bg-white/5 border-white/10 text-white font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('phone_number')}</Label>
                                        <Input value={profileData.phone} onChange={handleInputChange} className="rounded-2xl h-14 bg-white/5 border-white/10 text-white font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">City</Label>
                                        <Input value={profileData.city} onChange={handleInputChange} className="rounded-2xl h-14 bg-white/5 border-white/10 text-white font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('preferred_address')}</Label>
                                    <Input value={profileData.address} onChange={handleInputChange} className="rounded-2xl h-14 bg-white/5 border-white/10 text-white font-bold" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Methods */}
                        <Card className="fancy-card border-none overflow-hidden">
                            <CardHeader className="bg-white/5 border-b border-white/5 py-8 px-10 flex flex-row items-center gap-4">
                                <div className="p-3 glass text-emerald-400 rounded-xl">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-2xl font-black tracking-tight text-white uppercase italic">{t('payment_methods')}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                {paymentMethods.map(method => (
                                    <div key={method.id} className="group p-6 rounded-3xl glass border-white/10 hover:border-primary/50 transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-10 glass-dark rounded-xl flex items-center justify-center font-black text-xs text-white/50 tracking-tighter">
                                                {method.type.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-lg text-white tracking-widest leading-none">•••• {method.last4}</p>
                                                {method.isDefault && (
                                                    <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-2 block">DEFAULT</span>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="opacity-0 group-hover:opacity-100 text-[10px] font-black uppercase tracking-widest text-destructive hover:bg-destructive/10 transition-all"
                                            onClick={() => removePaymentMethod(method.id)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    className="w-full rounded-3xl h-16 border-dashed border-2 border-white/10 bg-white/5 font-black uppercase tracking-widest text-xs text-white/40 hover:text-primary hover:border-primary transition-all active:scale-[0.98]"
                                    onClick={addNewCard}
                                >
                                    + Add New Card
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-center md:justify-end">
                        <Button
                            size="lg"
                            className="rounded-[2rem] px-16 h-20 text-xl font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(139,92,246,0.3)] min-w-[300px] bg-primary text-white hover:bg-primary/80 transition-all hover:scale-105"
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-6 h-6 mr-3" />
                                    {t('save_changes')}
                                </>
                            )}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="orders">
                    <Card className="fancy-card border-none overflow-hidden">
                        <CardHeader className="py-8 px-10 border-b border-white/5 flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl font-black uppercase italic text-white tracking-tight">Recent History</CardTitle>
                            <Button variant="link" className="text-primary font-black uppercase tracking-widest text-xs">Full History</Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-white/5">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-10 hover:bg-white/5 transition-all group">
                                        <div className="flex items-center gap-8 mb-6 sm:mb-0">
                                            <div className="p-5 glass text-white/30 rounded-3xl group-hover:text-primary transition-colors">
                                                <Package className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="font-black text-xl uppercase tracking-tighter text-white">Order #120{i}</p>
                                                <p className="text-xs text-white/40 font-bold flex items-center gap-2 mt-2 uppercase tracking-widest">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date().toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                                            <p className="font-black text-primary text-3xl">EGP 2,450</p>
                                            <span className="inline-flex items-center rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 sm:mt-4 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                                Delivered
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="points" className="outline-none">
                    {user?.id && <PointsHistory userId={user.id} />}
                </TabsContent>
            </Tabs>
        </div>
    );
}
