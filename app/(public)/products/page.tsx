'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/shared/ProductCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

import { useLanguage } from '@/lib/context/LanguageContext';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [isLoading, setIsLoading] = useState(true);
    const { t, language, dir } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Categories
                const { data: categoriesData } = await supabase
                    .from('categories')
                    .select('id, name_en, name_ar')
                    .order('name_en');

                if (categoriesData) {
                    setCategories(categoriesData);
                }

                // Fetch Products
                const { data: productsData, error } = await supabase
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

                const formattedProducts = productsData.map((item: any) => ({
                    id: item.id,
                    name: language === 'ar' ? (item.name_ar || item.name_en) : item.name_en,
                    price: item.price,
                    image: item.image,
                    category: language === 'ar' ? (
                        item.categories?.name_ar || item.categories?.name_en || 'Uncategorized'
                    ) : (
                        item.categories?.name_en || 'Uncategorized'
                    ),
                    isNew: item.is_new,
                    // Keep original category names for logic if needed, but here we filter by displayed name usually or ID?
                    // The filter currently uses `selectedCategory` which matches the badge text.
                    // So we should adhere to that.
                    rawCategoryEn: item.categories?.name_en || 'Uncategorized',
                    rawCategoryAr: item.categories?.name_ar || item.categories?.name_en || 'Uncategorized'
                }));

                setProducts(formattedProducts);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [language]);

    // Filtering Logic
    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => {
            // If selectedCategory is "All" (translated?), we handle it separately.
            // If selectedCategory is a specific name, we compare.
            // Issues: `selectedCategory` state holds the string displayed on the badge.
            // So if we switch language, `selectedCategory` might still be English?
            // Ideally we should reset selection on language switch OR map selection?
            // For simplicity, let's reset to 'All' when language changes (effect dependency).
            // But wait, `language` dependency causes re-fetch and state re-init?
            // No, standard state isn't reset on re-render, but effect runs.
            // If I put `fetchData` in effect dependent on `language`, it runs again.
            // `selectedCategory` stays 'All' initially but if user selected something, it might mismatch.
            // Let's reset `selectedCategory` to 'All' when language changes to avoid mismatch.
            return p.category === selectedCategory;
        });

    // Reset category on language change
    useEffect(() => {
        setSelectedCategory('All');
    }, [language]);


    return (
        <div className="container mx-auto px-4 py-12" dir={dir}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">{t('our_collection')}</h1>
                    <p className="text-muted-foreground">{t('discover_premium')}</p>
                </div>
                <div className="flex gap-2 pb-2 md:pb-0 overflow-x-auto">
                    <Badge
                        variant={selectedCategory === 'All' ? 'secondary' : 'outline'}
                        className="px-4 py-1.5 cursor-pointer hover:bg-primary hover:text-white transition-colors"
                        onClick={() => setSelectedCategory('All')}
                    >
                        {t('all')}
                    </Badge>
                    {categories.map((category) => {
                        const catName = language === 'ar' ? (category.name_ar || category.name_en) : category.name_en;
                        return (
                            <Badge
                                key={category.id}
                                variant={selectedCategory === catName ? 'secondary' : 'outline'}
                                className="px-4 py-1.5 cursor-pointer hover:bg-primary hover:text-white transition-colors"
                                onClick={() => setSelectedCategory(catName)}
                            >
                                {catName}
                            </Badge>
                        );
                    })}
                </div>
            </div>

            {isLoading ? (
                <div className="h-[40vh] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-muted-foreground">
                            {t('no_products_found')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
