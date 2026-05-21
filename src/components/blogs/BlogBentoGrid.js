'use client';

import React, { useRef } from 'react';
import { ArrowUpRight, Play, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { BLOG_CATEGORIES } from '@/data/blogData';

export default function BlogBentoGrid({ posts = [] }) {
  const containerRef = useRef(null);

  const p0 = posts[0] || null;
  const p1 = posts[1] || null;
  const p2 = posts[2] || null;
  const p3 = posts[3] || null;
  const p4 = posts[4] || null;
  const p5 = posts[5] || null;

  // Use actual blog categories (skip 'All')
  const displayCategories = BLOG_CATEGORIES.filter(c => c !== 'All').map(name => ({ name }));

  // Helper to get short bento title or fallback to truncated title
  const getBentoTitle = (post) => {
    if (!post) return '';
    if (post.bentoTitle) return post.bentoTitle;
    // Fallback: truncate to ~30 chars and uppercase
    const t = post.title || '';
    return t.length > 30 ? t.substring(0, 30).toUpperCase() + '...' : t.toUpperCase();
  };

  const getCategoryLabel = (post) => {
    if (!post) return 'Blog';
    return post.category || 'Blog';
  };

  const getDate = (post) => {
    if (!post) return '';
    return post.date || '';
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[1300px] mx-auto px-4 md:px-6 my-10 font-sans bg-white transition-all duration-500 ease-in-out"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >

      {/* DESKTOP GRID */}
      <div className="hidden md:flex gap-4">

        {/* LEFT COLUMN (38%) */}
        <div className="w-[38%] flex flex-col">
          <div className="h-[500px] lg:h-[646px] relative">
            {p0 && (
              <div className="relative rounded-[32px] overflow-hidden bg-gray-100 h-full group">
                <Link href={p0.href || "#"} className="absolute inset-0 z-30"></Link>
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${p0.image || '/blogs/blog_club_1778965424607.png'})` }}></div>

                <div className="absolute bottom-0 left-0 flex flex-col items-start z-30 w-full pointer-events-none">
                  <div className="bg-white rounded-tr-[20px] lg:rounded-tr-[24px] pl-4 pr-6 pt-5 pb-1 relative z-20 w-max">
                    <svg className="absolute left-0 w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] pointer-events-none bottom-full -mb-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 24V0C0 13.255 10.745 24 24 24H0Z" fill="#ffffff" />
                    </svg>
                    <svg className="absolute w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] pointer-events-none left-full bottom-0 -ml-[1px] -mb-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 24V0C0 13.255 10.745 24 24 24H0Z" fill="#ffffff" />
                    </svg>
                    <div className="flex items-center gap-2 text-[11px] font-bold font-sans">
                      <span className="text-black">{getCategoryLabel(p0)}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-400 font-medium">{getDate(p0)}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-tr-[20px] lg:rounded-tr-[24px] relative w-[78%] -mt-[1px] z-10">
                    <svg className="absolute w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] pointer-events-none left-full bottom-0 -ml-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 24V0C0 13.255 10.745 24 24 24H0Z" fill="#ffffff" />
                    </svg>
                    <div className="pl-4 pr-6 pt-3 pb-5">
                      <h2 className="text-[18px] xl:text-[20px] leading-[1.2] font-black uppercase tracking-[-0.01em] text-black font-sans mt-1 whitespace-pre-line">
                        {getBentoTitle(p0)}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT AREA (62%) */}
        <div className="w-[62%] flex flex-col gap-4">

          {/* RIGHT AREA TOP ROW */}
          <div className="flex gap-4 h-[280px] lg:h-[380px]">

            {/* MIDDLE GREEN (70% of Right Area) */}
            <div className="w-[70%] h-full relative group">
              <div className="absolute inset-0 bg-[#eafcb6] rounded-[32px] overflow-hidden transition-all duration-300 group-hover:bg-[#d8eba5]">
                <div className="absolute top-0 right-0 w-[48px] h-[48px] lg:w-[64px] lg:h-[64px] bg-white rounded-bl-[24px] lg:rounded-bl-[32px] z-20 pointer-events-none transition-colors duration-300"></div>
                <svg className="absolute top-0 right-[48px] lg:right-[64px] w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] pointer-events-none z-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 0V24C24 10.745 13.255 0 0 0H24Z" fill="white" className="transition-colors duration-300" />
                </svg>
                <svg className="absolute top-[48px] lg:top-[64px] right-0 w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] pointer-events-none z-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 0V24C24 10.745 13.255 0 0 0H24Z" fill="white" className="transition-colors duration-300" />
                </svg>

                {p1 && <Link href={p1.href || "#"} className="absolute inset-0 z-10"></Link>}

                <div className="h-full flex flex-col relative z-10">
                  <div className="p-8 pb-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-[11px] font-bold mb-3 font-sans">
                      <span className="text-gray-900">{getCategoryLabel(p1)}</span>
                    </div>
                    <h3 className="text-[22px] xl:text-[26px] leading-[1.1] font-black uppercase tracking-tight text-gray-900 mb-3 w-[90%] font-sans whitespace-pre-line">
                      {getBentoTitle(p1)}
                    </h3>
                    <p className="text-[11px] xl:text-[12px] font-medium text-gray-800 leading-relaxed pr-4 font-sans line-clamp-3">
                      {p1?.description || ''} <span className="underline font-bold text-gray-900">More</span>
                    </p>
                  </div>

                  <div className="flex flex-col mt-auto font-sans">
                    {p2 && (
                      <Link href={p2.href || "#"} className="group/item flex items-center justify-between px-8 py-4 border-t border-black/[0.04] hover:bg-black/5 transition-colors z-30 relative">
                        <h4 className="text-[12px] font-bold uppercase tracking-tight text-gray-900">{(p2.title || '').toUpperCase()}</h4>
                        <ArrowRight className="w-4 h-4 text-gray-900 group-hover/item:translate-x-1 transition-transform" strokeWidth={1.5} />
                      </Link>
                    )}
                    {p3 && (
                      <Link href={p3.href || "#"} className="group/item flex items-center justify-between px-8 py-4 border-t border-black/[0.04] hover:bg-black/5 transition-colors z-30 relative">
                        <h4 className="text-[12px] font-bold uppercase tracking-tight text-gray-900">{(p3.title || '').toUpperCase()}</h4>
                        <ArrowRight className="w-4 h-4 text-gray-900 group-hover/item:translate-x-1 transition-transform" strokeWidth={1.5} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <button className="absolute top-[10px] right-[10px] w-[44px] h-[44px] bg-[#eafcb6] hover:bg-[#d8eba5] group-hover:bg-[#d8eba5] transition-colors rounded-full flex items-center justify-center z-40 cursor-pointer pointer-events-none">
                <ArrowUpRight className="w-5 h-5 text-gray-900" strokeWidth={2} />
              </button>
            </div>

            {/* RIGHT BLUE (30% of Right Area) */}
            <div className="w-[30%] h-full relative">
              {p4 && (
                <div className="relative bg-[#cfdef2] rounded-[32px] p-6 xl:p-8 h-full flex flex-col group transition-all overflow-hidden hover:bg-[#b8cce6]">
                  <Link href={p4.href || "#"} className="absolute inset-0 z-20"></Link>

                  <div className="relative z-10 flex items-center gap-2 text-[11px] font-bold mb-2">
                    <span className="text-gray-900">{getCategoryLabel(p4)}</span>
                  </div>

                  <div className="relative z-10 flex items-center gap-2 text-[10px] font-bold text-gray-500 mb-3">
                    {p4.badge && <span className="text-[#e2695c]">{p4.badge}</span>}
                    {p4.badge && <span>.</span>}
                    <span>{getDate(p4)}</span>
                  </div>

                  <h3 className="relative z-10 text-[20px] xl:text-[22px] leading-[1.1] font-black uppercase tracking-[-0.02em] text-gray-900 whitespace-pre-line">
                    {getBentoTitle(p4)}
                  </h3>

                  <div className="absolute bottom-0 right-0 left-0 h-[50%] bg-cover bg-top z-0 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${p4.image || '/blogs/blog_sneaker_1778965493480.png'})` }}></div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT AREA BOTTOM ROW */}
          <div className="flex gap-4 h-[204px] lg:h-[250px]">

            {/* BOTTOM VIDEO (55% of Right Area) */}
            <div className="w-[55%] h-full">
              {p5 && (
                <div className="relative bg-gray-200 rounded-[32px] h-full overflow-hidden group transition-all">
                  <Link href={p5.href || "#"} className="absolute inset-0 z-20"></Link>
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${p5.image || '/blogs/blog_startup_1778964908511.png'})` }}></div>
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>

                  <div className="absolute top-6 left-8 z-10 text-[11px] font-bold text-white">
                    {getCategoryLabel(p5)}
                  </div>

                  <div className="absolute bottom-6 left-8 z-10 pr-8">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/90 mb-1 font-sans">
                      {p5.readTime && <span>{p5.readTime}</span>}
                      {p5.readTime && <span>.</span>}
                      <span>{getDate(p5)}</span>
                    </div>
                    <h3 className="text-[16px] xl:text-[18px] leading-[1.2] font-black uppercase tracking-[-0.01em] text-white font-sans whitespace-pre-line">
                      {getBentoTitle(p5)}
                    </h3>
                  </div>
                </div>
              )}
            </div>

            {/* BOTTOM CATEGORIES (45% of Right Area) */}
            <div className="w-[45%] h-full relative group">
              <div className="absolute inset-0 bg-[#d8bdf9] rounded-[32px] p-6 xl:p-8 flex flex-col justify-between overflow-hidden z-10 transition-colors duration-300 group-hover:bg-[#cdb0f0]">
                <div className="flex flex-wrap gap-2 content-start relative z-20">
                  {displayCategories.map((cat, idx) => (
                    <Link key={idx} href={`/blogs/search?q=${encodeURIComponent(cat.name)}`}>
                      <span className="px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-800 bg-[#fdf5b2] hover:bg-[#fcec8f] transition-colors cursor-pointer">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>

                <Link href="/blogs" className="font-bold text-gray-900 text-[13px] xl:text-[14px] pb-2 mt-auto relative z-20 cursor-pointer hover:underline">View All Categories</Link>
              </div>

              <Link href="/blogs" className="absolute bottom-6 right-6 w-[48px] h-[48px] z-40 cursor-pointer group/btn flex items-center justify-center">
                <div className="absolute w-[52px] h-[52px] bg-[#fdf5b2] rounded-[16px] rotate-0 group-hover/btn:rotate-90 transition-transform duration-500"></div>
                <div className="absolute w-[52px] h-[52px] bg-[#fdf5b2] rounded-[16px] rotate-45 group-hover/btn:rotate-[135deg] transition-transform duration-500"></div>
                <button className="absolute inset-0 bg-white rounded-full flex items-center justify-center z-10">
                  <ArrowRight className="w-5 h-5 text-gray-900 group-hover/btn:translate-x-0.5 transition-transform" strokeWidth={1.5} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE & TABLET FALLBACK */}
      <div className="flex md:hidden flex-col gap-4">

        {p0 && (
          <div className="relative rounded-[32px] overflow-hidden bg-gray-100 h-[400px] group">
            <Link href={p0.href || "#"} className="absolute inset-0 z-30"></Link>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p0.image || '/blogs/blog_club_1778965424607.png'})` }}></div>
            <div className="absolute bottom-0 left-0 flex flex-col items-start z-30 w-full pointer-events-none">
              <div className="bg-white rounded-tr-[24px] pl-3 pr-5 pt-4 pb-1 relative z-20 w-max">
                <svg className="absolute left-0 w-[20px] h-[20px] pointer-events-none bottom-full -mb-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 24V0C0 13.255 10.745 24 24 24H0Z" fill="#ffffff" />
                </svg>
                <svg className="absolute w-[20px] h-[20px] pointer-events-none left-full bottom-0 -ml-[1px] -mb-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 24V0C0 13.255 10.745 24 24 24H0Z" fill="#ffffff" />
                </svg>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="text-black">{getCategoryLabel(p0)}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-400 font-medium">{getDate(p0)}</span>
                </div>
              </div>
              <div className="bg-white rounded-tr-[24px] relative w-[82%] -mt-[1px] z-10">
                <svg className="absolute w-[20px] h-[20px] pointer-events-none left-full bottom-0 -ml-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 24V0C0 13.255 10.745 24 24 24H0Z" fill="#ffffff" />
                </svg>
                <div className="pl-3 pr-5 pt-2 pb-4">
                  <h2 className="text-[16px] leading-[1.2] font-black uppercase tracking-[-0.01em] text-black mt-1 whitespace-pre-line">
                    {getBentoTitle(p0)}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        )}

        {p1 && (
          <div className="relative bg-[#eafcb6] rounded-[32px] p-6 h-[300px] flex flex-col overflow-hidden">
            <Link href={p1.href || "#"} className="absolute inset-0 z-30"></Link>
            <div className="absolute top-0 right-0 w-[60px] h-[60px] bg-white rounded-bl-[28px] z-20 pointer-events-none"></div>
            <svg className="absolute top-0 right-[60px] w-[24px] h-[24px] pointer-events-none z-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 0V24C24 10.745 13.255 0 0 0H24Z" fill="white" />
            </svg>
            <svg className="absolute top-[60px] right-0 w-[24px] h-[24px] pointer-events-none z-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 0V24C24 10.745 13.255 0 0 0H24Z" fill="white" />
            </svg>
            <button className="absolute top-[8px] right-[8px] w-[44px] h-[44px] bg-[#eafcb6] rounded-full flex items-center justify-center z-40 cursor-pointer pointer-events-none">
              <ArrowUpRight className="w-5 h-5 text-gray-900" strokeWidth={2} />
            </button>
            <div className="text-[11px] font-bold mb-3 text-gray-900 relative z-10">{getCategoryLabel(p1)}</div>
            <h3 className="text-[20px] leading-[1.2] font-black uppercase tracking-[-0.02em] text-gray-900 mb-3 relative z-10 w-[85%] whitespace-pre-line">
              {getBentoTitle(p1)}
            </h3>
            <p className="mt-auto text-[11px] font-medium text-gray-700 line-clamp-2 pr-4 relative z-10">
              {p1?.description?.substring(0, 100) || ''}...
            </p>
          </div>
        )}

        <div className="bg-[#eafcb6] rounded-[32px] flex flex-col h-[140px]">
          {p2 && (
            <Link href={p2.href || "#"} className="flex-1 flex items-center justify-between px-6 border-b border-black/[0.04]">
              <h4 className="font-black text-[11px] uppercase tracking-[-0.01em] text-gray-900">{(p2.title || '').toUpperCase()}</h4>
              <ArrowRight className="w-4 h-4 text-gray-900" strokeWidth={1.5} />
            </Link>
          )}
          {p3 && (
            <Link href={p3.href || "#"} className="flex-1 flex items-center justify-between px-6">
              <h4 className="font-black text-[11px] uppercase tracking-[-0.01em] text-gray-900">{(p3.title || '').toUpperCase()}</h4>
              <ArrowRight className="w-4 h-4 text-gray-900" strokeWidth={1.5} />
            </Link>
          )}
        </div>

        {p4 && (
          <div className="relative bg-[#cfdef2] rounded-[32px] p-6 h-[400px] overflow-hidden">
            <Link href={p4.href || "#"} className="absolute inset-0 z-20"></Link>
            
            <div className="absolute top-0 right-0 bg-white rounded-bl-[24px] pl-5 pr-4 pt-4 pb-3 z-20 w-max">
              <svg className="absolute top-0 right-full w-[24px] h-[24px] pointer-events-none -mr-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 0V24C24 10.745 13.255 0 0 0H24Z" fill="white" />
              </svg>
              <svg className="absolute top-full right-0 w-[24px] h-[24px] pointer-events-none -mt-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 0V24C24 10.745 13.255 0 0 0H24Z" fill="white" />
              </svg>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-900">{getCategoryLabel(p4)}</span>
                <span className="text-[9px] font-bold text-gray-500 mt-0.5">{getDate(p4)}</span>
              </div>
            </div>

            <h3 className="relative z-10 text-[24px] leading-[1.1] font-black uppercase tracking-[-0.02em] text-gray-900 w-[70%] whitespace-pre-line mt-2">
              {getBentoTitle(p4)}
            </h3>
            
            <div className="absolute bottom-[20px] right-0 left-0 h-[45%] bg-contain bg-no-repeat bg-bottom z-0" style={{ backgroundImage: `url(${p4.image || '/blogs/posblogs.png'})` }}></div>
          </div>
        )}

        {p5 && (
          <div className="relative bg-gray-200 rounded-[32px] h-[300px] overflow-hidden">
            <Link href={p5.href || "#"} className="absolute inset-0 z-20"></Link>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p5.image || '/blogs/blog_startup_1778964908511.png'})` }}></div>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute top-6 left-6 z-10 text-[11px] font-bold text-white">{getCategoryLabel(p5)}</div>
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <div className="text-[10px] font-bold text-white/90 mb-1">{p5.readTime || '5 Min'} . {getDate(p5)}</div>
              <h3 className="text-[16px] leading-[1.2] font-black uppercase text-white line-clamp-2 whitespace-pre-line">
                {getBentoTitle(p5)}
              </h3>
            </div>
          </div>
        )}

        <div className="relative bg-[#d8bdf9] rounded-[32px] p-6 h-[220px] flex flex-col justify-between overflow-hidden z-10">
          <div className="flex flex-wrap gap-2 content-start relative">
            {displayCategories.slice(0, 6).map((cat, idx) => (
              <Link key={idx} href={`/blogs/search?q=${encodeURIComponent(cat.name)}`}>
                <span className="px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-800 bg-[#fdf5b2]">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
          <Link href="/blogs" className="font-bold text-gray-900 text-[13px] pb-2 mt-auto relative hover:underline">View All Categories</Link>

          <Link href="/blogs" className="absolute bottom-4 right-4 w-[48px] h-[48px] z-40 cursor-pointer group flex items-center justify-center">
            <div className="absolute w-[52px] h-[52px] bg-[#fdf5b2] rounded-[16px] rotate-0 transition-transform duration-500"></div>
            <div className="absolute w-[52px] h-[52px] bg-[#fdf5b2] rounded-[16px] rotate-45 transition-transform duration-500"></div>
            <button className="absolute inset-0 bg-white rounded-full flex items-center justify-center z-10 relative">
              <ArrowRight className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}