'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { 
  ChevronDown, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Truck, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Package,
  Eye,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams } from 'next/navigation';
import OrderDetailsDrawer from '@/components/dashboard/OrderDetailsDrawer';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

// --- Main Content Component (with Suspense logic) ---
function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [businessName, setBusinessName] = useState('Us');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('id');

  const fetchOrders = async () => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; 

    // Fetch website and slug
    const { data: website } = await supabase
        .from('websites')
        .select('id, site_slug')
        .eq('user_id', user.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!website) {
        setLoading(false);
        return;
    }

    // Fetch business name from onboarding
    const { data: onboarding } = await supabase
        .from('onboarding_data')
        .select('owner_name')
        .eq('website_id', website.id)
        .maybeSingle();

    setBusinessName(onboarding?.owner_name || website.site_slug || 'Us');

    try {
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('website_id', website.id)
            .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        
        if (!orders || orders.length === 0) {
            setOrders([]);
            setLoading(false);
            return;
        }

        const orderIds = orders.map(o => o.id);
        const customerIds = [...new Set(orders.map(o => o.customer_id).filter(Boolean))];

        const [
            { data: customers },
            { data: deliveries },
            { data: items }
        ] = await Promise.all([
             customerIds.length > 0 ? supabase.from('customers').select('*').in('id', customerIds) : Promise.resolve({ data: [] }),
             supabase.from('deliveries').select('*').in('order_id', orderIds),
             supabase.from('order_items').select('*').in('order_id', orderIds)
        ]);

        const productIds = [...new Set((items || []).map(i => i.product_id))];
        const { data: products } = productIds.length > 0 
            ? await supabase.from('products').select('id, name, image_url').in('id', productIds)
            : { data: [] };

        const customersMap = (customers || []).reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
        const productsMap = (products || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
        
        const deliveriesMap = (deliveries || []).reduce((acc, d) => {
            if (!acc[d.order_id]) acc[d.order_id] = [];
            acc[d.order_id].push(d);
            return acc;
        }, {});

        const itemsMap = (items || []).reduce((acc, i) => {
            if (!acc[i.order_id]) acc[i.order_id] = [];
            acc[i.order_id].push({ ...i, products: productsMap[i.product_id] });
            return acc;
        }, {});

        const merged = orders.map(o => ({
            ...o,
            customers: customersMap[o.customer_id] || { name: 'Unknown', email: '' },
            order_items: itemsMap[o.id] || [],
            deliveries: deliveriesMap[o.id] || [],
            logistics: deliveriesMap[o.id]?.[0] ? {
                provider: deliveriesMap[o.id][0].provider,
                trackingNumber: deliveriesMap[o.id][0].tracking_number,
                date: deliveriesMap[o.id][0].created_at
            } : null
        }));

        setOrders(merged);

        // Handle URL param or re-selection
        if (initialOrderId) {
            const preSelected = merged.find(o => o.id.toString() === initialOrderId);
            if (preSelected) setSelectedOrder(preSelected);
        } else if (selectedOrder) {
            const updatedSelected = merged.find(o => o.id === selectedOrder.id);
            if (updatedSelected) setSelectedOrder(updatedSelected);
        }

    } catch (e) {
        console.error("Orders Fetch Error:", JSON.stringify(e));
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Run on mount

  // --- Filtering & Searching Logic ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
        // 1. Search Query
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            order.id.toString().includes(query) ||
            order.customers?.name?.toLowerCase().includes(query) ||
            order.customers?.email?.toLowerCase().includes(query);

        // 2. Status Filter
        const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const getStatusStyle = (status) => {
    const styles = {
        delivered: "bg-green-50 text-green-600 border border-green-100",
        shipped: "bg-blue-50 text-blue-600 border border-blue-100",
        pending: "bg-yellow-50 text-yellow-600 border border-yellow-100",
        canceled: "bg-red-50 text-red-600 border border-red-100",
        paid: "bg-teal-50 text-teal-600 border border-teal-100"
    };
    return styles[status.toLowerCase()] || "bg-gray-50 text-gray-600";
  };

  return (
    <div className="h-full flex flex-col font-sans">

      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-4 md:mb-8 px-0 md:px-0">

        {/* Row 1: Title (Left) + Filter (Right) */}
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-500 mt-1 text-sm md:text-base hidden md:block">Manage and track your customer orders.</p>
            </div>

            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className={`flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-all shadow-sm ${statusFilter !== 'all' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                        <Filter className="h-4 w-4" />
                        {statusFilter === 'all' ? 'Filter' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content className="min-w-[150px] bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-100" align="end">
                        {['all', 'pending', 'paid', 'shipped', 'delivered', 'canceled'].map((status) => (
                            <DropdownMenu.Item
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer outline-none ${statusFilter === status ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <span className="capitalize">{status}</span>
                                {statusFilter === status && <CheckCircle size={14} />}
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>

        {/* Row 2: Search Input (Full Width on Mobile) */}
        <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-sm"
            />
        </div>

      </div>

      {/* Table Container: STRICT Edge-to-Edge on Mobile */}
      {/* Remove padding, margin, borders, radius for mobile */}
      <div className="flex-1 bg-white md:rounded-2xl shadow-sm md:border border-gray-200 overflow-hidden flex flex-col -mx-4 md:mx-0 border-y border-gray-100 md:border-0">
        <div className="w-full">
            <table className="w-full text-left border-collapse table-auto">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="hidden md:table-cell py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                        <th className="py-4 pl-4 md:px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
                        <th className="py-4 px-2 md:px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                        <th className="py-4 px-2 md:px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="hidden md:table-cell py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                        <th className="py-4 pr-4 md:px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        [1, 2, 3, 4, 5].map((i) => (
                            <tr key={i}>
                                <td colSpan="6" className="p-4 md:px-6">
                                    <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse"></div>
                                </td>
                            </tr>
                        ))
                    ) : filteredOrders.length === 0 ? (
                        <tr><td colSpan="6" className="p-12 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Search className="text-gray-300 h-8 w-8" />
                                <p>No orders found matching your filters.</p>
                                {(searchQuery || statusFilter !== 'all') && (
                                    <button
                                        onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                                        className="text-sm text-purple-600 font-bold hover:underline"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </td></tr>
                    ) : (
                        filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group text-[11px] md:text-sm">
                                <td className="hidden md:table-cell py-4 px-6 font-bold text-gray-900 text-sm align-middle">
                                    #{order.id}
                                </td>
                                <td className="py-4 pl-4 md:px-6 text-gray-500 align-middle">
                                    <span className="block font-medium text-gray-900 md:text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                                    <span className="text-[10px] md:text-xs text-gray-400 block">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </td>
                                <td className="py-4 px-2 md:px-6 font-medium text-gray-900 align-middle">
                                    {order.customers?.name || 'Guest'}
                                </td>
                                <td className="py-4 px-2 md:px-6 align-middle">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] md:text-xs font-bold ${getStatusStyle(order.status)} whitespace-nowrap`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="hidden md:table-cell py-4 px-6 text-sm font-bold text-gray-900 align-middle">₹{order.total_amount}</td>
                                <td className="py-4 pr-4 md:px-6 text-right align-middle">
                                    <button 
                                        onClick={() => setSelectedOrder(order)}
                                        className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 md:px-4 text-[10px] md:text-xs font-bold text-purple-600 hover:bg-purple-500 hover:text-white transition-colors"
                                    >
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <OrderDetailsDrawer
        isOpen={!!selectedOrder} 
        order={selectedOrder} 
        businessName={businessName}
        onClose={() => {
            setSelectedOrder(null);
        }} 
        onUpdate={fetchOrders}
      />
    </div>
  );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading orders module...</div>}>
            <OrdersContent />
        </Suspense>
    );
}
