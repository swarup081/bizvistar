"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function TopCategoriesDonut({ data }) {
  const COLORS = ['#8A63D2', '#A0C4FF', '#FFB74D', '#4CAF50', '#FF9800']; // Primary purple + complementary colors

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 font-sans">Top Categories</h3>
          <span className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700">See All</span>
      </div>

      <div className="relative h-64 w-full flex-grow flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-xs text-gray-500 font-medium">Total Sales</p>
              <h2 className="text-xl font-bold text-gray-900 font-sans">₹{total.toLocaleString()}</h2>
          </div>
      </div>

      <div className="mt-6 space-y-3">
          {data.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      <span className="text-gray-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">₹{item.value.toLocaleString()}</span>
              </div>
          ))}
      </div>
    </div>
  );
}
