import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-secondary/50 border-t mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">THE SHOP<span className="text-primary">.</span></h3>
                        <p className="text-muted-foreground text-sm">
                            Your premium destination for quality products. Experience excellence in every purchase.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/products" className="hover:text-primary transition-colors">Products</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/profile" className="hover:text-primary transition-colors">My Account</Link></li>
                            <li><Link href="/orders" className="hover:text-primary transition-colors">Order History</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Connect With Us</h4>
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
                    <p>&copy; {new Date().getFullYear()} The Shop. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-foreground">Terms</Link>
                        <Link href="#" className="hover:text-foreground">Privacy</Link>
                        <Link href="#" className="hover:text-foreground">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
