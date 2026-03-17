"use client";
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

export default function RevenueChart({ data }) {
  const [period, setPeriod] = useState('Last 8 Days');

  const enrichedData = data.map(d => ({
    ...d,
    order: d.value ? d.value * 0.6 + Math.random() * 2000 : 0
  }));

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">Revenue Analytics</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#8A63D2]"></span>
              <span className="text-xs text-gray-500 font-medium">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#E2D1F9] border border-dashed border-[#E2D1F9]"></span>
              <span className="text-xs text-gray-500 font-medium">Order</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-purple-50 text-[#8A63D2] px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors shadow-sm">
          {period}
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-grow min-h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={enrichedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8A63D2" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#8A63D2" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => `${value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value}`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
              labelStyle={{ color: '#6B7280', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}
              formatter={(value, name) => [
                `₹${Number(value).toLocaleString()}`,
                name === 'value' ? 'Revenue' : 'Order'
              ]}
              cursor={{ stroke: '#f0f0f0', strokeWidth: 2, strokeDasharray: "5 5" }}
            />

            <Area
              type="monotone"
              dataKey="order"
              stroke="#E2D1F9"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
              activeDot={{ r: 4, fill: '#E2D1F9' }}
            />

            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#8A63D2" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue)"
              activeDot={{ r: 6, fill: '#8A63D2', stroke: 'white', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
