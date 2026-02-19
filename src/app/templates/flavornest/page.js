'use client';

import { useTemplateContext } from './templateContext.js'; // Import context
import { ProductCard } from './components.js';
import { Editable } from '@/components/editor/Editable'; // --- IMPORT EDITABLE ---
import { getLandingItems } from '@/lib/templates/templateLogic';

export default function FlavorNestPage() {
    
    // --- GET DATA FROM CONTEXT ---
    const { businessData, basePath } = useTemplateContext();
    if (!businessData) return <div>Loading...</div>; // Guard
    
    // Get the specific products listed in data.js
    const signatureProducts = getLandingItems(businessData, 6, businessData.menu.itemIDs);

    return (
        <main>
            <Editable focusId="hero">
                <section id="home" className="relative pt-16 md:pt-24 pb-16">
                    <div className="absolute inset-0 bg-brand-primary opacity-50"></div>
                    <div className="container mx-auto px-6 text-center relative">
                        <h2 className="text-4xl md:text-6xl font-bold text-brand-secondary leading-tight font-serif">{businessData.hero.title}</h2>
                        <p className="mt-4 text-lg max-w-2xl mx-auto">{businessData.hero.subtitle}</p>
                        <a href="#menu" className="mt-8 inline-block btn btn-primary px-8 py-3 rounded-full text-lg">{businessData.hero.cta}</a>
                    </div>
                </section>
            </Editable>

            <Editable focusId="about">
                <section id="about" className="py-16"> {/* <-- ID ADDED */}
                    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2 text-center md:text-left">
                            <h3 className="text-3xl font-bold text-brand-secondary font-serif">{businessData.about.title}</h3>
                            <p className="mt-4 leading-relaxed">{businessData.about.text}</p>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <img src={businessData.logo} alt={`${businessData.logoText} Logo Large`} className="h-48 w-48 rounded-full shadow-xl border-4 border-white" />
                        </div>
                    </div>
                </section>
            </Editable>

            {/* This section now correctly uses the signatureProducts list */}
            <Editable focusId="menu">
                <section id="menu" className="py-16 bg-brand-primary"> {/* <-- ID ADDED */}
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-brand-secondary mb-12 font-serif">{businessData.menu.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {signatureProducts.map(item => (
                                <ProductCard 
                                    key={item.id} 
                                    item={item} 
                                />
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <a href={`${basePath}/shop`} className="mt-8 inline-block btn btn-primary px-8 py-3 rounded-full text-lg">
                                {businessData.menu?.cta || "View All Products"}
                            </a>
                        </div>
                    </div>
                </section>
            </Editable>

            <Editable focusId="reviews">
                <section id="reviews" className="py-16"> {/* <-- ID ADDED */}
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-brand-secondary mb-12 font-serif">{businessData.reviews.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {businessData.reviews.items.map((review, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-brand-primary">
                                    <p className="italic">"{review.text}"</p>
                                    <p className="mt-4 font-bold text-brand-secondary text-right">- {review.author}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </Editable>
        </main>
    );
}