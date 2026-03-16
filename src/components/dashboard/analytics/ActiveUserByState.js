"use client";
import React from 'react';
import { MoreHorizontal, ArrowUp } from 'lucide-react';

export default function ActiveUserByState({ data, totalUsers, change }) {
  // data: [{ state: 'Maharashtra', percentage: 36, value: 1000 }]
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 font-sans">Active User</h3>
          <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={20} />
          </button>
      </div>

      <div className="flex justify-between items-end mb-8">
          <div>
              <h2 className="text-3xl font-bold text-gray-900 font-sans tracking-tight">{Number(totalUsers).toLocaleString()}</h2>
              <p className="text-sm text-gray-500 font-medium">Users</p>
          </div>
          <div className="text-right">
              <span className="flex items-center gap-1 text-sm font-bold text-[#4CAF50] bg-green-50 px-2 py-1 rounded-full">
                  <ArrowUp size={14} strokeWidth={3} />
                  {change || '+8.02%'}
              </span>
              <p className="text-xs text-gray-400 font-medium mt-1">from last month</p>
          </div>
      </div>

      <div className="space-y-6 flex-grow">
          {data.slice(0, 4).map((item, idx) => (
              <div key={idx}>
                  <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-gray-500">{item.state}</span>
                      <span className="text-gray-900 font-bold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-orange-50 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#8A63D2] h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}
