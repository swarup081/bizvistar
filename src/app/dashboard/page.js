"use client";
import React, { useState, useEffect } from "react";
import { Search, Upload, Coins, ShoppingBag, DollarSign, Filter } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { subDays, isAfter, isBefore, startOfMonth, subMonths, endOfMonth, startOfYear, startOfWeek } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";

import StatCard from "../../components/dashboard/StatCard";
import RecentSalesTable from "../../components/dashboard/RecentSalesTable";
import UserGrowthChart from "../../components/dashboard/UserGrowthChart";
import BestSellers from "../../components/dashboard/BestSellers";

// --- Skeleton Components ---
const StatCardSkeleton = () => (
    <div className="rounded-2xl bg-white p-6 shadow-sm h-[180px] animate-pulse flex flex-col justify-between">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        <div>
            <div className="h-8 w-32 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const ChartSkeleton = () => (
    <div className="rounded-2xl bg-white p-6 shadow-sm h-[400px] animate-pulse">
        <div className="flex justify-between mb-6">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-[300px] w-full bg-gray-100 rounded-full"></div>
    </div>
);

const TableSkeleton = () => (
    <div className="rounded-2xl bg-white p-6 shadow-sm h-full animate-pulse">
        <div className="flex justify-between mb-6">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 w-full bg-gray-100 rounded"></div>
            ))}
        </div>
    </div>
);

