// src/components/ui/Carousel.js
'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Carousel = ({ items, renderItem, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => setCurrentIndex((curr) => (curr === 0 ? items.length - 1 : curr - 1));
  const next = () => setCurrentIndex((curr) => (curr === items.length - 1 ? 0 : curr + 1));

  if (!items?.length) return null;

  return (
    <div className={`relative group ${className}`}>
      {/* Content Window */}
      <div className="overflow-hidden relative min-h-[200px] flex items-center justify-center">
        <div className="w-full transition-opacity duration-500 ease-in-out">
          {renderItem(items[currentIndex])}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none p-4">
        <button onClick={prev} className="pointer-events-auto p-2 rounded-full bg-white/80 hover:bg-white shadow-sm text-gray-800 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
          <ChevronLeft size={24} />
        </button>
        <button onClick={next} className="pointer-events-auto p-2 rounded-full bg-white/80 hover:bg-white shadow-sm text-gray-800 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? "bg-gray-800 w-6" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};