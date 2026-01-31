'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu, Globe, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import Image from 'next/image';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();
    const { setLanguage, t } = useLanguage();
    const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();
    const { user, profile, signOut } = useAuth();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    const links = [
        { name: t('home'), href: '/' },
        { name: t('products'), href: '/products' },
        { name: t('about'), href: '/about' },
        { name: t('contact'), href: '/contact' },
    ];

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass border-b border-white/10 py-3 mt-4 mx-4 rounded-2xl' : 'bg-transparent py-6'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity text-foreground">
                    THE SHOP<span className="text-primary">.</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-foreground">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium hover:text-primary transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute left-0 right-0 bottom-[-4px] h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                        </Link>
                    ))}
                </nav>

                {/* Icons / Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Language Selector */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Globe className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl">
                            <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer">English</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('ar')} className="cursor-pointer">العربية</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Cart Sheet */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full relative">
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-background">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="flex flex-col w-full sm:max-w-md glass-dark border-l border-white/10 shadow-2xl">
                            <SheetTitle className="hidden">Cart</SheetTitle>
                            <SheetDescription className="hidden">View your cart items</SheetDescription>
                            <h2 className="text-2xl font-bold mb-6 text-foreground">{t('cart')}</h2>

                            <div className="flex-1 overflow-y-auto pr-2">
                                {cartItems.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                        <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                                        <p>Your cart is empty.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex gap-4">
                                                <div className="relative w-20 h-20 rounded-lg overflow-hidden border flex-shrink-0">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-semibold text-sm leading-tight line-clamp-2 pr-2">{item.name}</h4>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center border rounded-full overflow-hidden">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="p-1 hover:bg-muted transition-colors border-r"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="p-1 hover:bg-muted transition-colors border-l"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <p className="font-bold text-primary text-sm">EGP {(item.price * item.quantity).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-6 mt-6 space-y-4">
                                <div className="flex justify-between font-bold text-lg text-foreground">
                                    <span>{t('total')}</span>
                                    <span>EGP {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-[10px] text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-900/50">
                                    {t('cash_notice')}
                                </div>
                                <Button
                                    className="w-full font-bold h-12 shadow-lg shadow-primary/20"
                                    size="lg"
                                    disabled={cartItems.length === 0}
                                    asChild
                                >
                                    <SheetClose asChild>
                                        <Link href="/checkout">
                                            {t('proceed_to_checkout')}
                                        </Link>
                                    </SheetClose>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <User className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-dark border-white/10 shadow-2xl min-w-[220px] rounded-2xl p-2">
                            {!user ? (
                                <>
                                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/5 rounded-xl py-3 mb-1 font-black text-[10px] uppercase tracking-widest text-primary border-b border-white/5">
                                        <Link href="/login">Login</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/5 rounded-xl py-3 mb-1 font-black text-[10px] uppercase tracking-widest text-emerald-400 border-b border-white/5">
                                        <Link href="/register">Register Now</Link>
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <div className="px-3 py-2 mb-2 border-b border-white/5">
                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Authenticated as</p>
                                        <p className="text-[10px] font-bold text-white truncate">{user.email}</p>
                                        {profile?.role === 'admin' && (
                                            <span className="inline-block mt-1 px-2 py-0.5 bg-primary/20 text-primary text-[8px] font-black uppercase tracking-tighter rounded-full">Administrator</span>
                                        )}
                                    </div>
                                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/5 rounded-xl py-2 mb-1 font-bold text-xs">
                                        <Link href="/profile">{t('my_profile')}</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/5 rounded-xl py-2 mb-1 font-bold text-xs">
                                        <Link href="/orders">{t('my_orders')}</Link>
                                    </DropdownMenuItem>
                                    {profile?.role === 'admin' && (
                                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/5 rounded-xl py-2 mb-1 font-black text-[10px] uppercase tracking-widest text-primary">
                                            <Link href="/admin">{t('admin')} {t('dashboard')}</Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                        className="text-destructive font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-destructive/5 rounded-xl mt-2 py-3"
                                        onClick={() => signOut()}
                                    >
                                        {t('logout')}
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetTitle className="hidden">Navigation Menu</SheetTitle>
                            <SheetDescription className="hidden">Main navigation links</SheetDescription>
                            <div className="flex flex-col gap-6 mt-10">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-lg font-medium hover:text-primary"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.header>
    );
}
