"use client";
import React, { useState, useEffect } from "react";
import { Search, Upload, SlidersHorizontal, Coins, ShoppingBag, DollarSign, Mail, Filter } from "lucide-react";
import * as motion from "motion/react-client";
import { supabase } from "@/lib/supabaseClient";
import { subDays, isAfter, isBefore, startOfYear, startOfWeek, startOfMonth } from "date-fns";

import StatCard from "../../components/dashboard/StatCard";
import RecentSalesTable from "../../components/dashboard/RecentSalesTable";
import UserGrowthChart from "../../components/dashboard/UserGrowthChart";
import BestSellers from "../../components/dashboard/BestSellers";

export default function DashboardPage() {
    const [greeting, setGreeting] = useState('Good Morning');
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        sales: { value: 0, change: 0, trend: 'neutral' },
        units: { value: 0, change: 0, trend: 'neutral' },
        aov: { value: 0, change: 0, trend: 'neutral' }
    });
    const [data, setData] = useState({
        orders: [],
        orderItems: [],
        customers: []
    });

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setGreeting('Good Morning');
        else if (hour >= 12 && hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get Website ID
            const { data: website } = await supabase
                .from("websites")
                .select("id")
                .eq("user_id", user.id)
                .limit(1)
                .maybeSingle();

            if (!website) {
                setLoading(false);
                return;
            }

            const oneYearAgo = subDays(new Date(), 365).toISOString();

            // Fetch Orders (Last 365 days)
            const { data: orders, error: ordersError } = await supabase
                .from("orders")
                .select(`
                    id,
                    created_at,
                    total_amount,
                    status,
                    customer_id,
                    source,
                    customers (id, name, email)
                `)
                .eq("website_id", website.id)
                .neq("status", "canceled")
                .gte("created_at", oneYearAgo)
                .order("created_at", { ascending: false });

            if (ordersError) throw ordersError;

            // Fetch Order Items (for Units and Best Sellers)
            // We need to filter these by the fetched orders to ensure consistency (and website_id via orders)
            // But Supabase doesn't support "whereIn" with large arrays easily in client.
            // However, we can filter by website_id if we join or just fetch all for website.
            // Let's fetch order_items linked to the website's products.
            // Actually, `order_items` -> `products` -> `website_id`.
            // Easier: Fetch order_items where order_id in [orders].

            const orderIds = orders.map(o => o.id);
            let orderItems = [];
            if (orderIds.length > 0) {
                 const { data: items, error: itemsError } = await supabase
                    .from("order_items")
                    .select(`
                        id,
                        quantity,
                        price,
                        order_id,
                        product_id,
                        products (name, image_url, price),
                        orders (created_at)
                    `)
                    .in("order_id", orderIds);
                 if (itemsError) throw itemsError;
                 orderItems = items;
            }

            // Fetch Customers (for Growth) - All time to calculate total vs new
            const { data: customers, error: customersError } = await supabase
                .from("customers")
                .select("id, created_at")
                .eq("website_id", website.id);

            if (customersError) throw customersError;

            // --- Calculate Top Metrics (Last 30 Days vs Prior 30 Days) ---
            const now = new Date();
            const thirtyDaysAgo = subDays(now, 30);
            const sixtyDaysAgo = subDays(now, 60);

            // Filter for periods
            const currentPeriodOrders = orders.filter(o => {
                const d = new Date(o.created_at);
                return isAfter(d, thirtyDaysAgo) && isBefore(d, now);
            });
            const priorPeriodOrders = orders.filter(o => {
                const d = new Date(o.created_at);
                return isAfter(d, sixtyDaysAgo) && isBefore(d, thirtyDaysAgo);
            });

            // Sales
            const currentSales = currentPeriodOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
            const priorSales = priorPeriodOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
            const salesChange = calculateChange(currentSales, priorSales);

            // Units (Need to map order items to periods)
            const getUnits = (periodOrders) => {
                const periodOrderIds = new Set(periodOrders.map(o => o.id));
                return orderItems
                    .filter(item => periodOrderIds.has(item.order_id))
                    .reduce((sum, item) => sum + item.quantity, 0);
            };
            const currentUnits = getUnits(currentPeriodOrders);
            const priorUnits = getUnits(priorPeriodOrders);
            const unitsChange = calculateChange(currentUnits, priorUnits);

            // AOV
            const currentAOV = currentPeriodOrders.length ? (currentSales / currentPeriodOrders.length) : 0;
            const priorAOV = priorPeriodOrders.length ? (priorSales / priorPeriodOrders.length) : 0;
            const aovChange = calculateChange(currentAOV, priorAOV);

            setMetrics({
                sales: {
                    value: currentSales,
                    change: salesChange,
                    trend: salesChange >= 0 ? 'up' : 'down'
                },
                units: {
                    value: currentUnits,
                    change: unitsChange,
                    trend: unitsChange >= 0 ? 'up' : 'down'
                },
                aov: {
                    value: currentAOV,
                    change: aovChange,
                    trend: aovChange >= 0 ? 'up' : 'down'
                }
            });

            setData({ orders, orderItems, customers });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateChange = (current, prior) => {
        if (prior === 0) return current > 0 ? 100 : 0;
        return ((current - prior) / prior) * 100;
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD', // Or INR based on preference? User mock had both. RecentSales used ₹. StatCard $.
                             // I'll stick to $ for StatCards as per mock, or make it dynamic later.
                             // Let's check StatCard mock: "$10,845,329.00". RecentSales: "₹1,250".
                             // I will use ₹ (INR) since RecentSales uses it and name implies Indian context (BizVistaar).
                             // User mock StatCard used $. I will switch to ₹ to be consistent with RecentSales or ask?
                             // The code shows RecentSales used ₹. I will use ₹.
            currency: 'INR'
        }).format(val);
    };

    // Helper to format number
    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-4 font-sans not-italic">
      {/* Left Column (Main Content) */}
      <div className="xl:col-span-3 flex flex-col gap-8">
        {/* Greeting & Controls */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
          <h1 className="text-2xl font-bold text-[#111] not-italic">{greeting}, Owner!</h1>
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
               value={formatCurrency(metrics.sales.value)}
               change={`${metrics.sales.change.toFixed(1)}%`}
               period="vs. prior 30 days" 
               icon={Coins} 
            />
            <StatCard 
               title="Units" 
               value={formatNumber(metrics.units.value)}
               change={`${metrics.units.change.toFixed(1)}%`}
               period="vs. prior 30 days" 
               icon={ShoppingBag} 
            />
            <StatCard 
               title="Average Order Value" 
               value={formatCurrency(metrics.aov.value)}
               change={`${metrics.aov.change.toFixed(1)}%`}
               period="vs. prior 30 days" 
               icon={DollarSign} 
            />
        </div>

        {/* Recent Sales Table */}
        <RecentSalesTable orders={data.orders} />
      </div>

      {/* Right Column (Sidebar) */}
      <div className="xl:col-span-1 flex flex-col gap-8">
         {/* User Growth */}
         <div className="h-[400px]">
             <UserGrowthChart customers={data.customers} />
         </div>

         {/* Top 3 Best Sellers */}
         <BestSellers orderItems={data.orderItems} />

      
      </div>
    </div>
  );
}
