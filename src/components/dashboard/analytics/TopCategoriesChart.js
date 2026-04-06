"use client";
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

import { ChevronDown } from 'lucide-react';

const COLORS = ['#8A63D2', '#9B7BE0', '#B096ED', '#C7B3F7', '#E2D1F9', '#F0E5FF'];

export default function TopCategoriesChart({ data, totalSales }) {
  const [showAll, setShowAll] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAll(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Process data: Top 3 and Other
  let processedData = [];
  if (data.length > 4) {
      processedData = data.slice(0, 3);
      const otherSales = data.slice(3).reduce((acc, curr) => acc + curr.value, 0);
      processedData.push({ name: 'Other', value: otherSales });
  } else {
      processedData = data;
  }

  return (
    <div id="top-categories" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full w-full relative">
      <div className="flex justify-between items-center mb-6 relative" ref={dropdownRef}>
        <h3 className="font-semibold text-gray-900 text-lg">Top Categories</h3>
        <button 
           onClick={() => setShowAll(!showAll)}
           className="text-xs text-[#8A63D2] font-medium hover:text-[#7A52C0] flex items-center gap-1 bg-brand-50 px-3 py-1.5 rounded-full"
        >
           See All <ChevronDown className="w-3 h-3" />
        </button>

        {showAll && (
           <div className="absolute top-10 right-0 w-64 bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden flex flex-col max-h-64">
              <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                  <h4 className="text-sm font-bold text-gray-900">All Categories</h4>
              </div>
              <div className="flex-1 overflow-y-auto p-2 hide-scrollbar">
                  {data.map((item, idx) => (
                      <div key={item.name} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                          <span className="text-sm text-gray-700 font-medium truncate pr-2">{item.name}</span>
                          <span className="text-sm font-bold text-gray-900 shrink-0">₹{Number(item.value).toLocaleString()}</span>
                      </div>
                  ))}
                  {data.length === 0 && <div className="text-center text-sm text-gray-500 p-4">No data</div>}
              </div>
           </div>
        )}
      </div>

      <div className="relative h-48 w-full mb-4 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={processedData}
              innerRadius="70%"
              outerRadius="95%"
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={6}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
               formatter={(value) => `₹${Number(value).toLocaleString()}`}
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '8px 12px' }}
               wrapperStyle={{ zIndex: 9999 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
           <span className="text-xs text-gray-500 font-medium">Total Sales</span>
           <span className="text-lg font-bold text-gray-900">₹{totalSales.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 justify-start w-full overflow-y-auto max-h-[140px] hide-scrollbar mt-auto">
        {processedData.map((item, index) => (
          <div key={item.name} className="flex justify-between items-center text-sm w-full shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <span 
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-600 font-medium truncate max-w-[120px]">{item.name}</span>
            </div>
            <span className="font-bold text-gray-900 ml-2">₹{Number(item.value).toLocaleString()}</span>
          </div>
        ))}
        {processedData.length === 0 && (
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
