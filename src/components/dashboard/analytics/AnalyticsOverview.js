"use client";
import React from 'react';
import { DollarSign, ShoppingCart, User } from 'lucide-react';

export default function AnalyticsOverview({ revenue = 0, orders = 0, visitors = 0 }) {
  const cards = [
    {
      title: 'Total Sales',
      value: `₹${(revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      change: '+3.34%',
      period: 'vs last week',
      isPrimary: true
    },
    {
      title: 'Total Orders',
      value: (orders || 0).toLocaleString(),
      icon: ShoppingCart,
      change: '-2.89%',
      period: 'vs last week'
    },
    {
      title: 'Total Visitors',
      value: (visitors || 0).toLocaleString(),
      icon: User,
      change: '+8.02%',
      period: 'vs last week'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div
           key={idx}
           className={`rounded-2xl p-6 flex flex-col justify-between h-[160px] ${
              card.isPrimary
                ? 'bg-purple-50'
                : 'bg-white border border-gray-100 shadow-sm'
           }`}
        >
            <div className="flex justify-between items-center w-full">
                <span className={`text-[15px] font-medium ${card.isPrimary ? 'text-gray-800' : 'text-gray-500'}`}>
                    {card.title}
                </span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    card.isPrimary
                        ? 'bg-[#8A63D2] text-white shadow-sm shadow-purple-200'
                        : 'bg-gray-50 text-gray-500 border border-gray-100'
                }`}>
                    <card.icon className="h-5 w-5" />
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <h3 className="text-4xl font-bold text-gray-900 tracking-tight leading-none">{card.value}</h3>
                <div className="flex flex-col items-end text-xs">
                    <span className={`font-bold ${card.change.startsWith('+') ? 'text-[#4CAF50]' : 'text-red-500'}`}>
                        {card.change}
                    </span>
                    <span className="text-gray-400 font-medium mt-0.5">{card.period}</span>
                </div>
            </div>
        </div>
      ))}
    </div>
  );
}
