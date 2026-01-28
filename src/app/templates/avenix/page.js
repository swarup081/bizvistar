'use client';
import { useTemplateContext } from './templateContext.js'; // Import the context hook
import { 
    BlogCard, 
    ProductCard 
} from './components.js'; 
import Link from 'next/link';
import { Editable } from '@/components/editor/Editable'; // --- IMPORT EDITABLE ---

// Helper: Get product details from the master list by their IDs
const getProductsByIds = (allProducts, ids) => {
    if (!allProducts || !ids) return []; // Guard against undefined data
    return ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
};

// --- Reusable SVG Icons (KEPT HERE, as they are unique to this page) ---
const HeelsHero = ({ heroData }) => {
    // Splits the bent text ("HIGH") into an array of letters: ['H', 'I', 'G', 'H']
    const bentLetters = heroData.bentText.split('');

    return (
        // --- WRAPPED WITH EDITABLE ---
        <Editable focusId="hero">
            <section id="home" className="py-12 md:py-24 bg-brand-primary overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    {/* --- CHANGED: Grid cols 2 on ALL screens for shrink effect --- */}
                    <div className="grid grid-cols-2 gap-4 md:gap-16 items-center">
                        {/* 1. Text Content (Left) */}
                        <div className="text-left font-sans">
                            <h2 className="text-[7vw] md:text-6xl lg:text-7xl font-serif font-medium text-brand-text leading-tight">
                            {heroData.line1}
                            <br />
                            {/* UPDATED: Uses the accentColor prop */ }
                            <span style={{ color: heroData.accentColor }} className="font-bold">{heroData.line2}</span> {heroData.line3}
                            <div className="relative inline-block ml-2 md:ml-4">
                                {bentLetters.map((letter, index) => (
                                <span 
                                    key={index}
                                    // UPDATED: Uses the accentColor prop
                                    style={{ color: heroData.accentColor }}
                                    className={`relative inline-block text-[7vw] md:text-6xl lg:text-7xl font-serif font-bold
                                    ${index === 0 ? '-rotate-12 -translate-y-1 md:-translate-y-2' : ''}
                                    ${index === 1 ? '-rotate-6' : ''}
                                    ${index === 2 ? 'rotate-6' : ''}
                                    ${index === 3 ? 'rotate-12 translate-y-0.5 md:translate-y-1' : ''}
                                    `}
                                >
                                    {letter}
                                </span>
                                ))}
                                <svg 
                                className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-4 md:h-8 text-brand-text"
                                viewBox="0 0 100 20" 
                                preserveAspectRatio="none"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                >
                                <path d="M 5 15 Q 30 5, 50 10 T 95 12" />
                                </svg>
                            </div>
                            </h2>
                            <a 
                            href="/templates/avenix/shop" // UPDATED LINK
                            // UPDATED: Uses the buttonColor prop
                            style={{ backgroundColor: heroData.buttonColor }}
                            className="inline-flex items-center gap-2 md:gap-3 text-brand-bg px-4 py-2 md:px-8 md:py-4 font-sans font-medium text-[2.5vw] md:text-base uppercase tracking-wider rounded-full mt-4 md:mt-10 hover:opacity-80 transition-all"
                            >
                            <span className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-white rounded-full"></span>
                            {heroData.buttonText}
                            </a>
                        </div>
                        {/* 2. Image: Split rounded placeholder (Right) */}
                        <div className="relative w-full h-[40vw] md:h-96 mx-auto">
                            {/* Left half */}
                            <div className="absolute left-0 top-0 w-[100%] h-full rounded-bl-[60px] rounded-t-[60px] md:rounded-bl-[120px] md:rounded-t-[120px] overflow-hidden">
                                <img 
                                    src={heroData.image} 
                                    alt="Yellow heels" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Editable>
    );
};
// --- END of hero component ---


