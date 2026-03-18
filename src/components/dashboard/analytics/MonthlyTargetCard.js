"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { MoreHorizontal } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function MonthlyTargetCard({ websiteId, currentRevenue }) {
  const [target, setTarget] = useState(600000); // Default placeholder

  useEffect(() => {
     async function fetchTarget() {
         if (!websiteId) return;
         const now = new Date();
         const month = now.getMonth() + 1;
         const year = now.getFullYear();

         try {
             const { data, error } = await supabase
               .from('monthly_targets')
               .select('target_amount')
               .eq('website_id', websiteId)
               .eq('month', month)
               .eq('year', year)
               .maybeSingle();

             if (data && data.target_amount) {
                 setTarget(data.target_amount);
             }
         } catch (e) {
             console.error("Failed to load target", e);
         }
     }
     fetchTarget();
  }, [websiteId]);

  const percentage = Math.min(100, (currentRevenue / target) * 100);
  const pieData = [
    { name: 'Revenue', value: percentage },
    { name: 'Remaining', value: Math.max(0, 100 - percentage) }
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full w-full relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 text-lg">Monthly Target</h3>
        <button className="text-gray-400 hover:text-gray-600">
           <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="relative h-32 w-full mt-2 overflow-hidden flex items-end justify-center">
        <ResponsiveContainer width="100%" height={240} className="absolute bottom-[-110px]">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={95}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              <Cell fill="#8A63D2" />
              <Cell fill="#F3E8FF" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center pointer-events-none z-10">
           <span className="text-2xl font-bold text-gray-900">{percentage.toFixed(0)}%</span>
           <span className="text-[10px] font-bold text-[#4CAF50] bg-green-50 px-2 py-0.5 rounded-full mt-1">
               +{percentage.toFixed(2)}% <span className="text-gray-500 font-medium">from last month</span>
           </span>
        </div>
      </div>

      <div className="text-center mt-6 mb-4">
          <p className="text-sm font-bold text-gray-800">Great Progress! 🎉</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed px-2">
              Our achievement increased by <span className="text-[#8A63D2] font-semibold">₹{currentRevenue.toLocaleString()}</span>;
              let's reach 100% next month.
          </p>
      </div>

      <div className="flex mt-auto rounded-xl bg-purple-50 overflow-hidden divide-x divide-white">
          <div className="flex-1 py-3 px-2 flex flex-col items-center">
             <span className="text-xs text-gray-500 font-medium mb-1">Target</span>
             <span className="text-sm font-bold text-gray-900">₹{target.toLocaleString()}</span>
          </div>
          <div className="flex-1 py-3 px-2 flex flex-col items-center">
             <span className="text-xs text-gray-500 font-medium mb-1">Revenue</span>
             <span className="text-sm font-bold text-gray-900">₹{currentRevenue.toLocaleString()}</span>
          </div>
      </div>
    </div>
  );
}
