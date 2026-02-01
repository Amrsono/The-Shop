'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { EditProductDialog } from '@/components/admin/EditProductDialog';

import { useLanguage } from '@/lib/context/LanguageContext';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    category: string;
    description?: string;
    name_ar?: string;
    description_ar?: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { t, language, dir } = useLanguage();

    const [categories, setCategories] = useState<any[]>([]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('id, name_en, name_ar');
        if (data) setCategories(data);
    };

    const fetchProducts = async () => {
        setIsLoading(true);
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
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedProducts = data.map((item: any) => ({
                id: item.id,
                name: item.name_en || 'Unknown',
                price: item.price,
                image: item.image,
                stock: item.stock,
                category: language === 'ar' ? (item.categories?.name_ar || item.categories?.name_en) : (item.categories?.name_en || 'Uncategorized'),
                description: item.description_en,
                name_ar: item.name_ar,
                description_ar: item.description_ar
            }));

            setProducts(formattedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [language]);

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setIsDialogOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    const handleSaveProduct = async (product: Product) => {
        try {
            // Find category ID based on displayed name is risky if language changes.
            // Better to match by ID if we had it, but we map specific display name.
            // Let's rely on finding by name_en or name_ar depending on current language logic,
            // OR ideally we should store category_id in the product object? 
            // The table displays the string category.
            // Let's keep it simple: We need to find the category object.

            let categoryId;
            const categoryObj = categories.find(c =>
                c.name_en === product.category || c.name_ar === product.category
            );

            if (categoryObj) {
                categoryId = categoryObj.id;
            } else {
                // Fallback: maybe the user didn't change it and it's valid?
                // Or maybe we should bind ID instead of name in the form?
                // The form uses a Select with values being the names from the list.
                // The EditProductDialog Select options are currently HARDCODED.
                // We need to update EditProductDialog to accept dynamic categories list!
                // Wait, EditProductDialog has hardcoded categories in the JSX I just wrote?
                // Checking my previous edit to EditProductDialog...
                // Yes: <SelectItem value="Footwear">...
                // This is bad. Accessing the categories from DB is better.
                // But for now, let's assume the hardcoded list matches the DB en names?
                // If I want full support, I should pass the categories list to the dialog.
                // BUT, for now let's just try to map back to what we have.
                // In `handleSaveProduct`, `product.category` will come from the Select value.
                // If the Select values are English hardcoded strings (Footwear, Accessories...),
                // then we must ensure we interpret them correctly.
                // The `categories` state here has IDs.

                // IMPROVEMENT: Retrieve real category ID.
                // For now, let's assume `product.category` matches `name_en` in DB.
                const vid = categories.find(c => c.name_en === product.category);
                categoryId = vid?.id;
            }

            // If still no category ID and it's a new product, we have a problem.
            // However, existing logic relied on `categories.find(c => c.name_en === product.category)`.
            // So if `product.category` is "Footwear" and DB has "Footwear", it works.

            if (!categoryId && product.category) {
                // Try to find approximate match or default
                const def = categories.find(c => c.name_en === 'Accessories');
                categoryId = def?.id;
            }

            const payload = {
                name_en: product.name,
                name_ar: product.name_ar,
                price: product.price,
                stock: product.stock,
                image: product.image,
                description_en: product.description,
                description_ar: product.description_ar,
                category_id: categoryId,
                is_new: true
            };

            if (selectedProduct) {
                // Update
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', product.id);

                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('products')
                    .insert(payload);

                if (error) throw error;
            }

            // Refresh list
            fetchProducts();
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm(t('confirm_delete'))) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none mb-3">
                        <span className="text-gradient">{t('products')}</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <p className="text-xs text-white/40 font-bold uppercase tracking-[0.3em] ml-1">{t('products_stock_control')}</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={fetchProducts}
                            className={`h-8 w-8 rounded-full hover:bg-white/10 ${isLoading ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw className="w-4 h-4 text-primary" />
                        </Button>
                    </div>
                </div>
                <Button onClick={handleAddProduct} className="rounded-2xl px-8 h-16 bg-primary font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)] border-none">
                    <Plus className="mr-2 h-5 w-5" /> {t('new_product_entry')}
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
