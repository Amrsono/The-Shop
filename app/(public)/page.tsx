import { Hero } from '@/components/shared/Hero';
import { ProductCard } from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mock Data
const featuredProducts = [
    {
        id: '1',
        name: 'Classic White Sneakers',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop',
        category: 'Footwear',
        isNew: true,
    },
    {
        id: '2',
        name: 'Leather Crossbody Bag',
        price: 3200,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop',
        category: 'Accessories',
        isNew: false,
    },
    {
        id: '3',
        name: 'Denim Jacket Vintage',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974&auto=format&fit=crop',
        category: 'Outerwear',
        isNew: true,
    },
    {
        id: '4',
        name: 'Minimalist Watch',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1999&auto=format&fit=crop',
        category: 'Accessories',
        isNew: false,
    },
];

export default function Home() {
    return (
        <div className="min-h-screen">
            <Hero />

            {/* Features Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: Truck, title: 'Free Shipping', desc: 'On all orders over 2000 LE' },
                            { icon: ShieldCheck, title: 'Secure Payment', desc: 'Cash & Card Accepted' },
                            { icon: RefreshCw, title: 'Free Returns', desc: '30 days return policy' },
                            { icon: Star, title: 'Loyal Points', desc: 'Earn on every purchase' },
                        ].map((feature, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-8 glass rounded-[2rem] border-white/5 group hover:bg-white/10 transition-all duration-500">
                                <div className="p-4 bg-primary/20 rounded-2xl mb-6 text-primary group-hover:scale-110 group-hover:bg-primary transition-all duration-500 group-hover:text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-black text-lg uppercase tracking-tight mb-2 italic">{feature.title}</h3>
                                <p className="text-xs text-white/50 font-bold uppercase tracking-widest">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-32 relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic uppercase">
                                <span className="text-gradient">Trending Now</span>
                            </h2>
                            <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs">Curated selects for the digital era</p>
                        </div>
                        <Button variant="outline" asChild className="rounded-full px-8 h-12 glass border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all">
                            <Link href="/products">View All <ArrowRight className="ml-2 w-4 h-4" /></Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Promotional Banner */}
            <section className="py-24 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                        alt="Promo"
                        fill
                        className="object-cover opacity-40"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">End of Season Sale</h2>
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">Up to 50% off on selected items. Don't miss out on the best deals of the year.</p>
                    <Button size="lg" className="rounded-full px-10 py-8 text-xl bg-white text-black hover:bg-white/90">
                        Shop Sale
                    </Button>
                </div>
            </section>
        </div>
    );
}
