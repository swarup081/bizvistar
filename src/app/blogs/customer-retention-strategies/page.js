'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [{"question":"What is customer lifetime value (LTV)?","answer":"LTV = Average order value × Purchase frequency × Average customer lifespan. If a customer spends ₹1,000 per order, buys 4 times per year, and stays for 3 years, their LTV is ₹12,000."},{"question":"How do I measure retention rate?","answer":"Retention rate = ((Customers at end of period - New customers) / Customers at start) × 100. A 40%+ annual retention rate is good for e-commerce."},{"question":"Is it worth offering free shipping to repeat customers?","answer":"Absolutely. Free shipping for returning customers is one of the most effective retention incentives. The cost of shipping is far less than the cost of acquiring a new customer."}];
  const toc = [{"href":"#followup","label":"01. Post-purchase follow-up sequence"},{"href":"#loyalty","label":"02. Simple loyalty program"},{"href":"#win","label":"03. Win-back campaigns for lapsed customers"},{"href":"#faq","label":"FAQ"}];
  return (
    <BlogPostLayout category="OPERATIONS" title="Customer Retention Strategies That Actually Work for Small Businesses" date="Apr 30" heroImage="/blogs/blog_loyalty_1778964854679.png" tableOfContents={toc} faqs={faqs} currentHref="/blogs/customer-retention-strategies">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Acquiring a new customer costs 5-7x more than retaining an existing one. Yet most small businesses spend 90% of their marketing budget chasing new customers while completely ignoring the ones they already have. A 5% increase in customer retention can boost profits by 25-95%. These are not theoretical numbers — they are proven across industries.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">This guide covers practical, implementable retention strategies that small businesses can start using today. From post-purchase follow-ups to loyalty programs to personalized re-engagement campaigns, each tactic is designed to maximize the lifetime value of every customer you acquire.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#followup" className="hover:underline text-[#8A63D2]">01. Post-purchase follow-up sequence</Link></li>
        <li><Link href="#loyalty" className="hover:underline text-[#8A63D2]">02. Simple loyalty program</Link></li>
        <li><Link href="#win" className="hover:underline text-[#8A63D2]">03. Win-back campaigns for lapsed customers</Link></li>
      </ul>
      <h3 id="followup" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Post-purchase follow-up sequence</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">The 48 hours after a purchase are the most critical window for building loyalty. Send: an immediate order confirmation with tracking, a Day 2 email asking if they received the product, a Day 7 email requesting a review, and a Day 30 email with a personalized recommendation based on their purchase. This simple sequence transforms one-time buyers into repeat customers.</p>

      <h3 id="loyalty" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Simple loyalty program</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">You do not need a complex points system. A simple 'Buy 5 Get 1 Free' stamp card (digital version on your website) works beautifully for small businesses. Alternatively, offer returning customers an automatic 10% discount code in their order confirmation email. The key is making repeat purchases feel rewarded.</p>

      <h3 id="win" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Win-back campaigns for lapsed customers</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Segment customers who have not purchased in 60+ days. Send them a personalized 'We miss you' email with a limited-time 15-20% discount code. Include images of new products they have not seen. This simple campaign typically recovers 5-10% of lapsed customers at virtually zero cost.</p>
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
