'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [
    {
        "question": "How often should I change prices?",
        "answer": "Test price changes quarterly. Never change prices more than 10-15% at once. Gradual increases are psychologically easier for customers to accept than sudden jumps."
    },
    {
        "question": "Should I match my competitor's lowest price?",
        "answer": "Almost never. Competing on price is a race to the bottom. Instead, differentiate on quality, service, branding, or convenience and charge accordingly."
    },
    {
        "question": "How do I price digital products?",
        "answer": "Digital products have near-zero marginal cost, so use value-based pricing exclusively. An ebook that saves someone ₹50,000 in mistakes is easily worth ₹999, regardless of the 2 hours it took you to write."
    }
];
  const toc = [
    {
        "href": "#cost",
        "label": "01. Cost-plus pricing (the foundation)"
    },
    {
        "href": "#value",
        "label": "02. Value-based pricing (the profit maximizer)"
    },
    {
        "href": "#psychology",
        "label": "03. Psychological pricing tactics"
    },
    {
        "href": "#faq",
        "label": "FAQ"
    }
];

  return (
    <BlogPostLayout category="E-COMMERCE" title="Pricing Strategy Guide: How to Price Products for Maximum Profit" date="May 9" heroImage="/blogs/blog_ai_1778964944951.png" heroAlt="Pricing Strategy Guide: How to Price Products for Maximum Profit" tableOfContents={toc} faqs={faqs} currentHref="/blogs/pricing-strategy-small-business">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Most small business owners price their products using one of two terrible methods: they either copy their competitor's price minus ₹50, or they guess a number that 'feels right.' Both approaches leave enormous amounts of money on the table. Pricing is the single most powerful lever for profitability — a 1% improvement in pricing yields an average 11% improvement in profit.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">This guide covers four proven pricing frameworks: cost-plus pricing, value-based pricing, competitive pricing, and psychological pricing. We will show you when to use each strategy, how to calculate your prices mathematically, and how to test price changes without losing customers.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#cost" className="hover:underline text-[#8A63D2]">01. Cost-plus pricing (the foundation)</Link></li>
        <li><Link href="#value" className="hover:underline text-[#8A63D2]">02. Value-based pricing (the profit maximizer)</Link></li>
        <li><Link href="#psychology" className="hover:underline text-[#8A63D2]">03. Psychological pricing tactics</Link></li>
      </ul>
      <h3 id="cost" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Cost-plus pricing (the foundation)</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Calculate your true total cost: raw materials + labor (including YOUR time at a fair hourly rate) + packaging + shipping + platform fees + overhead. Then add your desired profit margin (typically 40-60% for physical products, 70-90% for digital products). This gives you your price floor — never sell below this number. Most beginners undervalue their own labor, leading to prices that technically 'sell' but generate zero actual profit.</p>

      <h3 id="value" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Value-based pricing (the profit maximizer)</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Price based on the value your product delivers to the customer, not what it costs you to make. A handmade birthday cake might cost ₹800 in ingredients and labor, but the emotional value of a perfect birthday celebration is worth ₹2,500 to the buyer. Premium branding, professional photography, and excellent customer experience justify higher prices.</p>

      <h3 id="psychology" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Psychological pricing tactics</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">₹999 feels dramatically cheaper than ₹1,000 (charm pricing). Offering three tiers (Basic/Standard/Premium) makes the middle option feel like the best value (anchoring). Showing the original price crossed out next to the sale price increases perceived value. Bundle complementary products for a 'deal' that actually increases your AOV.</p>
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
