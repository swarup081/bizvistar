'use client';
import { useState, useEffect } from 'react';
import { businessData as initialBusinessData } from './data.js';

// --- Reusable SVG Icons ---


const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const SocialIcon = ({ platform }) => {
    switch (platform.toLowerCase()) {
        case 'instagram': return <IconInstagram />;
        case 'facebook': return <IconFacebook />;
        case 'youtube': return <IconYouTube />;
        case 'twitter': return <IconTwitter />;
        default: return null;
    }
};

// --- *** NEW: Social Media Icons *** ---
const IconInstagram = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const IconFacebook = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

const IconTwitter = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    </svg>
);

const IconYouTube = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 11.75a29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
);

const BlogCard = ({ post, size = 'small' }) => (
    <div className="group text-left">
        <a 
            href="#" 
            className={`block bg-white overflow-hidden relative rounded-2xl 
            ${size === 'small' ? 'aspect-[4/3]' : 'aspect-video'}`} // Dynamic aspect ratio
        >
            <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
        </a>
        <div className="mt-6">
            <h3 
                className={`font-serif font-medium text-brand-text mt-2 
                ${size === 'small' ? 'text-3xl' : 'text-4xl'}`} // Dynamic font size
            >
                <a href="#" className="hover:opacity-70">{post.title}</a>
            </h3>
            <p className="text-brand-text opacity-70 text-sm mt-3 uppercase font-sans tracking-widest">
                {post.date} <span className="mx-2">•</span> {post.category}
            </p>
        </div>
    </div>
);

// --- Reusable UI Components ---

const Header = ({ business }) => (
    <header className="bg-brand-bg/90 backdrop-blur-sm sticky top-0 z-40 w-full font-sans">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center relative">
            {/* Left Nav */}
            <nav className="hidden md:flex items-center gap-8">
                {business.navigation.main.map(navItem => (
                    <a key={navItem.label} href={navItem.href} className="text-sm font-medium tracking-widest uppercase text-brand-text hover:opacity-70 transition-opacity">
                        {navItem.label}
                    </a>
                ))}
            </nav>
            
            {/* Center Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <a href="#home" className="text-3xl font-bold text-brand-text tracking-wider font-serif">
                    {business.logoText}
                </a>
            </div>
            
             {/* Right Nav & Icons */}
            <div className="flex-1 flex justify-end items-center gap-8">
                <nav className="hidden md:flex items-center gap-8">
                    {business.navigation.secondary.map(navItem => (
                        <a key={navItem.label} href={navItem.href} className="text-sm font-medium tracking-widest uppercase text-brand-text hover:opacity-70 transition-opacity">
                            {navItem.label}
                        </a>
                    ))}
                </nav>
                <div className="flex items-center gap-6">
                    <button className="text-brand-text hover:opacity-70 transition-opacity"><CartIcon /></button>
                </div>
            </div>
        </div>
    </header>
);

// --- NEW: Heels Hero Component (from ...8.21.16...) ---
// --- NEW: Heels Hero Component (from ...8.21.16...) ---
// --- NEW: Heels Hero Component (from ...8.21.16...) ---
const HeelsHero = ({ heroData }) => {
    // Splits the bent text ("HIGH") into an array of letters: ['H', 'I', 'G', 'H']
    const bentLetters = heroData.bentText.split('');

    return (
        <section id="home" className="py-24 bg-brand-primary overflow-hidden">
            <div className="container mx-auto px-6">
                {/* --- CHANGED: Swapped grid columns order: TEXT left, IMAGE right --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* 1. Text Content (NOW ON LEFT) */}
                    <div className="text-left font-sans">
                        <h2 className="text-6xl lg:text-7xl font-serif font-medium text-brand-text leading-tight">
                          {heroData.line1}
                          <br />
                          {/* UPDATED: Uses the accentColor prop */ }
                          <span style={{ color: heroData.accentColor }} className="font-bold">{heroData.line2}</span> {heroData.line3}
                          <div className="relative inline-block ml-4">
                            {bentLetters.map((letter, index) => (
                              <span 
                                key={index}
                                // UPDATED: Uses the accentColor prop
                                style={{ color: heroData.accentColor }}
                                className={`relative inline-block text-6xl lg:text-7xl font-serif font-bold
                                  ${index === 0 ? '-rotate-12 -translate-y-2' : ''}
                                  ${index === 1 ? '-rotate-6' : ''}
                                  ${index === 2 ? 'rotate-6' : ''}
                                  ${index === 3 ? 'rotate-12 translate-y-1' : ''}
                                `}
                              >
                                {letter}
                              </span>
                            ))}
                            <svg 
                              className="absolute -bottom-4 left-0 w-full h-8 text-brand-text" 
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
                          href="#" 
                          // UPDATED: Uses the buttonColor prop
                          style={{ backgroundColor: heroData.buttonColor }}
                          className="inline-flex items-center gap-3 text-brand-bg px-8 py-4 font-sans font-medium text-base uppercase tracking-wider rounded-full mt-10 hover:opacity-80 transition-all"
                        >
                          <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                          {heroData.buttonText}
                        </a>
                    </div>
                    {/* 2. Image: Split rounded placeholder (NOW ON RIGHT) */}
                    <div className="relative w-full max-w-lg h-96 mx-auto">
                        {/* Left half */}
                        <div className="absolute left-0 top-0 w-[100%] h-full rounded-bl-[120px] rounded-t-[120px] overflow-hidden">
                            <img 
                                src={heroData.image} 
                                alt="Yellow heels" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Right half */}
                    </div>
                </div>
            </div>
        </section>
    );
};
// --- END of hero component ---


