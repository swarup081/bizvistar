"use client";
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Edit2, Check, X, TrendingUp } from 'lucide-react';
import { updateMonthlyTarget } from '@/app/actions/analyticsActions';

export default function MonthlyTargetGauge({ websiteId, currentRevenue, initialTarget, isLocked = false }) {
  const [target, setTarget] = useState(initialTarget || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(initialTarget || 0);

  const percentage = target > 0 ? Math.min(Math.round((currentRevenue / target) * 100), 100) : 0;

  const data = [
    { name: 'Achieved', value: percentage },
    { name: 'Remaining', value: 100 - percentage }
  ];
  const COLORS = ['#8A63D2', '#F3F4F6']; // Purple and Gray

  const handleSave = async () => {
      const newTarget = Number(editValue);
      if (!isNaN(newTarget) && newTarget >= 0) {
          setTarget(newTarget);
          setIsEditing(false);
          await updateMonthlyTarget(websiteId, newTarget);
      }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden">
      {isLocked && (
        <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center rounded-2xl">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 text-center max-w-[280px]">
            <div className="w-12 h-12 bg-purple-100 text-[#8A63D2] rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Upgrade to Unlock</h3>
            <p className="text-sm text-gray-500 mb-4">Set and track monthly revenue goals with Growth & Pro plans.</p>
            <a href="/dashboard/billing" className="block w-full py-2 px-4 bg-[#8A63D2] hover:bg-[#7a55bd] text-white rounded-lg font-medium transition-colors text-sm">
              View Plans
            </a>
          </div>
        </div>
      )}

      <div className={`flex flex-col h-full justify-between ${isLocked ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 font-sans">Monthly Target</h3>
          {!isEditing && (
              <button onClick={() => {setEditValue(target); setIsEditing(true);}} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit2 size={16} />
              </button>
          )}
      </div>

      <div className="relative h-48 w-full flex-grow flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
              <Pie
                data={data}
                cx="50%"
                cy="70%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <h2 className="text-3xl font-bold text-gray-900 font-sans">{percentage}%</h2>
          </div>
      </div>

      <div className="text-center mt-4">
          <h4 className="text-sm font-bold text-gray-900 font-sans">Great Progress! 🎉</h4>
          <p className="text-xs text-gray-500 mt-1">Our achievement reached <span className="text-[#8A63D2] font-semibold">₹{Number(currentRevenue).toLocaleString()}</span>; let's reach 100% this month.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center border-r border-gray-100 px-4">
              <p className="text-xs text-gray-500 font-medium mb-1">Target</p>
              {isEditing ? (
                  <div className="flex items-center gap-2 justify-center">
                      <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full text-center border border-gray-200 rounded text-sm py-1 font-bold text-gray-900 focus:outline-none focus:border-[#8A63D2]"
                      />
                      <button onClick={handleSave} className="text-green-500"><Check size={16}/></button>
                      <button onClick={() => setIsEditing(false)} className="text-red-500"><X size={16}/></button>
                  </div>
              ) : (
                  <p className="text-lg font-bold text-gray-900 font-sans tracking-tight">₹{Number(target).toLocaleString()}</p>
              )}
          </div>
          <div className="text-center px-4">
              <p className="text-xs text-gray-500 font-medium mb-1">Revenue</p>
              <p className="text-lg font-bold text-gray-900 font-sans tracking-tight">₹{Number(currentRevenue).toLocaleString()}</p>
          </div>
      </div>
      </div>
    </div>
  );
}
