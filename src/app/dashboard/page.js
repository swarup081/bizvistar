"use client";
import React, { useState, useEffect } from "react";
import { Search, Upload, Coins, ShoppingBag, DollarSign, Filter } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { subDays, isAfter, isBefore } from "date-fns";

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
            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 2. Get Website ID
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

            // 3. Fetch Data in Parallel (Mirroring OrdersPage strategy for reliability)
            // Fetch ALL orders (or limit to a reasonable high number like 1000 for dashboard analytics)
            // We removed the 365 days filter to ensure we get data if it's older (like test data).
            // But we will limit to 500 latest orders to keep it performant.
            const { data: orders, error: ordersError } = await supabase
                .from("orders")
                .select("*")
                .eq("website_id", website.id)
                .neq("status", "canceled") // Metric requirement: exclude canceled
                .order("created_at", { ascending: false })
                .limit(500);

            if (ordersError) throw ordersError;

            if (!orders || orders.length === 0) {
                 setData({ orders: [], orderItems: [], customers: [] });
                 setLoading(false);
                 return;
            }

            // Collect IDs
            const orderIds = orders.map(o => o.id);
            const customerIds = [...new Set(orders.map(o => o.customer_id).filter(Boolean))];

            // Fetch Related Data
            const [
                { data: customersRes },
                { data: itemsRes }
            ] = await Promise.all([
                 customerIds.length > 0 ? supabase.from('customers').select('*').in('id', customerIds) : Promise.resolve({ data: [] }),
                 supabase.from('order_items').select('*').in('order_id', orderIds)
            ]);

            const customers = customersRes || [];
            let items = itemsRes || [];

            // Fetch Products for Items
            const productIds = [...new Set(items.map(i => i.product_id))];
            const { data: products } = productIds.length > 0
                ? await supabase.from('products').select('id, name, image_url, price').in('id', productIds)
                : { data: [] };

            const productsMap = (products || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
            const customersMap = (customers || []).reduce((acc, c) => ({ ...acc, [c.id]: c }), {});

            // Join Data in Memory
            const enrichedOrders = orders.map(o => ({
                ...o,
                customers: customersMap[o.customer_id] || { name: 'Unknown', email: '' }
            }));

            // Enrich items with products and order date (for BestSellers logic)
            // We map order date to items
            const ordersDateMap = orders.reduce((acc, o) => ({...acc, [o.id]: o.created_at}), {});

            const enrichedItems = items.map(i => ({
                ...i,
                products: productsMap[i.product_id],
                orders: { created_at: ordersDateMap[i.order_id] } // Mocking structure expected by BestSellers
            }));

            // --- Calculate Top Metrics (Last 30 Days vs Prior 30 Days) ---
            const now = new Date();
            const thirtyDaysAgo = subDays(now, 30);
            const sixtyDaysAgo = subDays(now, 60);

            // Filter for periods
            const currentPeriodOrders = enrichedOrders.filter(o => {
                const d = new Date(o.created_at);
                return isAfter(d, thirtyDaysAgo) && isBefore(d, now);
            });
            const priorPeriodOrders = enrichedOrders.filter(o => {
                const d = new Date(o.created_at);
                return isAfter(d, sixtyDaysAgo) && isBefore(d, thirtyDaysAgo);
            });

            // Sales
            const currentSales = currentPeriodOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
            const priorSales = priorPeriodOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
            const salesChange = calculateChange(currentSales, priorSales);

            // Units
            const getUnits = (periodOrders) => {
                const periodOrderIds = new Set(periodOrders.map(o => o.id));
                return enrichedItems
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
                    change: salesChange
                },
                units: {
                    value: currentUnits,
                    change: unitsChange
                },
                aov: {
                    value: currentAOV,
                    change: aovChange
                }
            });

            // For User Growth: We need ALL customers, not just those in recent orders.
            // Fetch all customers for website (separate fetch)
            const { data: allCustomers } = await supabase
                .from("customers")
                .select("id, created_at")
                .eq("website_id", website.id);

            setData({
                orders: enrichedOrders,
                orderItems: enrichedItems,
                customers: allCustomers || []
            });

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
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(val);
    };

    const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num);

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
