'use client';

import { useState } from 'react';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { EditProductDialog } from '@/components/admin/EditProductDialog';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    category: string;
    description?: string;
}

const INITIAL_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Classic White Sneakers',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop',
        stock: 12,
        category: 'Footwear',
        description: 'Premium white leather sneakers with minimalist design.'
    },
    {
        id: '2',
        name: 'Leather Crossbody Bag',
        price: 3200,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop',
        stock: 5,
        category: 'Accessories',
        description: 'Genuine leather bag with adjustable strap.'
    },
    {
        id: '3',
        name: 'Denim Jacket Vintage',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974&auto=format&fit=crop',
        stock: 8,
        category: 'Outerwear',
        description: 'Vintage-washed denim jacket for a classic layered look.'
    },
    {
        id: '4',
        name: 'Minimalist Watch',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1999&auto=format&fit=crop',
        stock: 15,
        category: 'Accessories',
        description: 'Sleek silver watch with a minimalist face.'
    },
];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setIsDialogOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    const handleSaveProduct = (product: Product) => {
        if (selectedProduct) {
            // Edit mode
            setProducts((prev) =>
                prev.map((p) => (p.id === product.id ? product : p))
            );
        } else {
            // Add mode
            const newProduct = {
                ...product,
                id: Math.random().toString(36).substr(2, 9),
            };
            setProducts((prev) => [newProduct, ...prev]);
        }
    };

    const handleDeleteProduct = (id: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none mb-3">
                        <span className="text-gradient">Products</span>
                    </h1>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-[0.3em] ml-1">Universal Inventory Intelligence</p>
                </div>
                <Button onClick={handleAddProduct} className="rounded-2xl px-8 h-16 bg-primary font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)] border-none">
                    <Plus className="mr-2 h-5 w-5" /> New Product Entry
                </Button>
            </div>

            <ProductsTable
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
            />

            <EditProductDialog
                product={selectedProduct}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSave={handleSaveProduct}
            />
        </div>
    );
}
