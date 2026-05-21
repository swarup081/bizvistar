'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [{"question":"What is a good page load time?","answer":"Under 3 seconds on mobile. Under 2 seconds is excellent. Above 5 seconds and you are losing over 40% of visitors before they even see your content."},{"question":"Does hosting affect speed?","answer":"Enormously. Cheap shared hosting can add 1-3 seconds to response time. Bizvistar uses premium cloud hosting with global CDN, ensuring fast load times regardless of visitor location."},{"question":"Will speed optimization break my design?","answer":"Not if done correctly. Image compression is invisible to the human eye. Code minification does not change functionality. The only visible change is that everything loads faster."}];
  const toc = [{"href":"#audit","label":"01. Auditing your current speed"},{"href":"#images","label":"02. Image optimization (the biggest win)"},{"href":"#fonts","label":"03. Minimize third-party scripts"},{"href":"#faq","label":"FAQ"}];
  return (
    <BlogPostLayout category="DESIGN & SEO" title="Website Speed Optimization: Why Every Second Costs You Money" date="Apr 26" heroImage="/blogs/blog_domain_1778964877795.png" tableOfContents={toc} faqs={faqs} currentHref="/blogs/website-speed-optimization">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">A 1-second delay in page load time reduces conversions by 7%, page views by 11%, and customer satisfaction by 16%. For a store doing ₹2 lakhs per month, that single second costs you ₹14,000 every month in lost sales. Speed is not a technical nice-to-have — it is a direct revenue multiplier.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">Google uses page speed as a ranking factor. Slow websites get pushed down in search results, losing organic traffic. This guide covers practical speed optimization techniques that any business owner can implement without touching code.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#audit" className="hover:underline text-[#8A63D2]">01. Auditing your current speed</Link></li>
        <li><Link href="#images" className="hover:underline text-[#8A63D2]">02. Image optimization (the biggest win)</Link></li>
        <li><Link href="#fonts" className="hover:underline text-[#8A63D2]">03. Minimize third-party scripts</Link></li>
      </ul>
      <h3 id="audit" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Auditing your current speed</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Run your website through Google PageSpeed Insights (free). You will get a score from 0-100 and specific recommendations. Aim for 90+ on mobile. Common issues: oversized images, too many fonts, unminified CSS/JavaScript, and slow server response times. Bizvistar handles server optimization automatically — your job is optimizing content.</p>

      <h3 id="images" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Image optimization (the biggest win)</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Images account for 60-80% of page weight on most websites. Compress all images before uploading — use TinyPNG or Squoosh (both free). Use WebP format instead of PNG/JPEG for 25-35% smaller file sizes. Never upload images larger than 2000px wide. Lazy-load images below the fold so they only load when the user scrolls to them.</p>

      <h3 id="fonts" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Minimize third-party scripts</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Every external script (analytics, chat widgets, social media embeds) adds load time. Audit your scripts quarterly and remove anything you are not actively using. Load non-essential scripts asynchronously so they do not block page rendering. Two well-chosen fonts are better than five — each font file adds 100-300KB to your page weight.</p>
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
