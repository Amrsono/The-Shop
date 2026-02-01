'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    category: string;
    description?: string;
}

interface ProductsTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

import { useLanguage } from '@/lib/context/LanguageContext';

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
    const { t } = useLanguage();

    return (
        <div className="glass-dark rounded-[2rem] overflow-hidden border-white/5 shadow-2xl">
            <Table>
                <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="w-[120px] py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ps-8 text-start">{t('table_entry')}</TableHead>
                        <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-start">{t('table_id')}</TableHead>
                        <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-start">{t('table_division')}</TableHead>
                        <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-start">{t('table_value')}</TableHead>
                        <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-start">{t('table_units')}</TableHead>
                        <TableHead className="text-end py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pe-8">{t('table_operations')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={6} className="h-40 text-center text-white/20 font-black uppercase tracking-widest text-xs">
                                {t('no_products_found')}
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product) => (
                            <TableRow key={product.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                <TableCell className="py-6 ps-8">
                                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden glass border-white/20 shadow-xl group-hover:scale-110 transition-transform">
                                        <Image src={product.image || 'https://via.placeholder.com/150'} alt={product.name} fill className="object-cover" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-6">
                                    <p className="font-black text-white text-sm uppercase tracking-tight">{product.name}</p>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">ID: {product.id.slice(0, 8)}</p>
                                </TableCell>
                                <TableCell className="py-6">
                                    <span className="px-3 py-1 glass rounded-full text-[10px] font-black uppercase tracking-widest text-primary border-primary/20">
                                        {product.category}
                                    </span>
                                </TableCell>
                                <TableCell className="py-6 font-black text-white">{product.price.toLocaleString()} {t('currency_le')}</TableCell>
                                <TableCell className="py-6">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            product.stock < 10 ? "bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                        )} />
                                        <span className={cn(
                                            "font-black text-sm",
                                            product.stock < 10 ? "text-orange-500" : "text-white"
                                        )}>
                                            {product.stock}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-end py-6 pe-8">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(product)}
                                            className="h-10 w-10 glass border-white/10 text-white hover:bg-primary hover:text-white hover:border-primary transition-all rounded-xl"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 glass border-white/10 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all rounded-xl"
                                            onClick={() => onDelete(product.id)}
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
