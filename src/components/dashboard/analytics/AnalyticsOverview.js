"use client";
import React from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, TrendingDown, CreditCard, ArrowUp } from 'lucide-react';

export default function AnalyticsOverview({ revenue = 0, orders = 0, visitors = 0 }) {
  const cards = [
    {
      title: 'Total Sales',
      value: `₹${(revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      change: '+3.34%',
      period: 'vs last week',
      isPositive: true,
      bgClass: 'bg-purple-50', // Based on theme
      iconColor: 'bg-[#8A63D2] text-white',
    },
    {
      title: 'Total Orders',
      value: (orders || 0).toLocaleString(),
      icon: ShoppingBag,
      change: '-2.89%',
      period: 'vs last week',
      isPositive: false,
      bgClass: 'bg-white border border-gray-100',
      iconColor: 'bg-gray-50 text-gray-500 border border-gray-100',
    },
    {
      title: 'Total Visitors',
      value: (visitors || 0).toLocaleString(),
      icon: Users,
      change: '+8.02%',
      period: 'vs last week',
      isPositive: true,
      bgClass: 'bg-white border border-gray-100',
      iconColor: 'bg-gray-50 text-gray-500 border border-gray-100',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[160px] ${card.bgClass}`}>
            <div className="flex justify-between items-start">
                <span className={`text-sm font-bold font-sans ${idx === 0 ? 'text-gray-800' : 'text-gray-500'}`}>{card.title}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconColor}`}>
                    <card.icon className="h-5 w-5" />
                </div>
            </div>

            <div className="flex justify-between items-end mt-4">
                <h3 className={`text-3xl font-bold font-sans tracking-tight ${idx === 0 ? 'text-gray-900' : 'text-gray-900'}`}>{card.value}</h3>
                <div className="flex flex-col items-end">
                    <span className={`flex items-center text-xs font-bold font-sans ${card.isPositive ? 'text-[#4CAF50]' : 'text-red-500'}`}>
                        {card.change}
                    </span>
                    <span className={`text-[10px] font-medium font-sans ${idx === 0 ? 'text-gray-500' : 'text-gray-400'}`}>{card.period}</span>
                </div>
            </div>
        </div>
      ))}
    </div>
  );
}
