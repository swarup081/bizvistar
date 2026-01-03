"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Search, Upload, SlidersHorizontal, Coins, ShoppingBag, DollarSign, Mail, Filter } from "lucide-react";
import * as motion from "motion/react-client"; // Using new import style as per package? Or standard?
// package.json has "motion": "^12.23.24". The import should be `motion/react` or `framer-motion` (if installed). 
// Wait, "motion" package provides `motion` component. 
// "framer-motion" is the old name, "motion" is the new one from Framer. 
// However, typically `import { motion } from "framer-motion"` is standard.
// Let me check if `framer-motion` is installed. `package.json` only has `motion`.
// Documentation for `motion` package: `import { motion } from "motion/react"` usually for React.
// Let's assume `import { motion } from "motion/react"` works. 
// If not, I'll fallback to standard div.

import StatCard from "../../components/dashboard/StatCard";
import RecentSalesTable from "../../components/dashboard/RecentSalesTable";
import UserGrowthChart from "../../components/dashboard/UserGrowthChart";
import BestSellers from "../../components/dashboard/BestSellers";

export default function DashboardPage() {
    const [greeting, setGreeting] = useState('Good Morning');

useEffect(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) setGreeting('Good Morning');
  else if (hour >= 12 && hour < 18) setGreeting('Good Afternoon');
  else setGreeting('Good Evening');
}, []);
  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-4 font-sans not-italic">
      {/* Left Column (Main Content) */}
      <div className="xl:col-span-3 flex flex-col gap-8">
        {/* Greeting & Controls */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
          <h1 className="text-2xl font-bold text-[#111] not-italic">{greeting}, Noah!</h1>
          <p className="mt-1 text-gray-500 font-sans not-italic">Here's what's happening with your store today.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search product..." 
                  className="h-10 w-64 rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2]"
                />
             </div>
             <button className="flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 font-sans not-italic">
                <Upload className="h-4 w-4" />
                Export CSV
             </button>
             {/* Filter Button (Image shows icon) */}
             <button className="h-[38px] w-[38px] flex items-center justify-center bg-[#EEE5FF] text-[#8A63D2] rounded-full hover:bg-[#dcd0f5] transition-all">
                <Filter size={18} />
              </button>
          </div>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard 
               title="Sales" 
               value="$10,845,329.00" 
               change="17.8%" 
               period="vs. prior 30 days" 
               icon={Coins} 
            />
            <StatCard 
               title="Units" 
               value="6,238" 
               change="1.63%" 
               period="vs. prior 30 days" 
               icon={ShoppingBag} 
            />
            <StatCard 
               title="Average Order Value" 
               value="$366.71" 
               change="4.45%" 
               period="vs. prior 30 days" 
               icon={DollarSign} 
            />
        </div>

        {/* Sales Summary Chart */}

        {/* Recent Sales Table */}
        <RecentSalesTable />
      </div>

      {/* Right Column (Sidebar) */}
      <div className="xl:col-span-1 flex flex-col gap-8">
         {/* User Growth */}
         <div className="h-[400px]">
             <UserGrowthChart />
         </div>

         {/* Top 3 Best Sellers */}
         <BestSellers />

      
      </div>
    </div>
  );
}
