'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [{"question":"How long did it take to build the portfolio?","answer":"The initial website took one weekend. He spent an additional week writing case studies for his best projects. Total time investment: about 20 hours."},{"question":"Did he raise his prices?","answer":"Yes. The professional website justified a 40% price increase. Clients perceived him as more established and professional compared to freelancers without websites."},{"question":"What about platforms like Fiverr?","answer":"Rahul kept his Fiverr profile for small projects but directed premium clients to his website. The website positioned him as a premium professional, not a commodity competing on price."}];
  const toc = [{"href":"#problem","label":"01. The cold-outreach trap"},{"href":"#website","label":"02. Building the portfolio website"},{"href":"#seo","label":"03. SEO and content strategy"},{"href":"#faq","label":"FAQ"}];
  return (
    <BlogPostLayout category="CASE STUDIES" title="Case Study: How a Freelance Designer Doubled Clients with a Portfolio Site" date="Apr 21" heroImage="/blogs/blog_domain_new_1778965439235.png" tableOfContents={toc} faqs={faqs} currentHref="/blogs/freelancer-portfolio-website">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Rahul was a talented freelance graphic designer in Bangalore, getting clients through cold DMs on LinkedIn and word-of-mouth referrals. He was good at his craft but terrible at marketing himself. His monthly income fluctuated wildly — ₹40,000 one month, ₹15,000 the next. He had no online presence beyond a LinkedIn profile and an outdated Behance page.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">After building a professional portfolio website on Bizvistar, Rahul went from chasing clients to having clients chase him. Within 4 months, his monthly income stabilized at ₹90,000+ with a waiting list of prospects. Here is how he did it.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#problem" className="hover:underline text-[#8A63D2]">01. The cold-outreach trap</Link></li>
        <li><Link href="#website" className="hover:underline text-[#8A63D2]">02. Building the portfolio website</Link></li>
        <li><Link href="#seo" className="hover:underline text-[#8A63D2]">03. SEO and content strategy</Link></li>
      </ul>
      <h3 id="problem" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. The cold-outreach trap</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Rahul spent 2 hours daily sending personalized DMs to potential clients on LinkedIn. His response rate was 3%. Of those who responded, only 20% converted into paying projects. He was spending more time marketing than actually designing. The worst part: every month started from zero because he had no inbound lead generation system.</p>

      <h3 id="website" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Building the portfolio website</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Rahul chose a minimal, image-forward Bizvistar template. He showcased his 12 best projects with before/after comparisons, client testimonials, and detailed case studies explaining his design process. He added a 'Start a Project' form that collected project details, budget range, and timeline. The form replaced hours of back-and-forth discovery calls.</p>

      <h3 id="seo" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. SEO and content strategy</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Rahul started writing one blog post per week about design topics: 'Logo Design Trends 2026,' 'Brand Color Guide for Startups,' etc. These posts ranked on Google for niche design keywords and brought 200+ monthly visitors. His website became a trust-building machine — prospects could see his work, read his expertise, and hire him all in one place. Inbound leads replaced cold outreach entirely.</p>
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
