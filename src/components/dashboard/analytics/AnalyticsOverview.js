"use client";
import React from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, CreditCard, ArrowUp } from 'lucide-react';

export default function AnalyticsOverview({ revenue, orders, visitors, conversion, aov }) {
  const cards = [
    {
      title: 'Total Revenue',
      value: `₹${revenue.toLocaleString()}`,
      icon: DollarSign,
      // Using generic growth for demo since we don't have historical data comparison yet
      change: '12%',
      period: 'vs last period'
    },
    {
      title: 'Total Orders',
      value: orders.toLocaleString(),
      icon: ShoppingBag,
      change: '8%',
      period: 'vs last period'
    },
    {
      title: 'Avg Order Value',
      value: `₹${aov ? aov.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0'}`,
      icon: CreditCard,
      change: '4%',
      period: 'vs last period'
    },
    {
      title: 'Unique Visitors',
      value: visitors.toLocaleString(),
      icon: Users,
      change: '24%',
      period: 'vs last period'
    },
    {
      title: 'Conversion Rate',
      value: `${conversion}%`,
      icon: TrendingUp,
      change: '2%',
      period: 'vs last period'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between h-[160px] border border-gray-100">
            <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-900 border border-gray-100">
                    <card.icon className="h-5 w-5 text-[#8A63D2]" />
                </div>
                <span className="text-sm font-bold text-gray-500 font-sans">{card.title}</span>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-900 font-sans tracking-tight">{card.value}</h3>
                <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="flex items-center font-bold text-[#4CAF50] font-sans">
                        <ArrowUp className="mr-0.5 h-3 w-3" strokeWidth={3} />
                        {card.change}
                    </span>
                    <span className="text-gray-400 font-medium font-sans">{card.period}</span>
                </div>
            </div>
        </div>
      ))}
    </div>
  );
}