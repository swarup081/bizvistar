'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [{"question":"Which email platform should I use?","answer":"For beginners, Mailchimp's free plan (up to 500 contacts) is excellent. As you grow, platforms like ConvertKit or Bizvistar's built-in email tools offer more automation features."},{"question":"How often should I email my list?","answer":"Start with once per week. Consistency is more important than frequency. Never email daily unless you are running a limited-time launch campaign."},{"question":"What's a good open rate?","answer":"Industry average is 20-25%. Above 30% is excellent. If your open rate drops below 15%, your subject lines need improvement or your list needs cleaning."}];
  const toc = [{"href":"#list","label":"01. Building your subscriber list"},{"href":"#write","label":"02. Writing emails that get opened"},{"href":"#automate","label":"03. Setting up automated sequences"},{"href":"#faq","label":"FAQ"}];
  return (
    <BlogPostLayout category="MARKETING" title="Email Marketing 101: Build Your First Newsletter That Converts" date="May 4" heroImage="/blogs/blog_loyalty_1778964854679.png" tableOfContents={toc} faqs={faqs} currentHref="/blogs/email-marketing-small-business">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Email marketing has a 36x return on investment — for every ₹1 spent, you earn ₹36 back. No other marketing channel comes close. Yet most small business owners ignore email because they think it is old-fashioned or complicated. The truth is, email is the most direct, personal, and profitable way to communicate with your customers.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">This guide teaches you everything from building your subscriber list from zero to writing emails that people actually open, click, and buy from. No technical jargon — just practical, step-by-step instructions for your first email marketing campaign.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#list" className="hover:underline text-[#8A63D2]">01. Building your subscriber list</Link></li>
        <li><Link href="#write" className="hover:underline text-[#8A63D2]">02. Writing emails that get opened</Link></li>
        <li><Link href="#automate" className="hover:underline text-[#8A63D2]">03. Setting up automated sequences</Link></li>
      </ul>
      <h3 id="list" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Building your subscriber list</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Offer something valuable in exchange for email addresses: a discount code, free guide, exclusive access, or early product notifications. Place signup forms on your homepage, checkout page, and blog sidebar. A simple 'Get 15% off your first order' popup converts 3-5% of website visitors into subscribers.</p>

      <h3 id="write" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Writing emails that get opened</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Subject lines are everything — 47% of recipients open emails based on the subject line alone. Keep them under 50 characters, create curiosity or urgency, and personalize with the recipient's name. The email body should be scannable: short paragraphs, bold key points, and a single clear CTA button.</p>

      <h3 id="automate" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Setting up automated sequences</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Create a 3-email welcome sequence: Email 1 (immediately) delivers the promised discount and introduces your brand. Email 2 (Day 3) shares your best-selling products with social proof. Email 3 (Day 7) creates urgency with a limited-time offer. This sequence runs on autopilot and converts subscribers into buyers while you sleep.</p>
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
