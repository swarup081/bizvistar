"use client";
import React from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export default function AnalyticsOverview({ revenue, orders, visitors, conversion }) {
  const cards = [
    {
      title: 'Total Revenue',
      value: `₹${revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Total Orders',
      value: orders.toLocaleString(),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Unique Visitors',
      value: visitors.toLocaleString(),
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Conversion Rate',
      value: `${conversion}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 font-sans">{card.title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2 font-sans">{card.value}</h3>
          </div>
          <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
            <card.icon size={20} />
          </div>
        </div>
      ))}
    </div>
  );
}