const ProductCard = ({ item }) => (
    <div className="group text-left">
        <a href="#" className="block bg-white overflow-hidden relative aspect-[4/5] rounded-2xl p-0">
            <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
            />
        </a>
        <div className="mt-6 text-center">
            <h3 className="text-lg font-medium text-brand-text font-sans tracking-wider uppercase">{item.name}</h3>
            <p className="text-brand-text opacity-70 text-base mt-2 font-sans">{item.description}</p>
            <a href="#" className="btn-secondary inline-block mt-4 font-medium text-brand-text font-sans text-sm hover:opacity-70">
                 Shop Now
            </a>
        </div>
    </div>
);



// --- Main Page Component ---
export default function AvenixPage() {
    
    const [businessData, setBusinessData] = useState(initialBusinessData); 
    
    useEffect(() => {
        const storedStoreName = localStorage.getItem('storeName');
        if (storedStoreName) {
            setBusinessData(prevData => ({
                ...prevData,
                name: storedStoreName,
                logoText: storedStoreName,
            }));
        }
    }, []); 

    const createFontVariable = (fontName) => {
        const formattedName = fontName.toLowerCase().replace(/ /g, '-');
        return `var(--font-${formattedName})`;
    };
    
    const fontVariables = {
        '--font-heading': createFontVariable(businessData.theme.font.heading),
        '--font-body': createFontVariable(businessData.theme.font.body),
    };

    const themeClassName = `theme-${businessData.theme.colorPalette}`;
    
    return (
        <div 
          className={`antialiased bg-brand-bg text-brand-text ${themeClassName}`}
          style={fontVariables}
        >
            <Header business={{ logoText: businessData.logoText, navigation: businessData.navigation }} />

            <main>
                {/* --- 1. REPLACED Hero Section --- */}
                <HeelsHero heroData={businessData.heelsHero} />
                
               {/* --- 2. About Section (Pixel-perfect from ...8.14.47...) --- */}
               <section id="story" className="py-24 overflow-hidden bg-brand-primary"> 
                    <div className="container mx-auto px-6">
                        
                        {/* --- CHANGED: Removed max-w-5xl --- */}
                        <div className="mb-24">
                            <h3 className="text-sm uppercase tracking-widest font-sans font-medium opacity-70">
                                {businessData.about.heading}
                            </h3>
                            
                            <h2 className="mt-4 text-4xl lg:text-5xl font-serif font-medium text-brand-text leading-tight">
                                <span>{businessData.about.subheading.part1}</span>
                                
                                <span className="inline-block w-38 h-20 rounded-full overflow-hidden mx-5 shadow-md align-middle">
                                    <img 
                                        src={businessData.about.inlineImages[0]} 
                                        alt="Style 1" 
                                        className="w-full h-full object-cover " 
                                    />
                                </span>
                                <span className="inline-block w-38 h-20 rounded-full overflow-hidden mr-2 shadow-md align-middle">
                                    <img 
                                        src={businessData.about.inlineImages[1]} 
                                        alt="Style 2" 
                                        className="w-full h-full object-cover" 
                                    />
                                </span>
                                <span>{businessData.about.subheading.part2}</span>
                                <span className="inline-block w-38 h-20 rounded-full overflow-hidden ml-2 shadow-md align-middle">
                                    <img 
                                        src={businessData.about.inlineImages[2]} 
                                        alt="Style 3" 
                                        className="w-full h-full object-cover" 
                                    />
                                </span>
                            </h2>
                        </div>

                        {/* Bottom Part: Two-column layout (Text left, Image right) */}
                        {/* UPDATED: Reduced min-h-[500px] to min-h-[400px] */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center min-h-[400px]">
                            <div className="text-left">
                                <h2 className="text-4xl lg:text-5xl font-serif font-medium text-brand-text leading-tight">
                                    {businessData.about.statement}
                                </h2>
                            </div>
                            <div className="flex justify-center md:justify-end">
                                {/* UPDATED: Reduced h-[400px] to h-[300px] */}
                                <div className="w-full max-w-lg h-[300px] overflow-hidden rounded-2xl">
                                    <img 
                                        src={businessData.about.largeImage} 
                                        alt="Nixiv hoodies" 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 3. Featured Products  --- */}
  <section id="collection" className="py-24"> 
    <div className="container mx-auto px-6 text-center">
        <p className="text-sm uppercase tracking-widest font-sans font-medium text-brand-text/70">
            {businessData.featured.sectionHeading}
        </p>
        <h2 className="text-6xl font-serif font-medium text-brand-text mt-4">
            {businessData.featured.title} 
        </h2>
    </div>
    
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 items-start">
        
        {/* --- FIXED: Item 1 --- */}
        {/* We remove the outer div wrapper (bg-white, p-6) */}
        {/* The image now directly fills the grid column */}
        <div className="md:col-span-1 h-full">
            <img 
                src={businessData.featured.largeImage} 
                alt="Featured Product" 
                className="w-full h-full object-cover rounded-2xl" 
                /* - 'h-full' makes it fill the row's height
                   - 'rounded-2xl' matches the other cards
                   - 'aspect-[4/5]' is REMOVED so it can fill the space 
                */
            />
        </div>

        {/* Item 2: Product 1 (Unchanged) */}
        <div className="md:col-span-1 flex flex-col items-center text-center">
            <div className="bg-white  rounded-2xl w-full"> 
                <img src={businessData.featured.items[0].image} alt={businessData.featured.items[0].name} className="w-full h-auto object-cover rounded-lg aspect-[4/5] pb-6" />
                <h3 className="text-2xl font-serif font-medium mt-6">{businessData.featured.items[0].name}</h3>
                <p className="text-lg font-sans text-brand-text/80 mt-1">${businessData.featured.items[0].price} USD</p>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 pb-6 px-6">
                    <a href="#" className="w-full btn-primary bg-brand-secondary text-brand-bg px-6 py-3 font-sans font-medium text-sm uppercase tracking-wider rounded-3xl text-center hover:opacity-80">Shop Now</a>
                    <a href="#" className="w-full btn-secondary bg-white text-brand-secondary border border-brand-text/20 px-6 py-3 font-sans font-medium text-sm uppercase tracking-wider rounded-3xl text-center hover:bg-gray-50">Learn More</a>
                </div>
            </div>
        </div>

        {/* Item 3: Product 2 (Unchanged) */}
        <div className="md:col-span-1 flex flex-col items-center text-center">
            <div className="bg-white  rounded-2xl w-full"> 
                <img src={businessData.featured.items[1].image} alt={businessData.featured.items[1].name} className="w-full h-auto  pb-6  object-cover rounded-lg aspect-[4/5]" />
                <h3 className="text-2xl font-serif font-medium  mt-6">{businessData.featured.items[1].name}</h3>
                <p className="text-lg font-sans text-brand-text/80 mt-1">${businessData.featured.items[1].price} USD</p>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6  pb-6 px-6 ">
                    <a href="#" className="w-full btn-primary bg-brand-secondary text-brand-bg px-6 py-3 font-sans font-medium text-sm uppercase tracking-wider rounded-3xl text-center hover:opacity-80">Shop Now</a>
                    <a href="#" className="w-full btn-secondary bg-white text-brand-secondary border border-brand-text/20 px-6 py-3 font-sans font-medium text-sm uppercase tracking-wider rounded-3xl text-center hover:bg-gray-50">Learn More</a>
                </div>
            </div>
        </div>
    </div>
</section>
                {/* --- 4. CTA Section (Pixel-perfect from ...8.09.04...) --- */}
                <section className="py-24 overflow-hidden">
                    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="text-left">
                            <h2 className="text-6xl font-serif font-medium text-brand-text max-w-lg leading-tight">
                                {businessData.ctaSection.title}
                            </h2>
                            <p className="text-xl font-sans text-brand-text/80 mt-6 max-w-lg">
                                {businessData.ctaSection.text}
                            </p>
                            <a href="#" className="btn-primary inline-flex items-center gap-3 bg-brand-secondary text-brand-bg px-8 py-4 font-sans font-medium text-base uppercase tracking-wider rounded-full mt-10 hover:opacity-80">
                                <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                                {businessData.ctaSection.cta}
                            </a>
                            
                            {/* --- CHANGED: Icon Cards are larger --- */}
                            <div className="flex gap-6 mt-16">
                                {businessData.ctaSection.icons.map((icon, i) => (
                                    <div key={i} className="bg-white p-0 border border-brand-text/10 rounded-2xl w-32 h-32 flex items-center justify-center">
                                        <img src={icon.image} alt={`Icon ${i+1}`} className="w-full h-full object-contain" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                     <div className="flex justify-center md:justify-start">
                            <div className="w-full max-w-xl h-[850px] border-[2px] border-brand-text/30 rounded-full overflow-hidden p-8">
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

                {/* --- 5. Categories Section  --- */}
                {/* --- CHANGED: 2-col grid and more height --- */}
                { /*    <section className="py-24">
                    <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {businessData.categories.map(cat => (
                            <a href="#" key={cat.name} className="group relative h-[600px] flex items-end justify-start p-8 overflow-hidden rounded-2xl">
                                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black/20"></div>
                                <h3 className="relative text-4xl font-serif font-medium text-white">{cat.name}</h3>
                            </a>
                        ))}
                    </div>
                </section> */}

                {/* --- 6. Brands Section  --- */}
                {/* --- CHANGED: This section will now render nothing, as requested --- */}
                {businessData.brands.logos.length > 0 && (
                    <section className="py-16">
                        <div className="container mx-auto px-6 text-center">
                            <h2 className="text-4xl font-serif font-medium text-brand-text max-w-2xl mx-auto">{businessData.brands.heading}</h2>
                            <p className="text-lg font-sans text-brand-text/80 mt-6 max-w-xl mx-auto">{businessData.brands.text}</p>
                            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 mt-16 opacity-70">
                                {businessData.brands.logos.map((logo, i) => (
                                    <span key={i} className="text-2xl font-bold text-brand-text italic">{logo}</span>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* --- Other Sections --- */}

                <section className="py-24">
                    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
                        {businessData.features.map(feature => (
                            <div key={feature.title} className="p-10 bg-brand-primary rounded-2xl">
                                <h3 className="text-4xl font-serif font-medium">{feature.title}</h3>
                                <p className="text-lg font-sans text-brand-text/80 mt-6">{feature.text}</p>
                                {feature.cta && (
                                    <a href="#" className="inline-block text-lg font-medium font-sans mt-8 hover:opacity-80">
                                        • {feature.cta}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
                
                <section id="shop" className="py-24">
                    <div className="container mx-auto px-6 text-center">
                        <p className="text-sm uppercase tracking-widest font-sans opacity-70">{businessData.newArrivals.heading}</p>
                        <h2 className="text-5xl font-serif font-medium text-brand-text mt-4">{businessData.newArrivals.title}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 mt-16 items-start">
                            {businessData.newArrivals.items.map(item => (
                                <ProductCard 
                                    key={item.id} 
                                    item={item}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24">
                    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="text-left">
                            <h2 className="text-5xl font-serif font-medium text-brand-text">{businessData.stats.title}</h2>
                            <p className="text-xl font-sans text-brand-text/80 mt-6 max-w-lg">{businessData.stats.text}</p>
                            <a href="#" className="inline-flex items-center gap-2 text-lg font-medium font-sans mt-8 hover:opacity-80">
                                <span>{businessData.stats.cta}</span>
                            </a>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-8">
                            {businessData.stats.items.map(stat => (
                                <div key={stat.label} className="flex-1 text-center p-8 bg-brand-primary rounded-2xl">
                                    <p className="text-6xl font-serif font-medium text-brand-text">{stat.number}</p>
                                    <p className="text-lg font-sans text-brand-text/80 mt-4">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="blogs" className="py-24 bg-brand-primary">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <p className="text-sm uppercase tracking-widest font-sans opacity-70">{businessData.blog.heading}</p>
                            <h2 className="text-5xl font-serif font-medium text-brand-text mt-4">{businessData.blog.title}</h2>
                        </div>
                        {/* Updated grid to match the new screenshot layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16 items-start">
                            {/* Post 1 (Small) */}
                            {businessData.blog.items[0] && (
                                <div className="md:col-span-1">
                                    <BlogCard 
                                        key={businessData.blog.items[0].title} 
                                        post={businessData.blog.items[0]}
                                        size="small" 
                                    />
                                </div>
                            )}
                            {/* Post 2 (Large) */}
                            {businessData.blog.items[1] && (
                                <div className="md:col-span-2">
                                    <BlogCard 
                                        key={businessData.blog.items[1].title} 
                                        post={businessData.blog.items[1]}
                                        size="large"
                                    />
                                </div>
                            )}
                            {/* Fallback for more posts (if any) */}
                            {businessData.blog.items.length > 2 && businessData.blog.items.slice(2).map(post => (
                                <div key={post.title} className="md:col-span-1">
                                    <BlogCard post={post} size="small" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            {/* --- Footer  --- */}
            {/* --- Footer  --- */}
            <footer id="contact" className="py-20 pb-12 bg-brand-secondary text-brand-bg font-sans">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        
                        {/* Column 1: Brand & Socials */}
                        <div>
                            <h3 className="text-3xl font-bold tracking-wider mb-4 font-serif">{businessData.footer.logo}</h3>
                            <p className="text-brand-bg/70 text-sm mb-6">{businessData.footer.description}</p>
                            
                            {/* NEW: Social Icons */}
                            <div className="flex items-center gap-5">
                                {businessData.footer.socials.map((social) => (
                                    social.url && social.url !== "#" && (
                                        <a 
                                            key={social.platform} 
                                            href={social.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-brand-bg/70 hover:text-brand-bg transition-colors"
                                        >
                                            <span className="sr-only">{social.platform}</span>
                                            <SocialIcon platform={social.platform} />
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* Column 2: Main Links */}
                        <div>
                            <h4 className="text-sm font-semibold mb-5 uppercase tracking-wider">LINKS</h4>
                            <ul className="space-y-3 text-sm">
                                {businessData.footer.links.main.map(link => (
                                    <li key={link.name}>
                                        <a href={link.url} className="text-brand-bg/70 hover:text-brand-bg transition-colors">{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Column 3: Utility Links */}
                        <div>
                            <h4 className="text-sm font-semibold mb-5 uppercase tracking-wider">UTILITY PAGES</h4>
                            <ul className="space-y-3 text-sm">
                                {businessData.footer.links.utility.map(link => (
                                    <li key={link.name}>
                                        <a href={link.url} className="text-brand-bg/70 hover:text-brand-bg transition-colors">{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4: Subscribe & Contact */}
                        <div>
                            <h4 className="text-sm font-semibold mb-5 uppercase tracking-wider">{businessData.footer.subscribe.title}</h4>
                            <form className="flex mb-6">
                                <input 
                                    type="email" 
                                    placeholder="Type your email" 
                                    className="w-full bg-brand-bg/10 border border-brand-bg/30 py-3 px-4 text-brand-bg placeholder:text-brand-bg/50 focus:ring-0 focus:border-brand-bg outline-none"
                                />
                                <button 
                                    type="submit" 
                                    className="px-6 py-3 bg-brand-bg text-brand-secondary font-semibold text-sm hover:opacity-80"
                                >
                                    {businessData.footer.subscribe.cta}
                                </button>
                            </form>
                            
                            <h4 className="text-sm font-semibold mt-8 mb-4 uppercase tracking-wider">CONTACT</h4>
                            <ul className="space-y-2 text-brand-bg/70 text-sm">
                                <li>{businessData.footer.contact.phone}</li>
                                <li>{businessData.footer.contact.email}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Footer Bar */}
                    <div className="text-center border-t border-brand-bg/20 mt-16 pt-8 text-sm">
                        <p className="text-brand-bg/70">{businessData.footer.copyright}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}