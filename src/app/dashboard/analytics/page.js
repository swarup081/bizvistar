"use client";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  Calendar,
  ArrowUp,
  ArrowDown,
  Globe,
  ChevronDown,
  AlertCircle
} from "lucide-react";
import AnalyticsOverview from "@/components/dashboard/analytics/AnalyticsOverview";
import RevenueChart from "@/components/dashboard/analytics/RevenueChart";
import VisitorsChart from "@/components/dashboard/analytics/VisitorsChart";
import TopProducts from "@/components/dashboard/analytics/TopProducts";
import TopPages from "@/components/dashboard/analytics/TopPages";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("30d");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalVisitors: 0,
    conversionRate: 0,
    revenueData: [],
    visitorsData: [],
    topProducts: [],
    topPages: [],
  });

  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdown on outside click
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!supabase) {
      console.error("Supabase client not initialized.");
      setError("Configuration Error: Missing Supabase client.");
      setLoading(false);
      return;
    }
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    console.log("--- Starting Analytics Fetch ---");
    console.log("Date Range:", dateRange);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.warn("User not authenticated or auth error:", authError);
        // In a real app, maybe redirect. Here just stop.
        setLoading(false);
        return;
      }
      console.log("User ID:", user.id);

      const { data: website, error: siteError } = await supabase
        .from("websites")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (siteError) {
        console.error("Error fetching website:", JSON.stringify(siteError));
        setError("Failed to load website data.");
        setLoading(false);
        return;
      }

      if (!website) {
        console.warn("No website found for user.");
        setLoading(false); // Render empty state
        return;
      }
      console.log("Website ID:", website.id);

      // Date Calculation
      const now = new Date();
      let startDate = new Date();
      if (dateRange === "7d") startDate.setDate(now.getDate() - 7);
      if (dateRange === "30d") startDate.setDate(now.getDate() - 30);
      if (dateRange === "90d") startDate.setDate(now.getDate() - 90);
      if (dateRange === "year") startDate.setFullYear(now.getFullYear(), 0, 1); // This Year

      const startDateISO = startDate.toISOString();
      console.log("Fetching data since:", startDateISO);

      // Parallel Fetch
      const [ordersRes, eventsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("id, total_amount, created_at, status")
          .eq("website_id", website.id)
          .gte("created_at", startDateISO)
          .neq("status", "canceled"),

        supabase
          .from("client_analytics")
          .select("id, event_type, timestamp, location, path")
          .eq("website_id", website.id)
          .gte("timestamp", startDateISO)
      ]);

      if (ordersRes.error) console.error("Error fetching orders:", ordersRes.error);
      if (eventsRes.error) console.error("Error fetching events:", eventsRes.error);

      const orders = ordersRes.data || [];
      const events = eventsRes.data || [];

      console.log(`Fetched ${orders.length} orders and ${events.length} events.`);

      // Fetch Order Items
      let orderItems = [];
      const orderIds = orders.map(o => o.id);
      if (orderIds.length > 0) {
        const { data: items, error: itemsError } = await supabase
          .from("order_items")
          .select("quantity, price, products(name)")
          .in("order_id", orderIds);

        if (itemsError) console.error("Error fetching items:", itemsError);
        orderItems = items || [];
      }

      // Calculations
      const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
      const totalOrders = orders.length;

      const uniqueVisitors = new Set();
      events.forEach(e => {
        if (e.location && e.location.visitor_id) {
          uniqueVisitors.add(e.location.visitor_id);
        } else if (e.location && e.location.ip) {
          uniqueVisitors.add(e.location.ip);
        }
      });
      // Fallback logic
      const totalVisitors = uniqueVisitors.size || (events.length > 0 ? Math.ceil(events.length / 2) : 0);

      const conversionRate = totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(1) : "0.0";

      // Grouping
      const groupByDate = (items, dateKey, valueKey = null, count = false) => {
        const map = {};
        const d = new Date(startDate);
        // Ensure we cover up to today
        const end = new Date();

        while (d <= end) {
            const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            map[key] = 0;
            d.setDate(d.getDate() + 1);
        }

        items.forEach(item => {
            const itemDate = new Date(item[dateKey]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            // Only add if key exists (within range) - safe check
            if (map[itemDate] !== undefined) {
                if (count) map[itemDate] += 1;
                else map[itemDate] += (Number(item[valueKey]) || 0);
            }
        });
        return Object.keys(map).map(date => ({ date, value: map[date] }));
      };

      const revenueData = groupByDate(orders, 'created_at', 'total_amount');
      const visitorsData = groupByDate(events, 'timestamp', null, true);

      // Top Products
      const productMap = {};
      orderItems.forEach(item => {
        const name = item.products?.name || "Unknown Product";
        productMap[name] = (productMap[name] || 0) + item.quantity;
      });
      const topProducts = Object.entries(productMap)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      // Top Pages
      const pageMap = {};
      events.forEach(e => {
         const path = e.path || '/';
         pageMap[path] = (pageMap[path] || 0) + 1;
      });
      const topPages = Object.entries(pageMap)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      setData({
        totalRevenue,
        totalOrders,
        totalVisitors,
        conversionRate,
        revenueData,
        visitorsData,
        topProducts,
        topPages
      });

    } catch (err) {
      console.error("Critical Analytics Error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const rangeLabels = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
    'year': 'This Year'
  };

  return (
    <div className="flex flex-col gap-8 font-sans text-[#333] pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Monitor your store's performance and visitor stats.</p>
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
               <Calendar size={16} className="text-gray-500"/>
               {rangeLabels[dateRange]}
               <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden">
                    {Object.keys(rangeLabels).map((key) => (
                        <button
                            key={key}
                            onClick={() => {
                                setDateRange(key);
                                setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                dateRange === key ? 'text-[#8A63D2] font-medium bg-purple-50' : 'text-gray-700'
                            }`}
                        >
                            {rangeLabels[key]}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      {error ? (
         <div className="rounded-2xl bg-red-50 p-6 flex items-center gap-4 text-red-700 border border-red-100">
            <AlertCircle />
            <p>{error}</p>
         </div>
      ) : loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3">
             <div className="w-8 h-8 border-4 border-purple-200 border-t-[#8A63D2] rounded-full animate-spin"></div>
             <p className="text-sm font-medium">Loading analytics...</p>
        </div>
      ) : (
        <>
           <AnalyticsOverview
             revenue={data.totalRevenue}
             orders={data.totalOrders}
             visitors={data.totalVisitors}
             conversion={data.conversionRate}
           />

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RevenueChart data={data.revenueData} />
              <VisitorsChart data={data.visitorsData} />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TopProducts products={data.topProducts} />
              <TopPages pages={data.topPages} />
           </div>
        </>
      )}
    </div>
  );
}
