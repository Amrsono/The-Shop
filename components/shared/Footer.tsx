'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

export function Footer() {
    const { t, dir } = useLanguage();

    return (
        <footer className="bg-secondary/50 border-t mt-20" dir={dir}>
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">THE SHOP<span className="text-primary">.</span></h3>
                        <p className="text-muted-foreground text-sm">
                            {t('footer_tagline')}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">{t('quick_links')}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">{t('home')}</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">{t('about_us')}</Link></li>
                            <li><Link href="/products" className="hover:text-primary transition-colors">{t('products')}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">{t('contact')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">{t('customer_service')}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/profile" className="hover:text-primary transition-colors">{t('my_account')}</Link></li>
                            <li><Link href="/orders" className="hover:text-primary transition-colors">{t('order_history')}</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">{t('faq')}</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">{t('privacy_policy')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">{t('connect_with_us')}</h4>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-primary hover:text-white transition-colors border shadow-sm">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-primary hover:text-white transition-colors border shadow-sm">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-primary hover:text-white transition-colors border shadow-sm">
                                <Twitter className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} The Shop. {t('all_rights_reserved')}</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-foreground">{t('terms')}</Link>
                        <Link href="#" className="hover:text-foreground">{t('privacy')}</Link>
                        <Link href="#" className="hover:text-foreground">{t('cookies')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
