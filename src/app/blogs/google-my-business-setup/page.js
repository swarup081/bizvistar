'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [{"question":"Is Google My Business really free?","answer":"100% free. Google does not charge for business listings. Some third-party services charge to 'manage' your GMB — you do not need them."},{"question":"How long does verification take?","answer":"Google sends a postcard with a verification code to your business address. This takes 5-14 days in India. Some businesses qualify for phone or email verification which is instant."},{"question":"Can I have a GMB listing without a physical store?","answer":"Yes. Service-area businesses (like home bakers, photographers, plumbers) can set a service radius instead of displaying an address."}];
  const toc = [{"href":"#setup","label":"01. Setting up your listing"},{"href":"#optimize","label":"02. Optimization for higher rankings"},{"href":"#reviews","label":"03. Getting more 5-star reviews"},{"href":"#faq","label":"FAQ"}];
  return (
    <BlogPostLayout category="MARKETING" title="How to Set Up Google My Business and Get Local Customers" date="May 3" heroImage="/blogs/blog_startup_1778964908511.png" tableOfContents={toc} faqs={faqs} currentHref="/blogs/google-my-business-setup">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">If you serve local customers — whether you run a restaurant, salon, boutique, or home bakery — Google My Business is your single most powerful free marketing tool. When someone searches 'bakery near me' or 'best salon in Pune,' Google My Business determines which businesses appear in the coveted map pack results at the very top of the page.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">This guide walks you through setting up, verifying, and optimizing your Google My Business listing to dominate local search results. We cover photos, reviews, posts, Q&A, and the specific ranking factors that determine your position in the local pack.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#setup" className="hover:underline text-[#8A63D2]">01. Setting up your listing</Link></li>
        <li><Link href="#optimize" className="hover:underline text-[#8A63D2]">02. Optimization for higher rankings</Link></li>
        <li><Link href="#reviews" className="hover:underline text-[#8A63D2]">03. Getting more 5-star reviews</Link></li>
      </ul>
      <h3 id="setup" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Setting up your listing</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Go to business.google.com and claim or create your listing. Fill out every single field — business name (exact legal name), address, phone number, website URL, business hours, and category. Google rewards complete profiles. Choose the most specific category available (e.g., 'Custom Cake Shop' rather than just 'Bakery').</p>

      <h3 id="optimize" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Optimization for higher rankings</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Add 10+ high-quality photos of your business, products, and team. Write a compelling 750-character business description with natural keywords. Post weekly updates (offers, events, new products) — Google treats active listings as more relevant. Respond to every review within 24 hours, positive or negative.</p>

      <h3 id="reviews" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Getting more 5-star reviews</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">After every positive interaction, send a WhatsApp message with your direct Google review link. Make it effortless — one click to review. Offer a small incentive (not for 5 stars specifically, but for leaving any honest review). Businesses with 50+ reviews rank significantly higher than those with 5 reviews, regardless of rating.</p>
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
