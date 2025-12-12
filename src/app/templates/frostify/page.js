'use client';
import { useTemplateContext } from './templateContext.js';
import { SpecialtyCard, FAQItem, WavySeparatorBottom } from './components.js';
import Link from 'next/link';
import { Editable } from '@/components/editor/Editable';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FrostifyPage() {
    const { businessData } = useTemplateContext();

    if (!businessData) return <div>Loading...</div>;

    return (
        <div className="bg-white">
            
           {/* --- HERO SECTION (Matches Image 1) --- */}
           <Editable focusId="hero">
                <section className="relative w-full pb-20">
                    {/* Purple Banner Top */}
                    <div className="h-4 bg-[var(--color-primary)] w-full opacity-10"></div>
                    
                    <div className="container mx-auto px-6 pt-12 relative">
                        {/* Grid Layout for Images & Text */}
                        <div className="grid grid-cols-12 gap-4 h-[600px]">
                            
                            {/* Left Image (Macarons) - Spans 5 cols */}
                            <div className="col-span-5 h-[80%] self-end relative z-0">
                                <img 
                                    src={businessData.hero.image1} 
                                    className="w-full h-full object-cover"
                                    alt="Macarons"
                                />
                            </div>

                            {/* Center Text Box (Floating) */}
                            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 z-20 bg-white p-12 text-center shadow-xl max-w-md w-full">
                                <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-primary)] leading-tight mb-6">
                                    {businessData.hero.title}
                                </h1>
                                <p className="text-sm font-medium text-gray-600 mb-8 leading-relaxed">
                                    {businessData.hero.subtitle}
                                </p>
                                <Link 
                                    href="/templates/frostify/menu" 
                                    className="inline-block bg-[var(--color-secondary)] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-primary)] transition-colors"
                                >
                                    {businessData.hero.cta}
                                </Link>
                            </div>

                            {/* Right Image (Cake) - Spans 6 cols, offset */}
                            <div className="col-span-6 col-start-7 h-[70%] relative z-0">
                                <img 
                                    src={businessData.hero.image2} 
                                    className="w-full h-full object-cover"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- ABOUT SECTION ("Meet Johanna") --- */}
            <Editable focusId="about">
                <section className="bg-[var(--color-primary)] py-20 relative overflow-hidden">
                    {/* Background Block */}
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="bg-white  rounded-tl-[80px] p-0 overflow-hidden flex flex-col md:flex-row max-w-4xl mx-auto shadow-2xl">
                            {/* Left Image */}
                            <div className="md:w-1/3 h-[400px] md:h-auto">
                                <img 
                                    src={businessData.about.image} 
                                    className="w-full h-full object-cover rounded-br-[80px]" 
                                    alt="Baker"
                                />
                            </div>
                            {/* Right Text */}
                            <div className="md:w-1/2 p-12 flex flex-col justify-center">
                                <h2 className="text-4xl font-serif text-[var(--color-primary)] mb-6">
                                    {businessData.about.title}
                                </h2>
                                <p className="text-sm text-gray-600 leading-7 mb-6">
                                    {businessData.about.text}
                                </p>
                                <p className="text-sm font-bold italic text-[var(--color-primary)]">
                                    {businessData.about.subtext}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- SPECIALTIES (Rounded Tombstone Cards) --- */}
            <Editable focusId="specialties">
                <section className="py-24 bg-[var(--color-primary)] text-white relative">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-serif text-center mb-16 text-white">{businessData.specialties.title}</h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                          <SpecialtyCard title="Custom Cakes" shapeClass="rounded-r-full rounded-tl-full" />
                          <SpecialtyCard title="Baked Pastries" shapeClass="rounded-t-full " />

                          <SpecialtyCard title="Baked Pastries" shapeClass=" rounded-br-[100px] " />
                          <SpecialtyCard title="Baked Pastries" shapeClass="rounded-l-full " />

                        </div>
                    </div>
                    
                    {/* Bottom Wavy Separator (Transition to Gallery) */}
                    <div className="absolute bottom-0 left-0 w-full translate-y-[99%] text-[var(--color-primary)]">
                        <WavySeparatorBottom fill="currentColor" />
                    </div>
                </section>
            </Editable>

            {/* --- GALLERY STRIP --- */}
            <Editable focusId="gallery">
                <section className="py-12 pb-24 mt-12">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-4 gap-4">
                            {businessData.gallery.images.map((img, i) => (
                                <div key={i} className="aspect-square rounded-2xl overflow-hidden">
                                    <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- FAQ SECTION --- */}
            <Editable focusId="faq">
                <section className="py-20 bg-white border-t border-purple-100">
                    <div className="container mx-auto px-6 max-w-3xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif text-[var(--color-primary)]">{businessData.faq.title}</h2>
                        </div>
                        {businessData.faq.questions.map((q, i) => (
                            <FAQItem key={i} question={q.q} answer={q.a} />
                        ))}
                    </div>
                </section>
            </Editable>

            {/* --- TESTIMONIALS (Carousel Style from Image 3) --- */}
            <Editable focusId="testimonials">
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <div className="flex flex-col md:flex-row items-center gap-12 bg-white border border-gray-100 p-8 shadow-sm">
                            <div className="w-full md:w-1/2">
                                <img src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800" className="w-full h-auto object-cover" />
                            </div>
                            <div className="w-full md:w-1/2">
                                <p className="text-xl font-serif text-[var(--color-primary)] leading-relaxed mb-6">
                                    "The chocolate croissants here are the best I've ever had!"
                                </p>
                                <p className="font-bold text-sm uppercase tracking-widest text-gray-500">- Sarah M.</p>
                                <div className="flex gap-4 mt-8">
                                    <ArrowRight className="text-[var(--color-primary)] w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Editable>

        </div>
    );
}