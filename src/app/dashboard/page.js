"use client";
import React, { useState, useEffect } from "react";
import { Search, Upload, Coins, ShoppingBag, DollarSign, Filter, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { subDays, isAfter, isBefore } from "date-fns";
import Fuse from "fuse.js";

import StatCard from "../../components/dashboard/StatCard";
import RecentSalesTable from "../../components/dashboard/RecentSalesTable";
import UserGrowthChart from "../../components/dashboard/UserGrowthChart";
import BestSellers from "../../components/dashboard/BestSellers";
import ExportModal from "../../components/dashboard/ExportModal";
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton";

export default function DashboardPage() {
    const [greeting, setGreeting] = useState('Good Morning');
    const [loading, setLoading] = useState(true);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [ownerName, setOwnerName] = useState("");

    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [timeFilter, setTimeFilter] = useState("30"); // days: 7, 30, 90

    const [metrics, setMetrics] = useState({
        sales: { value: 0, change: 0, trend: 'neutral' },
        units: { value: 0, change: 0, trend: 'neutral' },
        aov: { value: 0, change: 0, trend: 'neutral' }
    });
    const [data, setData] = useState({
        orders: [],
        orderItems: [],
        customers: [],
        visitors: [],
        totalVisitorsCount: 0
    });
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setGreeting('Good Morning');
        else if (hour >= 12 && hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
        
        // Cache Check
        const cachedName = localStorage.getItem('bizvistar_owner_name');
        if (cachedName) setOwnerName(cachedName);

        fetchCoreData();
    }, []);

    // Filter Logic (Search)
    useEffect(() => {
        if (!data.orders.length) {
            setFilteredOrders([]);
            return;
        }

        if (!searchQuery.trim()) {
            setFilteredOrders(data.orders);
            return;
        }

        const fuse = new Fuse(data.orders, {
            keys: [
                "id",
                "customers.name",
                "total_amount",
                "status"
            ],
            threshold: 0.3
        });

        const result = fuse.search(searchQuery);
        setFilteredOrders(result.map(r => r.item));
    }, [searchQuery, data.orders]);

    // Recalculate Metrics based on Time Filter
    useEffect(() => {
        if (!data.orders.length) return;

        const now = new Date();
        const days = parseInt(timeFilter);
        const currentPeriodStart = subDays(now, days);
        const priorPeriodStart = subDays(now, days * 2);
        const priorPeriodEnd = currentPeriodStart;

        const currentPeriodOrders = data.orders.filter(o => {
            const d = new Date(o.created_at);
            return isAfter(d, currentPeriodStart) && isBefore(d, now);
        });
        const priorPeriodOrders = data.orders.filter(o => {
            const d = new Date(o.created_at);
            return isAfter(d, priorPeriodStart) && isBefore(d, priorPeriodEnd);
        });

        const currentSales = currentPeriodOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
        const priorSales = priorPeriodOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
        const salesChange = calculateChange(currentSales, priorSales);

        const getUnits = (periodOrders) => {
            const periodOrderIds = new Set(periodOrders.map(o => o.id));
            return data.orderItems
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

    }, [timeFilter, data.orders, data.orderItems]);


    const fetchCoreData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: website } = await supabase
                .from("websites")
                .select("id")
                .eq("user_id", user.id)
                .eq("is_published", true)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (!website) {
                setLoading(false);
                setAnalyticsLoading(false);
                return;
            }

            // Parallel Request: Core Data
            const [onboardingRes, ordersRes] = await Promise.all([
                supabase
                    .from("onboarding_data")
                    .select("owner_name")
                    .eq("website_id", website.id)
                    .maybeSingle(),
                supabase
                    .from("orders")
                    .select("*")
                    .eq("website_id", website.id)
                    .neq("status", "canceled")
                    .order("created_at", { ascending: false })
                    .limit(500)
            ]);

            // Handle Onboarding
            if (onboardingRes.data?.owner_name) {
                setOwnerName(onboardingRes.data.owner_name);
                localStorage.setItem('bizvistar_owner_name', onboardingRes.data.owner_name);
            }

            const orders = ordersRes.data || [];
            if (ordersRes.error) console.error("Orders Error:", ordersRes.error);

            // Fetch Related Data for Orders
            const orderIds = orders.map(o => o.id);
            const customerIds = [...new Set(orders.map(o => o.customer_id).filter(Boolean))];

            const [
                { data: customersRes },
                { data: itemsRes }
            ] = await Promise.all([
                 customerIds.length > 0 ? supabase.from('customers').select('*').in('id', customerIds) : Promise.resolve({ data: [] }),
                 orderIds.length > 0 ? supabase.from('order_items').select('*').in('order_id', orderIds) : Promise.resolve({ data: [] })
            ]);

            const customers = customersRes || [];
            let items = itemsRes || [];

            const productIds = [...new Set(items.map(i => i.product_id))];
            const { data: products } = productIds.length > 0 
                ? await supabase.from('products').select('id, name, image_url, price').in('id', productIds)
                : { data: [] };
            
            const productsMap = (products || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
            const customersMap = (customers || []).reduce((acc, c) => ({ ...acc, [c.id]: c }), {});

            const enrichedOrders = orders.map(o => ({
                ...o,
                customers: customersMap[o.customer_id] || { name: 'Unknown', email: '' }
            }));

            const ordersDateMap = orders.reduce((acc, o) => ({...acc, [o.id]: o.created_at}), {});
            
            const enrichedItems = items.map(i => ({
                ...i,
                products: productsMap[i.product_id],
                orders: { created_at: ordersDateMap[i.order_id] } 
            }));

            // Set Initial Core Data
            setData(prev => ({
                ...prev,
                orders: enrichedOrders,
                orderItems: enrichedItems,
                customers: customers || []
            }));
            setFilteredOrders(enrichedOrders);

            // Core Data Loaded - Hide Skeleton
            setLoading(false);

            // Start Analytics Fetch (Non-blocking)
            fetchAnalyticsData(website.id);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setLoading(false);
            setAnalyticsLoading(false);
        }
    };

    const fetchAnalyticsData = async (websiteId) => {
        setAnalyticsLoading(true);
        try {
            // Optimized: Fetch fewer rows, select only needed columns
            const { data: analyticsEvents } = await supabase
                .from("client_analytics")
                .select("timestamp, location")
                .eq("website_id", websiteId)
                .order("timestamp", { ascending: false })
                .limit(2000); // Reduced from 5000 to 2000 for performance balance

            const visitors = (analyticsEvents || []).map(e => ({
                timestamp: e.timestamp,
                visitorId: e.location?.visitor_id || e.location?.ip || 'anon'
            }));

            const uniqueVisitorsAllTime = new Set(visitors.map(v => v.visitorId)).size;

            setData(prev => ({
                ...prev,
                visitors: visitors,
                totalVisitorsCount: uniqueVisitorsAllTime 
            }));

        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setAnalyticsLoading(false);
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

  if (loading) {
      return <DashboardSkeleton />;
  }

  return (
    <div className="font-sans not-italic pb-8">
      <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-4">

        {/* 1. Header Section (Title + Controls) */}
        <div className="col-span-1 md:col-span-4 order-1 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#111] not-italic">{greeting}, {ownerName || 'Owner'}!</h1>
            <p className="mt-1 text-sm md:text-base text-gray-500 font-sans not-italic">Here's what's happening with your store today.</p>
          </div>

          {/* Controls: Search, Export, Filter */}
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto relative">
             <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders..."
                  className="h-10 w-full md:w-64 rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2]"
                />
             </div>

             {/* Export Button */}
             <button
               onClick={() => setIsExportModalOpen(true)}
               className="flex h-10 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-3 md:px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 font-sans not-italic shrink-0"
             >
                <Upload className="h-4 w-4" />
                <span className="hidden md:inline">Export CSV</span>
             </button>

             {/* Filter Button */}
             <div className="relative">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`h-[38px] w-[38px] flex items-center justify-center rounded-full transition-all shrink-0 ${isFilterOpen ? 'bg-[#8A63D2] text-white' : 'bg-[#EEE5FF] text-[#8A63D2] hover:bg-[#dcd0f5]'}`}
                >
                    {isFilterOpen ? <X size={18} /> : <Filter size={18} />}
                </button>

                {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                        <div className="p-2">
                            <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Time Period</p>
                            {[
                                { val: "7", label: "Last 7 Days" },
                                { val: "30", label: "Last 30 Days" },
                                { val: "90", label: "Last 3 Months" }
                            ].map(opt => (
                                <button
                                    key={opt.val}
                                    onClick={() => { setTimeFilter(opt.val); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors ${timeFilter === opt.val ? 'text-purple-600 font-bold bg-purple-50' : 'text-gray-700'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
             </div>
          </div>
        </div>

        {/* 2. Top Metrics Cards (Horizontally Scrollable on Mobile) */}
        <div className="col-span-1 md:col-span-4 order-2">
            <div className="flex overflow-x-auto gap-3 py-4 md:grid md:grid-cols-3 md:gap-6 md:py-0 snap-x hide-scrollbar no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                <div className="min-w-[80vw] md:min-w-0 snap-center">
                    <StatCard
                    title="Sales"
                    value={formatCurrency(metrics.sales.value)}
                    change={`${metrics.sales.change.toFixed(1)}%`}
                    period={`vs. prior ${timeFilter} days`}
                    icon={Coins}
                    />
                </div>
                <div className="min-w-[80vw] md:min-w-0 snap-center">
                    <StatCard
                    title="Units"
                    value={formatNumber(metrics.units.value)}
                    change={`${metrics.units.change.toFixed(1)}%`}
                    period={`vs. prior ${timeFilter} days`}
                    icon={ShoppingBag}
                    />
                </div>
                <div className="min-w-[80vw] md:min-w-0 snap-center">
                    <StatCard
                    title="Average Order Value"
                    value={formatCurrency(metrics.aov.value)}
                    change={`${metrics.aov.change.toFixed(1)}%`}
                    period={`vs. prior ${timeFilter} days`}
                    icon={DollarSign}
                    />
                </div>
            </div>
        </div>

        {/* 3. Sidebar Content (Traffic & Best Sellers) */}
        {/* Mobile: Order 3 (Before Recent Sales), In one line (Grid cols 2) */}
        {/* Desktop: Order 4 (Right Sidebar), Stacked (Flex col) */}
        <div className="col-span-1 md:col-span-1 order-3 md:order-4 grid grid-cols-2 gap-3 md:flex md:flex-col md:gap-8">
             {/* Traffic Growth */}
             <div className="h-[250px] md:h-[400px]">
                 <UserGrowthChart
                     visitors={data.visitors}
                     totalVisitorsCount={data.totalVisitorsCount}
                     isLoading={analyticsLoading}
                 />
             </div>

             {/* Top 3 Best Sellers */}
             <div className="h-[250px] md:h-full md:flex-1">
                <BestSellers orderItems={data.orderItems} />
             </div>
        </div>

        {/* 4. Recent Sales Table */}
        {/* Mobile: Order 4 (Last) */}
        {/* Desktop: Order 3 (Left Main Col, Span 3) */}
        <div className="col-span-1 md:col-span-3 order-4 md:order-3">
            <RecentSalesTable orders={filteredOrders} isSearching={searchQuery.length > 0} />
        </div>

      </div>

      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
}
