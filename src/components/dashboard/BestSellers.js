"use client";
import React from "react";
import { ShoppingBag } from "lucide-react";

const bestSellers = [
  {
    id: 1,
    name: "Nike Air Zoom Pegasus 40",
    units: 67,
    amount: "$5,600",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80", // Red Nike Shoe
  },
  {
    id: 2,
    name: "Nike ZoomX",
    units: 42,
    amount: "$4,860",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=100&q=80", // Green Nike Shoe
  },
  {
    id: 3,
    name: "Adidas Ultraboost Light",
    units: 35,
    amount: "$3,850",
    image: "https://images.unsplash.com/photo-1587563871167-1ee797455c32?auto=format&fit=crop&w=100&q=80", // Adidas Shoe
  },
];

export default function BestSellers() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-gray-900 font-sans not-italic">Best Sellers</h3>
      <div className="flex flex-col gap-4">
        {bestSellers.map((item) => (
          <div 
            key={item.id} 
            className="group flex items-center gap-4 p-2 rounded-xl transition-all duration-200 hover:bg-gray-50 hover:scale-[1.02] cursor-pointer"
          >
            {/* Image container with fallback */}
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
              <img 
                src={item.image} 
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="flex flex-col gap-1 min-w-0">
              <h4 className="text-sm not-italic font-bold text-gray-900 font-sans leading-tight truncate pr-2 group-hover:text-[#8A63D2] transition-colors">
                {item.name}
              </h4>
              <p className="text-xs font-medium text-gray-500 font-sans">
                {item.units} Units Sold <span className="text-gray-300 px-1">|</span> <span className="text-gray-900 font-bold">{item.amount}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
