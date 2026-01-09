"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function FunnelChart({ data }) {
  // data: [{ name, value, fill }]
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">Conversion Funnel</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" hide />
            <YAxis 
                dataKey="name" 
                type="category" 
                width={100} 
                tick={{ fontSize: 13, fill: '#4B5563', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: '#F9FAFB' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
               {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-6">
          {data.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></span>
                  <span className="text-sm text-gray-600 font-medium">{item.name}: <span className="text-gray-900 font-bold">{item.value}</span></span>
              </div>
          ))}
      </div>
    </div>
  );
}
