'use client';
import { useTemplateContext } from './templateContext.js';
import { ProductCard, FAQAccordion, InstagramFeed, TestimonialSlider, FeatureIcon, NewsletterCTA } from './components.js';
import Link from 'next/link';
import { Editable } from '@/components/editor/Editable';
import { Play, ArrowRight, ArrowDown } from 'lucide-react';

const getProductsByIds = (allProducts, ids) => {
    if (!allProducts || !ids) return [];
    return ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
};

// "Explore All" Rotating Button
const ExploreCircle = () => (
   <Link href="./aurora/shop">
      <div  className="relative w-32 h-32 flex items-center justify-center cursor-pointer group">
        <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
            <svg viewBox="0 0 100 100" width="100%" height="100%">
                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                <text className="font-sans text-[10px] uppercase tracking-[0.2em] fill-[var(--color-dark)] font-bold">
                    <textPath href="#circlePath" startOffset="0%">
                        •  Explore NOW • • Explore NOW • 
                    </textPath>
                </text>
            </svg>
        </div>
        <div className="w-14 h-14 bg-[var(--color-dark)] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <ArrowDown size={20} />
        </div>
    </div>
    </Link>
);

export default function AuroraPage() {
    const { businessData } = useTemplateContext();

    if (!businessData) return <div>Loading...</div>;

    const featuredProducts = getProductsByIds(businessData.allProducts, businessData.collections.itemIDs);

    return (
        <div className="bg-[var(--color-bg)]">
            
           {/* --- HERO SECTION --- */}
           <Editable focusId="hero">
                <section className="relative w-full pt-12 pb-0 lg:pt-20">
                    
                    {/* Background Split: The right beige block */}
                    <div className="absolute top-0 right-0 w-full lg:w-[40%] h-[90%] bg-[#F3EBE6] -z-10 rounded-bl-[100px] opacity-30 lg:opacity-100"></div>

                    <div className="container mx-auto px-6 lg:px-16 relative max-w-screen-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            
                            {/* LEFT COLUMN: Text (Span 6) */}
                            <div className="lg:col-span-6 flex flex-col justify-center lg:pr-12 z-10 pt-10 lg:pt-0">
                                <div className="relative">
                                    <h1 className="text-6xl lg:text-[90px] font-serif leading-[1.1] text-[#0F1C23] tracking-tight">
                                        Desire Meets <br/>
                                        <span className="relative inline-block">
                                            New Style
                                            {/* Floating Bracelet Image Graphic */}
                                            <div className="absolute -left-28 top-1/2 -translate-y-1/2 w-24 h-16 hidden lg:block rotate-12 opacity-80">
                                                <img src="/aurora/diamondsimageforaurora.png" alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                        </span>
                                    </h1>
                                </div>
                                
                                <p className="text-gray-500 text-lg mt-8 mb-10 max-w-md font-light leading-relaxed">
                                    {businessData.hero.subtitle || "Anyone can get dressed up and glamorous, but it is how people dress in their days off that."}
                                </p>
                            </div>

                            {/* RIGHT COLUMN: Images (Span 6) */}
                            <div className="lg:col-span-6 relative h-[600px] lg:h-[750px] overflow-hidden lg:overflow-visible">
                                {/* Main Image (Hands) - Overlapping the beige bg */}
                                <div className="absolute left-4 lg:left-0 top-0 w-[60%] h-[85%] z-20">
                                     {/* This image needs to be the one with hands/rings */}
                                    <img 
                                        src={businessData.hero.imageArch1} 
                                        alt="Jewelry Model" 
                                        className="w-full h-full object-cover shadow-2xl" 
                                    />
                                </div>

                                {/* Secondary Image (Arch on Right) */}
                                <div className="absolute right-0 top-30 w-[35%] h-[40%] z-10 rounded-t-[200px] overflow-hidden">
                                    <img 
                                        src={businessData.hero.imageSmallArch} 
                                        alt="Detail" 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                
                                {/* --- UPDATED SVG DECORATION --- */}
                                <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none -z-10"
                                    viewBox="0 0 800 320"
                                    preserveAspectRatio="xMidYMid slice" 
                                    aria-hidden="true"
                                >
                                    <defs>
                                        <linearGradient id="arcGrad" x1="0" x2="1" y1="0" y2="0">
                                            <stop offset="0%" stopColor="#D4A373" stopOpacity="0" />
                                            <stop offset="20%" stopColor="#D4A373" stopOpacity="0.6" />
                                            <stop offset="50%" stopColor="#D4A373" stopOpacity="1" />
                                            <stop offset="80%" stopColor="#D4A373" stopOpacity="0.6" />
                                            <stop offset="100%" stopColor="#D4A373" stopOpacity="0" />
                                        </linearGradient>

                                        <linearGradient id="edgeFade" x1="0" x2="1" y1="0" y2="0">
                                            <stop offset="0%" stopColor="black" stopOpacity="0" />
                                            <stop offset="15%" stopColor="black" stopOpacity="1" />
                                            <stop offset="85%" stopColor="black" stopOpacity="1" />
                                            <stop offset="100%" stopColor="black" stopOpacity="0" />
                                        </linearGradient>

                                        <mask id="fadeMask">
                                            <rect x="0" y="0" width="100%" height="100%" fill="url(#edgeFade)" />
                                        </mask>
                                    </defs>

                                    <g
                                        mask="url(#fadeMask)"
                                        fill="none"
                                        stroke="url(#arcGrad)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path
                                            d="M-50,300 C200,50 600,50 850,300"
                                            strokeWidth="3"
                                            className="opacity-90"
                                        />
                                        <path
                                            d="M-20,320 C220,100 580,100 820,320"
                                            strokeWidth="2"
                                            className="opacity-70"
                                        />
                                        <path
                                            d="M20,340 C240,150 560,150 780,340"
                                            strokeWidth="1.5"
                                            strokeDasharray="6 8"
                                            className="opacity-40"
                                        />
                                    </g>
                                </svg>
                                {/* --- END UPDATED SVG --- */}

                            </div>
                        </div>
                    </div>

                    {/* --- STATS BAR OVERLAY (Matches Screenshot Footer) --- */}
                    <div className="relative lg:absolute bottom-0 left-0 w-full z-30">
                        <div className="container mx-auto px-0 lg:px-16 max-w-screen-2xl">
                            <div className="flex flex-col lg:flex-row items-end">
                                
                                {/* 1. Dark Image Box (Left) */}
                                <div className="hidden lg:flex w-[280px] h-[220px] bg-[#0A1F25] relative items-center justify-center overflow-hidden">
                                     <img 
                                        src={businessData.hero.imageArch1_b} // Use a necklace image here 
                                        alt="Necklace Feature" 
                                        className="w-[80%] h-[80%] object-contain drop-shadow-xl"
                                     />
                                </div>

                                {/* 2. Beige Stats Box (Middle) */}
                                <div className="bg-[#FAEFE5] w-full lg:w-auto flex-1 h-[160px] flex items-center justify-around px-8 lg:px-20">
                                    <div className="text-center">
                                        <span className="block font-serif text-3xl lg:text-4xl text-[#0F1C23] mb-1">12</span>
                                        <span className="text-xs uppercase tracking-widest text-gray-500">All over World</span>
                                    </div>
                                    <div className="w-px h-12 bg-[#D4A373] opacity-30"></div>
                                    <div className="text-center">
                                        <span className="block font-serif text-3xl lg:text-4xl text-[#0F1C23] mb-1">150+</span>
                                        <span className="text-xs uppercase tracking-widest text-gray-500">Product Available</span>
                                    </div>
                                    <div className="w-px h-12 bg-[#D4A373] opacity-30"></div>
                                    <div className="text-center">
                                        <span className="block font-serif text-3xl lg:text-4xl text-[#0F1C23] mb-1">1K+</span>
                                        <span className="text-xs uppercase tracking-widest text-gray-500">Product Reviews</span>
                                    </div>
                                </div>

                                {/* 3. Circle Button (Right) - Overlapping */}
                                <div className="hidden lg:block ml-10 mb-10">
                                    <ExploreCircle />
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </Editable>


            {/* --- FEATURES MARQUEE SECTION (UPDATED) --- */}
            <Editable focusId="features">
                <section className="py-16 bg-white border-b border-gray-100 mt-12 lg:mt-24 overflow-hidden">
                  <div className="relative">
                    <div className="flex whitespace-nowrap">
                      <div className="flex marquee items-center">
                        {(businessData.features || []).map((feature, i) => (
                          <div key={i} className="flex items-center justify-center gap-4 mx-6">
                            <div className="w-12 h-12 rounded-full bg-[#FAEFE5] flex items-center justify-center text-[#0F1C23]">
                              <FeatureIcon name={feature.icon} size={20} />
                            </div>
                            <div className="text-left">
                              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0F1C23]">{feature.title}</h3>
                              <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">{feature.text}</p>
                            </div>
                          </div>
                        ))}

                        {(businessData.features || []).map((feature, i) => (
                          <div key={`dup-${i}`} className="flex items-center justify-center gap-4 mx-6" aria-hidden="true">
                            <div className="w-12 h-12 rounded-full bg-[#FAEFE5] flex items-center justify-center text-[#0F1C23]">
                              <FeatureIcon name={feature.icon} size={20} />
                            </div>
                            <div className="text-left">
                              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0F1C23]">{feature.title}</h3>
                              <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">{feature.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
            </Editable>

            {/* --- STORY SECTION --- */}
            <Editable focusId="story">
                <section className="py-32 bg-[#F3EBE6]">
                    <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <span className="text-xs font-bold tracking-[0.3em] text-[#D4A373] uppercase mb-4 block">Our Heritage</span>
                            <h2 className="text-5xl font-serif mb-8 text-[#0F1C23] leading-tight">{businessData.about.title}</h2>
                            <p className="text-gray-600 text-lg leading-loose mb-10 font-light">
                                {businessData.about.text}
                            </p>
                            <div className="flex items-center gap-8">
                                    <Link 
                                        href="./aurora/shop" 
                                        className="bg-[#0F1C23] text-white px-8 py-4 rounded-[4px] font-medium text-sm hover:bg-opacity-90 transition-all flex items-center gap-2"
                                    >
                                       Shop Now <ArrowRight size={16} />
                                    </Link>
                                   
                                </div>
                        </div>
                         <div className="h-[650px] w-full relative order-1 lg:order-2">
                             <div className="absolute inset-0 rounded-t-[300px] overflow-hidden shadow-2xl">
                                <img 
                                    src={businessData.about.image} 
                                    alt="Our Story" 
                                    className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105" 
                                />
                             </div>
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- COLLECTIONS --- */}
            <Editable focusId="collection">
                <section className="py-32 bg-white">
                    <div className="container mx-auto px-6 lg:px-16">
                        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-6">
                             <div>
                                <h2 className="text-4xl lg:text-5xl font-serif mb-4 text-[#0F1C23]">{businessData.collections.title}</h2>
                                <p className="text-gray-500 max-w-lg leading-relaxed">{businessData.collections.subtitle}</p>
                             </div>
                             <Link href="/shop" className="hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-2 hover:border-[#0F1C23] hover:text-[#0F1C23] text-gray-500 transition-all">
                                View Collection
                             </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} item={product} />
                            ))}
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- REVIEWS (IMPROVED) --- */}
            <Editable focusId="testimonials">
                <section className="py-24 bg-[#F7F4F0] border-t border-[#EBE5DF]">
                     <TestimonialSlider data={businessData.testimonials} />
                </section>
            </Editable>

            {/* --- FAQ SECTION --- */}
            <Editable focusId="faq">
                <section className="py-32 bg-white">
                    <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-serif mb-4 text-[#0F1C23]">{businessData.faq.title}</h2>
                            <p className="text-gray-500">{businessData.faq.subtitle}</p>
                        </div>
                        <div className="divide-y divide-gray-100 border-t border-gray-100">
                            {businessData.faq.questions.map((q, i) => (
                                <FAQAccordion key={i} question={q.q} answer={q.a} />
                            ))}
                        </div>
                    </div>
                </section>
            </Editable>
            
            {/* --- AN INVITATION (NEW & IMPROVED) --- */}
            <Editable focusId="cta">
                <NewsletterCTA data={businessData.newsletterCta} />
            </Editable>

            <Editable focusId="instagram">
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6 lg:px-16">
                        <InstagramFeed data={businessData.instagram} />
                    </div>
                </section>
            </Editable>
        </div>
    );
}