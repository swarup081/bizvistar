// src/components/ui/BlogCard.js
import Link from 'next/link';

export const BlogCard = ({ 
  title, 
  excerpt, 
  date, 
  category, 
  image, 
  slug, 
  variant = 'stack' // 'stack' (vertical) or 'row' (horizontal)
}) => {
  if (variant === 'row') {
    return (
      <Link href={slug} className="group flex gap-6 items-start">
        <div className="w-1/3 aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="flex-1 py-2">
           <div className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-2">{category}</div>
           <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">{title}</h3>
           <p className="text-gray-500 text-sm line-clamp-2">{excerpt}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={slug} className="group block">
      <div className="aspect-video overflow-hidden rounded-xl bg-gray-100 mb-4">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 uppercase tracking-wide">
        <span className="font-bold text-black">{category}</span>
        <span>•</span>
        <span>{date}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">{title}</h3>
    </Link>
  );
};