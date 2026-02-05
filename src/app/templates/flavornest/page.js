'use client';
import { useTemplateContext } from './templateContext.js';
import {
    BlogCard,
    ProductCard,
    FeatureCard
} from './components.js';
import Link from 'next/link';
import { Editable } from '@/components/editor/Editable';
import { getLandingItems, getBestSellerItems } from '@/lib/templates/templateLogic';

export default function FlavornestPage() {
    
    const { businessData } = useTemplateContext();

    if (!businessData || !businessData.hero) {
        return <div>Loading preview...</div>;
    }

    // --- Dynamic Content ---
    const collectionItems = getLandingItems(businessData, 4);
    const bestSellerItems = getBestSellerItems(businessData, 4);

    return (
        <main className="w-full overflow-x-hidden font-sans text-brand-text bg-brand-bg">
            {/* --- Hero --- */}
            <Editable focusId="hero">
                <section id="home" className="relative pt-24 pb-12 md:pt-32 md:pb-20">
                    <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="text-center md:text-left z-10 order-2 md:order-1">
                            <span className="text-brand-primary font-bold tracking-wider uppercase text-sm mb-4 block">
                                {businessData.hero.subtitle}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                                {businessData.hero.title}
                            </h1>
                            <div className="flex gap-4 justify-center md:justify-start">
                                <Link href="/templates/flavornest/shop" className="bg-brand-primary text-white px-8 py-4 rounded-full font-bold hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/20">
                                    {businessData.hero.cta}
                                </Link>
                            </div>
                        </div>
                        <div className="relative order-1 md:order-2">
                            <div className="absolute inset-0 bg-brand-secondary/10 rounded-full blur-3xl transform scale-90"></div>
                            <img src={businessData.hero.image} alt="Hero Dish" className="relative w-full max-w-lg mx-auto md:max-w-xl animate-float drop-shadow-2xl" />
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- Features --- */}
            <section className="py-12 bg-white/50">
                <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {businessData.features.map((feature, i) => (
                        <FeatureCard key={i} feature={feature} />
                    ))}
                </div>
            </section>

            {/* --- Collection (Featured) --- */}
            <Editable focusId="collection">
                <section id="menu" className="py-16 md:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12">
                            <span className="text-brand-primary font-bold uppercase tracking-wider text-sm">Discover</span>
                            <h2 className="text-4xl font-bold mt-2">{businessData.featured.title}</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {collectionItems.map((item) => {
                                const isCategory = item.type === 'category';
                                const href = isCategory
                                    ? `/templates/flavornest/shop?category=${item.id}`
                                    : `/templates/flavornest/product/${item.id}`;
                                const btnText = isCategory ? 'View All' : 'Order Now';

                                return (
                                    <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                        <div className="h-48 rounded-2xl overflow-hidden mb-4 relative bg-gray-50">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className={`w-full h-full object-cover ${item.isOOS ? 'grayscale opacity-60' : ''}`}
                                            />
                                            {item.isOOS && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">SOLD OUT</span>}
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                                            {!isCategory && <p className="text-brand-primary font-bold mb-4">${item.price.toFixed(2)}</p>}
                                            <Link href={href} className="block w-full py-2 rounded-xl bg-brand-bg text-brand-text font-bold text-sm hover:bg-brand-primary hover:text-white transition-colors">
                                                {btnText}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- About --- */}
            <Editable focusId="about">
                <section id="about" className="py-16 md:py-24 bg-brand-primary text-white overflow-hidden">
                    <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <div className="absolute -inset-4 border-2 border-white/20 rounded-3xl transform rotate-3"></div>
                            <img src={businessData.about.largeImage} alt="Chef" className="relative rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 w-full" />
                        </div>
                        <div>
                            <span className="text-brand-secondary font-bold uppercase tracking-wider text-sm mb-2 block">{businessData.about.heading}</span>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Traditional Flavors,<br/>Modern Twist</h2>
                            <p className="text-white/80 text-lg mb-8 leading-relaxed">
                                {businessData.about.statement}
                            </p>
                            <Link href="/templates/flavornest/about" className="inline-block bg-white text-brand-primary px-8 py-3 rounded-full font-bold hover:bg-brand-secondary hover:text-white transition-colors">
                                Read Our Story
                            </Link>
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- Best Sellers (Popular) --- */}
            <Editable focusId="collection">
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <span className="text-brand-primary font-bold uppercase tracking-wider text-sm">Popular</span>
                                <h2 className="text-3xl font-bold mt-2">Customer Favorites</h2>
                            </div>
                            <Link href="/templates/flavornest/shop" className="text-brand-primary font-bold hover:text-brand-secondary transition-colors">
                                See Full Menu →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {bestSellerItems.map((item) => (
                                <ProductCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </section>
            </Editable>
        </main>
    );
}
