'use client';
import Link from 'next/link';
import BlogPostLayout from '@/components/blogs/BlogPostLayout';

export default function BlogPost() {
  const faqs = [
    {
        "question": "What's dead stock and how do I avoid it?",
        "answer": "Dead stock is inventory that hasn't sold in 90+ days. Avoid it by starting with small orders, testing demand before bulk purchasing, and running clearance sales before stock ages beyond 60 days."
    },
    {
        "question": "Should I use barcode scanning?",
        "answer": "For businesses with 100+ SKUs, absolutely. A simple ₹1,500 Bluetooth barcode scanner paired with a free app dramatically speeds up stock counts and reduces human error."
    },
    {
        "question": "How do I manage inventory across multiple channels?",
        "answer": "Use a centralized platform like Bizvistar that syncs inventory across your website, Instagram shop, and any marketplace listings in real-time. Selling on multiple channels without centralized inventory guarantees overselling disasters."
    }
];
  const toc = [
    {
        "href": "#basics",
        "label": "01. Inventory management fundamentals"
    },
    {
        "href": "#tools",
        "label": "02. Tools for small business inventory"
    },
    {
        "href": "#seasonal",
        "label": "03. Managing seasonal demand"
    },
    {
        "href": "#faq",
        "label": "FAQ"
    }
];

  return (
    <BlogPostLayout category="OPERATIONS" title="Inventory Management for Small Businesses: A Practical Guide" date="May 7" heroImage="/blogs/blog_gummy_1778965453467.png" heroAlt="Inventory Management for Small Businesses: A Practical Guide" tableOfContents={toc} faqs={faqs} currentHref="/blogs/inventory-management-small-business">
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Overselling destroys trust instantly. When a customer pays for a product that is out of stock, you face the humiliating choice of refunding their money (losing the sale) or making them wait indefinitely (losing the customer forever). Conversely, overstocking ties up cash in products gathering dust on shelves. Inventory management is the invisible backbone of every successful e-commerce operation.</p>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-12 font-normal">This guide covers practical inventory techniques for small businesses: from simple spreadsheet tracking to automated stock sync across multiple sales channels. We will show you how to calculate reorder points, manage seasonal demand fluctuations, and avoid the two cardinal sins of inventory — stockouts and dead stock.</p>
      <ul className="list-disc pl-6 text-[#8A63D2] font-medium text-[18px] mb-12 space-y-2">
        <li><Link href="#basics" className="hover:underline text-[#8A63D2]">01. Inventory management fundamentals</Link></li>
        <li><Link href="#tools" className="hover:underline text-[#8A63D2]">02. Tools for small business inventory</Link></li>
        <li><Link href="#seasonal" className="hover:underline text-[#8A63D2]">03. Managing seasonal demand</Link></li>
      </ul>
      <h3 id="basics" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">01. Inventory management fundamentals</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Track three numbers for every SKU: current stock, reorder point, and lead time. Your reorder point = (average daily sales × lead time in days) + safety stock buffer. For example, if you sell 5 units per day and restocking takes 7 days, your reorder point is 35 + 10 (buffer) = 45 units. When stock hits 45, place a new order immediately.</p>

      <h3 id="tools" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">02. Tools for small business inventory</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">For businesses with under 50 SKUs, a simple Google Sheet with stock count, sales tracker, and conditional formatting works perfectly. For larger catalogs, Bizvistar's built-in inventory management automatically decrements stock when orders are placed and sends low-stock alerts. This eliminates the devastating overselling problem.</p>

      <h3 id="seasonal" className="text-[26px] md:text-[28px] font-bold font-sans text-gray-900 mb-6 mt-12">03. Managing seasonal demand</h3>
      <p className="text-[18px] text-[#0f172a] leading-[1.8] mb-6 font-normal">Analyze last year's sales data to identify peak periods. Stock up 30-40% extra inventory 2-3 weeks before expected demand spikes (Diwali, Christmas, Valentine's). After the season, run clearance sales to liquidate excess stock rather than letting it become dead inventory. Cash flow is king — dead stock is frozen cash.</p>
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
