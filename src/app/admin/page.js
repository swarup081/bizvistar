"use client";

import React, { useState, useEffect } from "react";
import { Users, Globe, Package, DollarSign, Share2, Palette, TrendingUp } from "lucide-react";
import dynamic from 'next/dynamic';
import { getAdminDashboardStats, getRecentOrders } from "@/app/actions/adminActions";
import AdminSkeleton from "@/components/admin/AdminSkeleton";

const AdminStatCard = dynamic(() => import("@/components/admin/AdminStatCard"), { ssr: false });

import { UserGrowthChart, RevenueChart } from "@/components/admin/AdminCharts";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    async function load() {
      const [statsResult, ordersResult] = await Promise.all([
        getAdminDashboardStats(),
        getRecentOrders(15)
      ]);
      if (statsResult.success) setStats(statsResult.stats);
      if (ordersResult.success) setRecentOrders(ordersResult.orders);
      setLoading(false);
    }
    load();
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num);

  if (loading) return <AdminSkeleton />;

  const statCards = [
    { title: 'Total Users', value: formatNumber(stats?.totalUsers || 0), icon: Users, accent: '#8A63D2' },
    { title: 'Websites', value: `${stats?.publishedWebsites || 0} / ${stats?.totalWebsites || 0}`, icon: Globe, accent: '#3B82F6' },
    { title: 'Total Orders', value: formatNumber(stats?.totalOrders || 0), icon: Package, accent: '#10B981' },
    { title: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, accent: '#F59E0B' },
    { title: 'Active Subs', value: formatNumber(stats?.activeSubscriptions || 0), icon: TrendingUp, accent: '#EC4899' },
    { title: 'Shared Templates', value: formatNumber(stats?.totalSharedTemplates || 0), icon: Share2, accent: '#6366F1' },
    { title: 'Template Claims', value: formatNumber(stats?.totalClaims || 0), icon: Palette, accent: '#14B8A6' },
  ];

  return (
    <div className="font-sans not-italic pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-[#111] not-italic">Admin Dashboard</h1>
        <p className="mt-1 text-sm md:text-base text-gray-500 font-sans not-italic">
          Platform overview and management
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        {statCards.map((card) => (
          <AdminStatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">User Growth (Last 7 Days)</h2>
          <UserGrowthChart users={stats?.recentUsers} />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Revenue (Last 7 Days)</h2>
          <RevenueChart orders={stats?.revenueData} />
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Recent Orders (All Users)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">No orders yet</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-700 font-mono text-xs">#{order.id}</td>
                    <td className="px-4 py-3 text-gray-700">{order.customerName}</td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">{formatCurrency(order.total_amount)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    canceled: 'bg-red-50 text-red-700 border-red-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
      {status}
    </span>
  );
}

