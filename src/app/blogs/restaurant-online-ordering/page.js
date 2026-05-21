'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [{"question":"Did they stop using Swiggy and Zomato?","answer":"No. They kept aggregator listings for new customer discovery but incentivized repeat customers to order directly through their website with loyalty rewards and exclusive menu items."},{"question":"How did they handle delivery?","answer":"They used a mix of their own delivery staff for nearby orders and Dunzo/Shadowfax for longer distances. The cost was 60-70% less than aggregator commissions."},{"question":"What was the hardest part?","answer":"Convincing existing customers to switch from the convenience of Swiggy. The 10% website discount and a loyalty program (every 10th order free) were the key incentives that drove adoption."}];
  const toc = [{"href":"#challenge","label":"01. The aggregator commission problem"},{"href":"#solution","label":"02. Building direct ordering"},{"href":"#impact","label":"03. The financial impact"},{"href":"#faq","label":"FAQ"}];
  return (
    <BlogPostLayout category="CASE STUDIES" title="Case Study: How a Restaurant Increased Revenue 40% with Online Ordering" date="Apr 20" heroImage="/blogs/blog_cake_1778965507710.png" tableOfContents={toc} faqs={faqs} currentHref="/blogs/restaurant-online-ordering">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">The Sharma family ran a popular North Indian restaurant in Bangalore for 15 years. Despite excellent food and loyal customers, their revenue had plateaued at ₹8 lakhs per month. They relied entirely on dine-in customers and phone orders, losing significant business to Swiggy and Zomato competitors who had embraced online ordering.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">By adding a direct online ordering system through their Bizvistar website, they increased monthly revenue by 40% to ₹11.2 lakhs — while saving 25% on the commission fees they were paying to food delivery aggregators. This case study shows exactly how they did it.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#challenge" className="hover:underline text-[#8A63D2]">01. The aggregator commission problem</Link></li>
        <li><Link href="#solution" className="hover:underline text-[#8A63D2]">02. Building direct ordering</Link></li>
        <li><Link href="#impact" className="hover:underline text-[#8A63D2]">03. The financial impact</Link></li>
      </ul>
      <h3 id="challenge" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. The aggregator commission problem</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Swiggy and Zomato charged 25-30% commission on every order. On a ₹500 order, the restaurant kept only ₹350-375 after commissions. For their average 40 daily delivery orders, they were paying ₹1.5-2 lakhs per month in aggregator fees. The food was the same, the delivery was the same — they were just paying a massive tax for customer access.</p>

      <h3 id="solution" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Building direct ordering</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">They set up a Bizvistar website with their complete menu, high-quality food photography, and integrated online ordering. They offered a 10% discount for orders placed directly through their website (still cheaper than paying 25% to aggregators). They promoted the website through table tent cards, receipt QR codes, and WhatsApp broadcasts to their existing customer database of 2,000+ contacts.</p>

      <h3 id="impact" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. The financial impact</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Within 3 months, 60% of their delivery orders shifted from aggregators to direct website ordering. Monthly savings on commissions: ₹90,000. New customers from Google search (SEO for 'restaurant near me'): 15% revenue increase. Average order value on website was 20% higher than on aggregators because customers were not comparison-shopping. Total revenue increase: 40%.</p>
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
