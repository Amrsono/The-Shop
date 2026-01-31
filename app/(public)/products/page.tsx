'use client';

import { ProductCard } from '@/components/shared/ProductCard';
import { Badge } from '@/components/ui/badge';

const PRODUCTS = [
    {
        id: '1',
        name: 'Classic White Sneakers',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop',
        category: 'Footwear',
        isNew: true
    },
    {
        id: '2',
        name: 'Leather Crossbody Bag',
        price: 3200,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop',
        category: 'Accessories',
        isNew: false
    },
    {
        id: '3',
        name: 'Denim Jacket Vintage',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974&auto=format&fit=crop',
        category: 'Outerwear',
        isNew: true
    },
    {
        id: '4',
        name: 'Minimalist Watch',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1999&auto=format&fit=crop',
        category: 'Accessories',
        isNew: false
    },
    {
        id: '5',
        name: 'Premium Cotton Tee',
        price: 850,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1974&auto=format&fit=crop',
        category: 'Apparel',
        isNew: false
    },
    {
        id: '6',
        name: 'Chelsea Boots',
        price: 3800,
        image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1935&auto=format&fit=crop',
        category: 'Footwear',
        isNew: true
    }
];

export default function ProductsPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Our Collection</h1>
                    <p className="text-muted-foreground">Discover our curated selection of premium essentials.</p>
                </div>
                <div className="flex gap-2 pb-2 md:pb-0 overflow-x-auto">
                    <Badge variant="secondary" className="px-4 py-1.5 cursor-pointer hover:bg-primary hover:text-white transition-colors">All</Badge>
                    <Badge variant="outline" className="px-4 py-1.5 cursor-pointer hover:bg-primary hover:text-white transition-colors">Footwear</Badge>
                    <Badge variant="outline" className="px-4 py-1.5 cursor-pointer hover:bg-primary hover:text-white transition-colors">Accessories</Badge>
                    <Badge variant="outline" className="px-4 py-1.5 cursor-pointer hover:bg-primary hover:text-white transition-colors">Apparel</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {PRODUCTS.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
