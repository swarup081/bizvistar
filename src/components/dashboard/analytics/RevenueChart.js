"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ data }) {
  // data comes correctly as: [{ date: '...', value: 5000, orderCount: 5 }]

  return (
    <div id="revenue-chart" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full w-full relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">Revenue Analytics</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#8A63D2]"></span>
              <span className="text-xs text-gray-500 font-medium">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-black border border-dashed border-black"></span>
              <span className="text-xs text-gray-500 font-medium">Order</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow min-h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

            {/* Left Axis for Revenue */}
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => `${value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value}`}
            />

            {/* Right Axis for Orders (hidden visually to keep clean UI, but scales the line) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={false}
            />

            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
              labelStyle={{ color: '#6B7280', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}
              formatter={(value, name) => [
                name === 'value' ? `₹${Number(value).toLocaleString()}` : value,
                name === 'value' ? 'Revenue' : 'Order'
              ]}
              cursor={{ stroke: '#f0f0f0', strokeWidth: 2, strokeDasharray: "5 5" }}
            />

            {/* Order Line: Black, Dotted */}
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="orderCount"
              stroke="#000000"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="none"
              activeDot={{ r: 4, fill: '#000000' }}
            />

            {/* Revenue Line */}
            <Area 
              yAxisId="left"
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
