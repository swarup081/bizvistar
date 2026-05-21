'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [{"question":"Which platform drives the most website traffic?","answer":"For Indian businesses, Instagram and YouTube are the top traffic drivers. Pinterest is underrated for visual products (fashion, home decor, food). LinkedIn works best for B2B services."},{"question":"How often should I post on social media?","answer":"Quality over quantity. 3-4 high-quality posts per week with genuine value outperform daily low-effort posts. Consistency matters more than frequency."},{"question":"Should I use paid ads to drive traffic?","answer":"Start with organic strategies first. Once you have a converting website, paid ads (Instagram/Facebook) can amplify your reach. But never pay for traffic to a website that does not convert."}];
  const toc = [{"href":"#bio","label":"01. Optimize your link-in-bio"},{"href":"#teasers","label":"02. Content teaser strategy"},{"href":"#stories","label":"03. Instagram Stories with swipe-up CTAs"},{"href":"#faq","label":"FAQ"}];
  return (
    <BlogPostLayout category="MARKETING" title="15 Ways to Drive Social Media Followers to Your Website" date="May 5" heroImage="/blogs/blog_tiktok_1778964932618.png" tableOfContents={toc} faqs={faqs} currentHref="/blogs/social-media-to-website-traffic">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Having 10,000 Instagram followers means nothing if none of them ever visit your website. Social media followers are rented audience on someone else's platform. Your website visitors are owned traffic on your own platform. The goal of every social media post should be to move followers from Instagram's ecosystem to yours.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">This guide covers 15 proven tactics to convert passive social media scrollers into active website visitors — and ultimately paying customers. From optimized link-in-bio strategies to content teasers that create irresistible click-through urges.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#bio" className="hover:underline text-[#8A63D2]">01. Optimize your link-in-bio</Link></li>
        <li><Link href="#teasers" className="hover:underline text-[#8A63D2]">02. Content teaser strategy</Link></li>
        <li><Link href="#stories" className="hover:underline text-[#8A63D2]">03. Instagram Stories with swipe-up CTAs</Link></li>
      </ul>
      <h3 id="bio" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Optimize your link-in-bio</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Replace generic Linktree with a custom Bizvistar landing page. This gives you full branding control, analytics, and direct integration with your store. Include your top 3-5 most important links: shop, latest blog post, current offer, and contact form.</p>

      <h3 id="teasers" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Content teaser strategy</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Never give away the full story on social media. Share 70% of the value in your post, then say 'Read the complete guide on our website — link in bio.' This creates a curiosity gap that drives clicks. Works especially well for tutorials, listicles, and case studies.</p>

      <h3 id="stories" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Instagram Stories with swipe-up CTAs</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Use Stories for time-sensitive promotions: flash sales, limited stock alerts, and new blog post announcements. Add countdown stickers, poll stickers for engagement, and always end with a clear CTA pointing to your website.</p>
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
