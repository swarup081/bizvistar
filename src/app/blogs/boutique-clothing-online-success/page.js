'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [{"question":"Did Priya stop using Instagram?","answer":"No. Instagram became her marketing channel, not her sales channel. She posted content that drove traffic to her website, where the automated checkout handled the rest."},{"question":"How did she handle returns?","answer":"She added a clear return policy on her website and used Shiprocket for reverse logistics. Returns dropped 40% because customers could see accurate photos, sizes, and descriptions before buying."},{"question":"What was her biggest challenge?","answer":"Product photography. She invested ₹5,000 in a one-time professional photoshoot and then learned smartphone photography for new arrivals. The quality difference immediately boosted conversions."}];
  const toc = [{"href":"#before","label":"01. The before picture"},{"href":"#transition","label":"02. The transition to Bizvistar"},{"href":"#results","label":"03. The results after 6 months"},{"href":"#faq","label":"FAQ"}];
  return (
    <BlogPostLayout category="CASE STUDIES" title="Case Study: How a Local Boutique Grew 300% by Going Online" date="Apr 22" heroImage="/blogs/blog_sneaker_1778965493480.png" tableOfContents={toc} faqs={faqs} currentHref="/blogs/boutique-clothing-online-success">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Priya ran a small clothing boutique in Pune, selling curated ethnic wear through Instagram DMs and WhatsApp broadcasts. She was doing ₹80,000 per month in revenue but spending 6 hours daily answering messages, sharing prices, and coordinating manual UPI payments. She was exhausted, her growth was capped by her personal availability, and she was losing 40% of interested buyers to DM drop-off.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">Within 6 months of launching a Bizvistar website, her revenue hit ₹3,20,000 per month — a 300% increase. Her daily operational time dropped from 6 hours to 90 minutes. This case study breaks down exactly what she did, step by step.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#before" className="hover:underline text-[#8A63D2]">01. The before picture</Link></li>
        <li><Link href="#transition" className="hover:underline text-[#8A63D2]">02. The transition to Bizvistar</Link></li>
        <li><Link href="#results" className="hover:underline text-[#8A63D2]">03. The results after 6 months</Link></li>
      </ul>
      <h3 id="before" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. The before picture</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Priya posted new arrivals on Instagram, got 50-100 DMs daily asking for prices and sizes, manually shared UPI details, waited for payment screenshots, and maintained inventory in a notebook. She could not take vacations because the business stopped when she stopped responding. Her conversion rate from DM inquiry to completed payment was just 25%.</p>

      <h3 id="transition" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. The transition to Bizvistar</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Priya set up her Bizvistar store in one weekend using a fashion template. She uploaded her top 40 products with professional photos, sizes, prices, and descriptions. She connected Razorpay for automated payments. She changed her Instagram bio to link to her website instead of saying 'DM for orders.' The entire setup cost her ₹1,499/month.</p>

      <h3 id="results" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. The results after 6 months</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Website conversion rate: 4.2% (vs 25% of a much smaller DM pool). Average order value increased 35% because customers browsed and added multiple items. 60% of sales came from repeat customers via email marketing. She hired a part-time packer and scaled to 150+ orders per month without increasing her personal working hours. Revenue: ₹3,20,000/month.</p>
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
