'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [{"question":"How long does on-page SEO take to show results?","answer":"Individual page optimizations can show ranking improvements within 2-4 weeks. A full site optimization typically takes 2-3 months to fully impact rankings."},{"question":"Should I optimize every page?","answer":"Prioritize your highest-traffic and highest-revenue pages first. Then work through remaining pages systematically. Even optimizing 5 pages properly can significantly boost overall site performance."},{"question":"Is on-page SEO a one-time task?","answer":"No. Review and update your on-page SEO quarterly. Search trends change, competitors adjust, and Google updates its algorithm regularly."}];
  const toc = [{"href":"#meta","label":"01. Title tags and meta descriptions"},{"href":"#headings","label":"02. Heading structure and content"},{"href":"#links","label":"03. Internal linking strategy"},{"href":"#faq","label":"FAQ"}];
  return (
    <BlogPostLayout category="DESIGN & SEO" title="The Complete On-Page SEO Checklist for Small Business Websites" date="Apr 24" heroImage="/blogs/blog_ecommerce_1778964894297.png" tableOfContents={toc} faqs={faqs} currentHref="/blogs/on-page-seo-checklist">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">On-page SEO is the foundation of your search visibility. Unlike off-page SEO (backlinks, social signals), you have 100% control over on-page factors. Yet most small business websites are missing basic elements that Google explicitly recommends. A missing meta description, unoptimized images, or poor heading structure can keep your pages buried on page 5 of search results.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">This checklist covers every on-page SEO element you need to optimize — from title tags to internal linking to image alt text. Print it out and work through it page by page. Each item takes 2-10 minutes to fix but compounds into significant ranking improvements over time.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#meta" className="hover:underline text-[#8A63D2]">01. Title tags and meta descriptions</Link></li>
        <li><Link href="#headings" className="hover:underline text-[#8A63D2]">02. Heading structure and content</Link></li>
        <li><Link href="#links" className="hover:underline text-[#8A63D2]">03. Internal linking strategy</Link></li>
      </ul>
      <h3 id="meta" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Title tags and meta descriptions</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Every page needs a unique title tag under 60 characters containing your target keyword near the beginning. Meta descriptions should be 140-155 characters, include a compelling reason to click, and contain your keyword naturally. These are your advertisement in Google search results — make them irresistible. Bizvistar lets you edit these directly in the page settings panel.</p>

      <h3 id="headings" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Heading structure and content</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Use exactly one H1 per page (your main title). Use H2s for major sections and H3s for subsections. Include your target keyword in the H1 and at least one H2. Write naturally — keyword stuffing is penalized. Content should be minimum 300 words for product pages and 1,000+ words for blog posts. Longer, more detailed content consistently outranks thin content.</p>

      <h3 id="links" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Internal linking strategy</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Link between related pages on your website. Your homepage should link to category pages, which link to product pages. Blog posts should link to related blog posts and relevant product pages. Use descriptive anchor text (not 'click here'). Internal linking helps Google understand your site structure and distributes ranking power across pages.</p>
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
