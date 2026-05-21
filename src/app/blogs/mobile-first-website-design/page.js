'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [
    {
        "question": "Do I need a separate mobile website?",
        "answer": "No. Responsive design (which Bizvistar uses) automatically adapts your single website to all screen sizes. Separate mobile sites are outdated and create SEO problems."
    },
    {
        "question": "How does mobile speed affect sales?",
        "answer": "A 1-second delay reduces conversions by 7%. For a store doing ₹1 lakh/month in revenue, that's ₹7,000 lost every month from slow loading alone."
    },
    {
        "question": "Does Bizvistar optimize images automatically?",
        "answer": "Yes. Bizvistar's built-in image optimization automatically compresses and serves images in modern formats for fast mobile loading."
    }
];

  const toc = [
    {
        "href": "#stats",
        "label": "01. The mobile traffic reality"
    },
    {
        "href": "#ux",
        "label": "02. Mobile UX best practices"
    },
    {
        "href": "#test",
        "label": "03. How to test mobile performance"
    },
    {
        "href": "#faq",
        "label": "FAQ"
    }
];

  return (
    <BlogPostLayout category="DESIGN & SEO" title="Why Mobile-First Design Is Non-Negotiable in 2026" date="May 14" heroImage="/blogs/blog_tiktok_1778964932618.png" heroAlt="Why Mobile-First Design Is Non-Negotiable in 2026" tableOfContents={toc} faqs={faqs} currentHref="/blogs/mobile-first-website-design">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">In 2026, over 78% of Indian internet users access the web primarily through smartphones. If your website is not optimized for mobile, you are invisible to more than three-quarters of your potential customers. Google now uses mobile-first indexing, meaning it evaluates the mobile version of your site first when determining search rankings.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">Mobile-first design is not about shrinking a desktop website to fit a smaller screen. It is about designing the mobile experience first and then scaling up for desktop. This fundamental shift in approach ensures that the majority of your users get the best possible experience, not an afterthought.</p>

      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#stats" className="hover:underline text-[#8A63D2]">01. The mobile traffic reality</Link></li>
        <li><Link href="#ux" className="hover:underline text-[#8A63D2]">02. Mobile UX best practices</Link></li>
        <li><Link href="#test" className="hover:underline text-[#8A63D2]">03. How to test mobile performance</Link></li>
      </ul>

      <h3 id="stats" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. The mobile traffic reality</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Google Analytics data across Bizvistar merchants shows an average of 82% mobile traffic for Indian e-commerce stores. During festive seasons like Diwali and Raksha Bandhan, this spikes to 90%+. Designing for desktop first means optimizing for the minority.</p>

      <h3 id="ux" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Mobile UX best practices</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Thumb-friendly buttons (minimum 44x44px), single-column layouts, compressed images under 200KB, sticky CTAs, and simplified navigation. Every tap should move the user closer to checkout. Remove anything that adds friction on a small screen.</p>

      <h3 id="test" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. How to test mobile performance</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Use Google's Mobile-Friendly Test tool, PageSpeed Insights, and physically test on multiple devices. Bizvistar templates are automatically responsive, but always preview your customizations on mobile before publishing.</p>

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