// --- Main Page Component ---
export default function AvenixPage() {
    
    // Get businessData from the context
    const { businessData } = useTemplateContext();

    // Guard against undefined properties during initial render or data mismatch
    if (!businessData || !businessData.heelsHero) {
        return <div>Loading preview...</div>; 
    }

    // --- NEW: Get dynamic products ---
    const featuredProducts = getProductsByIds(businessData.allProducts, businessData.featured.itemIDs);
    const newArrivalsProducts = getProductsByIds(businessData.allProducts, businessData.newArrivals.itemIDs);

    return (
        <> 
            {/* Header and Footer are gone */}
            <main>
                {/* --- 1. REPLACED Hero Section --- */}
                <HeelsHero heroData={businessData.heelsHero} />
                
               {/* --- 2. About Section --- */}
               <Editable focusId="about">
                <section id="story" className="py-12 md:py-24 overflow-hidden bg-brand-primary">
                        <div className="container mx-auto px-4 md:px-6">
                            
                            <div className="mb-12 md:mb-24">
                                <h3 className="text-[2.5vw] md:text-sm uppercase tracking-widest font-sans font-medium opacity-70">
                                    {businessData.about.heading}
                                </h3>
                                
                                <h2 className="mt-4 text-[5vw] md:text-4xl lg:text-5xl font-serif font-medium text-brand-text leading-tight">
                                    <span>{businessData.about.subheading.part1}</span>
                                    
                                    <span className="inline-block w-[15vw] h-[8vw] md:w-38 md:h-20 rounded-full overflow-hidden mx-2 md:mx-5 shadow-md align-middle">
                                        <img 
                                            src={businessData.about.inlineImages[0]} 
                                            alt="Style 1" 
                                            className="w-full h-full object-cover " 
                                        />
                                    </span>
                                    <span className="inline-block w-[15vw] h-[8vw] md:w-38 md:h-20 rounded-full overflow-hidden mr-1 md:mr-2 shadow-md align-middle">
                                        <img 
                                            src={businessData.about.inlineImages[1]} 
                                            alt="Style 2" 
                                            className="w-full h-full object-cover" 
                                        />
                                    </span>
                                    <span>{businessData.about.subheading.part2}</span>
                                    <span className="inline-block w-[15vw] h-[8vw] md:w-38 md:h-20 rounded-full overflow-hidden ml-1 md:ml-2 shadow-md align-middle">
                                        <img 
                                            src={businessData.about.inlineImages[2]} 
                                            alt="Style 3" 
                                            className="w-full h-full object-cover" 
                                        />
                                    </span>
                                </h2>
                            </div>

                            {/* Bottom Part: Two-column layout (Text left, Image right) on ALL screens */}
                            <div className="grid grid-cols-2 gap-4 md:gap-16 items-center min-h-[200px] md:min-h-[400px]">
                                <div className="text-left">
                                    <h2 className="text-[4.5vw] md:text-4xl lg:text-5xl font-serif font-medium text-brand-text leading-tight">
                                        {businessData.about.statement}
                                    </h2>
                                </div>
                                <div className="flex justify-center md:justify-end">
                                    <div className="w-full max-w-lg h-[40vw] md:h-[300px] overflow-hidden rounded-xl md:rounded-2xl">
                                        <img 
                                            src={businessData.about.largeImage} 
                                            alt="Avenix hoodies" 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </Editable>

                {/* --- 3. Featured Products (NOW DYNAMIC) --- */}
                <Editable focusId="collection">
                    <section id="collection" className="py-12 md:py-24">
                        <div className="container mx-auto px-4 md:px-6 text-center">
                            <p className="text-[2.5vw] md:text-sm uppercase tracking-widest font-sans font-medium text-brand-text/70">
                                {businessData.featured.sectionHeading}
                            </p>
                            <h2 className="text-[8vw] md:text-6xl font-serif font-medium text-brand-text mt-2 md:mt-4">
                                {businessData.featured.title} 
                            </h2>
                        </div>
                        
                        <div className="container mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-16 items-start">
                            
                            <div className="col-span-2 md:col-span-1 h-full">
                                <img 
                                    src={businessData.featured.largeImage} 
                                    alt="Featured Product" 
                                    className="w-full h-[60vw] md:h-full object-cover rounded-xl md:rounded-2xl"
                                />
                            </div>

                            {/* Item 2: Product 1 */}
                            {featuredProducts[0] && (
                                <div className="col-span-1 flex flex-col items-center text-center">
                                    <div className="bg-white rounded-xl md:rounded-2xl w-full">
                                        <img src={featuredProducts[0].image} alt={featuredProducts[0].name} className="w-full h-auto object-cover rounded-lg aspect-[4/5] pb-2 md:pb-6" />
                                        <h3 className="text-[3vw] md:text-2xl font-serif font-medium mt-2 md:mt-6">{featuredProducts[0].name}</h3>
                                        <p className="text-[2.5vw] md:text-lg font-sans text-brand-text/80 mt-1">${featuredProducts[0].price.toFixed(2)} USD</p>
                                        <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 mt-2 md:mt-6 pb-2 md:pb-6 px-2 md:px-6">
                                            <Link href={`/templates/avenix/product/${featuredProducts[0].id}`} className="w-full btn-primary bg-brand-secondary text-brand-bg px-2 py-2 md:px-6 md:py-3 font-sans font-medium text-[2vw] md:text-sm uppercase tracking-wider rounded-xl md:rounded-3xl text-center hover:opacity-80">Shop Now</Link>
                                            <Link href={`/templates/avenix/product/${featuredProducts[0].id}`} className="hidden md:block w-full btn-secondary bg-white text-brand-secondary border border-brand-text/20 px-6 py-3 font-sans font-medium text-sm uppercase tracking-wider rounded-3xl text-center hover:bg-gray-50">Learn More</Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Item 3: Product 2 */}
                            {featuredProducts[1] && (
                                <div className="col-span-1 flex flex-col items-center text-center">
                                    <div className="bg-white rounded-xl md:rounded-2xl w-full">
                                        <img src={featuredProducts[1].image} alt={featuredProducts[1].name} className="w-full h-auto pb-2 md:pb-6 object-cover rounded-lg aspect-[4/5]" />
                                        <h3 className="text-[3vw] md:text-2xl font-serif font-medium mt-2 md:mt-6">{featuredProducts[1].name}</h3>
                                        <p className="text-[2.5vw] md:text-lg font-sans text-brand-text/80 mt-1">${featuredProducts[1].price.toFixed(2)} USD</p>
                                        <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 mt-2 md:mt-6 pb-2 md:pb-6 px-2 md:px-6">
                                            <Link href={`/templates/avenix/product/${featuredProducts[1].id}`} className="w-full btn-primary bg-brand-secondary text-brand-bg px-2 py-2 md:px-6 md:py-3 font-sans font-medium text-[2vw] md:text-sm uppercase tracking-wider rounded-xl md:rounded-3xl text-center hover:opacity-80">Shop Now</Link>
                                            <Link href={`/templates/avenix/product/${featuredProducts[1].id}`} className="hidden md:block w-full btn-secondary bg-white text-brand-secondary border border-brand-text/20 px-6 py-3 font-sans font-medium text-sm uppercase tracking-wider rounded-3xl text-center hover:bg-gray-50">Learn More</Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </Editable>
                
                {/* --- 4. CTA Section (ID ADDED) --- */}
                <Editable focusId="cta">
                    <section id="cta" className="py-12 md:py-24 overflow-hidden">
                        <div className="container mx-auto px-4 md:px-6 grid grid-cols-2 gap-4 md:gap-16 items-center">
                            <div className="text-left">
                                <h2 className="text-[6vw] md:text-6xl font-serif font-medium text-brand-text max-w-lg leading-tight">
                                    {businessData.ctaSection.title}
                                </h2>
                                <p className="text-[2.5vw] md:text-xl font-sans text-brand-text/80 mt-2 md:mt-6 max-w-lg">
                                    {businessData.ctaSection.text}
                                </p>
                                <a href="/templates/avenix/shop" className="btn-primary inline-flex items-center gap-2 md:gap-3 bg-brand-secondary text-brand-bg px-4 py-2 md:px-8 md:py-4 font-sans font-medium text-[2vw] md:text-base uppercase tracking-wider rounded-full mt-4 md:mt-10 hover:opacity-80">
                                    <span className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-white rounded-full"></span>
                                    {businessData.ctaSection.cta}
                                </a>
                                
                                <div className="flex gap-2 md:gap-6 mt-6 md:mt-16">
                                    {businessData.ctaSection.icons.map((icon, i) => (
                                        <div key={i} className="bg-white p-0 border border-brand-text/10 rounded-lg md:rounded-2xl w-[15vw] h-[15vw] md:w-32 md:h-32 flex items-center justify-center">
                                            <img src={icon.image} alt={`Icon ${i+1}`} className="w-full h-full object-contain" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                        <div className="flex justify-center md:justify-start">
                                <div className="w-full max-w-xl h-[50vw] md:h-[850px] border-[1px] md:border-[2px] border-brand-text/30 rounded-full overflow-hidden p-2 md:p-8">
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        <img 
                                            src={businessData.ctaSection.image} 
                                            alt="Explore fashion" 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </section>
                </Editable>


                {/* --- 6. Brands Section --- */}
                {businessData.brands.logos.length > 0 && (
                    <section className="py-8 md:py-16">
                        <div className="container mx-auto px-4 md:px-6 text-center">
                            <h2 className="text-[5vw] md:text-4xl font-serif font-medium text-brand-text max-w-2xl mx-auto">{businessData.brands.heading}</h2>
                            <p className="text-[2.5vw] md:text-lg font-sans text-brand-text/80 mt-2 md:mt-6 max-w-xl mx-auto">{businessData.brands.text}</p>
                            <div className="flex flex-wrap justify-center items-center gap-x-4 md:gap-x-12 gap-y-2 md:gap-y-6 mt-8 md:mt-16 opacity-70">
                                {businessData.brands.logos.map((logo, i) => (
                                    <span key={i} className="text-[3vw] md:text-2xl font-bold text-brand-text italic">{logo}</span>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* --- Other Sections --- */}

                <section className="py-12 md:py-24">
                    <div className="container mx-auto px-4 md:px-6 grid grid-cols-2 gap-4 md:gap-16">
                        {businessData.features.map(feature => (
                            <div key={feature.title} className="p-4 md:p-10 bg-brand-primary rounded-xl md:rounded-2xl">
                                <h3 className="text-[4vw] md:text-4xl font-serif font-medium">{feature.title}</h3>
                                <p className="text-[2.5vw] md:text-lg font-sans text-brand-text/80 mt-2 md:mt-6">{feature.text}</p>
                                {feature.cta && (
                                    <a href="/templates/avenix/shop" className="inline-block text-[2.5vw] md:text-lg font-medium font-sans mt-4 md:mt-8 hover:opacity-80">
                                        • {feature.cta}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* --- New Arrivals (NOW DYNAMIC) --- */}
                <Editable focusId="products">
                    <section id="shop" className="py-12 md:py-24">
                        <div className="container mx-auto px-4 md:px-6 text-center">
                            <p className="text-[2.5vw] md:text-sm uppercase tracking-widest font-sans opacity-70">{businessData.newArrivals.heading}</p>
                            <h2 className="text-[6vw] md:text-5xl font-serif font-medium text-brand-text mt-2 md:mt-4">{businessData.newArrivals.title}</h2>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-16 mt-8 md:mt-16 items-start">
                                {newArrivalsProducts.map(item => (
                                    <ProductCard 
                                        key={item.id} 
                                        item={item}
                                        templateName="avenix"
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                </Editable>

                {/* --- Stats Section (ID ADDED) --- */}
                <Editable focusId="stats">
                    <section id="stats" className="py-12 md:py-24">
                        <div className="container mx-auto px-4 md:px-6 grid grid-cols-2 gap-4 md:gap-16 items-center">
                            <div className="text-left">
                                <h2 className="text-[6vw] md:text-5xl font-serif font-medium text-brand-text">{businessData.stats.title}</h2>
                                <p className="text-[2.5vw] md:text-xl font-sans text-brand-text/80 mt-2 md:mt-6 max-w-lg">{businessData.stats.text}</p>
                                <a href="/templates/avenix/shop" className="inline-flex items-center gap-2 text-[2.5vw] md:text-lg font-medium font-sans mt-4 md:mt-8 hover:opacity-80">
                                    <span>{businessData.stats.cta}</span>
                                </a>
                            </div>
                            <div className="flex flex-row gap-2 md:gap-8">
                                {businessData.stats.items.map(stat => (
                                    <div key={stat.label} className="flex-1 text-center p-4 md:p-8 bg-brand-primary rounded-xl md:rounded-2xl">
                                        <p className="text-[8vw] md:text-6xl font-serif font-medium text-brand-text">{stat.number}</p>
                                        <p className="text-[2.5vw] md:text-lg font-sans text-brand-text/80 mt-2 md:mt-4">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </Editable>

                <Editable focusId="blog">
                    <section id="blogs" className="py-12 md:py-24 bg-brand-primary">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="text-center mb-8 md:mb-16">
                                <p className="text-[2.5vw] md:text-sm uppercase tracking-widest font-sans opacity-70">{businessData.blog.heading}</p>
                                <h2 className="text-[6vw] md:text-5xl font-serif font-medium text-brand-text mt-2 md:mt-4">{businessData.blog.title}</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-12 gap-y-8 md:gap-y-16 items-start">
                                {businessData.blog.items[0] && (
                                    <div className="col-span-1 md:col-span-1">
                                        <BlogCard 
                                            key={businessData.blog.items[0].title} 
                                            post={businessData.blog.items[0]}
                                            size="small" 
                                        />
                                    </div>
                                )}
                                {businessData.blog.items[1] && (
                                    <div className="col-span-1 md:col-span-2">
                                        <BlogCard 
                                            key={businessData.blog.items[1].title} 
                                            post={businessData.blog.items[1]}
                                            size="large"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </Editable>
            </main>
        </>
    );
}