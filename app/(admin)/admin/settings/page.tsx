'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Store,
    Globe,
    Truck,
    CreditCard,
    Instagram,
    Facebook,
    Twitter,
    Bell,
    ShieldCheck,
    Save,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="space-y-12">
            <div className="relative">
                <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none mb-3">
                    <span className="text-gradient">Settings</span>
                </h1>
                <p className="text-xs text-white/40 font-bold uppercase tracking-[0.3em] ml-1">Store Configuration Control</p>
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1 h-auto rounded-3xl mb-12 flex flex-wrap gap-2 lg:inline-flex">
                    <TabsTrigger value="general" className="rounded-2xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(139,92,246,0.5)] font-black uppercase tracking-widest text-[10px]">
                        <Store className="w-4 h-4 mr-2" /> General
                    </TabsTrigger>
                    <TabsTrigger value="commerce" className="rounded-2xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(139,92,246,0.5)] font-black uppercase tracking-widest text-[10px]">
                        <Truck className="w-4 h-4 mr-2" /> Commerce
                    </TabsTrigger>
                    <TabsTrigger value="social" className="rounded-2xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(139,92,246,0.5)] font-black uppercase tracking-widest text-[10px]">
                        <Globe className="w-4 h-4 mr-2" /> Social
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-2xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(139,92,246,0.5)] font-black uppercase tracking-widest text-[10px]">
                        <ShieldCheck className="w-4 h-4 mr-2" /> Security
                    </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-10 rounded-[3rem] border-white/5 space-y-10"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Store Name</Label>
                                    <Input defaultValue="THE SHOP" className="bg-white/5 border-white/10 rounded-2xl h-14 pl-6 text-white font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Store Email</Label>
                                    <Input defaultValue="contact@theshop.com" className="bg-white/5 border-white/10 rounded-2xl h-14 pl-6 text-white font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Support Phone</Label>
                                    <Input defaultValue="+20 100 000 0000" className="bg-white/5 border-white/10 rounded-2xl h-14 pl-6 text-white font-bold" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Store Description</Label>
                                    <Textarea
                                        defaultValue="Premium clothing store for the modern generation. Quality materials, futuristic designs."
                                        className="bg-white/5 border-white/10 rounded-[2rem] min-h-[148px] p-6 text-white font-bold resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-white/5" />

                        <div className="space-y-6">
                            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 block">Physical Address</Label>
                            <Input defaultValue="New Cairo, Egypt" className="bg-white/5 border-white/10 rounded-2xl h-14 pl-6 text-white font-bold" />
                        </div>
                    </motion.div>
                </TabsContent>

                {/* Commerce Settings */}
                <TabsContent value="commerce" className="mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-10 rounded-[3rem] border-white/5 space-y-10"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Currency</Label>
                                    <Input defaultValue="Egyptian Pound (EGP)" disabled className="bg-white/5 border-white/10 rounded-2xl h-14 pl-6 text-white/40 font-bold cursor-not-allowed" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px) font-black uppercase tracking-widest text-primary ml-1">VAT Percentage (%)</Label>
                                    <Input defaultValue="14" type="number" className="bg-white/5 border-white/10 rounded-2xl h-14 pl-6 text-white font-bold" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Shipping Fee (Flat Rate)</Label>
                                    <Input defaultValue="50" type="number" className="bg-white/5 border-white/10 rounded-2xl h-14 pl-6 text-white font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Free Shipping Threshold</Label>
                                    <Input defaultValue="2000" type="number" className="bg-white/5 border-white/10 rounded-2xl h-14 pl-6 text-white font-bold" />
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-white/5" />

                        <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/10">
                            <div>
                                <h4 className="font-black text-xs uppercase tracking-widest mb-1 italic">Maintenance Mode</h4>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Disable store for all public visitors</p>
                            </div>
                            <div className="relative inline-flex items-center cursor-pointer group">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-14 h-8 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary group-hover:after:scale-110 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"></div>
                            </div>
                        </div>
                    </motion.div>
                </TabsContent>

                {/* Social Settings */}
                <TabsContent value="social" className="mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-10 rounded-[3rem] border-white/5 space-y-10"
                    >
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-[#E1306C]/20 border border-[#E1306C]/30 flex items-center justify-center text-[#E1306C]">
                                    <Instagram className="w-6 h-6" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Instagram Profile</Label>
                                    <Input defaultValue="https://instagram.com/theshop" className="bg-white/5 border-white/10 rounded-2xl h-14 pl-6 text-white font-bold shadow-inner" />
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/20 border border-[#1877F2]/30 flex items-center justify-center text-[#1877F2]">
                                    <Facebook className="w-6 h-6" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Facebook Page</Label>
                                    <Input defaultValue="https://facebook.com/theshop" className="bg-white/5 border-white/10 rounded-2xl h-14 pl-6 text-white font-bold shadow-inner" />
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-[#000000]/20 border border-white/10 flex items-center justify-center text-white">
                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19.59 3H4.41C3.63 3 3 3.63 3 4.41v15.18c0 .78.63 1.41 1.41 1.41h15.18c.78 0 1.41-.63 1.41-1.41V4.41C21 3.63 20.37 3 19.59 3zM4 19a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6l1 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4z" opacity=".2" /><path d="M12.525 12.525L17.75 5h-1.575l-4.225 6.025L8.5 5H3.25l5.525 7.525L3.25 20h1.575l4.675-6.675L13.25 20h5.25l-5.975-7.475zM10.25 12.3l-.7-1L4.85 6.5h2.425l3.6 5.15.7 1 4.975 7.1h-2.425l-3.875-5.45z" /></svg>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">X / Twitter</Label>
                                    <Input defaultValue="https://twitter.com/theshop" className="bg-white/5 border-white/10 rounded-2xl h-14 pl-6 text-white font-bold shadow-inner" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-10 rounded-[3rem] border-white/5 space-y-10"
                    >
                        <div className="space-y-6">
                            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 block">Administrative Access</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Button variant="outline" className="h-20 rounded-[1.5rem] border-white/10 hover:bg-white/5 flex flex-col items-start px-8 gap-1 transition-all">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Change Password</span>
                                    <span className="text-[9px] text-white/30 font-bold uppercase">Update your security protocol</span>
                                </Button>
                                <Button variant="outline" className="h-20 rounded-[1.5rem] border-white/10 hover:bg-white/5 flex flex-col items-start px-8 gap-1 transition-all">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 italic">2FA Status</span>
                                    <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Active & Secure</span>
                                </Button>
                            </div>
                        </div>

                        <Separator className="bg-white/5" />

                        <div className="space-y-6">
                            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 block">Backup & Recovery</Label>
                            <Button className="w-full h-16 rounded-[1.5rem] glass-dark border-white/10 hover:bg-white/10 text-xs font-black uppercase tracking-[0.2em] italic group">
                                <Save className="w-4 h-4 mr-3 text-primary group-hover:scale-125 transition-all" /> Backup System Database
                            </Button>
                        </div>
                    </motion.div>
                </TabsContent>
            </Tabs>

            <div className="fixed bottom-10 right-10 z-50">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`h-20 px-10 rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 ${success ? 'bg-emerald-500 text-white shadow-emerald-500/40' : 'bg-primary text-white shadow-primary/40'
                        }`}
                >
                    {isSaving ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : success ? (
                        <span className="flex items-center gap-3 italic">Settings Updated <Bell className="w-5 h-5 animate-bounce" /></span>
                    ) : (
                        <span className="flex items-center gap-3">Save Changes <Save className="w-5 h-5" /></span>
                    )}
                </Button>
            </div>
        </div>
    );
}
