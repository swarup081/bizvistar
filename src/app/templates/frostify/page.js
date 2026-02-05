'use client';
import { useTemplateContext } from './templateContext.js';
import { ProductCard } from './components.js';
import Link from 'next/link';
import { Editable } from '@/components/editor/Editable';
import { getLandingItems } from '@/lib/templates/templateLogic';

export default function FrostifyPage() {
    const { businessData } = useTemplateContext();

    if (!businessData || !businessData.hero) {
        return <div>Loading preview...</div>;
    }

    const featuredItems = getLandingItems(businessData, 3);

    return (
        <main className="w-full overflow-x-hidden font-sans bg-brand-bg text-brand-text">
            {/* --- Hero --- */}
            <Editable focusId="hero">
                <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 container mx-auto text-center">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 uppercase leading-none transform -rotate-1">
                        {businessData.hero.title}
                    </h1>
                    <p className="text-lg md:text-2xl font-medium max-w-2xl mx-auto mb-10 opacity-80">
                        {businessData.hero.subtitle}
                    </p>
                    <div className="relative inline-block group">
                        <div className="absolute inset-0 bg-black translate-y-2 translate-x-2 rounded-xl transition-transform group-hover:translate-y-3 group-hover:translate-x-3"></div>
                        <Link href="/templates/frostify/shop" className="relative block bg-brand-secondary text-white border-2 border-black px-8 py-4 text-xl font-bold rounded-xl uppercase tracking-wide hover:-translate-y-1 hover:-translate-x-1 transition-transform">
                            {businessData.hero.cta}
                        </Link>
                    </div>
                    <div className="mt-16 relative">
                        <img src={businessData.hero.image} alt="Hero" className="w-full max-w-4xl mx-auto rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
                    </div>
                </section>
            </Editable>

            {/* --- Collection --- */}
            <Editable focusId="collection">
                <section className="py-20 border-t-4 border-black bg-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-6xl font-black uppercase mb-16 text-center">{businessData.featured.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredItems.map((item, idx) => {
                                const isCategory = item.type === 'category';
                                const href = isCategory
                                    ? `/templates/frostify/shop?category=${item.id}`
                                    : `/templates/frostify/product/${item.id}`;
                                const btnText = isCategory ? 'Explore' : 'Buy Now';

                                return (
                                    <div key={item.id} className="bg-brand-bg rounded-2xl border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                                        <div className="aspect-square rounded-xl border-2 border-black overflow-hidden mb-4 bg-white relative">
                                            <img src={item.image} alt={item.name} className={`w-full h-full object-cover ${item.isOOS ? 'grayscale opacity-50' : ''}`} />
                                            {item.isOOS && <span className="absolute top-2 right-2 bg-red-500 text-white font-black text-xs px-2 py-1 border-2 border-black">SOLD OUT</span>}
                                        </div>
                                        <h3 className="text-2xl font-black uppercase mb-1 truncate">{item.name}</h3>
                                        {!isCategory && <p className="font-bold text-xl mb-4">${item.price.toFixed(2)}</p>}
                                        <Link href={href} className="block w-full bg-black text-white text-center py-3 font-bold uppercase rounded-lg hover:bg-brand-secondary transition-colors">
                                            {btnText}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- About (Marquee Style) --- */}
            <Editable focusId="about">
                <section className="py-12 bg-brand-secondary border-y-4 border-black overflow-hidden">
                    <div className="whitespace-nowrap flex marquee">
                        {[...Array(10)].map((_, i) => (
                            <span key={i} className="text-4xl md:text-6xl font-black uppercase text-white mx-8">
                                {businessData.about.heading} <span className="text-black stroke-text">///</span>
                            </span>
                        ))}
                    </div>
                </section>
            </Editable>
        </main>
    );
}
