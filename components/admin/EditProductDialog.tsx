'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    category: string;
    description?: string;
}

interface EditProductDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (product: Product) => void;
}

export function EditProductDialog({
    product,
    open,
    onOpenChange,
    onSave,
}: EditProductDialogProps) {
    const [formData, setFormData] = useState<Product>({
        id: '',
        name: '',
        price: 0,
        image: '',
        stock: 0,
        category: '',
        description: '',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (product) {
            setFormData(product);
            setImagePreview(product.image);
        } else {
            setFormData({
                id: '',
                name: '',
                price: 0,
                image: '',
                stock: 0,
                category: '',
                description: '',
            });
            setImagePreview(null);
        }
    }, [product, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData((prev) => ({ ...prev, category: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setFormData((prev) => ({ ...prev, image: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto glass-dark border-white/5 shadow-2xl rounded-[2.5rem] p-0">
                <DialogHeader className="p-8 border-b border-white/5 bg-white/5">
                    <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic">
                        <span className="text-gradient">{product ? 'Edit' : 'Add'}</span> {product ? 'Product' : 'New Product'}
                    </DialogTitle>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-1">Inventory Modification Protocol</p>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Product Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                required
                                className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary text-white font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Price (EGP)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                    className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary text-white font-bold"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="stock" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Stock Amount</Label>
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    required
                                    className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary text-white font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Category Registry</Label>
                            <Select value={formData.category} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary text-white font-bold">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="glass-dark border-white/10 shadow-3xl rounded-2xl">
                                    <SelectItem value="Footwear" className="text-white hover:bg-white/5 py-3">Footwear</SelectItem>
                                    <SelectItem value="Accessories" className="text-white hover:bg-white/5 py-3">Accessories</SelectItem>
                                    <SelectItem value="Outerwear" className="text-white hover:bg-white/5 py-3">Outerwear</SelectItem>
                                    <SelectItem value="Electronics" className="text-white hover:bg-white/5 py-3">Electronics</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Universal Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter product description"
                                className="min-h-[120px] bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary text-white/80 font-medium leading-relaxed"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Visual Identity Asset</Label>
                            <div className="flex flex-col items-center gap-4">
                                {imagePreview ? (
                                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 group">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="rounded-2xl h-12 w-12 shadow-2xl scale-75 group-hover:scale-100 transition-transform"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setFormData(prev => ({ ...prev, image: '' }));
                                                }}
                                            >
                                                <X className="h-6 w-6" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-white/10 rounded-[2rem] cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <div className="p-4 bg-white/5 rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                                                <Upload className="w-8 h-8 text-primary" />
                                            </div>
                                            <p className="mb-2 text-sm text-white/60">
                                                <span className="font-black uppercase tracking-widest text-[10px] text-primary">Upload Asset</span>
                                            </p>
                                            <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest">
                                                800x400 Dynamic Dimension
                                            </p>
                                        </div>
                                        <Input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex gap-4 pt-4 border-t border-white/5">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white h-14 rounded-2xl flex-1 px-0">
                            Cancel Protocol
                        </Button>
                        <Button type="submit" className="h-14 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl flex-1 px-0 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.02] transition-all">
                            Finalize Modification
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
