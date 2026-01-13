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
        <div className="bg-white">
            
           {/* --- HERO SECTION --- */}
           <Editable focusId="hero">
                <section className="relative w-full pb-20">
                    <div className="h-4 bg-[var(--color-primary)] w-full opacity-10"></div>
                    <div className="container mx-auto px-6 pt-12 relative max-w-screen-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[600px]">
                            <div className="hidden lg:block lg:col-span-5 h-[80%] self-end relative z-0">
                                <img src={businessData.hero.image1} className="w-full h-full object-cover" alt="Macarons" />
                            </div>
                            <div className="relative lg:absolute top-0 lg:top-[20%] left-0 lg:left-1/2 lg:-translate-x-1/2 z-20 bg-white p-12 text-center shadow-xl max-w-md w-full mx-auto my-8 lg:my-0">
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
                            <div className="hidden lg:block lg:col-span-6 lg:col-start-7 h-[70%] relative z-0">
                                <img src={businessData.hero.image2} className="w-full h-full object-cover" alt="" />
                            </div>
                            {/* Mobile Image Fallback */}
                             <div className="block lg:hidden w-full h-64 overflow-hidden mt-4">
                                <img src={businessData.hero.image1} className="w-full h-full object-cover" alt="Macarons" />
                            </div>
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- ABOUT SECTION --- */}
            <Editable focusId="about">
                <section className="bg-[var(--color-primary)] py-20 relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10 max-w-screen-2xl">
                        <div className="bg-white rounded-tl-[80px] p-0 overflow-hidden flex flex-col md:flex-row max-w-4xl mx-auto shadow-2xl">
                            <div className="md:w-1/3 h-[400px] md:h-auto">
                                <img src={businessData.about.image} className="w-full h-full object-cover rounded-br-[80px]" alt="Baker" />
                            </div>
                            <div className="md:w-1/2 p-12 flex flex-col justify-center">
                                <h2 className="text-4xl font-serif text-[var(--color-primary)] mb-6">{businessData.about.title}</h2>
                                <p className="text-sm text-gray-600 leading-7 mb-6">{businessData.about.text}</p>
                                <p className="text-sm font-bold italic text-[var(--color-primary)]">{businessData.about.subtext}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- SPECIALTIES --- */}
            <Editable focusId="specialties">
                <section className="py-24 bg-[var(--color-primary)] text-white relative">
                    <div className="container mx-auto px-6 max-w-screen-2xl">
                        <h2 className="text-4xl font-serif text-center mb-16 text-white">{businessData.specialties.title}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
                <section className="py-24 pt-32 bg-[#fff]">
                    <div className="container mx-auto px-6 max-w-screen-2xl">
                        <h2 className="text-4xl font-serif text-[var(--color-primary)] text-center mb-12">{businessData.gallery.title}</h2>
                        
                        {/* Grid of Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {(businessData.gallery.items || []).map((item) => (
                                <ProductCard key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Explore Full Collection Button */}
                        <div className="mt-16 text-center">
                            <Link 
                                href="/templates/frostify/shop"
                                className="inline-block bg-[var(--color-secondary)] text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-primary)] transition-all shadow-lg transform hover:scale-105"
                            >
                                 Explore Full Collection  
                            </Link>
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- TESTIMONIALS (UPDATED UI) --- */}
            <Editable focusId="testimonials">
                <section className="py-24 bg-[#F9F4F6] border-t border-white">
                    <div className="container mx-auto px-6 max-w-screen-2xl">
                        <div className="text-center mb-16">
                            <span className="text-[var(--color-secondary)] text-xs font-bold uppercase tracking-[0.2em]">What People Are Saying</span>
                            <h2 className="text-4xl font-serif text-[var(--color-primary)] mt-3">{businessData.testimonials.title}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {businessData.testimonials.items.map((testimonial, index) => (
                                <div key={index} className="bg-white p-8 rounded-tl-[40px] rounded-br-[40px] shadow-sm hover:shadow-md transition-shadow relative">
                                    <div className="absolute -top-4 -right-4 w-10 h-10 bg-[var(--color-secondary)] rounded-full flex items-center justify-center">
                                        <span className="text-white text-2xl font-serif">”</span>
                                    </div>
                                    
                                    <div className="flex gap-1 mb-4">
                                        {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-[var(--color-accent)] text-[var(--color-accent)]" />)}
                                    </div>

                                    <p className="text-[var(--color-primary)] leading-relaxed italic mb-6">
                                        "{testimonial.text}"
                                    </p>

                                    <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                                        <img 
                                            src={testimonial.image} 
                                            alt={testimonial.author} 
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="font-bold text-sm text-[var(--color-primary)] uppercase tracking-wider">{testimonial.author}</h4>
                                            <span className="text-xs text-gray-400">Happy Customer</span>
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
                <section className="py-20 bg-white border-t border-purple-100">
                    <div className="container mx-auto px-6 max-w-screen-2xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif text-[var(--color-primary)]">{businessData.faq.title}</h2>
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