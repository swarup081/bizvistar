"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, MapPin } from 'lucide-react';

export default function ActiveUsersStateChart({ data, totalUsers }) {
  const calculatePercentage = (value) => {
    if (!totalUsers || totalUsers === 0) return "0%";
    return `${((value / totalUsers) * 100).toFixed(1)}%`;
  };

  return (
    <div id="active-users" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full w-full relative">
      <div className="flex justify-between items-start mb-6">
        <div>
           <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 flex items-center gap-2">
               Active Users
           </h3>
           <div className="flex items-center gap-2 mt-2">
               <span className="text-3xl font-bold text-gray-900">{totalUsers.toLocaleString()}</span>
               <span className="text-xs text-[#4CAF50] font-medium bg-green-50 px-2 py-0.5 rounded-full flex items-center">
                   <TrendingUp className="w-3 h-3 mr-1" />
                   Users
               </span>
           </div>
           <span className="text-[11px] text-gray-400 mt-1 block uppercase tracking-wider font-semibold">Traffic by state</span>
        </div>
        <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors text-gray-400">
           <MapPin className="w-5 h-5 text-[#8A63D2]" />
        </button>
      </div>

      <div className="flex-grow flex flex-col justify-center w-full h-full min-h-[220px] relative">
        <div className="absolute inset-0 flex">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 15, right: 65, left: 0, bottom: 15 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                 dataKey="state" 
                 type="category" 
                 axisLine={false} 
                 tickLine={false}
                 width={85}
                 tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(138, 99, 210, 0.04)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar 
                 dataKey="users" 
                 radius={[0, 6, 6, 0]}
                 barSize={14}
                 background={{ fill: '#F9FAFB', radius: [0, 6, 6, 0] }}
              >
                 {data.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={index === 0 ? '#8A63D2' : '#C7B3F7'} />
                 ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Ensure percentage labels align exactly with the bars inside Recharts margin */}
          <div className="absolute right-0 top-[15px] bottom-[15px] w-10 flex flex-col justify-around text-xs font-bold text-gray-700 pointer-events-none pr-1">
              {data.map((d, i) => (
                  <span key={i} className={`flex items-center justify-end w-full h-full ${i === 0 ? 'text-[#8A63D2]' : ''}`}>
                      {calculatePercentage(d.users)}
                  </span>
              ))}
          </div>
        </div>
      </div>
      {data.length === 0 && (
         <div className="absolute inset-0 flex items-center justify-center text-center text-gray-400 text-sm bg-white/80 backdrop-blur-[1px] rounded-2xl">
             No location data available
         </div>
      )}
    </div>
  );
}
