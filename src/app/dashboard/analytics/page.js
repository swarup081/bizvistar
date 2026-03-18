"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AlertCircle } from "lucide-react";
import SearchFilterHeader from "@/components/dashboard/analytics/SearchFilterHeader";
import AnalyticsOverview from "@/components/dashboard/analytics/AnalyticsOverview";
import RevenueChart from "@/components/dashboard/analytics/RevenueChart";
import AIPredictionCard from "@/components/dashboard/analytics/AIPredictionCard";
import TopCategoriesChart from "@/components/dashboard/analytics/TopCategoriesChart";
import ActiveUsersStateChart from "@/components/dashboard/analytics/ActiveUsersStateChart";
import FunnelChart from "@/components/dashboard/analytics/FunnelChart";
import MonthlyTargetCard from "@/components/dashboard/analytics/MonthlyTargetCard";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("30d");
  const [websiteId, setWebsiteId] = useState(null);

  const [data, setData] = useState({
    totalRevenue: 0,
    prevRevenue: 0,
    totalOrders: 0,
    prevOrders: 0,
    totalVisitors: 0,
    prevVisitors: 0,
    revenueData: [],
    topCategories: [],
    totalSales: 0,
    activeUsersState: [],
    totalActiveUsers: 0,
    funnelData: []
  });

  useEffect(() => {
    if (!supabase) {
      setError("Configuration Error: Missing Supabase client.");
      setLoading(false);
      return;
    }
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setLoading(false);
        return;
      }

      const { data: website, error: siteError } = await supabase
        .from("websites")
        .select("id, site_slug, template_id")
        .eq("user_id", user.id)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (siteError || !website) {
        setLoading(false);
        return;
      }

      setWebsiteId(website.id);

      // Date Calculation (Current Period vs Previous Period)
      const now = new Date();
      let startDate = new Date();
      let prevStartDate = new Date();
      let prevEndDate = new Date();

      if (dateRange === "7d") {
        startDate.setDate(now.getDate() - 7);
        prevStartDate.setDate(startDate.getDate() - 7);
        prevEndDate = new Date(startDate);
      } else if (dateRange === "30d") {
        startDate.setDate(now.getDate() - 30);
        prevStartDate.setDate(startDate.getDate() - 30);
        prevEndDate = new Date(startDate);
      } else if (dateRange === "90d") {
        startDate.setDate(now.getDate() - 90);
        prevStartDate.setDate(startDate.getDate() - 90);
        prevEndDate = new Date(startDate);
      } else if (dateRange === "year") {
        startDate.setFullYear(now.getFullYear(), 0, 1);
        prevStartDate.setFullYear(now.getFullYear() - 1, 0, 1);
        prevEndDate.setFullYear(now.getFullYear(), 0, 1);
      }

      const startDateISO = startDate.toISOString();
      const prevStartDateISO = prevStartDate.toISOString();
      const prevEndDateISO = prevEndDate.toISOString();

      // Fetch ALL orders and events from prevStartDate to now
      const [allOrdersRes, allEventsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("id, total_amount, created_at, status")
          .eq("website_id", website.id)
          .gte("created_at", prevStartDateISO)
          .neq("status", "canceled"),

        supabase
          .from("client_analytics")
          .select("event_type, timestamp, location, path")
          .eq("website_id", website.id)
          .gte("timestamp", prevStartDateISO)
      ]);

      const allOrders = allOrdersRes.data || [];
      const allEvents = allEventsRes.data || [];

      // Split into Current and Previous Period
      const currentOrders = allOrders.filter(o => new Date(o.created_at) >= startDate);
      const prevOrdersList = allOrders.filter(o => new Date(o.created_at) >= prevStartDate && new Date(o.created_at) < prevEndDate);

      const currentEvents = allEvents.filter(e => new Date(e.timestamp) >= startDate);
      const prevEventsList = allEvents.filter(e => new Date(e.timestamp) >= prevStartDate && new Date(e.timestamp) < prevEndDate);

      // Fetch Order Items for current period only
      let orderItems = [];
      const currentOrderIds = currentOrders.map(o => o.id);
      if (currentOrderIds.length > 0) {
        const { data: items } = await supabase
          .from("order_items")
          .select("quantity, price, products(category_id)")
          .in("order_id", currentOrderIds);
        orderItems = items || [];
      }

      const { data: categories } = await supabase
          .from("categories")
          .select("id, name")
          .eq("website_id", website.id);
      const categoriesMap = {};
      (categories || []).forEach(c => { categoriesMap[c.id] = c.name; });

      // --- Calculations ---

      // 1. Totals
      const totalRevenue = currentOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
      const prevRevenue = prevOrdersList.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
      const totalOrdersCount = currentOrders.length;
      const prevOrdersCount = prevOrdersList.length;

      // 2. Visitors
      const uniqueVisitors = new Set();
      currentEvents.forEach(e => {
        const vid = e.location?.visitor_id || e.location?.ip;
        if (vid) uniqueVisitors.add(vid);
      });
      const totalVisitors = uniqueVisitors.size || (currentEvents.length > 0 ? Math.ceil(currentEvents.length / 2) : 0);

      const prevUniqueVisitors = new Set();
      prevEventsList.forEach(e => {
        const vid = e.location?.visitor_id || e.location?.ip;
        if (vid) prevUniqueVisitors.add(vid);
      });
      const prevVisitors = prevUniqueVisitors.size || (prevEventsList.length > 0 ? Math.ceil(prevEventsList.length / 2) : 0);

      // 3. Funnel Logic
      const cleanPath = (p) => {
          if (!p) return '/';
          let cleaned = p;
          if (website.site_slug) {
             cleaned = cleaned.replace(`/site/${website.site_slug}`, '');
             cleaned = cleaned.replace(`/templates/${website.template_id}`, '');
          }
          if (cleaned === '') return '/';
          return cleaned;
      };

      const funnelSets = {
          product: new Set(),
          addToCart: new Set(),
          checkout: new Set(),
      };

      currentEvents.forEach(e => {
          const vid = e.location?.visitor_id || e.location?.ip || 'anon';
          const path = cleanPath(e.path);
          if (path.includes('shop') || path.includes('product')) funnelSets.product.add(vid);
          if (e.event_type === 'add_to_cart') funnelSets.addToCart.add(vid);
          if (path.includes('checkout')) funnelSets.checkout.add(vid);
      });

      const productViews = Math.max(funnelSets.product.size, 0);
      const addCarts = Math.max(funnelSets.addToCart.size, 0);
      const checkouts = Math.max(funnelSets.checkout.size, 0);
      const purchases = totalOrdersCount;
      const abandonedEstimate = Math.max(0, addCarts - purchases);

      const funnelData = [
          { name: 'Product Views', value: productViews, fill: '#F5F3FF' },
          { name: 'Add to Cart', value: addCarts, fill: '#EDE9FE' },
          { name: 'Proceed to Checkout', value: checkouts, fill: '#DDD6FE' },
          { name: 'Completed Purchases', value: purchases, fill: '#C4B5FD' },
          { name: 'Abandoned Carts', value: abandonedEstimate, fill: '#A78BFA' }
      ];

      // 4. Grouping for Charts
      const groupByDate = (items, dateKey, valueKey = null, count = false) => {
        const map = {};
        const d = new Date(startDate);
        const end = new Date();
        while (d <= end) {
            const key = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            map[key] = 0;
            d.setDate(d.getDate() + 1);
        }
        items.forEach(item => {
            const itemDate = new Date(item[dateKey]).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            if (map[itemDate] !== undefined) {
                if (count) map[itemDate] += 1;
                else map[itemDate] += (Number(item[valueKey]) || 0);
            }
        });
        return Object.keys(map).map(date => ({ date, value: map[date] }));
      };

      const revenueData = groupByDate(currentOrders, 'created_at', 'total_amount');

      // 5. Top Categories
      const catSales = {};
      let totalSalesCalculated = 0;
      orderItems.forEach(item => {
          const catId = item.products?.category_id;
          const catName = catId ? categoriesMap[catId] || 'Uncategorized' : 'Uncategorized';
          const salesVal = item.quantity * item.price;
          catSales[catName] = (catSales[catName] || 0) + salesVal;
          totalSalesCalculated += salesVal;
      });

      let topCategories = Object.entries(catSales)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

      // 6. Active Users by State
      const stateMap = {};
      let totalStateUsers = 0;
      currentEvents.forEach(e => {
         const state = e.location?.region;
         if (state) {
             stateMap[state] = (stateMap[state] || 0) + 1;
             totalStateUsers++;
         }
      });

      let sortedStates = Object.entries(stateMap)
         .map(([state, users]) => ({ state, users }))
         .sort((a, b) => b.users - a.users);

      // Top 4 states, group the rest into "Other"
      let activeUsersState = [];
      if (sortedStates.length > 4) {
          activeUsersState = sortedStates.slice(0, 4);
          const otherUsers = sortedStates.slice(4).reduce((sum, s) => sum + s.users, 0);
          if (otherUsers > 0) {
              activeUsersState.push({ state: 'Other', users: otherUsers });
          }
      } else {
          activeUsersState = sortedStates;
      }

      setData({
        totalRevenue,
        prevRevenue,
        totalOrders: totalOrdersCount,
        prevOrders: prevOrdersCount,
        totalVisitors,
        prevVisitors,
        revenueData,
        topCategories,
        totalSales: totalSalesCalculated,
        activeUsersState,
        totalActiveUsers: totalStateUsers,
        funnelData
      });

    } catch (err) {
      console.error("Analytics Error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-[#333] pb-12 w-full max-w-[1600px] mx-auto px-4 md:px-8 mt-4">
      <SearchFilterHeader dateRange={dateRange} setDateRange={setDateRange} />

      {error ? (
         <div className="rounded-2xl bg-red-50 p-6 flex items-center gap-4 text-red-700 border border-red-100 w-full">
            <AlertCircle />
            <p>{error}</p>
         </div>
      ) : loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3 w-full">
             <div className="w-8 h-8 border-4 border-purple-200 border-t-[#8A63D2] rounded-full animate-spin"></div>
             <p className="text-sm font-medium">Loading analytics...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full overflow-hidden">
           <AnalyticsOverview
             revenue={data.totalRevenue}
             prevRevenue={data.prevRevenue}
             orders={data.totalOrders}
             prevOrders={data.prevOrders}
             visitors={data.totalVisitors}
             prevVisitors={data.prevVisitors}
             dateRange={dateRange}
           />

           {/* Second Row Grid: Revenue (2), Monthly Target (1), Top Categories (1) */}
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2 min-w-0">
                 <RevenueChart data={data.revenueData} />
              </div>
              <div className="lg:col-span-1 min-w-0">
                 <MonthlyTargetCard websiteId={websiteId} currentRevenue={data.totalRevenue} />
              </div>
              <div className="lg:col-span-1 min-w-0">
                 <TopCategoriesChart data={data.topCategories} totalSales={data.totalSales} />
              </div>
           </div>

           {/* Third Row Grid: Active Users (1), Funnel (2), AI Card (1) */}
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
               <div className="lg:col-span-1 min-w-0">
                    <ActiveUsersStateChart data={data.activeUsersState} totalUsers={data.totalActiveUsers} />
               </div>
               <div className="lg:col-span-2 min-w-0">
                    <FunnelChart data={data.funnelData} />
               </div>
               <div className="lg:col-span-1 min-w-0">
                    <AIPredictionCard websiteId={websiteId} />
               </div>
           </div>
        </div>
      )}
    </div>
  );
}
