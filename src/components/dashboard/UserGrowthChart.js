"use client";
import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronDown, Users, Globe, Loader2 } from "lucide-react";
import { isAfter, subDays, startOfYear } from "date-fns";

const COLORS = ["#8A63D2", "#F3F4F6"]; // Purple and Light Gray

export default function UserGrowthChart({ visitors = [], totalVisitorsCount = 0, isLoading = false }) {
  const [timeFilter, setTimeFilter] = useState("week"); // week, month, year
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

     const periodVisitorIds = new Set();
     
     visitors.forEach(v => {
         const d = new Date(v.timestamp);
         if (isAfter(d, startDate)) {
             periodVisitorIds.add(v.visitorId);
         }
     });

     const periodCount = periodVisitorIds.size;
     const safeTotal = Math.max(totalVisitorsCount, periodCount);
     const remainingCount = safeTotal - periodCount;
     const percentageOfTotal = safeTotal > 0 ? ((periodCount / safeTotal) * 100).toFixed(1) : 0;

     return {
         periodCount,
         totalCount: safeTotal,
         remainingCount,
         percentageOfTotal
     };
  }, [visitors, totalVisitorsCount, timeFilter]);

  const chartData = [
      { name: "Period", value: metrics.periodCount || 0 }, 
      { name: "Total", value: metrics.remainingCount || 1 } // prevent 0/0
  ];
  
  if (metrics.totalCount === 0) {
      chartData[0].value = 0;
      chartData[1].value = 1; 
  }

  return (
    <div className="rounded-2xl bg-white p-3 md:p-6 shadow-sm h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm md:text-lg font-bold text-gray-900 font-sans not-italic">Traffic Growth</h3>
        <div className="relative">
            <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 md:gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
            <span className="max-w-[50px] md:max-w-none truncate">{labels[timeFilter]}</span>
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
        {isLoading ? (
            <div className="h-[200px] w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-purple-200 animate-spin" />
            </div>
        ) : (
        <>
            <div className="h-[200px] w-full relative hidden md:block">
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
                    <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{metrics.periodCount}</span>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mt-1">Visitors</span>
                </div>
            </div>

            {/* Mobile View: Simple Stats (No Chart) */}
            <div className="flex md:hidden flex-col items-center justify-center gap-1 py-4">
                <span className="text-4xl font-extrabold text-gray-900 tracking-tight">{metrics.periodCount}</span>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Visitors (Period)</span>
            </div>
        </>
        )}

         {/* Total Visitors Section */}
         <div className="flex items-center gap-2 md:gap-4 mt-2 p-2 md:p-3 pr-4 md:pr-7 rounded-2xl md:rounded-full bg-gray-50 border border-gray-100 w-full max-w-[90%]">
            <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#8A63D2] shadow-sm border border-purple-100">
                <Globe className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center min-w-0">
                <p className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wide leading-tight">Total<br className="hidden md:block"/> Visitors</p>
                {isLoading ? (
                    <div className="h-5 w-16 bg-gray-100 rounded md:ml-5 animate-pulse"></div>
                ) : (
                    <p className="text-sm md:text-lg font-bold text-gray-900 leading-none md:pl-5 truncate">{metrics.totalCount}</p>
                )}
            </div>
         </div>
      </div>
    </div>
  );
}
