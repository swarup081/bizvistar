'use client';
import { useTemplateContext } from './templateContext.js';
import { ProductCard } from './components.js';
import Link from 'next/link';
import { Editable } from '@/components/editor/Editable';
import { getLandingItems } from '@/lib/templates/templateLogic';

export default function AuroraPage() {
    const { businessData } = useTemplateContext();

    if (!businessData || !businessData.hero) {
        return <div>Loading preview...</div>;
    }

    const featuredItems = getLandingItems(businessData, 3);

    return (
        <main className="w-full overflow-x-hidden font-sans bg-brand-bg text-brand-text">
            {/* --- Hero --- */}
            <Editable focusId="hero">
                <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img src={businessData.hero.image} alt="Hero" className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-bg"></div>
                    </div>
                    <div className="relative z-10 text-center px-4">
                        <h1 className="text-6xl md:text-8xl font-thin tracking-widest mb-6 text-white drop-shadow-lg font-serif">
                            {businessData.hero.title}
                        </h1>
                        <p className="text-xl md:text-2xl font-light text-white/80 max-w-2xl mx-auto mb-10 tracking-wide">
                            {businessData.hero.subtitle}
                        </p>
                        <Link href="/templates/aurora/shop" className="inline-block border border-white/50 text-white px-10 py-4 text-sm uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500">
                            {businessData.hero.cta}
                        </Link>
                    </div>
                </section>
            </Editable>

            {/* --- Collection --- */}
            <Editable focusId="collection">
                <section className="py-32 container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-brand-text/10 pb-8">
                        <h2 className="text-4xl font-serif italic text-brand-text">{businessData.featured.title}</h2>
                        <Link href="/templates/aurora/shop" className="text-xs uppercase tracking-widest hover:text-brand-primary transition-colors mt-4 md:mt-0">
                            View All Collection
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {featuredItems.map((item) => {
                            const isCategory = item.type === 'category';
                            const href = isCategory
                                ? `/templates/aurora/shop?category=${item.id}`
                                : `/templates/aurora/product/${item.id}`;
                            const btnText = isCategory ? 'Discover' : 'Details';

                            return (
                                <div key={item.id} className="group cursor-pointer">
                                    <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 ${item.isOOS ? 'grayscale opacity-60' : ''}`}
                                        />
                                        {item.isOOS && <span className="absolute top-4 left-4 text-[10px] tracking-widest uppercase text-red-500">Unavailable</span>}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <Link href={href} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 transition-transform">
                                                →
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-serif mb-1">{item.name}</h3>
                                        {!isCategory && <p className="text-xs text-brand-text/60">${item.price.toFixed(2)}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </Editable>

            {/* --- About --- */}
            <Editable focusId="about">
                <section className="py-24 bg-brand-primary/5">
                    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="relative h-[600px]">
                            <img src={businessData.about.largeImage} alt="About" className="w-full h-full object-cover" />
                        </div>
                        <div className="pl-0 md:pl-12">
                            <span className="block text-xs uppercase tracking-widest mb-6 text-brand-text/50">— {businessData.about.heading}</span>
                            <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8 text-brand-text">{businessData.about.statement}</h2>
                            <p className="text-brand-text/70 font-light leading-relaxed mb-8">
                                We believe in the power of simplicity and the elegance of nature. Every piece is curated to bring tranquility and sophistication to your everyday life.
                            </p>
                        </div>
                    </div>
                </section>
            </Editable>
        </main>
    );
}
