// src/components/dashboard/analytics/AnalyticsOverview.js
"use client";
import React from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, CreditCard, ArrowUp, ArrowDown } from 'lucide-react';

export default function AnalyticsOverview({ revenue, orders, visitors, conversion, aov, changes = {} }) {
  const cards = [
    {
      title: 'Total Revenue',
      value: `₹${revenue.toLocaleString()}`,
      icon: DollarSign,
      change: changes.revenue || 0,
      period: 'vs last period'
    },
    {
      title: 'Total Orders',
      value: orders.toLocaleString(),
      icon: ShoppingBag,
      change: changes.orders || 0,
      period: 'vs last period'
    },
    {
      title: 'Avg Order Value',
      value: `₹${aov ? aov.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0'}`,
      icon: CreditCard,
      change: changes.aov || 0,
      period: 'vs last period'
    },
    {
      title: 'Unique Visitors',
      value: visitors.toLocaleString(),
      icon: Users,
      change: changes.visitors || 0,
      period: 'vs last period'
    },
    {
      title: 'Conversion Rate',
      value: `${conversion}%`,
      icon: TrendingUp,
      change: changes.conversion || 0,
      period: 'vs last period'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
      {cards.map((card, idx) => {
        const isPositive = card.change >= 0;
        const changeValue = Math.abs(card.change).toFixed(1);
        
        return (
          <div 
            key={idx} 
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-md hover:ring-[#8A63D2]/30 flex flex-col justify-between h-[150px]"
          >
            {/* Subtle background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">{card.title}</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-[#8A63D2] ring-1 ring-purple-100 transition-transform duration-300 group-hover:scale-110">
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            
            <div className="relative z-10 mt-4">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{card.value}</h3>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className={`flex items-center font-bold px-1.5 py-0.5 rounded-md ${
                  isPositive 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-rose-50 text-rose-600'
                }`}>
                  {isPositive ? (
                    <ArrowUp className="mr-1 h-3 w-3" strokeWidth={3} />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3" strokeWidth={3} />
                  )}
                  {changeValue}%
                </span>
                <span className="text-gray-400 font-medium">{card.period}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}