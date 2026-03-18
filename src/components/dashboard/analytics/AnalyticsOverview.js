"use client";
import React from 'react';
import { DollarSign, ShoppingCart, User } from 'lucide-react';

export default function AnalyticsOverview({
  revenue = 0, prevRevenue = 0,
  orders = 0, prevOrders = 0,
  visitors = 0, prevVisitors = 0,
  dateRange
}) {

  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const pct = ((current - previous) / previous) * 100;
    return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
  };

  const periodLabels = {
    '7d': 'vs last 7 days',
    '30d': 'vs last 30 days',
    '90d': 'vs last 90 days',
    'year': 'vs last year'
  };
  const periodText = periodLabels[dateRange] || 'vs last period';

  const cards = [
    {
      title: 'Total Sales',
      value: `₹${(revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      change: calculateChange(revenue, prevRevenue),
      period: periodText,
      isPrimary: true
    },
    {
      title: 'Total Orders',
      value: (orders || 0).toLocaleString(),
      icon: ShoppingCart,
      change: calculateChange(orders, prevOrders),
      period: periodText
    },
    {
      title: 'Total Visitors',
      value: (visitors || 0).toLocaleString(),
      icon: User,
      change: calculateChange(visitors, prevVisitors),
      period: periodText
    }
  ];

  return (
    <div className="flex overflow-x-auto gap-6 pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 snap-x snap-mandatory hide-scrollbar">
      {cards.map((card, idx) => (
        <div
           key={idx}
           className={`rounded-2xl p-6 flex flex-col justify-between h-[160px] min-w-[280px] md:min-w-0 snap-center shrink-0 ${
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
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
