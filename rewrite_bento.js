const fs = require('fs');

const code = `import React from 'react';
import Link from 'next/link';
import { ALL_BLOG_POSTS } from '@/data/blogData';

const BlogBentoGrid = () => {
  const posts = ALL_BLOG_POSTS.slice(0, 6);

  const getBentoTitle = (post) => {
    if (post.bentoTitle) return post.bentoTitle;
    return post.title;
  };

  const getCategoryLabel = (post) => {
    return post.category || "Uncategorized";
  };

  const getDate = (post) => {
    return post.date || "Recent";
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-8 mt-12 mb-20 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {posts.map((post, i) => (
          <div key={i} className="relative rounded-[32px] overflow-hidden bg-gray-100 h-[400px] lg:h-[500px] group transition-all">
            <Link href={post.href || "#"} className="absolute inset-0 z-30"></Link>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: \`url(\${post.image || '/blogs/blog_startup_1778964908511.png'})\` }}></div>

            <div className="absolute bottom-0 left-0 flex flex-col items-start z-30 w-full pointer-events-none">
              <div className="bg-white rounded-tr-[20px] lg:rounded-tr-[24px] pl-4 pr-6 pt-5 pb-1 relative z-20 w-max">
                <svg className="absolute left-0 w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] pointer-events-none bottom-full -mb-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 24V0C0 13.255 10.745 24 24 24H0Z" fill="#ffffff" />
                </svg>
                <svg className="absolute w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] pointer-events-none left-full bottom-0 -ml-[1px] -mb-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 24V0C0 13.255 10.745 24 24 24H0Z" fill="#ffffff" />
                </svg>
                <div className="flex items-center gap-2 text-[11px] font-bold font-sans">
                  <span className="text-black">{getCategoryLabel(post)}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-400 font-medium">{getDate(post)}</span>
                </div>
              </div>
              <div className="bg-white rounded-tr-[20px] lg:rounded-tr-[24px] relative w-[85%] -mt-[1px] z-10">
                <svg className="absolute w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] pointer-events-none left-full bottom-0 -ml-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 24V0C0 13.255 10.745 24 24 24H0Z" fill="#ffffff" />
                </svg>
                <div className="pl-4 pr-6 pt-3 pb-5">
                  <h2 className="text-[16px] xl:text-[18px] leading-[1.2] font-black uppercase tracking-[-0.01em] text-black font-sans mt-1 whitespace-pre-line">
                    {getBentoTitle(post)}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogBentoGrid;
`;

fs.writeFileSync('/Users/Shared/BizVistar/src/components/blogs/BlogBentoGrid.js', code);
