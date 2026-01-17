import { SalesChart } from '@/components/admin/SalesChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeDollarSign, CreditCard, Package, Users } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="space-y-12">
            <div className="relative">
                <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none mb-3">
                    <span className="text-gradient">Dashboard</span>
                </h1>
                <p className="text-xs text-white/40 font-bold uppercase tracking-[0.3em] ml-1">Live Intelligence Overview</p>
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BadgeDollarSign className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Total Revenue</p>
                    <div className="text-3xl font-black text-white italic tracking-tighter mb-2">45,231.89 LE</div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">+20.1%</span>
                        <span className="text-[10px] font-bold text-white/20 uppercase">vs last month</span>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Daily Sales</p>
                    <div className="text-3xl font-black text-white italic tracking-tighter mb-2">+42 Orders</div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary uppercase">1,240 Today</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">+5.2%</span>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Package className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Active Assets</p>
                    <div className="text-3xl font-black text-white italic tracking-tighter mb-2">128 SKU</div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">+12 new</span>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Live Updates</span>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Elite Customer</p>
                    <div className="text-3xl font-black text-white italic tracking-tighter mb-2">Store Admin</div>
                    <div className="text-[10px] font-black bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full w-fit mt-1 uppercase tracking-widest">45,231 LE Volume</div>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <div className="lg:col-span-4 glass p-8 rounded-[2.5rem] border-white/5 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400 opacity-50" />
                    <SalesChart />
                </div>

                <div className="lg:col-span-3 glass rounded-[2.5rem] border-white/5 shadow-2xl overflow-hidden">
                    <div className="p-8 border-b border-white/5 bg-white/5">
                        <h3 className="text-xl font-black uppercase italic tracking-tight text-white">Elite Performers</h3>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mt-1">High Transaction Volume</p>
                    </div>
                    <div className="p-8 space-y-8">
                        {[
                            { name: 'Store Admin', email: 'Admin@thestore.com', amount: '45,231' },
                            { name: 'The User', email: 'user@thestore.com', amount: '12,200' },
                            { name: 'Omar Kareem', email: 'omar.k@email.com', amount: '9,800' },
                        ].map((customer, i) => (
                            <div key={i} className="flex items-center group">
                                <div className="w-12 h-12 rounded-2xl glass border-white/10 flex items-center justify-center font-black text-primary transition-all group-hover:bg-primary group-hover:text-white">
                                    {customer.name[0]}
                                </div>
                                <div className="ml-6 flex-1">
                                    <p className="font-black text-white text-sm uppercase tracking-tight">{customer.name}</p>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">{customer.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-primary tracking-tighter italic">{customer.amount} LE</p>
                                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Verified</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
