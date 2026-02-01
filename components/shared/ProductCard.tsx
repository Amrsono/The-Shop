'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/context/CartContext';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    isNew?: boolean;
}

interface ProductCardProps {
    product: Product;
}

import { useLanguage } from '@/lib/context/LanguageContext';

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const { t } = useLanguage();

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="overflow-hidden fancy-card group border-none">
                <div className="relative aspect-square overflow-hidden bg-white/5">
                    {product.isNew && (
                        <Badge className="absolute top-2 left-2 z-10 bg-primary/80 backdrop-blur-md text-white border-white/20 pointer-events-none">
                            {t('new_arrival')}
                        </Badge>
                    )}
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button variant="secondary" size="lg" className="rounded-full translate-y-4 group-hover:translate-y-0 transition-all duration-300 glass border-white/20">
                            {t('quick_view')}
                        </Button>
                    </div>
                </div>
                <CardContent className="p-5">
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1 opacity-80">{product.category}</p>
                    <h3 className="font-bold text-lg truncate text-white">{product.name}</h3>
                    <p className="text-xl font-black mt-1 text-white">EGP {product.price.toLocaleString()}</p>
                </CardContent>
                <CardFooter className="p-5 pt-0">
                    <Button
                        className="w-full rounded-2xl h-12 bg-primary text-white hover:bg-primary/80 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all active:scale-[0.98]"
                        onClick={() => addToCart(product)}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" /> {t('add_to_cart')}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
