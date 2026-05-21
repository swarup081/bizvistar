'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [
    {
        "question": "What smartphone is best for product photos?",
        "answer": "Any flagship phone from the last 3 years (iPhone 13+, Samsung S21+, Pixel 6+) is more than sufficient. The camera quality difference between a ₹30K and ₹1.5L phone is negligible for product photography."
    },
    {
        "question": "Do I need a tripod?",
        "answer": "Highly recommended. A basic smartphone tripod costs ₹300-500 and eliminates camera shake, ensuring consistently sharp images across your entire product catalog."
    },
    {
        "question": "Should I use portrait mode for products?",
        "answer": "Only for lifestyle shots. For clean product-on-white images, use standard photo mode to keep the entire product in sharp focus."
    }
];
  const toc = [
    {
        "href": "#lighting",
        "label": "01. Master natural lighting"
    },
    {
        "href": "#composition",
        "label": "02. Composition rules that sell"
    },
    {
        "href": "#editing",
        "label": "03. Free editing apps that transform photos"
    },
    {
        "href": "#faq",
        "label": "FAQ"
    }
];

  return (
    <BlogPostLayout category="E-COMMERCE" title="How to Take Stunning Product Photos with Just Your Smartphone" date="May 12" heroImage="/blogs/blog_sneaker_1778965493480.png" heroAlt="How to Take Stunning Product Photos with Just Your Smartphone" tableOfContents={toc} faqs={faqs} currentHref="/blogs/product-photography-smartphone">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">You do not need a ₹2 lakh DSLR camera to take product photos that sell. In 2026, flagship smartphones have cameras that rival professional setups. The secret is not the equipment — it is the lighting, composition, and editing technique. This guide teaches you professional-grade product photography using only your smartphone and zero budget.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">Bad product photos are the number one reason online stores fail to convert browsers into buyers. When a customer cannot touch or feel your product, the photo IS the product. Blurry, poorly lit, cluttered images instantly communicate 'amateur' and 'untrustworthy.' We will fix that today.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#lighting" className="hover:underline text-[#8A63D2]">01. Master natural lighting</Link></li>
        <li><Link href="#composition" className="hover:underline text-[#8A63D2]">02. Composition rules that sell</Link></li>
        <li><Link href="#editing" className="hover:underline text-[#8A63D2]">03. Free editing apps that transform photos</Link></li>
      </ul>
      <h3 id="lighting" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Master natural lighting</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">The single most important factor in product photography is lighting. Position your product near a large window with indirect sunlight. Avoid direct harsh sunlight which creates ugly shadows. Use a white bedsheet as a diffuser. Shoot between 10AM-2PM for the most consistent natural light. A simple white posterboard behind the product creates a clean, professional backdrop.</p>

      <h3 id="composition" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Composition rules that sell</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Use the rule of thirds — place your product at the intersection points, not dead center. Show scale by including common objects nearby. Shoot from multiple angles: straight-on, 45-degree, flat-lay, and detail close-ups. E-commerce stores with 4+ images per product see 30% higher conversion rates than those with just one.</p>

      <h3 id="editing" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Free editing apps that transform photos</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Snapseed (Google) and Lightroom Mobile (Adobe) are both free and incredibly powerful. Key edits: increase brightness, boost contrast slightly, adjust white balance to neutral, and crop to square for Instagram/product grids. Never use heavy filters — they misrepresent colors and lead to returns.</p>
      <div className="w-full min-h-[250px] md:min-h-0 md:aspect-[21/9] bg-[#E5E0FA] rounded-2xl mb-12 mt-12 flex flex-col items-center justify-center overflow-hidden relative shadow-inner">
        <img src="/landing/bgwaveytexture.png" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="Texture" />
        <div className="text-center p-6 md:p-8 z-10 relative">
          <h3 className="text-2xl md:text-3xl font-black text-[#1a1b4b] mb-4">Ready to Get Started?</h3>
          <p className="text-[#1a1b4b] text-base md:text-lg max-w-2xl mx-auto mb-6">Build your professional website today with Bizvistar.</p>
          <Link href="/auth" className="px-6 md:px-8 py-3 bg-[#1a1b4b] text-white rounded-full font-bold hover:bg-black transition-colors inline-block text-[14px] md:text-[16px]">Start Building Free</Link>
        </div>
      </div>
    </BlogPostLayout>
  );
}
