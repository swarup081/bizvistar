'use client';
import { useTemplateContext } from './templateContext.js';
import { 
    BlogCard,
    ProductCard
} from './components.js';
import Link from 'next/link';
import { Editable } from '@/components/editor/Editable';
import { getLandingItems } from '@/lib/templates/templateLogic';

export default function BlisslyPage() {
    
    const { businessData } = useTemplateContext();

    if (!businessData || !businessData.hero) {
        return <div>Loading preview...</div>;
    }

    // --- Dynamic Content ---
    const featuredItems = getLandingItems(businessData, 3);

    return (
        <main className="w-full overflow-x-hidden font-sans">
            {/* --- Hero --- */}
            <Editable focusId="hero">
                <section id="home" className="relative h-[80vh] md:h-screen w-full overflow-hidden bg-brand-bg">
                    <div className="absolute inset-0">
                        <img src={businessData.hero.image} alt="Hero" className="w-full h-full object-cover opacity-90" />
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                    <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex flex-col justify-center items-center text-center">
                        <h1 className="text-[10vw] md:text-7xl font-serif font-bold text-white mb-4 md:mb-6">{businessData.hero.title}</h1>
                        <p className="text-[4vw] md:text-xl text-white/90 max-w-lg mb-8 md:mb-10 font-light">{businessData.hero.subtitle}</p>
                        <Link href="/templates/blissly/shop" className="bg-white text-brand-text px-8 py-3 rounded-full font-medium text-sm md:text-base uppercase tracking-wider hover:bg-gray-100 transition-colors">
                            {businessData.hero.cta}
                        </Link>
                    </div>
                </section>
            </Editable>

            {/* --- Features --- */}
            <section className="py-12 md:py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {businessData.features.map((feature, i) => (
                        <div key={i} className="text-center p-6 bg-brand-bg/50 rounded-2xl">
                            <h3 className="text-xl font-serif font-bold mb-2">{feature.title}</h3>
                            <p className="text-brand-text/70">{feature.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- Collection (Featured) --- */}
            <Editable focusId="collection">
                <section id="collection" className="py-12 md:py-24 bg-brand-bg">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-[8vw] md:text-5xl font-serif font-bold text-brand-text">{businessData.featured.title}</h2>
                            <p className="text-brand-text/60 mt-4 max-w-xl mx-auto">{businessData.featured.sectionHeading}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                            {featuredItems.map((item) => {
                                const isCategory = item.type === 'category';
                                const href = isCategory
                                    ? `/templates/blissly/shop?category=${item.id}`
                                    : `/templates/blissly/product/${item.id}`;
                                const btnText = isCategory ? 'View Collection' : 'Shop Now';

                                return (
                                    <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="aspect-[3/4] overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${item.isOOS ? 'grayscale opacity-70' : ''}`}
                                            />
                                            {item.isOOS && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">OOS</span>}
                                        </div>
                                        <div className="p-4 text-center">
                                            <h3 className="font-serif font-bold text-lg mb-1">{item.name}</h3>
                                            {!isCategory && <p className="text-sm text-gray-500 mb-3">${item.price.toFixed(2)}</p>}
                                            <Link href={href} className="inline-block text-xs font-bold uppercase tracking-widest border-b border-brand-text pb-0.5 hover:opacity-70">
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
                <section id="about" className="py-12 md:py-24 bg-white overflow-hidden">
                    <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">{businessData.about.heading}</h2>
                            <div className="text-lg text-brand-text/80 space-y-4 font-light">
                                <p>{businessData.about.statement}</p>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <img src={businessData.about.largeImage} alt="About Us" className="w-full h-[400px] object-cover rounded-3xl" />
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- Blog --- */}
            <Editable focusId="blog">
                <section className="py-12 md:py-24 bg-brand-bg">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="text-4xl font-serif font-bold text-center mb-12">{businessData.blog.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {businessData.blog.items.map((post, i) => (
                                <BlogCard key={i} post={post} />
                            ))}
                        </div>
                    </div>
                </section>
            </Editable>
        </main>
    );
}
