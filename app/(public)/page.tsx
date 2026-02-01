'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Hero } from '@/components/shared/Hero';
import { ProductCard } from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Truck, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, language, dir } = useLanguage();

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select(`
                        *,
                        categories (
                            name_en,
                            name_ar
                        )
                    `)
                    .limit(4)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    // Mapping is done in render or here? 
                    // Better to keep raw data and map in render if language changes?
                    // Or re-map on language change? 
                    // Let's store raw data and map on the fly or utilize a helper.
                    // For now, I'll store formatted data but I need to re-fetch or re-format when language changes?
                    // Actually, if I store raw data it's better.
                    // Let's stick to the current pattern but make it language aware re-mapping.
                    // BUT: if I only fetch once, I need to depend on `language` for the mapping.
                    // So I should put `language` in dependency array? No, that causes refetch.
                    // I will formatting inside the render or use a memo.
                    // Let's store raw data first.

                    const formatted = data.map((item: any) => ({
                        // We store both to allow switching without refetching if we want
                        // But ProductCard expects "name", "category".
                        // So we should probably re-format when language changes.
                        id: item.id,
                        name: language === 'ar' ? (item.name_ar || item.name_en) : item.name_en,
                        price: item.price,
                        image: item.image,
                        category: language === 'ar' ? (item.categories?.name_ar || item.categories?.name_en || 'Uncategorized') : (item.categories?.name_en || 'Uncategorized'),
                        isNew: item.is_new,
                    }));
                    setFeaturedProducts(formatted);
                }
            } catch (error) {
                console.error('Error fetching featured products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeatured();
    }, [language]); // Re-fetch/Re-format when language changes

    return (
        <div className="min-h-screen" dir={dir}>
            <Hero />

            {/* Features Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: Truck, title: t('free_shipping'), desc: t('on_orders_over') + ' 2000 LE' },
                            { icon: ShieldCheck, title: t('secure_payment'), desc: t('cash_card') },
                            { icon: RefreshCw, title: t('free_returns'), desc: t('return_policy') },
                            { icon: Star, title: t('loyal_points'), desc: t('earn_purchase') },
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
                        <div className={`text-center ${dir === 'rtl' ? 'md:text-right' : 'md:text-left'}`}>
                            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic uppercase">
                                <span className="text-gradient">{t('trending')}</span>
                            </h2>
                            <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs">{t('curated_selects')}</p>
                        </div>
                        <Button variant="outline" asChild className="rounded-full px-8 h-12 glass border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all">
                            <Link href="/products" className="flex items-center gap-2">
                                {t('view_all')}
                                {dir === 'rtl' ? <ArrowRight className="w-4 h-4 rotate-180" /> : <ArrowRight className="w-4 h-4" />}
                            </Link>
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="h-40 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {featuredProducts.length > 0 ? (
                                featuredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-full text-center text-white/50">
                                    {t('no_products_found')}
                                </div>
                            )}
                        </div>
                    )}
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
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">{t('end_season_sale')}</h2>
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">{t('sale_desc')}</p>
                    <Button size="lg" className="rounded-full px-10 py-8 text-xl bg-white text-black hover:bg-white/90" asChild>
                        <Link href="/products">{t('shop_sale')}</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
