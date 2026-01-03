"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronDown, DollarSign } from "lucide-react";

// Data for the donut chart
const data = [
  { name: "Growth", value: 10 },
  { name: "Remaining", value: 90 },
];

const COLORS = ["#8A63D2", "#F3F4F6"]; // Purple and Light Gray

export default function UserGrowthChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900 font-sans not-italic">User Growth</h3>
        <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
           This Year
           <ChevronDown className="h-3 w-3 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={data}
                cx="50%"
                cy="70%" // Moved center down slightly to maximize space
                innerRadius={80}
                outerRadius={100}
                startAngle={180}
                endAngle={0}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                cornerRadius={10} 
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
            </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 top-8 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">3,740</span>
                <span className="text-sm font-bold text-[#4CAF50] mt-1  px-2 py-0.5 rounded-full">↑ 10%</span>
            </div>
        </div>

         {/* Total Customers Section - Better visual hierarchy */}
         <div className="flex items-center gap-4 mt-2 p-3 pr-7 rounded-full bg-gray-50 border border-gray-100 w-full max-w-[90%]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#8A63D2] shadow-sm border border-purple-100">
                <DollarSign className="h-5 w-5" />
            </div>
            <div className="flex"> 
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Customers</p>
                <p className="text-lg pl-5 font-bold text-gray-900">7,429</p>
            </div>
         </div>
      </div>
    </div>
  );
}
