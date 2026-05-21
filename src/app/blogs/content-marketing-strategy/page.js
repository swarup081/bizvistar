'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [{"question":"How often should I publish content?","answer":"Quality beats quantity. One excellent, detailed blog post per week outperforms daily thin content. Start with 2-4 pieces per month and increase as you build a workflow."},{"question":"How do I come up with content ideas?","answer":"Use AnswerThePublic.com to find questions people ask about your industry. Read competitor blogs. Ask your customers what they struggle with. Check Google's 'People Also Ask' boxes."},{"question":"How long before content marketing shows ROI?","answer":"3-6 months for organic search traffic. However, you can see immediate results by sharing content through email and social media channels you already have."}];
  const toc = [{"href":"#pillars","label":"01. Content pillar strategy"},{"href":"#calendar","label":"02. Building a content calendar"},{"href":"#repurpose","label":"03. Repurposing for maximum reach"},{"href":"#faq","label":"FAQ"}];
  return (
    <BlogPostLayout category="MARKETING" title="Content Marketing Strategy for Small Business Owners" date="May 2" heroImage="/blogs/blog_cake_1778965507710.png" tableOfContents={toc} faqs={faqs} currentHref="/blogs/content-marketing-strategy">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Content marketing is not just writing blog posts and hoping someone reads them. It is a strategic approach to creating valuable, relevant content that attracts your ideal customers, establishes your authority, and drives organic sales. Companies that invest in content marketing see 6x higher conversion rates than those that do not.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">This guide gives you a practical, no-fluff content marketing framework designed specifically for small business owners with limited time and budget. You will learn how to identify content topics your audience craves, create content efficiently, and distribute it across channels for maximum impact.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#pillars" className="hover:underline text-[#8A63D2]">01. Content pillar strategy</Link></li>
        <li><Link href="#calendar" className="hover:underline text-[#8A63D2]">02. Building a content calendar</Link></li>
        <li><Link href="#repurpose" className="hover:underline text-[#8A63D2]">03. Repurposing for maximum reach</Link></li>
      </ul>
      <h3 id="pillars" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Content pillar strategy</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Choose 3-5 core topics directly related to your business. A bakery's pillars might be: baking tutorials, ingredient guides, behind-the-scenes, customer stories, and seasonal recipes. Every piece of content you create should fall under one of these pillars. This creates topical authority that Google rewards with higher rankings.</p>

      <h3 id="calendar" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Building a content calendar</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Plan content 30 days in advance. Mix content types: 40% educational (how-to guides), 30% inspirational (customer stories, behind-the-scenes), 20% promotional (product features, offers), and 10% entertaining (memes, trends). Use a simple Google Sheet with columns for date, topic, format, platform, and status.</p>

      <h3 id="repurpose" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Repurposing for maximum reach</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">One blog post can become: 5 Instagram carousel slides, 1 YouTube video, 3 Twitter threads, 1 email newsletter, and 10 Pinterest pins. This is not lazy — it is efficient. Different audiences consume content on different platforms in different formats. Repurposing ensures your message reaches everyone.</p>
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
