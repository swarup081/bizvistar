"use client";
import React, { useState } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronDown } from 'lucide-react';

export default function RevenueChart({ data }) {
  const [filter, setFilter] = useState('Last 8 Days');

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 font-sans">Revenue Analytics</h3>
          <button className="flex items-center gap-2 bg-[#8A63D2] text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              {filter} <ChevronDown size={14} />
          </button>
      </div>

      <div className="flex-grow h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9CA3AF' }} 
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9CA3AF' }} 
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              hide={true} // Hide second axis but use it for scaling
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value, name) => {
                  if (name === 'revenue') return [`₹${value}`, 'Revenue'];
                  return [value, 'Orders'];
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="plainline" />
            <Line
              yAxisId="left"
              type="monotone" 
              dataKey="revenue"
              stroke="#8A63D2" 
              strokeWidth={3}
              dot={{ r: 4, fill: "#8A63D2", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
              name="Revenue"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke="#A0C4FF"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Order"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
