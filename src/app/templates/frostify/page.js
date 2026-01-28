'use client';
import { useTemplateContext } from './templateContext.js';
import { SpecialtyCard, FAQItem, WavySeparatorBottom, ProductCard } from './components.js';
import Link from 'next/link';
import { Editable } from '@/components/editor/Editable';
import { ArrowRight, Star } from 'lucide-react';

export default function FrostifyPage() {
    const { businessData } = useTemplateContext();

    if (!businessData) return <div>Loading...</div>;

    return (
        <div className="bg-white w-full max-w-full overflow-hidden overflow-x-hidden">
            
           {/* --- HERO SECTION --- */}
           <Editable focusId="hero">
                <section className="relative w-full pb-8 md:pb-20">
                    <div className="h-2 md:h-4 bg-[var(--color-primary)] w-full opacity-10"></div>
                    <div className="container mx-auto px-6 pt-6 md:pt-12 relative">
                        {/* Mobile Optimized Hero: Flex Row Side-by-Side (Shrink) */}
                        <div className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 h-auto md:h-[600px] items-center">

                            {/* Image 1 */}
                            <div className="col-span-1 md:col-span-5 h-[40vw] md:h-[80%] self-end relative z-0 order-1 md:order-1">
                                <img src={businessData.hero.image1} className="w-full h-full object-cover rounded-lg md:rounded-none" alt="Macarons" />
                            </div>

                            {/* Center Text (Absolute on desktop, relative on mobile) */}
                            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 z-20 bg-white p-4 md:p-12 text-center shadow-xl max-w-md w-[90%] md:w-full hidden md:block">
                                <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-primary)] leading-tight mb-6">
                                    {businessData.hero.title}
                                </h1>
                                <p className="text-sm font-medium text-gray-600 mb-8 leading-relaxed">
                                    {businessData.hero.subtitle}
                                </p>
                                <Link href="/templates/frostify/shop" className="inline-block bg-[var(--color-secondary)] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-primary)] transition-colors">
                                    {businessData.hero.cta}
                                </Link>
                            </div>

                             {/* Mobile Text Block (Simplified) */}
                            <div className="col-span-2 md:hidden order-3 text-center py-4 bg-white/90 backdrop-blur-sm rounded-xl mt-4 border border-[var(--color-primary)]/10">
                                <h1 className="text-[6vw] font-serif text-[var(--color-primary)] leading-tight mb-2">
                                    {businessData.hero.title}
                                </h1>
                                <p className="text-[2.5vw] font-medium text-gray-600 mb-4 leading-relaxed px-4">
                                    {businessData.hero.subtitle}
                                </p>
                                <Link href="/templates/frostify/shop" className="inline-block bg-[var(--color-secondary)] text-white px-6 py-2 rounded-full text-[2.5vw] font-bold uppercase tracking-widest hover:bg-[var(--color-primary)] transition-colors">
                                    {businessData.hero.cta}
                                </Link>
                            </div>

                            {/* Image 2 */}
                            <div className="col-span-1 md:col-span-6 md:col-start-7 h-[40vw] md:h-[70%] relative z-0 order-2 md:order-3">
                                <img src={businessData.hero.image2} className="w-full h-full object-cover rounded-lg md:rounded-none" alt="" />
                            </div>
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- ABOUT SECTION --- */}
            <Editable focusId="about">
                <section className="bg-[var(--color-primary)] py-10 md:py-20 relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="bg-white rounded-tl-[40px] md:rounded-tl-[80px] p-0 overflow-hidden flex flex-row md:flex-row max-w-4xl mx-auto shadow-2xl">
                            <div className="w-1/2 md:w-1/3 h-auto">
                                <img src={businessData.about.image} className="w-full h-full object-cover rounded-br-[40px] md:rounded-br-[80px]" alt="Baker" />
                            </div>
                            <div className="w-1/2 md:w-1/2 p-4 md:p-12 flex flex-col justify-center">
                                <h2 className="text-[5vw] md:text-4xl font-serif text-[var(--color-primary)] mb-2 md:mb-6 leading-tight">{businessData.about.title}</h2>
                                <p className="text-[2.5vw] md:text-sm text-gray-600 leading-tight md:leading-7 mb-2 md:mb-6">{businessData.about.text}</p>
                                <p className="text-[2.5vw] md:text-sm font-bold italic text-[var(--color-primary)]">{businessData.about.subtext}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- SPECIALTIES --- */}
            <Editable focusId="specialties">
                <section className="py-12 md:py-24 bg-[var(--color-primary)] text-white relative">
                    <div className="container mx-auto px-6">
                        <h2 className="text-[6vw] md:text-4xl font-serif text-center mb-8 md:mb-16 text-white">{businessData.specialties.title}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto">
                          <SpecialtyCard title="Custom Cakes" shapeClass="rounded-r-full rounded-tl-full" />
                          <SpecialtyCard title="Baked Pastries" shapeClass="rounded-t-full " />
                          <SpecialtyCard title="Homemade Cookies" shapeClass="rounded-br-[100px]" />
                          <SpecialtyCard title="Artisan Breads" shapeClass="rounded-l-full" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full translate-y-[99%] text-[var(--color-primary)]">
                        <WavySeparatorBottom fill="currentColor" />
                    </div>
                </section>
            </Editable>

            {/* --- GALLERY STRIP with Product Cards --- */}
            <Editable focusId="gallery">
                <section className="py-12 pt-20 md:py-24 md:pt-32 bg-[#fff]">
                    <div className="container mx-auto px-6">
                        <h2 className="text-[6vw] md:text-4xl font-serif text-[var(--color-primary)] text-center mb-6 md:mb-12">{businessData.gallery.title}</h2>
                        
                        {/* Grid of Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                            {(businessData.gallery.items || []).map((item) => (
                                <ProductCard key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Explore Full Collection Button */}
                        <div className="mt-8 md:mt-16 text-center">
                            <Link 
                                href="/templates/frostify/shop"
                                className="inline-block bg-[var(--color-secondary)] text-white px-6 py-3 md:px-10 md:py-4 rounded-full text-[2.5vw] md:text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-primary)] transition-all shadow-lg transform hover:scale-105"
                            >
                                 Explore Full Collection  
                            </Link>
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- TESTIMONIALS (UPDATED UI) --- */}
            <Editable focusId="testimonials">
                <section className="py-12 md:py-24 bg-[#F9F4F6] border-t border-white">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center mb-8 md:mb-16">
                            <span className="text-[var(--color-secondary)] text-[2.5vw] md:text-xs font-bold uppercase tracking-[0.2em]">What People Are Saying</span>
                            <h2 className="text-[6vw] md:text-4xl font-serif text-[var(--color-primary)] mt-2 md:mt-3">{businessData.testimonials.title}</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                            {businessData.testimonials.items.map((testimonial, index) => (
                                <div key={index} className="bg-white p-4 md:p-8 rounded-tl-[20px] rounded-br-[20px] md:rounded-tl-[40px] md:rounded-br-[40px] shadow-sm hover:shadow-md transition-shadow relative">
                                    <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-6 h-6 md:w-10 md:h-10 bg-[var(--color-secondary)] rounded-full flex items-center justify-center">
                                        <span className="text-white text-lg md:text-2xl font-serif">”</span>
                                    </div>
                                    
                                    <div className="flex gap-1 mb-2 md:mb-4">
                                        {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-[var(--color-accent)] text-[var(--color-accent)] md:w-[14px] md:h-[14px]" />)}
                                    </div>

                                    <p className="text-[var(--color-primary)] text-[2.5vw] md:text-base leading-tight md:leading-relaxed italic mb-4 md:mb-6 line-clamp-4">
                                        "{testimonial.text}"
                                    </p>

                                    <div className="flex items-center gap-2 md:gap-4 border-t border-gray-100 pt-4 md:pt-6">
                                        <img 
                                            src={testimonial.image} 
                                            alt={testimonial.author} 
                                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                                        />
                                        <div className="overflow-hidden">
                                            <h4 className="font-bold text-[2vw] md:text-sm text-[var(--color-primary)] uppercase tracking-wider truncate">{testimonial.author}</h4>
                                            <span className="text-[1.8vw] md:text-xs text-gray-400">Happy Customer</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- FAQ SECTION --- */}
            <Editable focusId="faq">
                <section className="py-10 md:py-20 bg-white border-t border-purple-100">
                    <div className="container mx-auto px-6 max-w-3xl">
                        <div className="text-center mb-8 md:mb-12">
                            <h2 className="text-[6vw] md:text-3xl font-serif text-[var(--color-primary)]">{businessData.faq.title}</h2>
                        </div>
                        {businessData.faq.questions.map((q, i) => (
                            <FAQItem key={i} question={q.q} answer={q.a} />
                        ))}
                    </div>
                </section>
            </Editable>

        </div>
    );
}