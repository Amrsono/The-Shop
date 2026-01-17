'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Package,
    Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const sidebarItems = [
    { name: 'View Store', href: '/', icon: Home },
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="h-screen w-64 glass-dark text-white flex flex-col fixed left-0 top-0 overflow-y-auto border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.3)]">
            <div className="p-8 border-b border-white/5 bg-white/5">
                <h1 className="text-2xl font-black tracking-tighter uppercase italic">
                    <span className="text-gradient">Admin</span> Panel
                </h1>
            </div>

            <nav className="flex-1 p-6 space-y-3">
                {sidebarItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <span className={cn(
                            "flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 group",
                            pathname === item.href
                                ? "bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] scale-105"
                                : "text-white/40 hover:text-white hover:bg-white/5"
                        )}>
                            <item.icon className={cn(
                                "w-5 h-5 transition-transform group-hover:scale-110",
                                pathname === item.href ? "text-white" : "text-primary/60"
                            )} />
                            {item.name}
                        </span>
                    </Link>
                ))}
            </nav>

            <div className="p-6 border-t border-white/5 mt-auto">
                <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px]">
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout Account
                </Button>
            </div>
        </div>
    );
}
