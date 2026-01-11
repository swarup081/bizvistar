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
        customers: [],
        visitors: [], // Timestamp-only objects from client_analytics
        totalVisitorsCount: 0 // All time unique count
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

            // --- 1. Fetch Orders (Limit 500) ---
            const { data: orders, error: ordersError } = await supabase
                .from("orders")
                .select("*")
                .eq("website_id", website.id)
                .neq("status", "canceled") 
                .order("created_at", { ascending: false })
                .limit(500);

            if (ordersError) throw ordersError;
            
            // --- 2. Fetch Related Order Data ---
            const orderIds = (orders || []).map(o => o.id);
            const customerIds = [...new Set((orders || []).map(o => o.customer_id).filter(Boolean))];

            const [
                { data: customersRes },
                { data: itemsRes }
            ] = await Promise.all([
                 customerIds.length > 0 ? supabase.from('customers').select('*').in('id', customerIds) : Promise.resolve({ data: [] }),
                 orderIds.length > 0 ? supabase.from('order_items').select('*').in('order_id', orderIds) : Promise.resolve({ data: [] })
            ]);

            const customers = customersRes || [];
            let items = itemsRes || [];

            // --- 3. Fetch Products ---
            const productIds = [...new Set(items.map(i => i.product_id))];
            const { data: products } = productIds.length > 0 
                ? await supabase.from('products').select('id, name, image_url, price').in('id', productIds)
                : { data: [] };
            
            const productsMap = (products || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
            const customersMap = (customers || []).reduce((acc, c) => ({ ...acc, [c.id]: c }), {});

            // Join Data in Memory
            const enrichedOrders = (orders || []).map(o => ({
                ...o,
                customers: customersMap[o.customer_id] || { name: 'Unknown', email: '' }
            }));

            const ordersDateMap = (orders || []).reduce((acc, o) => ({...acc, [o.id]: o.created_at}), {});
            
            const enrichedItems = items.map(i => ({
                ...i,
                products: productsMap[i.product_id],
                orders: { created_at: ordersDateMap[i.order_id] } 
            }));

            // --- 4. Fetch Traffic (Visitors) ---
            // For "Traffic vs Total": 
            // Total = All time unique visitors.
            // Period = Unique visitors in that period.
            // We'll fetch recent analytics events to calculate period traffic.
            // And we'll try to get a total count.
            // Since counting distinct jsonb fields is hard in simple Supabase query, we will rely on client-side counting of a fetched sample for the *chart* (Period Traffic).
            // For "Total", we might just count rows as a proxy if we can't do distinct, OR if `visitor_id` is reliable, we accept that for now we only know the total of what we fetch.
            // Actually, let's fetch last 5000 analytics events. That should cover "Week/Month" traffic well. "Year" might be truncated but acceptable for dashboard v1.
            
            const { data: analyticsEvents } = await supabase
                .from("client_analytics")
                .select("timestamp, location")
                .eq("website_id", website.id)
                .order("timestamp", { ascending: false })
                .limit(5000);

            // Extract visitors with timestamps
            // Structure: location: { visitor_id: '...' }
            const visitors = (analyticsEvents || []).map(e => ({
                timestamp: e.timestamp,
                visitorId: e.location?.visitor_id || e.location?.ip || 'anon'
            }));

            // Calculate "Total Visitors" (All time estimate based on fetch limit or just rows count if we assume 1 visit = 1 row? No, 1 row = 1 pageview usually).
            // We need unique visitors from the fetched set at least.
            // A true "Total All Time" requires a count query that we can't easily do distinct on JSONB without SQL function.
            // For now, we will use the unique count from our fetched sample as "Total (in fetched history)".
            // If the user has millions, this will be wrong, but we can't solve Big Data analytics in this step without backend changes (e.g. creating a `visitors` table or SQL view).
            // We will proceed with the "Best Effort" unique count from the 5000 rows.
            const uniqueVisitorsAllTime = new Set(visitors.map(v => v.visitorId)).size;

            // --- 5. Calculate Metrics ---
            const now = new Date();
            const thirtyDaysAgo = subDays(now, 30);
            const sixtyDaysAgo = subDays(now, 60);

            const currentPeriodOrders = enrichedOrders.filter(o => {
                const d = new Date(o.created_at);
                return isAfter(d, thirtyDaysAgo) && isBefore(d, now);
            });
            const priorPeriodOrders = enrichedOrders.filter(o => {
                const d = new Date(o.created_at);
                return isAfter(d, sixtyDaysAgo) && isBefore(d, thirtyDaysAgo);
            });

            const currentSales = currentPeriodOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
            const priorSales = priorPeriodOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
            const salesChange = calculateChange(currentSales, priorSales);

            const getUnits = (periodOrders) => {
                const periodOrderIds = new Set(periodOrders.map(o => o.id));
                return enrichedItems
                    .filter(item => periodOrderIds.has(item.order_id))
                    .reduce((sum, item) => sum + item.quantity, 0);
            };
            const currentUnits = getUnits(currentPeriodOrders);
            const priorUnits = getUnits(priorPeriodOrders);
            const unitsChange = calculateChange(currentUnits, priorUnits);

            const currentAOV = currentPeriodOrders.length ? (currentSales / currentPeriodOrders.length) : 0;
            const priorAOV = priorPeriodOrders.length ? (priorSales / priorPeriodOrders.length) : 0;
            const aovChange = calculateChange(currentAOV, priorAOV);

            setMetrics({
                sales: { value: currentSales, change: salesChange },
                units: { value: currentUnits, change: unitsChange },
                aov: { value: currentAOV, change: aovChange }
            });

            setData({ 
                orders: enrichedOrders, 
                orderItems: enrichedItems, 
                customers: customers || [],
                visitors: visitors,
                totalVisitorsCount: uniqueVisitorsAllTime 
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
         {/* Traffic Growth (Renamed from User Growth) */}
         <div className="h-[400px]">
             <UserGrowthChart 
                 visitors={data.visitors} 
                 totalVisitorsCount={data.totalVisitorsCount} 
             />
         </div>

         {/* Top 3 Best Sellers */}
         <BestSellers orderItems={data.orderItems} />

      
      </div>
    </div>
  );
}
