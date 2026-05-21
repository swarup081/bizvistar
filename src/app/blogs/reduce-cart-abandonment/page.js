'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [
    {
        "question": "What's a good cart abandonment rate?",
        "answer": "Industry average in India is 70-75%. Anything below 60% is excellent. Below 50% means your checkout is world-class."
    },
    {
        "question": "Should I offer COD to reduce abandonment?",
        "answer": "In India, yes. COD still accounts for 40-60% of e-commerce transactions. Not offering it eliminates a massive segment of buyers. However, consider a small COD fee (₹40-50) to discourage frivolous orders."
    },
    {
        "question": "Do exit-intent popups work?",
        "answer": "Yes, when used correctly. An exit-intent popup offering 10% off for first-time buyers can recover 5-10% of abandoning visitors. But never show more than one popup per session."
    }
];
  const toc = [
    {
        "href": "#costs",
        "label": "01. Eliminate surprise costs"
    },
    {
        "href": "#checkout",
        "label": "02. Simplify the checkout process"
    },
    {
        "href": "#recovery",
        "label": "03. Abandoned cart recovery emails"
    },
    {
        "href": "#faq",
        "label": "FAQ"
    }
];

  return (
    <BlogPostLayout category="E-COMMERCE" title="12 Proven Ways to Reduce Cart Abandonment on Your Store" date="May 11" heroImage="/blogs/blog_ecommerce_1778964894297.png" heroAlt="12 Proven Ways to Reduce Cart Abandonment on Your Store" tableOfContents={toc} faqs={faqs} currentHref="/blogs/reduce-cart-abandonment">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Cart abandonment in India exceeds 70%. That means for every 10 customers who add products to their cart, 7 leave without paying. If your store generates ₹1 lakh in monthly revenue, you are likely losing ₹2.3 lakhs in abandoned carts. These are not window shoppers — these are people who demonstrated clear purchase intent and then walked away.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">The good news is that cart abandonment is a solvable problem. Most abandonment is caused by fixable friction points: unexpected shipping costs, complicated checkout processes, lack of payment options, and trust concerns. This guide covers 12 data-backed strategies that can recover 15-30% of your abandoned carts.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#costs" className="hover:underline text-[#8A63D2]">01. Eliminate surprise costs</Link></li>
        <li><Link href="#checkout" className="hover:underline text-[#8A63D2]">02. Simplify the checkout process</Link></li>
        <li><Link href="#recovery" className="hover:underline text-[#8A63D2]">03. Abandoned cart recovery emails</Link></li>
      </ul>
      <h3 id="costs" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Eliminate surprise costs</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">48% of cart abandonment happens because of unexpected costs at checkout — shipping fees, taxes, or handling charges that were not visible on the product page. The fix is radical transparency: show the total cost (including shipping) on the product page itself. Better yet, offer free shipping above a threshold. A 'Free shipping on orders above ₹999' banner can increase your average order value by 30%.</p>

      <h3 id="checkout" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Simplify the checkout process</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Every additional form field reduces conversions by 7%. Guest checkout is mandatory — never force account creation before purchase. Auto-fill addresses using Google Places API. Accept UPI, cards, wallets, and COD. The fewer taps between 'Add to Cart' and 'Order Confirmed,' the higher your conversion rate.</p>

      <h3 id="recovery" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Abandoned cart recovery emails</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Set up automated emails that trigger 1 hour, 24 hours, and 72 hours after abandonment. Include the exact product image, a compelling subject line ('You left something behind'), and a direct link back to their pre-filled cart. Adding a 10% discount code in the 72-hour email can recover an additional 15% of abandoned carts.</p>
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
