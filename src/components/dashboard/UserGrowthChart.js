"use client";
import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronDown, DollarSign, Users } from "lucide-react";
import { isAfter, subDays, startOfYear } from "date-fns";

const COLORS = ["#8A63D2", "#F3F4F6"]; // Purple and Light Gray

export default function UserGrowthChart({ customers = [] }) {
  const [timeFilter, setTimeFilter] = useState("year"); // week, month, year
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const labels = {
      week: "This Week",
      month: "This Month",
      year: "This Year"
  };

  const metrics = useMemo(() => {
     const now = new Date();
     let startDate;

     if (timeFilter === "week") startDate = subDays(now, 7);
     else if (timeFilter === "month") startDate = subDays(now, 30);
     else startDate = startOfYear(now);

     let newCount = 0;
     let totalCount = 0; // Total prior to period? Or just total existing?
     // As per request: "New vs Total".
     // If we show a pie chart of New / Total, the slice for New should be relative to Total?
     // Or New vs (Total - New) i.e. New vs Existing?
     // Mock shows 10% growth.
     // Let's do: New in Period vs Existing (Total - New).
     // Total Customers = Total currently.

     customers.forEach(c => {
         const d = new Date(c.created_at);
         if (isAfter(d, startDate)) {
             newCount++;
         }
     });

     totalCount = customers.length;
     const existingCount = totalCount - newCount;

     // Growth percentage: (New / Existing) * 100? Or just New count?
     // Mock has "10%". If New=10, Remaining=90. Total=100. 10/100 = 10%.
     // So Pie Data: { value: newCount }, { value: existingCount }

     const growthPercentage = totalCount > 0 ? ((newCount / totalCount) * 100).toFixed(1) : 0;

     return {
         newCount,
         totalCount,
         existingCount,
         growthPercentage
     };
  }, [customers, timeFilter]);

  const chartData = [
      { name: "New", value: metrics.newCount || 0 }, // If 0, pie might look empty, handle edge case?
      { name: "Existing", value: metrics.existingCount || 1 } // prevent 0/0
  ];

  // If no customers, show empty state
  if (metrics.totalCount === 0) {
      chartData[0].value = 0;
      chartData[1].value = 1;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900 font-sans not-italic">User Growth</h3>
        <div className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
            {labels[timeFilter]}
            <ChevronDown className="h-3 w-3 text-gray-500" />
            </button>
            {isDropdownOpen && (
                 <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                     {Object.keys(labels).map(key => (
                         <button
                            key={key}
                            onClick={() => { setTimeFilter(key); setIsDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${timeFilter === key ? 'text-purple-600 font-medium' : 'text-gray-700'}`}
                         >
                             {labels[key]}
                         </button>
                     ))}
                 </div>
             )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={chartData}
                cx="50%"
                cy="70%"
                innerRadius={80}
                outerRadius={100}
                startAngle={180}
                endAngle={0}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                cornerRadius={10} 
                >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
            </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 top-8 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{metrics.newCount}</span>
                <span className="text-sm font-bold text-[#4CAF50] mt-1  px-2 py-0.5 rounded-full">↑ {metrics.growthPercentage}%</span>
            </div>
        </div>

         {/* Total Customers Section */}
         <div className="flex items-center gap-4 mt-2 p-3 pr-7 rounded-full bg-gray-50 border border-gray-100 w-full max-w-[90%]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#8A63D2] shadow-sm border border-purple-100">
                <Users className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Customers</p>
                <p className="text-lg font-bold text-gray-900 leading-none">{metrics.totalCount}</p>
            </div>
         </div>
      </div>
    </div>
  );
}
