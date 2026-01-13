'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
// --- IMPORT EDITABLE ---
import { Editable } from '@/components/editor/Editable';
import { useTemplateContext } from './templateContext.js'; // Import context
import { 
    ProductCard, 
    ArrowRightIcon, 
    ChevronLeftIcon, 
    ChevronRightIcon 
} from './components.js'; // Import new ProductCard and icons

// Helper: Get product details from the master list by their IDs
const getProductsByIds = (allProducts, ids) => {
    if (!allProducts || !ids) return [];
    return ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
};

// --- Main Page Component ---
export default function BrewhavenPage() {
    
    // --- GET DATA FROM CONTEXT ---
    const { businessData } = useTemplateContext();
    if (!businessData) return <div>Loading...</div>; // Guard
    
    // Get product objects for the specialty section
    const specialtyProducts = getProductsByIds(businessData.allProducts, businessData.specialty.itemIDs);
    
    // --- Testimonial Slider Logic ---
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const testimonials = businessData.testimonials.items;

    const prevTestimonial = () => {
        setCurrentTestimonial(current => (current === 0 ? testimonials.length - 1 : current - 1));
    };

    const nextTestimonial = () => {
        setCurrentTestimonial(current => (current === testimonials.length - 1 ? 0 : current + 1));
    };

    const goToTestimonial = (index) => {
        setCurrentTestimonial(index);
    };
    // --- End Testimonial Logic ---
    
    return (
        <main>
            {/* --- Hero Section --- */}
            <Editable focusId="hero">
                <section id="home" className="relative overflow-hidden bg-brand-primary">
                <div className="container mx-auto px-6 py-20 md:py-28 max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="flex flex-col gap-6 text-center md:text-left items-center md:items-start">
                    <h1 className="text-4xl md:text-6xl font-bold text-brand-text leading-tight">{businessData.hero.title}</h1>
                    <p className="text-base md:text-lg text-brand-text opacity-70 max-w-md">{businessData.hero.subtitle}</p>
                    <a 
                        href="#menu"
                        className="mt-4 inline-flex items-center gap-3 bg-brand-secondary text-brand-bg px-8 py-4 text-base font-medium tracking-wide rounded-lg hover:opacity-90 transition-all"
                    >
                        <span>{businessData.hero.cta}</span>
                    </a>
                    </div>
                    <div className="hidden md:flex justify-center">
                    <div className="w-full max-w-sm lg:max-w-md aspect-square overflow-hidden">
                        <img 
                        src={businessData.hero.image} 
                        alt="Hero Image" 
                        className="w-full h-full object-contain object-center"
                        />
                    </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
                    <svg className="relative block w-[calc(100%+1.3px)] h-24 md:h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,40 C150,90 350,0 600,60 C850,120 1050,20 1200,70 L1200,0 L0,0 Z" fill="currentColor" className="text-brand-bg"/>
                    </svg>
                </div>
                </section>
            </Editable>

            {/* --- Events Section --- */}
            <Editable focusId="events">
                <section id="events" className="py-24">
                    <div className="container mx-auto px-6 max-w-screen-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-brand-text text-center mb-16">{businessData.events.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {businessData.events.items.map((item, index) => (
                                <div key={index} className="bg-brand-primary rounded-lg overflow-hidden shadow-sm">
                                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover"/>
                                    <div className="p-8">
                                        <h3 className="text-2xl font-bold text-brand-text mb-3">{item.title}</h3>
                                        <p className="text-brand-text opacity-70 mb-5">{item.text}</p>
                                        <a href="#" className="font-semibold text-brand-secondary hover:text-brand-text transition-colors flex items-center">
                                            Read more <ArrowRightIcon />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- About Section --- */}
            <Editable focusId="about">
                <section id="about" className="py-24 bg-brand-primary relative">
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg className="relative block w-[calc(100%+1.3px)] h-24 md:h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,50 C100,90 200,10 300,50 C400,90 500,10 600,50 C700,90 800,10 900,50 C1000,90 1100,10 1200,50 L1200,0 L0,0 Z" fill="currentColor" className="text-brand-bg"/>
                    </svg>
                </div>
                <div className="container mx-auto py-14 max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="flex justify-center">
                        <img 
                            src={businessData.about.image} 
                            alt="Artisanal Roasting" 
                            className="w-full max-w-md lg:max-w-lg aspect-[4/5] object-cover rounded-t-full shadow-md"
                        />
                    </div>
                    <div className="md:pl-10 text-center md:text-left items-center md:items-start flex flex-col">
                        <h2 className="text-4xl md:text-5xl font-bold text-brand-text leading-tight"> {businessData.about.title}</h2>
                        <p className="text-lg text-brand-text opacity-70 mt-6 max-w-lg">{businessData.about.text}</p>
                        <div className="mt-8 space-y-6">
                            {businessData.about.features.map((feature, index) => (
                                <div key={index}>
                                    <h4 className="text-xl font-bold text-brand-text">{feature.title}</h4>
                                    <p className="text-brand-text opacity-70 mt-1">{feature.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
                    <svg className="relative block w-[calc(100%+1.3px)] h-24 md:h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,50 C100,90 200,10 300,50 C400,90 500,10 600,50 C700,90 800,10 900,50 C1000,90 1100,10 1200,50 L1200,0 L0,0 Z" fill="currentColor" className="text-brand-bg"/>
                    </svg>
                </div>
                </section>
            </Editable>

            {/* --- Menu Section --- */}
            <Editable focusId="menu">
                <section id="menu" className="py-24">
                    <div className="container mx-auto px-6 max-w-screen-2xl">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="inline-block bg-brand-primary text-brand-secondary text-sm font-semibold px-4 py-1 rounded-full mb-4">
                                {businessData.menu.badge}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-brand-text mb-4">{businessData.menu.title}</h2>
                            <p className="text-lg text-brand-text opacity-70">{businessData.menu.description}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
                            {businessData.menu.items.map((item, index) => (
                                <div key={index} className="py-4">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="text-2xl font-bold text-brand-text">{item.name}</h4>
                                        <span className="text-2xl font-bold text-brand-secondary">${item.price}</span>
                                    </div>
                                    <p className="text-brand-text opacity-70">{item.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <a href="/templates/blissly/shop" className="font-semibold text-brand-secondary text-lg hover:text-brand-text transition-colors flex items-center justify-center">
                                {businessData.menu.cta} <ArrowRightIcon />
                            </a>
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- Testimonials Section --- */}
            <Editable focusId="testimonials">
                <section id="testimonials" className="py-24 bg-brand-bg">
                    <div className="container mx-auto px-6 relative max-w-screen-2xl">
                        <div className="relative flex flex-col items-center max-w-3xl mx-auto">
                            <span className="font-serif text-9xl text-brand-text/80 leading-none -mb-4">”</span>
                            <motion.p 
                                key={currentTestimonial}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="text-3xl md:text-4xl text-brand-text text-center mt-6 min-h-[110px] md:min-h-[120px]"
                                style={{ fontFamily: 'var(--font-handwriting)' }}
                            >
                                {testimonials[currentTestimonial].quote}
                            </motion.p>
                            <div className="w-16 h-1 bg-brand-accent my-8"></div>
                            <div className="text-center font-sans">
                                <h5 className="text-lg font-bold text-brand-text">{testimonials[currentTestimonial].name}</h5>
                                <p className="text-sm text-brand-text/70 font-medium">{testimonials[currentTestimonial].title}</p>
                            </div>
                            <button onClick={prevTestimonial} className="absolute -left-4 md:-left-24 top-1/2 -translate-y-1/2 p-2" aria-label="Previous testimonial">
                                <ChevronLeftIcon />
                            </button>
                            <button onClick={nextTestimonial} className="absolute -right-4 md:-right-24 top-1/2 -translate-y-1/2 p-2" aria-label="Next testimonial">
                                <ChevronRightIcon />
                            </button>
                        </div>
                        <div className="flex justify-center gap-2 mt-12">
                            {testimonials.map((_, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => goToTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        currentTestimonial === index ? 'bg-brand-accent' : 'bg-brand-text/20 hover:bg-brand-text/40'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </Editable>
            
            {/* --- Specialty Section (NOW DYNAMIC) --- */}
            <Editable focusId="specialty">
                <section id="specialty" className="py-24">
                    <div className="container mx-auto px-6 text-center max-w-screen-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-brand-text mb-16">{businessData.specialty.title}</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {specialtyProducts.map((item) => (
                                <ProductCard 
                                    key={item.id} 
                                    item={item}
                                    templateName="blissly"
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- Final CTA --- */}
            <Editable focusId="cta">
                <section id="cta-final" className="py-24 bg-brand-primary">
                    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left max-w-screen-2xl">
                        <div>
                            <h2 className="text-4xl font-bold text-brand-text max-w-xl">{businessData.cta.title}</h2>
                            <p className="text-lg text-brand-text opacity-70 max-w-xl mt-4">{businessData.cta.text}</p>
                        </div>
                        <a 
                            href="#contact"
                            className="mt-8 md:mt-0 inline-flex flex-shrink-0 items-center gap-3 bg-brand-secondary text-brand-bg px-8 py-4 text-base font-medium tracking-wide rounded-lg hover:opacity-90 transition-all"
                        >
                            <span>{businessData.cta.cta}</span>
                        </a>
                    </div>
                </section>
            </Editable>
        </main>
    );
}