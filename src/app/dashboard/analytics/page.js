/* TODO: 12%
vs last period is hardcoded make it correct make the ui better add location data cards something like state wise order top 3 or 5, make ui of cards better */
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
  AlertCircle,
  CreditCard,
  MousePointerClick
} from "lucide-react";
import AnalyticsOverview from "@/components/dashboard/analytics/AnalyticsOverview";
import RevenueChart from "@/components/dashboard/analytics/RevenueChart";
import VisitorsChart from "@/components/dashboard/analytics/VisitorsChart";
import TopProducts from "@/components/dashboard/analytics/TopProducts";
import TopPages from "@/components/dashboard/analytics/TopPages";
import FunnelChart from "@/components/dashboard/analytics/FunnelChart";

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
    avgOrderValue: 0,
    revenueData: [],
    visitorsData: [],
    topProducts: [],
    topPages: [],
    funnelData: []
  });

  const dropdownRef = useRef(null);

  useEffect(() => {
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
        .select("id, site_slug")
        .eq("user_id", user.id)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (siteError) {
        console.error("Error fetching website:", JSON.stringify(siteError));
        setError("Failed to load website data.");
        setLoading(false);
        return;
      }

      if (!website) {
        setLoading(false);
        return;
      }

      // Date Calculation
      const now = new Date();
      let startDate = new Date();
      if (dateRange === "7d") startDate.setDate(now.getDate() - 7);
      if (dateRange === "30d") startDate.setDate(now.getDate() - 30);
      if (dateRange === "90d") startDate.setDate(now.getDate() - 90);
      if (dateRange === "year") startDate.setFullYear(now.getFullYear(), 0, 1);

      const startDateISO = startDate.toISOString();

      const [ordersRes, eventsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("id, total_amount, created_at")
          .eq("website_id", website.id)
          .gte("created_at", startDateISO)
          .neq("status", "canceled"),

        supabase
          .from("client_analytics")
          .select("event_type, timestamp, location, path")
          .eq("website_id", website.id)
          .gte("timestamp", startDateISO)
      ]);

      const orders = ordersRes.data || [];
      const events = eventsRes.data || [];

      // Fetch Order Items
      let orderItems = [];
      const orderIds = orders.map(o => o.id);
      if (orderIds.length > 0) {
        const { data: items } = await supabase
          .from("order_items")
          .select("quantity, products(name)")
          .in("order_id", orderIds);
        orderItems = items || [];
      }

      // --- Calculations ---

      // 1. Totals
      const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
      const totalOrders = orders.length;
      const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

      // 2. Unique Visitors (Overall)
      const uniqueVisitors = new Set();
      events.forEach(e => {
        const vid = e.location?.visitor_id || e.location?.ip;
        if (vid) uniqueVisitors.add(vid);
      });
      const totalVisitors = uniqueVisitors.size || (events.length > 0 ? Math.ceil(events.length / 2) : 0);
      const conversionRate = totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(1) : "0.0";

      // 3. Funnel Logic
      // We need unique visitors for specific paths.
      // Normalize paths: remove /site/slug prefix if present
      const cleanPath = (p) => {
          if (!p) return '/';
          let cleaned = p;
          if (website.site_slug) {
             cleaned = cleaned.replace(`/site/${website.site_slug}`, '');
             cleaned = cleaned.replace(`/templates/${website.template_id}`, ''); // Just in case
          }
          if (cleaned === '') return '/';
          return cleaned;
      };

      const funnelSets = {
          home: new Set(),
          shop: new Set(),
          checkout: new Set(),
          purchase: new Set() // Actually purchase count is orders, but unique buyers? Let's use orders count for purchase step simplicity or unique order emails if available.
          // For simplicity, Purchase count = totalOrders.
      };

      events.forEach(e => {
          const vid = e.location?.visitor_id || e.location?.ip || 'anon';
          const path = cleanPath(e.path);

          if (path === '/' || path === '') funnelSets.home.add(vid);
          if (path.includes('shop') || path.includes('product')) funnelSets.shop.add(vid); // Assuming product page counts as shopping intent
          if (path.includes('checkout')) funnelSets.checkout.add(vid);
      });

      const funnelData = [
          { name: 'Home View', value: funnelSets.home.size, fill: '#8A63D2' },
          { name: 'Product/Shop', value: funnelSets.shop.size, fill: '#A0C4FF' },
          { name: 'Checkout', value: funnelSets.checkout.size, fill: '#FFB74D' },
          { name: 'Purchase', value: totalOrders, fill: '#4CAF50' }
      ];

      // 4. Grouping for Charts
      const groupByDate = (items, dateKey, valueKey = null, count = false) => {
        const map = {};
        const d = new Date(startDate);
        const end = new Date();
        while (d <= end) {
            const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            map[key] = 0;
            d.setDate(d.getDate() + 1);
        }
        items.forEach(item => {
            const itemDate = new Date(item[dateKey]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (map[itemDate] !== undefined) {
                if (count) map[itemDate] += 1;
                else map[itemDate] += (Number(item[valueKey]) || 0);
            }
        });
        return Object.keys(map).map(date => ({ date, value: map[date] }));
      };

      const revenueData = groupByDate(orders, 'created_at', 'total_amount');
      const visitorsData = groupByDate(events, 'timestamp', null, true);

      // 5. Top Products
      const productMap = {};
      orderItems.forEach(item => {
        const name = item.products?.name || "Unknown Product";
        productMap[name] = (productMap[name] || 0) + item.quantity;
      });
      const topProducts = Object.entries(productMap)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      // 6. Top Pages (Cleaned)
      const pageMap = {};
      events.forEach(e => {
         const path = cleanPath(e.path);
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
        avgOrderValue,
        revenueData,
        visitorsData,
        topProducts,
        topPages,
        funnelData
      });

    } catch (err) {
      console.error("Analytics Error:", err);
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
                            onClick={() => { setDateRange(key); setIsDropdownOpen(false); }}
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
             aov={data.avgOrderValue}
           />

           {/* Charts Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RevenueChart data={data.revenueData} />
              <VisitorsChart data={data.visitorsData} />
           </div>

           {/* Funnel & Lists Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-3">
                    <FunnelChart data={data.funnelData} />
               </div>
               <div className="lg:col-span-1.5">
                    <TopProducts products={data.topProducts} />
               </div>
               <div className="lg:col-span-1.5">
                    <TopPages pages={data.topPages} />
               </div>
           </div>
           {/* Adjusted layout: Funnel full width, lists below? Or Funnel side?
               Let's make funnel full width or 2/3.
               Actually user asked for "more analytics".
               Let's put Funnel on its own row.
           */}
        </>
      )}
    </div>
  );
}