"use client";
import React, { useState, useEffect, useRef } from 'react';
import { saveMonthlyTarget, getMonthlyTarget } from '@/app/actions/analyticsActions';
import { supabase } from '@/lib/supabaseClient';
import { MoreHorizontal, Edit2, Check, X, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function MonthlyTargetCard({ websiteId, currentRevenue, prevRevenue = 0, targetMultiplier = 1 }) {
  const [target, setTarget] = useState(600000); // Default placeholder
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const dropdownRef = useRef(null);
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  
  
  useEffect(() => {
     async function fetchTarget() {
         if (!websiteId) return;
         setInitialLoading(true);
         try {
             const res = await getMonthlyTarget(websiteId);
             if (res && res.data) {
                 setTarget(res.data);
             }
         } catch (e) {
             console.error("Failed to load target", e);
         } finally {
             setInitialLoading(false);
         }
     }
     fetchTarget();
  }, [websiteId]);



  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  
  
  const handleSave = async (e) => {
      e.preventDefault();
      e.stopPropagation(); // Stop event bubbling
      const newTarget = parseInt(editValue, 10);
      if (isNaN(newTarget) || newTarget <= 0) {
          setIsEditing(false);
          return;
      }
      setLoading(true);
      
      try {
          const res = await saveMonthlyTarget(websiteId, newTarget);
          if (res && res.success) {
             setTarget(newTarget);
             setIsEditing(false);
          } else {
             console.error("Error saving target:", res.error);
          }
      } catch (err) {
          console.error("Error saving target:", err);
      }
      setLoading(false);
  };



  
  
  
  
  const handleReset = async () => {
      setLoading(true);
      try {
          const res = await saveMonthlyTarget(websiteId, 600000); // 6L is default placeholder visually
          if (res && res.success) {
              setTarget(600000); // Reset to default visual
              setIsDropdownOpen(false);
          }
      } catch (err) {
          console.error("Error resetting target", err);
      }
      setLoading(false);
  };




  
  const scaledTarget = target * targetMultiplier;
  const percentage = Math.min(100, (currentRevenue / scaledTarget) * 100);

  const pieData = [
    { name: 'Revenue', value: percentage },
    { name: 'Remaining', value: Math.max(0, 100 - percentage) }
  ];
  
  // Calculate dynamic text values
  const revenueGrowth = currentRevenue - prevRevenue;
  const growthText = revenueGrowth >= 0 ? `increased by ₹${revenueGrowth.toLocaleString()}` : `decreased by ₹${Math.abs(revenueGrowth).toLocaleString()}`;
  
  let percentageGrowth = 0;
  if (prevRevenue > 0) {
      percentageGrowth = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
  } else if (currentRevenue > 0) {
      percentageGrowth = 100;
  }

  
  if (initialLoading) {
     return (
        <div id="monthly-target" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full w-full relative animate-pulse">
           <div className="flex justify-between items-center mb-4">
               <div className="h-5 bg-gray-200 rounded w-1/2"></div>
               <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
           </div>
           <div className="relative h-32 w-full mt-2 overflow-hidden flex items-end justify-center">
               <div className="h-24 w-48 bg-gray-100 rounded-t-full"></div>
           </div>
           <div className="text-center mt-auto mb-6 flex flex-col items-center gap-2">
               <div className="h-4 bg-gray-200 rounded w-1/3"></div>
               <div className="h-3 bg-gray-200 rounded w-3/4"></div>
           </div>
           <div className="h-[60px] bg-gray-100 rounded-xl w-full"></div>
        </div>
     );
  }

  return (
    <div id="monthly-target" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full w-full relative">

      <div className="flex justify-between items-center mb-4 relative" ref={dropdownRef}>
        <h3 className="font-semibold text-gray-900 text-lg">Monthly Target</h3>
        
        <button 
           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
           className="text-gray-400 hover:text-gray-600 p-1"
        >
           <MoreHorizontal className="w-5 h-5" />
        </button>
        
        {isDropdownOpen && !isEditing && (
            <div className="absolute top-8 right-0 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-20 w-32 flex flex-col">
               <button 
                   onClick={() => { setIsEditing(true); setEditValue(target.toString()); setIsDropdownOpen(false); }}
                   className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left w-full"
               >
                  <Edit2 className="w-4 h-4 text-gray-500" /> Edit
               </button>
               <button 
                   onClick={handleReset}
                   disabled={loading}
                   className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left w-full border-t border-gray-50"
               >
                  <RefreshCw className="w-4 h-4 text-red-500" /> Reset
               </button>
            </div>
        )}
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
           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full -mb-2 ${percentageGrowth >= 0 ? 'text-[#4CAF50] ' : 'text-red-500 bg-red-50'}`}>
               {percentageGrowth >= 0 ? '+' : ''}{percentageGrowth.toFixed(2)}% <span className="text-gray-500 font-medium">from last month</span>
           </span>
        </div>
      </div>

      
      <div className="text-center mt-auto mb-6">
          <p className="text-sm font-bold text-gray-800">
              {percentage < 40 && "Keep Pushing!"}
              {percentage >= 40 && percentage < 75 && "Good Progress!"}
              {percentage >= 75 && percentage < 100 && "Almost There!"}
              {percentage >= 100 && "Target Achieved!"}
          </p>

          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed px-2">
              {percentage < 40 && (
                  <>You're just getting started — consistency is key. Let's aim higher next month </>
              )}

              {percentage >= 40 && percentage < 75 && (
                  <>You're on the right track. <span className="text-[#8A63D2] font-semibold">{growthText}</span> — keep building momentum.</>
              )}

              {percentage >= 75 && percentage < 100 && (
                  <>So close! <span className="text-[#8A63D2] font-semibold">{growthText}</span>. A small push and you'll hit 100% next month.</>
              )}

              {percentage >= 100 && (
                  <>Amazing work! You exceeded your target Time to set an even bigger goal next month.</>
              )}
          </p>
      </div>


      <div className="flex mt-auto rounded-xl bg-purple-50 overflow-hidden divide-x divide-white h-[60px] relative">
          <div className="flex-1 py-3 px-2 flex flex-col items-center justify-center relative">
             {isEditing ? (
                 <div className="absolute inset-0 bg-white z-20 flex flex-col justify-center items-center px-1">
                    <div className="flex items-center gap-1 w-full justify-center mt-1">
                       <input 
                          autoFocus
                          type="number" 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)} disabled={loading}
                          onKeyDown={(e) => {
                             if (e.key === 'Enter') handleSave(e);
                             if (e.key === 'Escape') setIsEditing(false);
                          }}
                          className="w-16 text-xs font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded outline-none p-1 text-center"
                       />
                       
                       <button type="button" onMouseDown={(e) => { e.preventDefault(); handleSave(e); }} disabled={loading} className="text-green-500 hover:text-green-700 bg-green-50 p-1.5 rounded-md transition-colors cursor-pointer flex-shrink-0 z-30">
                          {loading ? (
                             <div className="w-3.5 h-3.5 border-2 border-green-200 border-t-green-500 rounded-full animate-spin pointer-events-none" />
                          ) : (
                             <Check className="w-3.5 h-3.5 pointer-events-none" />
                          )}
                       </button>
                       <button type="button" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(false); }} disabled={loading} className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-md transition-colors cursor-pointer flex-shrink-0 z-30">
                          <X className="w-3.5 h-3.5 pointer-events-none" />
                       </button>

                    </div>
                 </div>
             ) : (
                 <>
                    <span className="text-[11px] text-gray-500 font-medium mb-1 uppercase tracking-wide">Target</span>
                    <span className="text-sm font-bold text-gray-900">₹{scaledTarget.toLocaleString()}</span>
                 </>
             )}
          </div>
          <div className="flex-1 py-3 px-2 flex flex-col items-center justify-center">
             <span className="text-[11px] text-gray-500 font-medium mb-1 uppercase tracking-wide">Revenue</span>
             <span className="text-sm font-bold text-gray-900">₹{currentRevenue.toLocaleString()}</span>
          </div>
      </div>
    </div>
  );
}
