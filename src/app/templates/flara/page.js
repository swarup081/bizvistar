'use client';
import { useTemplateContext } from './templateContext.js';
import { ArrowRightIcon, ShippingIcon, ProductCard } from './components.js';
import Link from 'next/link';
import { Editable } from '@/components/editor/Editable'; 

const getProductsByIds = (allProducts, ids) => {
    if (!allProducts || !ids) return []; 
    return ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
};

export default function CandleaPage() {
    
    const { businessData, basePath } = useTemplateContext();

    const allProducts = businessData?.allProducts || [];
    const collectionItemIDs = businessData?.collection?.itemIDs || [];
    const bestSellerItemIDs = businessData?.bestSellers?.itemIDs || [];
    
    const collectionProducts = getProductsByIds(allProducts, collectionItemIDs);
    const bestSellerProducts = getProductsByIds(allProducts, bestSellerItemIDs);

    if (!businessData || !businessData.hero) {
        return <div>Loading preview...</div>; 
    }

    return (
        <>
            {/* --- Hero Section --- */}
            <section id="home" className="container mx-auto px-6 py-20 md:py-32 max-w-screen-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <Editable focusId="hero">
                        <div className="flex flex-col gap-6 md:pr-10 text-center md:text-left items-center md:items-start">
                            <h1 className="text-5xl md:text-7xl font-bold text-brand-text leading-tight font-serif">{businessData.hero.title}</h1>
                            <p className="text-lg text-brand-text opacity-70 max-w-md">{businessData.hero.subtitle}</p>
                       <Link 
                            href={`${basePath}/shop`}
                            className="mt-4 inline-flex items-center gap-3 btn btn-secondary px-8 py-3 text-base font-medium tracking-wider uppercase border border-brand-secondary text-brand-text hover:bg-brand-secondary hover:text-brand-bg transition-all duration-300"
                        >
                            <span>{businessData.hero.cta}</span>
                            <ArrowRightIcon />
                        </Link>
                        </div>
                    </Editable>
                    <Editable focusId="hero">
                        <div className="flex justify-center">
                            <div className="w-full max-w-md lg:max-w-lg aspect-[4/5] rounded-bl-[150px] rounded-tr-[150px] overflow-hidden">
                                <img 
                                    src={businessData.hero.image} 
                                    alt="Hero Candle" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </Editable>
                </div>
            </section>
            
            {/* --- Info Bar --- */}
            <Editable focusId="global">
                <section className="py-6 bg-brand-bg border-y border-brand-primary/20 overflow-hidden">
                    <div className="flex whitespace-nowrap">
                        <div className="flex marquee items-center">
                            {(businessData.infoBar || []).map((text, i) => (
                                <div key={i} className="flex items-center justify-center gap-4 mx-8">
                                    <ShippingIcon />
                                    <p className="font-medium text-brand-text opacity-80 text-lg">{text}</p>
                                </div>
                            ))}
                            {(businessData.infoBar || []).map((text, i) => (
                                <div key={`dup-${i}`} className="flex items-center justify-center gap-4 mx-8" aria-hidden="true">
                                    <ShippingIcon />
                                    <p className="font-medium text-brand-text opacity-80 text-lg">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- Feature Section 1 --- */}
            <Editable focusId="about">
                <section id="about" className="py-24 bg-brand-primary">
                    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-screen-2xl">
                        <div className="flex justify-center">
                            <img 
                                src={businessData.feature1.image} 
                                alt="Crafting warmth" 
                                className="w-full max-w-md lg:max-w-lg aspect-square object-cover"
                            />
                        </div>
                        <div className="md:pl-10 text-center md:text-left items-center md:items-start flex flex-col">
                            <h2 className="text-4xl md:text-5xl font-bold text-brand-text leading-tight font-serif">{businessData.feature1.title}</h2>
                            <p className="text-lg text-brand-text opacity-70 mt-6 max-w-lg">{businessData.feature1.text}</p>
                            <p className="text-base text-brand-text opacity-70 mt-4 max-w-lg">{businessData.feature1.subtext}</p>
                            <Link
                                href="#about"
                                className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-text hover:text-brand-bg border border-brand-text hover:bg-brand-secondary transition-all duration-300 px-4 py-2 "
                            >
                                <span>{businessData.feature1.cta}</span>
                                <ArrowRightIcon />
                            </Link>
                        </div>
                    </div>
                </section>
            </Editable>
            
            {/* --- Collection Section --- */}
            <section id="collection" className="py-24 bg-brand-bg">
                <Editable focusId="collection">
                    <div className="container mx-auto px-6 max-w-screen-2xl">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-4xl font-bold text-brand-text font-serif">{businessData.collection.title}</h2>
                            <Link href={`${basePath}/shop`} className="inline-flex items-center gap-2 font-semibold text-brand-text hover:text-brand-bg border border-brand-text hover:bg-brand-secondary transition-all duration-300 px-4 py-2 ">
                                <span>See All</span>
                                <ArrowRightIcon />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                            {collectionProducts.map(item => (
                                <Link 
                                href={`${basePath}/product/${item.id}`}
                                key={item.id} 
                                className="group relative block overflow-hidden shadow-lg aspect-[4/5] hover:rounded-t-full"
                                >
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <h3 className="absolute bottom-6 left-6 text-3xl font-bold text-white font-serif">{item.name}</h3>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="bg-brand-bg text-brand-text px-6 py-3 font-semibold uppercase tracking-wider shadow-lg">
                                            View Product
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </Editable>
            </section>
            
            {/* --- Best Sellers --- */}
            <section id="shop" className="py-24 bg-brand-bg">
                <Editable focusId="collection">
                    <div className="container mx-auto px-6 text-center max-w-screen-2xl">
                        <h2 className="text-4xl font-bold text-brand-text mb-16 font-serif">{businessData.bestSellers.title}</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-x-8 gap-y-16 items-stretch">
                            {bestSellerProducts.map(item => (
                                <ProductCard 
                                    key={item.id} 
                                    item={item}
                                    templateName="flara"
                                />
                            ))}
                        </div>
                        <Link 
                            href={`${basePath}/shop`}
                            className="mt-16 inline-flex items-center gap-2 font-semibold text-brand-text hover:text-brand-bg border border-brand-text hover:bg-brand-secondary transition-all duration-300 px-6 py-3 "
                        >
                            <span>Shop Now</span>
                            <ArrowRightIcon />
                        </Link>
                    </div>
                </Editable>
            </section>

            {/* --- Feature Section 2 --- */}
            <Editable focusId="feature2">
                <section id="feature2" className="py-24 overflow-hidden bg-brand-bg">
                    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:items-end max-w-screen-2xl">
                        <div className="relative">
                            <div className="w-full aspect-[4/5] rounded-t-full overflow-hidden">
                                <img 
                                    src={businessData.feature2.image1} 
                                    alt="Peaceful scents"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-base text-brand-text opacity-70 mt-8 max-w-md">{businessData.feature2.subtext}</p>
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="md:pl-10">
                                <h2 className="text-4xl md:text-5xl font-bold text-brand-text leading-tight font-serif">{businessData.feature2.title}</h2>
                                <p className="text-lg text-brand-text opacity-70 mt-6 max-w-lg">{businessData.feature2.text}</p>

                                <img 
                                    src={businessData.feature2.image2}
                                    alt="Calming candle"
                                    className="w-full max-w-xs h-auto  object-cover mt-8"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </Editable>

            {/* --- Blog --- */}
            <Editable focusId="blog">
                <section id="blog" className="py-24 bg-brand-primary">
                    <div className="container mx-auto px-6 max-w-screen-2xl">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-4xl font-bold text-brand-text font-serif">{businessData.blog.title}</h2>
                            {/* "See All" Link Removed */}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {(businessData.blog.items || []).map(post => (
                                <div key={post.title} className="group">
                                    <a href="#" className="block overflow-hidden aspect-video bg-brand-bg">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </a>
                                    <div className="mt-4">
                                        <p className="text-sm text-brand-text opacity-60 uppercase tracking-wider">{post.date}</p>
                                        <h3 className="text-xl font-serif font-medium text-brand-text mt-2"><a href="#" className="hover:text-brand-secondary">{post.title}</a></h3>
                                        <p className="text-brand-text opacity-70 mt-2">{post.text}</p>
                                        <a href="#" className="inline-block mt-4 font-semibold text-brand-text text-sm  underline-offset-4">Read more →</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </Editable>
        </>
    );
}