export default function DashboardPage() {
    const [greeting, setGreeting] = useState('Good Morning');
    const [userName, setUserName] = useState('Owner');
    const [loading, setLoading] = useState(true);

    // Global Filter State (for Top Metrics)
    const [globalFilter, setGlobalFilter] = useState('month'); // week, month, year
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [metrics, setMetrics] = useState({
        sales: { value: 0, change: 0 },
        units: { value: 0, change: 0 },
        aov: { value: 0, change: 0 }
    });
    const [data, setData] = useState({
        orders: [],
        orderItems: [],
        customers: [],
        visitors: [],
        totalVisitorsCount: 0
    });

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState({ orders: [], products: [] });
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setGreeting('Good Morning');
        else if (hour >= 12 && hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        fetchDashboardData();
    }, []);

    // Effect to recalculate metrics when Global Filter changes
    useEffect(() => {
        if (data.orders.length > 0) {
            calculateMetrics(data.orders, data.orderItems, globalFilter);
        }
    }, [globalFilter, data.orders]);

    // Debounced Search Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim().length > 1) {
                performSearch(searchQuery);
            } else {
                setSearchResults({ orders: [], products: [] });
                setIsSearchOpen(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, data.orders, data.orderItems]);

    const performSearch = (query) => {
        const lowerQuery = query.toLowerCase();

        // Search Orders (ID, Customer Name)
        const matchedOrders = data.orders.filter(o =>
            o.id.toString().includes(lowerQuery) ||
            o.customers?.name?.toLowerCase().includes(lowerQuery)
        ).slice(0, 5);

        // Search Products (Name in Order Items -> Product Name)
        const uniqueProducts = new Map();
        data.orderItems.forEach(item => {
            if (item.products?.name?.toLowerCase().includes(lowerQuery)) {
                uniqueProducts.set(item.products.id, item.products);
            }
        });
        const matchedProducts = Array.from(uniqueProducts.values()).slice(0, 5);

        setSearchResults({ orders: matchedOrders, products: matchedProducts });
        setIsSearchOpen(true);
    };

    const handleExport = () => {
        const now = new Date();
        const startOfLastMonth = startOfMonth(subMonths(now, 1));
        const endOfLastMonth = endOfMonth(subMonths(now, 1));

        // Filter Data
        const exportOrders = data.orders.filter(o => {
            const d = new Date(o.created_at);
            return isAfter(d, startOfLastMonth) && isBefore(d, endOfLastMonth);
        });

        const exportOrderIds = new Set(exportOrders.map(o => o.id));
        const exportItems = data.orderItems.filter(i => exportOrderIds.has(i.order_id));

        // PDF Generation
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Orders Report`, 14, 22);
        doc.setFontSize(11);
        doc.text(`${startOfLastMonth.toLocaleDateString()} - ${endOfLastMonth.toLocaleDateString()}`, 14, 30);

        const tableColumn = ["Order ID", "Customer", "Products", "Total", "Courier"];
        const tableRows = [];

        exportOrders.forEach(order => {
            const orderProducts = exportItems
                .filter(i => i.order_id === order.id)
                .map(i => i.products?.name || "Unknown")
                .join(", ");

            const courier = "Standard";

            const orderData = [
                order.id,
                order.customers?.name || "Guest",
                orderProducts,
                formatCurrency(order.total_amount),
                courier
            ];
            tableRows.push(orderData);
        });

        // Use autoTable correctly
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
        });

        doc.addPage();
        doc.setFontSize(18);
        doc.text(`Product Analytics`, 14, 22);
        doc.setFontSize(11);
        doc.text(`(Based on Last Month's Sales)`, 14, 30);

        const productStats = {};
        exportItems.forEach(item => {
            const pid = item.product_id;
            const pName = item.products?.name || "Unknown";
            const price = item.products?.price || 0;

            if (!productStats[pid]) {
                productStats[pid] = { name: pName, price: price, quantity: 0, revenue: 0 };
            }
            productStats[pid].quantity += item.quantity;
            productStats[pid].revenue += (item.quantity * item.price);
        });

        const productColumns = ["Product Name", "Unit Price", "Quantity Sold", "Revenue"];
        const productRows = Object.values(productStats).map(p => [
            p.name,
            formatCurrency(p.price),
            p.quantity,
            formatCurrency(p.revenue)
        ]);

        autoTable(doc, {
            head: [productColumns],
            body: productRows,
            startY: 40,
        });

        doc.save(`report-${startOfLastMonth.toLocaleDateString('en-CA')}.pdf`);
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Set User Name
            const name = user.user_metadata?.full_name || user.user_metadata?.name || 'Owner';
            setUserName(name);

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

            // 1. Fetch Orders
            const { data: orders, error: ordersError } = await supabase
                .from("orders")
                .select("*")
                .eq("website_id", website.id)
                .neq("status", "canceled")
                .order("created_at", { ascending: false })
                .limit(1000);

            if (ordersError) throw ordersError;

            // 2. Fetch Related Order Data
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

            // 3. Fetch Products
            const productIds = [...new Set(items.map(i => i.product_id))];
            const { data: products } = productIds.length > 0
                ? await supabase.from('products').select('id, name, image_url, price').in('id', productIds)
                : { data: [] };

            const productsMap = (products || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
            const customersMap = (customers || []).reduce((acc, c) => ({ ...acc, [c.id]: c }), {});

            // Join Data
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

            // 4. Fetch Traffic (Visitors)
            const { data: analyticsEvents } = await supabase
                .from("client_analytics")
                .select("timestamp, location")
                .eq("website_id", website.id)
                .order("timestamp", { ascending: false })
                .limit(10000);

            const visitors = (analyticsEvents || []).map(e => ({
                timestamp: e.timestamp,
                visitorId: e.location?.visitor_id || e.location?.ip || 'anon'
            }));

            const uniqueVisitorsAllTime = new Set(visitors.map(v => v.visitorId)).size;

            // 5. Initial Metrics Calculation (Default: month)
            calculateMetrics(enrichedOrders, enrichedItems, 'month');

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

    const calculateMetrics = (orders, items, period) => {
        const now = new Date();
        let currentStart, priorStart, priorEnd;

        // Define periods based on filter
        if (period === 'week') {
            currentStart = subDays(now, 7);
            priorEnd = subDays(now, 7);
            priorStart = subDays(now, 14);
        } else if (period === 'month') {
            currentStart = subDays(now, 30);
            priorEnd = subDays(now, 30);
            priorStart = subDays(now, 60);
        } else { // year
            currentStart = startOfYear(now);
            priorEnd = startOfYear(now);
            priorStart = startOfYear(subDays(startOfYear(now), 1)); // Roughly prev year
        }

        const currentPeriodOrders = orders.filter(o => {
            const d = new Date(o.created_at);
            return isAfter(d, currentStart) && isBefore(d, now);
        });
        const priorPeriodOrders = orders.filter(o => {
            const d = new Date(o.created_at);
            return isAfter(d, priorStart) && isBefore(d, priorEnd);
        });

        const currentSales = currentPeriodOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
        const priorSales = priorPeriodOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
        const salesChange = calculateChange(currentSales, priorSales);

        const getUnits = (periodOrders) => {
            const periodOrderIds = new Set(periodOrders.map(o => o.id));
            return items
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

    const filterLabels = {
        week: "This Week",
        month: "This Month",
        year: "This Year"
    };

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-4 font-sans not-italic" onClick={() => { setIsSearchOpen(false); setIsFilterOpen(false); }}>
      {/* Left Column (Main Content) */}
      <div className="xl:col-span-3 flex flex-col gap-8">
        {/* Greeting & Controls */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
          <h1 className="text-2xl font-bold text-[#111] not-italic">{greeting}, {loading ? '...' : userName}!</h1>
          <p className="mt-1 text-gray-500 font-sans not-italic">Here's what's happening with your store today.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <div className="relative" onClick={e => e.stopPropagation()}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if(searchQuery.length > 1) setIsSearchOpen(true); }}
                  placeholder="Search orders, products..."
                  className="h-10 w-64 rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2]"
                />

                {/* Search Results Dropdown */}
                {isSearchOpen && (searchResults.orders.length > 0 || searchResults.products.length > 0) && (
                    <div className="absolute top-12 left-0 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                        {searchResults.orders.length > 0 && (
                            <div className="p-2">
                                <h4 className="text-xs font-bold text-gray-400 uppercase px-2 mb-1">Orders</h4>
                                {searchResults.orders.map(o => (
                                    <Link key={o.id} href={`/dashboard/orders?id=${o.id}`} className="block px-2 py-2 hover:bg-purple-50 rounded-lg">
                                        <p className="text-sm font-bold text-gray-800">Order #{o.id}</p>
                                        <p className="text-xs text-gray-500">{o.customers?.name}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                        {searchResults.products.length > 0 && (
                            <div className="p-2 border-t border-gray-50">
                                <h4 className="text-xs font-bold text-gray-400 uppercase px-2 mb-1">Products</h4>
                                {searchResults.products.map(p => (
                                    <Link key={p.id} href={`/dashboard/products?id=${p.id}`} className="block px-2 py-2 hover:bg-purple-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            {p.image_url && <img src={p.image_url} className="h-6 w-6 rounded object-cover" />}
                                            <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
             </div>

             {/* Export Button - Reverted UI */}
             <button
                onClick={handleExport}
                className="flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 font-sans not-italic"
             >
                <Upload className="h-4 w-4" />
                Export PDF
             </button>

             {/* Global Filter Button */}
             <div className="relative" onClick={e => e.stopPropagation()}>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="h-[38px] w-[38px] flex items-center justify-center bg-[#EEE5FF] text-[#8A63D2] rounded-full hover:bg-[#dcd0f5] transition-all"
                >
                    <Filter size={18} />
                </button>
                {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden">
                        {Object.keys(filterLabels).map((key) => (
                            <button
                                key={key}
                                onClick={() => { setGlobalFilter(key); setIsFilterOpen(false); }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                    globalFilter === key ? 'text-[#8A63D2] font-medium bg-purple-50' : 'text-gray-700'
                                }`}
                            >
                                {filterLabels[key]}
                            </button>
                        ))}
                    </div>
                )}
             </div>
          </div>
        </div>

        {/* Top Metrics Cards */}
        {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard
                title="Sales"
                value={formatCurrency(metrics.sales.value)}
                change={`${metrics.sales.change.toFixed(1)}%`}
                period={`vs. prior ${globalFilter}`}
                icon={Coins}
                />
                <StatCard
                title="Units"
                value={formatNumber(metrics.units.value)}
                change={`${metrics.units.change.toFixed(1)}%`}
                period={`vs. prior ${globalFilter}`}
                icon={ShoppingBag}
                />
                <StatCard
                title="Average Order Value"
                value={formatCurrency(metrics.aov.value)}
                change={`${metrics.aov.change.toFixed(1)}%`}
                period={`vs. prior ${globalFilter}`}
                icon={DollarSign}
                />
            </div>
        )}

        {/* Recent Sales Table */}
        {loading ? <TableSkeleton /> : <RecentSalesTable orders={data.orders} />}
      </div>

      {/* Right Column (Sidebar) */}
      <div className="xl:col-span-1 flex flex-col gap-8">
         {/* Traffic Growth */}
         <div className="h-[400px]">
             {loading ? <ChartSkeleton /> : (
                 <UserGrowthChart
                    visitors={data.visitors}
                    totalVisitorsCount={data.totalVisitorsCount}
                 />
             )}
         </div>

         {/* Top 3 Best Sellers */}
         {loading ? <TableSkeleton /> : <BestSellers orderItems={data.orderItems} />}
      </div>
    </div>
  );
}
