"use client";

import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export function UserGrowthChart({ users }) {
  const data = useMemo(() => {
    // Generate last 7 days data
    const days = 7;
    const result = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const count = (users || []).filter(u => {
        const uDate = new Date(u.created_at);
        return uDate.toDateString() === d.toDateString();
      }).length;
      
      result.push({ name: dateStr, signups: count });
    }
    return result;
  }, [users]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="signups" stroke="#8A63D2" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueChart({ orders }) {
  const data = useMemo(() => {
    // Generate last 7 days revenue
    const days = 7;
    const result = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dailyRevenue = (orders || [])
        .filter(o => o.status !== 'canceled')
        .filter(o => {
          const oDate = new Date(o.created_at);
          return oDate.toDateString() === d.toDateString();
        })
        .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
        
      result.push({ name: dateStr, revenue: dailyRevenue });
    }
    return result;
  }, [orders]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
          <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value) => [`₹${value}`, 'Revenue']}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
