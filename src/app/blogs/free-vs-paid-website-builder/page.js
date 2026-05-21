'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [
    {
        "question": "Are free plans good for testing?",
        "answer": "Yes, briefly. Use a free plan for 1-2 weeks to learn the editor. But never launch a real business on a free plan — the subdomain and branding damage customer trust."
    },
    {
        "question": "Is Bizvistar cheaper than Shopify?",
        "answer": "For Indian businesses, yes. Bizvistar is purpose-built for the Indian market with local payment gateways and competitive pricing in INR."
    },
    {
        "question": "Can I start free and upgrade later?",
        "answer": "Absolutely. Your content is preserved when you upgrade. But upgrade before sharing your site publicly to avoid the unprofessional subdomain."
    }
];

  const toc = [
    {
        "href": "#hidden",
        "label": "01. The hidden costs of free"
    },
    {
        "href": "#paid",
        "label": "02. What paid plans unlock"
    },
    {
        "href": "#when",
        "label": "03. When to upgrade"
    },
    {
        "href": "#faq",
        "label": "FAQ"
    }
];

  return (
    <BlogPostLayout category="GETTING STARTED" title="Free vs Paid Website Builders: What You Actually Get" date="May 15" heroImage="/blogs/blog_startup_1778964908511.png" heroAlt="Free vs Paid Website Builders: What You Actually Get" tableOfContents={toc} faqs={faqs} currentHref="/blogs/free-vs-paid-website-builder">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Free website builders are everywhere, promising professional sites at zero cost. But what do you actually get? The answer is: a severely limited website plastered with someone else's branding, running on a shared subdomain, with no analytics, no custom domain, and no e-commerce capabilities. Free plans exist to upsell you — they are marketing tools, not business tools.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">This guide provides a brutally honest side-by-side comparison of what free and paid plans actually include. We will examine the hidden costs of free plans, the features you lose, and at what point upgrading becomes a mathematical no-brainer for your business growth.</p>

      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#hidden" className="hover:underline text-[#8A63D2]">01. The hidden costs of free</Link></li>
        <li><Link href="#paid" className="hover:underline text-[#8A63D2]">02. What paid plans unlock</Link></li>
        <li><Link href="#when" className="hover:underline text-[#8A63D2]">03. When to upgrade</Link></li>
      </ul>

      <h3 id="hidden" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. The hidden costs of free</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Free plans typically include: third-party branding on your site, limited storage (500MB), no custom domain (yourbusiness.freebuilder.com), no SSL certificate, limited pages, and zero customer support. The moment you need any of these, you are forced to upgrade — often at prices higher than competitors who include them by default.</p>

      <h3 id="paid" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. What paid plans unlock</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">A paid Bizvistar plan includes: custom domain, SSL security, unlimited pages, e-commerce with payment gateways, analytics dashboard, priority support, and zero third-party branding. The cost? Starting at ₹499/month — less than a single cup of coffee per day.</p>

      <h3 id="when" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. When to upgrade</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">If you are using your website for anything beyond a personal hobby blog, you need a paid plan. The moment you want to accept payments, rank on Google, or present a professional brand image, free plans become actively harmful to your business credibility.</p>

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
