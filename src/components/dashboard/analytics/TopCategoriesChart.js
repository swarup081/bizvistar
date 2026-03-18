"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#8A63D2', '#9B7BE0', '#B096ED', '#C7B3F7', '#E2D1F9', '#F0E5FF'];

export default function TopCategoriesChart({ data, totalSales }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900 text-lg">Top Categories</h3>
        <button className="text-xs text-[#8A63D2] font-medium hover:text-[#7A52C0]">See All</button>
      </div>

      <div className="relative h-48 w-full mb-4 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius="70%"
              outerRadius="95%"
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
               formatter={(value) => `₹${Number(value).toLocaleString()}`}
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '8px 12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
           <span className="text-xs text-gray-500 font-medium">Total Sales</span>
           <span className="text-lg font-bold text-gray-900">₹{totalSales.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 justify-start w-full overflow-y-auto max-h-[140px] hide-scrollbar">
        {data.slice(0, 4).map((item, index) => (
          <div key={item.name} className="flex justify-between items-center text-sm w-full shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-600 font-medium truncate max-w-[120px]">{item.name}</span>
            </div>
            <span className="font-bold text-gray-900 ml-2">₹{Number(item.value).toLocaleString()}</span>
          </div>
        ))}
        {data.length === 0 && (
           <div className="text-center text-gray-400 text-sm py-4">No category data</div>
        )}
      </div>
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
