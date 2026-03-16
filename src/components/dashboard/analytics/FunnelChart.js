"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

export default function FunnelChart({ data }) {
  // data: [{ name, value, change, fill }]
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 font-sans">Conversion Rate</h3>
          <button className="flex items-center gap-2 bg-[#8A63D2] text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              This Week <ChevronDown size={14} />
          </button>
      </div>

      <div className="flex-grow h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#4B5563', fontWeight: 500 }}
                dy={10}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: '#F9FAFB' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
               {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || '#8A63D2'} fillOpacity={1 - (index * 0.15)} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4">
          {data.map((item, idx) => (
              <div key={idx} className="text-center flex flex-col items-center">
                  <p className="text-xs text-gray-500 font-medium mb-1 h-8 flex items-end">{item.name}</p>
                  <span className="text-lg font-bold text-gray-900 font-sans tracking-tight">{Number(item.value).toLocaleString()}</span>
                  {item.change && (
                      <span className={`text-[10px] font-bold font-sans mt-1 px-1.5 py-0.5 rounded-md ${item.change.startsWith('+') ? 'text-[#4CAF50] bg-green-50' : 'text-red-500 bg-red-50'}`}>
                          {item.change}
                      </span>
                  )}
              </div>
          ))}
      </div>
    </div>
  );
}
