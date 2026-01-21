'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
        title: 'Summer Collection 2026',
        subtitle: 'Discover the latest trends in fashion.',
        cta: 'Shop Now',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop',
        title: 'Elegance Redefined',
        subtitle: 'Premium quality for the modern lifestyle.',
        cta: 'View Collection',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop',
        title: 'Urban Streetwear',
        subtitle: 'Express yourself with our unique styles.',
        cta: 'Explore',
    },
];

export function Hero() {
    return (
        <section className="relative h-[80vh] w-full bg-black overflow-hidden">
            <Swiper
                spaceBetween={0}
                effect={'fade'}
                speed={1000}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                className="h-full w-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id} className="relative h-full w-full">
                        <div className="absolute inset-0 bg-black/40 z-10" />
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="relative h-full w-full"
                        >
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover"
                                priority={slide.id === 1}
                            />
                        </motion.div>

                        <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
                            <div className="container px-4">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.8 }}
                                >
                                    <h2 className="text-xl md:text-2xl font-medium text-white/90 mb-4 tracking-widest uppercase">
                                        {slide.subtitle}
                                    </h2>
                                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                                        <span className="text-gradient">{slide.title}</span>
                                    </h1>
                                    <Button
                                        size="lg"
                                        className="rounded-full px-10 py-8 text-xl bg-primary text-white hover:bg-primary/90 hover:scale-110 transition-all duration-500 border-none shadow-[0_0_20px_rgba(139,92,246,0.3)] group"
                                        asChild
                                    >
                                        <Link href="/products">
                                            {slide.cta} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
