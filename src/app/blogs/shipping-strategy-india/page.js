'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [
    {
        "question": "How do I calculate the right shipping fee?",
        "answer": "Add your actual courier cost + packaging material cost + a 10% buffer for returns. Then decide how much to subsidize versus pass to the customer based on your margins."
    },
    {
        "question": "Should I offer international shipping?",
        "answer": "Only if your product has proven international demand. Start with 2-3 countries using a partner like DHL Express. International returns are extremely expensive."
    },
    {
        "question": "How do I handle shipping for fragile items?",
        "answer": "Invest in proper packaging (bubble wrap, corrugated boxes, 'Fragile' stickers). The ₹30-50 spent on good packaging prevents ₹500+ in replacement costs for damaged goods."
    }
];
  const toc = [
    {
        "href": "#models",
        "label": "01. Shipping models compared"
    },
    {
        "href": "#cod",
        "label": "02. The COD strategy"
    },
    {
        "href": "#partners",
        "label": "03. Choosing courier partners"
    },
    {
        "href": "#faq",
        "label": "FAQ"
    }
];

  return (
    <BlogPostLayout category="E-COMMERCE" title="How to Set Up a Shipping Strategy for Your Indian E-commerce Store" date="May 10" heroImage="/blogs/blog_loyalty_1778964854679.png" heroAlt="How to Set Up a Shipping Strategy for Your Indian E-commerce Store" tableOfContents={toc} faqs={faqs} currentHref="/blogs/shipping-strategy-india">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Shipping is where most Indian e-commerce businesses silently bleed money. Overcharging on shipping kills conversions. Undercharging eats your margins. Offering free shipping without a strategy bankrupts you. The difference between a profitable and unprofitable store often comes down entirely to how intelligently you structure your shipping fees.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">This guide breaks down every shipping model — flat-rate, weight-based, free-shipping thresholds, zone-based, and hyper-local delivery — with real calculations showing which works best for different product types. We will also cover COD strategy, return logistics, and packaging cost optimization.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#models" className="hover:underline text-[#8A63D2]">01. Shipping models compared</Link></li>
        <li><Link href="#cod" className="hover:underline text-[#8A63D2]">02. The COD strategy</Link></li>
        <li><Link href="#partners" className="hover:underline text-[#8A63D2]">03. Choosing courier partners</Link></li>
      </ul>
      <h3 id="models" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Shipping models compared</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Flat-rate shipping (₹50-100 regardless of weight) is the simplest and works well for uniform-sized products like clothing. Weight-based shipping is fairer for stores with products of varying sizes. Free shipping above a threshold (e.g., ₹999) dramatically increases average order value. The threshold should be set 20-30% above your current AOV to incentivize larger purchases.</p>

      <h3 id="cod" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. The COD strategy</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Cash on delivery accounts for 45% of Indian e-commerce transactions. Not offering COD means losing nearly half your potential customers. However, COD has a notorious 15-25% return-to-origin (RTO) rate. Mitigate this by: charging a small COD fee (₹30-50), sending order confirmation WhatsApp messages, and requiring phone number verification before dispatch.</p>

      <h3 id="partners" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Choosing courier partners</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">For pan-India shipping, aggregate platforms like Shiprocket, Delhivery, or iThink Logistics offer competitive rates by comparing multiple couriers. For hyper-local delivery (same-city), consider Dunzo, Shadowfax, or Borzo. Always negotiate rates — even small stores can get 10-15% discounts by committing to monthly volume.</p>
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
